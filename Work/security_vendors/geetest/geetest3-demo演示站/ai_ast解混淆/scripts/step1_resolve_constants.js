'use strict';
/**
 * Step 1: 常量解析
 *   1) 识别 Vwtrj.$_CV 的函数别名（var A = Vwtrj.$_CV; ['x'].concat(A)[1]; arr.shift(); arr[0]）
 *   2) 把所有解码器调用替换为字符串字面量
 *   3) 把 Vwtrj.$_DD()[a][b] 替换为规范化状态 token（0..20）
 *
 * 用法: node step1_resolve_constants.js <input> <output> [original]
 */
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const { loadDecoders } = require('./lib_decoders');

const input = process.argv[2];
const output = process.argv[3];
const original = process.argv[4] || path.join(__dirname, '..', 'source', 'original', 'fullpage.9.2.0-guwyxh.js');
if (!input || !output) {
  console.error('用法: node step1_resolve_constants.js <input> <output> [original]');
  process.exit(1);
}

const { decode, tokenMap } = loadDecoders(original);
const source = fs.readFileSync(input, 'utf8');
const ast = parser.parse(source, {
  sourceType: 'script',
  allowReturnOutsideFunction: false,
  errorRecovery: false,
});

const isVwtrjMember = (node, prop) =>
  t.isMemberExpression(node) &&
  !node.computed &&
  t.isIdentifier(node.object, { name: 'Vwtrj' }) &&
  t.isIdentifier(node.property, { name: prop });

function isDecoderMember(node) {
  return isVwtrjMember(node, '$_CV');
}

function propIndex(node) {
  if (t.isNumericLiteral(node)) return node.value;
  if (t.isStringLiteral(node) && /^\d+$/.test(node.value)) return Number(node.value);
  return null;
}

// binding.path (VariableDeclarator path) -> 'decoder' | 'decoderArray'
const kindByDeclarator = new Map();
// 被调用过 .shift() 的数组绑定（用于判定 arr[0] 是否已指向解码器）
const shiftedDeclarators = new Set();

function resolveBindingDeclarator(identifier, scope) {
  if (!t.isIdentifier(identifier)) return null;
  const binding = scope.getBinding(identifier.name);
  if (!binding || !binding.constant) return null;
  const p = binding.path;
  return p.isVariableDeclarator() ? p : null;
}

function kindOfExpression(node, scope) {
  if (!node) return null;
  if (isDecoderMember(node)) return 'decoder';
  if (t.isIdentifier(node)) {
    const decl = resolveBindingDeclarator(node, scope);
    return decl ? kindByDeclarator.get(decl) || null : null;
  }
  if (t.isCallExpression(node)) {
    const callee = node.callee;
    if (
      t.isMemberExpression(callee) &&
      !callee.computed &&
      t.isIdentifier(callee.property, { name: 'concat' }) &&
      t.isArrayExpression(callee.object) &&
      node.arguments.length >= 1
    ) {
      const kinds = node.arguments.map((arg) => kindOfExpression(arg, scope));
      if (kinds.some((k) => k === 'decoder')) return 'decoderArray';
    }
    return null;
  }
  if (t.isMemberExpression(node)) {
    const idx = propIndex(node.property);
    if (idx !== 0 && idx !== 1) return null;
    const objKind = kindOfExpression(node.object, scope);
    if (objKind !== 'decoderArray') return null;
    if (idx === 1) return 'decoder';
    const decl = resolveBindingDeclarator(node.object, scope);
    return decl && shiftedDeclarators.has(decl) ? 'decoder' : null;
  }
  return null;
}

// 第一遍：收集 shift() 目标
traverse(ast, {
  ExpressionStatement(p) {
    const expr = p.node.expression;
    if (
      t.isCallExpression(expr) &&
      t.isMemberExpression(expr.callee) &&
      !expr.callee.computed &&
      t.isIdentifier(expr.callee.property, { name: 'shift' })
    ) {
      const decl = resolveBindingDeclarator(expr.callee.object, p.scope);
      if (decl) shiftedDeclarators.add(decl);
    }
  },
});

// 第二遍：不动点标记别名
let changed = true;
while (changed) {
  changed = false;
  traverse(ast, {
    VariableDeclarator(p) {
      if (kindByDeclarator.has(p)) return;
      const kind = kindOfExpression(p.node.init, p.scope);
      if (kind) {
        kindByDeclarator.set(p, kind);
        changed = true;
      }
    },
  });
}

// 第三遍：替换解码器调用与状态 token
const stats = {
  stringsReplaced: 0,
  tokensReplaced: 0,
  skippedDecoderCalls: 0,
  undefinedDecodes: 0,
  missingTokens: 0,
  decoderAliases: 0,
};
stats.decoderAliases = [...kindByDeclarator.values()].filter((k) => k === 'decoder').length;

traverse(ast, {
  CallExpression(p) {
    const callee = p.node.callee;
    let isDecoder = false;
    if (isDecoderMember(callee)) {
      isDecoder = true;
    } else if (t.isIdentifier(callee)) {
      const decl = resolveBindingDeclarator(callee, p.scope);
      isDecoder = !!decl && kindByDeclarator.get(decl) === 'decoder';
    }
    if (!isDecoder) return;

    const args = p.node.arguments;
    if (args.length !== 1 || !t.isNumericLiteral(args[0])) {
      stats.skippedDecoderCalls++;
      return;
    }
    const value = decode(args[0].value);
    if (typeof value === 'undefined') {
      stats.undefinedDecodes++;
      return;
    }
    p.replaceWith(t.stringLiteral(value));
    stats.stringsReplaced++;
  },

  MemberExpression(p) {
    // 形如 Vwtrj.$_DD()[a][b]
    const outer = p.node;
    if (!outer.computed || !t.isNumericLiteral(outer.property)) return;
    const mid = outer.object;
    if (!t.isMemberExpression(mid) || !mid.computed || !t.isNumericLiteral(mid.property)) return;
    const call = mid.object;
    if (
      !t.isCallExpression(call) ||
      call.arguments.length !== 0 ||
      !isVwtrjMember(call.callee, '$_DD')
    ) {
      return;
    }
    // key 顺序必须是 [a][b] 中 a 在前（mid 是 [a]，outer 是 [b]）
    const key = mid.property.value + ',' + outer.property.value;
    if (!tokenMap.has(key)) {
      stats.missingTokens++;
      return;
    }
    p.replaceWith(t.numericLiteral(tokenMap.get(key)));
    stats.tokensReplaced++;
  },
});

const result = generate(ast, {
  comments: true,
  compact: false,
  jsescOption: { minimal: true },
  retainLines: false,
});
fs.writeFileSync(output, result.code);
fs.writeFileSync(
  path.join(path.dirname(output), 'fullpage_step1_stats.json'),
  JSON.stringify(stats, null, 2)
);
console.log('step1 完成:', stats);
console.log('输出:', output);
