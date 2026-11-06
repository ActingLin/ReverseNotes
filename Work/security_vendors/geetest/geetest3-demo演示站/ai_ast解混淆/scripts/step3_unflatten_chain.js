'use strict';
/**
 * Step 3: 保守展开"无环链式"状态机
 *
 * 命中形态:
 *   var s = INIT;
 *   for (; s !== EXIT;) {
 *     switch (s) { case A: <stmts>; s = B; break; ... }
 *   }
 *
 * 仅当满足以下条件才展开:
 *   - 从 INIT 出发是一条无环、无汇合、确定性链
 *   - 每个 case 末尾只有 s = <数字字面量>，或 return/throw 终止
 *   - case 体内没有其他对 s 的引用
 *   - 没有会逃出本 switch/for 的 break/continue，没有顶层函数声明
 *   - s 的所有引用都在该 for 内部
 *
 * 含条件分支、循环、无法识别的机器一律保留原样。
 * 每轮只处理"不包含其他待展开机器"的叶子节点，随后重新 parse，多轮收敛。
 *
 * 用法: node step3_unflatten_chain.js <input> <output> [maxRounds]
 */
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const input = process.argv[2];
const output = process.argv[3];
const maxRounds = Number(process.argv[4] || 10);
if (!input || !output) {
  console.error('用法: node step3_unflatten_chain.js <input> <output> [maxRounds]');
  process.exit(1);
}

function parse(code) {
  return parser.parse(code, { sourceType: 'script', errorRecovery: false });
}

function isInsidePath(path, ancestorPath) {
  let cur = path;
  while (cur) {
    if (cur === ancestorPath) return true;
    cur = cur.parentPath;
  }
  return false;
}

function containsIdentifier(node, name) {
  let found = false;
  t.traverseFast(node, (n) => {
    if (found) return;
    if (t.isIdentifier(n, { name })) found = true;
  });
  return found;
}

// 检查 escape 跳转：未标注的 break/continue 必须有内层循环/switch 承接
function hasEscapingJump(node, inBreakTarget, inLoop) {
  if (!node || typeof node.type !== 'string') return false;
  if (t.isFunction(node)) return false;
  if (t.isBreakStatement(node)) return !!node.label || !inBreakTarget;
  if (t.isContinueStatement(node)) return !!node.label || !inLoop;

  if (t.isForStatement(node) || t.isWhileStatement(node) || t.isDoWhileStatement(node)) {
    // 循环自身的 init/test/update 在循环作用域内，break/continue 不可能出现在这些位置；
    // 直接扫描 body 即可。
    return hasEscapingJump(node.body, true, true);
  }
  if (t.isSwitchStatement(node)) {
    if (hasEscapingJump(node.discriminant, inBreakTarget, inLoop)) return true;
    return node.cases.some((c) => hasEscapingJump(c, true, inLoop));
  }

  const keys = t.VISITOR_KEYS[node.type] || [];
  for (const key of keys) {
    const child = node[key];
    if (Array.isArray(child)) {
      for (const item of child) {
        if (hasEscapingJump(item, inBreakTarget, inLoop)) return true;
      }
    } else if (child && typeof child.type === 'string') {
      if (hasEscapingJump(child, inBreakTarget, inLoop)) return true;
    }
  }
  return false;
}

