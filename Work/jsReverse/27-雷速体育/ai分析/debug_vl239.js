/** 调试 vL=239: 打印 shuffle 循环关键索引的明文, 分析死循环位置 */
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('D:\\AAA-work\\ReverseNotes\\Work\\jsReverse\\27-雷速体育\\demo.html', 'utf8');
const code0 = html.match(/<script name="aliyunwaf_6a6f5ea8">([\s\S]*?)<\/script>/)[1];

const vrRe = /return vL = vy\(xXRQBR\['toString'\]\(\), 'xXRQBR', '\\x32\\x64\\x65\\x61\\x63\\x61\\x66'\), 'oTP\+ef0';/;
const dRe = "return !i ? (S = d['AGnxSP'](S), v[Q] = S) : S = i, S;";
const dNew = "return !i ? (S = d['AGnxSP'](S), v[Q] = S, " +
  "(globalThis.__rec = globalThis.__rec || []).push([E, p[E], S]), S) : S = i, S;";

const VL = 239;
const offset = -0x5a6 + -0x239c + 0x1 * 0x2b31; // 495

let code = code0
  .replace(vrRe, `return vL = ${VL}, 'oTP+ef0';`)
  .replace(dRe, dNew);

const ctx = {
  navigator: {},
  __rec: [],
  // 补全浏览器全局: arg1 来自 demo.html 明文脚本
  arg1: "5dad9f2a3fb61c62488ea5af82e742cab175b5d161c0e7809d"
};
ctx.globalThis = ctx;
ctx.window = ctx;

try {
  vm.runInNewContext(code, ctx, { timeout: 10000 });
  console.log('[+] 执行完成! 总解密记录:', ctx.__rec.length);
} catch (err) {
  console.log('[!] 超时/出错:', err.message);
  console.log('    解密记录:', ctx.__rec.length);
}

// 建立 arg -> plain 映射
const map = new Map();
for (const [E, cipher, plain] of ctx.__rec) {
  if (!map.has(E + offset)) map.set(E + offset, plain);
}

// shuffle 循环用到的 10 个索引
const Di = { E: 0x259, z: 0x227, S: 0x210, X: 0x1f6, o: 0x212, Q: 0x244, i: 0x224, c: 0x21e, m: 0x200, e: 0x250 };
console.log('\n===== shuffle 循环关键索引解密结果 (vL=' + VL + ') =====');
for (const [k, v] of Object.entries(Di)) {
  const arg = v + offset;
  console.log(`  Di.${k} = 0x${v.toString(16)} (arg=${arg}) => ${JSON.stringify(map.get(arg))}`);
}

// 打印全部唯一明文
console.log('\n===== 全部唯一明文 (' + map.size + ' 条) =====');
for (const [arg, plain] of [...map.entries()].sort((a, b) => a[0] - b[0])) {
  console.log(`  ${arg} (0x${arg.toString(16)}) => ${JSON.stringify(plain)}`);
}
