# 09 · AST 反混淆实战

> 来源：原《AST学习笔记》第 6 章 + 网上补充（控制流还原细化：状态转移图、回边检测、拓扑排序）
> 上一篇：[08-JS混淆与特征识别](./08-JS混淆与特征识别.md) ｜ 下一篇：[10-工具与学习资源](./10-工具与学习资源.md)

### 6.1 通用套路（处理顺序）

根据多个实战经验（某里 226 还原、电商控制流平坦化破解），AST 反混淆有一套通用的处理顺序：

```
① 格式化/结构化简化（还原逗号表达式、逻辑表达式转 if 语句、去变量定义分离）
② 还原字面量与常量折叠（变量定义还原、简单赋值语句还原，保证参数为字面量）
③ 处理函数调用（字符串解密函数调用替换为实际字符串）
④ 控制流还原（识别分发器 while+switch+状态变量 → 提取状态转移 → 重组代码块 → 恢复原始控制流）
⑤ 清理收尾（代理函数内联、对象简化、常量传播、死代码删除）
⑥ 逐步验证还原结果等价性（Beyond Compare 对比差异）
```

> **还原目标**：不必追求 100% 还原原始代码，只需保证核心计算路径清晰可读、输入输出映射正确即可。

### 6.2 字符串解密（String Array 还原）

**第一步：特征识别**。先确认是否有大型加密字符串数组、`while(true)+switch` 状态机、`_0x` 命名、反调试 `debugger` 指令。

**第二步：常量折叠**。用 `path.evaluate()` 对静态表达式（如 `0x42e * -0x6 + 0x25c8`）做常量折叠（见 [05 篇](./05-执行函数与求值.md)）。

**第三步：收集数组与解密函数，替换调用**：

```js
const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const types = require('@babel/types');
const generator = require('@babel/generator').default;

let ast = parser.parse(sourceCode);

// 先运行解密函数拿到数组内容（可先 hook 解密函数，或手动在 Node 中执行解密逻辑）
// 这里假设已经还原出解密函数 decrypt，如 _0xae0a('0x1') -> 'someString'

const plugins = {
  CallExpression(path) {
    if (path.node.callee.name !== '解密函数名') return;
    const arg = path.node.arguments[0].extra.rawValue;
    const value = 解密函数(arg);       // 自定义解密逻辑
    path.replaceWith(types.valueToNode(value));
  }
};

traverse(ast, plugins);
const { code } = generator(ast);
fs.writeFileSync('decode.js', code);
```

**解密函数的两种还原方式**：
1. **运行还原**：把解密函数 + 数组复制到 Node 环境直接调用（注意补环境，如 `window`、`document` 等）。完整套路（含 vm 沙箱版）见 [05-执行函数与求值](./05-执行函数与求值.md)。
2. **静态还原**：把数组元素解密逻辑用 Python/JS 重写，输入索引直接输出字符串（适合 Base64/RC4 等标准算法）。

> 字符串解密**必须先做**——控制流平坦化的状态变量赋值往往依赖解密结果。

### 6.3 常量折叠与代理函数内联

**常量折叠（Constant Folding）**：
- **字面量内联**：变量声明的初始化表达式是字符串/数字/布尔字面量，且声明不在循环体内，则将该变量替换为其值。
- **作用域内常量还原**：通过 `path.scope` 判断变量在作用域内从未被修改且初始化为常量，即可替换（用 `binding.constant` 判断，见 [06 篇](./06-函数作用域与绑定.md)）；难点在于判断 init 节点是否为常量（如 `document` 等浏览器环境变量）。

**代理函数内联（Proxy Function Inlining）**：
- 代理函数是混淆器添加的中间调用层。
- **简单函数内联**：只有一条 return 语句的函数（如 `function f(x,y){return x+y}`）内联到所有调用处，内联后函数因不再被引用而删除。完整示例见 [07 篇](./07-代码替换与增删改.md) 第 9 节。
- **复杂函数保留**：两条及以上语句的函数不做修改。
- **无引用函数删除**：从未被引用的函数声明直接移除（`binding.references === 0`）。

```js
// 示例：内联单语句函数
traverse(ast, {
  FunctionDeclaration(path) {
    if (path.node.body.body.length !== 1) return;  // 只处理单语句函数
    const statement = path.node.body.body[0];
    if (statement.type !== 'ReturnStatement') return;
    // 收集所有调用点并替换（完整实现见 07 篇第 9 节）
  }
});
```