function matchMachine(forPath) {
  const node = forPath.node;
  if (node.init || node.update || node.await) return { fail: 'shape' };
  const test = node.test;
  if (
    !t.isBinaryExpression(test) ||
    test.operator !== '!==' ||
    !t.isIdentifier(test.left) ||
    !t.isNumericLiteral(test.right)
  ) {
    return { fail: 'shape' };
  }
  const stateName = test.left.name;
  const exitState = test.right.value;
  if (!t.isBlockStatement(node.body) || node.body.body.length !== 1) return { fail: 'shape' };
  const sw = node.body.body[0];
  if (!t.isSwitchStatement(sw) || !t.isIdentifier(sw.discriminant, { name: stateName })) {
    return { fail: 'shape' };
  }

  const binding = forPath.scope.getBinding(stateName);
  if (!binding) return { fail: 'no-binding' };
  if (!binding.path.isVariableDeclarator() || !t.isNumericLiteral(binding.path.node.init)) {
    return { fail: 'init-not-literal' };
  }
  const init = binding.path.node.init.value;

  // 状态变量所有引用必须在 for 内
  for (const rp of binding.referencePaths || []) {
    if (!isInsidePath(rp, forPath)) return { fail: 'ref-outside' };
  }

  const cases = new Map();
  for (const c of sw.cases) {
    if (!t.isNumericLiteral(c.test)) return { fail: 'non-numeric-case' };
    if (cases.has(c.test.value)) return { fail: 'duplicate-case' };
    cases.set(c.test.value, c);
  }

  // 空壳机器：循环体永不执行
  if (init === exitState) {
    return { kind: 'empty', stateName, binding, forPath };
  }

  const order = [];
  const seen = new Set();
  let cur = init;

  while (cur !== exitState) {
    if (seen.has(cur)) return { fail: 'cycle' };
    seen.add(cur);
    const c = cases.get(cur);
    if (!c) return { fail: 'missing-case' };

    const stmts = c.consequent.slice();
    while (stmts.length && t.isBreakStatement(stmts[stmts.length - 1])) stmts.pop();
    if (stmts.length === 0) return { fail: 'empty-case' };

    // 顶层函数声明移动后可能改变 sloppy-mode 块级语义，直接跳过
    if (stmts.some((s) => t.isFunctionDeclaration(s))) return { fail: 'function-decl' };

    const last = stmts[stmts.length - 1];

    if (t.isReturnStatement(last) || t.isThrowStatement(last)) {
      if (stmts.some((s) => containsIdentifier(s, stateName))) return { fail: 'state-ref' };
      if (stmts.some((s) => hasEscapingJump(s, false, false))) return { fail: 'escaping-jump' };
      order.push({ stmts });
      return { kind: 'chain', stateName, binding, forPath, order };
    }

    if (!t.isExpressionStatement(last)) return { fail: 'last-not-assign' };

    let assign = null;
    let remaining = [];
    const expr = last.expression;
    if (
      t.isAssignmentExpression(expr, { operator: '=' }) &&
      t.isIdentifier(expr.left, { name: stateName }) &&
      t.isNumericLiteral(expr.right)
    ) {
      assign = expr;
    } else if (t.isSequenceExpression(expr)) {
      const exprs = expr.expressions;
      const tail = exprs[exprs.length - 1];
      if (
        t.isAssignmentExpression(tail, { operator: '=' }) &&
        t.isIdentifier(tail.left, { name: stateName }) &&
        t.isNumericLiteral(tail.right)
      ) {
        assign = tail;
        remaining = exprs.slice(0, -1);
      }
    }
    if (!assign) return { fail: 'conditional-or-unknown-transition' };

    const kept = stmts.slice(0, -1);
    if (remaining.length === 1) kept.push(t.expressionStatement(remaining[0]));
    else if (remaining.length > 1) kept.push(t.expressionStatement(t.sequenceExpression(remaining)));

    if (kept.some((s) => containsIdentifier(s, stateName))) return { fail: 'state-ref' };
    if (kept.some((s) => hasEscapingJump(s, false, false))) return { fail: 'escaping-jump' };

    order.push({ stmts: kept });
    cur = assign.right.value;
  }

  return { kind: 'chain', stateName, binding, forPath, order };
}

let code = fs.readFileSync(input, 'utf8');
const rounds = [];
const totals = { unflattened: 0, removedEmpty: 0, skipped: 0, failReasons: {} };

for (let round = 1; round <= maxRounds; round++) {
  const ast = parse(code);
  const candidates = [];
  const failReasons = {};

  traverse(ast, {
    ForStatement(p) {
      const m = matchMachine(p);
      if (m.fail) {
        failReasons[m.fail] = (failReasons[m.fail] || 0) + 1;
        return;
      }
      candidates.push(m);
    },
  });

  // 只处理叶子机器：不包含其他候选的 for 节点
  const leaves = candidates.filter((m) => {
    return !candidates.some((other) => {
      if (other === m) return false;
      const a = m.forPath.node;
      const b = other.forPath.node;
      return a.start <= b.start && b.end <= a.end && !(a.start === b.start && a.end === b.end);
    });
  });

  if (leaves.length === 0) {
    rounds.push({ round, unflattened: 0, removedEmpty: 0, skipped: Object.values(failReasons).reduce((a, b) => a + b, 0), failReasons });
    break;
  }

  // 从后往前应用，避免前面的 replace 影响后面的路径
  leaves.sort((a, b) => b.forPath.node.start - a.forPath.node.start);

  let unflattened = 0;
  let removedEmpty = 0;
  for (const m of leaves) {
    if (m.kind === 'empty') {
      // 先移除状态变量声明，再移除循环
      if (m.binding.path.removed) continue;
      m.binding.path.remove();
      if (!m.forPath.removed) m.forPath.remove();
      removedEmpty++;
      continue;
    }

    const stmts = [];
    for (const item of m.order) {
      for (const s of item.stmts) stmts.push(t.cloneNode(s, true));
    }

    if (m.binding.path.removed) continue;
    m.binding.path.remove();
    if (m.forPath.removed) continue;

    const parent = m.forPath.parentPath;
    if (parent.isBlockStatement() || parent.isProgram()) {
      m.forPath.replaceWithMultiple(stmts);
    } else {
      m.forPath.replaceWith(t.blockStatement(stmts));
    }
    unflattened++;
  }

  code = generate(ast, {
    comments: true,
    compact: false,
    jsescOption: { minimal: true },
  }).code;

  const skipped = Object.values(failReasons).reduce((a, b) => a + b, 0);
  rounds.push({ round, unflattened, removedEmpty, skipped, failReasons });
  totals.unflattened += unflattened;
  totals.removedEmpty += removedEmpty;
  totals.skipped = skipped;
  for (const [k, v] of Object.entries(failReasons)) totals.failReasons[k] = v;

  if (unflattened + removedEmpty === 0) break;
}

fs.writeFileSync(output, code);
fs.writeFileSync(
  output.replace(/\.js$/, '_stats.json'),
  JSON.stringify({ rounds, totals }, null, 2)
);
console.log('step3 完成:', totals);
console.log('轮次:', JSON.stringify(rounds));
console.log('输出:', output);
