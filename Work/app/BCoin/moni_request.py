import time
import hashlib
import requests
from Crypto.Cipher import AES
import base64

def unpad(data):
    """去除填充"""
    pad_length = data[-1]
    return data[:-pad_length]
def decrypt_aes_cbc(ciphertext_base64, key, iv):
    # key = bytes(key_text, 'utf-8')
    # iv = bytes(iv_text, 'utf-8')
    ciphertext = base64.b64decode(ciphertext_base64)

    cipher = AES.new(key, AES.MODE_CBC, iv)
    plaintext = cipher.decrypt(ciphertext)
    plaintext = unpad(plaintext).decode('utf-8')
    return plaintext
def calculate_md5(data):
    # 创建一个MD5哈希对象
    md5_hash = hashlib.md5()
    # 更新哈希对象
    md5_hash.update(data.encode('utf-8'))
    # 返回MD5哈希的十六进制表示
    return md5_hash.hexdigest()

headers = {
  "accept": "application/json,application/xml,application/xhtml+xml,text/html;q=0.9,image/webp,*/*;q=0.8",
  "accept-encoding": "gzip, deflate",
  "accept-language": "zh-CN,zh",
  "appversion": "4.0.3",
  "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  "from": "Android",
  "fromandroid": "bicoin",
  "mobilid": "d96349a5-e680-4588-90a4-dc68c0cdf6dc",
  "mobilkey": "2CF894E76DCAE67D5E8FD6715FF98548",
  "redrisegreendown": "2",
  "salt": "0",
  # "sign": "daa6bccda73327785e72258383ae12db2",
  # "time": "1761636942679",
  "token": "53cb9738897f7c965512b9844b826325",
  "user-agent": "Mozilla/5.0 (Linux; U; Android 13; zh-cn; M2012K11AC Build/TKQ1.221114.001) AppleWebKit/533.1 (KHTML, like Gecko) Version/5.0 Mobile Safari/533.1",
  "usertempid": "",
  "host": "i.bicoin.com.cn"
}

times = int(time.time() * 1000)
# print(times)
str = '53cb9738897f7c965512b9844b826325' + str(times) + "0" + 'getUserAccountInfoBySecretNew'
# print(str)
sign = 'd'+calculate_md5(str)
# print(sign)
headers['Sign'] = sign
headers['Time'] = f'{times}'
url = 'https://i.bicoin.com.cn/firmOffer/getUserAccountInfoBySecretNew'

params = {
    "salt": "0",
    "sign": f"{sign}",
    "time": f"{times}",
    "userId": "1853145"
}

response = requests.get(url, headers=headers, params=params, verify=False).json()
print(response)
data = response['data']
key_hex = '652ecfd23f53b731e88ec96ed55f885d'
iv_hex = '652ecfd23f53b731e88ec96ed55f885d'
data = decrypt_aes_cbc(data, bytes.fromhex(key_hex), bytes.fromhex(iv_hex))
print(data)