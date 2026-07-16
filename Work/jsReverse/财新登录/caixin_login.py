# -*- coding: utf-8 -*-
"""
@File    : caixin_login.py
@Author  : Elliot Lin
@Date    : 2026/7/16 16:00
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 密码使用AES加密，通过webpack实现
"""
import execjs
import requests
import loguru
import json
import subprocess
import tempfile
import os

headers = {
    "Accept": "*/*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Referer": "https://u.caixin.com/",
    "Sec-Fetch-Dest": "script",
    "Sec-Fetch-Mode": "no-cors",
    "Sec-Fetch-Site": "same-site",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
cookies = {
    "CX_COOKIE_TAG": "1784188299438",
    "ENTITY_ID": "",
    "CX_FROM": "null",
    "GUID": "788528510",
    "T_GUID": "1784188299439",
    "GID30": "788528510",
    "point": "1784217599000",
    "FROM_CHINA": "true",
    "sidebarStatus": "1",
    "lastTime": "1784190135762",
    "firstTime": "1784190135762",
    "ENTITY_COUNT": "5",
    "LOGIN_QR_CODE": "AoRSm55iTWguCScGkGyX7GxyMVCbInnc"
}
url = "https://gateway.caixin.com/api/ucenter/user/v1/loginJsonp"

# def call_js_function(js_file_path, function_name, *args):
#     """
#     通过 Node.js 调用 JS 函数，使用 UTF-8 编码，避免中文 Windows 下 GBK 编码错误。
#     """
#     js_path = os.path.abspath(js_file_path).replace('\\', '/')
#     args_json = json.dumps(list(args))
#
#     node_script = f'''var fs = require('fs');
#         var vm = require('vm');
#         var code = fs.readFileSync('{js_path}', 'utf-8');
#         vm.runInThisContext(code);
#         var result = {function_name}.apply(null, {args_json});
#         console.log(result);
#         '''
#
#     with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False, encoding='utf-8') as f:
#         f.write(node_script)
#         temp_path = f.name
#
#     try:
#         result = subprocess.run(
#             ['node', temp_path],
#             capture_output=True,
#             encoding='utf-8',
#             timeout=30
#         )
#         if result.returncode != 0:
#             raise RuntimeError(f"Node.js 错误:\n{result.stderr}")
#         return result.stdout.strip()
#     finally:
#         os.unlink(temp_path)

# encode_pwd = call_js_function('./caixin.js', 'encode_pwd', '123456')

ctx = execjs.compile(open('caixin_webpack.js', 'r', encoding='utf-8').read())
pwd = 'pwd123456'
encode_pwd2 = ctx.call('encode_pwd', pwd)
loguru.logger.success(f'{pwd} 加密得到: {encode_pwd2}')

params = {
    "account": "18866669999",
    "password": encode_pwd2,
    "deviceType": "5",
    "unit": "1",
    "areaCode": "+86",
    "extend": "{\"resource_article\":\"\"}",
    "callback": "__caixincallback1784190164005"
}
response = requests.get(url, headers=headers, cookies=cookies, params=params)

print(response.text)
print(response)