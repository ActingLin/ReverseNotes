/**
 * 暴力搜索真实 vL (225 ~ 260)
 * 判定标准: 解密字符串表元素得到可读英文, 且字符串表 shuffle 循环能 break (不死循环)
 */
const fs = require('fs');
const vm = require('vm');

const HTML_PATH = 'D:\\AAA-work\\ReverseNotes\\Work\\jsReverse\\27-雷速体育\\demo.html';
const html = fs.readFileSync(HTML_PATH, 'utf8');
const code0 = html.match(/<script name="aliyunwaf_6a6f5ea8">([\s\S]*?)<\/script>/)[1];

const vrRe = /return vL = vy\(xXRQBR\['toString'\]\(\), 'xXRQBR', '\\x32\\x64\\x65\\x61\\x63\\x61\\x66'\), 'oTP\+ef0';/;
const dRe = "return !i ? (S = d['AGnxSP'](S), v[Q] = S) : S = i, S;";
const dNew = "return !i ? (S = d['AGnxSP'](S), v[Q] = S, " +
  "(globalThis.__rec = globalThis.__rec || []).push([E, p[E], S]), S) : S = i, S;";

const offset = -0x5a6 + -0x239c + 0x1 * 0x2b31; // 491

function isReadable(str) {
  if (!str || typeof str !== 'string') return false;
  let ascii = 0, letters = 0;
  for (const ch of str) {
    const c = ch.charCodeAt(0);
    if (c >= 32 && c < 127) ascii++;
    if (/[a-zA-Z]/.test(ch)) letters++;
  }
  // 大部分是可打印 ASCII 且有相当字母 -> 基本可读
  return str.length > 0 && ascii >= str.length * 0.7 && letters >= str.length * 0.3;
}

const results = [];
for (let vl = 225; vl <= 260; vl++) {
  let code = code0
    .replace(vrRe, `return vL = ${vl}, 'oTP+ef0';`)
    .replace(dRe, dNew);

  const ctx = { navigator: {}, __rec: [] };
  ctx.globalThis = ctx;
  ctx.window = ctx;

  let timedOut = false;
  try {
    vm.runInNewContext(code, ctx, { timeout: 1500 });
  } catch (err) {
    timedOut = true; // 死循环 -> 超时
  }

  const rec = ctx.__rec || [];
  // 统计明文质量
  const plains = rec.map(r => r[2]);
  const readable = plains.filter(isReadable);
  const notEmpty = plains.filter(p => p && p.length > 0);

  // 判定: 不死循环 且 有可读明文
  const ok = !timedOut && readable.length >= 10;

  results.push({ vl, timedOut, recCount: rec.length, readable: readable.length, notEmpty: notEmpty.length });
  console.log(`vL=${vl}  timeouts=${timedOut}  rec=${String(rec.length).padStart(6)}  可读=${readable.length}  非空=${notEmpty.length}`);

  if (ok) {
    console.log(`\n★★★ vL = ${vl} 似乎正确! 前 15 条明文:`);
    rec.slice(0, 15).forEach(([E, cipher, plain]) => console.log(`  ${E + offset}  ${JSON.stringify(cipher)} => ${JSON.stringify(plain)}`));
    break;
  }
}

if (!results.some(r => !r.timedOut && r.readable >= 10)) {
  console.log('\n[!] 225-260 范围内未找到, 扩大搜索...');
}
