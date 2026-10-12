# AST 在 JS 逆向中的作用与边界（资料汇总）

> 这篇回答两个问题：**AST 到底能干什么？**、**它的边界在哪？**
> 内容来源：公开技术资料的汇总（2024-2026），文末附来源。
> **适合**：已经跑过几个实例、想知道"学这个到底有什么用"的人。

---

## 1. AST 在反混淆中的七种具体作用

反混淆的通用流程是：**解析 → 遍历/语义分析 → 规则处理 → 代码再生成**。
在这条流水线上，AST 能做这些事：

| # | 作用 | 典型的节点操作 | 对应本项目实例 |
|---|------|--------------|--------------|
| 1 | **字符串还原** | 删 `extra.raw`（还原 `\x` / `\u` / 八进制转义） | `04-hex-decode.js` |
| 2 | **可计算表达式求值**（常量折叠） | `path.evaluate()` | `05-constant-fold.js` |
| 3 | **成员表达式简化** | `a["b"]` → `a.b`（改 `computed`） | `04`、`06` |
| 4 | **字符串数组还原** | 定位数组+解密函数，求值后替换调用点 | `06`、`07` |
| 5 | **控制流平坦化还原** | 分析 switch-case 状态分发，重建顺序/分支 | `08-control-flow.js` |
| 6 | **死代码删除（DCE）** | 删 `if(false){}`、无引用声明 | `03`、`06`、`07` |
| 7 | **函数局部执行** | 对纯函数调用求值（`atob`、`String.fromCharCode`、自定义解密函数） | `06`、`07` |

### 1.1 更深一层：AST 提供的能力底座

上面七种"作用"，本质靠的是 AST 提供的四种**结构化能力**：

```
① 精确定位    —— 按节点类型找目标，不误伤（正则做不到）
② 作用域分析  —— 知道"这个名字在哪被引用、是否被改过"
                 （Babel 的 binding / referencePaths / constantViolations）
③ 语义改写    —— 用 replaceWith / insertBefore 等 API 安全地改树
④ 求值能力    —— path.evaluate() 静态求值；配合沙箱做局部执行
```

**为什么强调"作用域分析"？** 因为这是 AST 相对正则的**最大代差**：

```js
var a = 1;              // 这个 a
function f() {
    var a = 2;          // 这个 a（不同的绑定！）
    return a;
}
```

正则看到两处 `a` 一视同仁；AST 通过 `scope.getBinding()` 能区分它们，
所以能安全地"只替换函数内的 a"——**这是做复杂还原的前提**。

### 1.2 在安全分析领域的价值（顺带一提）

AST 反混淆不只服务于逆向爬虫，恶意代码分析领域同样依赖它：

- **检测和分类恶意 JS**：用 AST 指纹分类相似混淆代码，
  或用下推自动机匹配 AST 子树来识别混淆变换
- **提升检测率**：学术研究表明，混淆会隐藏恶意代码对标准 API 的使用，
  反混淆（AST 还原）能显著提升检测系统的识别率
- **构建控制流图**：基于 AST 做抽象执行、路径分析

---

## 2. 在完整逆向流程中，AST 处于哪个位置？

很多人误以为"学 AST = 会逆向"或"逆向 = 解混淆"。实际流程是：

```
① 抓包定位        →  找到加密参数（sign/token/cookie）
② 入口定位        →  用调试/hook 找到"哪个函数生成了它"
③ 代码还原 ★      →  AST 的主场：把混淆代码变可读
④ 算法理解        →  结合调试、日志、插桩，搞清楚算法细节
⑤ 本地复现        →  用 Node/Python 重写算法，跑出同样的结果
⑥ 工程化          →  接入爬虫/自动化系统
```

**注意两点**：

1. **AST 主要在 ③ 环节**，但和 ④ 是交叉的：
   还原出一版可读代码 → 调试验证 → 发现还看不清 → 再还原一层
2. **AST 不是起点**：一上来就"全文件盲还原"是新手常见错误。
   正确做法是**先定位入口**（②），再针对性还原（③）——
   只还原被用到的那部分代码，效率高得多

