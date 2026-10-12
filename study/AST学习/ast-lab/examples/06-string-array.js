/**
 * 06-string-array.js —— 实战第四课：字符串数组还原（反混淆的"主战场"）
 *
 * ============ 场景还原 ============
 * 你在逆向时最常看到的混淆长这样（obfuscator.io 的基础形态）：
 *
 *     var _0x3f2a = ['log', 'hello world', 'length', 'charAt'];  // ① 大数组：所有字符串
 *     function _0x5e1b(_0x2c) {                                   // ② 解密函数：按索引取值
 *         return _0x3f2a[_0x2c];
 *     }
 *     console[_0x5e1b(0)](_0x5e1b(1));                            // ③ 调用处：不写字符串，写索引
 *
 * 三件套：**大数组 + 取值函数 + 索引调用**。
 * 为什么这招有效？因为代码里再也搜不到 'log'、'hello world' 这些关键词了。
 *
 * ============ 还原思路（先想清楚再动手）============
 * 我们要的最终效果：把 `_0x5e1b(0)` 替换成 `'log'`。
 *
 * 问题：_0x5e1b 到底返回什么？光看调用处不知道，
 *       得知道 ① 数组内容 + ② 函数逻辑。
 *
 * 破解办法：**把"数组声明 + 函数定义"抄下来，让机器帮我们算。**
 *       函数体是纯逻辑（没有网络、没有随机），本机跑一遍就能
 *       输入 0 输出 'log'，然后把调用点替换成结果。
 *
 * 运行：node 06-string-array.js
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generator = require('@babel/generator').default;

const code = `
var _0x3f2a = ['log', 'hello world', 'length', 'charAt'];
function _0x5e1b(_0x2c) {
    return _0x3f2a[_0x2c];
}
console[_0x5e1b(0)](_0x5e1b(1));
console[_0x5e1b(0)](_0x5e1b(1)[_0x5e1b(2)]);
`;

console.log('【原始代码】\n' + code);

const ast = parser.parse(code);

// ============================================================
// 第 1 步：把"数组声明"和"解密函数"的源码收集出来
// ============================================================
console.log('【第 1 步：收集数组和解密函数】');

let arrayCode = '';
let fnCode = '';
let decodeFnName = null;

traverse(ast, {
  // 找顶层的数组声明
  VariableDeclaration(path) {
    if (!path.parentPath.isProgram()) return;              // 只看最外层
    const decl = path.node.declarations[0];
    if (!decl || !t.isArrayExpression(decl.init)) return;  // 初始化必须是数组字面量
    arrayCode = path.toString();
    console.log(`  找到字符串数组：${decl.id.name}`);
  },

  // 找"按索引返回数组元素"的函数
  FunctionDeclaration(path) {
    const { id, params, body } = path.node;
    // 特征：函数体只有一条 return 语句
    if (body.body.length !== 1 || !t.isReturnStatement(body.body[0])) return;
    fnCode = path.toString();
    decodeFnName = id.name;
    console.log(`  找到解密函数：${id.name}`);
  }
});

// ============================================================
// 第 2 步：构造一个"求值工厂"，把解密函数变成真的可调用函数
// ============================================================
// ★ 关键知识点：为什么用 new Function 而不是直接 eval？★
//
// 如果写 `eval(fnCode)`：
//   - 在非严格模式下，"直接 eval" 里的 var/function 声明会落进
//     "调用 eval 的那个函数"的作用域 —— 也就是落进我们的 visitor 回调函数里。
//   - 结果：出了这个回调就找不到 _0x5e1b 了，后面没法用。
//
// new Function(...) 创建的函数拥有**独立的作用域**（类似全局），
// 我们把数组声明、函数定义都塞进去，最后 return 出函数本身。
// 这样我们拿到的是一个"活函数"，干净、无副作用、不污染当前作用域。
console.log('\n【第 2 步：构造求值工厂】');

const factory = new Function(`
    ${arrayCode}      // var _0x3f2a = [...]
    ${fnCode}         // function _0x5e1b(...) {...}
    return ${decodeFnName};   // 把函数本身交出来
`);
const decodeFn = factory();

// 立刻验证一下它能不能用（学习阶段多打印，别猜）
console.log(`  试跑 decodeFn(0) = ${JSON.stringify(decodeFn(0))}`);
console.log(`  试跑 decodeFn(1) = ${JSON.stringify(decodeFn(1))}`);

// ============================================================
// 第 3 步：替换所有解码函数调用
// ============================================================
console.log('\n【第 3 步：替换所有调用点】');

traverse(ast, {
  CallExpression(path) {
    const { callee, arguments: args } = path.node;

    // 条件 1：调用的是我们找到的解密函数
    if (!t.isIdentifier(callee, { name: decodeFnName })) return;
    // 条件 2：参数必须是字面量（是变量的话，值运行时才知道，静态算不了）
    if (args.length === 0 || !t.isLiteral(args[0])) return;

    // ★ 安全阀：算不出来就跳过，绝不让一个异常搞崩整个脚本
    let value;
    try {
      value = decodeFn(args[0].value);   // 直接用真函数算，等价于执行 _0x5e1b(0)
    } catch (e) {
      console.log(`  × 求值失败，跳过：${path.toString()}`);
      return;
    }

    console.log(`  → ${path.toString()}  ==>  ${JSON.stringify(value)}`);
    path.replaceWith(t.valueToNode(value));
  }
});

// ============================================================
// 第 4 步：清理垃圾（没人用的数组和函数）
// ============================================================
// ★ 难点：为什么这里要写成"循环"？★
//
// 遍历是"按源码顺序"走的：先遇到数组声明，再遇到函数声明。
// 第一轮遍历到数组时，函数还没被删，数组"看起来"还有一个引用
// （引用就在函数体里），于是数组被跳过；等遍历到函数时把它删了，
// 但这一轮已经走过去了，数组就漏了。
//
// 解法：**跑一轮不够就跑两轮，直到"本轮没有任何删除"为止。**
// 这叫固定点迭代（fixed-point iteration），是所有反混淆脚本的标配：
// 每轮变换都可能制造新的机会，要反复跑直到结果稳定。
console.log('\n【第 4 步：清理无引用的数组和函数（循环直到不再变化）】');

let totalRemoved = 0;
let round = 0;
while (true) {
  round++;
  let removedThisRound = 0;

  traverse(ast, {
    Program(path) {
      path.scope.crawl();   // ★ 同 03 的坑：删过节点的 scope 缓存必须重扫
    },
    'FunctionDeclaration|VariableDeclaration'(path) {
      const id = path.node.id || (path.node.declarations && path.node.declarations[0].id);
      if (!id) return;
      const binding = path.scope.getBinding(id.name);
      if (binding && binding.referencePaths.length === 0) {
        console.log(`  [第 ${round} 轮] 已无引用，删除：${id.name}`);
        path.remove();
        removedThisRound++;
      }
    }
  });

  totalRemoved += removedThisRound;
  if (removedThisRound === 0) break;   // 没有任何变化 → 到达固定点，收工
}
console.log(`  共删除 ${totalRemoved} 个声明，跑了 ${round} 轮`);

// ============================================================
// 第 5 步：可读性修复（a["b"] → a.b）
// ============================================================
// 字符串还原后代码变成了 console["log"](...)，虽然能读但还不够顺眼。
// 把"方括号 + 字符串字面量"的成员访问还原成点号形式。
console.log('\n【第 5 步：方括号访问还原为点号】');

traverse(ast, {
  MemberExpression(path) {
    if (!path.node.computed) return;                         // 本来就是点号，跳过
    if (!t.isStringLiteral(path.node.property)) return;      // 属性不是字符串字面量，跳过
    const name = path.node.property.value;
    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)) return;    // 非法标识符（如 'a-b'）不能转
    console.log(`  → ["${name}"]  ==>  .${name}`);
    path.node.property = t.identifier(name);
    path.node.computed = false;
  }
});

console.log('\n【还原后的代码】');
console.log(generator(ast, { jsescOption: { minimal: true } }).code);

/*
 * ============ 为什么这么写？逐条回答小白疑问 ============
 *
 * ① 为什么要"跑函数"而不是"手动读数组"？
 *    因为真实的解密函数可能不是简单取值：可能异或、可能 base64、
 *    可能做各种运算（顶象案例里有三种不同的异或变形）。
 *    手动读一百种算法要写到崩溃；**让机器执行它自己的函数**，
 *    一行调用通杀。这就是"运行时求值派"的核心思想。
 *
 * ② 为什么参数必须是字面量才能替换？
 *    如果调用是 _0x5e1b(x)（x 是变量），x 的值运行时才知道，
 *    静态求值算不出来。这种要等常量传播/控制流还原把它变成字面量后，
 *    再来一轮处理（见顶象案例的"固定点迭代"）。
 *
 * ③ 为什么求值要包 try-catch？
 *    解密函数可能引用浏览器环境（window、document），Node 里没有，
 *    一跑就抛异常。**吞掉异常、跳过这个点**，继续处理别的，
 *    比整个脚本崩掉好得多。
 *
 * ④ 为什么要删除"无引用的数组和函数"？
 *    不删也能跑，但代码里躺着一个几千元素的数组，看着累、搜着烦。
 *    清理干净后，还原结果才真正"可读"。
 *
 * ⑤ 整个过程可以总结为一条流水线：
 *    收集（数组+函数） → 求值（拿到明文） → 替换（调用点→字面量） → 清理（删垃圾）
 *    真实项目的反混淆脚本，都是这条流水线 + 各种变形。
 *
 * ============ 安全提醒（重要）============
 * 这里"执行目标代码里的函数"是为了教学。真实逆向中，
 * 目标代码不可信（可能检测环境、甚至做恶意操作）。生产做法：
 *   - 用 Node 的 vm 模块建沙箱：vm.runInNewContext(code, sandbox)
 *   - 或只用"静态重写"：把解密逻辑用人话重写一遍
 *     （顶象案例的"静态还原"法：输入索引 → 输出字符串）
 *   - 永远先看清楚要执行的是什么（本例是我们自己提取的纯函数，安全）
 *
 * ============ 下一课预告 ============
 * 真实的 obfuscator.io 在这个基础上加了一层"数组位移"：
 * 数组在运行时会先被"旋转"一遍，所以静态看数组下标全是错的。
 * 见 07-shift-array.js —— 那是字符串数组还原的真正难点。
 */
