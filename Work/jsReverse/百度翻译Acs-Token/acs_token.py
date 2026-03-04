# -*- coding: utf-8 -*-
"""
@File    : acs_token.py
@Author  : Elliot Lin
@Date    : 2026/3/1 15:16
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import json
import random
import time
import hashlib
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad


def to_base32(n):
    """
    将整数或浮点数转换为 32 进制字符串。
    字符集：0-9, a-v (共32个字符)
    """
    if n == 0:
        return "0"

    # 定义 32 进制字符集 (0-9, a-v)
    # JS 的 toString(32) 使用的是小写字母 a-v
    digits = "0123456789abcdefghijklmnopqrstuv"

    # 处理浮点数部分 (模拟 JS Math.random().toString(32))
    # JS 逻辑：先转字符串，再解析。这里我们直接处理数值逻辑以匹配格式
    if isinstance(n, float):
        # 分离整数和小数部分
        integer_part = int(n)
        fractional_part = n - integer_part

        # 转换整数部分 (通常为 0)
        int_str = ""
        if integer_part == 0:
            int_str = "0"
        else:
            # 标准进制转换逻辑
            temp = integer_part
            res = []
            while temp > 0:
                res.append(digits[temp % 32])
                temp //= 32
            int_str = "".join(res[::-1])

        # 转换小数部分
        # JS 的 toString 对浮点数有特定的精度截断行为，这里模拟其大致行为
        frac_str = "."
        count = 0
        max_digits = 15  # JS 默认精度大约如此
        while fractional_part > 0 and count < max_digits:
            fractional_part *= 32
            digit_val = int(fractional_part)
            frac_str += digits[digit_val]
            fractional_part -= digit_val
            count += 1

        return int_str + frac_str

    # 处理整数部分 (模拟 Date.now().toString(32))
    elif isinstance(n, int):
        if n == 0:
            return "0"
        res = []
        temp = n
        while temp > 0:
            res.append(digits[temp % 32])
            temp //= 32
        return "".join(res[::-1])

    return str(n)

def generate_d0():
    # 1. 生成随机数部分 (对应 Math.random())
    rand_val = random.random()
    # 转为 32 进制字符串
    rand_str_32 = to_base32(rand_val)
    # 截取小数点后的部分 (对应 .substring(2)，去掉 "0.")
    # 注意：如果 random() 生成的是 0.xxxx，前两位是 "0."
    if rand_str_32.startswith("0."):
        part1 = rand_str_32[2:]
    else:
        # 极端情况下如果没有 "0." 前缀（极少见），则直接取
        part1 = rand_str_32.lstrip("0").lstrip(".")

    # 2. 生成时间戳部分 (对应 Date.now())
    # 获取毫秒级时间戳
    timestamp_ms = int(time.time() * 1000)
    # 转为 32 进制字符串
    part2 = to_base32(timestamp_ms)

    # 3. 拼接
    d0 = part1 + part2
    return d0

def generate_d78(d0):
    d0_sha1 = hashlib.sha1((d0 + "___false_0__0").encode()).hexdigest()
    d78 = int(d0_sha1[:4], 16)
    return d78

def generate_acs_token(ua, baiduid):

    d0 = generate_d0()
    d78 = generate_d78(d0)
    clientTs = int(time.time() * 1000)

    params = {
        # "d0": "9fa90c78jl1jik5sk2a",
        "d0": d0,
        # "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "ua": ua,
        # "baiduid": "45D7DB8B5A97F8FA3DCA3111A76EC700:SL=0:NR=10:FG=1",
        "baiduid": baiduid,
        "platform": "Win32",
        "d23": 1,
        "hfe": "",
        "d1": "",
        "d2": 0,
        "d420": 0,
        # "clientTs": 1772351279178,
        "clientTs": clientTs,
        "version": "1.4.0.3",
        "extra": "",
        "odkp": 0,
        "hf": "",
        # "d78": 49406,
        "d78": d78,
        "h0": False,
        "h1": 0
    }
    # 第一个值相对固定，今天是1772301605724
    acs_token = f"{1771493584749}_{clientTs}_{aes_cbc_encrypt(json.dumps(params))}"
    return acs_token

def aes_cbc_encrypt(plaintext, key="wsqommymucqyguwa", iv="1234567887654321"):
    """
    AES CBC 加密

    参数:
        plaintext (str/bytes): 待加密的明文
        key (str/bytes): 密钥 (必须为 16, 24, 或 32 字节)
        iv (str/bytes): 初始化向量 (必须为 16 字节)

    返回:
        str: 十六进制格式的密文
    """
    # 1. 数据预处理：转为 bytes
    if isinstance(plaintext, str):
        plaintext = plaintext.encode('utf-8')
    if isinstance(key, str):
        key = key.encode('utf-8')
    if isinstance(iv, str):
        iv = iv.encode('utf-8')

    # 2. 长度校验
    if len(key) not in (16, 24, 32):
        raise ValueError("密钥长度必须是 16, 24 或 32 字节 (对应 AES-128/192/256)")
    if len(iv) != 16:
        raise ValueError("IV 长度必须是 16 字节")

    # 3. 创建 Cipher 对象
    cipher = AES.new(key, AES.MODE_CBC, iv)

    # 4. 填充数据 (PKCS7) 并加密
    # pad 函数会自动处理补齐逻辑
    padded_data = pad(plaintext, AES.block_size)
    ciphertext = cipher.encrypt(padded_data)

    # 5. 返回结果 (通常转为 hex 或 base64，这里返回 hex)
    encoded_bytes = base64.b64encode(ciphertext)
    return encoded_bytes

def aes_cbc_decrypt(ciphertext_hex, key="wsqommymucqyguwa", iv="1234567887654321"):
    """
    AES CBC 解密 (用于验证)

    参数:
        ciphertext_hex (str): 十六进制格式的密文
        key (str/bytes): 密钥
        iv (str/bytes): 初始化向量

    返回:
        str: 解密后的明文
    """
    # 1. 数据预处理
    ciphertext = bytes.fromhex(ciphertext_hex)
    if isinstance(key, str):
        key = key.encode('utf-8')
    if isinstance(iv, str):
        iv = iv.encode('utf-8')

    # 2. 创建 Cipher 对象
    cipher = AES.new(key, AES.MODE_CBC, iv)

    # 3. 解密并去填充
    decrypted_padded = cipher.decrypt(ciphertext)
    decrypted_data = unpad(decrypted_padded, AES.block_size)

    return decrypted_data.decode('utf-8')

