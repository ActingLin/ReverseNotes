# -*- coding: utf-8 -*-
"""
@File    : app.py
@Author  : Elliot Lin
@Date    : 2026/3/13 21:43
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 请求这个文件的接口  返回可用的ip
"""
from flask import Flask
from proxy_redis import ProxyRedis
# 实例化flask
app = Flask(__name__)
@app.route('/')
def index():
    p_r= ProxyRedis()
    ip = p_r.get_ip()
    if ip:
        return ip
    return 'wow'

def run():
    # app.run(debug=True)
    app.run(debug=False)

if __name__ == '__main__':
    app.run()   # 运行flask