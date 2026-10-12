# 实操 01：第一个 AST 脚本与核心概念

> **配套实例**：`examples/01-hello.js`、`examples/02-walk.js`
> **读完这篇你会**：理解 AST 是什么、为什么逆向要用它、跑通自己的第一个变换脚本、
> 掌握 visitor 和 path 这两个最核心的概念。
> **前置要求**：会一点点 JavaScript 就行。

---

## 1. 先想清楚：我们为什么要用 AST？

### 1.1 一个真实的困境

假设你拿到一段混淆代码，里面写满了这种东西：

```js
var _0x1a2b = 0x4f;
console['\x6c\x6f\x67']('hello');
```

你想把 `console['log']` 还原成 `console.log`。

第一反应肯定是**正则替换**：

```js
code.replace(/console\['log'\]/g, 'console.log');   // 好像能用？
```

但马上就会遇到麻烦：

| 问题 | 正则的困境 |
|------|-----------|
| 字符串里也有这段代码 | `var s = "console['log']"` 会被误伤 |
| 写法有无数变体 | `console["log"]`、`console[ 'log' ]`、`console['lo'+'g']`… |
| 想加条件 | "只替换某个函数内部的"——正则做不到 |
| 想验证安全性 | "这个变量会不会被重新赋值"——正则根本不知道 |

**根本原因**：正则看到的是"一串字符"，它不认识"代码的结构"。

### 1.2 AST 的解决思路

AST（抽象语法树）做的事情是：**把代码从"字符串"变成"结构化的对象树"**。

![思路对比]

```
字符串视角：  v a r   a   =   1   +   2   ;
              （一堆字符，没有意义）

AST 视角：    VariableDeclaration（变量声明）
                └── VariableDeclarator
                      ├── Identifier: "a"        ← 变量名
                      └── BinaryExpression       ← 表达式
                            ├── NumericLiteral: 1
                            └── NumericLiteral: 2
```

变成树之后：
- "找所有的字符串" → 找所有 `StringLiteral` 节点
- "这个变量被重新赋值过吗" → 查它的绑定信息（Babel 帮你算好了）
- "只处理某个函数内部的" → 在函数节点范围内遍历

**精确、可控、可编程**。这就是逆向必须学 AST 的原因。

> **一句话总结**：正则是在"文字"层面改代码，AST 是在"结构"层面改代码。
> 混淆器把代码结构搞乱了，所以我们也要在结构层面把它捋回来。

---

## 2. 三步走：所有 AST 脚本的骨架

不管多复杂的反混淆脚本，骨架永远是这三步（`examples/01-hello.js` 就是它的最小实现）：

```
   ┌─────────┐    parse     ┌─────────┐   traverse   ┌──────────────┐   generate   ┌─────────┐
   │ 源代码   │ ──────────→ │   AST   │ ──────────→  │ 修改后的 AST  │ ──────────→ │ 新代码   │
   │ (字符串) │             │ (对象树) │              │  (对象树)     │             │ (字符串) │
   └─────────┘             └─────────┘              └──────────────┘             └─────────┘
```

对应到代码（背下来，以后每次都这么开头）：

```js
const parser = require('@babel/parser');               // 代码 → AST
const traverse = require('@babel/traverse').default;   // 遍历 + 修改
const generator = require('@babel/generator').default; // AST → 代码

const ast = parser.parse(code);        // 第 1 步
traverse(ast, { /* 修改逻辑 */ });      // 第 2 步
const output = generator(ast).code;    // 第 3 步
```

**为什么是"树"而不是"列表"？**
因为代码是有层级的：函数里包含语句，语句里包含表达式，表达式里包含值。
树的结构天然表达了这种"包含"关系。

**为什么中间要绕一圈，不直接改字符串？**
因为"改对象属性"比"改字符串"精确得多。比如把 `var` 改成 `let`：
- 字符串做法：`replace('var', 'let')` —— 可能改到字符串里、可能只改到第一个
- AST 做法：`path.node.kind = 'let'` —— 精确到"这个变量声明节点的 kind 属性"

