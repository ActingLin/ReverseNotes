'use strict';
/**
 * 状态机体检：统计 for(; s !== EXIT;) { switch (s) } 形态
 * 不修改 AST，只输出分类指标，决定下一轮是否值得展开。
 *
 * 用法: node analyze_controlflow.js <input.js> [report.json]
 */
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

const input = process.argv[2];
const reportPath = process.argv[3];
if (!input) {
  console.error('用法: node analyze_controlflow.js <input.js> [report.json]');
  process.exit(1);
}

const ast = parser.parse(fs.readFileSync(input, 'utf8'), {
  sourceType: 'script',
  errorRecovery: false,
});

function unwrapStatements(stmt) {
  // c.consequent 本身是语句数组；兼容传入单条语句的情况
  if (Array.isArray(stmt)) return stmt;
  if (!stmt) return [];
  if (t.isBlockStatement(stmt)) return stmt.body;
  return [stmt];
}

function lastAssignTo(name, stmts) {
  // 从后往前找对 name 的赋值（跳过 break）
  for (let i = stmts.length - 1; i >= 0; i--) {
    let stmt = stmts[i];
    if (t.isBreakStatement(stmt)) continue;
    if (t.isExpressionStatement(stmt)) {
      let expr = stmt.expression;
      if (t.isSequenceExpression(expr)) expr = expr.expressions[expr.expressions.length - 1];
      if (
        t.isAssignmentExpression(expr, { operator: '=' }) &&
        t.isIdentifier(expr.left, { name })
      ) {
        return expr.right;
      }
    }
    return null;
  }
  return null;
}

function terminalKind(stmts) {
  for (let i = stmts.length - 1; i >= 0; i--) {
    const stmt = stmts[i];
    if (t.isBreakStatement(stmt)) continue;
    if (t.isReturnStatement(stmt)) return 'return';
    if (t.isThrowStatement(stmt)) return 'throw';
    return null;
  }
  return null;
}

function successorsOf(expr) {
  if (!expr) return { kind: 'none' };
  if (t.isNumericLiteral(expr)) return { kind: 'one', states: [expr.value] };
  if (t.isConditionalExpression(expr)) {
    const states = [];
    if (t.isNumericLiteral(expr.consequent)) states.push(expr.consequent.value);
    if (t.isNumericLiteral(expr.alternate)) states.push(expr.alternate.value);
    return states.length === 2 ? { kind: 'cond', states } : { kind: 'unknown' };
  }
  return { kind: 'unknown' };
}

let machines = 0;
const categories = {
  chain: 0,
  conditional: 0,
  cyclic: 0,
  joined: 0,
  unknown: 0,
  empty: 0,
};
const details = [];

traverse(ast, {
  ForStatement(p) {
    const node = p.node;
    if (node.init || node.update) return;
    const test = node.test;
    if (!t.isBinaryExpression(test, { operator: '!==' })) return;
    if (!t.isIdentifier(test.left) || !t.isNumericLiteral(test.right)) return;
    const stateName = test.left.name;
    const exitState = test.right.value;
    if (!t.isBlockStatement(node.body) || node.body.body.length !== 1) return;
    const sw = node.body.body[0];
    if (!t.isSwitchStatement(sw) || !t.isIdentifier(sw.discriminant, { name: stateName })) return;

    machines++;
    const binding = p.scope.getBinding(stateName);
    const init =
      binding && binding.path.isVariableDeclarator() && t.isNumericLiteral(binding.path.node.init)
        ? binding.path.node.init.value
        : null;

    const stateMap = new Map();
    let terminalCases = 0;
    let unknownCases = 0;
    for (const c of sw.cases) {
      if (!t.isNumericLiteral(c.test)) {
        unknownCases++;
        continue;
      }
      const stmts = unwrapStatements(c.consequent).filter(Boolean);
      const term = terminalKind(stmts);
      if (term) {
        stateMap.set(c.test.value, { kind: 'terminal', term });
        terminalCases++;
        continue;
      }
      const trans = successorsOf(lastAssignTo(stateName, stmts));
      if (trans.kind === 'one') {
        stateMap.set(c.test.value, { kind: 'one', next: trans.states[0] });
      } else if (trans.kind === 'cond') {
        stateMap.set(c.test.value, { kind: 'cond', next: trans.states });
      } else {
        stateMap.set(c.test.value, { kind: 'unknown' });
        unknownCases++;
      }
    }

    // 从初始状态沿确定性边遍历，分类
    let category = 'chain';
    if (init === null) category = 'unknown';
    else if (stateMap.size === 0) category = 'empty';
    else {
      const seen = new Set();
      let cur = init;
      let joined = false;
      while (true) {
        if (cur === exitState) break;
        if (seen.has(cur)) {
          category = 'cyclic';
          break;
        }
        seen.add(cur);
        const edge = stateMap.get(cur);
        if (!edge) {
          category = 'unknown';
          break;
        }
        if (edge.kind === 'terminal') break;
        if (edge.kind === 'cond') {
          category = 'conditional';
          break;
        }
        if (edge.kind !== 'one') {
          category = 'unknown';
          break;
        }
        // 入度 > 1 检查：别的状态是否也指向 next
        const next = edge.next;
        if (next !== exitState && seen.has(next)) {
          category = 'cyclic';
          break;
        }
        cur = next;
      }
      // 入度统计（仅确定性图）
      const indeg = new Map();
      for (const [, edge] of stateMap) {
        if (edge.kind === 'one') indeg.set(edge.next, (indeg.get(edge.next) || 0) + 1);
        if (edge.kind === 'cond') {
          for (const n of edge.next) indeg.set(n, (indeg.get(n) || 0) + 1);
        }
      }
      for (const [, n] of indeg) if (n > 1) joined = true;
      if (joined && category === 'chain') category = 'joined';
      if (unknownCases > 0 && category === 'chain') category = 'unknown';
    }
    categories[category] = (categories[category] || 0) + 1;
    details.push({
      stateName,
      init,
      exitState,
      cases: sw.cases.length,
      terminalCases,
      unknownCases,
      category,
      loc: node.loc && node.loc.start.line,
    });
  },
});

const report = {
  input,
  machines,
  categories,
  machinesWithInit: details.filter((d) => d.init !== null).length,
  totalCases: details.reduce((s, d) => s + d.cases, 0),
  details,
};
if (reportPath) fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ machines, categories, machinesWithInit: report.machinesWithInit, totalCases: report.totalCases }, null, 2));
console.log('前 15 台机器:');
console.table(details.slice(0, 15));
