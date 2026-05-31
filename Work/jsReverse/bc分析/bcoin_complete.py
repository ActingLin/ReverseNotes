"""
Bcoin (温度币) 完整请求脚本
基于 libns.so 逆向分析

算法总结:
1. salt = random(0-9)
2. time = int(time.time() * 1000)
3. sign = s(time + salt + methodName)
   - s() 函数根据 idxMethod % 3 选择:
     - 0: 'b' + cxor(token, data) (小写)
     - 1: 'C' + axor(token, data) (大写)
     - 2: 'd' + jointMd5(token, data) (MD5)
"""

import hashlib
import random
import time
import requests
from typing import Optional
import json


class BcoinSigner:
    """Bcoin 签名生成器"""

    def __init__(self, token: str):
        self.token = token
        self.idx_method = 0  # idxMethod 计数器

    def _axor(self, a: str, b: str) -> str:
        """axor: result[i] = chr((a[i] ^ b[i]) % 26 + 'A') - 大写"""
        min_len = min(len(a), len(b))
        return ''.join(chr((ord(a[i]) ^ ord(b[i])) % 26 + ord('A')) for i in range(min_len))

    def _cxor(self, a: str, b: str) -> str:
        """cxor: result[i] = chr((a[i] ^ b[i]) % 26 + 'a') - 小写"""
        min_len = min(len(a), len(b))
        return ''.join(chr((ord(a[i]) ^ ord(b[i])) % 26 + ord('a')) for i in range(min_len))

    def _chain_xor(self, a: str, b: str) -> str:
        """chainXor: 链式 XOR"""
        min_len = min(len(a), len(b))
        if min_len == 0:
            return ''
        result = [chr((ord(a[0]) ^ min_len) % 26 + ord('a'))]
        for i in range(1, min_len):
            result.append(chr((ord(a[i]) ^ ord(result[-1])) % 26 + ord('a')))
        return ''.join(result)

    def _joint_md5(self, data: str) -> str:
        """jointMd5: MD5 变换"""
        return hashlib.md5((self.token + data).encode()).hexdigest().upper()

    def _s_encrypt(self, data: str) -> str:
        """S.s() 函数: 根据 idxMethod % 3 选择变换"""
        remainder = self.idx_method % 3
        if remainder == 0:
            return 'b' + self._cxor(self.token, data)
        elif remainder == 1:
            return 'C' + self._axor(self.token, data)
        else:
            return 'd' + self._joint_md5(data)

    def generate_sign(self, time_str: str, salt: str, method: str) -> str:
        """生成签名"""
        sign = self._s_encrypt(time_str + salt + method)
        self.idx_method += 1
        return sign


class BcoinRequest:
    """Bcoin API 请求"""

    BASE_URL = "https://i.bicoin.com.cn"

    HEADERS = {
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
    }

    def __init__(self, token: str):
        self.token = token
        self.signer = BcoinSigner(token)

    def _make_headers(self, sign: str, salt: str, time_str: str) -> dict:
        """构造请求头"""
        headers = self.HEADERS.copy()
        headers['salt'] = salt
        headers['sign'] = sign
        headers['time'] = time_str
        headers['token'] = self.token
        headers['usertempid'] = ''
        return headers

    def get_user_account_info(self, user_id: str) -> dict:
        """获取用户账户信息"""
        url = f"{self.BASE_URL}/firmOffer/getUserAccountInfoBySecretNew"
        salt = str(random.randint(0, 9))
        time_str = str(int(time.time() * 1000))
        sign = self.signer.generate_sign(time_str, salt, "getUserAccountInfoBySecretNew")

        params = {
            'salt': salt,
            'sign': sign,
            'time': time_str,
            'userId': user_id,
        }
        headers = self._make_headers(sign, salt, time_str)

        response = requests.get(url, headers=headers, params=params)
        return response.json()

    def get_positions(self, user_id: str) -> dict:
        """获取持仓信息"""
        url = f"{self.BASE_URL}/firmOffer/positionsBySecretNew"
        salt = str(random.randint(0, 9))
        time_str = str(int(time.time() * 1000))
        sign = self.signer.generate_sign(time_str, salt, "positionsBySecretNew")

        params = {
            'salt': salt,
            'sign': sign,
            'time': time_str,
            'userId': user_id,
        }
        headers = self._make_headers(sign, salt, time_str)

        response = requests.get(url, headers=headers, params=params)
        return response.json()

    def get_statistics(self, user_id: str) -> dict:
        """获取统计信息"""
        url = f"{self.BASE_URL}/lrBigVIndex/firmOffer/getUserStatisticsInfoBySecretNew"
        salt = str(random.randint(0, 9))
        time_str = str(int(time.time() * 1000))
        sign = self.signer.generate_sign(time_str, salt, "getUserStatisticsInfoBySecretNew")

        params = {
            'salt': salt,
            'sign': sign,
            'time': time_str,
            'userId': user_id,
        }
        headers = self._make_headers(sign, salt, time_str)

        response = requests.get(url, headers=headers, params=params)
        return response.json()


class BcoinDecryptor:
    """Bcoin 响应解密"""

    # 解密使用 MD5(token) 作为密钥和IV (IDA逆向分析确认)

    @staticmethod
    def decrypt(data: str, token: str) -> Optional[str]:
        """AES/CBC/PKCS5Padding 解密 - 使用 MD5(token) 作为密钥和IV"""
        try:
            from Crypto.Cipher import AES
            import base64
            import hashlib

            key = hashlib.md5(token.encode()).digest()  # 16 bytes raw
            iv = hashlib.md5(token.encode()).digest()   # same 16 bytes
            cipher = AES.new(key, AES.MODE_CBC, iv)
            decrypted = cipher.decrypt(base64.b64decode(data))
            # 移除 PKCS5 padding
            pad_len = decrypted[-1]
            if 1 <= pad_len <= 16:
                decrypted = decrypted[:-pad_len]
            return decrypted.decode('utf-8')
        except ImportError:
            print("需要安装 pycryptodome: pip install pycryptodome")
            return None
        except Exception as e:
            print(f"解密失败: {e}")
            return None


def test_signature():
    """测试签名生成"""
    print("=== 签名测试 ===")

    token = "53cb9738897f7c965512b9844b826325"
    signer = BcoinSigner(token)

    # 使用 curl 中的数据
    time_str = "1779607564394"
    salt = "5"
    method = "getUserAccountInfoBySecretNew"

    # 手动设置 idx 以匹配 curl 的结果
    signer.idx_method = 1  # idx=1 使用 axor (大写)
    sign = signer.generate_sign(time_str, salt, method)

    expected = "CEEGNPHENONERDIQFNSOJQQNJNXISXPGM"
    print(f"生成的签名: {sign}")
    print(f"期望的签名: {expected}")
    print(f"匹配: {sign == expected}")


def example_usage():
    """示例用法"""
    print("\n=== 示例用法 ===")

    # 替换为你的 token 和 userId
    token = "YOUR_TOKEN_HERE"
    user_id = "YOUR_USER_ID"

    client = BcoinRequest(token)

    # 获取用户账户信息
    print("\n获取用户账户信息...")
    result = client.get_user_account_info(user_id)
    print(f"响应: {json.dumps(result, ensure_ascii=False, indent=2)}")

    # 如果需要解密
    if 'data' in result and isinstance(result['data'], str):
        decrypted = BcoinDecryptor.decrypt(result['data'], token)
        if decrypted:
            print(f"解密后: {decrypted}")


if __name__ == "__main__":
    test_signature()
    # example_usage()
