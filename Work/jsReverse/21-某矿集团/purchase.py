# -*- coding: utf-8 -*-
"""
@File    : purchase.py
@Author  : Elliot Lin
@Date    : 2026/8/9 22:03
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import execjs
import requests


headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Length": "0",
    "Origin": "https://ec.minmetals.com.cn",
    "Pragma": "no-cache",
    "Referer": "https://ec.minmetals.com.cn/open/home/purchase-info?tabIndex=0",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
cookies = {
    "SUNWAY-ESCM-COOKIE": "9db90fcc-6520-46aa-9261-f8cb9e364cf0",
    "__jsluid_s": "1a98bdd1a3d192957040b4d7a65253c5",
    "JSESSIONID": "7B4396FE6F51E0E2E1718075A5FDE2C9"
}


def get_public_key():
    url = "https://ec.minmetals.com.cn/open/homepage/public"
    response = requests.post(url, headers=headers, cookies=cookies)
    return response.text


def get_encrypt_param(public_key, page):
    with open('./五矿集团.js', 'r', encoding='utf-8') as f:
        js_code = f.read()
    ctx = execjs.compile(js_code)
    return ctx.call('encrypt_param', public_key, page)


def get_info(param):
    url = "https://ec.minmetals.com.cn/open/homepage/zbs/by-lx-page"
    data = {
        "param": param
    }
    print(data)
    response = requests.post(url, headers=headers, cookies=cookies, json=data)
    print(response.text)


key = get_public_key()
encrypt_param = get_encrypt_param(key, 1)
get_info(encrypt_param)

