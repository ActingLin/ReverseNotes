'use strict';
/**
 * 提取极验 fullpage 自定义混淆器的两个常量源：
 *   1) Vwtrj.$_CV(n)        -> 字符串表第 n 项（XOR 解码后按 '^' 拆分）
 *   2) Vwtrj.$_DD()[a][b]   -> 状态 token（21x21 引用矩阵，按外层数组身份归一化）
 *
 * 只在 vm 中执行文件头部的两个自包含 IIFE，不执行整份样本。
 */
const fs = require('fs');
const vm = require('vm');

function loadDecoders(file) {
  const src = fs.readFileSync(file, 'utf8');
  const boundary = /!function\s*\(/.exec(src);
  if (!boundary) throw new Error('未找到主 IIFE 边界 !function(');
  const end = boundary.index;

  const head = 'function Vwtrj() {}\n' + src.slice(0, end);
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(head, sandbox, { timeout: 5000 });

  const Vwtrj = sandbox.Vwtrj;
  if (!Vwtrj || typeof Vwtrj.$_CV !== 'function' || typeof Vwtrj.$_DD !== 'function') {
    throw new Error('解码器提取失败：Vwtrj.$_CV / Vwtrj.$_DD 不可用');
  }

  const decode = (n) => Vwtrj.$_CV(n);
  const matrix = Vwtrj.$_DD();

  // 矩阵每个单元格都引用某一个外层数组；同引用 = 同一状态 token。
  // 归一化为外层下标 0..N-1，替换后仍保持原来的相等/不等关系。
  const tokenMap = new Map();
  const invalid = [];
  for (let a = 0; a < matrix.length; a++) {
    for (let b = 0; b < matrix[a].length; b++) {
      const cell = matrix[a][b];
      const idx = matrix.findIndex((row) => row === cell);
      if (idx < 0) invalid.push([a, b]);
      else tokenMap.set(a + ',' + b, idx);
    }
  }

  return { decode, matrix, tokenMap, invalid, size: matrix.length };
}

module.exports = { loadDecoders };
