# -*- coding: utf-8 -*-
"""通过 CDP 从 ads 浏览器实时拿 rednote.com 的所有 cookies (含 HttpOnly)
用法: python cdp_cookies.py
"""
import base64
import hashlib
import json
import os
import socket
import struct
import sys
import urllib.parse
import urllib.request


def pick_page_ws(browser_port: int = 52634) -> str:
    """列出所有 target, 挑一个 rednote.com 的 page ws 地址"""
    with urllib.request.urlopen(f"http://127.0.0.1:{browser_port}/json") as r:
        targets = json.loads(r.read())
    for t in targets:
        if t.get("type") == "page" and "rednote.com" in (t.get("url") or ""):
            return t["webSocketDebuggerUrl"]
    for t in targets:
        if t.get("type") == "page":
            return t["webSocketDebuggerUrl"]
    raise RuntimeError("no page target")


# ======= 手工 WebSocket 实现 (不发 Origin, 绕过 Chrome --remote-allow-origins 检查) =======
class MiniWS:
    def __init__(self, url):
        u = urllib.parse.urlparse(url)
        host = u.hostname
        port = u.port or 80
        path = u.path or "/"
        if u.query:
            path += "?" + u.query
        self.sock = socket.create_connection((host, port), timeout=10)
        key = base64.b64encode(os.urandom(16)).decode()
        req = (
            f"GET {path} HTTP/1.1\r\n"
            f"Host: {host}:{port}\r\n"
            f"Upgrade: websocket\r\n"
            f"Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            f"Sec-WebSocket-Version: 13\r\n"
            f"\r\n"
        )
        self.sock.sendall(req.encode("ascii"))
        # 读响应直到 \r\n\r\n
        buf = b""
        while b"\r\n\r\n" not in buf:
            chunk = self.sock.recv(4096)
            if not chunk:
                raise RuntimeError("ws handshake: unexpected EOF")
            buf += chunk
        header, _, rest = buf.partition(b"\r\n\r\n")
        status = header.split(b"\r\n", 1)[0].decode()
        if "101" not in status:
            raise RuntimeError(f"ws handshake failed: {status} | {header.decode(errors='replace')}")
        self._recv_buf = rest

    def send_text(self, text: str):
        data = text.encode("utf-8")
        header = bytearray()
        header.append(0x81)  # FIN + text
        n = len(data)
        mask_bit = 0x80
        if n < 126:
            header.append(mask_bit | n)
        elif n < 65536:
            header.append(mask_bit | 126)
            header += struct.pack("!H", n)
        else:
            header.append(mask_bit | 127)
            header += struct.pack("!Q", n)
        mask = os.urandom(4)
        header += mask
        masked = bytes(b ^ mask[i % 4] for i, b in enumerate(data))
        self.sock.sendall(bytes(header) + masked)

    def _recv_exact(self, n: int) -> bytes:
        while len(self._recv_buf) < n:
            chunk = self.sock.recv(max(4096, n - len(self._recv_buf)))
            if not chunk:
                raise RuntimeError("ws: EOF")
            self._recv_buf += chunk
        out = bytes(self._recv_buf[:n])
        self._recv_buf = self._recv_buf[n:]
        return out

    def recv_text(self) -> str:
        while True:
            b1b2 = self._recv_exact(2)
            b1, b2 = b1b2[0], b1b2[1]
            opcode = b1 & 0x0F
            masked = (b2 & 0x80) != 0
            plen = b2 & 0x7F
            if plen == 126:
                plen = struct.unpack("!H", self._recv_exact(2))[0]
            elif plen == 127:
                plen = struct.unpack("!Q", self._recv_exact(8))[0]
            mask_key = self._recv_exact(4) if masked else b""
            payload = self._recv_exact(plen)
            if masked:
                payload = bytes(b ^ mask_key[i % 4] for i, b in enumerate(payload))
            if opcode == 0x1:  # text
                return payload.decode("utf-8")
            # 忽略 ping/pong/binary

    def close(self):
        try:
            self.sock.close()
        except Exception:
            pass


def cdp_call(ws: MiniWS, method: str, params=None, msg_id: int = 1):
    msg = {"id": msg_id, "method": method}
    if params:
        msg["params"] = params
    ws.send_text(json.dumps(msg))
    while True:
        raw = ws.recv_text()
        j = json.loads(raw)
        if j.get("id") == msg_id:
            if "error" in j:
                raise RuntimeError(j["error"])
            return j["result"]


def get_rednote_cookies(browser_port: int = 52634):
    url = pick_page_ws(browser_port)
    ws = MiniWS(url)
    try:
        r = cdp_call(ws, "Network.getAllCookies")
        all_cks = r.get("cookies") or []
    finally:
        ws.close()
    cks = [c for c in all_cks if c.get("domain", "").endswith("rednote.com")]
    return cks


def main():
    cks = get_rednote_cookies()
    print(f"total rednote cookies: {len(cks)}")
    for c in cks:
        print(f"  {c['name']}={str(c['value'])[:40]} domain={c['domain']} path={c['path']} httpOnly={c.get('httpOnly')} secure={c.get('secure')}")
    merged = "; ".join(f"{c['name']}={c['value']}" for c in cks)
    print("\n-- merged Cookie header --")
    print(merged)


if __name__ == "__main__":
    main()
