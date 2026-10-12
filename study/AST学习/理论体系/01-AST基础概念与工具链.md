# 01 · AST 基础概念与工具链

> 来源：原《AST学习笔记》第 1、2 章
> 上一篇：[目录](./README.md) ｜ 下一篇：[02-Babel节点类型大全](./02-Babel节点类型大全.md)

## 1. AST 基础概念

### 1.1 什么是 AST

抽象语法树（Abstract Syntax Tree，AST）是**源代码语法结构的一种抽象表示**，以树状形式表现编程语言的语法结构，每个节点都表示源代码中的一种结构。

AST 是 Babel、Webpack、Vue-cli、ESLint、Prettier 等众多前端工具和库的核心基石，它们都通过 AST 实现对代码的检查、分析、转换等操作。

例如 `var tree = 'this is tree'` 会被解析为如下 AST（JSON 对象）：

```json
{
  "type": "Program",
  "body": [
    {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": { "type": "Identifier", "name": "tree" },
          "init": { "type": "Literal", "value": "this is tree" }
        }
      ],
      "kind": "var"
    }
  ]
}
```

要点：
- 字符串形式的 `type` 字段表示节点类型（如 `VariableDeclaration`、`Identifier`、`BinaryExpression` 等），不同节点类型定义了各自属性。
- JS 的 AST 结构遵循 **ESTree** 通用规范，各编译工具在此基础上扩展。
- 可以使用在线工具 **AST Explorer**（[astexplorer.net](https://astexplorer.net)）直观查看代码对应的 AST，边写边看是学习 AST 最快的方式。

### 1.2 AST 是如何生成的

计算机理解源代码需要经过编译过程，核心两步：

1. **词法分析（Lexical Analysis）**：将原始代码字符串扫描分割成一个个词法单元（Tokens），每个 token 带类型，如 `{ type: 'keyword', value: 'const' }`、`{ type: 'identifier', value: 'message' }`。
2. **语法分析（Syntax Analysis）**：将 Tokens 按语法规则组装成抽象语法树（AST）。AST 本质就是一个 JSON 对象。

之后还有**代码生成（Code Generation）**阶段：遍历初始 AST，对其结构进行改造，再将改造后的结构生成对应的代码字符串。（详见 [04-节点转代码](./04-节点转代码.md)）

### 1.3 Babel 的工作流程

Babel 是一个 JavaScript 转译器（transpiler），输入和输出都是 JS 源码。核心流程分为三个阶段：

```
parsing（解析） -> transforming（转换） -> generation（生成）
String -------> AST -----------> modified AST ----------> String
```

1. **parse（解析）**：将源码转换为 AST。包含词法分析和语法分析，Babel 将其封装为 `@babel/parser` 库（Babel 7 之前叫 Babylon）。
2. **transform（转换）**：遍历 AST，通过插件（plugins）对节点进行添加、更新、移除等修改，返回新的 AST。这是 Babel 最核心、最灵活的步骤，主要使用 `@babel/traverse`（遍历 AST）和 `@babel/types`（判断/创建节点）。
3. **generate（生成）**：根据新的 AST 生成目标代码，并生成 sourcemap。对应 `@babel/generator` 库。

### 1.4 手写一个最小的 AST 转换（三步流程完整演示）

```js
const parser = require('@babel/parser');
const traverse = require('@babel/traverse');
const generator = require('@babel/generator');

// 将 var 声明转换为 let
const transToLet = code => {
  const ast = parser.parse(code);
  const visitor = {
    VariableDeclaration(path) {
      if (path.node.kind === 'var') {
        path.node.kind = 'let';  // 直接修改节点属性
      }
    }
  };
  traverse.default(ast, visitor);
  const newCode = generator.default(ast, {}, code).code;
  return newCode;
};

console.log(transToLet('var a = 1; var b = 2;'));
// 输出: let a = 1; let b = 2;
```

> 这就是 AST 技术的核心套路：**parse → 遍历修改 → generate**。后面所有反混淆脚本都是这个框架的变体。

---

## 2. 工具链与解析器

### 2.1 常用解析器对比

| 解析器 | 特点 | 用途 |
|--------|------|------|
| `@babel/parser`（Babylon） | 基于 acorn 扩展，支持 ES Next、JSX、TS、Flow | **逆向首选**，功能最全，Babel 生态配套完整 |
| `acorn` | 轻量、快速、模块化，ECMAScript 规范实现 | 简单解析、代码分析工具 |
| `esprima` | 老牌解析器，标准 ESTree 输出 | 早期工具（jsdom 内部用） |
| `espree` | ESLint 使用的解析器（基于 acorn） | ESLint 生态 |
| `shift-parser` | Shift AST 规范（另一种 AST 格式） | 少数工具使用 |

> **逆向场景直接选 Babel 全家桶**：`@babel/parser` + `@babel/traverse` + `@babel/types` + `@babel/generator`，社区资料最多，案例最全。
> 注意：解析器与代码生成器要**配对使用**（parser 配 generator），混用不同 AST 规范的组合会丢注释甚至报错，详见 [04-节点转代码.md](./04-节点转代码.md) 第 7 节。

### 2.2 Babel 基础工具库总结

| 库 | 作用 |
|----|------|
| `@babel/parser` | 将代码解析成 AST |
| `@babel/traverse` | 遍历 AST，配合 visitor 访问节点 |
| `@babel/types` | 遍历时判断 AST 节点类型、创建 AST 节点 |
| `@babel/template` | 根据模板字符串快速生成 AST（避免手动构造复杂节点） |
| `@babel/generator` | 将 AST 生成为目标代码，并生成 sourcemap |
| `@babel/core` | 整合 parse、traverse、generator 流程，并实现插件机制 |
| `@babel/code-frame` | 解析出错时生成标记错误位置的信息 |
| `@babel/helper-module-imports` | 在 AST 中添加 import 语句 |

### 2.3 安装

```bash
npm install @babel/parser @babel/traverse @babel/types @babel/generator @babel/template
```

> 本仓库已在项目根目录装好全部依赖，直接 `node xxx.js` 即可。
