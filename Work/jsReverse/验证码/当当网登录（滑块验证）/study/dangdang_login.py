# -*- coding: utf-8 -*-
"""
@File    : dangdang_login.py
@Author  : Elliot Lin
@Date    : 2026/3/4 15:17
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import random

import execjs
from requests import Session
import time
import ddddocr

# 创建一个会话实例
with (Session() as session):

    session.headers = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://login.dangdang.com",
        "Pragma": "no-cache",
        "Referer": "https://login.dangdang.com/?returnurl=https%3A%2F%2Fwww.dangdang.com%2F",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0",
        "sec-ch-ua": "\"Chromium\";v=\"142\", \"Microsoft Edge\";v=\"142\", \"Not_A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\""
    }
    # cookies由session管理
    # cookies = {
    #     "__permanent_id": "20260304151407338124938566670200020",
    #     "__rpm": "%7Clogin_page...1772608885336",
    #     "__visit_id": "20260304161710226230933809987783708",
    #     "__out_refer": "",
    #     "__trace_id": "20260304161710226240917286962526784",
    #     "JSESSIONID": "519A484614F999879407611A4DD726C6"
    # }

    # 获取rankey
    # "https://login.dangdang.com/api/customer/loginapi/getRankey"
    url = "https://login.dangdang.com/api/customer/loginapi/getRankey"
    # 需要逆向sign
    # data = {
    #     "t": "1772612231498",
    #     "ct": "pc",
    #     "permanent_id": "20260304151407338124938566670200020",
    #     "requestId": "",
    #     "sign": "Hnw9dCCXqtfyj42FqVgY8p2q0o29i31dfdVnpG1YheUx4mX92PU0GIKy+KW0H9Vb"
    # }
    data = {
        "ct": "pc",
        "permanent_id": "20260304151407338124938566670200020",
        "t": f"{int(time.time() * 1000)}",
    }
    # ct=pc&permanent_id=20260304151407338124938566670200020&t=1772612245471 ==> md5 ==> aes ==> addSign
    data = execjs.compile(open('dangdang_aes.js', 'r', encoding='utf-8').read()).call('addSign', data, "")
    data['requestId'] = ""
    data = '&'.join([k + '=' + v for k, v in data.items()])
    resp = session.post(url, data=data)

    session.cookies['JSESSIONID'] = resp.cookies.get_dict()['JSESSIONID']
    rankey = resp.json()['rankey']
    requestId = resp.json()['requestId']
    print(f'密钥获取成功, rankey:{rankey}, requestId:{requestId}')

    # 获取滑块图片
    # https://login.dangdang.com/api/customer/loginapi/getSlidingVerifyCode
    url1 = "https://login.dangdang.com/api/customer/loginapi/getSlidingVerifyCode"
    data1 = {
        "ct": "pc",
        "permanent_id": "20260304151407338124938566670200020",
        "requestId": requestId,
        "situation": "login",
        "t": f'{int(time.time() * 1000)}'
    }
    data1 = execjs.compile(open('dangdang_aes.js', 'r', encoding='utf-8').read()).call('addSign', data1, rankey)
    resp1 = session.post(url1, data=data1)

    session.cookies['JSESSIONID'] = resp1.cookies.get('JSESSIONID')
    result1 = resp1.json()
    print(result1)
    print("获取滑块图片:", result1['errorMsg'])

    # 保存滑块图片
    slideImg = result1['data']['slideImg']
    bgImg = result1['data']['bgImg']

    with open('slideImg.png', 'wb') as f:
        f.write(session.get(slideImg).content)

    with open('bgImg.png', 'wb') as f:
        f.write(session.get(bgImg).content)
    print('滑块图片保存成功！')

    # 获取滑块距离
    det = ddddocr.DdddOcr(det=False, ocr=False, show_ad=False)

    with open('slideImg.png', 'rb') as f:
        target_bytes = f.read()

    with open('bgImg.png', 'rb') as f:
        background_bytes = f.read()

    slide_match = det.slide_match(target_bytes, background_bytes, simple_target=True)['target']
    slide_x = int(slide_match[0] * 0.8578431372549019) / 350  # 350 / 408 = 0.8578431372549019

    # 参数加密
    slide_obj = '{"x":' + str(slide_x) + ',"y":' + str(result1['data']['y']) + '}'
    point_json = execjs.compile(open('dangdang_aes.js', 'r', encoding='utf-8').read()
                                ).call('Y', slide_obj, result1['data']['encryptKey'])
    print('等待5秒.....')
    time.sleep(5)

    # 滑块验证
    # "https://login.dangdang.com/api/customer/loginapi/checkSlidingVerifyCode"
    params2 = {
        "t": f"{int(time.time() * 1000)}",
        "ct": "pc",
        "permanent_id": "20260304151407338124938566670200020",
        "requestId": requestId,
        "situation": "login",
        "verifyToken": result1['data']['token'],
        "slide_cost_time": random.randint(2700,3300),
        "need_new_verifydata": "0",
        "point_json": point_json,
    }

    data2 = execjs.compile(open('dangdang_aes.js', 'r', encoding='utf-8').read()).call('addSign', params2, rankey)
    url2 = "https://login.dangdang.com/api/customer/loginapi/checkSlidingVerifyCode"
    resp2 = session.post(url2, data=data2).json()

    print('滑块验证: ', resp2['errorMsg'])

    # 登录
    check_code = resp2['data']['checkCode']
    username = '17264469761'
    password = '1234567'
    rankeys = execjs.compile(open('dangdang_aes.js', 'r', encoding='utf-8').read()).call('L', "cXJjb2RlX3BAc3N3MHJkSw==") # qrcode_p@ssw0rdK
    password = execjs.compile(open('dangdang_aes.js', 'r', encoding='utf-8').read()).call('Y', password, rankeys)
    data3 = {
        "t": f'{int(time.time() * 1000)}',
        "ct": "pc",
        "permanent_id": "20260304151407338124938566670200020",
        "requestId": requestId,
        "username": username,
        "password": password,
        "autokey": "off",
        "token": result1['data']['token'],
        "check_code": check_code,
        "check_code_type": "1",
        # "sign": "NHIASBIO4lFqmy9/aaRhz3kbkCd059PS90BI4zDg6vmL3368DGuInGL2UrDebQNF"
    }
    data3 = execjs.compile(open('dangdang_aes.js', 'r', encoding='utf-8').read()).call('addSign', data3, rankey)
    url3 = "https://login.dangdang.com/api/customer/loginapi/accountLogin"
    response = session.post(url3, data=data3)
    print(response.text)