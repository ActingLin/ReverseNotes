# -*- coding: utf-8 -*-
"""
@File    : main.py
@Author  : Elliot Lin
@Date    : 2026/3/8 20:58
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import random
import time
import json
import requests
import re
from loguru import logger


# 第一次请求，获取ak
def get_ak():
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Pragma": "no-cache",
        "Referer": "https://www.hb56.com/Login.aspx",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\""
    }
    url = "https://www.hb56.com/Login.aspx"
    params = {
        "type": "pw"
    }
    response = requests.get(url, headers=headers, params=params)
    ak = re.search(r"appId = '(?P<ak>.*?)'", response.text).group('ak')
    logger.success(f"成功获取ak值:{ak}")

    return ak

# 随机生成第二次请求参数aid
def generate_aid():
    # return "dx-" + (new Date).getTime() + "-" + Math.floor(1e8 * Math.random()) + "-" + (t | | i[9])
    # "dx-" + 时间戳 + "-" + 8位随机数 + "-1"
    aid = "dx-" + str(int(time.time() * 1000)) + "-" + str(random.randint(55555555, 99999999)) + "-1"
    logger.success(f"成功生成aid值:{aid}")
    return aid

# 第二次请求，获取滑块验证图片url等信息
def api_a(ak, aid):

    headers = {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "origin": "https://www.hb56.com",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "referer": "https://www.hb56.com/",
        "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
    }
    url = "https://captcha.gdtspace.com/api/a"
    params = {
        # "aid": "dx-1772980346684-56643032-1",
        # "ak": "90762f230adee6af3957d9a029269461",
        "aid": aid,
        "ak": ak,
        "c": "",
        "de": "0",
        "h": "150",
        "jsv": "v1.4.0(81)",
        "lf": "0",
        "m": "",
        "s": "50",
        "sid": "",
        "tpc": "",
        "uid": "",
        "w": "300",
        "wp": "1",
        "dt": "1",
        "wtf": "false",
        # "_r": "0.8458683138737605"
        "_r": str(random.random())
    }
    response = requests.get(url, headers=headers, params=params)
    logger.info(f"成功获取滑块图片信息：{response.text}")

    return response.json()

# 生成随机lid
def generate_lid():
    char_map = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    lid = str(int(time.time() * 1000)) + ''.join(random.choice(char_map) for _ in range(32))
    return lid

# 使用lid加密param
def get_param(t):
    if not t:
        return ""

    g = ""
    p = 0

    while p < len(t):
        # 使用 None 作为哨兵值来模拟 JavaScript 中的 NaN
        f_val = ord(t[p]) if p < len(t) else None
        p += 1
        c_val = ord(t[p]) if p < len(t) else None
        p += 1
        s_val = ord(t[p]) if p < len(t) else None
        p += 1

        # 如果是 NaN (None)，则位运算结果为 0；否则进行正常计算
        f = 0 if f_val is None else f_val
        c = 0 if c_val is None else c_val
        s = 0 if s_val is None else s_val

        d = f >> 2
        h = ((3 & f) << 4) | (c >> 4)
        v = ((15 & c) << 2) | (s >> 6)
        l = 63 & s

        # 模拟JavaScript中的isNaN处理
        if c_val is None: # 检查原始值是否为 None (即 NaN)
            v = 64
            l = 64
        elif s_val is None: # 检查原始值是否为 None (即 NaN)
            l = 64

        n = 'S0DOZN9bBJyPV-qczRa3oYvhGlUMrdjW7m2CkE5_FuKiTQXnwe6pg8fs4HAtIL1x='
        g = g + n[d] + n[h] + n[v] + n[l]

    return g
# 第一次请求c1得到lid
def c1_get_lid(ak):
    # 第一次c1请求没有lid,随机生成一个并加密param,再请求得到lid参与第二次c1请求中的param加密
    first_lid = generate_lid()
    c1_get_param_mw = {
        "cache": True,
        "lid": first_lid,
        "lidType": "0",
        "appKey": ak
    }
    param = get_param(json.dumps(c1_get_param_mw, ensure_ascii=False, separators=(',', ':')))
    headers = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "origin": "https://www.hb56.com",
        "param": param,
        "pragma": "no-cache",
        "priority": "u=1, i",
        "referer": "https://www.hb56.com/",
        "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
    }
    url = "https://captcha.gdtspace.com/udid/c1"
    params = {
        "": ""
    }
    response = requests.get(url, headers=headers, params=params)
    logger.debug(f"成功获取c1接口get请求的lid：{response.text}")

    return response.json()['data']

def c1_get_token(ak, lid):
    c1_get_two_param_mw = {
        # "lid": "dbe5cefee79fb419b21f4097fda5b46897c3c7de1dadde75081f75ae55adfef390e3b3b9",
        "lid": lid,
        "lidType": 1,
        "ua": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "np": "Win32",
        "dm": 8,
        "cc": "unknown",
        "hc": 12,
        "lug": "zh-CN",
        "lugs": "zh-CN;zh",
        "dnt": "unknown",
        "ce": 1,
        "rp": "386207752cb0f2afd038b54c8f2b1b29",
        "mts": "b2f0f0a1934eb1cd8e16d018a2c81051",
        "cd": 24,
        "res": "1680;1120",
        "ar": "1680;1072",
        "to": -480,
        "pr": 1.5,
        "ls": 1,
        "ss": 1,
        "ind": 1,
        "ab": 0,
        "od": 0,
        "adb": False,
        "ts": "10;false;false",
        "web": "d4f6596ca96a890e2fe8f78af282072f",
        "gi": "Google Inc. (AMD);ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001638) Direct3D11 vs_5_0 ps_5_0, D3D11)",
        "cpt": "24ad9cc615237606f491b369d04ed513",
        "hlb": False,
        "hlo": True,
        "hlr": False,
        "hll": False,
        "ct": 34,
        # "appKey": "90762f230adee6af3957d9a029269461"
        "appKey": ak
    }
    param = get_param(json.dumps(c1_get_two_param_mw, ensure_ascii=False, separators=(',', ':')))

    headers = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "origin": "https://www.hb56.com",
        "param": param,
        "pragma": "no-cache",
        "priority": "u=1, i",
        "referer": "https://www.hb56.com/",
        "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
    }
    url = "https://captcha.gdtspace.com/udid/c1"
    params = {
        "": ""
    }
    response = requests.get(url, headers=headers, params=params)
    logger.debug(f"成功获取c1接口第二次get请求，最终接口用到的data: {response.text}")

    return response.json()['data']


if __name__ == '__main__':
    # 获取ak
    ak = get_ak()
    # 随机生成aid
    aid = generate_aid()
    # 获取滑块验证图片信息
    img_infos = api_a(ak, aid)
    # 提取背景图和滑块url
    bg_url = 'https://captcha.gdtspace.com' + img_infos["p1"]
    slice_url = 'https://captcha.gdtspace.com' + img_infos["p2"]

    # 第一次请求c1得到lid
    second_lid = c1_get_lid(ak)

    token = c1_get_token(ak, second_lid)


