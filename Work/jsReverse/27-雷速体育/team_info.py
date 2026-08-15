# -*- coding: utf-8 -*-
"""
@File    : team_info.py
@Author  : Elliot Lin
@Date    : 2026/8/15 10:35
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import loguru
import requests
import execjs

headers = {
    "accept": "application/json, text/plain, */*;;m_BpRmoVCveGQryB4IVVr70miJlfp7_g8szXuO4n6FyIuAeX99K3sTWmxVtLMgXR6NuHSNtSfregnfJwaSGjGw6QfDv5adJDYl2lO4xoOYvNH7HruxVJYs0DjJ74v5hRCNacA6PVCHd5Yo_9N-1AIJbyUitgiYFNGmXAaSHvNpI",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "origin": "https://m.leisu.com",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://m.leisu.com/data/zuqiu/team-10766",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
}
cookies = {
    "_c_WBKFRo": "oBcK3bZieEpx05cxq9uEq003HakhY9FPc07HL4M5",
    "_nb_ioWEgULi": "",
    "cna": "7f735018bb8146cd8b7e0a68a0b5e9e4",
    # "ssxmod_itna": "1-eq0OY5GKiK0KAIxBKi7q3DKQ7ImWbDW9KGHDyP4YK0CDmxjKiddDUjrwnbtrnYcQY2DQGmiS2tDl=DoDZDGFQDqx0ob2biDuts7_eOg4o5K0aMRxd0ml2weoNiBrRcL5n0DSPdF_ytr/fwmPYxGLDY=DCkq4TweD4_3Dt4DIDAYDDxDWzeGIDGYD7xTNVeTDm__F4xGybWTDAfTDbxToxit3DDUvteG2FOTQDDN=nBU=YA9NNl9ilPDS9BuxKDTDjkPD/Sx62DT1yUkQKZuELz9mmmaFxBQD7deQxYEeZpI=d19xskheYOddGD5OokAD3Gq=Bsk07RE=/weKlDtYY=7qYEQkowmATmAxDemTCGLu12wz9wKm7Gxxtn2pkOqb0xzxNwO5MDe/DY4EDKlY5BD3WINArxlDm7iloIzox5Dib7o5gIkgA27w7iDD",
    # "ssxmod_itna2": "1-eq0OY5GKiK0KAIxBKi7q3DKQ7ImWbDW9KGHDyP4YK0CDmxjKiddDUjrwnbtrnYcQY2DQGmiSxoD=rf24b1zD7pPG_9eDs2KePTnxdtmZGcKryjhi96bynYM_Ajym=rW4rTmAxoQmly5019xesDbA497D/FQiQeD"
}

params = {
    "team_id": "10766"
}

with open('demo.js', 'r', encoding='utf-8') as f:
    js_code = f.read()
ctx = execjs.compile(js_code)
base_url = "https://api-gateway.leisu.com"
api = '/v1/web/match/database/football/team_info'
accept = {
    "Accept": "application/json, text/plain, */*"
}
m = "m_leisu"
result = ctx.call('buildSignedHeaders', api, accept, m)
loguru.logger.info(result)
headers.update({'accept': result['Accept']})
# loguru.logger.info(headers)

proxies = {
    "http": "http://127.0.0.1:7890",
    "https": "http://127.0.0.1:7890"
}

response = requests.get(base_url+api, headers=headers, cookies=cookies, params=params, proxies=proxies)

print(response.text)
print(response)

# import uuid
# u = uuid.uuid1()
# print(u)
# print(len(str(u)))
# print(len('bb79f2a6d6a149b1906e5132aa55c813'))
with open('ai分析/demo2.html', 'w', encoding='utf-8') as f:
    f.write(response.text)
