"""
Decode a_bogus back to raw character codes to extract the 65-element core structure.
"""
import sys

S4 = "Dkdpgh2ZmsQB80/MfvV36XI1R45-WUAlEixNLwoqYTOPuzKFjJnry79HbGcaStCe"


def result_decrypt(encoded_str):
    """Reverse the result_encrypt function to get original character codes"""
    codes = []
    i = 0
    while i < len(encoded_str):
        # Each group of 4 base64 chars encodes 3 original chars
        # Extract 24-bit value from 4 base64 chars
        if i + 4 > len(encoded_str):
            break

        b0 = S4.index(encoded_str[i])
        b1 = S4.index(encoded_str[i + 1])
        b2 = S4.index(encoded_str[i + 2])
        b3 = S4.index(encoded_str[i + 3])

        n = (b0 << 18) | (b1 << 12) | (b2 << 6) | b3

        codes.append((n >> 16) & 0xFFFF)
        if i + 1 < len(encoded_str) and encoded_str[i + 1] not in ('=', None):
            codes.append((n >> 8) & 0xFF)
        if i + 2 < len(encoded_str) and encoded_str[i + 2] not in ('=', None):
            codes.append(n & 0xFF)

        i += 4

    return codes


def rc4_crypt(data_bytes, key):
    """RC4 encrypt/decrypt (symmetric)"""
    s = list(range(256))
    j = 0
    for i in range(256):
        j = (j + s[i] + key[i % len(key)]) % 256
        s[i], s[j] = s[j], s[i]

    i = j = 0
    result = []
    for byte_val in data_bytes:
        i = (i + 1) % 256
        j = (j + s[i]) % 256
        s[i], s[j] = s[j], s[i]
        t = (s[i] + s[j]) % 256
        result.append((byte_val ^ s[t]) & 0xFF)

    return result


def decode_abogus(ab_str):
    """Decode a_bogus to extract raw structure"""
    # Strip padding
    ab_str = ab_str.rstrip('=')

    # Reverse result_encrypt
    codes = result_decrypt(ab_str)
    print(f"Decoded {len(codes)} character codes")

    # string1 = first 12 codes (random)
    string1 = codes[:12]
    print(f"string1 (random): {string1}")

    # The rest is RC4 encrypted
    encrypted = codes[12:]
    print(f"encrypted portion: {len(encrypted)} bytes")

    # RC4 decrypt with key [121] ("y")
    key_bytes = [121]  # "y"
    decrypted = rc4_crypt(encrypted, key_bytes)
    print(f"decrypted: {len(decrypted)} bytes")

    # The decrypted data is: bb_array + window_env_list + checksum
    # We need to find the split point
    # bb_array has 65 or 44 elements (all ≤ 255)
    # window_env_list is browser string char codes
    # checksum is 1 byte

    # Let's show the decrypted data
    print(f"\nDecrypted data (all {len(decrypted)} bytes):")
    print(decrypted)

    # Try to find the browser string boundary
    # The browser string looks like: 49, 53, 51, 54, 124, 55, 52, 55, ...
    # which are char codes of "1536|747|1536|834|..."
    browser_start = None
    for i in range(40, min(80, len(decrypted))):
        # Check if this looks like the start of browser string char codes
        # '1' = 49, '5' = 53, '3' = 51, '6' = 54
        if (decrypted[i] in (49, 53) and
                i + 4 < len(decrypted) and
                decrypted[i + 1] in (53, 52) and
                decrypted[i + 2] in (51, 50) and
                decrypted[i + 3] in (54, 55)):
            browser_start = i
            break

    if browser_start:
        print(f"\nBrowser string starts at index {browser_start}")
        bb_array = decrypted[:browser_start - 1]  # minus checksum
        checksum = decrypted[browser_start - 1]
        browser_chars = decrypted[browser_start:]
        browser_str = ''.join(chr(c) for c in browser_chars if 32 <= c < 127)
        print(f"bb_array ({len(bb_array)} elements): {bb_array}")
        print(f"checksum: {checksum}")
        print(f"browser_string ({len(browser_chars)} chars): {browser_str}")
    else:
        print("Could not find browser string boundary")
        print(f"Last 80 bytes: {decrypted[-80:]}")
        # Try to decode the last portion as ASCII
        tail = ''.join(chr(c) if 32 <= c < 127 else f'[{c}]' for c in decrypted[-80:])
        print(f"Tail as ASCII: {tail}")

    return codes, decrypted


if __name__ == "__main__":
    # Browser a_bogus from search API (URL decoded)
    ab = sys.argv[1] if len(sys.argv) > 1 else "xXs5DzUEQqmfOdMSmCJLHHAUV2LMNTuyati/S93UtNodahtOfYPvPNbhaxoy4LLRrSBkkKI7ZxMAbdncuz7TZHrpFmpDuFkyXT2cnSso0qwda0UsEq8wCgzzwwMYlQGulQQ9i9yRls0K2DcWnNCsABV7L/vxmcEdBN37VZujT9umUWSjin/ca5JkEh0qtD=="
    decode_abogus(ab)
