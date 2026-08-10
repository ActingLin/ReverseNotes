# -*- coding: utf-8 -*-
"""
协议编排: 把明文表单 + 请求头 组装成可发送的请求。
完全复刻 jqueryAjax.js $.ajaxSetup.beforeSend 的逻辑。
"""
import time

from collector import crypto
from collector import config as cfg


def build_request_headers(form_string: str, now_ms: int = None):
    """生成 timestamp/requestId/sign 请求头, 与浏览器一致。"""
    if now_ms is None:
        now_ms = int(time.time() * 1000)
    timestamp = str(now_ms)
    request_id = crypto.get_uuid()
    plaintext = crypto.build_plaintext(form_string)
    sign = crypto.make_sign(plaintext, request_id, timestamp)
    return {
        "timestamp": timestamp,
        "requestId": request_id,
        "sign": sign,
        "plaintext": plaintext,   # 内部携带, 供调试; 发送时剔除
    }


def build_body(form_string: str) -> str:
    """加密请求体: RSA-1024 encryptLong(base64)。"""
    plaintext = crypto.build_plaintext(form_string)
    return crypto.rsa_encrypt_long(plaintext)


def build_headers(hdr: dict) -> dict:
    """去掉内部字段, 补齐发送用请求头。"""
    wire = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "https://www.birdreport.cn",
        "Referer": "https://www.birdreport.cn/",
        "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                       "AppleWebKit/537.36 (KHTML, like Gecko) "
                       "Chrome/138.0.0.0 Safari/537.36"),
        "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "timestamp": hdr["timestamp"],
        "requestId": hdr["requestId"],
        "sign": hdr["sign"],
    }
    return wire
