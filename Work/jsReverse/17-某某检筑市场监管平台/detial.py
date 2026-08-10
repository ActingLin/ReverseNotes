# -*- coding: utf-8 -*-
"""
@File    : detial.py
@Author  : Elliot Lin
@Date    : 2026/8/8 11:26
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import execjs
import loguru
import requests


headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Referer": "https://jzsc.mohurd.gov.cn/data/company/detail?id=002105291239451336",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "accessToken": "jkFXxgu9TcpocIyCKmJ+tfpxe/45B9dbWMUXhdY7vLXAjFMikfH0Pi4As+1ovechhpUUKvcMtoMqfGfwdLCb8g==",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "timeout": "30000",
    "v": "231012"
}
# cookies = {
#     "Hm_lvt_b1b4b9ea61b6f1627192160766a9c55c": "1786156537",
#     "HMACCOUNT": "E1FAE8CBADDB58F3",
#     "Hm_lpvt_b1b4b9ea61b6f1627192160766a9c55c": "1786159473"
# }
# caDetailList 企业资质资格  regStaffList 注册人员 compPerformanceListSys 工程项目
url = "https://jzsc.mohurd.gov.cn/APi/webApi/dataservice/query/comp/caDetailList"
params = {
    "qyId": "002105291239451336",
    "pg": "0",
    "pgsz": "15"
}
response = requests.get(url, headers=headers, params=params)

# print(response.text)
# print(response)
loguru.logger.success(response)

ctx = execjs.compile(open('./jzsc_aes.js', 'r', encoding='utf-8').read())
decode_resp = ctx.call('decode_resp', response.text)

loguru.logger.debug(decode_resp)