'use strict';
/**
 * Step 5: 确定性重命名（阅读版收尾）
 *
 * 只重命名以 $_ 开头的"局部绑定"（函数名/参数/var），不碰对象属性名
 * （.$_XXX 与 {$_XXX: ...} 是库内部 API 字段，属于混淆产物的一部分）。
 *
 * 安全性前提：样本中不存在 with / eval / new Function，也没有字符串引用变量名。
 *
 * 用法: node step5_rename_locals.js <input> <output>
 */
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const input = process.argv[2];
const output = process.argv[3];
if (!input || !output) {
  console.error('用法: node step5_rename_locals.js <input> <output>');
  process.exit(1);
}

const source = fs.readFileSync(input, 'utf8');
const ast = parser.parse(source, { sourceType: 'script', errorRecovery: false });

const seen = new Set();
const bindings = [];
traverse(ast, {
  Scopable(p) {
    for (const binding of Object.values(p.scope.bindings)) {
      if (!/^\$_/.test(binding.identifier.name)) continue;
      if (seen.has(binding.identifier)) continue;
      seen.add(binding.identifier);
      bindings.push(binding);
    }
  },
});

bindings.sort((a, b) => (a.identifier.start || 0) - (b.identifier.start || 0));

const counters = { f: 0, a: 0, v: 0 };
const renames = [];
for (const binding of bindings) {
  const kind = binding.kind;
  let prefix = 'v';
  if (kind === 'hoisted' || kind === 'local') prefix = 'f';
  else if (kind === 'param') prefix = 'a';

  let newName;
  do {
    counters[prefix]++;
    newName = '_' + prefix + counters[prefix];
  } while (binding.scope.hasBinding(newName, true));

  const oldName = binding.identifier.name;
  binding.scope.rename(oldName, newName);
  renames.push({ oldName, newName, kind, line: binding.identifier.loc && binding.identifier.loc.start.line });
}

const result = generate(ast, {
  comments: true,
  compact: false,
  jsescOption: { minimal: true },
});
fs.writeFileSync(output, result.code);
fs.writeFileSync(output.replace(/\.js$/, '_renames.json'), JSON.stringify({ count: renames.length, renames }, null, 2));
console.log(`step5 完成: 重命名 ${renames.length} 个局部绑定`);
console.log('输出:', output);
