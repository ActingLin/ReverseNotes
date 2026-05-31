# -*- coding: utf-8 -*-
"""
@File    : 获取音乐下载链接.py
@Author  : Elliot Lin
@Date    : 2026/4/7 16:58
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 传入歌曲id,获取歌曲下载链接(非vip)
"""
import requests
import execjs
import json

headers = {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
    "origin": "https://music.163.com",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://music.163.com/",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
}
cookies = {
    "_iuqxldmzr_": "32",
    "_ntes_nnid": "75ab310aaca5da4f5d9fee701654e606,1775548122099",
    "_ntes_nuid": "75ab310aaca5da4f5d9fee701654e606",
    "NMTID": "00OXDjhGPm26anbGEcls_YottiYiboAAAGdZuouzA",
    "Hm_lvt_1483fb4774c02a30ffa6f0e2945e9b70": "1775548122",
    "HMACCOUNT": "E1FAE8CBADDB58F3",
    "WEVNSM": "1.0.0",
    "WNMCID": "pqvbet.1775548123746.01.0",
    "WM_NI": "HKPFiCEIMzMlMQM91kOZtTqNrZ2CnwoMF%2BVrGFOOPHWiDcWv%2FiX2%2FzXErqYbfIYL%2FhDeH82j7gO4hnXsIS%2BQ6NgYTY5KnJNZW2scs2GZUsTYoLNDG9QLuMCm4pvH0lNPV3o%3D",
    "WM_NIKE": "9ca17ae2e6ffcda170e2e6ee9bcc74aca8a5dad86aa1a88ba6d55a928e8ab0cb80bbb4fcccc96189b4a0d4ed2af0fea7c3b92a8c95a0a7ec498797839bd0688f8f83dab4618d86bcb5f446b286fea4ed7dad938accd57a859a81b0d34495b78c84d67eedb798d3ae729c9bbe92dc6aa69797adae6488bb88d9b162f5b981d5eb669cad87b4aa5bf692a9bad753f795a2abcd5295eebd84f23a85869b94d753ad9482a5c6339394bbaec267f8b0baa9b3688e909ad4ee37e2a3",
    "WM_TID": "PLLQffB%2Bz5RBAUUUFUfCpnx56Jgalajz",
    "sDeviceId": "YD-y5BPDvGdHvtFR1FUAULD4igp%2BMkOz2eO",
    "ntes_utid": "tid._.wVO9cmFct7VFFwAVUFKXojlp6d0Pz0Ol._.0",
    "__snaker__id": "T8xkbHUQuBIilNSV",
    "MUSIC_U": "00EA2E50CBEAAD3C8CE2262C2485BFDD2B4AC4D779EFF213CA768EB1DA4FFD6DA358A9585E047D705FC7BC2A94708E72D67580B6ACC1F35A0EA9809AE12C479330B1BF059E471CAC161323DA94590CAA549B117E400CC7AD06002CB99C2BD98DEC790ED2F8E1F05A078CA224DD5814255A7859FDB62C1315EDB8F80AFCA183628B997E38C90511F35E9A4DFD290F7B800B5C5F64AD5C7D5C04FDF663841008BFAF7CFCE28322B98ABC091575AFB0B2005ACB37FF85969F95CFF6F264BE9879BCBF5EB4A860F0EC951B19B6E3E4693FDBC43BCAA6B0E9B6FD78E67682AD6AD9C70369919784FC4E5932070496C93C99DF38AF9B8ED8C3B72CA53FAA747DD9E480E09C826FAC32CA0BDF3B18CBCD8171E8E08A98681D0ABD4E85F63096C7ACA1DC47588F8E132C9E934AB9393C0DD96EF5ADC065750ADD1CDCADC17E23574D2CFA51A5E3FC4F05403FE2D3FD244C85BB808C10ED4FEEB984DB00A74D1007507669758045C3F30DD80D67A1832394557CB701496D0665E127B2BF5A241003483FD1569B3934971FCAA599ACC43CE3E9D9797B67831BEDDC5A1EA298D5D617E6233B9698FE22F5A4C562D4BC1CC2DA0F93E200",
    "__csrf": "bc4ab27142efa874b4952b58c689c682",
    "__remember_me": "true",
    "NTES_YD_SESS": "99hYRXYBut0w_a9TZ8IGI5CT6UYgkVUucHjsQOvgQ0mX_q13_H8IY.xc3apNIRnkC6eCO1xR5Bqk4jQIaYc5GzipdIpcxnud.qmxHqK0gsW_gJVNnFRsUFYn2Zpku_YkcW6OWnGYfXCTXEaRzo3Tg0nNtlb7MXxUjWEr3iB56aTjzgEUPaeGHMPaolbO9hggA0UVOCzhspBiPW9PsSxvDCb9Trxnlt5tDuHQkb7IyX0bT",
    "S_INFO": "1775548259|0|0&60##|19896259631",
    "P_INFO": "19896259631|1775548259|1|music|00&99|null&null&null#CN&null#10#0|&0||19896259631",
    "ntes_kaola_ad": "1",
    "Hm_lpvt_1483fb4774c02a30ffa6f0e2945e9b70": "1775548338",
    "playerid": "38314402",
    "JSESSIONID-WYYY": "9VxJJYE6eMGTrHwBT55D5gJJ0HbwNjS%2B2fXbuT%5C9fyA5419CnGPMRquzaH8iqzIjnyJd4o%2B6XUivtp0yUv%2BGP2AgbS%2FnTD%2BvYmR7%2Fqr9cBa0BN5JD%5C%2BdVm%2FtuOhFtSyYRulAmsV0C9pxRG5IfzZqCFqSzJ4dJEG%5CCiNlyduqtWmn2p3h%3A1775551662114",
    "gdxidpyhxdE": "liiB%5CZX41PWMPQCuDguIN2yUwdYtIAJ38GbtNRx8MTpPeY6I2Es8Pw6M7PLoIRPSbOnBhg9uJi%5CA9r6IV%5CxPDjofm9A%5CUWip25TH9Bwud%2F9yTPecp4kg70kS90P8YBf7bjzIJNDvmRAHjYOHuq%2B5eX123yjDwa%2FzZPYN%5CpCYIeQPbQQC%3A1775552282072"
}
url = "https://music.163.com/weapi/song/enhance/player/url/v1"
params = {
    "csrf_token": "bc4ab27142efa874b4952b58c689c682"
}
# data = {
#     "params": "3OP1K2j5znvjhqPFQ5jreW88tckgazahsUuf6YqOpHmbvvi7UOmfJQELkCCR9OkQPM3uN9LyLsYQDlasic5Ets8ks5/D0HymlV6mxfYz2Wd9VUA9soM4fXxGx4ER3i7HoxegCU3+H9tal3Scz8pXuci2+lLTZzzSupB368WOm7LxTvHy7koFnoyK9GQhzJJ3bYfmOG0aHvbOAtk3gT4XRg==",
#     "encSecKey": "2658acc0fcd342dbe50032ca3fee44b44a36da658d36105f7c339c2d6b0722349e5d5f31b127efe62dfb0d217f28455ffbcd1836782b57a21dfb9faa28364d98a2bf6161c9d32193ec12628cfc5eb271b03b54de78995e56643c47f0f93c0e2db717c224495916bf3654e4cb1a9d57977d560205a7ff8338b609261d5755eae8"
# }

t2 = {
    "csrf_token": "bc4ab27142efa874b4952b58c689c682",   # 登录后才有，否则为空
    "encodeType": "aac",
    "ids": "[2606329521]",  # 歌曲id
    "level": "exhigh"
}
t2 = json.dumps(t2, separators=(',', ':'))
# print(t2)

f = open("get_encSecKey.js", mode="r", encoding="utf-8")
js_code = f.read()
js = execjs.compile(js_code)
r2 = js.call("getEncSecKey", t2)
# print(r2)

form_data = {
    "params": r2['encText'],
    "encSecKey": r2['encSecKey'],
}
# print(form_data)
response = requests.post(url, headers=headers, cookies=cookies, params=params, data=form_data)

# print(response.text)
# print(response)

resp_json = response.json()
print(f"歌曲id:{resp_json['data'][0]['id']}\n下载地址:{resp_json['data'][0]['url']}")