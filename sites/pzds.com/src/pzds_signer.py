"""
pzds.com sign generator — Python + Node.js
sign:    generate_sign(body_json, method, timestamp, random) → MD5
decode__1174: NOT YET IMPLEMENTED (requires script_200.js mock fixes)

Usage:
    python pzds_signer.py

The sign is verified against browser samples (5/5 match).
decode__1174 encoding structure is documented below.
"""
import subprocess
import json
import os
import time
import random as _random

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
NODE_EXE = "node"
SIGN_SERVICE = os.path.join(SCRIPT_DIR, "sign_service.js")


def generate_sign(body: str, method: str, timestamp: str, random_str: str) -> str:
    """
    Generate pzds.com 'sign' header value.

    Args:
        body: JSON request body string
        method: HTTP method (POST/GET)
        timestamp: Unix timestamp in milliseconds (pztimestamp)
        random_str: Random number string (6 digits)

    Returns:
        32-char hex MD5 hash
    """
    result = subprocess.run(
        [NODE_EXE, SIGN_SERVICE, body, method, timestamp, random_str],
        capture_output=True, text=True, timeout=10, cwd=SCRIPT_DIR
    )
    if result.returncode != 0:
        raise RuntimeError(f"sign_service failed: {result.stderr}")
    return result.stdout.strip()


def generate_decode1174(body: str, method: str, timestamp: str, random_str: str, sign: str) -> str:
    """
    Generate pzds.com 'decode__1174' query parameter.

    NOT YET IMPLEMENTED.

    Encoding structure (from reverse engineering):
    1. ao = base64(sign) + method + "214d4f07715" + url_path + url_encode(body)
    2. Compress ao using custom LZ algorithm (function O() in script_200.js)
    3. Encode compressed data with custom base64 (function a2() in script_200.js)
    4. Join segments with '=' separator
    5. Result: "214d4f07715-" + encoded_payload

    The custom alphabet uses:
    A-Za-z0-9+/_ with '=' as segment separator

    The LZ compression uses a dictionary-based sliding window encoder.
    The custom base64 uses a 64-char alphabet with XOR against a PRNG.

    Required: script_200.js loaded in Node.js (go=790, WASM bridge).
    Current status: script loads but a4() call needs more mock fixes.
    """
    raise NotImplementedError(
        "decode__1174 encoding requires script_200.js mock fixes. "
        "See sites/pzds.com/src/notes.md for details."
    )


def test_sign():
    """Verify sign generation against browser samples."""
    test_cases = [
        # (body, method, timestamp, random, expected_sign)
        (
            '{"order":"ASC","sort":null,"page":1,"pageSize":10,"action":{"gameId":"17","merchantMark":null,"keywords":[],"searchWords":[],"searchPropertyIds":[],"recommendSearchConfigIds":[],"unionGameIds":[],"goodsSearchActions":[],"metas":{"single1":[]},"goodsCatalogueId":6,"goodsSubCatalogueIds":[],"countFlag":false,"conditionSearch":false}}',
            "POST", "1781229867900", "399483",
            "e94212db6dba8ba731dae451f0f680ab"
        ),
        (
            '{"order":"ASC","sort":null,"page":3,"pageSize":10,"action":{"gameId":"17","merchantMark":null,"keywords":[],"searchWords":[],"searchPropertyIds":[],"recommendSearchConfigIds":[],"unionGameIds":[],"goodsSearchActions":[],"metas":{"single1":[]},"goodsCatalogueId":6,"goodsSubCatalogueIds":[],"countFlag":true,"conditionSearch":false}}',
            "POST", "1781229988942", "925876",
            "ce64914b8b4b799fed9cfca097f09e74"
        ),
        (
            '{"order":"ASC","sort":null,"page":3,"pageSize":10,"action":{"gameId":"17","merchantMark":null,"keywords":[],"searchWords":[],"searchPropertyIds":[],"recommendSearchConfigIds":[],"unionGameIds":[],"goodsSearchActions":[],"metas":{"single1":[]},"goodsCatalogueId":6,"goodsSubCatalogueIds":[],"countFlag":true,"conditionSearch":false}}',
            "POST", "1781240740131", "946632",
            "c77f3dcacb2f78eec6445d0258cfabb0"
        ),
    ]

    passed = 0
    for body, method, ts, rnd, expected in test_cases:
        result = generate_sign(body, method, ts, rnd)
        match = result == expected
        if match:
            passed += 1
        print(f"  sign: {result} {'✅' if match else '❌ expected ' + expected}")

    print(f"\n  {passed}/{len(test_cases)} tests passed")
    return passed == len(test_cases)


if __name__ == "__main__":
    print("=== pzds.com Sign Generator ===\n")
    print("Testing sign generation...")
    if test_sign():
        print("\n✅ Sign generation: READY")
    else:
        print("\n❌ Sign generation: FAILED")

    print("\n--- decode__1174 ---")
    print("Status: NOT YET IMPLEMENTED")
    print("Structure: 214d4f07715-<LZ_compressed_custom_base64_payload>")
    print("Required: script_200.js (go=790) + full mock environment")
