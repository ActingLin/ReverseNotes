/**
 * 验证: 脱壳后的插桩版 (hooked.js) 能在 Node 里完整跑通并算出 acw_sc__v2
 * 通过 hook globalThis.reload 捕获最终 cookie 值
 */
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('D:\\AAA-work\\ReverseNotes\\Work\\jsReverse\\27-雷速体育\\ai分析\\demo2.html', 'utf8');
const code0 = html.match(/<script name="aliyunwaf_6a6f5ea8">([\s\S]*?)<\/script>/)[1];

// 与 deobfuscate.js 相同的脱壳处理: vL=239 + 插桩
const vrRe = /return vL = vy\(xXRQBR\['toString'\]\(\), 'xXRQBR', '\\x32\\x64\\x65\\x61\\x63\\x61\\x66'\), 'oTP\+ef0';/;
const dRe = "return !i ? (S = d['AGnxSP'](S), v[Q] = S) : S = i, S;";
const dNew = "return !i ? (S = d['AGnxSP'](S), v[Q] = S, " +
  "(globalThis.__rec = globalThis.__rec || []).push([E, p[E], S]), S) : S = i, S;";
let code = code0
  .replace(vrRe, "return vL = 239, 'oTP+ef0';")
  .replace(dRe, dNew);

const ctx = {
  navigator: { webdriver: false },
  __rec: [],
  arg1: "5dad9f2a3fb61c62488ea5af82e742cab175b5d161c0e7809d",
  // hook reload: 捕获最终 cookie 值 (相当于 demo.html 的 setCookie("acw_sc__v2", e))
  reload: function (val) { ctx.__cookie = val; }
};
ctx.globalThis = ctx;
ctx.window = ctx;

try {
  vm.runInNewContext(code, ctx, { timeout: 5000 });
  console.log('[+] 执行完成');
  if (ctx.__cookie) {
    console.log('\nacw_sc__v2 =', JSON.stringify(ctx.__cookie));
    console.log('长度 =', ctx.__cookie.length);
    console.log('前缀 (gGocA 函数源码 + "-"):', JSON.stringify(ctx.__cookie.slice(0, 60)));
    console.log('后缀 (随机 hex 部分):', JSON.stringify(ctx.__cookie.slice(-80)));
  } else {
    console.log('[!] 未捕获到 cookie, 检查 reload 是否被调用');
  }
} catch (err) {
  console.error('[!] 执行出错:', err.message);
}
