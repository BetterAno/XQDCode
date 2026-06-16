"""
Node.js 桥接模块 - 通过 stdio 子进程调用 Node.js 脚本
"""
import subprocess
import json
import os
import threading
import time
from typing import Dict, Any, List, Optional


class NodeBridge:
    """Node.js 单次调用子进程桥接器"""

    def __init__(self, node_script: str):
        self.node_script = node_script
        if not os.path.exists(node_script):
            raise FileNotFoundError(f"Node.js script not found: {node_script}")

    def call(self, params: Dict[str, Any], timeout: int = 15) -> Dict[str, Any]:
        """调用 Node.js 脚本，通过 stdin 传入 JSON，stdout 接收结果"""
        input_json = json.dumps(params, ensure_ascii=False)
        try:
            proc = subprocess.run(
                ['node', self.node_script],
                input=input_json,
                capture_output=True,
                text=True,
                timeout=timeout,
                encoding='utf-8'
            )
            if proc.returncode != 0:
                raise RuntimeError(f"Node.js error (code {proc.returncode}): {proc.stderr}")
            result = json.loads(proc.stdout.strip())
            return result
        except subprocess.TimeoutExpired:
            raise RuntimeError(f"Node.js script timed out after {timeout}s")
        except json.JSONDecodeError as e:
            raise RuntimeError(f"Failed to parse Node.js output: {proc.stdout[:200]}... Error: {e}")


