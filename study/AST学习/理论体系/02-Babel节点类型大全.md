# 02 · Babel AST 节点类型大全（ESTree 规范）

> 来源：原《AST学习笔记》第 3 章
> 上一篇：[01-AST基础概念与工具链](./01-AST基础概念与工具链.md) ｜ 下一篇：[03-Babel核心API](./03-Babel核心API.md)

### 3.1 公共属性

所有 AST 节点都有公共属性：
- `type`：节点类型字符串
- `start`、`end`、`loc`：源码位置信息
- `leadingComments`、`innerComments`、`trailingComments`：关联注释
- `extra`：额外信息

**判断节点类型的核心原则**：
- **Statement 的特点是可以单独执行**；
- **Expression 的特点是有返回值**；
- 可以单独执行的表达式会包一层 `ExpressionStatement`。

### 3.2 Babel AST 与 ESTree 的主要差异

`@babel/parser` 生成的 AST 遵循 Babel AST format（基于 ESTree 扩展）：
- **最外层节点是 `File`**（包含 `program`、`comments`、`tokens` 属性），而 ESTree 没有此节点
- ESTree 的 `Property` 在 Babel 中叫 **`ObjectProperty`**
- 作为属性值的 `FunctionExpression` 放在 **`ObjectMethod`** 节点中
- 用 **`StringLiteral`、`NumericLiteral`、`NullLiteral`、`RegExpLiteral`、`BooleanLiteral`** 代替 ESTree 的通用 **`Literal`**
- 用 **`ClassMethod`** 代替 `MethodDefinition`
- 用 **`ClassPrivateProperty`** 代替 `FieldDefinition`
- 用 **`CallExpression`** 代替 `ImportExpression`
- 用 **`OptionalMemberExpression`/`OptionalCallExpression`** 代替 `ChainExpression`

### 3.3 字面量（Literal）

在 Babel 中，`Literal` 是一个联合类型：

```ts
type Literal = StringLiteral | NumericLiteral | NullLiteral | BooleanLiteral
             | RegExpLiteral | TemplateLiteral | BigIntLiteral | DecimalLiteral;
```

各字面量节点接口（均有 `type` 字段）：
- `StringLiteral`：`value` 为字符串
- `NumericLiteral`：`value` 为数字
- `NullLiteral`
- `BooleanLiteral`：`value` 为布尔值
- `RegExpLiteral`：含 `pattern` 和 `flags` 属性
- `TemplateLiteral`：含 `quasis`（TemplateElement 数组）和 `expressions`（Expression 数组）
- `BigIntLiteral`、`DecimalLiteral`

创建方法（@babel/types）：
```js
t.stringLiteral("Hello World");
t.numericLiteral(100);
t.booleanLiteral(true);
t.nullLiteral();
t.regExpLiteral("\\.js?$", "g");
```

### 3.4 标识符（Identifier）

```ts
export interface Identifier extends BaseNode {
  type: "Identifier";
  name: string;
  decorators: Array<Decorator> | null;
  optional: boolean | null;
  typeAnnotation: TypeAnnotation | TSTypeAnnotation | Noop | null;
}
```

- 变量名、属性名、参数名等各种声明和引用的名字都是 Identifier。
- **Identifier 既可以是声明，也可以作为表达式**（因为它有返回值）。

### 3.5 表达式（Expression）节点大全

| 节点类型 | 说明 |
|---------|------|
| `Identifier` | 标识符 |
| `StringLiteral` / `NumericLiteral` / `NullLiteral` / `BooleanLiteral` / `RegExpLiteral` / `TemplateLiteral` / `BigIntLiteral` / `DecimalLiteral` | 各种字面量 |
| `UnaryExpression` | 一元运算：`-` `+` `!` `~` `typeof` `void` `delete` |
| `UpdateExpression` | 自增自减：`++` `--` |
| `BinaryExpression` | 二元运算：`==` `!=` `===` `!==` `<` `<=` `>` `>=` `<<` `>>` `>>>` `+` `-` `*` `/` `%` `|` `^` `&` `in` 等 |
| `AssignmentExpression` | 赋值：`=` `+=` `-=` 等 |
| `LogicalExpression` | 逻辑运算：`\|\|` `&&` |
| `ArrayExpression` | 数组字面量 |
| `ObjectExpression` / `ObjectProperty` / `ObjectMethod` | 对象字面量及其属性/方法 |
| `SpreadElement` | 展开元素 `...a` |
| `MemberExpression` | 成员访问：`computed` 为 true 时是 `a[b]`，false 时是 `a.b` 且 property 为 Identifier |
| `CallExpression` | 函数调用：`callee` 是被调用的函数/方法，`arguments` 是参数列表 |
| `NewExpression` | `new` 调用（继承自 CallExpression） |
| `ThisExpression` | `this` |
| `FunctionExpression` / `ArrowFunctionExpression` | 函数表达式 / 箭头函数 |
| `ConditionalExpression` | 三元表达式 |
| `SequenceExpression` | 逗号序列表达式 |
| `TaggedTemplateExpression` | 标签模板 |
| `AwaitExpression` | await 表达式 |
| `OptionalMemberExpression` / `OptionalCallExpression` | 可选链（`a?.b` / `a?.()`） |

