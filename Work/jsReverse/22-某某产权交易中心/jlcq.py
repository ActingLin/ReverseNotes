# -*- coding: utf-8 -*-
"""
@File    : jlcq.py
@Author  : Elliot Lin
@Date    : 2026/8/8 21:56
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 吉林长春产权交易中心 https://www.ccprec.com
          逆向 honsanCloudAct 接口（honsanCloud 云加密网关，HS_CRYPT_V2 伪AES逐字符位移加密）
          请求体+响应体均加密
"""
import json
import random
import time
import requests
from urllib.parse import quote, unquote

# honsanCloud SDK 内置密码（AES 类 b 的 pubPass）
PUBPASS = "BX1o65CoobwcDP33iQW6ld1OyIPsNzF1"
# 36 进制字母表
CHARS = "0123456789abcdefghijklmnopqrstuvwxyz"

# ---- 工具函数 ----

def to_base36(n: int) -> str:
    """十进制转36进制字符串（小写字母表，与 JS toString(36) 一致）"""
    if n == 0:
        return "0"
    s = ""
    while n:
        s = CHARS[n % 36] + s
        n //= 36
    return s


def encode_uri(s: str) -> str:
    """模拟 JS encodeURI：保留 ; , / ? : @ & = + $ - _ . ! ~ * ' ( ) # 不编码"""
    return quote(s, safe=";,/?:@&=+$-_.!~*'()#")


def random_str(length: int) -> str:
    """模拟 JS randomStr：每字符 random(0,35) -> base36 -> '0'-'y'（不含 z）"""
    return "".join(CHARS[random.randint(0, 34)] for _ in range(length))


# ---- 核心加解密（HS_CRYPT_V2 伪AES）----

def encrypt(plaintext: str) -> str:
    """加密：encodeURI 后逐字符位移，加随机密钥，拼接头部。
    plaintext 应为 JSON.stringify(JSON.stringify(envelope)) 的双重编码字符串字面量。
    格式: [4字符头][1字符密钥长度][密钥o字符][密文(每字符2位base36)]
    """
    e = encode_uri(plaintext)
    o = random.randint(16, 31)                     # 密钥长度 [16,31]
    a = random_str(o)                               # 随机密钥串
    c = [ord(ch) for ch in a]                       # 密钥 charCode 数组
    passnums = [ord(ch) for ch in PUBPASS]
    n = []
    s = u = l = 0
    r = ""
    for h in range(len(e)):
        i = ord(e[h])
        if s == len(passnums):
            s = 0
        i += passnums[s]
        s += 1
        if u == len(c):
            u = 0
        i += c[u]
        u += 1
        l += i
        if l > 65535:
            l -= 65535
        r = to_base36(i)
        r = ("00" + r)[-2:]                        # 补足2位
        n.append(r)
    f = ("0000" + r)[-4:]                          # 头部4字符 = 最后一段密文的补齐（SDK 原始 bug）
    n.insert(0, a)
    n.insert(0, to_base36(o))
    n.insert(0, f)
    return "".join(n)


def decrypt(cipher: str) -> str:
    """解密：反向逐字符位移，返回 decodeURI 后的原始字符串"""
    keylen = int(cipher[4], 36)                    # 第5字符 = 密钥长度
    randstr = cipher[5:5 + keylen]                 # 随机密钥
    randcodes = [ord(ch) for ch in randstr]
    passnums = [ord(ch) for ch in PUBPASS]
    body = cipher[5 + keylen:]
    out = []
    c = a = 0
    for h in range(0, len(body), 2):
        u = int(body[h:h + 2], 36)
        if c == len(randcodes):
            c = 0
        u -= randcodes[c]
        c += 1
        if a == len(passnums):
            a = 0
        u -= passnums[a]
        a += 1
        out.append(chr(u))
    return unquote("".join(out))


# ---- uuid 生成（模拟 l.Utils.uuid）----

_uuid_count = 0


def uuid(length: int = 16) -> str:
    """模拟 JS uuid：
    base36((Date.now()+1e14)*1000 + 计数器) + 随机串，截断到 length
    """
    global _uuid_count
    _uuid_count += 1
    ts = int(time.time() * 1000)
    num = (ts + 10**14) * 1000 + _uuid_count
    i = to_base36(num)
    i += random_str(length)
    return i[:length]


# ---- 请求构建 ----

PROJECT_KEY = "honsan_cloud_ccprec"
SERVICE_HOST = "https://www.ccprec.com"
SERVICE_ACT = "/honsanCloudAct"

HEADERS = {
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "text/xml;charset=UTF-8",
    "Origin": "https://www.ccprec.com",
    "Referer": "https://www.ccprec.com/projectSecPage/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
}


def build_envelope(acts, client_key=None):
    """构建请求信封（对应 SDK _post 中的对象 o）"""
    return {
        "id": uuid(),
        "projectKey": PROJECT_KEY,
        "clientKey": client_key or uuid(),
        "token": None,
        "clientDailyData": {},
        "acts": [{"id": uuid(), "fullPath": path, "args": args} for path, args in acts],
    }


def encrypt_request(envelope: dict) -> str:
    """请求加密：双重 JSON 序列化（紧凑格式，同 JS JSON.stringify）+ 伪AES"""
    s = json.dumps(envelope, ensure_ascii=False, separators=(",", ":"))   # JSON.stringify(o)
    t = json.dumps(s, ensure_ascii=False, separators=(",", ":"))          # encode 内部再 JSON.stringify
    return encrypt(t)


def decrypt_response(cipher: str) -> dict:
    """响应解密：伪AES -> 纯JSON -> dict"""
    return json.loads(decrypt(cipher))


def call(acts, client_key=None):
    """发送一批 acts（fullPath, args）到 honsanCloudAct，返回解密后的响应 dict"""
    envelope = build_envelope(acts, client_key)
    data = encrypt_request(envelope)
    resp = requests.post(SERVICE_HOST + SERVICE_ACT, headers=HEADERS, data=data.encode("utf-8"), timeout=20)
    resp.raise_for_status()
    result = decrypt_response(resp.text)
    return result


# ---- 主流程 ----

if __name__ == "__main__":
    import sys

    # 目标接口：cqweb_nonphy_cqzr（非实物产权转让列表），args = [页码, 每页条数, 关键词]
    if len(sys.argv) > 1:
        a1 = int(sys.argv[1])
        a2 = int(sys.argv[2]) if len(sys.argv) > 2 else 20
        a3 = sys.argv[3] if len(sys.argv) > 3 else None
        qargs = [a1, a2, a3]
    else:
        qargs = [2, 20, None]

    result = call([
        ("/ccprec.com.cn.web/client/info/cqweb_nonphy_cqzr", qargs),
    ])

    print("=" * 60)
    print("请求已发送，响应解密结果：")
    print(json.dumps(result, ensure_ascii=False, indent=2))

    # 展示每个 act 的数据
    for r in result.get("results", []):
        print("=" * 60)
        print("act id:", r.get("id"), " err:", r.get("err"))
        datas = r.get("args")
        print("数据条数:", len(datas) if isinstance(datas, list) else datas)
        if isinstance(datas, list) and datas:
            print("首条数据:", json.dumps(datas[0], ensure_ascii=False, indent=2))