> 本项目的 `ast-deobfuscate` skill 文档里明确写着这个原则：
> **"不要全文件盲还原"、"如果不知道 sign/token 入口，先做入口定位"**。
> 这是被无数实战验证过的经验。

---

## 3. 边界：AST 做不到什么（重要）

### 3.1 硬边界（原理上做不到）

| 做不到 | 为什么 |
|--------|--------|
| 还原**原始变量名** | 混淆后名字信息已丢失。工具能做的是"语义化重命名"（根据用法猜，如把操作 xhr 的变量叫 `xhr`），不是真还原 |
| 处理**运行时才确定的值** | 静态分析的定义：不运行代码。`Math.random()`、`Date.now()`、用户输入都算不出来 |
| **VM / VMP 保护** | 代码被编译成字节码，由虚拟机解释执行。AST 里只有"虚拟机 + 字节码数组"，没有业务逻辑 |
| **WASM** | 另一种格式，需要专门的工具链（wasm2wat 等），不属于 JS AST 范畴 |

### 3.2 软边界（做得到但很难/有风险）

| 场景 | 难点 |
|------|------|
| 控制流还原 | 真实块识别、不透明谓词、嵌套调度器；**"看似合理但完全错误"的结果最危险** |
| 运行时索引的字符串 | 循环依赖：还原它需要先做常量折叠，做常量折叠又需要先还原它 |
| 二进制/字节码 | 需符号执行探索路径、约束求解，有路径爆炸风险 |
| 极端定制混淆 | 没有通用解，一个样本一套脚本 |

### 3.3 一个必须接受的事实

> **"没有通用还原程序"** —— 不同混淆手段需要不同还原规则，
> 用一套脚本处理另一种混淆代码，可能报错或**静默失效**。

所以实战心态是：**理解原理 > 收集工具**。
工具会因为混淆器升级而失效，原理不会。

---

## 4. 工具生态（2026 年现状）

### 4.1 一键工具（先用它们处理"通用部分"）

