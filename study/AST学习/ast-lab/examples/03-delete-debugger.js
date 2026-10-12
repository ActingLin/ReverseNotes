/**
 * 03-delete-debugger.js —— 实战第一课：干掉"无限 debugger"
 *
 * ============ 场景还原 ============
 * 你打开某网站，按下 F12，页面立刻卡死 —— 这是反调试。
 * 混淆代码里通常长这样：
 *
 *     function _0x4f2a() { debugger; }        // 定义
 *     setInterval(_0x4f2a, 1000);             // 每隔 1 秒触发一次
 *
 * 只要 DevTools 开着，debugger 就会不断中断，根本没法调试。
 *
 * 传统做法是"条件断点 + Never pause here"，但每次都要手动点。
 * AST 做法的思路是：在源码层面直接删掉这些语句，一劳永逸。
 *
 * 运行：node 03-delete-debugger.js
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generator = require('@babel/generator').default;

const code = `
function _0x4f2a() {
    debugger;
}
setInterval(_0x4f2a, 1000);
console.log('业务逻辑在这里，我只想安安静静地调试它');
`;

console.log('【原始代码】\n' + code);

const ast = parser.parse(code);

// ============================================================
// 第一轮：删掉 debugger 语句本身，以及触发它的定时器调用
// ============================================================
console.log('【第一轮遍历】');
traverse(ast, {
  // `debugger;` 对应的节点类型是 DebuggerStatement，直接删。
  DebuggerStatement(path) {
    console.log('  → 发现 debugger 语句，已删除');
    path.remove();
  },

  // 删除 setInterval(_0x4f2a, 1000) 这个"触发器"
  CallExpression(path) {
    const { callee, arguments: args } = path.node;

    // 判断 1：是不是 setInterval 调用？
    // 用 t.isIdentifier(callee, { name: 'setInterval' }) 更规范：
    // 它会先检查 callee 是不是 Identifier 类型，再比对 name，
    // 避免 callee 是 a.b 形式（MemberExpression）时读到 undefined 报错。
    if (!t.isIdentifier(callee, { name: 'setInterval' })) return;

    // 判断 2：第一个参数是不是指向刚被清空的函数？
    // 这里演示"匹配已知函数名的调用"。真实混淆里函数名是随机的，
    // 通用做法是收集所有"函数体只剩 debugger 的函数名"再匹配。
    if (!t.isIdentifier(args[0], { name: '_0x4f2a' })) return;

    console.log('  → 发现 setInterval(_0x4f2a, ...) 反调试定时器，已删除');
    path.remove();
  }
});

// ============================================================
// 第二轮：清理"没人用了的空壳函数"
// ============================================================
// ★ 为什么必须分两轮？这是 AST 反混淆最重要的一课 ★
//
// traverse 是按树的顺序"爬"的：先爬函数声明，再爬后面的 setInterval。
// 如果在同一轮里用 FunctionDeclaration（enter 阶段）检查"有没有人引用我"，
// 此时 setInterval 还没被删，引用计数不为 0，函数就删不掉。
//
// 反混淆的正确习惯：**让每个 pass 只做一件事，靠多轮遍历逼近最终结果。**
// 真实项目中经常要跑 N 轮直到"代码不再变化"（这叫固定点迭代）。
console.log('\n【第二轮遍历】');
traverse(ast, {
  Program(path) {
    // ★★ 关键一步：刷新作用域缓存 ★★
    // Babel 的 scope 信息（binding、referencePaths）是"爬树时缓存"的，
    // 第一轮虽然删掉了 setInterval(...) 调用，但缓存里仍然记着那条引用，
    // 于是第二轮的"引用计数"会误判成 1，函数删不掉。
    // scope.crawl() 强制重新扫描整棵树，重建所有绑定和引用列表。
    path.scope.crawl();
  },

  FunctionDeclaration(path) {
    const { id, body } = path.node;

    // 判断 1：函数体已经空了（debugger 被删后 body.body 变成空数组）
    const isEmpty = body.body.length === 0;
    if (!isEmpty) return;

    // 判断 2：这个函数名还有没有被别人引用？
    // scope.getBinding() 沿作用域链找到这个名字的"绑定对象"，
    // referencePaths 数组里记录着所有引用它的位置。
    const binding = path.scope.getBinding(id.name);
    if (binding && binding.referencePaths.length === 0) {
      console.log(`  → 函数 ${id.name} 已无引用，已删除`);
      path.remove();
    }
  }
});

console.log('\n【清理后的代码】');
console.log(generator(ast).code);

/*
 * ============ 为什么这么写？（小白最容易忽略的点）============
 *
 * ① 为什么不用正则 replace(/debugger;?/g, '')？
 *    因为 "debugger" 也可能出现在字符串里（console.log("debugger")），
 *    正则一替换就连字符串一起破坏了；AST 只匹配 DebuggerStatement 节点，
 *    精确得多，还能顺手处理"删除调用 → 函数失去引用 → 删除函数"这种
 *    有依赖关系的连锁清理。
 *
 * ② 为什么要检查"引用计数"？
 *    混淆代码里函数互相调用（_0x4f2a 可能还被别的函数调用）。
 *    无脑删除会破坏代码结构；referencePaths.length === 0 才说明
 *    删掉它是安全的 —— 这是 AST 反混淆的通用安全习惯。
 *
 * ③ 为什么分两轮 traverse？
 *    见上面的 ★ 注释。一句话：**数据有依赖关系时，用多轮 pass 解决，
 *    不要试图在一个 visitor 里同时搞定所有事。**
 *
 * ============ 真实场景的下一步 ============
 * 真实反调试比这个复杂，常见变体：
 *   - setInterval(() => { debugger }, 1000)   ← 箭头函数，直接删 DebuggerStatement 即可
 *   - Function('debugger')()                  ← 用 Function 构造器动态生成（AST 静态删不掉，
 *                                                要在运行时 hook Function）
 *   - 检测控制台是否打开（如利用 console.log 的 toString 检测）
 * 但核心思路一致：**找到"触发点"，用节点类型精确匹配，再安全删除。**
 *
 * 顺带一提：真正实战时，"删 debugger"通常是第一步，因为不删它你根本
 * 没法在浏览器里调试代码去理解后面的逻辑。
 */
