import requests
import time
import execjs

last_time = int(time.time())
# print(last_time)    # 1769936255


headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Connection": "keep-alive",
    "Content-Type": "application/json;charset=utf-8",
    "Referer": "https://www.cls.cn/depth?id=1111",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
cookies = {
    "_c_WBKFRo": "6WYrNYThjPDV8VoQ4LgfYrlF2OjNjbSeHMwJ4Egk",
    "HWWAFSESID": "b24dcbb77c00dfa295",
    "HWWAFSESTIME": "1769932542776",
    "hasTelegraphNotification": "on",
    "hasTelegraphRemind": "on",
    "hasTelegraphSound": "on",
    "vipNotificationState": "on",
    "Hm_lvt_fa5455bb5e9f0f260c32a1d45603ba3e": "1769672094,1769695311,1769932548",
    "HMACCOUNT": "E1FAE8CBADDB58F3",
    "Hm_lpvt_fa5455bb5e9f0f260c32a1d45603ba3e": "1769936024"
}
url = "https://www.cls.cn/v3/depth/list/1111"
params = {
    "app": "CailianpressWeb",
    "id": "1111",
    "last_time": str(last_time),
    "os": "web",
    "rn": "20",
    "sv": "8.4.6",
    # "sign": "e7d91a12989b686bc1c1726ae08577ce"
}

sign = execjs.compile(open('test.js', 'r', encoding='utf8').read()).call('get_sign', params)
params['sign'] = sign
response = requests.get(url, headers=headers, cookies=cookies, params=params)

print(response.text)
print(response)