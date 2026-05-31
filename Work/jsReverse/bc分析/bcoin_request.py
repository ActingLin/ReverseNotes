"""
Bcoin (温度币) 请求签名生成 & 解密脚本
基于 libns.so 逆向分析

签名算法:
1. salt = random int 0-9
2. time = 当前毫秒时间戳
3. sign = s(time + salt + methodName)
   其中 s() 函数:
   - 获取 token
   - 根据 idxMethod % 3 选择变换函数
   - 返回 变换结果
"""

import hashlib
import random
import time
import requests
from typing import Tuple


# ==================== 签名算法核心 ====================

def axor(a: str, b: str) -> str:
    """
    axor 变换: result[i] = chr((ord(a[i]) ^ ord(b[i])) % 26 + ord('A'))
    产生大写字母
    """
    min_len = min(len(a), len(b))
    result = []
    for i in range(min_len):
        xor_val = ord(a[i]) ^ ord(b[i])
        result.append(chr((xor_val % 26) + ord('A')))
    return ''.join(result)


def cxor(a: str, b: str) -> str:
    """
    cxor 变换: result[i] = chr((ord(a[i]) ^ ord(b[i])) % 26 + ord('a'))
    产生小写字母
    """
    min_len = min(len(a), len(b))
    result = []
    for i in range(min_len):
        xor_val = ord(a[i]) ^ ord(b[i])
        result.append(chr((xor_val % 26) + ord('a')))
    return ''.join(result)


def chain_xor(a: str, b: str) -> str:
    """
    chainXor 变换:
    - 第一个字符: chr((ord(a[0]) ^ len(b)) % 26 + ord('a'))
    - 后续字符: chr((ord(a[i]) ^ ord(result[i-1])) % 26 + ord('a'))
    """
    min_len = min(len(a), len(b))
    if min_len == 0:
        return ''

    result = []
    # 第一个字符: a[0] XOR length_of_b
    xor_val = ord(a[0]) ^ min_len
    prev = chr((xor_val % 26) + ord('a'))
    result.append(prev)

    # 后续字符: a[i] XOR result[i-1]
    for i in range(1, min_len):
        xor_val = ord(a[i]) ^ ord(prev)
        prev = chr((xor_val % 26) + ord('a'))
        result.append(prev)

    return ''.join(result)


def joint_md5(token: str, data: str) -> str:
    """
    jointMd5 变换: 基于 MD5 的签名
    根据逆向分析，这可能是 MD5(token + data) 或类似的组合
    """
    # 常见的 jointMd5 实现方式
    combined = token + data
    return hashlib.md5(combined.encode()).hexdigest().upper()


# idxMethod 计数器 (每次调用 s() 会递增)
idx_method = 0


def get_sign_func(idx: int):
    """
    根据 idxMethod % 3 选择变换函数
    0: cxor (小写), char='b'
    1: axor (大写), char='C'
    2: jointMd5, char='d'
    """
    remainder = idx % 3
    if remainder == 0:
        return cxor, 'b'
    elif remainder == 1:
        return axor, 'C'
    else:  # remainder == 2
        return joint_md5, 'd'


def s_encrypt(token: str, data: str, idx: int = 0) -> str:
    """
    S.s() 函数: 签名生成
    """
    func, char_prefix = get_sign_func(idx)
    result = func(token, data)
    return char_prefix + result


def generate_sign(token: str, time_str: str, salt: str, method: str) -> str:
    """
    生成请求签名
    sign = s(time + salt + method)
    """
    global idx_method
    data = time_str + salt + method
    sign = s_encrypt(token, data, idx_method)
    idx_method += 1
    return sign


# ==================== 请求构造 ====================

def make_request(url: str, token: str, user_id: str, method_name: str) -> dict:
    """
    构造带签名的请求
    """
    # 生成参数
    salt = str(random.randint(0, 9))
    time_str = str(int(time.time() * 1000))
    sign = generate_sign(token, time_str, salt, method_name)

    # 构造 headers
    headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 13; zh-cn; M2012K11AC Build/TKQ1.221114.001) AppleWebKit/533.1 (KHTML, like Gecko) Version/5.0 Mobile Safari/533.1',
        'Accept': 'application/json,application/xml,application/xhtml+xml,text/html;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'accept-language': 'zh-CN,zh',
        'appversion': '4.0.3',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'from': 'Android',
        'fromandroid': 'bicoin',
        'mobilid': 'd96349a5-e680-4588-90a4-dc68c0cdf6dc',
        'mobilkey': '2CF894E76DCAE67D5E8FD6715FF98548',
        'redrisegreendown': '2',
        'salt': salt,
        'sign': sign,
        'time': time_str,
        'token': token,
        'usertempid': '',
    }

    # 构造参数
    params = {
        'salt': salt,
        'sign': sign,
        'time': time_str,
        'userId': user_id,
    }

    # 发送请求
    response = requests.get(url, headers=headers, params=params, verify=False)
    return response.json()


# ==================== 响应解密 ====================

def decrypt_response(data: str, token: str) -> str:
    """
    解密响应数据
    AES Key = MD5(token) 原始16字节
    AES IV  = MD5(token) 原始16字节 (与Key相同)
    """
    from Crypto.Cipher import AES
    import base64
    import hashlib

    try:
        key = hashlib.md5(token.encode()).digest()  # 16 bytes raw
        iv = hashlib.md5(token.encode()).digest()   # same 16 bytes
        cipher = AES.new(key, AES.MODE_CBC, iv)
        decrypted = cipher.decrypt(base64.b64decode(data))
        return decrypted.decode('utf-8')
    except Exception as e:
        print(f"解密失败: {e}")
        return ""


# ==================== 测试验证 ====================

def test_with_curl_data():
    """
    使用 curl 中的数据进行验证
    """
    # curl 中的数据
    curl_sign = "CEEGNPHENONERDIQFNSOJQQNJNXISXPGM"
    curl_time = "1779607564394"
    curl_salt = "5"
    curl_token = "53cb9738897f7c965512b9844b826325"

    print("=== 测试签名验证 ===")
    print(f"curl 数据:")
    print(f"  sign: {curl_sign}")
    print(f"  time: {curl_time}")
    print(f"  salt: {curl_salt}")
    print(f"  token: {curl_token}")

    # 尝试不同的 idx 值
    print("\n尝试不同的 idxMethod 值:")
    for idx in range(10):
        data = curl_time + curl_salt + "getUserAccountInfoBySecretNew"
        sign = s_encrypt(curl_token, data, idx)
        match = "MATCH!" if sign == curl_sign else ""
        print(f"  idx={idx}: {sign} {match}")


def example_request():
    """
    示例: 获取用户账户信息
    """
    # 替换为你的 token 和 userId
    token = "53cb9738897f7c965512b9844b826325"
    user_id = "1209735"

    url = "https://i.bicoin.com.cn/firmOffer/getUserAccountInfoBySecretNew"

    print("=== 发送请求 ===")
    result = make_request(url, token, user_id, "getUserAccountInfoBySecretNew")
    print(f"响应: {result}")

    # 如果响应是加密的，尝试解密
    if 'data' in result and isinstance(result['data'], str):
        decrypted = decrypt_response(result['data'], token)
        if decrypted:
            print(f"解密后: {decrypted}")


if __name__ == "__main__":
    # 运行测试
    test_with_curl_data()

    print("\n" + "="*50)

    # 运行示例请求 (需要先设置 token 和 userId)
    # example_request()
