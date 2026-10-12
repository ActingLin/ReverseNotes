# 实战案例：顶象 greenseer 验证码 AST 反混淆还原

> 案例来源：`Work/jsReverse/验证码/某港口登录，DX滑块/study/dingxiangAST-main/`（开源项目）
> 配套主笔记：[AST学习笔记.md](AST学习笔记.md)
> 阅读前提：掌握 Babel 全家桶基本用法（参考主笔记第 4 章）

---

## 目录

1. [案例背景](#1-案例背景)
2. [混淆机制分析（对照源码）](#2-混淆机制分析对照源码)
3. [还原脚本逐段解析（核心）](#3-还原脚本逐段解析核心)
4. [还原效果对比](#4-还原效果对比)
5. [该案例的不足与改进空间](#5-该案例的不足与改进空间)
6. [提炼的 AST 学习要点](#6-提炼的-ast-学习要点)

---

## 1. 案例背景

**目标**：顶象（DingXiang）无感验证码的前端加密脚本 **greenseer.js**，负责采集浏览器环境指纹（UA、屏幕信息、鼠标轨迹、selenium/webdriver 检测等）并加密上报。

**项目文件结构**：

| 文件 | 说明 |
|------|------|
| `dx.js` | 旧版混淆代码（ctu-greenseer 2020-10-27，2159 行） |
| `decode_dx.js` | dx.js 的 AST 还原结果（1685 行） |
| `encode.js` | 新版混淆代码（v1.492.0 2025-07-11，3764 行） |
| `decode_1.js` | encode.js 的 AST 还原结果（2496 行） |
| `greenseerAST.js` | 核心：AST 反混淆脚本（仅 176 行） |

> **启示**：两份不同年份（2020/2025）的混淆代码，用**同一份** 176 行 AST 脚本即可还原——AST 反混淆的通用性极强，识别出混淆套路后可以复用。

**为什么不能直接跑混淆代码？** 逆向人员通常需要：
- 看懂加密/签名逻辑（定位环境指纹采集点）
- 提取或替换关键逻辑（本项目作者将其还原后"在浏览器上完美替换运行"）

---

## 2. 混淆机制分析（对照源码）

### 2.1 结构混淆：webpack 风格模块数组 + IIFE

```js
!function(t, r, n, e, o, i, a) {
    !function(r) {
        var n = 'E"F'
          , e = o[0]        // 引用外部数组参数
          , a = "ॊ"
          ...
        function p(t) {
            if (d[t]) return d[t][l("R.EW" + n)];      // 属性名加密 + 拼接
            var i = d[t] = { "i": t, "l": !1, "exports": {} };
            return r[t][C("㢘ॼॖ৽")](i[v("...")], i, i[C("...")], p), ...
        }
    }(...)
}([...大数组1...], [...大数组2...], ...);
```

- 外层 IIFE 接收**多个大数组参数**（元素含字符串、数字、布尔、正则），内部通过 `o[0]`、`e[20]`、`i[43]` 等**索引引用**数组元素
- 内部再套一层模块加载器（`p` 函数类似 webpack 的 `__webpack_require__`），模块数组按索引执行
- 这种"参数索引引用"让字符串全部脱离字面量，直接搜索源码看不到任何可读字符串

### 2.2 字符串加密：Unicode 转义 + 自定义异或

数组中同时混有**明文**（如 `"https://eventreport.dingxiang-inc.com/api/errMsgReport"`）和**密文**（如 `"㢘ॼॖ৽"`），密文需经解密函数还原：

```js
// 解密函数 v：链式异或（key=17410 逐字符滚动）
function v(t) {
    if (!t) return "";
    for (var r = "", n = 17410, e = 0; e < t.length; e++) {
        var o = t.charCodeAt(e), i = o ^ n;
        n = o, r += String.fromCharCode(i)
    }
    return r
}

// 解密函数 l：V587 异或（"V58" + s 拼接出 key，s = "7"）
function l(t) {
    for (var r = "", n = "V58" + s, e = 45134, o = 0; o < t.length; o++) {
        var i = t.charCodeAt(o);
        e = (e + 1) % n.length, i ^= n.charCodeAt(e), r += String.fromCharCode(i)
    }
    return r
}

// 解密函数 C/c：乘法链异或（key=80123，n = n*o%256 + 2333）
function c(t) {
    for (var r = "", n = e[20], o = 0; o < t.length; o++) {
        var i = t.charCodeAt(o) ^ n;
        n = n * o % 256 + 2333, r += String.fromCharCode(i)
    }
    return r
}
```

三个解密函数特点：
- **key 本身藏在数组/拼接里**（`e[20]`、`"V58"+s`），还原顺序必须先解数组才能解字符串
- 都**保留在还原后的代码里**（运行时仍需加密数据上报），只替换其**调用点**
- 密文在 `\uXXXX` 范围内（如 `㢘`），肉眼无法阅读

### 2.3 数组位移（自执行函数打乱数组顺序）

```js
for (l = n[47]; t = f["shift"](); )
    l ? t() : f["push"](t)
```

自执行函数把数组元素 `shift` 出来又 `push` 回去（旋转数组），且元素可能是函数——执行顺序被彻底打乱。这是 OB 混淆经典手法，此案例中体现在 `f` 数组（DOM ready 回调队列）。

### 2.4 属性名加密：反序 + 拼接

```js
t[(s = "stropxe", s.split("").reverse().join(""))] = f()   // "stropxe" 反序 → "exports"
d[t][l("R.EW" + n)]                                        // "R.EW"+"F" = "R.EWF" 经 l() 解密 → "exports"
```

- `split("").reverse().join("")` 反序字符串（README 自述该模式**未完全替换**，是已知不足）
- 字符串**拼接后再解密**（`"V58"+s`、`"R.EW"+n`），需要常量传播把 `s = "7"`、`n = 'E"F'` 传播到位才能解密

### 2.5 其他

- **标识符混淆**：全部单字母（t、r、n、e、o、i、a），没有语义
- **逗号表达式**：`i["l"] = true, i["exports"]`（SequenceExpression）压缩代码
- **反调试/检测**：`__selenium_evaluate`、`__webdriver_scr` 等字符串暗示有 webdriver 检测逻辑（混淆的目的之一就是隐藏这些检测点）

---

## 3. 还原脚本逐段解析（核心）

`greenseerAST.js` 共 176 行，7 个 visitor + 精心设计的执行顺序。逐段拆解：

### 3.1 `restoreArray`：基于引用的数组替换（最关键的改进）

```js
const restoreArray = {
    "Program"(path){
        let body = path.get("body.0").node;          // 取最外层 IIFE
        let expression = body.expression;
        let argument = expression.argument;
        let {callee,arguments} = argument;
        let params = callee.params;                  // IIFE 形参：t,r,n,e,o,i,a
        for (var i=0; i<params.length;i++){
            let name = params[i].name;               // 形参名，如 o
            let array = arguments[i].elements;       // 实参大数组的 elements
            let scope = path.get("body.0.expression.argument.callee.body").scope;
            const binding = scope.getBinding(name);  // 获取形参 o 的绑定
            for (var x=0; x<binding.referencePaths.length;x++){
                let _path = binding.referencePaths[x].parentPath;  // o[0] 的 MemberExpression
                let {object,property} = _path.node;
                _path.replaceInline(array[property.value]);        // 数组元素替换引用处
            }
        }
    }
};
```

**技术要点**：
1. **在 `Program` 节点一次性处理**：取 `body.0` 得到最外层 IIFE，形参/实参一一对应
2. **基于引用替换而非名字匹配**：`scope.getBinding(name)` 拿到形参绑定 → `binding.referencePaths` 是**所有引用该绑定的位置**（Path 数组）→ 逐个替换。README 强调这是对旧工具的改进——**基于名字替换遇到重名数组（不同作用域同名变量）就会替换错误**，基于引用则精确到绑定关系，永不错位
3. `_path.replaceInline(...)`：`referencePath` 是 `o` 这个 Identifier，其 `parentPath` 就是 `o[0]` 这个 MemberExpression，直接整棵替换
4. `array[property.value]`：`o[3]` 的 property 是 NumericLiteral（value=3），直接当下标取数组元素；元素是 AST 节点，可直接 `replaceInline` 进树

### 3.2 `restoreVar`：字面量常量传播

```js
const restoreVar = {
    VariableDeclarator(path) {
        const {id,init} = path.node;
        if (!types.isLiteral(init)) return;          // 只处理字面量初始化
        const binding = path.scope.getBinding(id.name);
        if (!binding || binding.constantViolations.length > 0) return;  // 被修改过则跳过
        for (const refer_path of binding.referencePaths) {
            refer_path.replaceWith(init);            // 引用处替换为字面量
        }
        path.remove();                               // 删除原声明
    },
};
```

**技术要点**：
- `constantViolations.length > 0` 判断变量**是否被重新赋值**——被改过就不能直接替换（安全护栏，防止破坏语义）
- 替换所有引用后删除声明节点
- 这一手解决了 `s = "7"`、`n = 'E"F'` 这类常量传播，为后续字符串解密（`"V58"+s` → `"V587"`）铺路

### 3.3 `evaluateValue`：path.evaluate() 常量折叠

```js
const evaluateValue = {
    "UnaryExpression|BinaryExpression|CallExpression|ConditionalExpression":{
        exit:function(path){
            const {confident,value} = path.evaluate();   // Babel 自带求值器
            if (confident){
                if (value !== undefined){
                    path.replaceInline(types.valueToNode(value));  // 值转节点
                    path.skip();
                }
            }
        }
    }
};
```

**技术要点**：
- **`path.evaluate()` 是 Babel 内置的常量求值 API**：纯常量表达式（`"V58" + "7"`、`0x42e * -0x6`）直接算出结果，返回 `{confident, value}`，`confident` 为 true 表示可确定
- **exit 阶段处理**：子节点先被求值成字面量，父节点才能继续求值（自底向上）
- `valueToNode(value)`：JS 值 → AST 节点，自动匹配类型
- `path.skip()`：替换后不再遍历已生成的节点（避免死循环/重复处理）

### 3.4 `restoreFunction`：可计算函数求值（eval 辅助）

```js
const restoreFunction = {
    "FunctionDeclaration"(path){
        let {id} = path.node;
        let code = path.toString();
        if (code.indexOf("try") != -1 || code.indexOf("random") != -1 || code.indexOf("Date") != -1) return;  // 副作用/不稳定函数跳过
        eval(code);                                     // 直接执行函数定义，挂到全局
        let scope = path.scope;
        const binding = path.scope.parent.getBinding(id.name);
        if (!binding || binding.constantViolations.length > 0) return;
        for (const refer_path of binding.referencePaths){
            let call_express = refer_path.findParent(p => p.isCallExpression());  // 找到调用点
            let arguments = call_express.get('arguments');
            let args = [];
            arguments.forEach(arg => { args.push(arg.isLiteral()) });   // 参数全字面量？
            if (args.length === 0 || args.indexOf("false") != -1) continue;
            try {
                let value = eval(call_express.toString());   // eval 整段调用，直接拿结果
                if (value !== undefined) {
                    call_express.replaceInline(types.valueToNode(value));
                }
            } catch(e) {}
        }
    }
};
```

**技术要点**：
1. **安全过滤**：函数体含 `try`/`random`/`Date` 直接跳过——有异常分支或结果不稳定（随机数、时间戳）的函数不能静态求值
2. **eval 求值**：直接 `eval(code)` 把函数定义执行进全局，再用 `eval(call_express.toString())` 执行调用拿结果。**逆向场景的实用技巧**——纯函数（输入输出确定）不需要真正理解算法，eval 就是执行器
3. **引用定位调用点**：`refer_path.findParent(p => p.isCallExpression())` 从引用 Identifier 向上找最近的 CallExpression（`v("...")` 这种调用）
4. **参数检查**：所有参数必须是字面量才求值（否则运行时才能确定，静态求值无意义）

### 3.5 `mergeString`：字符串拼接合并

```js
const mergeString = {
    "BinaryExpression"(path) {
        const {confident, value} = path.evaluate();
        confident && path.replaceWith(types.valueToNode(value));
    },
};
```

`"R.EW" + n` 这类拼接在常量传播后变成纯字符串字面量相加，直接求值合并。

### 3.6 `removeSequenceExpression`：删除逗号表达式

```js
const removeSequenceExpression = {
    ExpressionStatement: {
        enter(path){
            let {expression} = path.node;
            if (!types.isSequenceExpression(expression)) return;
            let body = [];
            expression.expressions.forEach(express => {
                body.push(types.ExpressionStatement(express));
            });
            path.replaceInline(body)   // 逗号表达式拆成多条语句
        }
    }
};
```

`i["l"] = true, i["exports"]` → 拆成 `i["l"] = true; i["exports"];`，把压缩代码还原成顺序语句，可读性大幅提升。

### 3.7 `evalPath`：无副作用 CallExpression 直接求值

```js
const evalPath = {
    "CallExpression"(path){
        var node = path.node;
        var code = path.toString();
        if (!node.arguments.length > 0) return;
        if (!types.isLiteral(node.arguments[0])) return;   // 首个参数必须字面量
        if (code.indexOf("try") != -1 || code.indexOf("random") != -1
            || code.indexOf("Date") != -1 || code.indexOf("Math") != -1) return;
        try {
            value = eval("value=" + code);                 // 求值
        } catch(e) {}
        if (value) path.replaceWith(types.valueToNode(value));
    }
};
```

对解密函数调用 `C("㢘ॼॖ৽")` 这类**参数是字面量的调用**，直接 eval 拿到明文，替换整棵 CallExpression。

### 3.8 执行顺序设计（最容易忽略却最关键）

```js
traverse(ast, restoreVar);        // ① 字面量常量传播（s="7" → 传播到位）
traverse(ast, evaluateValue);     // ② 常量折叠（"V58"+s → "V587"）
traverse(ast, restoreArray);      // ③ 数组替换（o[0][3] → 实际元素，key 露出来）
// 重新生成再解析！——注释说：为了不让节点是 falsy
temp_code = generator(ast, {jsescOption: {"minimal": true}}).code;
ast = parser.parse(temp_code);
traverse(ast, restoreFunction);   // ④ 纯函数调用求值（依赖 ②③ 把参数变成字面量）
traverse(ast, mergeString);       // ⑤ 字符串合并
traverse(ast, restoreVar);        // ⑥ 再来一轮常量传播（新产生的字面量变量）
traverse(ast, evalPath);          // ⑦ 解密函数调用求值
traverse(ast, restoreFunction);   // ⑧ 再一轮函数求值（新出现的字面量调用）
traverse(ast, removeSequenceExpression);  // ⑨ 逗号表达式拆分（最后做，不影响求值）
```

**顺序依赖关系（教学重点）**：
- **数组 → 字符串**：解密函数的 key 藏在数组里（`e[20]`），必须先 `restoreArray` 才能拿到 key；但数组元素引用又依赖常量传播简化
- **常量传播 → 求值**：`"V58"+s` 必须先把 `s="7"` 传播掉，`evaluateValue` 才能算出 `"V587"`
- **求值 → 解密**：`C("...")` 的参数要先被 `evaluateValue`/`restoreFunction` 变成字面量，`evalPath` 才能执行
- **多次同 visitor 重复执行**：每轮求值会制造新的字面量（新的可传播常量、新的可求值调用），所以 `restoreVar`、`restoreFunction` 各跑了两轮——**固定点迭代（跑 N 轮直到不再变化）是反混淆的标准做法**
- **中间 generate + parse**：代码字符串变了就重新解析成新 AST。原因：一是遍历器与节点替换存在耦合，重新解析可避免修改冲突；二是注释里说的"为了不让节点是 falsy"——直接操作旧 AST 时，新替换的节点可能无法被后续 visitor 正确处理（如空语句、表达式节点语义变化）

---

## 4. 还原效果对比

| 指标 | 还原前（encode.js / dx.js） | 还原后（decode_1.js / decode_dx.js） |
|------|------|------|
| 加密字符串 | 16 处 `㢘` 类密文 | 1 处残留，几乎全部解密为明文（`exports`、`V587` 出现 25+/50 次） |
| 数组引用 | `e[20]`、`o[0]` 索引引用 | 全部替换为实际元素 |
| 变量名 | 单字母 | 保留（脚本未做重命名，非重点） |
| 逗号表达式 | 大量 `a, b` | 拆分为顺序语句 |
| 可读性 | 无法阅读 | 可直接定位 `https://eventreport.dingxiang-inc.com`、`__webdriver_scr` 等关键逻辑 |
| 可运行性 | 原样可运行 | 还原后仍可在浏览器完美替换运行（作者亲测） |

> 对比结论：还原的目标不是"变成人写的代码"，而是**保留全部语义、抹掉混淆层**，让关键逻辑（上报地址、指纹采集点、检测逻辑）浮出水面。

---

## 5. 该案例的不足与改进空间

作者 README 自述 + 代码观察：

1. **部分 `split("").reverse().join("")` 未替换**：`"stropxe"` → `"exports"` 这类反序模式仍残留（g/d 函数保留）。改进：写一个 visitor 匹配 `split("").reverse().join("")` 调用链，参数是字面量时直接求值。
2. **`(0, xxx)()` 类型未处理**：`this["_sa"]["push"]((0, ...))` 这种逗号表达式作为 callee 的写法，处理后在浏览器无法正常运行——因为 `(0, fn)()` 会改变 `this` 绑定（间接调用），直接简化会破坏运行时语义。**这是很好的教训：反混淆不能只看 AST 静态结构，还要懂 JS 运行时语义**。
3. **未删除无引用函数/变量**：还原后 `v`、`g`、`l`、`c` 等加密函数仍然保留（部分运行时必需，部分已无用）。改进：加 `referenced` 检查删除完全无引用的声明（注意区分——无感验证上报时可能仍需要这些函数加密轨迹，不能一刀切）。
4. **eval 方案的局限**：`eval` 求值依赖本机环境，若函数体引用浏览器对象（`document`、`window`）会抛错被 catch 吞掉，还原不完整。改进：用 jsdom/补环境替代裸 eval，或在 Node 中先补全全局。
5. **依赖 `binding.referencePaths` 的隐藏前提**：如果数组被二次赋值（`o = somethingElse`），`constantViolations` 检查在 restoreArray 中缺失，可能替换错误（本项目恰好未触发）。

---

## 6. 提炼的 AST 学习要点

这个案例浓缩了 AST 反混淆的**通用方法论**，可直接迁移到任何混淆代码：

### 6.1 七个可复用的技术模式

| 模式 | 适用场景 | 关键 API |
|------|---------|---------|
| ① 基于引用的替换 | 数组/变量引用还原 | `scope.getBinding(name)` + `binding.referencePaths` + `replaceInline` |
| ② 字面量常量传播 | 常量变量替换 | `constantViolations.length` 安全检查 + `path.remove()` |
| ③ path.evaluate() 折叠 | 算术/字符串拼接 | `evaluate()` 的 `{confident, value}` + `types.valueToNode()` |
| ④ 纯函数求值 | 解密函数调用还原 | `path.toString()` + `eval` + `findParent(p => p.isCallExpression())` |
| ⑤ 作用域安全护栏 | 一切替换操作 | `binding.constantViolations`、`binding.referencePaths` |
| ⑥ 无副作用调用求值 | 参数全字面量的调用 | 黑名单过滤（try/random/Date/Math）+ eval |
| ⑦ 逗号表达式拆分 | 压缩代码还原 | `isSequenceExpression` + `replaceInline(body)` |

### 6.2 三个方法论原则

1. **按依赖顺序分层处理，而非一把梭**：数组 → 常量 → 求值 → 解密 → 清理。每个 visitor 只做一件事，执行顺序反映数据依赖（key 在数组里，所以先解数组）。
2. **固定点迭代**：求值会制造新字面量，字面量又会触发新求值——同一 visitor 跑多轮（或 while 循环直到无变化）是标准做法，本项目 `restoreVar`/`restoreFunction` 各跑了两轮。
3. **求值安全三问**：能算出吗（confident）？被改过吗（constantViolations）？有副作用吗（try/random/Date/Math 黑名单）？三个问题都通过才替换。

### 6.3 容易踩的坑（本案例实证）

- **重名问题**：基于名字（`node.name`）匹配字符串替换在重名变量处会错位——**必须基于 `scope.getBinding()` 的引用路径替换**
- **falsy 值丢失**：直接操作旧 AST 替换节点可能丢失 falsy 节点（`!1`、`""`、`0`），中间 `generate → parse` 重新解析可规避（`jsescOption: {minimal: true}` 保证 `\uXXXX` 不被转义回明文，维持原语义）
- **运行时语义陷阱**：`(0, fn)()` 是间接调用，改变 `this`——静态化简看似安全实则破坏运行，**修改前想清楚 JS 语义**
- **exit vs enter**：常量折叠必须 exit（子节点先算完，父节点才能算）
- **eval 求值的环境依赖**：函数体引用浏览器对象时 eval 失败——用补环境（jsdom/自建 window）扩展可算范围

### 6.4 反向启示：如何设计混淆

了解反混淆套路后反过来看：顶象的混淆**强度中等**——字符串加密 key 直接写在数组里（未做运行时求值）、函数保持纯净（无状态依赖）便于静态求值。更强的混淆会：
- 把 key 藏到运行时计算（导致静态不可求，只能动态 hook）
- 解密函数内部掺入随机/时间戳（阻断 eval 求值）
- 用 `(0,fn)()`、`fn.call()` 破坏静态分析

---

## 参考资料

- [项目 README（微信公众号原文：JS反混淆｜顶象greenseer一键还原）](https://mp.weixin.qq.com/s?__biz=MzUxMjE3Nzc3Mw==&mid=2247483965&idx=1&sn=001044dc8965d37f84732e6d7607a596)
- 本案例文件：`Work/jsReverse/验证码/某港口登录，DX滑块/study/dingxiangAST-main/`（greenseerAST.js / dx.js / encode.js / decode_*.js）
- [babel-handbook（Path/Scope API 权威参考）](https://github.com/jamiebuilds/babel-handbook)
- 主笔记：[AST学习笔记.md](AST学习笔记.md) 第 6 章「AST 反混淆实战」
