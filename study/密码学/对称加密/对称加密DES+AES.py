# -*- coding: utf-8 -*-
"""
DES / AES 对称加密算法实现
依赖: pip install pycryptodome pyDes
"""

import base64
import binascii

from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from pyDes import des, CBC, PAD_PKCS5


# ============================================================
# DES（CBC 模式，PKCS5 填充）
# ============================================================

def des_encrypt(key: str, text: str, iv: str) -> str:
    """DES 加密，返回 hex 字符串"""
    k = des(key, CBC, iv, pad=None, padmode=PAD_PKCS5)
    en = k.encrypt(text, padmode=PAD_PKCS5)
    return binascii.b2a_hex(en).decode()


def des_decrypt(key: str, text: str, iv: str) -> str:
    """DES 解密，输入 hex 字符串，返回明文"""
    k = des(key, CBC, iv, pad=None, padmode=PAD_PKCS5)
    de = k.decrypt(binascii.a2b_hex(text), padmode=PAD_PKCS5)
    return de.decode()


# ============================================================
# AES（CBC 模式，PKCS7 填充）
# ============================================================

def aes_encrypt(plain_text: str, secret_key: str, iv: str) -> str:
    """AES 加密，返回 base64 字符串"""
    cipher = AES.new(secret_key.encode('utf-8'), AES.MODE_CBC, iv.encode('utf-8'))
    padded_data = pad(plain_text.encode('utf-8'), AES.block_size)
    encrypted = cipher.encrypt(padded_data)
    return base64.b64encode(encrypted).decode('utf-8')


def aes_decrypt(cipher_text: str, secret_key: str, iv: str) -> str:
    """AES 解密，输入 base64 字符串，返回明文"""
    cipher = AES.new(secret_key.encode('utf-8'), AES.MODE_CBC, iv.encode('utf-8'))
    encrypted_data = base64.b64decode(cipher_text)
    decrypted = cipher.decrypt(encrypted_data)
    return unpad(decrypted, AES.block_size).decode('utf-8')


# ============================================================
# 测试
# ============================================================

if __name__ == '__main__':
    # ----- DES 测试 -----
    des_key = '12345678'
    des_iv = des_key
    des_text = 'I love Python!'

    des_enc = des_encrypt(des_key, des_text, des_iv)
    des_dec = des_decrypt(des_key, des_enc, des_iv)
    print('DES 加密:', des_enc)
    print('DES 解密:', des_dec)

    print()

    # ----- AES 测试 -----
    aes_key = '1234567890123456'  # 16 字节密钥
    aes_iv = '1234567890123456'   # 16 字节初始向量
    aes_text = '这是暂未被加密的原始数据...'

    aes_enc = aes_encrypt(aes_text, aes_key, aes_iv)
    aes_dec = aes_decrypt(aes_enc, aes_key, aes_iv)
    print('AES 加密:', aes_enc)
    print('AES 解密:', aes_dec)