---

## 3. 核心概念一：visitor（访问者）

### 3.1 它是什么

`traverse` 会**深度优先**地爬完整棵树。每爬到一个节点，它就查一遍：
"我手上的 visitor 里，有没有和这个节点 **type 同名的方法**？有就调用。"

```js
traverse(ast, {
  // 意思是：每次遇到"变量声明"节点，就执行这个函数
  VariableDeclaration(path) {
    console.log('发现一个变量声明！');
  },

  // 每次遇到"函数调用"节点，就执行这个
  CallExpression(path) {
    console.log('发现一个函数调用！');
  }
});
```

### 3.2 为什么叫"访问者模式"

想象你是一个访客，走进一栋大楼（AST）：
- 每进一个房间（节点），你按房间的**类型**决定要做什么
- "厨房"→ 检查煤气；"卧室"→ 检查床铺
- 没定义规则的房间（节点类型），你径直走过去

这就是为什么 visitor 用**节点类型当方法名**：
`FunctionDeclaration(path){}` 就是"遇到函数声明时怎么做"。

### 3.3 常见节点类型速记

| 你看到的代码 | 对应节点类型 |
|-------------|-------------|
| `var a = 1` | `VariableDeclaration`（外层）+ `VariableDeclarator`（每项） |
| `a = 1`（赋值） | `AssignmentExpression` |
| `1 + 2` | `BinaryExpression` |
| `!a` | `UnaryExpression` |
| `a ? b : c` | `ConditionalExpression` |
| `'hello'` / `123` | `StringLiteral` / `NumericLiteral`（统称 `Literal`） |
| `a.b` | `MemberExpression` |
| `foo()` | `CallExpression` |
| `if (x) {}` | `IfStatement` |
| `while (x) {}` | `WhileStatement` |
| `switch (x) {}` | `SwitchStatement` |
| `a, b, c` | `SequenceExpression` |

