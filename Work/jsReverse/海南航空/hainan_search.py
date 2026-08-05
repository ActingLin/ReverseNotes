import requests
import json
import execjs
import loguru
from datetime import datetime

# 数据库存储模块
from flight_storage import init_db, save_from_api_response


headers = {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "appver": "10.16.2",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "ekingcode": "THhDTnE4ejMzT0piSDF5aSBcqbLlfIgPjKXGgL0XuL4gGnoyawEosfq7kTLUwK74W7T683GP+luKMpyMrkulWvycnKqrnF/gTPVzXkXrbjDnHIaJbaeqPgatMjI/Aijl",
    "hna-app": "APP",
    "hna-channel": "HTML5",
    "origin": "https://m.hnair.com",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://m.hnair.com/",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36"
}
cookies = {
    "abymg_id": "1_F44C716B6996F547E825CFE32805C9E834C825B299A5EEA4C9EC260AC783EA08",
    "gdp_user_id": "gioenc-0cb37171%2C1b45%2C5c21%2Ccb63%2C00e446e75444",
    "8fe1e3514bafd525_gdp_session_id": "40aa11f8-efe5-4ad1-96c3-ca012f564b01",
    "gdpr_state": "open",
    "arialoadData": "false",
    "8fe1e3514bafd525_gdp_session_id_40aa11f8-efe5-4ad1-96c3-ca012f564b01": "true"
}
url = "https://app.hnair.com/ticket/lfs/airCtLowFareSearch"
params = {
    "hnairSign": "DBF836AAAA702D0C73394B16F411ED1E47693230"
}
data = {
    "common": {
        "sname": "Win32",
        "sver": "5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36",
        "schannel": "HTML5",
        "caller": "HTML5",
        "slang": "zh-CN",
        "did": "gioenc-0cb37171,1b45,5c21,cb63,00e446e75444",
        "stime": 1784799630974,
        "szone": -480,
        "aname": "com.hnair.spa.web.standard",
        "aver": "10.16.2",
        "akey": "9E4BBDDEC6C8416EA380E418161A7CD3",
        "abuild": "64832",
        "atarget": "standard",
        "slat": "slat",
        "slng": "slng",
        "gtcid": "defualt_web_gtcid",
        "riskToken": "6a61e07e1u1Xo9y9ZXo9Cga6mJJQkuEECm9Fnkp1",
        "captchaToken": "",
        "blackBox": "1784799358911WPHyMM3L71i45",
        "validateToken": "",
        "sens": "%hna%gvnva4gE3sEXviyHG5bmUreTHKEOjexucBqAfND7IUo="
    },
    "data": {
        "originDestinations": [
            {
                "departureDate": "2026-07-28",  # 出发日期
                "destination": "SZX",           # 目的地    
                "origin": "CSX",                # 出发地
                "destinationType": "1",
                "originType": "1"
            }
        ],
        "passenger": "ADT:1,CNN:1,INF:1",
        "_referer": "/book/query/start"
    }
}

header_info = {
    "appver": "10.16.2",
    "hna-app": "APP",
    "hna-channel": "HTML5",
    "ekingCode": "THhDTnE4ejMzT0piSDF5aSBcqbLlfIgPjKXGgL0XuL4gGnoyawEosfq7kTLUwK74W7T683GP+luKMpyMrkulWvycnKqrnF/gTPVzXkXrbjDnHIaJbaeqPgatMjI/Aijl"
}
sign_data = {**data['common'], **data['data']}

ctx = execjs.compile(open("./hmac_sha1.js", "r", encoding="utf-8").read())
params['hnairSign'] = ctx.call('get_hnairSign', header_info, sign_data)
loguru.logger.info(params)

data = json.dumps(data, separators=(',', ':'))
response = requests.post(url, headers=headers, cookies=cookies, params=params, data=data)

# loguru.logger.info(response.json())
# loguru.logger.info(response)

resp_json = response.json()
success = resp_json.get('success')
if success:
    crawl_time = datetime.now()
    count = resp_json.get("data", {}).get("originDestinations", [{}])[0].get("airItineraries")
    loguru.logger.info(f"请求成功，找到 {len(count)} 个航班")

    # ── 入库 ──
    try:
        saved = save_from_api_response(resp_json, crawl_time)
        loguru.logger.info(f"已入库 {saved} 条航班数据")
    except Exception as e:
        loguru.logger.error(f"入库失败: {e}")
else:
    errorMessage = resp_json.get('errorMessage')
    loguru.logger.error(f"请求失败: {errorMessage}")