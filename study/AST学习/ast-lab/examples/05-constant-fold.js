/**
 * 05-constant-fold.js —— 实战第三课：常量折叠（把混淆器"算过的账"重新算回来）
 *
 * ============ 场景还原 ============
 * 混淆器最喜欢干这种事：
 *
 *     var a = 100 - 8;
 *     var b = a + 5;
 *     var c = 'a' + 'b' + 'c';
 *     var d = !0;            // 就是 true
 *     var e = void 0;        // 就是 undefined
 *     var f = 0x2 * 3;
 *
 * 它把"一个简单常量"拆成"一串运算"，让代码看起来有逻辑，实际是障眼法。
 * 还原方法叫**常量折叠（Constant Folding）**：
 * 把"能静态算出来的表达式"直接算成结果值。
 *
 * ============ 为什么必须做这一步？============
 * 因为后面所有操作都依赖"值是明确的"：
 *   - 你想还原字符串数组？解密函数的参数必须是明确的数字
 *   - 你想做控制流还原？状态变量的值必须是明确的
 *   - 你想内联函数？参数必须是明确的
 * 常量折叠就是把"模糊"变"明确"的关键一步。
 *
 * 运行：node 05-constant-fold.js
 */

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generator = require('@babel/generator').default;

const code = `
var a = 100 - 8 + 5 - 15;
var b = 0x2 * 3;
var c = 'a' + 'b' + 'c';
var d = !0;
var e = void 0;
var f = 1 > 2;
var g = 3 === 3 ? 'yes' : 'no';
var h = "hello".length;
`;

console.log('【原始代码】\n' + code);

const ast = parser.parse(code);

// ============================================================
// 核心武器：path.evaluate()
// ============================================================
// Babel 内置的"常量求值器"。给它一个表达式节点，它尝试"在不运行代码的前提下
// 推断出结果"，返回 { confident, value }：
//     confident: true  → 我确定结果就是 value
//     confident: false → 算不出来（含变量、函数调用等运行时才知道的东西）
//
// 用法一：逐个节点手动折叠（先看效果）
console.log('【逐个节点观察 evaluate()】');
traverse(ast, {
  VariableDeclarator(path) {
    const { id, init } = path.node;
    if (!init) return;
    const result = path.get('init').evaluate();
    console.log(
      `  ${id.name} = ${generator(init).code}` +
      `  →  evaluate: confident=${result.confident}, value=${JSON.stringify(result.value)}`
    );
  }
});

// ============================================================
// 用法二：正式的折叠 visitor
// ============================================================
// ★ 关键：必须在 exit 阶段处理，不能是 enter ★
//
// 原因：`100 - 8 + 5 - 15` 的 AST 是嵌套的：
//        (((100 - 8) + 5) - 15)
//   要算最外层，得先算出里面每一层。exit 是"子节点处理完才轮到父节点"，
//   天然自底向上。如果用 enter（父节点先来），父节点看到的孩子还是
//   "原始表达式"，求值会失败或者算错。
//
// 这就是主笔记里反复强调"常量折叠必须 exit"的原因。
console.log('\n【开始常量折叠】');

const foldVisitor = {
  // 能产生"常量结果"的表达式类型基本都在这了
  'BinaryExpression|UnaryExpression|LogicalExpression|ConditionalExpression|TemplateLiteral':
    {
      exit(path) {
        // 已经折叠成字面量的不再处理（避免无意义重复）
        if (path.node.__folded) return;

        const { confident, value } = path.evaluate();
        if (!confident) return;                       // 算不出来 → 跳过
        if (value === undefined && !t.isIdentifier(path.node)) {
          // 值为 undefined 时谨慎处理（可能是 void 0，也可能是求值失败兜底）
          // 这里简单跳过，真实项目要更细致
          return;
        }

        const original = generator(path.node).code;
        const replacement = t.valueToNode(value);     // JS 值 → AST 节点
        replacement.__folded = true;                  // 打标记，防止下轮重复处理

        path.replaceWith(replacement);
        console.log(`  → ${original}  ==>  ${generator(replacement).code}`);
      }
    }
};

traverse(ast, foldVisitor);

console.log('\n【折叠后的代码】');
console.log(generator(ast, { jsescOption: { minimal: true } }).code);

/*
 * ============ 小白必问：evaluate() 到底能算什么？============
 *
 * 能算（confident: true）：
 *   - 数字/字符串/布尔字面量的运算：1 + 2、'a' + 'b'、!0、~5
 *   - 比较与逻辑：1 > 2、true && false
 *   - 三元表达式（条件是常量时）
 *   - 部分内置方法："hello".length、[1,2].length
 *   - 模板字符串（无变量时）
 *   - 引用"已知常量变量"的表达式（Babel 会追踪 const 绑定）
 *
 * 不能算（confident: false）：
 *   - 含运行时变量：a + 1（a 来自用户输入）
 *   - 含函数调用：Math.random()、Date.now()、atob(x)
 *     ★ 注意：Math.xxx 有些能算有些不能，Babel 只实现了一部分纯函数
 *   - 含全局对象：window.location.href
 *   - 含 IIFE：(function(){return 1})()
 *     ★ 这类"立即执行函数"要自己写逻辑或用 eval 处理（见 06 的 eval 方案）
 *
 * ============ 为什么混淆器爱用这招，又为什么总是挡不住？============
 * 混淆器把 82 写成 100-8+5-15，成本极低（自动转换），
 * 但"表达式求值"是编译器的基本能力，Babel 白送。
 * 所以常量折叠是**性价比最高的反混淆操作**：一行 evaluate 解决一片。
 *
 * ============ 常见坑 ============
 * ① 必须在 exit 做（上面已解释）。
 * ② 折叠后打标记或用 path.skip()，防止"替换后又被自己的 visitor 访问"死循环。
 * ③ 别折叠出副作用：evaluate 只看纯计算，像 `x++` 这种带副作用的表达式
 *    虽然"看起来"能算，但替换会改变行为 —— 认准"纯表达式"再折叠。
 *
 * ============ 留堂练习 ============
 * 注意输出里 `var h = "hello".length;` 没有被折叠（虽然单独求值时
 * confident=true、value=5）。为什么？因为 HTML 里我们的 visitor 只监听了
 * BinaryExpression / UnaryExpression / LogicalExpression / ConditionalExpression /
 * TemplateLiteral —— 没有监听 MemberExpression。
 * 把 MemberExpression 加进去再跑一次，观察 h 是否变成 5。
 * （提示：不是所有 MemberExpression 都能折叠，比如 obj.prop 就取决于 obj 是不是常量）
 */
