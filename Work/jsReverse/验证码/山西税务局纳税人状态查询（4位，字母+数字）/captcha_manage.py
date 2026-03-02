# -*- coding: utf-8 -*-
"""
@File    : captcha_manage.py
@Author  : Elliot Lin
@Date    : 2026/3/2 12:35
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    :
"""
import base64
import os
import time
import requests
import json
from Image_OCR import recognize_captcha


def get_code_resp():
    t1 = str(int(time.time() * 1000))
    print(t1)

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
        # "requestid": "1772420909961",
        "requestid": t1,
        "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "x-b3-sampled": "1",
        "x-b3-spanid": "18cbcae426c3644f",
        "x-b3-traceid": "18cbcae426c3644f",
        # "x-tsf-client-timestamp": "1772420909961"
        "x-tsf-client-timestamp": t1
    }
    cookies = {
        "sajssdk_2015_cross_new_user": "1",
        "sensorsdata2015jssdkcross": "%7B%22distinct_id%22%3A%2219cac6a198ca44-09762658ea4c46-26011151-1881600-19cac6a198dcf2%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTljYWM2YTE5OGNhNDQtMDk3NjI2NThlYTRjNDYtMjYwMTExNTEtMTg4MTYwMC0xOWNhYzZhMTk4ZGNmMiJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%22%2C%22value%22%3A%22%22%7D%7D"
    }
    url = "https://etax.shanxi.chinatax.gov.cn:8443/xxbg/api/zhsffw/sxsq/yzm/generate"
    params = {
        "djxh": "",
        # "_": "1772420909961"
        "_": t1
    }
    data = {
        "Width": 100,
        "Height": 32,
        "CodeCount": 4,
        "Thickness": 2,
        "SxzlCode": "GGCX_NSRZTCX"
    }
    data = json.dumps(data, separators=(',', ':'))
    response = requests.post(url, headers=headers, cookies=cookies, params=params, data=data)

    # print(response.text)
    # print(response)
    return response

def get_captcha_id_and_image_data(response_obj):
    """
    从响应对象中提取验证码ID和图片的base64数据
    """
    json_data = response_obj.json() # 使用 .json() 方法更安全
    result_data = json_data["Response"]["Data"]["Result"]
    # 获取id
    img_id = result_data.get("id")
    # 获取图片 Base64 数据
    base64_string = result_data.get("imageBase64Data")
    # 处理 Base64 前缀
    base64_data = base64_string.split(",", 1)[1]
    return img_id, base64_data

def get_captcha_id(response):
    json_data = json.loads(response.text)
    return json_data["Response"]["Data"]["Result"]["id"]

def save_captcha(response, img_id):

    json_data = json.loads(response.text)
    result_data = json_data["Response"]["Data"]["Result"]
    # 获取图片id
    # img_id = result_data.get("id")
    # 获取图片数据
    base64_string = result_data.get("imageBase64Data")
    # 处理 Base64 前缀
    base64_data = base64_string.split(",", 1)[1]
    # 解码并保存图片
    image_data = base64.b64decode(base64_data)
    filename = f"{img_id}.png"
    with open(filename, "wb") as f:
        f.write(image_data)

    print(f"✅ 验证码图片已成功保存为: {os.path.abspath(filename)}")


def get_code(response_obj):
    """
        获取验证码响应，解码图片数据，并识别其内容
    """
    try:
        # 1. 从响应中提取ID和base64数据
        img_id, base64_data = get_captcha_id_and_image_data(response_obj)
        print(f"正在识别验证码图片 ID: {img_id}")

        # 2. 将base64字符串解码为二进制图像数据
        image_bytes = base64.b64decode(base64_data)

        # 3. 将二进制数据直接传递给 ddddocr 进行识别
        recognized_text = recognize_captcha(image_bytes)
        print(f"验证码识别结果: {recognized_text}")

        return str(recognized_text)

    except json.JSONDecodeError as e:
        print(f"解析验证码API响应JSON时出错: {e}")
        return None
    except Exception as e:
        print(f"识别验证码过程中发生错误: {e}")
        return None

