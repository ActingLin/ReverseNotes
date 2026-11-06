# 极验 fullpage 9.2.0 AST 解混淆（阅读版）

## 结论速览

- 目标文件：`fullpage.9.2.0-guwyxh.js`（543,559 字节 / 9,602 行）
- 混淆家族：**Jscrambler**（自定义 RPO + CFF）
  - 证据 1：还原出的字面量 `et.jscrambler = "Start"` / `"End"`（原文件中被字符串表加密）
  - 证据 2：`Vwtrj.$_CV(n)` 字符串解码器 + `['$_marker'].concat(fn)` / `.shift()` 别名混淆
  - 证据 3：`for (; s !== EXIT;) switch (s)` 状态机 + `Vwtrj.$_DD()[a][b]` 引用相等状态 token
  - 证据 4：`$_` 前缀标识符与 `Vwtrj` 命名空间（RPO）
- 输出形态：**阅读版**（未额外引入 `require` / `module.exports` / 调用包装）
- 最终产物：`source/deobfuscated/fullpage_9.2.0_deobf.js`（240,374 字节 / 4,835 行）

## 复跑

```bash
bash scripts/run_all.sh
```

依赖：Node.js 20+、`@babel/parser` / `@babel/traverse` / `@babel/generator` / `@babel/types`
（本仓库根目录 `node_modules` 已有，脚本会自动向上解析）。

## 流水线

| 轮次 | 脚本 | 变换 | 结果 |
|---|---|---|---|
| step1 | `step1_resolve_constants.js` | 识别解码器别名；替换 `$_CV(n)` 为字符串；`$_DD()[a][b]` → 规范化状态 token | 4802 字符串、471 token、1782 别名，0 遗漏 |
| step2 | `step2_cleanup_alias.js` | 删除 594 组 `['marker'].concat(decoder)` 别名前导块与 `shift()` | 删除 2378 声明符 / 1188 声明 / 594 shift |
| step3 | `step3_unflatten_chain.js` | 保守展开无环链式状态机（严格守卫） | 111 台展开 + 8 台空壳删除，2 台函数声明机器保守跳过 |
| step4 | `step4_readability.js` | 清除字面量 raw/extra；`obj["x"]` → `obj.x`；对象键去引号；拆分逗号表达式；`!0/!1`；常量折叠 | 3461 成员访问、850 对象键、3057 字面量、194 序列、101 布尔 |
| step5 | `step5_rename_locals.js` | 确定性重命名 `$_` 局部绑定（不碰对象属性名） | 38 个绑定 |

每轮都是 `generate -> 重新 parse -> 下一轮`，中间产物全部保留在 `intermediate/`。

## 验证结果（`intermediate/validation_report.json`）

全部 PASS：

- Babel 解析 + `vm.Script` 编译：原版与还原版均通过
- 字符串解码器：1400 项逐项一致
- 状态矩阵：21×21 token 映射一致
- 最小沙箱执行：两版均无异常，导出全局键完全一致
  `["FAIL", "Geetest", "Vwtrj", "pure"]`，导出对象结构形状一致
- 残留计数：

| 指标 | 原版 | 还原版 |
|---|---|---|
| 行数 | 9,603 | 4,836 |
| 字节数 | 543,559 | 240,374 |
| `['marker'].concat(...)` 别名块 | 594 | 0 |
| `.shift()` | 594 | 1（库内真实调用） |
| `switch (` | 127 | 8 |
| 状态机 `for (; s !== N;)` | 123 | 4 |
| `Vwtrj.$_DD()` 状态 token | 471 | 0 |
| `$_` 标识符出现次数 | 11,840 | 1,479（几乎全是对象属性名） |

## 残留结构

1. **顶部解码器块**（`Vwtrj.$_AK` / `Vwtrj.$_BS` / `Vwtrj.$_CV` / `Vwtrj.$_DD`）
   - 在还原版中已是死代码，但故意保留以便追溯字符串表来源。
   - 其中 2 台条件状态机（XOR 循环、矩阵填充）仍保留原样。
2. **2 台终态状态机**（`for (; true;)`，case 内直接 `return`）
   - 语义等价且可读性尚可；如需彻底去平坦化可手工展开。
3. **2 台含顶层函数声明的状态机**
   - 因 sloppy-mode 块级函数声明的 hoisting 语义，保守跳过。
4. **对象属性名仍是 `$_XXX`**
   - 例如 `this.$_BGS`、`$_EHE`。这些是 Geetest/CryptoJS 内部字段，属于混淆产物的一部分；
     若目标是抓参数，通常无需改名；若要精读算法，可结合语义手工映射。

## 下一轮建议

- 若继续做**结构还原**：手工处理剩余 4 台状态机，或对 2 台函数声明机器做逐条 review 后放开守卫。
- 若目标是**签名/参数复现**：本 skill 到此为止。下一步应转 `env-patch`（Node/vm 跑通）或
  `web-protocol-recovery`（完整请求链路），而不是继续深挖 AST。
- 若需要**调用版**：在阅读版基础上单独暴露入口，不要把调用包装混入本文件。

## 目录

```text
ai_ast解混淆/
├── source/original/fullpage.9.2.0-guwyxh.js
├── source/deobfuscated/fullpage_9.2.0_deobf.js
├── intermediate/
│   ├── fullpage_step1_literals.js
│   ├── fullpage_step2_alias_cleanup.js
│   ├── fullpage_step3_unflattened.js
│   ├── fullpage_step4_readable.js
│   ├── controlflow_report*.json
│   └── validation_report.json
└── scripts/
    ├── run_all.sh
    ├── lib_decoders.js
    ├── step1_resolve_constants.js
    ├── step2_cleanup_alias.js
    ├── step3_unflatten_chain.js
    ├── step4_readability.js
    ├── step5_rename_locals.js
    ├── analyze_controlflow.js
    └── validate_output.js
```
