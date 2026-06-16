"""
Baxia WASM 图片解密 - Python ↔ Node.js stdio JSON-RPC 桥接

通过长驻子进程调用 node/baxia_env.js 进行 WASM 图片解密
"""

import subprocess
import json
import os
import threading
import time
import logging
from typing import Dict, Any, List, Optional

log = logging.getLogger("baxia_bridge")


class BaxiaSession:
    """
    Baxia WASM 长生命周期会话

    通过 node/baxia_env.js --stdio 保持进程常驻, 按需发送解密请求。

    用法:
        with BaxiaSession() as s:
            result = s.decrypt_batch(encrypt_token, images)
    """

    def __init__(self, node_script: Optional[str] = None, start_timeout: float = 15.0):
        if node_script is None:
            node_script = os.path.join(
                os.path.dirname(os.path.abspath(__file__)),
                '..', 'node', 'baxia_env.js'
            )
        self.node_script = os.path.abspath(node_script)
        if not os.path.exists(self.node_script):
            raise FileNotFoundError(f"baxia_env.js not found: {self.node_script}")

        self._proc: Optional[subprocess.Popen] = None
        self._lock = threading.Lock()
        self._stderr_buf: List[str] = []
        self._stderr_thread: Optional[threading.Thread] = None
        self._id_counter = 0
        self._start_timeout = start_timeout

    def __enter__(self):
        self.start()
        return self

    def __exit__(self, exc_type, exc, tb):
        self.close()

    def start(self):
        if self._proc is not None:
            return

        log.info(f"Starting baxia_env.js: {self.node_script}")
        self._proc = subprocess.Popen(
            ['node', self.node_script, '--stdio'],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8',
            bufsize=1,
        )

        def pump():
            assert self._proc is not None
            try:
                for line in self._proc.stderr:
                    self._stderr_buf.append(line.rstrip('\n'))
            except Exception:
                pass

        self._stderr_thread = threading.Thread(target=pump, daemon=True)
        self._stderr_thread.start()

        # 等待 WASM 就绪
        t0 = time.time()
        while time.time() - t0 < self._start_timeout:
            if any('Baxia WASM ready' in s for s in self._stderr_buf):
                log.info("Baxia WASM ready")
                return
            if any('WASM init failed' in s for s in self._stderr_buf):
                raise RuntimeError(
                    f"WASM init failed. stderr:\n" + '\n'.join(self._stderr_buf[-20:])
                )
            if self._proc.poll() is not None:
                raise RuntimeError(
                    f"baxia_env exited ({self._proc.returncode}). stderr:\n"
                    + '\n'.join(self._stderr_buf[-20:])
                )
            time.sleep(0.1)

        raise RuntimeError(
            "baxia_env startup timeout. stderr:\n" + '\n'.join(self._stderr_buf[-30:])
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
            raise RuntimeError("baxia_env not running")

        with self._lock:
            line = json.dumps(obj, ensure_ascii=False) + '\n'
            self._proc.stdin.write(line)
            self._proc.stdin.flush()

            t0 = time.time()
            while time.time() - t0 < timeout:
                resp_line = self._proc.stdout.readline()
                if not resp_line:
                    if self._proc.poll() is not None:
                        raise RuntimeError(
                            "baxia_env exited during request. stderr:\n"
                            + '\n'.join(self._stderr_buf[-30:])
                        )
                    time.sleep(0.01)
                    continue
                resp_line = resp_line.strip()
                if not resp_line:
                    continue
                return json.loads(resp_line)

            raise RuntimeError(f"baxia_env response timeout ({timeout}s)")

    def ping(self) -> bool:
        """测试连接"""
        resp = self._send({'id': self._next_id(), 'action': 'ping'})
        return resp.get('ok', False)

    def decrypt_image(self, encrypt_token: str, content_base64: str) -> Optional[str]:
        """
        解密单张验证码图片

        Args:
            encrypt_token: 加密 Token (从 gridClickGet 获取)
            content_base64: 图片 content 的 base64 编码

        Returns:
            解密后的 PNG base64, 失败返回 None
        """
        resp = self._send({
            'id': self._next_id(),
            'action': 'decrypt_image',
            'encryptToken': encrypt_token,
            'content': content_base64,
        })
        if resp.get('ok'):
            return resp.get('image')
        log.error(f"decrypt_image failed: {resp.get('error')}")
        return None

    def decrypt_batch(self, encrypt_token: str, images: List[dict]) -> List[Optional[str]]:
        """
        批量解密验证码图片

        Args:
            encrypt_token: 加密 Token
            images: 图片列表 [{content, imageId, index}]

        Returns:
            解密后的 PNG base64 列表 (失败项为 None)
        """
        resp = self._send({
            'id': self._next_id(),
            'action': 'decrypt_batch',
            'encryptToken': encrypt_token,
            'images': images,
        })
        if resp.get('ok'):
            return resp.get('images', [])
        log.error(f"decrypt_batch failed: {resp.get('error')}")
        return [None] * len(images)

    def get_stderr_tail(self, n: int = 50) -> str:
        return '\n'.join(self._stderr_buf[-n:])


def decrypt_images_via_wasm(encrypt_token: str, images_data: List[dict],
                             session: Optional[BaxiaSession] = None) -> List[str]:
    """
    通过 Node.js WASM 解密图片 (便捷函数)

    Args:
        encrypt_token: 加密 Token
        images_data: 图片列表 [{content, imageId, index}]
        session: 可选的复用会话

    Returns:
        解密后的 PNG base64 列表
    """
    if session:
        results = session.decrypt_batch(encrypt_token, images_data)
        return [r for r in results if r is not None]

    # 创建临时会话
    with BaxiaSession() as s:
        results = s.decrypt_batch(encrypt_token, images_data)
        return [r for r in results if r is not None]
