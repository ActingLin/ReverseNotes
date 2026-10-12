# 03 · Babel 核心 API 详解

> 来源：原《AST学习笔记》第 4 章
> 上一篇：[02-Babel节点类型大全](./02-Babel节点类型大全.md) ｜ 下一篇：[04-节点转代码](./04-节点转代码.md)
>
> 深度展开篇：generator 细节 → [04-节点转代码](./04-节点转代码.md)；path.scope → [06-函数作用域与绑定](./06-函数作用域与绑定.md)；节点增删改 → [07-代码替换与增删改](./07-代码替换与增删改.md)；求值执行 → [05-执行函数与求值](./05-执行函数与求值.md)

### 4.1 @babel/parser：源码 → AST

基于 acorn 实现，扩展支持 ES Next、JSX、TypeScript、Flow 等语法。默认只能解析 JS 代码，解析 JSX、Flow、TypeScript 等需要指定对应插件。

提供两个 API：

```js
parse(input: string, options?: ParserOptions): File        // 根节点是 File（整个 AST）
parseExpression(input: string, options?: ParserOptions): Expression  // 根节点是 Expression（表达式粒度）
```

**常用选项**：
- `sourceType`：`module`（解析 ES module 语法）、`script`（不解析模块语法）、`unambiguous`（根据内容是否有 import/export 自动判断），**一般推荐 `unambiguous`**
- `plugins`：指定 jsx、typescript、flow 等插件解析对应语法
- `allowXxx`：指定某些语法是否允许（如函数外 await、未声明的 export 等）
- `strictMode`：是否严格模式
- `startLine`：从源码哪一行开始解析
- `errorRecovery`：出错时是否记录错误并继续解析
- `tokens`：解析时是否保留 token 信息
- `ranges`：是否在 AST 节点中添加 ranges 属性

```js
const parser = require('@babel/parser');
const ast = parser.parse(code, {
  sourceType: 'unambiguous',
  plugins: ['jsx', 'typescript']
});
```

### 4.2 @babel/traverse：遍历与修改 AST

#### 基本用法

```js
traverse(parent, opts)  // parent：要遍历的 AST 节点；opts：visitor 函数
```

#### Visitor（访问者模式）

Babel 采用**访问者模式**深度递归遍历整棵树，visitor 是指定对什么 AST 做什么处理的函数，支持多种写法：

```js
traverse(ast, {
  // 1. 进入任何节点时调用
  enter(path) {},
  // 2. 离开任何节点时调用
  exit(path) {},
  // 3. 按节点类型指定（enter 阶段调用）
  FunctionDeclaration(path) {},
  // 4. 单独监听某类型的进入/离开
  FunctionDeclaration: {
    enter(path) {},   // 遍历子节点前调用
    exit(path) {}     // 遍历完子节点后调用
  },
  // 5. 同时匹配多种类型（用 | 连接）
  'FunctionDeclaration|VariableDeclaration'(path) {},
  // 6. 通过别名指定（如 Function 代表五类函数节点）
  Function(path) {},
  Declaration: { exit(path) {} }
});
```

**遍历时机**：遍历过程中有**进入（enter）**和**离开（exit）**两次访问机会：
- `enter`：进入节点时（子节点遍历前）
- `exit`：离开节点时（子节点遍历后）——常用于**自下而上**的处理（如先处理子节点再处理父节点）

#### Path 对象（核心中的核心）

visitor 的参数是 **Path 对象**而非节点本身，它表示两个节点之间的连接，记录节点在 AST 中的位置，提供大量属性和方法操作 AST。

**核心属性**：
- `path.node`：当前遍历到的节点
- `path.parent`：父级 node（不能替换）
- `path.parentPath`：父级 path（可替换）
- `path.scope`：作用域相关，用于变量重命名、绑定关系检测（详见 [06-函数作用域与绑定](./06-函数作用域与绑定.md)）
- `path.state`：Babel 插件信息，可通过 `state.opts` 获取传入的 Options
- `container` / `key` / `listKey`：节点在父节点中的容器、属性名、数组键名
- `hub`、`contexts`、`data`、`type`、`opts`、`removed` 等

**节点操作方法**（深度展开见 [07-代码替换与增删改](./07-代码替换与增删改.md)）：
```js
path.replaceWith(node);              // 用新节点替换当前节点
path.replaceWithMultiple(nodes);     // 用多个节点替换
path.replaceWithSourceString(code);  // 用源码字符串替换（自动解析为 AST）
path.insertBefore(nodes);            // 在当前节点前插入
path.insertAfter(nodes);             // 在当前节点后插入
path.remove();                       // 删除当前节点
path.unshiftContainer(key, nodes);   // 在数组容器开头插入
path.pushContainer(key, nodes);      // 在数组容器末尾插入
```

**查询与遍历方法**：
```js
path.get(key);                    // 获取子节点的 NodePath
path.getSibling(index);           // 获取相邻节点
path.findParent(callback);        // 向上查找祖先路径
path.find(callback);              // 向上查找自身及祖先路径
path.getFunctionParent();         // 获取最近的函数父路径
path.traverse(visitors, ctx);     // 在访问器内部继续遍历子节点
```

**作用域方法**（详见 [06-函数作用域与绑定](./06-函数作用域与绑定.md)）：
```js
path.scope.generateUidIdentifier(name);  // 生成唯一标识符避免命名冲突
path.scope.rename(oldName, newName);     // 重命名变量绑定
path.scope.hasBinding(name);             // 检查是否有绑定
path.scope.getBinding(name);             // 获取变量绑定
```

