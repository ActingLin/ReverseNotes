/**
 * 阿里云 WAF JS 挑战 (雷速体育 demo.html) 脱壳脚本
 *
 * 脱壳三步:
 *  1. vL 是 vy() 反篡改检测的计算值, 经暴力搜索验证真实值 = 239
 *     (解密器 Number.toString(radix) 要求 vL ∈ [225,259]; vL=239 时明文全部可读)
 *  2. 把 vr() 改为返回 vL=239, 绕过对 xXRQBR.toString() 源码的篡改检测
 *  3. 插桩 d() 解密器, 记录 [偏移后索引, 密文, 明文], 生成字符串映射表
 *
 * 环境要求: 补 arg1 (demo.html 明文脚本里定义的全局), 否则 window['arg1'].slice 报错
 */
const fs = require('fs');

const HTML_PATH = 'D:\\AAA-work\\ReverseNotes\\Work\\jsReverse\\27-雷速体育\\demo.html';
const OUT_REC = 'D:\\AAA-work\\ReverseNotes\\Work\\jsReverse\\27-雷速体育\\decoded_map.json';
const OUT_DEOB = 'D:\\AAA-work\\ReverseNotes\\Work\\jsReverse\\27-雷速体育\\deobfuscated.js';
const OUT_HOOKED = 'D:\\AAA-work\\ReverseNotes\\Work\\jsReverse\\27-雷速体育\\hooked.js';

// ---------- 1. 提取混淆 JS ----------
const html = fs.readFileSync(HTML_PATH, 'utf8');
const m = html.match(/<script name="aliyunwaf_6a6f5ea8">([\s\S]*?)<\/script>/);
if (!m) { console.error('[!] 未找到混淆脚本'); process.exit(1); }
const ORIG = m[1];
let code = ORIG;

// ---------- 2. 替换 vr(): vL = 239 ----------
const REAL_VL = 239;
const vrRe = /return vL = vy\(xXRQBR\['toString'\]\(\), 'xXRQBR', '\\x32\\x64\\x65\\x61\\x63\\x61\\x66'\), 'oTP\+ef0';/;
if (!vrRe.test(code)) { console.error('[!] 未匹配到 vr() 源码'); process.exit(1); }
code = code.replace(vrRe, `return vL = ${REAL_VL}, 'oTP+ef0';`);
console.log('[+] vr() 已改为 vL=' + REAL_VL);

// ---------- 3. 插桩 d() 解密器 ----------
const dRe = "return !i ? (S = d['AGnxSP'](S), v[Q] = S) : S = i, S;";
if (!code.includes(dRe)) { console.error('[!] 未匹配到 d() 解密返回点'); process.exit(1); }
code = code.replace(dRe,
  "return !i ? (S = d['AGnxSP'](S), v[Q] = S, " +
  "(globalThis.__rec = globalThis.__rec || []).push([E, p[E], S]), S) : S = i, S;");
console.log('[+] d() 已插桩记录点');
fs.writeFileSync(OUT_HOOKED, code);

// ---------- 4. 构造最小环境并执行 ----------
const vm = require('vm');
const offset = -0x5a6 + -0x239c + 0x1 * 0x2b31; // d() 内 E = 入参 - offset
const ctx = {
  navigator: {},
  __rec: [],
  arg1: "5dad9f2a3fb61c62488ea5af82e742cab175b5d161c0e7809d" // 来自 demo.html 明文脚本
};
ctx.globalThis = ctx;
ctx.window = ctx;

try {
  vm.runInNewContext(code, ctx, { timeout: 5000 });
  console.log('[+] 执行完成, 解密记录数:', ctx.__rec.length);
} catch (err) {
  console.warn('[!] 执行出错:', err.message);
  console.warn('    已收集记录数:', ctx.__rec.length);
}

// ---------- 5. 生成字符串映射表 ----------
const map = new Map(); // 入参 -> 明文
for (const [E, cipher, plain] of ctx.__rec) {
  const arg = E + offset;
  if (!map.has(arg)) map.set(arg, plain);
}
const arr = [...map.entries()].map(([k, v]) => ({ index: k, indexHex: '0x' + k.toString(16), plain: v }));
fs.writeFileSync(OUT_REC, JSON.stringify(arr, null, 2));

console.log('\n===== 解密出的字符串 (按 index, 共 ' + arr.length + ' 条) =====');
for (const { indexHex, plain } of arr) console.log(`  ${indexHex} => ${JSON.stringify(plain)}`);

// ---------- 6. 源码还原: 把 d(0x...) 直接字面量调用替换为字符串 ----------
// 说明: 代码中多数字符串调用是 L(vk.E) 这种 "函数名(索引变量)" 形式,
//       索引变量(vk.E=0x240)在混淆代码中明文可见, 这里做两层替换:
//       a) 收集纯索引对象 (var xx = {E:0x..., z:0x...}) 建立 对象名.属性 -> 索引
//       b) 把 函数名(对象名.属性) 以及 函数名(0x...) 替换为字符串字面量
function collectIndexObjects(src) {
  const objMap = new Map(); // 'objName.prop' -> 数值索引
  // 匹配 var NAME = {...} 以及链式 , NAME = {...} (注意 , 后要 \s* 吃空格)
  const re = /(?:var\s+|,)\s*([A-Za-z_$][\w$]*)\s*=\s*\{([^}]*)\}(?=[,;])/g;
  let mm;
  while ((mm = re.exec(src))) {
    const name = mm[1];
    const body = mm[2];
    // 仅当所有属性都是 0x 字面量时才视为纯索引表 (函数对象会被排除)
    const pairs = body.split(',').map(s => s.trim()).filter(Boolean);
    if (!pairs.length) continue;
    const allHex = pairs.every(p => /^[A-Za-z_$][\w$]*\s*:\s*0x[0-9a-f]+$/i.test(p));
    if (!allHex) continue;
    for (const p of pairs) {
      const [, key, hex] = p.match(/^([A-Za-z_$][\w$]*)\s*:\s*(0x[0-9a-f]+)$/i);
      objMap.set(`${name}.${key}`, parseInt(hex, 16));
    }
  }
  return objMap;
}

const indexVars = collectIndexObjects(ORIG);

function quote(s) {
  return JSON.stringify(s);
}

// 记录实际展开的调用数
let expanded = 0;
let out = ORIG;

// b1) 替换 函数名(对象名.属性): L(vk.E) / A(Di.S) / D5(vK.q) 等
const callRe = /\b([A-Za-z_$][\w$]*)\(([A-Za-z_$][\w$]*)\.([A-Za-z_$][\w$]*)\)/g;
out = out.replace(callRe, (full, fn, obj, prop) => {
  const idx = indexVars.get(`${obj}.${prop}`);
  if (idx === undefined) return full;
  const plain = map.get(idx);
  if (plain === undefined) return full;
  expanded++;
  return quote(plain);
});

// b2) 替换 函数名(0x...): 直接查映射
const callHexRe = /\b([A-Za-z_$][\w$]*)\((0x[0-9a-f]+)\)/g;
out = out.replace(callHexRe, (full, fn, hex) => {
  const idx = parseInt(hex, 16);
  const plain = map.get(idx);
  if (plain === undefined) return full;
  expanded++;
  return quote(plain);
});

fs.writeFileSync(OUT_DEOB, out);
console.log('\n[+] 还原代码已保存到:', OUT_DEOB, '(共展开 ' + expanded + ' 处字符串调用)');
