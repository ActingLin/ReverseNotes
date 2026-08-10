# -*- coding: utf-8 -*-
"""
@File    : qcc.py
@Author  : Elliot Lin
@Date    : 2026/7/15 17:01
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    :
"""

import execjs
import requests
import json
with open('qcc.js', 'r', encoding='utf-8') as f:
    js_code = f.read()
ctx = execjs.compile(js_code)


page = 2
headers_data = {
    "searchKey": "小米",
    "pageIndex": page,
    "pageSize": 20
}
tid = '43adbb3910f063ee7539929b12be2a63'    # 不同会话不同
headers_info = ctx.call("get_headers_info", headers_data, tid)
print(headers_info)

headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    headers_info['key']: headers_info['value'],
    "origin": "https://www.qcc.com",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://www.qcc.com/web/search?key=%E5%B0%8F%E7%B1%B3",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "x-pid": "bf9bbc40000adc2a845ebd09ca9a5096",
    "x-requested-with": "XMLHttpRequest"
}
cookies = {
    "QCCSESSID": "9d9c3cda94eb984710b577ad6f",
    "qcc_did": "549f11ff-ed49-4543-861f-ecb5b7953a95",
    "UM_distinctid": "19f64b84c1b11ca-0a02202cffd7bd8-26011151-1cb600-19f64b84c1c1698",
    "_c_WBKFRo": "EQXPi5wuNM7jHtRanhTbkpfejy9hbKuz3nVXdSvm",
    "_nb_ioWEgULi": "",
    "acw_tc": "76b20f6b17841058308016810eb4ae7d7255690eaac004fc76e3da893929f8",
    "CNZZDATA1254842228": "584162490-1784101228-https%253A%252F%252Fwww.google.com.hk%252F%7C1784106641"
}
url = "https://www.qcc.com/api/search/searchMulti"
data = {
    "searchKey": "小米",
    "pageIndex": page,
    "pageSize": 20
}
data = json.dumps(data, separators=(',', ':'))
response = requests.post(url, headers=headers, cookies=cookies, data=data)

print(response.json())
print(response)