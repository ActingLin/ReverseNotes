# -*- coding: utf-8 -*-
"""
@File    : login.py
@Author  : Elliot Lin
@Date    : 2026/8/9 13:24
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import time

import execjs
import requests


headers = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Origin": "https://login.10086.cn",
    "Pragma": "no-cache",
    "Referer": "https://login.10086.cn/html/login/email_login.html",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\""
}
cookies = {
    "CmLocation": "100|100",
    "CmProvid": "bj",
    "9e4e5fa7244c6b6e_gdp_session_id": "86dec1f1-fcc4-4a92-94f0-7d26c144c5d9",
    "gdp_user_id": "gioenc-50041g82%2C3d18%2C5624%2C9d78%2C29a2324b30ac",
    "9e4e5fa7244c6b6e_gdp_session_id_sent": "86dec1f1-fcc4-4a92-94f0-7d26c144c5d9",
    "9e4e5fa7244c6b6e_gdp_user_key": "",
    "arialoadData": "true",
    "ariawapChangeViewPort": "false",
    "sendflag": "20260809131849761436",
    "lgToken": "mhrz448c51114df4ba6e79c2bc76926b",
    "cvToken": "mhrzf878e3c54d55bd3ac68c0dec6d31",
    "CaptchaCode": "rRUKCA",
    "_zw_kvani5r": "b4236647e1e2288cc1d7b37a7a569d3e45343e9556f0dbf183920889b99381e6b1683d60",
    "9e4e5fa7244c6b6e_gdp_cs1": "gioenc-.vbOO.pb0QBTgg.dGfFGFA<<",
    "9e4e5fa7244c6b6e_gdp_gio_id": "gioenc-.vbOO.pb0QBTgg.dGfFGFA<<",
    "9e4e5fa7244c6b6e_gdp_sequence_ids": "{%22globalKey%22:10%2C%22VISIT%22:2%2C%22PAGE%22:4%2C%22CUSTOM%22:5%2C%22VIEW_CLICK%22:2}"
}
url = "https://login.10086.cn/login.htm"

with open('./encrypt.js', 'r', encoding='utf-8') as f:
    js_code = f.read()
ctx = execjs.compile(js_code)

account = "123456@123.com"
password = "123456"
RSA_encrypt_account = ctx.call('et', account)
RSA_encrypt_password = ctx.call('et', password)

data = {
    "accountType": "02",
    "pwdType": "03",
    "account":RSA_encrypt_account,
    "password":RSA_encrypt_password,
    "backUrl": "https://touch.10086.cn/i/",
    "rememberMe": "1",
    "channelID": "12014",
    "protocol": "https:",
    "loginMode": "03",
    "timestamp": time.time()
}
response = requests.post(url, headers=headers, cookies=cookies, data=data)

print(response.text)
print(response)