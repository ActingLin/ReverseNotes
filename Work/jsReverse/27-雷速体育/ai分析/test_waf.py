# -*- coding: utf-8 -*-
"""测试: execjs + vm 执行脱壳 WAF JS 计算 acw_sc__v2"""
import json
import re
import execjs

# 模拟一次 WAF 挑战响应
html = open('../demo.html', encoding='utf-8').read()

# 1. 提取 WAF JS
waf_js_raw = re.search(r'<script name="aliyunwaf_6a6f5ea8">([\s\S]*?)</script>', html).group(1)

# 2. 脱壳: 替换 vr() 的反篡改校验为 vL=239
vr_pattern = r"return vL = vy\(xXRQBR\['toString'\]\(\), 'xXRQBR', '\\x32\\x64\\x65\\x61\\x63\\x61\\x66'\), 'oTP\+ef0';"
waf_js = re.sub(vr_pattern, "return vL = 239, 'oTP+ef0';", waf_js_raw)
assert 'vL = 239' in waf_js, 'vr() 替换失败'

# 3. 提取 arg1 = renderData.l1.slice(10, 60)
render_data = json.loads(re.search(r'<textarea id="renderData"[^>]*>([\s\S]*?)</textarea>', html).group(1))
arg1 = render_data['l1'][10:60]
print('arg1 =', arg1)

# 4. execjs 执行 WAF JS, hook reload 捕获 cookie
JS = '''
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
'''
ctx = execjs.compile(JS)
cookie = ctx.call('getCookie', arg1, waf_js)
print('acw_sc__v2 =', cookie)
assert cookie and cookie.startswith('1234cf0d46-'), 'cookie 格式异常'
print('[OK] 完整流程通过')
