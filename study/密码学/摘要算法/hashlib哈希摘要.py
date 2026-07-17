# -*- coding: utf-8 -*-
"""
MD5、SHA1、HMAC 摘要算法实现（基于 hashlib）
"""

import hashlib
import hmac


def md5(data: bytes) -> str:
    """MD5 摘要，返回 32 位小写十六进制字符串"""
    return hashlib.md5(data).hexdigest()


def sha1(data: bytes) -> str:
    """SHA1 摘要，返回 40 位小写十六进制字符串"""
    return hashlib.sha1(data).hexdigest()


def sha224(data: bytes) -> str:
    """SHA-224 摘要，返回 56 位小写十六进制字符串"""
    return hashlib.sha224(data).hexdigest()


def sha256(data: bytes) -> str:
    """SHA-256 摘要，返回 64 位小写十六进制字符串"""
    return hashlib.sha256(data).hexdigest()


def sha384(data: bytes) -> str:
    """SHA-384 摘要，返回 96 位小写十六进制字符串"""
    return hashlib.sha384(data).hexdigest()


def sha512(data: bytes) -> str:
    """SHA-512 摘要，返回 128 位小写十六进制字符串"""
    return hashlib.sha512(data).hexdigest()


def hmac_md5(key: bytes, data: bytes) -> str:
    """HMAC-MD5 消息认证码，返回 32 位小写十六进制字符串"""
    return hmac.new(key, data, hashlib.md5).hexdigest()


def hmac_sha1(key: bytes, data: bytes) -> str:
    """HMAC-SHA1 消息认证码，返回 40 位小写十六进制字符串"""
    return hmac.new(key, data, hashlib.sha1).hexdigest()


# ============================================================
# 测试
# ============================================================
if __name__ == '__main__':
    test_cases = [
        # b'',
        # b'hello',
        b'Hello, World!',
        # b'The quick brown fox jumps over the lazy dog',
    ]

    print('MD5 (32):')
    for msg in test_cases:
        h = md5(msg)
        print(f'  {h}  {len(h)}  <== {msg[:20]!r}')

    print('\nSHA1 (40):')
    for msg in test_cases:
        h = sha1(msg)
        print(f'  {h}  {len(h)}  <== {msg[:20]!r}')

    print('\nSHA224 (56):')
    for msg in test_cases:
        h = sha224(msg)
        print(f'  {h}  {len(h)}  <== {msg[:20]!r}')

    print('\nSHA256 (64):')
    for msg in test_cases:
        h = sha256(msg)
        print(f'  {h}  {len(h)}  <== {msg[:20]!r}')

    print('\nSHA384 (96):')
    for msg in test_cases:
        h = sha384(msg)
        print(f'  {h}  {len(h)}  <== {msg[:20]!r}')

    print('\nSHA512 (128):')
    for msg in test_cases:
        h = sha512(msg)
        print(f'  {h}  {len(h)}  <== {msg[:20]!r}')

    print('\nHMAC-MD5 (key=b"secret"):')
    for msg in test_cases:
        h = hmac_md5(b"secret", msg)
        print(f'  {h}  {len(h)}  <== {msg[:20]!r}')

    print('\nHMAC-SHA1 (key=b"secret"):')
    for msg in test_cases:
        h = hmac_sha1(b"secret", msg)
        print(f'  {h}  {len(h)}  <== {msg[:20]!r}')
