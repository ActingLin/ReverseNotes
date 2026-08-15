# -*- coding: utf-8 -*-
"""
@File    : team_info.py
@Author  : Elliot Lin
@Date    : 2026/8/15 10:35
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 雷速体育 team_info 接口 (阿里云 WAF acw_sc__v2 处理版)

思路: 直接请求会返回阿里云 WAF 的 JS 挑战页 (403/状态码异常)。
      acw_sc__v2 是 WAF 的反爬标识 cookie (1小时过期)。
      先请求一次拿到挑战页 -> 从中动态提取 WAF JS 和 arg1 ->
      脱壳执行 JS 算出 acw_sc__v2 -> 种入 Session -> 重新请求。
"""
import base64
import gzip
import json
import os
import re
import time

import loguru
import requests
import execjs
from requests.exceptions import RequestException

headers = {
    "accept": "application/json, text/plain, */*;;m_BpRmoVCveGQryB4IVVr70miJlfp7_g8szXuO4n6FyIuAeX99K3sTWmxVtLMgXR6NuHSNtSfregnfJwaSGjGw6QfDv5adJDYl2lO4xoOYvNH7HruxVJYs0DjJ74v5hRCNacA6PVCHd5Yo_9N-1AIJbyUitgiYFNGmXAaSHvNpI",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "origin": "https://m.leisu.com",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://m.leisu.com/data/zuqiu/team-10766",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
}
cookies = {
    "_c_WBKFRo": "oBcK3bZieEpx05cxq9uEq003HakhY9FPc07HL4M5",
    "_nb_ioWEgULi": "",
    "cna": "7f735018bb8146cd8b7e0a68a0b5e9e4",
}

params = {
    "team_id": "10766"
}

# 签名: demo.js 里的 buildSignedHeaders (demo.js 在上级目录)
with open('../demo.js', 'r', encoding='utf-8') as f:
    js_code = f.read()
_sign_ctx = execjs.compile(js_code)

base_url = "https://api-gateway.leisu.com"
api = '/v1/web/match/database/football/team_info'
accept = {
    "Accept": "application/json, text/plain, */*"
}
m = "m_leisu"

proxies = {
    "http": "http://127.0.0.1:7890",
    "https": "http://127.0.0.1:7890"
}

# ---------------------------------------------------------------------------
# 阿里云 WAF acw_sc__v2 处理
# ---------------------------------------------------------------------------

# execjs 执行器: 用 Node vm 隔离执行 WAF JS, hook reload 捕获 cookie
# 注意: 直接跑原版 JS (不替换 vr), 只要补上 arg1 环境, vy() 会自行算出正确的 vL,
#       这样能自适应 WAF JS 的每次轮换 (脱壳结论见 ../脱壳还原说明.md)
_WAF_JS_EXEC = r"""
const vm = require('vm');
function getCookie(arg1, wafJs) {
  const ctx = { navigator: { webdriver: false }, arg1: arg1 };
  ctx.globalThis = ctx;
  ctx.window = ctx;
  let cookie = null;
  ctx.reload = function (val) { cookie = val; };
  vm.runInNewContext(wafJs, ctx, { timeout: 5000 });
  return cookie;
}
"""
_waf_ctx = execjs.compile(_WAF_JS_EXEC)


def is_waf_challenge(text):
    """判断响应是否为阿里云 WAF JS 挑战页"""
    return 'aliyunwaf' in text and '<textarea id="renderData"' in text


def robust_get(session, url, params=None, retries=3, delay=1.0):
    """
    带超时和重试的 GET: 代理/服务端偶发断开 chunked 响应 (ChunkedEncodingError
    等 RequestException) 时自动重试, 避免偶发网络错误导致整个流程失败。
    """
    for attempt in range(1, retries + 1):
        try:
            return session.get(url, params=params, timeout=15)
        except RequestException as e:
            loguru.logger.warning(f'请求失败 (第 {attempt}/{retries} 次): {e}')
            if attempt < retries:
                time.sleep(delay)
    raise RuntimeError(f'请求 {url} 连续 {retries} 次失败')


# 宽松匹配 vr() 反篡改校验 (兼容美化版/压缩版), 用于降级时替换 vL=239
_VR_RE = re.compile(
    r"return\s+vL\s*=\s*vy\(\s*xXRQBR\s*\[\s*'toString'\s*\]\s*\(\s*\)\s*,[^)]*\)\s*,\s*'oTP\+ef0'\s*;"
)


# ---------------------------------------------------------------------------
# 响应数据解密 (凯撒位移 + Base64 + Gzip)
# ---------------------------------------------------------------------------

def _caesar_shift(t, e):
    """凯撒位移: 仅对英文字母位移 e 位, 数字/符号/`/+` 等保持不变"""
    result = []
    for i in map(ord, t):
        if 65 <= i <= 90:          # 大写 A-Z
            i = (i - 65 - e + 26) % 26 + 65
        elif 97 <= i <= 122:       # 小写 a-z
            i = (i - 97 - e + 26) % 26 + 97
        result.append(chr(i))
    return "".join(result)


