# -*- coding: utf-8 -*-
"""
@File    : site.py
@Author  : Elliot Lin
@Date    : 2026/2/15 13:23
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""

from flask import Flask, jsonify, request
app = Flask(__name__)
@app.route('/login', methods=['POST', "GET"])
def index():

    print(request.json)
    return jsonify({"code": 200, "token": "d2d17e43-a8bb-4bba-ad84-7742aeb5a16b"})

if __name__ == '__main__':
    # 局域网内可访问
    app.run(host="192.168.247.107", debug=True)