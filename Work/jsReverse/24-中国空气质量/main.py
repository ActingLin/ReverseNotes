# -*- coding: utf-8 -*-
"""
@File    : main.py
@Author  : Elliot Lin
@Date    : 2026/8/11 12:36
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import execjs
import requests


headers = {
    "Accept": "*/*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Origin": "https://www.aqistudy.cn",
    "Pragma": "no-cache",
    "Referer": "https://www.aqistudy.cn/historydata/daydata.php?city=%E9%95%BF%E6%B2%99&month=201401",
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
    "Hm_lvt_6088e7f72f5a363447d4bafe03026db8": "1786422606",
    "HMACCOUNT": "E1FAE8CBADDB58F3",
    "Hm_lpvt_6088e7f72f5a363447d4bafe03026db8": "1786422724"
}
url = "https://www.aqistudy.cn/historydata/api/historyapi.php"

with open('./decode.js', 'r', encoding='utf-8') as f:
    js_code = f.read()
ctx = execjs.compile(js_code)
payload_data = {
    "city": "长沙",
    "month": "201610"
}
result = ctx.call('get_hA4Nse2cT', 'GETDAYDATA', payload_data)
data = {
    "hA4Nse2cT": result
}
# print(data)

response = requests.post(url, headers=headers, cookies=cookies, data=data)

# print(response.text)
# print(response)

decode_resp = ctx.call('decode_resp', response.text)
print(decode_resp)