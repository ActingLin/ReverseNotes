# -*- coding: utf-8 -*-
"""
@File    : get_data.py
@Author  : Elliot Lin
@Date    : 2026/7/30 14:21
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : i问财补环境实现生成heixin-v
"""
import requests
import execjs

headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "https://www.iwencai.com",
    "Pragma": "no-cache",
    "Referer": "https://www.iwencai.com/screener/result?w=2026-7-29%E8%82%A1%E7%A5%A8&querytype=stock&sign=1785391891308",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "hexin-v": "AxBeLa5oTvkdyBL9VkeykIDe4VVn2fbYFrhIJwrj3ZY-E75LsunEs2bNGIdZ",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
cookies = {
    "chat_bot_session_id": "d85e9d20d068c90e3e07e0f759af631c",
    "other_uid": "Ths_iwencai_Xuangu_i9ptk59iuwgi5faex1eifde7akn37961",
    "_clck": "82zqja%7C2%7Cg86%7C0%7C0",
    "cid": "836c95a3defc1cd4c46d85a98792d7211785377642",
    "_clsk": "1ixroc9skfuz%7C1785391893627%7C8%7C1%7C",
    "v": "Ay9hEJWlmczWPZ3w3XqFhfsrvkg81IENHS2H6kG-yuOlxkE2SaQTRi34FwtS"
}
with open('./demo.js', 'r', encoding='utf-8') as f:
    js_code = f.read()

ctx = execjs.compile(js_code)
v = ctx.call('gen_v').split(";")[0].split("=")[1]
headers['hexin-v'] = v
cookies['v'] = v
url = "https://www.iwencai.com/unifiedwap/unified-wap/v2/result/get-robot-data"
data = {
    "question": "2026-7-29股票",
    "source": "Ths_iwencai_Xuangu",
    "version": "2.0",
    "secondary_intent": "stock",
    "rsh": "",
    "page": "1",
    "perpage": "50",
    "log_info": "{\"input_type\":\"typewrite\"}",
    "add_info": "{\"urp\":{\"scene\":1,\"company\":1,\"business\":1},\"contentType\":\"json\",\"searchInfo\":true}"
}
response = requests.post(url, headers=headers, cookies=cookies, data=data)

print(response.json())
print(response)