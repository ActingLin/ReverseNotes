"""
Bcoin 完整脚本 - 签名 + 请求 + 解密
"""
import hashlib, random, time, requests, base64, sys, os
from Crypto.Cipher import AES

# ==================== 签名 ====================
def axor(a, b):
    return ''.join(chr((ord(a[i]) ^ ord(b[i])) % 26 + ord('A')) for i in range(min(len(a), len(b))))

def cxor(a, b):
    return ''.join(chr((ord(a[i]) ^ ord(b[i])) % 26 + ord('a')) for i in range(min(len(a), len(b))))

def s_func(token, data, idx):
    r = idx % 3
    if r == 0: return 'b' + cxor(token, data)
    elif r == 1: return 'C' + axor(token, data)
    else: return 'd' + hashlib.md5((token + data).encode()).hexdigest().upper()

# ==================== 请求 ====================
def make_request(token, user_id):
    url = "https://i.bicoin.com.cn/firmOffer/getUserAccountInfoBySecretNew"
    salt = str(random.randint(0, 9))
    t = str(int(time.time() * 1000))
    sign = s_func(token, t + salt + "getUserAccountInfoBySecretNew", 1)

    h = {
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 13; zh-cn; M2012K11AC Build/TKQ1.221114.001) AppleWebKit/533.1 (KHTML, like Gecko) Version/5.0 Mobile Safari/533.1',
        'Accept': 'application/json,application/xml,application/xhtml+xml,text/html;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'accept-language': 'zh-CN,zh',
        'appversion': '4.0.3',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'from': 'Android', 'fromandroid': 'bicoin',
        'mobilid': 'd96349a5-e680-4588-90a4-dc68c0cdf6dc',
        'mobilkey': '2CF894E76DCAE67D5E8FD6715FF98548',
        'redrisegreendown': '2',
        'salt': salt, 'sign': sign, 'time': t,
        'token': token, 'usertempid': '',
    }
    resp = requests.get(url, headers=h, params={'salt': salt, 'sign': sign, 'time': t, 'userId': user_id}, verify=False)
    return resp.json()

# ==================== 解密 ====================
def decrypt_aes(data, token):
    """
    AES-128-CBC 解密
    Key = MD5(token) 原始16字节
    IV  = MD5(token) 原始16字节 (与Key相同)
    """
    key = hashlib.md5(token.encode()).digest()  # 16 bytes raw
    iv = hashlib.md5(token.encode()).digest()   # same 16 bytes
    pad = 4 - len(data) % 4
    if pad != 4: data += '=' * pad
    raw = base64.b64decode(data)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    dec = cipher.decrypt(raw)
    # PKCS5 padding removal
    if 1 <= dec[-1] <= 16:
        dec = dec[:-dec[-1]]
    return dec.decode('utf-8')

if __name__ == "__main__":
    token = "53cb9738897f7c965512b9844b826325"
    # user_id = "1209735"
    user_id = "128282"

    print(f"Token: {token}")
    print(f"UserId: {user_id}")
    print("-" * 50)

    result = make_request(token, user_id)
    # print(f"Response: {result}")

    if result.get('code') == 0 and result.get('data'):
        print("-" * 50)
        print("尝试 AES 解密 (key=MD5(token))...")
        try:
            decrypted = decrypt_aes(result['data'], token)
            print(f"解密结果: {decrypted}")
        except Exception as e:
            print(f"AES解密失败: {e}")