**类型检查**：`path.isXxx()`（如 `isIdentifier()`）、`assertXxx()` 断言方法

**流程控制**：`path.skip()` 跳过子节点遍历、`path.stop()` 停止整个遍历

**错误处理**：`path.buildCodeFrameError(message)` 生成带源码位置信息的错误对象

**注意事项**：
- 避免直接修改 node 属性，推荐使用 `replaceWith`、`insertBefore` 等方法保证 AST 完整性
- 修改变量名或声明时务必通过 scope 方法操作，避免破坏作用域链

#### State 状态传递

visitor 回调中**不应使用全局变量**维护状态，可通过 `state` 参数在遍历过程中传递数据；也可通过 `path.traverse(SomeVisitor, contextObj)` 将计算值传递给下级 AST 树。

### 4.3 @babel/types：创建、判断 AST 节点

修改 AST 时涉及节点的判断、创建、修改，由 `@babel/types` 提供三类 API：

- **`xxx` 系列**：工厂函数创建节点
  ```js
  t.identifier('name');
  t.stringLiteral('hello');
  t.numericLiteral(100);
  t.callExpression(t.identifier('console.log'), [t.stringLiteral('hi')]);
  t.functionExpression(null, params, body);
  t.blockStatement([...]);
  t.returnStatement(argument);
  t.valueToNode(value);   // 根据 JS 值自动生成对应节点（反混淆常用）
  ```
- **`isXxx` 系列**：判断节点类型，如 `t.isIdentifier(node)`
- **`assertXxx` 系列**：断言节点类型，失败会抛错

### 4.4 @babel/template：模板批量生成 AST

当需要构造复杂节点（多层嵌套）时，手写 `t.xxx` 非常繁琐，用 template 直接写模板字符串：

```js
const template = require('@babel/template');

// 基础用法
const buildRequire = template(`require("MODULE_NAME")`);
const ast = buildRequire({ MODULE_NAME: t.stringLiteral('lodash') });

// 复杂场景：自动绑定 this
const templateString = template.default(`this.METHOD = this.METHOD.bind(this)`);
const subAst = templateString({ METHOD: t.identifier('foo') });
```

### 4.5 @babel/generator：AST → 代码

```js
const generator = require('@babel/generator');
const { code, map } = generator.default(ast, {}, sourceCode);
```

常用选项：
- `comments`：是否保留注释
- `minified`：是否压缩输出
- `sourceMaps`：是否生成 sourcemap
- `retainLines`：保持原始行号
- `compact`：紧凑输出

> 深度展开（全部选项、内部架构、局部节点转代码、其他生成器对比）→ [04-节点转代码](./04-节点转代码.md)
> 注意：Babel 只做结构转换，不做语义校验；如果修改部分节点后没处理副作用（如变量提升、作用域），生成结果可能与预期不符。

### 4.6 @babel/core：整体编译

```js
const babel = require('@babel/core');
babel.transform(code, {
  plugins: [myPlugin],
  sourceType: 'unambiguous'
});
// 或
babel.transformFromAst(ast, code, { plugins: [myPlugin] });
```

`@babel/core` 基于 parse、traverse、generator 完成整体编译流程并应用 plugin 和 preset。**逆向场景更常用的是直接组合 parser/traverse/generator，可控性更强**。

### 4.7 完整示例：箭头函数转普通函数

```js
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generator = require('@babel/generator').default;

const code = `const sum = (a, b) => a + b;`;

// 1. 解析为 AST
const ast = parser.parse(code, { sourceType: 'module' });

// 2. 遍历并修改 AST
traverse(ast, {
  Identifier(path) {
    console.log(`找到标识符: ${path.node.name}`);
  },
  ArrowFunctionExpression(path) {
    // 箭头函数改为普通函数
    path.replaceWith(
      t.functionExpression(
        null,
        path.node.params,
        t.blockStatement([t.returnStatement(path.node.body)])
      )
    );
  }
});

// 3. 生成代码
const { code: transformedCode } = generator(ast);
// 输出: const sum = function(a, b) { return a + b; };
```

### 4.8 手写 Babel 插件基本格式

```js
export default function(babel) {
  return {
    visitor: {},             // 必需，配合 traverse 使用的 visitor 对象
    inherits: OtherPlugin,   // 可选，继承其它插件
    pre(state) {},           // 可选，插件执行前
    post(state) {}           // 可选，插件执行后
  }
}
```

### 4.9 常见避坑技巧

1. **状态（State）问题**：想转换某个函数内的变量，结果在 `Identifier` 访问者里直接转换，导致全部变量都被修改。正确做法是在 `FunctionDeclaration` 访问者内通过递归处理。
2. **作用域（Scopes）问题**：变量可能在外层函数定义，visitor 拿到的是外层引用，贸然修改会导致意外。应善用 `path.scope` 相关 API 进行安全操作（详见 [06-函数作用域与绑定](./06-函数作用域与绑定.md)）。
3. **删除节点的边界情况**：如 `console.xxx` 作为操作数参与运算时不能直接删除，否则引发语法错误，可捕获异常后替换为 `undefined` 兜底（详见 [07-代码替换与增删改](./07-代码替换与增删改.md) 第 8 节）。
4. **path.evaluate() 常量折叠**：Babel 自带 `path.evaluate()` 可对纯常量表达式求值（如 `0x42e * -0x6 + 0x25c8`），这是反混淆第一步（详见 [05-执行函数与求值](./05-执行函数与求值.md)）。
