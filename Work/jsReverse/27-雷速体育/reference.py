# -*- coding: utf-8 -*-
"""
@File    : reference.py
@Author  : Elliot Lin
@Date    : 2026/8/15 22:21
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import gzip
import hashlib
import time
import json
import base64
from http.client import responses
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import requests, uuid

def C(t, key_str):
    """
    对应 JS 的 C(t) 函数
    :param t: 要加密的字典或对象
    :param key_str: JS 中 y() 函数返回的密钥字符串
    :return: 特殊 Base64 编码的字符串
    """
    # 1. 准备密钥和明文 (对应 u.a.enc.Utf8.parse)
    key_bytes = key_str.encode('utf-8')
    plain_str = json.dumps(t, separators=(',', ':'), ensure_ascii=False)
    plain_bytes = plain_str.encode('utf-8')
    cipher = AES.new(key_bytes, AES.MODE_ECB)
    encrypted_bytes = cipher.encrypt(pad(plain_bytes, AES.block_size, style='pkcs7'))
    b64_encoded = base64.urlsafe_b64encode(encrypted_bytes).decode('utf-8')
    result = b64_encoded.rstrip('=')
    return result

# 1. 定义生成密钥的数组和方法
A = [91, 0, 37, 74, 111, 20, 57, 94, 3, 40, 77, 114, 23, 60, 97, 6]
g = [48, 119, 101, 34, 69, 44, 94, 29, 74, 70, 105, 74, 79, 31, 5, 96]

def get_key():
    return "".join(chr(t ^ a) for t, a in zip(g, A))

def generate_sign(acp_dict, key_str):
    key_bytes = key_str.encode('utf-8')
    plain_str = json.dumps(acp_dict, separators=(',', ':'), ensure_ascii=False)
    plain_bytes = plain_str.encode('utf-8')
    cipher = AES.new(key_bytes, AES.MODE_ECB)
    encrypted_bytes = cipher.encrypt(pad(plain_bytes, AES.block_size, style='pkcs7'))
    b64_encoded = base64.urlsafe_b64encode(encrypted_bytes).decode('utf-8')
    return b64_encoded.rstrip('=')

def d(t, e=9):
    result = []
    for i in map(ord, t):
        if 65 <= i <= 90:
            i = (i - 65 - e + 26) % 26 + 65
        elif 97 <= i <= 122:
            i = (i - 97 - e + 26) % 26 + 97
        result.append(chr(i))
    return "".join(result)

def S(t):
    raw_bytes = base64.b64decode(t)
    decompressed_bytes = gzip.decompress(raw_bytes)
    return decompressed_bytes.decode('utf-8', errors='ignore')

cookie = '_c_WBKFRo=bsl3Nj6wErks83CIcJjDifi5MZW2U8I7mmVcf2xt; cna=7439a436ec0f4fda8dd97d9f30178de7; Hm_lvt_63b82ac6d9948bad5e14b1398610939a=1784771444; acw_tc=0a0572bd17858336450991884e1a8335ef2bd1cf49e97c0535feea1799f71f; acw_sc__v2=1234cf0d46-99215f715d7cf8c5572a59d9969e3a2a0757dd446c500f3f06; ssxmod_itna=1-GuitPfx_xhOKi7f4AQ0=DO3FMDqQq0dGMADeq7tDRDFqAPQDH8_aKWqaSiK88DjxD=x57rrAxgD05wiDnqD8UDQeDv4g_YD7RZu_9Pd7_2bhw=3AagGh3rLI1ipfawKuS9X2dvzYQhDB3DbqDy8BNQB4GGf4GwDGoD34DiDDpfD03Db4D_nWrD7ORQMluokm4DQ4GyDitDKw_TxG3D08bP/g56IeGEDA3DG3bDmRb6DDN6FFdQW7fGDYpogW0FEBaDALxtaihox0tWDBdeKvHDGwCucbWtg9MAaf2aHPGuDG=Ocm0Hw2bbgoPP=VY5Qemi0PQmee0mK7w4ee6Dee3r6emq0KeWGiCDeBQN7hCm0rRPDneoVqH304qxZUv/IeVl5bRhC30CRoH8iK9P4/rrBBrn2DBhNe_HYTY97xebK/BYciYlu1Bo70AFRGP7RbdO52RrB_FeD; ssxmod_itna2=1-GuitPfx_xhOKi7f4AQ0=DO3FMDqQq0dGMADeq7tDRDFqAPQDH8_aKWqaSiK88DjxD=x57rrAxhDnWYD0e3vpIPC47pKYf_oLUEDBT2cjkLfYAPANavdSDz/e/dqSc5adD'
session = requests.Session()
response = session.get('https://m.leisu.com/data/zuqiu/team-10766', headers={
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
    "Cookie": cookie,
})
url = "https://api-gateway.leisu.com/v1/web/match/database/football/team_matches?season_ids=[13959,13916,13874]&team_id=10766&acw_sc__v2=1234cf0d46-99215f715d7cf8c5572a59d9969e3a2a0757dd446c500f3f06"
api = '/v1/web/match/database/football/team_matches'
ts = int(time.time())
uuid = str(uuid.uuid4()).replace("-", "")
md5_text = f'{api}-{ts}-{uuid}-0-uHhANonwd4UdpzOdsUqUsnl5PjurM877'
acp = {
    "auth_data": f"{ts}-{uuid}-0-{hashlib.md5(md5_text.encode('utf-8')).hexdigest()}",
    "source": "m_leisu"
}
secret_key = get_key()
sign = generate_sign(acp, secret_key)

headers = {
    "accept": f"application/json, text/plain, */*;;{sign}",
    "referer": "https://m.leisu.com/data/zuqiu/team-10766",
    "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
    'cookie': cookie
}
try:
    resp = session.get(url, headers=headers).json()
    print(resp)
    if resp['code'] == 111:
        for e in range(1, 26):
            try:
                txt = d(resp['data'], e)
                raw = base64.b64decode(txt)
                if raw[:2] == b'\x1f\x8b':
                    print(f"正确的移位密钥是: {e}")
                    cc = json.loads(S(txt))
                    print(json.dumps(cc, ensure_ascii=False, indent=4))
                    break
            except Exception as err:
                print('雷速数据解密失败: ', err)
                continue
    else:
        for e in range(1, 26):
            try:
                txt = d(resp['data'], e)
                raw = base64.b64decode(txt)
                if raw[:2] == b'\x1f\x8b':
                    print(f"正确的移位密钥是: {e}")
                    cc = json.loads(S(txt))
                    print(cc)
                    break
            except Exception as err:
                print('雷速数据解密失败: ', err)
except Exception as e:
    print("雷速数据获取失败: ", e)