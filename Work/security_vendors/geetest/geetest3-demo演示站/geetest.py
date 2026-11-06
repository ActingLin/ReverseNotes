# -*- coding: utf-8 -*-
"""
@File    : geetest.py
@Author  : Elliot Lin
@Date    : 2026/10/19 12:50
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
from curl_cffi import requests
import execjs
import loguru
from urllib.parse import urljoin
from util import get_now, jsonp_handle, download_img, restore_image


session = requests.Session()
session.headers[
    'user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'

# ===== 第一次请求 注册验证码 =====
register_url = f'https://demos.geetest.com/gt/register-slide?t={get_now()}'
register_resp = session.get(register_url)
loguru.logger.info(register_resp.json())
register_dict = register_resp.json()
gt = register_dict['gt']
challenge = register_dict['challenge']

# ===== 第二次请求 访问gettype =====
gettype_url = 'https://apiv6.geetest.com/gettype.php'
gettype_params = {
    "gt": gt,
    "callback": f"geetest_{get_now()}"
}
gettype_resp = session.get(gettype_url, params=gettype_params)
loguru.logger.success(gettype_resp.text)

# ===== 第三次请求 访问第一次get.php =====
first_get_url = 'https://apiv6.geetest.com/get.php'

first_get_dist = execjs.compile(open('./calc_w.js', 'r', encoding='utf-8').read()).call('calc_first_w', gt, challenge)
calc_first_w = first_get_dist['msg'].get('w')
aeskey = first_get_dist['aeskey']
finger_print = first_get_dist['finger_print']
loguru.logger.debug(f"第一个w值: {calc_first_w}")

first_get_params = {
    "gt": gt,
    "challenge": challenge,
    "lang": "zh-cn",
    "pt": "0",
    "client_type": "web",
    "w": calc_first_w,
    "callback": f"geetest_{get_now()}"
}

get_resp = session.get(first_get_url, params=first_get_params)

get_resp_json = jsonp_handle(get_resp.text)
s = get_resp_json.get('data').get('s')

loguru.logger.success(jsonp_handle(get_resp.text))

# ===== 第四次请求 第一次访问ajax.php =====
calc_second_w = execjs.compile(open('./calc_w2.js', 'r', encoding='utf-8').read()).call('calc_second_w', gt, challenge,
                                                                                        aeskey, s, finger_print)
loguru.logger.debug(f"第二个w值: {calc_second_w}")

first_ajax_url = 'https://api.geevisit.com/ajax.php'
first_ajax_params = {
    "gt": gt,
    "challenge": challenge,
    "lang": "zh-cn",
    "pt": "0",
    "client_type": "web",
    "w": calc_second_w,
    "callback": f"geetest_{get_now()}"
}

first_ajax_resp = session.get(first_ajax_url, params=first_ajax_params)

loguru.logger.success(first_ajax_resp.text)

# ===== 第五次请求 第二次访问get.php =====
second_get_url = 'https://api.geevisit.com/get.php'

second_get_params = {
    "is_next": "true",
    "type": "slide3",
    "gt": gt,
    "challenge": challenge,
    "lang": "zh-cn",
    "https": "true",
    "protocol": "https://",
    "offline": "false",
    "product": "popup",
    "api_server": "api.geevisit.com",
    "isPC": "true",
    "autoReset": "true",
    "width": "100%",
    "callback": f"geetest_{get_now()}"
}

second_get_resp = session.get(second_get_url, params=second_get_params)

second_get_resp_dict = jsonp_handle(second_get_resp.text)
new_chellange = second_get_resp_dict.get('chellange')  # chellange最后多了两位
bg_url = second_get_resp_dict.get('bg')
fullbg_url = second_get_resp_dict.get('fullbg')
slice_url = second_get_resp_dict.get('slice')

loguru.logger.debug(second_get_resp_dict)
# ===== 下载滑块图片并还原 =====
static_url = 'https://static.geetest.com'
bg_url = urljoin(static_url, bg_url)
fullbg_url = urljoin(static_url, fullbg_url)
slice_url = urljoin(static_url, slice_url)

loguru.logger.info(bg_url)
loguru.logger.info(fullbg_url)
loguru.logger.info(slice_url)

download_img("bg.jpg", bg_url, session)
download_img("fullbg.jpg", fullbg_url, session)
download_img("slice.jpg", slice_url, session)

restore_image("bg.jpg")
restore_image("fullbg.jpg")



