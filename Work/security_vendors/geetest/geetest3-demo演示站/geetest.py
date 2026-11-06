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
from util import get_now, jsonp_handle, download_img, restore_image, get_slide_x, get_gt3_slide_track

session = requests.Session(impersonate="chrome")
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
loguru.logger.success(jsonp_handle(gettype_resp.text))

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
c = get_resp_json.get('data').get('c')
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

loguru.logger.success(jsonp_handle(first_ajax_resp.text))

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
new_challenge = second_get_resp_dict.get('challenge')  # challenge最后多了两位
# 滑块验证的 aa 要用第二次 get.php 返回的 c、s
new_c = second_get_resp_dict.get('c')
new_s = second_get_resp_dict.get('s')
bg_url = second_get_resp_dict.get('bg')
fullbg_url = second_get_resp_dict.get('fullbg')
slice_url = second_get_resp_dict.get('slice')

loguru.logger.success(second_get_resp_dict)
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

# ===== 第六次请求 第二次访问ajax.php =====
second_ajax_url = 'https://api.geevisit.com/ajax.php'

# 轨迹 1.自己拖动"录制"积累轨迹库 2.算法生成
# https://github.com/Ais137/Recorder/blob/main/topic/Captcha
slide_x = get_slide_x()
_road, slide_time = get_gt3_slide_track(slide_x)
# calc_w3(gt, challenge, s, c, _road, slide_x, slide_time)
calc_third_w = execjs.compile(open('./calc_w3.js', 'r', encoding='utf-8').read()).call('calc_w3', gt, new_challenge, new_s,
                                                                                       new_c, _road, slide_x, slide_time)
loguru.logger.debug(f"滑动距离 x: {slide_x}, 滑动时间: {slide_time}")
loguru.logger.debug(f"滑动轨迹: {_road}")
loguru.logger.debug(f"第三个w值: {calc_third_w.get('w')}")
second_ajax_params = calc_third_w
second_ajax_params['callback'] = f"geetest_{get_now()}"

second_ajax_resp = session.get(second_ajax_url, params=second_ajax_params)
second_ajax_resp_dict = jsonp_handle(second_ajax_resp.text)
loguru.logger.success(second_ajax_resp_dict)

# ===== 第七次请求 验证通过 使用后续 =====
validate_url = 'https://demos.geetest.com/gt/validate-slide'
validate = second_ajax_resp_dict['validate']
# 必须用 dict 让请求库做标准 urlencode：浏览器 jQuery 会把 seccode 里的 | 编码成 %7C，
# 直接字符串拼接发送原始 | 会导致服务端解析 seccode 失败，返回「登录失败」
validate_data = {
    "geetest_challenge": new_challenge,
    "geetest_validate": validate,
    "geetest_seccode": f"{validate}|jordan",
}
# 模拟浏览器 jQuery $.ajax 会带的头
validate_headers = {
    "referer": "https://demos.geetest.com/slide-popup.html",
    "origin": "https://demos.geetest.com",
    "x-requested-with": "XMLHttpRequest",
}
validate_resp = session.post(validate_url, data=validate_data, headers=validate_headers)
loguru.logger.success(validate_resp.text)