> 拿不准？打开 [AST Explorer](https://astexplorer.net)，
> 把代码粘进去，鼠标点到哪一行，右侧就高亮对应的节点。
> **这是学 AST 最重要的一个工具，没有之一。**

---

## 4. 核心概念二：path（路径对象）

### 4.1 path 不是节点，是"节点的位置"

新手最容易搞混的地方：

```js
traverse(ast, {
  Identifier(path) {
    path.node.name          // ✅ 这才是节点本身（node）
    path.node.type          // 'Identifier'
    path.parent             // 父节点（注意：是 node 不是 path）
    path.parentPath         // 父节点的 path
    path.scope              // 所在作用域（后面详解）
  }
});
```

**为什么参数是 path 而不是 node？**
因为光有"节点本身"不够用。你还想知道：

- 它在哪？（父节点是什么、在数组的第几个位置）
- 谁能替换它？（改它需要通知父节点，否则树就断了）
- 它属于哪个作用域？（同名变量怎么区分）

path 就是"节点 + 位置 + 上下文"的封装。

### 4.2 用 path 干活的三个高频操作

```js
// ① 替换：把当前节点换成别的东西
path.replaceWith(t.stringLiteral('new value'));

// ② 删除：把当前节点从树里摘掉
path.remove();

// ③ 插入：在当前位置前后加东西
path.insertBefore(t.expressionStatement(...));
path.insertAfter(...);
```

### 4.3 一个必背的安全习惯

**不要直接改父节点的属性，要用 path 的方法。**

```js
// ✗ 危险：绕过 Babel 的簿记机制，可能破坏树
path.parent.body.splice(index, 1);

// ✓ 正确：Babel 会同步更新所有引用关系
path.remove();
```

原因：Babel 内部维护着"节点 ↔ 位置"的一致性（比如 scope 里的引用关系）。
用 `path.xxx()` 它会帮你更新，自己动手 splice 它不知道，后面就会出错。

---

## 5. 核心概念三：enter 与 exit

每个节点会被访问**两次**：

```js
traverse(ast, {
  BinaryExpression: {
    enter(path) { /* 刚进入这个节点，还没处理它的子节点 */ },
    exit(path)  { /* 它的所有子节点都处理完了，准备离开 */ }
  }
});
```

运行 `examples/02-walk.js` 你会看到这样的输出（缩进反映层级）：

```
→ enter Program
  → enter VariableDeclaration
    → enter VariableDeclarator
      → enter Identifier
      ← exit  Identifier          ← 叶子节点，进去马上出来
      → enter BinaryExpression
        → enter NumericLiteral    ← 1
        ← exit  NumericLiteral
        → enter NumericLiteral    ← 2
        ← exit  NumericLiteral
      ← exit  BinaryExpression    ← 子节点都处理完了
    ← exit  VariableDeclarator
  ← exit  VariableDeclaration
← exit  Program
```

### 关键结论（记住这一条就够用）

> **需要"子节点先处理好，父节点才能处理"的操作，必须写在 exit。**
> 这叫**自底向上**处理。

**最典型的例子：常量折叠**

```
要算 (1 + 2) * 3 ：
  必须先知道 1 + 2 = 3（子）
  才能算 3 * 3 = 9（父）
```

如果写在 `enter`（父先被访问），父节点看到的还是 `(1+2) * 3` 的原始结构，
求值逻辑会复杂化甚至算错。写在 `exit`，轮到父节点时子节点已经变成了 `3`，
直接算 `3 * 3` 就行。

（`examples/05-constant-fold.js` 里有实测，可以亲手把 exit 改成 enter 试试会发生什么）

---

## 6. 怎么知道该写哪个 visitor？

这是小白最常见的卡点。三步法：

**第 1 步：明确目标**——"我要找什么样的代码？"

**第 2 步：把它写出来，扔进 AST Explorer**
比如你想找"所有 `atob(...)` 调用"，就输入 `atob('xxx')`，
看它的节点是 `CallExpression`，其 `callee` 是 `Identifier`。

**第 3 步：写 visitor，再加条件过滤**

```js
traverse(ast, {
  CallExpression(path) {
    // 粗筛：类型对了
    // 精筛：再加条件
    if (!t.isIdentifier(path.node.callee, { name: 'atob' })) return;
    // ... 处理
  }
});
```

> **经验**：一开始不要追求"心算出节点类型"，一定要借助 AST Explorer。
> 老手也是这么干的，只是查得快而已。

---

## 7. 动手练习

打开 `examples/`，按顺序：

1. **跑通 01**：`node 01-hello.js`，观察输出：AST 长什么样、代码怎么变
2. **跑通 02**：`node 02-walk.js`，盯着 enter/exit 的输出看 30 秒，理解树结构
3. **自己做**：用 01 的骨架，写一个"把 `const` 全部改成 `var`"的脚本
   （提示：改 `VariableDeclaration` 的 `kind`，但注意 kind 判断）

进阶练习（做了说明你懂了）：

4. 写一个 visitor，统计代码里有多少个函数调用（`CallExpression`）
5. 写一个 visitor，找出所有"参数是字符串字面量的函数调用"
6. 打开 AST Explorer，输入 `a?.b?.(c)`，看看可选链是什么节点类型

---

## 8. 本篇小结

| 概念 | 一句话理解 |
|------|-----------|
| AST | 代码的"结构化表示"，一棵由对象组成的树 |
| 三步流程 | parse（解析）→ traverse（遍历修改）→ generate（生成） |
| visitor | "遇到某类节点做什么"的规则集合，用节点类型当方法名 |
| path | 节点 + 位置 + 上下文的封装，用它的方法安全地改树 |
| enter/exit | 节点的两次访问机会；自底向上的操作要用 exit |
| AST Explorer | 查节点类型的必备工具，别硬背 |

**下一篇**：`02-实操-字符串与常量还原.md` —— 开始处理真实的混淆手法。
