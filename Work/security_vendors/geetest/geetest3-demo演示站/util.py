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
import cv2


def get_now():
    return int(time.time() * 1000)


# 处理jsonp
def jsonp_handle(text):
    jsonp_re = re.compile(r'\((?P<code>.*)\)', re.S)
    jsonp_str = jsonp_re.search(text, re.S).group('code')
    return json.loads(jsonp_str)


_IMG_MAGIC = (b"\xff\xd8\xff", b"\x89PNG\r\n\x1a\n")  # jpg / png 文件头


def download_img(name, url, session, retries=3, timeout=15):
    """下载验证码图片：带超时、重试和图片内容校验。

    网络抖动或 CDN 偶发异常时自动重试，并交替使用 static.geetest.com / static.geevisit.com。
    """
    candidates = [url]
    if "static.geetest.com" in url:
        candidates.append(url.replace("static.geetest.com", "static.geevisit.com"))

    last_err = None
    for attempt in range(1, retries + 1):
        cur_url = candidates[(attempt - 1) % len(candidates)]
        try:
            resp = session.get(cur_url, timeout=timeout)
            if resp.status_code != 200:
                raise RuntimeError(f"HTTP {resp.status_code}")
            content = resp.content
            # 防止把空响应、HTML 错误页当成图片写进文件
            if not content.startswith(_IMG_MAGIC):
                ct = resp.headers.get("content-type", "")
                raise RuntimeError(f"响应不是图片(content-type={ct}, len={len(content)})")
            with open(name, 'wb') as f:
                f.write(content)
            loguru.logger.info(f"图片{name}下载成功")
            return
        except Exception as e:
            last_err = e
            loguru.logger.warning(f"图片{name}第{attempt}次下载失败({cur_url}): {e}")
            if attempt < retries:
                time.sleep(attempt)
    raise RuntimeError(f"图片{name}下载失败: {last_err}")


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


def get_slide_x():
    # 读取图片
    pg = cv2.imread("./restore_bg.jpg")  # 背景图（已还原）
    slice_img = cv2.imread("./slice.jpg", cv2.IMREAD_UNCHANGED)  # 滑块图，保留 alpha

    if pg is None or slice_img is None:
        raise FileNotFoundError("背景图或滑块图读取失败")

    # 滑块图带 alpha 时先剥掉 alpha（TM_CCORR_NORMED + mask 在本站点会匹配到右侧亮色区域，弃用）
    if slice_img.ndim == 3 and slice_img.shape[2] == 4:
        slice_img = slice_img[:, :, :3]

    pg_gray = cv2.cvtColor(pg, cv2.COLOR_BGR2GRAY)
    sp_gray = cv2.cvtColor(slice_img, cv2.COLOR_BGR2GRAY)

    # 边缘检测：突出缺口轮廓，抵消颜色/亮度差异
    pg_edge = cv2.Canny(pg_gray, 100, 200)
    sp_edge = cv2.Canny(sp_gray, 100, 200)

    result = cv2.matchTemplate(pg_edge, sp_edge, cv2.TM_CCOEFF_NORMED)

    # 取最大匹配位置
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
    x = max_loc[0]

    return x


def __ease_out_expo(sep):
    if sep == 1:
        return 1
    else:
        return 1 - pow(2, -10 * sep)


def get_gt3_slide_track(distance):
    import random
    """
    根据滑动距离生成滑动轨迹
    :param distance:需要滑动的距离
    :return: 滑动轨迹<type 'list'>: [[x,y,t], ...]
        X: 已滑动的横向距离
        y: 已滑动的纵向距离, 除起点外, 均为0
        t: 滑动过程消耗的时间, 单位: 毫秒
    """

    if not isinstance(distance, int) or distance < 0:
        raise ValueError(f"distance类型必须是大于等于0的整数: distance: {distance}, type: {type(distance)}")
    # 初始化轨迹列表
    slide_track = [
        [random.randint(-50, -10), random.randint(-50, -10), 0],
        [0, 0, 0]
    ]
    # 共记录count次滑块位置信息
    count = 78 + int(distance / 2)
    # 初始化滑动时间
    t = random.randint(50, 100)
    # 记录上一次滑动的距离
    _x = 0
    _y = 0
    for i in range(count):
        # 已滑动的横向距离
        x = round(__ease_out_expo(i / count) * distance)
        # 滑动过程消耗的时间
        t += random.randint(10, 20)
        if x == _x:
            continue
        slide_track.append([x, _y, t])
        _x = x
    slide_track.append([distance, 0, t])

    return slide_track, t


if __name__ == "__main__":
    # restore_image("bg.jpg")
    # restore_image("fullpg.jpg")
    print("缺口 x =", get_slide_x())
    print(get_gt3_slide_track(get_slide_x()))

    # import execjs
    #
    # _road = [
    #     [
    #         -39,
    #         -29,
    #         0
    #     ],
    #     [
    #         0,
    #         0,
    #         0
    #     ],
    #     [
    #         2,
    #         0,
    #         56
    #     ],
    #     [
    #         7,
    #         0,
    #         64
    #     ],
    #     [
    #         15,
    #         0,
    #         72
    #     ],
    #     [
    #         21,
    #         0,
    #         80
    #     ],
    #     [
    #         29,
    #         0,
    #         88
    #     ],
    #     [
    #         36,
    #         1,
    #         97
    #     ],
    #     [
    #         45,
    #         1,
    #         104
    #     ],
    #     [
    #         51,
    #         2,
    #         112
    #     ],
    #     [
    #         54,
    #         3,
    #         120
    #     ],
    #     [
    #         57,
    #         3,
    #         128
    #     ],
    #     [
    #         58,
    #         3,
    #         136
    #     ],
    #     [
    #         59,
    #         3,
    #         144
    #     ],
    #     [
    #         61,
    #         3,
    #         152
    #     ],
    #     [
    #         61,
    #         3,
    #         401
    #     ]
    # ]
    # c = [
    #     12,
    #     58,
    #     98,
    #     36,
    #     43,
    #     95,
    #     62,
    #     15,
    #     12
    # ]
    # s = "42377459"
    # gt = "019924a82c70bb123aae90d483087f94"
    # challenge = "742cfdc18f2188b02726ceee4c6e1fe37y"
    # slide_x = 61
    # slide_time = 401
    # calc_third_w = execjs.compile(open('./calc_w3.js', 'r', encoding='utf-8').read()).call('calc_w3', gt, challenge,
    #                                                                                        s,
    #                                                                                        c, _road, slide_x,
    #                                                                                        slide_time)
    # print(calc_third_w)