### 6.4 控制流平坦化还原（最难的一步）

**结构**：外层 `while(true)` 循环 + 巨大 `switch` + 状态变量（`switch (状态变量)` 中 case 分支末尾给状态变量重新赋值）。

**还原步骤**（结合 2025 年多篇资料细化的完整流程）：

1. **识别分发器（dispatcher）**：定位外层 `while(true)` + switch 结构，找出状态变量（`_0x...` 开头）及其初始化值。
2. **提取状态转移关系**：遍历所有 case，记录每个 case 的代码块、条件守卫（guard）和下一个状态值，构建**状态转移图**（基本块之间的边，含条件边）。
3. **检测回边（循环）**：状态转移图里有环的地方就是原代码的循环，做**拓扑排序**确定基本块的自然执行顺序。
4. **重组代码块**：按真实执行顺序把 case 块串起来，用 `IfStatement` / 顺序块重建控制流，`break`/`continue` 还原为循环结构。
5. **消除不透明谓词**：`x² ≥ 0`、`!![]` 等恒真/恒假条件（`path.evaluate()` 静态求值），删除不可达假分支。
6. **清理**：删除状态变量、垃圾分支、死代码。

**参考实现思路**（来自某电商平台实战）：
- 先把所有 case 块提取为独立数组，用 `Map<状态值, 代码块>` 存储；
- 模拟执行状态变量转移，得到执行顺序链；
- 用 `IfStatement` / 顺序块重建控制流。

> 不需要追求 100% 完美还原，保证核心计算路径清晰、输入输出映射正确即可。
> 分层混淆（CFF + 不透明谓词）会显著增加难度，见 [08 篇](./08-JS混淆与特征识别.md) 5.4。

### 6.5 死代码删除（DCE）

- 与常量传播配合使用：常量传播后，不可达分支的 `if(false){...}` 即可删除。
- 移除无引用函数、无引用变量（`binding.references === 0`）。
- 控制流平坦化还原末尾阶段也需要"清理死代码与冗余逻辑"。

### 6.6 实战案例集

| 案例 | 混淆类型 | 还原要点 |
|------|---------|---------|
| **某电商平台 AES 签名**（约 3 小时还原） | 大型加密字符串数组 + 自执行移位 + while+switch 状态机 + 十六进制变量名 | ①字符串解密（必须先做）→ ②拆解控制流平坦化 → ③清理死代码。核心签名函数从百余行膨胀到 1200 多行，还原后与原始逻辑 100% 对齐 |
| **某里 226 混淆** | 多重嵌套 switch、void 运算符、条件表达式、逗号表达式 | 格式化 → 还原无意义 void → 条件表达式转 if → 统一比较操作数顺序 → if 转 switch → 三重嵌套 switch 合并为一重 → 还原逗号表达式 → 还原控制流 |
| **acw_v2 加密** | OB 混淆 + VM 代码 | cookie 断点定位 VM 代码，识别 ob 混淆，逐步还原生成 cookie 的核心代码 |
| **JSFuck 还原** | 六字符混淆 | AST 递归判断常量节点并求值，涵盖运算及属性访问处理（ClarityJS 工具） |
| **某大厂 WAF** | 加强 OB 混淆壳 | 用 AST 还原加强 ob 混淆壳（52pojie 精华帖） |
| **顶象 greenseer 无感验证** | webpack 模块数组 + 自定义异或加密 + 数组位移 + 属性名反序 | 详见 [../顶象greenseer AST还原案例分析.md](../顶象greenseer AST还原案例分析.md)：176 行脚本 7 个 visitor（基于引用的数组替换、常量传播、path.evaluate 折叠、纯函数 eval 求值、逗号表达式拆分），同一脚本还原 2020/2025 两代混淆代码 |

### 6.7 反混淆前置能力清单

做 AST 反混淆需要三个核心能力：
1. **能看懂常见 AST 节点结构**（WhileStatement、SwitchStatement、AssignmentExpression 等）→ [02 篇](./02-Babel节点类型大全.md)
2. **会用 traverse 遍历指定类型节点并获取父节点引用** → [03 篇](./03-Babel核心API.md)
3. **会用 types 构造新节点替换旧节点** → [07 篇](./07-代码替换与增删改.md)

> 实际开发中大部分时间在查文档、调节点属性，核心逻辑代码量不大。
