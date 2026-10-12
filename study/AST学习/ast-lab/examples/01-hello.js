/**
 * 01-hello.js —— AST 的"Hello World"
 *
 * 目的：用最小的代码，让你亲眼看到 AST 变换的三步流程。
 *
 * 运行：node 01-hello.js
 *
 * 学完这个例子你应该能回答：
 *   1. AST 变换的三个步骤分别是什么？
 *   2. visitor 是什么？
 *   3. 为什么路径是 path.node.kind 而不是 node.kind？
 */

// ========== 第 0 步：把"工具"引进来 ==========
// 这四个库是 AST 反混淆的"四大件"，以后每个脚本都会出现它们。
const parser = require('@babel/parser');              // 代码 → AST
const traverse = require('@babel/traverse').default;  // 遍历/修改 AST
const generator = require('@babel/generator').default; // AST → 代码

// ========== 输入：一段最简单的 JS 代码 ==========
const code = `var a = 1; var b = 2;`;

console.log('【原始代码】');
console.log(code);

// ========== 第 1 步：parse —— 把代码字符串解析成 AST ==========
// parser.parse() 内部做了两件事：
//   ① 词法分析：把 "var a = 1;" 切成 ["var", " ", "a", " ", "=", " ", "1", ";"] 这样的 token
//   ② 语法分析：按 JS 语法规则，把 token 组成树
// 结果就是一棵 JSON 树。我们可以打印出来看看它长什么样。
const ast = parser.parse(code);

console.log('\n【解析出来的 AST（只看 body 部分）】');
// 注意：start/end/loc 是"这个节点在源码中的位置"，对理解结构没用，打印时过滤掉
console.log(JSON.stringify(ast.program.body, (key, value) => {
  if (['start', 'end', 'loc', 'range'].includes(key)) return undefined;
  return value;
}, 2));
// ↑ 你会看到：每个 VariableDeclaration 节点上有 kind: "var"
//   而我们想要的修改，就是把这个 kind 改成 "let"

// ========== 第 2 步：traverse —— 遍历 AST 并修改 ==========
// traverse 会深度优先地"爬"整棵树，每爬到一个节点就查一遍：
//   "visitor 里有没有和这个节点 type 同名的函数？有就调用它。"
// 我们这里写 `VariableDeclaration`，意思是"每次遇到变量声明节点，就执行我"。
traverse(ast, {
  // 参数 path 不是"节点本身"，而是一个"路径对象"，
  // 它记录了"这个节点在哪、它的爸爸是谁、它所在的作用域有什么变量"等上下文。
  // 要拿节点本身，得用 path.node。
  VariableDeclaration(path) {
    console.log(`\n【遍历到变量声明】kind 当前是 "${path.node.kind}"`);
    if (path.node.kind === 'var') {
      path.node.kind = 'let';  // 直接改属性值 —— 最简单的修改方式
      console.log(`  已改成 "let"`);
    }
  }
});

// ========== 第 3 步：generate —— 把修改后的 AST 变回代码 ==========
// generator 接收 AST，返回一个对象，其中 .code 就是生成的代码字符串。
const output = generator(ast).code;

console.log('\n【变换后的代码】');
console.log(output);

/*
 * ============ 小结：为什么要有这三步？ ============
 *
 * 如果只是想把 var 换成 let，用正则 replace(/var/g, 'let') 也能做。
 * 但正则不认识"语法结构"：
 *   - 它分不清 var 是变量声明，还是字符串里的 "var" 三个字母
 *   - 它做不到"只替换某个函数内部的变量"
 *   - 它没法判断"这个变量的值是不是常量、能不能安全替换"
 *
 * AST 把代码变成了"结构化的数据"，于是修改代码就变成了"修改对象属性"，
 * 精确、可控、可编程 —— 这就是反混淆要用 AST 的根本原因。
 *
 * 记住这个骨架，后面所有的反混淆脚本都是它的变体：
 *
 *     parse(代码) → 用 visitor 修改 → generate(代码)
 */
