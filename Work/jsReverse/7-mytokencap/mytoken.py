import time
import requests
import execjs

headers = {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "origin": "https://www.mytokencap.com",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://www.mytokencap.com/",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
}
url = "https://api.mytoken.info/ticker/currencyranklist"


with open("mytoken.js", "r", encoding="utf-8") as f:
    js_code = f.read()

ctx = execjs.compile(js_code)

# 签名和请求时的时间戳要一致
# node 生成的时间戳
params_data = ctx.call("get_params")
code = params_data["code"]
timestamp = params_data["timestamp"]

# python 生成的时间戳
timestamp2 = int(time.time() * 1000)
code2 = ctx.call("get_code", str(timestamp2))

params = {
    "pages": "5,1",
    "sizes": "100,100",
    "subject": "market_cap",
    "language": "en_US",
    "legal_currency": "USD",
    # "code": "834e2ba008f5ad0de215e76fbde9ed4e",
    "code": code,
    "timestamp": timestamp,
    "platform": "web_pc",
    "v": "0.1.0",
    "mytoken": ""
}
response = requests.get(url, headers=headers, params=params)

print(response.text)
print(response)