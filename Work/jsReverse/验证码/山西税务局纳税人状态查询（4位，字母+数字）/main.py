# -*- coding: utf-8 -*-
"""
@File    : main.py
@Author  : Elliot Lin
@Date    : 2026/3/2 16:32
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import requests
import json
import time
from captcha_manage import get_code_resp, get_code, get_captcha_id, save_captcha

time = str(int(time.time() * 1000))

headers = {
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Origin": "https://etax.shanxi.chinatax.gov.cn:8443",
    "Pragma": "no-cache",
    "Referer": "https://etax.shanxi.chinatax.gov.cn:8443/xxbg/view/zhsffw/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "accept": "application/json, text/plain, */*",
    "content-type": "application/json",
    "djxh": "undefined",
    # "requestid": "1772440242624",
    "requestid": time,
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "x-b3-sampled": "1",
    "x-b3-spanid": "5c11e24d2713b947",
    "x-b3-traceid": "5c11e24d2713b947",
    # "x-tsf-client-timestamp": "1772440242624"
    "x-tsf-client-timestamp": time
}
cookies = {
    "sajssdk_2015_cross_new_user": "1",
    "sensorsdata2015jssdkcross": "%7B%22distinct_id%22%3A%2219cac6a198ca44-09762658ea4c46-26011151-1881600-19cac6a198dcf2%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTljYWM2YTE5OGNhNDQtMDk3NjI2NThlYTRjNDYtMjYwMTExNTEtMTg4MTYwMC0xOWNhYzZhMTk4ZGNmMiJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%22%2C%22value%22%3A%22%22%7D%7D"
}
url = "https://etax.shanxi.chinatax.gov.cn:8443/xxbg/api/zhsffw/ggcx/nsrztcx/queryNsrztcxList"
params = {
    "djxh": "",
    # "_": "1772440242624"
    "_": time
}

data = {
    "Nsrsbh": "914403001922038216", # 纳税人识别号 恒大地产集团有限公司 统一社会信用代码：91440101231245152Y
    "Nsrmc": "",    # 纳税人名称
    "Code": "CLHH", # 识别的验证码
    "Id": "Captcha_b14d4689-d159-41af-936b-9906e839733e"    # 验证码图片id
}

# 获取验证码
resp = get_code_resp()
# 获取验证码id
captcha_id = get_captcha_id(resp)
# 保存验证码图片
# save_captcha(resp, captcha_id)
# 识别验证码
Code = get_code(resp)

data["Code"] = Code
data["Id"] = captcha_id

data = json.dumps(data, separators=(',', ':'))
response = requests.post(url, headers=headers, cookies=cookies, params=params, data=data)

# print(response.text)
# print(response)

# 解析查询得到的数据
def parse_data(response):
    try:
        # 1. 将字符串解析为Python字典
        json_data = json.loads(response.text)

        # 2. 检查API是否成功返回数据
        success = json_data.get("Response", {}).get("Data", {}).get("Success")
        if not success:
            error_msg = json_data.get("Response", {}).get("Data", {}).get("Error", {}).get("message", "未知错误")
            print(f"API返回错误: {error_msg}")
            exit()

        # 3. 提取数据列表
        results = json_data["Response"]["Data"]["Result"]

        print(f"共查询到 {len(results)} 条记录。")
        print("-" * 80)

        # 4. 遍历并打印每条记录
        for record in results:
            nsrsbh = record.get('nsrsbh', 'N/A')  # 如果键不存在，返回 'N/A'
            nsrmc = record.get('nsrmc', 'N/A')
            swjgmc = record.get('swjgmc', 'N/A')
            nsrztMc = record.get('nsrztMc', 'N/A')

            print(f"纳税人识别号: {nsrsbh}")
            print(f"纳税人名称: {nsrmc}")
            print(f"主管税务机关: {swjgmc}")
            print(f"纳税人状态: {nsrztMc}")
            print("-" * 40)

    except json.JSONDecodeError as e:
        print(f"解析JSON数据时出错: {e}")
    except KeyError as e:
        print(f"响应数据结构不符合预期，缺少必要的键: {e}")
    except Exception as e:
        print(f"处理数据时发生意外错误: {e}")

parse_data(response)