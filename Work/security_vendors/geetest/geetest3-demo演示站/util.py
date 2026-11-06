# -*- coding: utf-8 -*-
"""
@File    : util.py
@Author  : Elliot Lin
@Date    : 2026/11/1 02:51
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import time
import re
import json
import loguru


def get_now():
    return int(time.time() * 1000)

# 处理jsonp
def jsonp_handle(text):
    jsonp_re = re.compile(r'\((?P<code>.*)\)', re.S)
    jsonp_str = jsonp_re.search(text, re.S).group('code')
    return json.loads(jsonp_str)


def download_img(name, url, session):
    resp = session.get(url)
    with open(name, 'wb') as f:
        f.write(resp.content)
    loguru.logger.info(f"图片{name}下载成功")


# function $_BEN(t, e) {
#   t = t["$_CGE"], e = e["$_CGE"];
#   var n = t["width"],
#     r = t["height"],
#     i = h["createElement"]("canvas");
#   i["width"] = n, i["height"] = r;
#   var o = i["getContext"]("2d");
#   o["drawImage"](t, 0, 0);
#   var s = e["getContext"]("2d");
#   e["height"] = r, e["width"] = 260;
#   for (var a = r / 2, _ = 0; _ < 52; _ += 1) {
#     var c = Ut[_] % 26 * 12 + 1,
#       u = 25 < Ut[_] ? a : 0,
#       l = o["getImageData"](c, u, 10, a);
#     s["putImageData"](l, _ % 26 * 10, 25 < _ ? a : 0);
#   }
# }
# Ut = function () {
#     for (var t, e = "6_11_7_10_4_12_3_1_0_5_2_9_8"["split"]("_"), n = [], r = 0; r < 52; r++) t = 2 * parseInt(e[parseInt(r % 26 / 2)]) + r % 2, parseInt(r / 2) % 2 || (t += r % 2 ? -1 : 1), t += r < 26 ? 26 : 0, n["push"](t);
#     return n;
# }()
# 还原乱序图片
def restore_image(path):
    from PIL import Image
    old_image = Image.open(path)
    new_image = Image.new("RGB", (260, 160))
    Ut = [
        39, 38, 48, 49, 41, 40, 46, 47, 35, 34, 50,
        51, 33, 32, 28, 29, 27, 26, 36, 37, 31, 30,
        44, 45, 43, 42, 12, 13, 23, 22, 14, 15, 21,
        20, 8, 9, 25, 24, 6, 7, 3, 2, 0, 1,
        11, 10, 4, 5, 19, 18, 16, 17
    ]
    r = 160
    a = r // 2
    for _ in range(52):
        c = Ut[_] % 26 * 12 + 1
        u = a if 25 < Ut[_] else 0
        l = old_image.crop((c, u, c + 10, u + a))
        x = _ % 26 * 10
        y = a if 25 < _ else 0
        new_image.paste(l, (x, y))
    new_image.save(f"restore_{path}")

# restore_image("bg.jpg")
# restore_image("fullpg.jpg")
