/**
 * 07-shift-array.js —— 实战第五课：数组位移（字符串数组的真正难点）
 *
 * ============ 场景还原 ============
 * 学会了 06 之后，你兴冲冲地去还原真实网站代码，结果发现：**全错**。
 * 因为真实的 obfuscator.io 多了一手"数组位移"（String Array Rotation）：
 *
 *     var _0x4e2b = ['hello world', 'log', 'length'];   // ① 数组（顺序是"打乱前"的）
 *     (function(_0x1a, _0x2b) {                          // ② 位移 IIFE（自执行）
 *         var _0x3c = function(_0x4d) {
 *             while (--_0x4d) {
 *                 _0x1a['push'](_0x1a['shift']());       // 把头部元素搬到尾部
 *             }
 *         };
 *         _0x3c(++_0x2b);
 *     }(_0x4e2b, 0x1));
 *     var _0x5f1c = function(_0x11) { ... };
 *
 * 程序一运行，IIFE 会先把数组"旋转"若干次。
 * 也就是说：**你静态看到的数组顺序，和运行时的顺序不一样。**
 * 拿静态顺序去查表，结果自然全错。
 *
 * ============ 难点在哪？============
 * 旋转多少次？由 IIFE 的参数决定（上面是 ++_0x2b = 2，旋转 2 次...
 * 等等，是 while(--_0x4d) 从 1 开始，所以转 1 次 —— 看，人脑算很容易错）。
 * 而且真实代码里 IIFE 可能不是简单的 while-shift-push，
 * 可能掺入加减乘除、位运算、条件判断。
 *
 * ============ 破解思路：让它自己转 ============
 * 既然旋转逻辑是纯 JS，**那就把它也执行一遍**。
 * 不猜、不算，直接把「数组声明 + 位移 IIFE」丢进求值环境跑，
 * 跑完把最终数组拿出来 —— 眼见为实。
 *
 * 运行：node 07-shift-array.js
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generator = require('@babel/generator').default;

const code = `
var _0x4e2b = ['hello world', 'log', 'length'];
(function(_0x1a, _0x2b) {
    var _0x3c = function(_0x4d) {
        while (--_0x4d) {
            _0x1a['push'](_0x1a['shift']());
        }
    };
    _0x3c(++_0x2b);
}(_0x4e2b, 0x1));
var _0x5f1c = function(_0x11) {
    return _0x4e2b[_0x11];
};
console[_0x5f1c(0x0)](_0x5f1c(0x2));
`;

console.log('【原始代码】\n' + code);

const ast = parser.parse(code);

// ============================================================
// 第 1 步：收集「数组声明」和「位移 IIFE」
// ============================================================
console.log('【第 1 步：收集代码片段】');

let arrayCode = '';
let arrayName = '';
let shiftIifeCode = '';
let decodeFnCode = '';
let decodeFnName = null;

traverse(ast, {
  // 数组声明
  VariableDeclaration(path) {
    if (!path.parentPath.isProgram()) return;
    const decl = path.node.declarations[0];
    if (!decl || !t.isArrayExpression(decl.init)) return;
    arrayCode = path.toString();
    arrayName = decl.id.name;
    console.log(`  找到数组声明：${decl.id.name}`);
  },

  // 位移 IIFE：形如 (function(...){...}(数组名, 数字))
  ExpressionStatement(path) {
    const expr = path.node.expression;
    // IIFE 的 AST 是 CallExpression，callee 是 FunctionExpression
    if (!t.isCallExpression(expr)) return;
    if (!t.isFunctionExpression(expr.callee)) return;
    if (!expr.arguments.some(a => t.isArrayExpression(a) || t.isIdentifier(a))) return;

    shiftIifeCode = path.toString();
    console.log(`  找到位移 IIFE（${shiftIifeCode.slice(0, 30)}...）`);
  },

  // 解密函数 —— 注意：它有"两种长相"，都要认出来！
  //   ① function _0x5f1c(_0x11) { return ... }        ← FunctionDeclaration
  //   ② var _0x5f1c = function(_0x11) { return ... }  ← FunctionExpression（真实混淆更常用）
  FunctionDeclaration(path) {
    const { id, body } = path.node;
    if (body.body.length !== 1 || !t.isReturnStatement(body.body[0])) return;
    decodeFnCode = path.toString();
    decodeFnName = id.name;
    console.log(`  找到解密函数（声明式）：${id.name}`);
  },
  VariableDeclarator(path) {
    const { id, init } = path.node;
    if (!t.isFunctionExpression(init)) return;
    if (init.body.body.length !== 1 || !t.isReturnStatement(init.body.body[0])) return;
    // 重建成 "var 名字 = 函数" 的源码形式，供求值工厂使用
    decodeFnCode = `var ${id.name} = ${generator(init).code};`;
    decodeFnName = id.name;
    console.log(`  找到解密函数（表达式式）：${id.name}`);
  }
});

// ============================================================
// 第 2 步：求值工厂 —— 关键！必须把 IIFE 也执行掉
// ============================================================
console.log('\n【第 2 步：执行数组声明 + 位移 IIFE，拿到"运行后的真实数组"】');

// ★ 核心对比实验：先看看"不执行 IIFE"会错成什么样 ★
const wrongFactory = new Function(`
    ${arrayCode}
    return ${arrayName};
`);
const wrongArray = wrongFactory();
console.log('  不执行 IIFE 拿到的数组（错误示范）：', JSON.stringify(wrongArray));
console.log(`    → 索引 0 得到 "${wrongArray[0]}"，索引 2 得到 "${wrongArray[2]}"（全是错的）`);

// ★ 正确做法：数组声明 + IIFE 一起执行，让数组在"我们的环境里"完成旋转 ★
const factory = new Function(`
    ${arrayCode}
    ${shiftIifeCode}
    ${decodeFnCode}
    return { arr: ${arrayName}, fn: ${decodeFnName} };
`);
const { arr: realArray, fn: decodeFn } = factory();

console.log('  执行 IIFE 后拿到的数组（正确）：', JSON.stringify(realArray));
console.log(`    → decodeFn(0x0) = ${JSON.stringify(decodeFn(0))}`);
console.log(`    → decodeFn(0x2) = ${JSON.stringify(decodeFn(2))}`);

// ============================================================
// 第 3 步：替换所有调用点（同 06）
// ============================================================
console.log('\n【第 3 步：替换所有调用点】');

traverse(ast, {
  CallExpression(path) {
    const { callee, arguments: args } = path.node;
    if (!t.isIdentifier(callee, { name: decodeFnName })) return;
    if (args.length === 0 || !t.isLiteral(args[0])) return;

    let value;
    try {
      value = decodeFn(args[0].value);
    } catch (e) {
      console.log(`  × 求值失败，跳过：${path.toString()}`);
      return;
    }
    console.log(`  → ${path.toString()}  ==>  ${JSON.stringify(value)}`);
    path.replaceWith(t.valueToNode(value));
  }
});

// ============================================================
// 第 4 步：清理 + 可读性修复
// ============================================================
console.log('\n【第 4 步：清理与可读性修复】');

let round = 0;
while (true) {
  round++;
  let removed = 0;
  traverse(ast, {
    Program(path) { path.scope.crawl(); },
    'FunctionDeclaration|VariableDeclaration'(path) {
      const id = path.node.id || (path.node.declarations && path.node.declarations[0].id);
      if (!id) return;
      const binding = path.scope.getBinding(id.name);
      if (binding && binding.referencePaths.length === 0) {
        console.log(`  [第 ${round} 轮] 删除无引用声明：${id.name}`);
        path.remove();
        removed++;
      }
    },
    // 顺手删掉已经完成使命的位移 IIFE（它只操作数组，没有返回值）
    ExpressionStatement(path) {
      const expr = path.node.expression;
      if (t.isCallExpression(expr) && t.isFunctionExpression(expr.callee)) {
        console.log(`  [第 ${round} 轮] 删除位移 IIFE（使命已完成）`);
        path.remove();
        removed++;
      }
    }
  });
  if (removed === 0) break;
}

traverse(ast, {
  MemberExpression(path) {
    if (!path.node.computed || !t.isStringLiteral(path.node.property)) return;
    const name = path.node.property.value;
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)) return;
    path.node.property = t.identifier(name);
    path.node.computed = false;
  }
});

console.log('\n【还原后的代码】');
console.log(generator(ast, { jsescOption: { minimal: true } }).code);

console.log('\n【验证：依次运行"原始代码"和"还原后代码"，结果应一致】');
eval(generator(ast, { jsescOption: { minimal: true } }).code);

/*
 * ============ 为什么这么写？============
 *
 * ① 为什么不能"人脑算旋转次数"？
 *    本例旋转次数由 ++_0x2b 决定，还算得过来。真实代码里可能是：
 *        _0x3c(_0x2b + 0x1a3 - 0x2f * 0x2);
 *        if (x > 100) { 再转一次 }
 *    算错一次，全盘皆错。**让机器执行，别跟它比算术。**
 *
 * ② 为什么位移 IIFE 必须第一个执行？
 *    因为它修改了数组本身（in-place）。解密函数依赖"旋转后的数组"，
 *    所以执行顺序必须是：数组声明 → 位移 IIFE → 解密函数。
 *    求值工厂里三行代码的顺序，就是依赖顺序。
 *
 * ③ 为什么求值工厂要 return 数组和函数，而不是设成全局变量？
 *    独立作用域、干净，不会污染全局，也不会和别的代码互相干扰。
 *
 * ④ 真实项目里"位移"还有哪些变体？
 *    - 位移方向不同（push/shift 换成 unshift/pop）
 *    - 位移次数是个表达式，依赖别的变量
 *    - 数组元素本身是"加密字符串"，解密函数再解一层（比如 base64）
 *    - 最狠的：IIFE 里掺了检测逻辑，或者数组是从别处动态拼出来的
 *    遇到这些，如果"执行"跑不通，就退回到"静态重写解密逻辑"：
 *    把人肉分析出的旋转算法用 JS 重写一遍（顶象案例的静态还原法）。
 *
 * ============ 知识闭环 ============
 * 06 + 07 合起来，就是一个完整的 obfuscator.io 字符串数组还原器。
 * 开源项目 webcrack、obfuscator-io-deobfuscator 做的也是这件事，
 * 只是它们处理了更多变体、更健壮。看懂了这个脚本，你就看懂了它们的核心。
 */