**CallExpression 接口定义**（逆向最常打交道的节点）：
```ts
interface CallExpression <: Expression {
  type: "CallExpression";
  callee: Expression | Super | Import;
  arguments: [ Expression | SpreadElement ];
}
```

### 3.6 语句（Statement）节点大全

| 节点类型 | 说明 |
|---------|------|
| `ExpressionStatement` | 表达式作为语句时包裹一层 |
| `BlockStatement` | 花括号代码块 |
| `EmptyStatement` | 空语句 `;` |
| `DebuggerStatement` | `debugger`（反调试混淆高频出现） |
| `WithStatement` | with 语句 |
| `ReturnStatement` | return |
| `LabeledStatement` | 标签语句 |
| `BreakStatement` / `ContinueStatement` | break / continue |
| `IfStatement` | if 条件 |
| `SwitchStatement` / `SwitchCase` | switch（控制流平坦化核心） |
| `ThrowStatement` / `TryStatement` / `CatchClause` | 异常处理 |
| `WhileStatement` / `DoWhileStatement` | while / do-while（控制流平坦化核心） |
| `ForStatement` / `ForInStatement` / `ForOfStatement` | for 系列 |

### 3.7 声明（Declaration）节点大全

| 节点类型 | 说明 |
|---------|------|
| `FunctionDeclaration` | 函数声明（`id` 不能为 null） |
| `VariableDeclaration` | 变量声明（`kind` 为 `"var"` / `"let"` / `"const"`） |
| `VariableDeclarator` | 变量声明符（`id` + `init`） |
| `ClassDeclaration` / `ClassExpression` | 类声明 / 类表达式 |
| `ImportDeclaration` | import（specifiers 为 `ImportSpecifier` / `ImportDefaultSpecifier` / `ImportNamespaceSpecifier`） |
| `ExportNamedDeclaration` / `ExportDefaultDeclaration` / `ExportAllDeclaration` | export 系列 |

### 3.8 模式（Pattern）、类与其他

- **模式**：`ObjectPattern`、`ArrayPattern`、`RestElement`、`AssignmentPattern`
- **类**：`ClassBody`、`ClassMethod`（kind 区分 constructor/method/get/set）、`ClassProperty`
- **程序**：`Program`（`body` 存放语句数组、`sourceType` 为 `"module"` 或 `"script"`、`directives`）、`File`（Babel 根节点）
- **其他**：`Directive`（如 `"use strict"`）、`CommentBlock`、`CommentLine`（注释节点）

### 3.9 @babel/types 中的别名（Alias）

`@babel/types` 中定义了一组**别名**，可在 traverse 中批量处理：

| 别名 | 包含节点 |
|------|---------|
| `Function` | FunctionDeclaration、FunctionExpression、ArrowFunctionExpression、ObjectMethod、ClassMethod |
| `Statement` | 各种 XxxStatement |
| `Declaration` | 各种 XxxDeclaration |
| `Expression` | 各种 XxxExpression |
| `Literal` | 各种字面量 |
| `Scopable` | 有作用域的节点（Function、BlockStatement 等） |
| `Pureish` | 纯函数/字面量（可安全删除的节点） |

```js
// 用别名批量匹配
traverse(ast, {
  Function(path) { /* 匹配所有函数类节点 */ },
  Declaration: { exit(path) {} }
});
```

> 完整节点列表可查阅 [Babel parser 仓库的 AST 文档（doc/ast/spec.md）](https://github.com/babel/babel/blob/main/doc/ast/spec.md) 或 `@babel/types` 的 TypeScript 类型定义，也可通过 [astexplorer.net](https://astexplorer.net) 可视化查看。