| 工具 | 定位 | 热度/状态 |
|------|------|----------|
| [webcrack](https://github.com/j4k0xb/webcrack) | 反混淆 obfuscator.io + 解包 webpack/browserify + unminify，自动检测、无需配置 | ⭐约 2.9k，2026 年仍活跃，**当前首选** |
| [synchrony](https://github.com/relative/synchrony) | javascript-obfuscator 清理/反混淆 | ⭐约 1.2k，活跃 |
| [obfuscator-io-deobfuscator](https://github.com/ben-sb/obfuscator-io-deobfuscator) | 专打 obfuscator.io | ⭐约 800，可 npm 全局安装 |
| [kuizuo/js-deobfuscator](https://github.com/kuizuo/js-deobfuscator) | Babel AST 反混淆，带在线 playground / CLI / API | 较新 |
| [deloom](https://github.com/tq-xyy/deloom) | 解包 + 语义化重命名，能把 webpack bundle 拆回模块 | 较新 |
| [de4js](https://github.com/lelinhtinh/de4js) | 老牌在线工具 | **2021 年后停更**，别指望它处理新混淆 |
| [JSNice](https://jsnice.org) | 学术派变量名猜测 | **2018 年后停滞**，处理不了现代混淆 |

> **选型速记**：通用场景 → webcrack；专打 obfuscator.io → 上面几个都行；
> 想"抄作业学写法" → [MadLongTom/JS-AST-Deobfuscator](https://github.com/MadLongTom/JS-AST-Deobfuscator)
> （一堆干净的 visitor 实现，非常适合学习）。

### 4.2 本项目的资源（你手上就有的）

| 资源 | 说明 |
|------|------|
| `examples/`（本目录） | 8 个可运行实例，从零到控制流还原 |
| `顶象greenseer AST还原案例分析.md` | 一个 176 行脚本还原真实商业混淆（两代版本）的完整拆解 |
| `~/.claude/skills/ast-deobfuscate/` | 工程化的 AST 解混淆 skill：**家族识别 → 插件/visitor 分层 → 多轮 pass → 残留度量**，还带一套完整的目录版工程模板（`src/plugins/` + `src/visitors/`） |

**那个 skill 里的方法论值得单独抄下来**（本项目实例也是遵循它写的）：

```
Step 0    先识别混淆家族，不要一上来写大而全的 pass
Step 1    建最小 pipeline：每个 visitor 只做一件事
Step 2    多轮执行：每轮 generate → reparse → 下一轮
Step 3    目标定制优先，不追求"万能自动解"
约束      ① 不写 500 行的万能 visitor
          ② 没识别家族前不暴力替换
          ③ 不在同一份 AST 上叠十几轮替换而不重新 parse
          ④ 不把运行时依赖的逻辑硬说成"静态已还原"
```

---

## 5. 趋势：2026 年的 AST 反混淆在发生什么

### 5.1 AI 辅助写 visitor（效率提升明显）

LLM 在这件事上很擅长：**"把规则描述翻译成 Babel visitor 代码"**。

```
你：写一个 visitor，把 `a['b']` 形式的成员访问改成 `a.b`，注意过滤非法标识符
AI：（几秒钟给出可用代码，就是本目录 04 里的那段）
```

**但注意边界**（公开资料的共识）：
- LLM 擅长：**浅层变换**（重命名、格式化、简单规则翻译）
- LLM 不擅长：**深层混淆**（控制流平坦化、VM 保护）—— 输出常遗漏关键逻辑
- **正确用法**：LLM 生成规则 → 你验证 → 用工具/自写脚本处理深层结构

### 5.2 工具链融合

现在的趋势是"一体化解包 + 反混淆"（webcrack、deloom 都是这个方向）：
不只是还原字符串，还要把 webpack bundle 拆回模块文件，
尽可能接近"原始工程结构"。

### 5.3 但核心没变

不管工具怎么进化，**这几件事仍然要人来做**：
- 判断"该还原到什么程度"（目标管理）
- 验证还原结果的正确性（错误结果可能看起来很合理）
- 理解算法本身（AST 只让代码可读，理解算法还得靠脑子 + 调试）

**所以：学 AST 不是为了"会用工具"，是为了"有能力处理工具搞不定的那 20%"。**

---

## 6. 本篇小结

```
作用：把"不可读的混淆代码" → "可分析、可调试、结构清晰的代码"
      核心价值 = 自动化 + 语义化（作用域感知）+ 批量化

位置：逆向流程的"代码还原"环节（第 ③ 步），不是起点也不是终点

边界：还原不了原始变量名 / 算不了运行时值 / 处理不了 VM 和 WASM
      没有通用解，一个样本一套脚本

心态：理解原理 > 收集工具；80% 自动化 + 20% 人工；对结果保持怀疑
```

---

## 参考资料与来源

本篇汇总自以下公开资料（2024--2026）：

1. [腾讯云开发者社区《逆向进阶，利用 AST 技术还原 JavaScript 混淆代码》（K哥爬虫）](https://cloud.tencent.com.cn/developer/article/1989490)
2. [腾讯云《JS代码之还原》（愧怍）](https://cloud.tencent.com.cn/developer/article/2200755)
3. [webcrack（j4k0xb/webcrack）GitHub](https://github.com/j4k0xb/webcrack)
4. [CSDN《js反混淆工具汇总【看家底】》](https://blog.csdn.net/u010087338/article/details/155242870)
5. [Use Babel to Deobfuscate JavaScript Malware（nullteilerfrei.de）](https://blag.nullteilerfrei.de/2026/01/18/use-babel-to-deobfuscate-javascript-malware/)
6. [CSDN 问答《JS解密时遇到混淆代码（如AST变换、字符串数组+eval）如何还原原始逻辑？》](https://ask.csdn.net/questions/9260058)
7. [52pojie《[Web逆向] 某红书4.3.2 ob混淆还原(字符串数组/字典/控制流平坦化)》](https://www.52pojie.cn/thread-2100076-1-1.html)
8. [GitHub - Wker666/anti-js-ob：对抗新版本 javascript-obfuscator](https://github.com/Wker666/anti-js-ob)
9. [Characterizing Obfuscated JavaScript Using Abstract Syntax Trees（IEEE WAINA）](https://dl.acm.org/doi/10.1109/WAINA.2012.140)
10. [Babel 插件手册（中文）](https://github.com/jamiebuilds/babel-handbook)