def decrypt_leisu_data(data_str):
    """
    解密雷速体育接口响应的 data 字段, 返回 (偏移 e, 明文 dict)。

    步骤: 凯撒位移爆破 (偏移 1~25) → Base64 解码 → 检测 Gzip 魔术头 \\x1f\\x8b
          → Gzip 解压 → JSON。
    全部偏移都不命中 Gzip 头时抛 RuntimeError。
    """
    for e in range(1, 26):
        try:
            txt = _caesar_shift(data_str, e)
            raw = base64.b64decode(txt)
            if raw[:2] == b'\x1f\x8b':          # Gzip 魔术头
                plain = gzip.decompress(raw).decode('utf-8', errors='ignore')
                return e, json.loads(plain)
        except Exception:
            continue
    raise RuntimeError('响应 data 解密失败: 1~25 凯撒偏移均不命中 Gzip 头')


def solve_acw_cookie(challenge_html):
    """
    从 WAF 挑战页 HTML 中动态提取参数并执行 JS, 返回 acw_sc__v2 的值。
    每次挑战页的 arg1 和 WAF JS 都可能变化, 因此必须从本次响应中提取。

    执行策略 (双保险):
      1) 优先跑原版 JS: 线上压缩版在补 arg1 环境后, vy() 会自行算出正确的 vL;
      2) 若原版超时/失败 (如碰到美化版样本, vy 自洽计算与真实 vL 不符):
         自动降级为脱壳替换版 (把 vy() 校验替换为 vL=239)。
    """
    # 1. 提取 WAF 混淆 JS (script name 是动态哈希, 如 aliyunwaf_6a6f5ea8)
    m = re.search(r'<script name="(aliyunwaf[^"]*)">([\s\S]*?)</script>', challenge_html)
    if not m:
        raise RuntimeError('未找到 WAF JS script 标签')
    waf_js = m.group(2)
    # 2. 提取 arg1 = renderData.l1 中单引号内的值 (等价于 JS 的 l1.slice(10,60))
    render_data = json.loads(
        re.search(r'<textarea id="renderData"[^>]*>([\s\S]*?)</textarea>', challenge_html).group(1))
    arg1 = render_data['l1'].split("'")[1]
    # 3. 优先原版执行
    try:
        return _waf_ctx.call('getCookie', arg1, waf_js)
    except Exception as e:
        loguru.logger.warning(f'原版 WAF JS 执行失败 ({e}), 尝试 vL=239 替换版...')
        waf_js_alt = _VR_RE.sub("return vL=239,'oTP+ef0';", waf_js)
        if waf_js_alt == waf_js:
            loguru.logger.error('未匹配到 vr() 校验点, 无法降级')
            raise
        return _waf_ctx.call('getCookie', arg1, waf_js_alt)


def main():
    session = requests.Session()
    session.headers.update(headers)
    session.proxies.update(proxies)
    for k, v in cookies.items():
        session.cookies.set(k, v)

    # 接口签名
    result = _sign_ctx.call('buildSignedHeaders', api, accept, m)
    loguru.logger.info(result)
    session.headers.update({'accept': result['Accept']})

    url = base_url + api

    # 1. 第一次请求: 若 Session 中无有效 acw_sc__v2, 会被 WAF 拦截返回挑战页;
    #    WAF 不一定每次触发 (已验证的 IP 会被放行), 两种情况都要处理
    resp = robust_get(session, url, params=params)
    loguru.logger.info(f'第一次请求状态码: {resp.status_code}, 是WAF挑战页: {is_waf_challenge(resp.text)}')

    # WAF 挑战页 HTML (仅触发挑战时存在) -> 保存到 demo2.html
    waf_html = None
    if is_waf_challenge(resp.text):
        waf_html = resp.text
        # 2. 执行 JS 计算 acw_sc__v2, 种入 Session
        acw = solve_acw_cookie(resp.text)
        loguru.logger.info(f'acw_sc__v2 = {acw}')
        session.cookies.set('acw_sc__v2', acw, domain='.leisu.com')

        # 3. 重新请求 (此时带 acw_sc__v2, WAF 放行)
        resp = robust_get(session, url, params=params)
        loguru.logger.info(f'第二次请求状态码: {resp.status_code}, 是WAF挑战页: {is_waf_challenge(resp.text)}')

    print(resp.text)
    print(resp)

    # ---- 落盘 ----
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(base_dir, 'ai分析')
    os.makedirs(out_dir, exist_ok=True)

    # 4a. WAF 挑战页 -> demo2.html (仅触发挑战时保存)
    if waf_html is not None:
        with open(os.path.join(out_dir, 'demo2.html'), 'w', encoding='utf-8') as f:
            f.write(waf_html)
        loguru.logger.info('WAF 挑战页已保存到 ai分析/demo2.html')

    # 4b. 正常接口数据 -> team_info_data.json
    # 若响应是 {"code":xxx, "data":"密文"}, 先尝试凯撒+Gzip 解密, 成功保存明文, 失败保存原始
    raw_text = resp.text
    saved_text = raw_text
    try:
        parsed = json.loads(raw_text)
        if isinstance(parsed, dict) and isinstance(parsed.get('data'), str):
            e, plain = decrypt_leisu_data(parsed['data'])
            saved_text = json.dumps(plain, ensure_ascii=False, indent=2)
            loguru.logger.info(f'接口数据解密成功 (凯撒偏移 e={e})')
    except json.JSONDecodeError:
        pass  # 非 JSON 响应, 原样保存
    except Exception as exc:
        loguru.logger.warning(f'接口数据解密失败, 保存原始响应: {exc}')
        saved_text = raw_text

    with open(os.path.join(out_dir, 'team_info_data.json'), 'w', encoding='utf-8') as f:
        f.write(saved_text)
    loguru.logger.info(f'接口数据已保存到 ai分析/team_info_data.json (状态码 {resp.status_code})')


if __name__ == '__main__':
    main()
