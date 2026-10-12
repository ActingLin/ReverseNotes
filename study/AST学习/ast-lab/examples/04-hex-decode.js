/**
 * 04-hex-decode.js —— 实战第二课：还原十六进制 / 转义字符"伪装"的字符串
 *
 * ============ 场景还原 ============
 * 混淆代码里你经常看到这种写法：
 *
 *     var _0x1234 = 0x1a2b;                  // 十六进制数字
 *     console['\x6c\x6f\x67']('\x68\x69');   // 字符串被转义
 *
 * 明明 "\x6c\x6f\x67" 拼起来就是 "log"，"\x68\x69" 就是 "hi"，
 * 但满屏都是转义，人眼根本没法读。
 *
 * ============ 原理：Babel 存了两份值 ============
 * 解析 "0x1a2b" 时，节点长这样：
 *
 *     {
 *       type: 'NumericLiteral',
 *       value: 6699,              ← 真实值（计算机算好的）
 *       extra: {
 *         raw: '0x1a2b',          ← 源码原文（给人看的写法）
 *         rawValue: 6699
 *       }
 *     }
 *
 * generator 生成代码时，**如果节点上有 extra.raw，就优先用原文输出**，
 * 这就是"还原后代码还是一堆转义"的原因。
 * 所以还原方法极其简单：**把 extra 属性删掉**，generator 就会用 value 重新生成。
 *
 * 运行：node 04-hex-decode.js
 */

const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

const code = `
var _0x1234 = 0x1a2b;
var _0x5678 = 1e3;
console['\\x6c\\x6f\\x67']('\\x68\\x65\\x6c\\x6c\\x6f');
var s = "\\u4f60\\u597d";
var octal = '\\162\\145\\164';
`;

console.log('【原始代码】\n' + code);

const ast = parser.parse(code);

// 先看看解析后 value 和 raw 的区别（只挑一个数字节点看）
traverse(ast, {
  NumericLiteral(path) {
    if (path.node.extra && path.node.extra.raw === '0x1a2b') {
      console.log('【观察一个节点】0x1a2b 在 AST 里其实是两份值：');
      console.log('  node.value      =', path.node.value, '  ← 真实值（十进制）');
      console.log('  node.extra.raw  =', path.node.extra.raw, '  ← 源码原文');
      path.stop(); // 看过一个就够了，停掉遍历
    }
  }
});

// ============ 正式还原：删掉所有字面量的 extra（及 raw） ============
console.log('\n【开始还原：删除 extra 属性】');
traverse(ast, {
  // 用别名 "Literal" 一次匹配所有字面量：
  // StringLiteral、NumericLiteral、BooleanLiteral、RegExpLiteral...
  // （@babel/types 里定义了一组"别名"，见主笔记 3.9 节）
  Literal(path) {
    if (path.node.extra) {
      const before = path.node.extra.raw;
      delete path.node.extra;   // ★ 核心：删掉"源码原文"，只留 value
      console.log(`  → 还原 ${before}`);
    }
  }
});

// 顺带：把 a['b'] 这种"方括号访问"还原成 a.b（可读性修复）
traverse(ast, {
  MemberExpression(path) {
    if (path.node.computed && path.node.property.type === 'StringLiteral') {
      const name = path.node.property.value;
      // 只有合法的标识符才能用点号访问（比如 'hello-world' 就不行）
      if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)) {
        path.node.property = require('@babel/types').identifier(name);
        path.node.computed = false;   // computed: true → false 就变成点号形式
        console.log(`  → 方括号访问还原为点号：${name}`);
      }
    }
  }
});

// ★ 第二个知识点：生成时加 jsescOption: { minimal: true }
// 不加这个选项时，generator 会把非 ASCII 字符（中文）重新输出成 \uXXXX 转义，
// 明明节点里存的是"你好"两个字，生成出来却还是 "你好"。
// 加了之后才会输出原文。这是"还原不彻底"最常见的原因之一。
const output = generator(ast, { jsescOption: { minimal: true } }).code;

console.log('\n【还原后的代码】');
console.log(output);

console.log('\n【试试直接运行还原后的代码】');
eval(output);   // 输出 hello —— 语义完全没变，只是变好看了

/*
 * ============ 为什么"删 extra"是反混淆的第一步？============
 *
 * ① 这是"零风险变换"：value 是 Babel 算好的真实值，删掉 raw 只是让
 *    generator 换一种写法输出，代码语义 100% 不变。
 *
 * ② 它是后续所有工作的前提：
 *    - 你想用"字符串搜索"找某个关键字？转义不还原，永远搜不到
 *    - 你想做常量折叠？比较节点值时 raw 会干扰判断
 *    - 你想看懂代码？满屏 \x6c\x6f\x67 根本没法读
 *
 * ③ 反过来，混淆器怎么利用它？故意把可读字符串写成转义形式，
 *    成本极低（一个转义就完事），却能挡住 90% 的"Ctrl+F 搜索党"。
 *
 * ============ 常见坑 ============
 * - 有些混淆器用 "八进制转义"（\162\145\164）或"Unicode 编码"，
 *   Babel 解析后同样体现在 extra.raw 上，删 extra 一样能还原。
 * - 但如果是**运行时拼接**的字符串（如 'a' + 'b' + 'c'、String.fromCharCode(104,105)），
 *   那就不属于"字面量伪装"，需要常量折叠（见 05）或函数求值（见 06）来处理。
 * - jsescOption: { minimal: true } 在 generate 时的作用是：把"非 ASCII 字符"
 *   输出为原字符而不是 \uXXXX 转义，让中文正常显示。见主笔记和顶象案例。
 */
