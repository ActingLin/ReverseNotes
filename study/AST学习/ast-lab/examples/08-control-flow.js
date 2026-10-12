/**
 * 08-control-flow.js —— 实战第六课：控制流平坦化还原（最难，也最值钱）
 *
 * ============ 场景还原 ============
 * 前面的字符串还原只是"把词认出来"，代码逻辑本身还是看得懂的。
 * 而**控制流平坦化（Control Flow Flattening）**是把逻辑本身打碎：
 *
 *     console.log('start');     →    打碎成 4 个"积木块" +
 *     var a = 1 + 1;                  一个"调度器"，按顺序表一块块执行
 *     console.log(a);
 *     console.log('end');
 *
 * 打碎后长这样（obfuscator.io 的经典手法）：
 *
 *     var _0x2f1a = '3|0|1|2'.split('|');       // ① 顺序表：先执行 3，再 0、1、2
 *     var _0x5c = 0x0;                           // ② 指针
 *     while (true) {                             // ③ 调度器：永不停止的循环
 *         switch (_0x2f1a[_0x5c++]) {            //    按顺序表取下一个"积木块编号"
 *             case '0': var _0x1b = 1 + 1; continue;
 *             case '1': console['log'](_0x1b); continue;
 *             case '2': console['log']('end'); continue;
 *             case '3': console['log']('start'); continue;
 *         }
 *         break;                                 //    走完就退出
 *     }
 *
 * ============ 难点在哪？============
 * 原来"从上到下顺序执行"的代码，现在散落在各个 case 里，
 * 而且 case 的排列顺序跟执行顺序毫无关系（3 → 0 → 1 → 2）。
 * 直接读，思维要不停地在 case 之间跳；真实代码有几十上百个块，
 * 还嵌套多层，人脑根本读不过来。
 *
 * ============ 还原思路 ============
 * ① 找到"顺序表"（'3|0|1|2' 这种字符串），解析成真实执行顺序
 * ② 建立"编号 → 积木块代码"的映射（每个 case 的内容）
 * ③ 按顺序表，把积木块一块块摆好
 * ④ 删掉调度器（while + switch + continue）和顺序表
 *
 * 一句话：**把"调度器 + 积木块"还原成"顺序执行的语句列表"。**
 *
 * 运行：node 08-control-flow.js
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generator = require('@babel/generator').default;

const code = `
var _0x2f1a = '3|0|1|2'.split('|');
var _0x5c = 0x0;
while (true) {
    switch (_0x2f1a[_0x5c++]) {
        case '0':
            var _0x1b = 1 + 1;
            continue;
        case '1':
            console['log'](_0x1b);
            continue;
        case '2':
            console['log']('end');
            continue;
        case '3':
            console['log']('start');
            continue;
    }
    break;
}
`;

console.log('【原始代码（已经能看到 4 个积木块被 3|0|1|2 的顺序调度）】');
console.log(code);

let ast = parser.parse(code);

// ============================================================
// 第 1 步：找到"顺序表"，解析出真实执行顺序
// ============================================================
// 目标：var _0x2f1a = '3|0|1|2'.split('|');
// 我们要拿到 ['3','0','1','2']
console.log('【第 1 步：解析顺序表】');

let orderArrayName = null;
let order = null;

traverse(ast, {
  VariableDeclarator(path) {
    const { id, init } = path.node;
    // 特征：`'xxx|yyy'.split('|')` —— CallExpression，callee 是 .split，参数是 '|'
    if (!t.isCallExpression(init)) return;
    const { callee, arguments: args } = init;
    if (!t.isMemberExpression(callee)) return;
    if (!t.isIdentifier(callee.property, { name: 'split' })) return;
    if (!t.isStringLiteral(args[0], { value: '|' })) return;

    const str = init.callee.object.value;      // '3|0|1|2'
    order = str.split('|');
    orderArrayName = id.name;
    console.log(`  找到顺序表 ${id.name} = '${str}'`);
    console.log(`  真实执行顺序：${order.join(' → ')}`);
    path.stop();   // 找到一个就够了
  }
});

if (!order) {
  console.log('  没找到顺序表，脚本结束');
  process.exit(0);
}

// ============================================================
// 第 2 步：找到调度器（while + switch），提取每个"积木块"
// ============================================================
console.log('\n【第 2 步：提取积木块】');

const blockMap = new Map();   // 编号 → 语句数组
let dispatcherPath = null;

traverse(ast, {
  WhileStatement(path) {
    const { test, body } = path.node;
    if (!t.isBooleanLiteral(test, { value: true })) return;   // 必须是 while(true)

    // body 里应该有且只有一个 switch 语句
    const stmts = body.body;
    const switchStmt = stmts.find(s => t.isSwitchStatement(s));
    if (!switchStmt) return;

    console.log('  找到调度器：while(true){ switch(...) }');

    // 逐个 case 提取语句（去掉 continue / break 这两个"调度器专用"关键字）
    switchStmt.cases.forEach(c => {
      const key = c.test.value;                  // '0' / '1' / ...
      const blockStmts = c.consequent.filter(s =>
        !t.isContinueStatement(s) && !t.isBreakStatement(s)
      );
      blockMap.set(key, blockStmts);
      console.log(`    积木块 [${key}]：${blockStmts.map(s => generator(s).code).join(' ')}`);
    });

    dispatcherPath = path;
    path.stop();   // 教学演示只处理一个调度器
  }
});

// ============================================================
// 第 3 步：按顺序表重新排列积木块，替换掉整个调度器
// ============================================================
console.log('\n【第 3 步：按顺序重排，替换调度器】');

if (dispatcherPath && blockMap.size > 0) {
  const newStatements = [];
  for (const key of order) {
    const block = blockMap.get(key);
    if (!block) continue;                        // 顺序表提到但 case 不存在的，跳过
    newStatements.push(...block);                // ★ 展开：把积木块的语句逐个放进新序列
  }

  // replaceWithMultiple：用"一串语句"替换"一个语句"
  dispatcherPath.replaceWithMultiple(newStatements);
  console.log(`  已按 ${order.join('→')} 顺序重排，替换了整个 while 调度器`);
}

// ============================================================
// 第 4 步：清理残留（顺序表数组变量、指针变量）
// ============================================================
console.log('\n【第 4 步：清理残留变量】');

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
    }
  });
  if (removed === 0) break;
}

console.log('\n【还原后的代码】');
const output = generator(ast, { jsescOption: { minimal: true } }).code;
console.log(output);

console.log('\n【运行验证：应输出 start / 2 / end】');
eval(output);

/*
 * ============ 为什么这么写？============
 *
 * ① 为什么"顺序表"这么好用？—— 混淆器的软肋
 *    平坦化必须记录"块的执行顺序"，否则它自己也不知道怎么执行。
 *    所以它一定把顺序写在某个地方（字符串数组、数字数组、对象）。
 *    我们的任务就是找到那个"地方"，读出来。
 *    这就像加密算法必须把密钥放在某处一样 —— 只要它自己要用，就藏不彻底。
 *
 * ② 为什么 case 里的 continue 要删掉？
 *    continue 是"调度器专用语法"：它让 while 进入下一轮循环，
 *    也就是"去执行下一个积木块"。当积木块被拆出来顺序摆放后，
 *    continue 就没有意义了，留着反而会变成错误语法或改变语义。
 *    同理，switch 末尾的 break 也是调度器的一部分。
 *
 * ③ 为什么用 replaceWithMultiple 而不是 replaceWith？
 *    replaceWith 要求"一个节点换一个节点"；
 *    我们要用"一串语句"替换"一个 while 语句"，所以用复数版本。
 *
 * ④ 真实场景比这个难多少？
 *    难得多，常见变体：
 *    - 状态变量式：没有顺序表，靠 `_0xstate = '0x2'` 这样的赋值跳转，
 *      需要模拟执行（跟着状态值走）才能串出执行顺序
 *    - 嵌套平坦化：积木块里还有小的调度器，要递归处理
 *    - 带条件的跳转：`if (x > 5) _0xstate = '0x3' else _0xstate = '0x4'`
 *      —— 这种要还原成 if/else 结构，把"跳转表"变回"控制流图"
 *    - 不透明谓词：`if (0x1234 > 0x5678)` 永远为真/假的垃圾分支
 *
 *    处理这些的标准流程（顶象案例也是这个思路）：
 *      提取状态转移关系 → 构建状态图 → 按图重组代码 → 清理
 *
 * ⑤ 一个重要的心态提醒：
 *    控制流还原**很难做到 100% 自动化**。真实项目里的做法是
 *    "80% 自动化 + 20% 人工"：脚本把大部分块理顺，
 *    剩下的小部分手动改。不要追求完美，够读就行。
 *
 * ============ 学到这里的检查清单 ============
 * 如果你能独立讲清楚下面几个问题，说明你已经入门了：
 *   □ 为什么反混淆要先做"字符串还原"再做"控制流还原"？（数据依赖）
 *   □ 为什么常量折叠必须写在 exit 里？（自底向上）
 *   □ scope.crawl() 解决的是什么问题？（作用域缓存过期）
 *   □ 为什么求值要包 try-catch？（环境缺失/异常防御）
 *   □ 为什么清理要"循环直到不再变化"？（固定点迭代）
 * 下一站：09-难点与避坑.md（把这一路踩过的坑系统化）
 */
