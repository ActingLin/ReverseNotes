/**
 * 阿里云 WAF acw_sc__v2 cookie 计算器 (基于脱壳成果)
 * - 输入: arg1 (从挑战页 renderData.l1.slice(10,60) 提取, 每次请求动态变化)
 * - 输出: acw_sc__v2 的值
 *
 * 原理: 执行脱壳后的 WAF JS (vr() 的 vL 已替换为 239, 绕过反篡改校验),
 *        hook reload() 捕获最终 cookie 值。
 */
const vm = require('vm');

// ---- 脱壳处理: 传入原始 WAF JS, 返回可执行版 (vL=239) ----
function prepareWafJs(raw) {
  const vrRe = /return vL = vy\(xXRQBR\['toString'\]\(\), 'xXRQBR', '\\x32\\x64\\x65\\x61\\x63\\x61\\x66'\), 'oTP\+ef0';/;
  if (!vrRe.test(raw)) {
    throw new Error('[waf_calc] 未匹配到 vr() 源码, WAF JS 结构可能已变化');
  }
  return raw.replace(vrRe, "return vL = 239, 'oTP+ef0';");
}

// ---- 执行 WAF JS 算出 cookie ----
function getCookie(arg1, rawWafJs) {
  const wafCode = prepareWafJs(rawWafJs);
  const ctx = { navigator: { webdriver: false }, arg1: arg1 };
  ctx.globalThis = ctx;
  ctx.window = ctx;
  let cookie = null;
  ctx.reload = function (val) { cookie = val; };
  vm.runInNewContext(wafCode, ctx, { timeout: 5000 });
  return cookie;
}

module.exports = { getCookie, prepareWafJs };