class JcapSession:
    """
    jcap 长生命周期补环境会话（纯 Node.js 补环境，不依赖浏览器）
    通过 node/jcap_env.js --stdio 保持进程常驻，按需发送 action 请求。

    用法:
        with JcapSession() as s:
            s.init(option={'sessionId': 'xxx', ...})
            resp = s.app_create(option, wait_ms=3000)
            # resp['captured'] 内包含拦截到的 XHR 请求（含 ct/tk/cs）
    """

    def __init__(self, node_script: Optional[str] = None, start_timeout: float = 10.0):
        if node_script is None:
            node_script = os.path.join(
                os.path.dirname(os.path.abspath(__file__)),
                '..', 'node', 'jcap_env.js'
            )
        self.node_script = os.path.abspath(node_script)
        if not os.path.exists(self.node_script):
            raise FileNotFoundError(f"jcap_env.js not found: {self.node_script}")

        self._proc: Optional[subprocess.Popen] = None
        self._lock = threading.Lock()
        self._stderr_buf: List[str] = []
        self._stderr_thread: Optional[threading.Thread] = None
        self._id_counter = 0
        self._start_timeout = start_timeout

    def get_stderr(self, filter_prefix: Optional[str] = None) -> List[str]:
        """返回截至目前的 stderr buffer。filter_prefix 用于过滤 插桩打印。"""
        buf = list(self._stderr_buf)
        if filter_prefix:
            buf = [x for x in buf if any(p in x for p in ([filter_prefix] if isinstance(filter_prefix, str) else filter_prefix))]
        return buf

    def __enter__(self):
        self.start()
        return self

    def __exit__(self, exc_type, exc, tb):
        self.close()

    def start(self):
        if self._proc is not None:
            return
        env = os.environ.copy()
        # 默认启用 patched jcap（为 get_ct_direct 暴露 globalThis.__JCAP_DEBUG_KLASS）
        env.setdefault('JCAP_PATCHED', '1')
        self._proc = subprocess.Popen(
            ['node', self.node_script, '--stdio'],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',
            bufsize=1,
            env=env,
        )

        # stderr pump
        def pump():
            assert self._proc is not None
            try:
                for line in self._proc.stderr:
                    self._stderr_buf.append(line.rstrip('\n'))
            except Exception:
                pass
        self._stderr_thread = threading.Thread(target=pump, daemon=True)
        self._stderr_thread.start()

        # 等待 jcap 就绪提示
        t0 = time.time()
        while time.time() - t0 < self._start_timeout:
            if any('jdCAP ready' in s for s in self._stderr_buf):
                return
            if self._proc.poll() is not None:
                raise RuntimeError(
                    f"jcap_env exited early ({self._proc.returncode}). stderr:\n"
                    + '\n'.join(self._stderr_buf[-30:])
                )
            time.sleep(0.05)
        raise RuntimeError(
            "jcap_env startup timeout. stderr:\n" + '\n'.join(self._stderr_buf[-30:])
        )

    def close(self):
        if self._proc is None:
            return
        try:
            if self._proc.stdin:
                self._proc.stdin.close()
        except Exception:
            pass
        try:
            self._proc.wait(timeout=3)
        except Exception:
            self._proc.kill()
        self._proc = None

    def _next_id(self) -> int:
        self._id_counter += 1
        return self._id_counter

    def _send(self, obj: Dict[str, Any], timeout: float = 30.0) -> Dict[str, Any]:
        if self._proc is None or self._proc.poll() is not None:
            raise RuntimeError("jcap_env not running")
        with self._lock:
            line = json.dumps(obj, ensure_ascii=False) + '\n'
            self._proc.stdin.write(line)  # type: ignore
            self._proc.stdin.flush()  # type: ignore
            # 读一行响应
            t0 = time.time()
            while time.time() - t0 < timeout:
                resp_line = self._proc.stdout.readline()  # type: ignore
                if not resp_line:
                    if self._proc.poll() is not None:
                        raise RuntimeError(
                            "jcap_env exited during request. stderr:\n"
                            + '\n'.join(self._stderr_buf[-30:])
                        )
                    time.sleep(0.01)
                    continue
                resp_line = resp_line.strip()
                if not resp_line:
                    continue
                return json.loads(resp_line)
            raise RuntimeError(f"jcap_env response timeout ({timeout}s)")

    # ========== 业务方法 ==========

    def init(self, info: Optional[Dict] = None, option: Optional[Dict] = None) -> Dict[str, Any]:
        """初始化 captcha 实例"""
        return self._send({
            'id': self._next_id(),
            'action': 'init',
            'info': info,
            'option': option or {},
        })

    def app_create(self, option: Dict, wait_ms: int = 3000, timeout: float = 30.0) -> Dict[str, Any]:
        """调用 instance.appCreate(option)，拦截 XHR（含 /cgi-bin/api/fp 的 body）"""
        return self._send({
            'id': self._next_id(),
            'action': 'appCreate',
            'args': [option],
            'wait': wait_ms,
        }, timeout=timeout)

    def app_check(self, option: Dict, wait_ms: int = 3000, timeout: float = 30.0) -> Dict[str, Any]:
        """调用 instance.appCheck(option)，拦截 XHR（含 /cgi-bin/api/check 的 body）"""
        return self._send({
            'id': self._next_id(),
            'action': 'appCheck',
            'args': [option],
            'wait': wait_ms,
        }, timeout=timeout)

    def get_ct_direct(self, sid: str, option: Optional[Dict] = None,
                      devc_info: Optional[str] = None,
                      timeout: float = 30.0) -> Dict[str, Any]:
        """直接用 fresh D2 生成 ct（绕开 appCreate 同步路径 ct=null 问题）。
        首次调用会自动初始化 + 热身 3.5s；后续调用直接返回。"""
        return self._send({
            'id': self._next_id(),
            'action': 'get_ct_direct',
            'sid': sid,
            'option': option or {},
            'devcInfo': devc_info,
        }, timeout=timeout)

    def get_tk_direct(self, sid: str, st: str, trajectory: str = '[]',
                      touch_list: Optional[str] = None,
                      option: Optional[Dict] = None,
                      timeout: float = 30.0) -> Dict[str, Any]:
        """直接用 fresh D2 生成 tk（滑块轨迹加密）。
        trajectory: encodeURI(JSON.stringify(trajectory))
        touchList: JSON.stringify({touchList: 'touche_message'})"""
        import json as _json
        return self._send({
            'id': self._next_id(),
            'action': 'get_tk_direct',
            'sid': sid,
            'st': st,
            'trajectory': trajectory,
            'touchList': touch_list or _json.dumps({'touchList': 'touche_message'}),
            'option': option or {},
        }, timeout=timeout)

    def get_cs_direct(self, sid: str, stack_records: Optional[str] = None,
                      option: Optional[Dict] = None,
                      timeout: float = 30.0) -> Dict[str, Any]:
        """直接用 fresh D2 生成 cs（调用栈加密）。"""
        import json as _json
        return self._send({
            'id': self._next_id(),
            'action': 'get_cs_direct',
            'sid': sid,
            'stackRecords': stack_records or _json.dumps({'rec': {}, 'filePathes': []}),
            'option': option or {},
        }, timeout=timeout)

    def reset_d_instance(self, timeout: float = 15.0) -> Dict[str, Any]:
        """重置缓存的 D 实例（session 重建时调用）。"""
        return self._send({
            'id': self._next_id(),
            'action': 'reset_d_instance',
        }, timeout=timeout)

    def get_encrypt_all(self, sid: str, st: str,
                        trajectory: str = '[]',
                        devc_info: Optional[str] = None,
                        touch_list: Optional[str] = None,
                        stack_records: Optional[str] = None,
                        option: Optional[Dict] = None,
                        timeout: float = 30.0) -> Dict[str, Any]:
        """一键生成 ct + tk + cs（用于 verify 请求）。"""
        import json as _json
        return self._send({
            'id': self._next_id(),
            'action': 'get_encrypt_all',
            'sid': sid,
            'st': st,
            'trajectory': trajectory,
            'devcInfo': devc_info,
            'touchList': touch_list or _json.dumps({'touchList': 'touche_message'}),
            'stackRecords': stack_records or _json.dumps({'rec': {}, 'filePathes': []}),
            'option': option or {},
        }, timeout=timeout)

    def call_method(self, method: str, args: Optional[List] = None,
                    wait_ms: int = 500, timeout: float = 30.0) -> Dict[str, Any]:
        """通用方法调用"""
        return self._send({
            'id': self._next_id(),
            'action': method,
            'args': args or [],
            'wait': wait_ms,
        }, timeout=timeout)

    def get_stderr_tail(self, n: int = 50) -> str:
        return '\n'.join(self._stderr_buf[-n:])


