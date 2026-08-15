# -*- coding: utf-8 -*-
"""
@File    : coming.py
@Author  : Elliot Lin
@Date    : 2026/8/11 18:06
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import requests
import hashlib
import json
import time
from urllib import parse
import loguru

headers = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "MX-API": "{\"ver\":\"7.0.0\",\"sCode\":\"Wanda\",\"_mi_\":\"\",\"width\":1280,\"json\":true,\"cCode\":\"1_3\",\"check\":\"b638fe1c8aa74a86a61b3d6420ba2518\",\"ts\":1786442709576,\"heigth\":720,\"appId\":\"3\"}",
    "Origin": "https://m.wandacinemas.com",
    "Pragma": "no-cache",
    "Referer": "https://m.wandacinemas.com/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
    "Sec-Fetch-Storage-Access": "active",
    "User-Agent": "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\""
}
url = "https://cinema-api-prd-mx.wandafilm.com/movie/coming.api"

ts = int(time.time() * 1000)
api = "/movie/coming.api"
params = {
    "cityId": "290",
    "cinemaId": "7121",
    "day": "0"
}
def hexMD5(ts, api, data):
    """MD5 摘要，返回 32 位小写十六进制字符串"""
    # "Wanda 1_3 B3AA12B0145E1982F282BEDD8A3305B89A9811280C0B8CC3A6A60D81022E4903 1786545971747 /movie/coming.api ? cityId=290&cinemaId=7121&day=0"
    plain_text = ""
    plain_text += "Wanda"
    plain_text += "1_3"
    plain_text += "B3AA12B0145E1982F282BEDD8A3305B89A9811280C0B8CC3A6A60D81022E4903"
    plain_text += str(ts)
    plain_text += api
    plain_text += "?"
    plain_text += parse.urlencode(data)
    # loguru.logger.info(plain_text)
    return hashlib.md5(plain_text.encode()).hexdigest()

new_mx_api = json.dumps({
    "ver": "7.0.0",
    "sCode": "Wanda",
    "_mi_": "",
    "width": 1280,
    "json": True,
    "cCode": "1_3",
    "check": hexMD5(ts, api, params),
    "ts": ts,
    "heigth": 720,
    "appId": "3"
}, separators=(",", ":"))
loguru.logger.info(new_mx_api)
headers.update({'MX-API': new_mx_api})

response = requests.get(url, headers=headers, params=params)

loguru.logger.info(response.text)
# print(response)