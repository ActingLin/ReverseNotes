'use strict';
/**
 * Step 4: 可读性规范化（低风险 pass）
 *   1) 清除字面量 raw/extra，让 ex... 还原为可读字符
 *   2) obj["extend"] -> obj.extend（仅合法标识符）
 *   3) {"key": v} -> {key: v}（仅合法标识符）
 *   4) ExpressionStatement 中的逗号表达式拆成多条语句
 *   5) !0 / !1 -> true / false
 *   6) 可静态求值的二元/逻辑表达式折叠
 *   7) 常量 if 折叠（被丢弃分支含 var/函数声明时保留）
 *   8) 删除空语句
 *
 * 用法: node step4_readability.js <input> <output>
 */
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const input = process.argv[2];
const output = process.argv[3];
if (!input || !output) {
  console.error('用法: node step4_readability.js <input> <output>');
  process.exit(1);
}

const source = fs.readFileSync(input, 'utf8');
const ast = parser.parse(source, { sourceType: 'script', errorRecovery: false });

const stats = {
  extrasCleared: 0,
  memberToDot: 0,
  objectKeyToIdentifier: 0,
  sequencesSplit: 0,
  booleansFolded: 0,
  constantsFolded: 0,
  constantIfFolded: 0,
  emptyStatementsRemoved: 0,
};

function clearExtra(node) {
  if (node && node.extra) {
    node.extra = undefined;
    stats.extrasCleared++;
  }
}

function validKey(name) {
  return typeof name === 'string' && t.isValidIdentifier(name) && name !== '__proto__';
}

traverse(ast, {
  'StringLiteral|NumericLiteral|BooleanLiteral|NullLiteral|RegExpLiteral'(p) {
    clearExtra(p.node);
  },

  MemberExpression(p) {
    const node = p.node;
    if (!node.computed) return;
    if (!t.isStringLiteral(node.property)) return;
    if (!validKey(node.property.value)) return;
    node.property = t.identifier(node.property.value);
    node.computed = false;
    stats.memberToDot++;
  },

  ObjectProperty(p) {
    const node = p.node;
    if (node.computed) return;
    if (!t.isStringLiteral(node.key)) return;
    if (!validKey(node.key.value)) return;
    node.key = t.identifier(node.key.value);
    stats.objectKeyToIdentifier++;
  },

  ExpressionStatement(p) {
    const expr = p.node.expression;
    if (!t.isSequenceExpression(expr)) return;
    const stmts = expr.expressions.map((e) => t.expressionStatement(e));
    p.replaceWithMultiple(stmts);
    stats.sequencesSplit++;
  },

  UnaryExpression(p) {
    const node = p.node;
    if (node.operator === '!' && t.isNumericLiteral(node.argument)) {
      if (node.argument.value === 0 || node.argument.value === 1) {
        p.replaceWith(t.booleanLiteral(node.argument.value === 0));
        stats.booleansFolded++;
      }
    }
  },

  'BinaryExpression|LogicalExpression'(p) {
    const evaluated = p.evaluate();
    if (!evaluated.confident) return;
    const v = evaluated.value;
    if (v === null || ['string', 'number', 'boolean'].includes(typeof v)) {
      p.replaceWith(t.valueToNode(v));
      stats.constantsFolded++;
    }
  },

  IfStatement(p) {
    const test = p.get('test');
    const evaluated = test.evaluate();
    if (!evaluated.confident) return;

    const kept = evaluated.value ? p.node.consequent : p.node.alternate;
    const dropped = evaluated.value ? p.node.alternate : p.node.consequent;

    // 被丢弃分支如果含 var 声明或函数声明，保留原结构以免改变 hoisting
    if (dropped && containsVarOrFunction(dropped)) return;

    if (!kept) {
      p.remove();
    } else if (t.isBlockStatement(kept)) {
      const parent = p.parentPath;
      if (parent.isBlockStatement() || parent.isProgram()) p.replaceWithMultiple(kept.body);
      else p.replaceWith(kept);
    } else {
      p.replaceWith(kept);
    }
    stats.constantIfFolded++;
  },

  EmptyStatement(p) {
    p.remove();
    stats.emptyStatementsRemoved++;
  },
});

function containsVarOrFunction(node) {
  let found = false;
  t.traverseFast(node, (n) => {
    if (found) return;
    if (t.isVariableDeclaration(n, { kind: 'var' })) found = true;
    else if (t.isFunctionDeclaration(n)) found = true;
  });
  return found;
}

const result = generate(ast, {
  comments: true,
  compact: false,
  jsescOption: { minimal: true },
});
fs.writeFileSync(output, result.code);
fs.writeFileSync(output.replace(/\.js$/, '_stats.json'), JSON.stringify(stats, null, 2));
console.log('step4 完成:', stats);
console.log('输出:', output);
