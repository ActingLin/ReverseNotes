'use strict';
/**
 * Step 2: 清理解码器别名前导块
 *
 * 目标模式（每个函数作用域开头各有一份）：
 *   var A = Vwtrj.$_CV,
 *       B = ['$_marker'].concat(A),
 *       C = B[1];
 *   B.shift();
 *   var D = B[0];
 *
 * 第一轮已把所有 A/C/D 的调用替换成字符串字面量，所以这些声明只剩彼此引用。
 * 本轮按"无引用 + 初始化器可证明无副作用"逐个删除，每轮重新 parse 直到收敛。
 */
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const input = process.argv[2];
const output = process.argv[3];
if (!input || !output) {
  console.error('用法: node step2_cleanup_alias.js <input> <output>');
  process.exit(1);
}

function isPure(node) {
  if (!node) return true;
  switch (node.type) {
    case 'Identifier':
    case 'StringLiteral':
    case 'NumericLiteral':
    case 'BooleanLiteral':
    case 'NullLiteral':
    case 'BigIntLiteral':
      return true;
    case 'ArrayExpression':
      return node.elements.every((el) => !el || (!t.isSpreadElement(el) && isPure(el)));
    case 'MemberExpression':
      return isPure(node.object) && (!node.computed || isPure(node.property));
    case 'CallExpression':
      // 只认可 ['literal'].concat(平凡参数) 这一种零副作用调用
      return (
        t.isMemberExpression(node.callee) &&
        !node.callee.computed &&
        t.isIdentifier(node.callee.property, { name: 'concat' }) &&
        t.isArrayExpression(node.callee.object) &&
        node.arguments.every(isPure)
      );
    case 'UnaryExpression':
      return isPure(node.argument);
    default:
      return false;
  }
}

function bindingOf(identifier, scope) {
  if (!t.isIdentifier(identifier)) return null;
  return scope.getBinding(identifier.name) || null;
}

function parse(code) {
  return parser.parse(code, { sourceType: 'script', errorRecovery: false });
}

let code = fs.readFileSync(input, 'utf8');
const rounds = [];
const total = { removedDeclarators: 0, removedDeclarations: 0, removedShiftStatements: 0 };

for (let round = 1; round <= 12; round++) {
  const ast = parse(code);
  let removedDeclarators = 0;
  let removedDeclarations = 0;
  let removedShiftStatements = 0;

  traverse(ast, {
    VariableDeclaration(p) {
      const kept = [];
      let removedHere = 0;
      for (const decl of p.node.declarations) {
        const binding = bindingOf(decl.id, p.scope);
        const unused = binding ? binding.references === 0 : false;
        if (unused && isPure(decl.init)) {
          removedHere++;
        } else {
          kept.push(decl);
        }
      }
      if (removedHere === 0) return;
      removedDeclarators += removedHere;
      if (kept.length === 0) {
        removedDeclarations++;
        p.remove();
      } else {
        p.node.declarations = kept;
      }
    },

    ExpressionStatement(p) {
      // 只删除"临时数组唯一剩余引用"的 X.shift()，避免误删真实副作用
      const expr = p.node.expression;
      if (
        !t.isCallExpression(expr) ||
        !t.isMemberExpression(expr.callee) ||
        expr.callee.computed ||
        !t.isIdentifier(expr.callee.property, { name: 'shift' }) ||
        expr.arguments.length !== 0
      ) {
        return;
      }
      const binding = bindingOf(expr.callee.object, p.scope);
      if (!binding || !binding.constant) return;
      const refs = binding.referencePaths || [];
      const onlyThisUse = refs.length === 1 && refs[0] === p.get('expression.callee.object');
      if (onlyThisUse) {
        p.remove();
        removedShiftStatements++;
      }
    },
  });

  code = generate(ast, {
    comments: true,
    compact: false,
    jsescOption: { minimal: true },
  }).code;

  rounds.push({ round, removedDeclarators, removedDeclarations, removedShiftStatements });
  total.removedDeclarators += removedDeclarators;
  total.removedDeclarations += removedDeclarations;
  total.removedShiftStatements += removedShiftStatements;

  if (removedDeclarators + removedDeclarations + removedShiftStatements === 0) break;
}

fs.writeFileSync(output, code);
fs.writeFileSync(
  output.replace(/\.js$/, '_stats.json'),
  JSON.stringify({ rounds, total }, null, 2)
);
console.log('step2 完成:', total);
console.log('轮次:', JSON.stringify(rounds));
console.log('输出:', output);
