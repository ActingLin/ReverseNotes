# -*- coding: utf-8 -*-
"""
@File    : 1.pyexejs.py
@Author  : Elliot Lin
@Date    : 2026/4/11 18:20
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import subprocess
from functools import partial

subprocess.Popen = partial(subprocess.Popen, encoding='utf-8')

import execjs

# js执行环境
# print(execjs.get())

with open('demo.js', mode='r', encoding='utf-8') as f:
    js_code = f.read()

run_js = execjs.compile(js_code)

result = run_js.eval('func(2, 3)')
result2 = run_js.call('func', 2, 3)
print(result)
print(result2)

result3 = run_js.call('func_str', '传个中文')
print(result3)