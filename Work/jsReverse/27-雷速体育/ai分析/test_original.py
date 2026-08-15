# -*- coding: utf-8 -*-
"""测试: 原版线上 WAF JS (不替换 vr) 在 Node vm 里能否直接跑通算出 cookie"""
import json
import re
import requests
import execjs

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

import execjs
# 签名 accept
with open('../demo.js', 'r', encoding='utf-8') as f:
    js_code = f.read()
sign_ctx = execjs.compile(js_code)
result = sign_ctx.call('buildSignedHeaders',
                       '/v1/web/match/database/football/team_info',
                       {"Accept": "application/json, text/plain, */*"}, "m_leisu")
headers['accept'] = result['Accept']

s = requests.Session()
s.headers.update(headers)
for k, v in cookies.items():
    s.cookies.set(k, v)
s.proxies.update({'http': 'http://127.0.0.1:7890', 'https': 'http://127.0.0.1:7890'})
r = s.get('https://api-gateway.leisu.com/v1/web/match/database/football/team_info',
          params={'team_id': '10766'})
print('第一次状态:', r.status_code, '是挑战页:', 'aliyunwaf' in r.text and 'renderData' in r.text)

# 提取 arg1 和 WAF JS
render_data = json.loads(re.search(r'<textarea id="renderData"[^>]*>([\s\S]*?)</textarea>', r.text).group(1))
arg1 = render_data['l1'].split("'")[1]
waf_js = re.search(r'<script name="(aliyunwaf[^"]*)">([\s\S]*?)</script>', r.text).group(2)
print('arg1 =', arg1)
print('WAF JS 长度:', len(waf_js))
print('包含 vy():', 'vy(' in waf_js, '| 包含 vL=239:', 'vL = 239' in waf_js)

# 原版执行: 不替换 vr, 让 vy() 自己算 vL
JS = r'''
const vm = require('vm');
function getCookie(arg1, wafJs) {
  const ctx = { navigator: { webdriver: false }, arg1: arg1 };
  ctx.globalThis = ctx;
  ctx.window = ctx;
  let cookie = null;
  ctx.reload = function (val) { cookie = val; };
  try {
    vm.runInNewContext(wafJs, ctx, { timeout: 8000 });
  } catch (e) {
    return '__ERROR__: ' + e.message;
  }
  return cookie;
}
'''
ctx = execjs.compile(JS)
cookie = ctx.call('getCookie', arg1, waf_js)
print('结果:', cookie)
