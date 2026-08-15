# -*- coding: utf-8 -*-
"""
@File    : search.py
@Author  : Elliot Lin
@Date    : 2026/8/11 13:41
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import json
import requests
import blackboxprotobuf
import loguru

headers = {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/grpc-web+proto",  # 判断使用protobuf
    "cookies": "CASTGC=TGT-3510708-0Bf61EFg6Gu7SLNsnMRoeaCYIqkHCCZcUa7rv1kCjZi32Z4UxS-auth-iploginservice-6f7888fb99-4c7gz;CASTGCSpecial=;",
    "httpreferer": "https://www.wanfangdata.com.cn/",
    "origin": "https://s.wanfangdata.com.cn",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://s.wanfangdata.com.cn/paper?q=%E7%88%AC%E8%99%AB&p=1",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "x-grpc-web": "1",
    "x-user-agent": "grpc-web-javascript/0.1"
}
cookies = {
    "CASTGC": "TGT-3510708-0Bf61EFg6Gu7SLNsnMRoeaCYIqkHCCZcUa7rv1kCjZi32Z4UxS-auth-iploginservice-6f7888fb99-4c7gz",
    "WFKS.Auth": "%7B%22Context%22%3A%7B%22AccountIds%22%3A%5B%22Group.hnsxy%22%2C%22GTimeLimit.hnsxy%22%5D%2C%22Data%22%3A%5B%7B%22Key%22%3A%22Group.hnsxy.DisplayName%22%2C%22Value%22%3A%22%E6%B9%96%E5%8D%97%E5%B7%A5%E5%95%86%E5%A4%A7%E5%AD%A6%22%7D%5D%2C%22SessionId%22%3A%22606f6c0b-4b3e-485e-b7e2-6d91bf796c23%22%2C%22Sign%22%3A%22CMomo%5C%2FQHM5UhYLxnFYG16oJfuN6wIfIZslB9sGSVMI0pvALZXQkBmxZkqUAWC03e%22%7D%2C%22LastUpdate%22%3A%222026-08-11T05%3A28%3A32Z%22%2C%22TicketSign%22%3A%22cdUwAcyQEPQisbWq4qnZjA%3D%3D%22%2C%22UserIp%22%3Anull%7D",
    "zh_choose": "n",
    "UM_distinctid": "19fef4b489f7cf-0ed979d89f613b-26011151-1cb600-19fef4b48a096f",
    "Hm_lvt_838fbc4154ad87515435bf1e10023fab": "1786426116",
    "HMACCOUNT": "E1FAE8CBADDB58F3",
    "Hm_lpvt_838fbc4154ad87515435bf1e10023fab": "1786426785",
    "behavior_trace_id": "trace_1786426784999_1nyq49io",
    "behavior_session_id": "session_1786426785000_6a3p3sxo",
    "behavior_last_active": "1786426785000",
    "_pk_id.1.d704": "5a2086cbc1d3efd6.1786426785.",
    "_pk_ses.1.d704": "1"
}
url = "https://s.wanfangdata.com.cn/SearchService.SearchService/search"
# data = {
#     "\\u0000\\u0000\\u0000\\u0000": "\n$\n\\u0005paper\\u0012\\u0006爬虫(\\u00010\\u0014B\\u0001\\u0000H\\u0001b\\u0002pcj\\u0006search\\u0010\\u0001\"\\u0007AI_READ\"\nAI_EXTRACT"
# }

payload_data = {
    "1": {
        "1": "paper",
        "2": "爬虫",    # 搜索内容
        "5": 3,                 # 页码
        "6": 20,                # 结果数目
        "8": "\u0000",
        "9": 1,
        "12": {
            "14": 99
        },
        "13": "search"
    },
    "2": 1,
    "4": [
        "AI_READ",
        "AI_EXTRACT"
    ]
}

payload_data_type = {'1': {'field_order': ['1', '2', '5', '6', '8', '9', '12', '13'], 'message_typedef': {'1': {'type': 'string'}, '2': {'type': 'string'}, '5': {'type': 'int'}, '6': {'type': 'int'}, '8': {'type': 'string'}, '9': {'type': 'int'}, '12': {'field_order': ['14'], 'message_typedef': {'14': {'type': 'int'}}, 'type': 'message'}, '13': {'type': 'string'}}, 'type': 'message'}, '2': {'type': 'int'}, '4': {'type': 'string'}}
new_protobuf_data = blackboxprotobuf.encode_message(payload_data, payload_data_type)

data = bytes([0, 0, 0, 0, len(new_protobuf_data)]) + bytes(new_protobuf_data)
response = requests.post(url, headers=headers, cookies=cookies, data=data)
message_json, type_def = blackboxprotobuf.protobuf_to_json(response.content[5:])
# loguru.logger.debug(f"resp ==> {message_json}")
data_dict = json.loads(message_json)  # 转为字典
formatted = json.dumps(data_dict, ensure_ascii=False, indent=2)
loguru.logger.debug(f"resp ==> {formatted}")

