'use strict';
/**
 * 验证还原产物：
 *   1) Babel 解析 + vm.Script 编译
 *   2) 字符串解码器 / 状态矩阵与原版逐项对比
 *   3) 最小沙箱执行原版与还原版，对比导出对象结构
 *   4) 残留结构计数
 *
 * 用法: node validate_output.js [original] [deobf] [report]
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const parser = require('@babel/parser');
const { loadDecoders } = require('./lib_decoders');

const root = path.join(__dirname, '..');
const original = process.argv[2] || path.join(root, 'source', 'original', 'fullpage.9.2.0-guwyxh.js');
const deobf = process.argv[3] || path.join(root, 'source', 'deobfuscated', 'fullpage_9.2.0_deobf.js');
const reportPath = process.argv[4] || path.join(root, 'intermediate', 'validation_report.json');

const report = { original, deobf, checks: {}, metrics: {} };
let failed = false;
function check(name, ok, detail) {
  report.checks[name] = { ok, detail };
  if (!ok) failed = true;
  console.log(`[${ok ? 'OK' : 'FAIL'}] ${name}${detail ? ' - ' + detail : ''}`);
}

// ---------- 1. 语法 ----------
for (const [name, file] of [['original', original], ['deobf', deobf]]) {
  const src = fs.readFileSync(file, 'utf8');
  let babelOk = true;
  try {
    parser.parse(src, { sourceType: 'script', errorRecovery: false });
  } catch (e) {
    babelOk = false;
    check(`parse:${name}`, false, e.message);
  }
  let vmOk = true;
  try {
    new vm.Script(src, { filename: file });
  } catch (e) {
    vmOk = false;
    check(`compile:${name}`, false, e.message);
  }
  if (babelOk) check(`parse:${name}`, true, 'babel');
  if (vmOk) check(`compile:${name}`, true, 'vm.Script');
}

// ---------- 2. 解码器一致性 ----------
const a = loadDecoders(original);
const b = loadDecoders(deobf);
let tableLen = 0;
while (typeof a.decode(tableLen) !== 'undefined') tableLen++;

let strDiff = 0;
for (let i = 0; i < tableLen; i++) if (a.decode(i) !== b.decode(i)) strDiff++;

let tokenDiff = 0;
for (const [k, v] of a.tokenMap) if (b.tokenMap.get(k) !== v) tokenDiff++;

check('decoder.strings', strDiff === 0, `${tableLen} entries, ${strDiff} diffs`);
check('decoder.stateMatrix', tokenDiff === 0, `${tokenDiff} diffs`);

// ---------- 3. 沙箱执行对比 ----------
const noop = () => {};
function makeEl(tag) {
  return {
    tagName: String(tag).toUpperCase(), style: {}, childNodes: [], sheet: null,
    appendChild(c) { this.childNodes.push(c); return c; }, removeChild(c) { return c; },
    insertBefore(c) { return c; }, setAttribute: noop, getAttribute() { return null; },
    removeAttribute: noop, addEventListener: noop, removeEventListener: noop,
    attachEvent: noop, detachEvent: noop,
    getBoundingClientRect() { return { left: 0, top: 0, width: 0, height: 0 }; },
    getContext() { return null; }, focus: noop, blur: noop, click: noop,
    cloneNode() { return makeEl(tag); }, querySelector() { return null; },
    querySelectorAll() { return []; }, getElementsByTagName() { return []; },
    insertAdjacentHTML: noop, innerHTML: '', textContent: '', className: '', id: '', parentNode: null,
  };
}
function makeSandbox() {
  const sb = {
    console, setTimeout: () => 0, clearTimeout: noop, setInterval: () => 0, clearInterval: noop,
    navigator: { userAgent: 'Mozilla/5.0 Chrome/120', platform: 'Win32', language: 'zh-CN', languages: ['zh-CN'], cookieEnabled: true, onLine: true },
    location: { href: 'https://example.com/', protocol: 'https:', host: 'example.com', hostname: 'example.com', port: '', pathname: '/', search: '', hash: '', origin: 'https://example.com' },
    document: {
      readyState: 'complete', cookie: '', createElement(t) { return makeEl(t); },
      createTextNode(t) { return { nodeType: 3, textContent: t }; },
      getElementsByTagName() { return []; }, getElementById() { return null; },
      querySelector() { return null; }, querySelectorAll() { return []; },
      addEventListener: noop, removeEventListener: noop,
      documentElement: makeEl('html'), body: makeEl('body'), head: makeEl('head'),
    },
    performance: { now: () => 0 },
    crypto: { getRandomValues(arr) { for (let i = 0; i < arr.length; i++) arr[i] = i & 255; return arr; } },
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
  };
  sb.window = sb; sb.self = sb; sb.globalThis = sb; sb.top = sb; sb.parent = sb;
  sb.Image = function () { return makeEl('img'); };
  sb.XMLHttpRequest = function () { this.open = noop; this.send = noop; this.setRequestHeader = noop; this.abort = noop; this.addEventListener = noop; };
  sb.addEventListener = noop; sb.removeEventListener = noop;
  return sb;
}
function runInSandbox(file) {
  const sb = makeSandbox();
  const base = new Set(Object.keys(sb));
  vm.createContext(sb);
  let error = null;
  try {
    vm.runInContext(fs.readFileSync(file, 'utf8'), sb, { timeout: 20000, filename: file });
  } catch (e) {
    error = e.name + ': ' + e.message;
  }
  const added = Object.keys(sb).filter((k) => !base.has(k)).sort();
  return { sb, error, added };
}
function shape(obj, depth, seen) {
  if (depth < 0 || obj == null) return typeof obj;
  if (typeof obj !== 'object' && typeof obj !== 'function') return typeof obj;
  if (seen.has(obj)) return '[circular]';
  seen.add(obj);
  const out = {};
  for (const k of Object.keys(obj).sort()) {
    const v = obj[k];
    out[k] = (typeof v === 'object' || typeof v === 'function')
      ? (depth === 0 ? '[obj]' : shape(v, depth - 1, seen))
      : typeof v;
  }
  seen.delete(obj);
  return out;
}
const runA = runInSandbox(original);
const runB = runInSandbox(deobf);
check('sandbox.noError', !runA.error && !runB.error, `original=${runA.error || 'ok'}, deobf=${runB.error || 'ok'}`);
check('sandbox.globalsEqual', JSON.stringify(runA.added) === JSON.stringify(runB.added), JSON.stringify(runA.added));
if (!runA.error && !runB.error) {
  const shapeA = JSON.stringify(shape({ Geetest: runA.sb.Geetest, FAIL: runA.sb.FAIL, Vwtrj: runA.sb.Vwtrj }, 3, new Set()));
  const shapeB = JSON.stringify(shape({ Geetest: runB.sb.Geetest, FAIL: runB.sb.FAIL, Vwtrj: runB.sb.Vwtrj }, 3, new Set()));
  check('sandbox.exportShapeEqual', shapeA === shapeB, `${shapeA.length} bytes`);
}

// ---------- 4. 残留计数 ----------
function count(src, re) {
  const m = src.match(re);
  return m ? m.length : 0;
}
function residue(file) {
  const src = fs.readFileSync(file, 'utf8');
  return {
    lines: src.split('\n').length,
    bytes: Buffer.byteLength(src),
    forHeaderCount: count(src, /for \(;/g),
    switchCount: count(src, /\bswitch \(/g),
    concatAlias: count(src, /\['\$_[A-Za-z0-9_]+'\]\.concat\(/g),
    shiftCalls: count(src, /\.shift\(\)/g),
    cvDecoderCalls: count(src, /Vwtrj\.\$_CV\(/g),
    ddStateTokens: count(src, /Vwtrj\.\$_DD\(\)/g),
    dollarIdentifiers: count(src, /\$_[A-Za-z0-9_]+/g),
  };
}
report.metrics.original = residue(original);
report.metrics.deobf = residue(deobf);

console.log('\n残留对比:');
console.table({ original: report.metrics.original, deobf: report.metrics.deobf });

check('residue.noAliasBlocks', report.metrics.deobf.concatAlias === 0, `concatAlias=${report.metrics.deobf.concatAlias}`);
check('residue.noDecoderCalls', report.metrics.deobf.cvDecoderCalls === 0, `cvCalls=${report.metrics.deobf.cvDecoderCalls}`);
check('residue.noStateTokens', report.metrics.deobf.ddStateTokens === 0, `ddCalls=${report.metrics.deobf.ddStateTokens}`);
check('residue.stateLoopsReduced', report.metrics.deobf.forHeaderCount <= 4, `${report.metrics.original.forHeaderCount} -> ${report.metrics.deobf.forHeaderCount}`);

report.failed = failed;
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log('\n验证报告:', reportPath);
console.log(failed ? '结果: FAIL' : '结果: PASS');
process.exit(failed ? 1 : 0);
