# jzsc 响应解密 —— 抠代码踩坑记录

## 结论

`g()` 函数逻辑本身没有错（hex → base64 → AES-CBC/Pkcs7 解密，与原代码一致）。
真正的问题是 **AES key 抠错了**：模块内变量 `f` 被二次赋值，函数运行时拿到的是最终值 `Dt8j9wGw%6HbxfFn`，而不是开头初始化时的 `jo8j9wGw%6HbxfFn`。

## 现象

用 `jo8j9wGw%6HbxfFn` 解密接口数据报错：

```
Error: Malformed UTF-8 data
```

即解密结果不是合法 UTF-8，说明 key/iv 与密文不匹配。

## 根因：`f` 被二次赋值（抠代码陷阱）

原 webpack 模块（axios 请求封装，响应拦截器里调用 `g(t.data)`）完整流程：

```js
f = d.a.enc.Utf8.parse("jo8j9wGw%6HbxfFn"),   // 开头赋一次
h = void 0,
m = d.a.enc.Utf8.parse("0123456789ABCDEF");

function g(t) {
    var e = d.a.enc.Hex.parse(t);
    var n = d.a.enc.Base64.stringify(e);
    var a = d.a.AES.decrypt(n, f, {
        iv: m,
        mode: d.a.mode.CBC,
        padding: d.a.pad.Pkcs7
    });
    var r = a.toString(d.a.enc.Utf8);
    return r.toString()
}

var v = function() {
    /* ...axios 封装类定义...
     * response 拦截器: JSON.parse(g(t.data)) */
};

// —— 类定义结束后，f / h 被二次赋值 ——
h = 231012;                                     // 请求头 v 参数
f = d.a.enc.Utf8.parse("Dt8j9wGw%6HbxfFn");     // ← 真正的 key！
var _ = new v;
e["a"] = _;
```

`g` 是闭包，运行时读到的 `f` 是**二次赋值后的最终值 `Dt8j9wGw%6HbxfFn`**。
只抄函数前那一处初始化，就会拿到错误的 `jo8j9wGw%6HbxfFn`。

## 正确参数

| 项目 | 值 |
| --- | --- |
| key | `Dt8j9wGw%6HbxfFn`（16 字节，AES-128） |
| iv  | `0123456789ABCDEF` |
| 模式 | CBC / Pkcs7 |
| 流程 | `Hex.parse(t)` → `Base64.stringify` → `AES.decrypt` → `Utf8` |

## 验证结果

用正确 key 解出接口真实明文：

```json
{"code":200,"data":{"list":[{"RN":16,"QY_ID":"002105291239451340","QY_NAME":"新疆科工矿业设计研究院有限公司",...}]}}
```

## 教训

1. 抠 webpack 代码时，**函数前的变量初始化 ≠ 最终值**。
   要在模块内搜索该变量的**所有赋值**，尤其注意函数/类定义之后有没有二次赋值。
2. `h = void 0` 是障眼法：`h` 末尾被赋 `231012`（请求头 `v: 231012`），
   与 `f` 一起被二次赋值，容易让人忽略 `f` 的改动。
3. 解密报 `Malformed UTF-8 data` 时，优先怀疑 key / iv 不匹配，
   可先验证密文本身（长度、来源）无问题，再逐一对参数。
