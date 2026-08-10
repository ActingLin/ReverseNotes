# -*- coding: utf-8 -*-
"""
birdreport 协议加密原语 —— 纯 Python 复刻，无浏览器依赖。

来自静态还原（js_reverse_cache/analysis/*.md）:
- 请求体: JSEncrypt.encryptLong (RSA-1024 PKCS1v1.5, 117字节分块, hex2b64 编码)
- 请求头 sign: MD5(明文JSON + requestId + timestamp)
- 请求头 requestId: getUuid() 自定义 32 位 hex
- 响应体: AES-256-CBC (key/iv 见下文), PKCS7, base64 密文
"""
import hashlib
import json
import random

from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5, AES

# ---- RSA 公钥 (jqueryAjax.js 内 paramPublicKey, 裸 SPKI DER) ----
_PUBLIC_KEY_DER = ("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCvxXa98E1uWXnBzXkS2yHUfnBM6"
                   "n3PCwLdfIox03T91joBvjtoDqiQ5x3tTOfpHs3LtiqMMEafls6b0YWtgB1dse1W5"
                   "m+FpeusVkCOkQxB4SZDH6tuerIknnmB/Hsq5wgEkIvO5Pff9biig6AyoAkdWpSek"
                   "/1/B7zYIepYY0lxKQIDAQAB")
PUBLIC_KEY_PEM = ("-----BEGIN PUBLIC KEY-----\n"
                  + _PUBLIC_KEY_DER + "\n"
                  "-----END PUBLIC KEY-----")

# ---- AES 响应解密参数 (aes.util.js, BIRDREPORT_APIJS.decode) ----
# 注意: getMapping 把 2 位 hex 对按十进制 String.fromCharCode(pair) 转换，
#       而非十六进制 parseInt(pair,16)！
# key_hex "6756696653534952657053656868665752665050485566485667545454484967"
#         -> 逐对十进制 -> "C8EB5514AF5ADDB94B2207B08C66601C" (32字节; 末对 67->'C')
# iv_hex  "53536868555767547048526949655455"
#         -> 逐对十进制 -> "55DD79C6F04E1A67" (16字节)
AES_KEY = "C8EB5514AF5ADDB94B2207B08C66601C"
AES_IV = "55DD79C6F04E1A67"

_B64MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
_B64PAD = "="


# ---------------------------------------------------------------- requestId
def get_uuid():
    """复刻 jqueryAjax.js getUuid(): 32 位 hex 伪 UUID。"""
    hex_digits = "0123456789abcdef"
    s = [hex_digits[random.randint(0, 15)] for _ in range(32)]
    s[14] = "4"
    s[19] = hex_digits[(int(s[19], 16) & 3) | 8]
    s[8] = s[13] = s[18] = s[23]
    return "".join(s)


# ---------------------------------------------------------- 明文 JSON 组装
def data_to_json(data):
    """复刻 jqueryAjax.js dataTojson(): urlencoded form -> dict。"""
    res = {}
    if not data:
        return res
    for item in data.split("&"):
        if "=" in item:
            parts = item.split("=")
            if len(parts) == 2:
                res[parts[0]] = parts[1]
            else:
                res[parts[0]] = ""
        else:
            res[item] = ""
    return res


def sort_ascii(obj):
    """复刻 jqueryAjax.js sort_ASCII(): 按键名升序排序。"""
    return {k: obj[k] for k in sorted(obj.keys())}


def build_plaintext(form_data):
    """form_data: str (urlencoded) 或 dict -> 排序后的 JSON 字符串。

    注意: JS JSON.stringify 无空格，Python json.dumps 必须用
    separators=(',', ':') 去掉默认空格，否则 sign 会不一致。
    """
    if isinstance(form_data, dict):
        form_data = "&".join(f"{k}={v}" for k, v in form_data.items())
    return json.dumps(sort_ascii(data_to_json(form_data)),
                      ensure_ascii=False, separators=(",", ":"))


def make_sign(plaintext, request_id, timestamp):
    """sign = MD5(plaintext + requestId + timestamp)。"""
    return hashlib.md5(f"{plaintext}{request_id}{timestamp}".encode()).hexdigest()


# --------------------------------------------------------- RSA encryptLong
def _hex2b64(hex_str):
    """复刻 jsbn hex2b64(): 按 3 个 hex 字符(12bit) 分组的自定义 base64。"""
    out = ""
    i = 0
    n = len(hex_str)
    while i + 3 <= n:
        c = int(hex_str[i:i + 3], 16)
        out += _B64MAP[c >> 6] + _B64MAP[c & 63]
        i += 3
    if i + 1 == n:
        c = int(hex_str[i:i + 1], 16)
        out += _B64MAP[(c << 2) & 63]
    elif i + 2 == n:
        c = int(hex_str[i:i + 2], 16)
        out += _B64MAP[c >> 2] + _B64MAP[((c & 3) << 4) & 63]
    while (len(out) & 3) > 0:
        out += _B64PAD
    return out


def _rsa_encrypt_chunk_hex(chunk, cipher):
    """单块 PKCS1v1.5 加密 -> JS BigInteger.toString(16) 等价 hex(偶数长度)。"""
    encrypted = cipher.encrypt(chunk.encode("utf-8"))
    h = format(int.from_bytes(encrypted, "big"), "x")
    if len(h) & 1:
        h = "0" + h
    return h


def rsa_encrypt_long(text, rsa_key=None):
    """复刻 JSEncrypt encryptLong: 117字节分块 RSA 加密 -> hex 拼接 -> hex2b64。"""
    if rsa_key is None:
        rsa_key = RSA.import_key(PUBLIC_KEY_PEM)
    max_length = (rsa_key.n.bit_length() + 7 >> 3) - 11  # 128-11 = 117
    cipher = PKCS1_v1_5.new(rsa_key)
    ct_hex = ""
    for i in range(0, len(text), max_length):
        ct_hex += _rsa_encrypt_chunk_hex(text[i:i + max_length], cipher)
    return _hex2b64(ct_hex)


# ------------------------------------------------------------- AES decode
def aes_decode(cipher_b64):
    """复刻 BIRDREPORT_APIJS.decode: AES-256-CBC + PKCS7 -> UTF-8 明文。"""
    import base64 as _b64
    cipher_b64 = cipher_b64.strip()
    # 服务端返回的密文 base64 可能缺 padding
    cipher_b64 += "=" * (-len(cipher_b64) % 4)
    raw = _b64.b64decode(cipher_b64, validate=False)
    cipher = AES.new(AES_KEY.encode("utf-8"), AES.MODE_CBC, AES_IV.encode("utf-8"))
    padded = cipher.decrypt(raw)
    pad_len = padded[-1]
    if 1 <= pad_len <= 16 and padded[-pad_len:] == bytes([pad_len]) * pad_len:
        return padded[:-pad_len].decode("utf-8")
    return padded.decode("utf-8", errors="replace")