def encrypt_password(password: str, pub_key: str) -> str:
    """加密密码"""
    bridge = NodeBridge(
        os.path.join(os.path.dirname(__file__), '..', 'node', 'pwd_encrypt.js')
    )
    result = bridge.call({'password': password, 'pubKey': pub_key})
    if not result.get('success'):
        raise RuntimeError(f"Encryption failed: {result}")
    return result['encrypted']


if __name__ == '__main__':
    # 快速自检
    print('[self-test] 启动 jcap 补环境...')
    with JcapSession() as sess:
        print('[self-test] 启动成功')
        r = sess.init(option={'account': '', 'status': '1', 'appId': '1000803',
                              'sessionId': '', 'jwtToken': ''})
        print('[self-test] init.ok =', r.get('ok'))
        print('[self-test] methods =', r.get('methods'))

        test_opt = {
            'account': 'testaccount',
            'status': '1',
            'appId': '1000803',
            'sessionId': 'dcr7_gABAAAGoUilqQIAMHJmrlhIvz9RIEm-mqcPKpQfZf1PlhBCZXXrczd1TqnROY7nt1r620knAe9_wX-AsAAAAAA',
            'jwtToken': '',
            'bizSource': 'pc',
            'scene': 'login-pc',
        }
        r2 = sess.app_create(test_opt, wait_ms=3000)
        print('[self-test] appCreate.ok =', r2.get('ok'))
        print('[self-test] captured count =', len(r2.get('captured', [])))
        for c in r2.get('captured', []):
            print('    ', c.get('method'), c.get('url'))
            if c.get('body'):
                print('      body:', c['body'][:200])
