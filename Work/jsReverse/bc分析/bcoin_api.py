"""
Bcoin API - 完整请求和解密脚本
"""
import hashlib
import random
import time
import requests
import base64
import urllib3
from Crypto.Cipher import AES

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


# ==================== 签名算法 ====================

def axor(a: str, b: str) -> str:
    min_len = min(len(a), len(b))
    return ''.join(chr((ord(a[i]) ^ ord(b[i])) % 26 + ord('A')) for i in range(min_len))

def cxor(a: str, b: str) -> str:
    min_len = min(len(a), len(b))
    return ''.join(chr((ord(a[i]) ^ ord(b[i])) % 26 + ord('a')) for i in range(min_len))

def joint_md5(token: str, data: str) -> str:
    return hashlib.md5((token + data).encode()).hexdigest().upper()


class BcoinAPI:
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
        self.idx_method = 1  # 从1开始匹配curl

    def _s_encrypt(self, data: str) -> str:
        remainder = self.idx_method % 3
        if remainder == 0:
            return 'b' + cxor(self.token, data)
        elif remainder == 1:
            return 'C' + axor(self.token, data)
        else:
            return 'd' + joint_md5(self.token, data)

    def _generate_sign(self, time_str: str, salt: str, method: str) -> str:
        sign = self._s_encrypt(time_str + salt + method)
        self.idx_method += 1
        return sign

    def _request(self, path: str, method_name: str, params: dict = None) -> dict:
        url = f"{self.BASE_URL}{path}"
        salt = str(random.randint(0, 9))
        time_str = str(int(time.time() * 1000))
        sign = self._generate_sign(time_str, salt, method_name)

        headers = self.HEADERS.copy()
        headers.update({'salt': salt, 'sign': sign, 'time': time_str, 'token': self.token, 'usertempid': ''})

        if params is None:
            params = {}
        params.update({'salt': salt, 'sign': sign, 'time': time_str})

        resp = requests.get(url, headers=headers, params=params, verify=False)
        return resp.json()

    def get_user_account_info(self, user_id: str) -> dict:
        return self._request('/firmOffer/getUserAccountInfoBySecretNew', 'getUserAccountInfoBySecretNew', {'userId': user_id})

    # ==================== 解密 ====================

    @staticmethod
    def decrypt(data: str, token: str) -> str:
        """AES/CBC/PKCS5Padding - 使用 MD5(token) 作为密钥和IV"""
        key = hashlib.md5(token.encode()).digest()  # 16 bytes raw
        iv = hashlib.md5(token.encode()).digest()   # same 16 bytes
        cipher = AES.new(key, AES.MODE_CBC, iv)
        decrypted = cipher.decrypt(base64.b64decode(data))
        pad_len = decrypted[-1]
        if 1 <= pad_len <= 16:
            decrypted = decrypted[:-pad_len]
        return decrypted.decode('utf-8')


if __name__ == "__main__":
    TOKEN = "YOUR_TOKEN"
    USER_ID = "YOUR_USER_ID"

    api = BcoinAPI(TOKEN)
    result = api.get_user_account_info(USER_ID)
    print(f"Response: {result}")

    if result.get('data'):
        try:
            decrypted = BcoinAPI.decrypt(result['data'], TOKEN)
            print(f"Decrypted: {decrypted}")
        except:
            print("Decryption failed")
