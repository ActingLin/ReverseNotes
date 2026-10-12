/**
 * 02-walk.js —— 亲手爬一遍 AST，理解"树"和"遍历"
 *
 * 目的：AST 是棵树，反混淆就是在树上"找节点、改节点"。
 *       这个脚本把整棵树打印出来，让你建立"空间感"。
 *
 * 运行：node 02-walk.js
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const code = `const x = 1 + 2;`;

console.log('【原始代码】\n' + code + '\n');

const ast = parser.parse(code);

// ============ 1. 先看整棵树的原始样子 ============
console.log('【AST 的 JSON 形式（就是普通的对象嵌套）】');
console.log(JSON.stringify(ast, (key, value) => {
  // start/end/loc 是位置信息，太长，打印时先过滤掉，方便看结构
  if (['start', 'end', 'loc', 'range'].includes(key)) return undefined;
  return value;
}, 2));

// ============ 2. 用 visitor 爬树，观察"进入"与"离开" ============
// 每个节点会被访问两次：
//   enter（进入）：刚爬到它、还没爬到它的子节点时
//   exit （离开）：它的所有子节点都爬完了，准备走的时候
//
// 为什么要区分？举两个真实场景：
//   - 常量折叠 1+2 → 3：必须"子节点先算完，父节点才能算"，
//     所以要在 exit 阶段做（自底向上）。
//   - 收集全局函数声明：enter 时先记下来（自顶向下）。
console.log('\n【遍历过程：注意缩进反映树的层级】');

let depth = 0;
traverse(ast, {
  enter(path) {
    // path.type 就是节点类型；path.node 是节点本身
    console.log(`${'  '.repeat(depth)}→ enter ${path.type}`);
    depth++;
  },
  exit(path) {
    depth--;
    console.log(`${'  '.repeat(depth)}← exit  ${path.type}`);
  }
});

/*
 * ============ 观察输出，理解三件事 ============
 *
 * ① 树是分层的：
 *      Program（整个程序）
 *        └─ VariableDeclaration（const x = ...）
 *             └─ VariableDeclarator（x = ...）
 *                  ├─ Identifier（x）        ← 变量名
 *                  └─ BinaryExpression（1 + 2）← 表达式
 *                       ├─ NumericLiteral（1）
 *                       └─ NumericLiteral（2）
 *
 * ② 每个节点都有 type 字段（Program / VariableDeclaration / ...），
 *    这就是 visitor 里写的名字。写 `Identifier(path){}` 就能只处理标识符。
 *
 * ③ enter/exit 的配对出现，构成"深度优先遍历"。
 *    记住这条铁律：想自底向上处理（先子后父），用 exit。
 *
 * ============ 常用"找节点"套路 ============
 *
 * 想找什么，就写什么类型的 visitor：
 *   - 找所有函数调用   → CallExpression
 *   - 找所有字符串     → StringLiteral
 *   - 找 while 循环    → WhileStatement
 *   - 找变量声明       → VariableDeclaration / VariableDeclarator
 *
 * 拿不准某个语法对应什么节点？去 https://astexplorer.net 输入代码点一下就知道。
 */
