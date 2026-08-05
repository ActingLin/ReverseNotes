# -*- coding: utf-8 -*-
"""
@File    : login.py.py
@Author  : Elliot Lin
@Date    : 2026/7/29 21:17
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import requests
import execjs

headers = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Origin": "https://passport2.xuexitong.com",
    "Pragma": "no-cache",
    "Referer": "https://passport2.xuexitong.com/login?fid=&newversion=true&refer=https%3A%2F%2Fi.xuexitong.com",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
cookies = {
    "source": "\"\"",
    "JSESSIONID": "A52B2A373B7D5C7AB79EDE4383AE149C",
    "route": "48dac4a1afc32ddf7230daab78ce59ff",
    "retainlogin": "2"
}
url = "https://passport2.xuexitong.com/fanyalogin"

ctx = execjs.compile(open('./_encrypt.js', 'r', encoding='utf-8').read())
uname = '13988889999'
password = '123456'
transferKey = 'u2oh6Vu^HWe4_AES'
uname = ctx.call('encryptByAES', uname, transferKey)
password = ctx.call('encryptByAES', password, transferKey)

data = {
    "fid": "-1",
    # "uname": "JL0/P0W3ewmgL2auAeSouQ==",
    # "password": "0QgUbMUJj2usHikiqtb8HQ==",
    "uname": uname,
    "password": password,
    "refer": "https%3A%2F%2Fi.xuexitong.com",
    "t": "true",
    "forbidotherlogin": "0",
    "validate": "",
    "doubleFactorLogin": "0",
    "independentId": "0",
    "independentNameId": "0"
}
response = requests.post(url, headers=headers, cookies=cookies, data=data)


print(response.text)
print(response)