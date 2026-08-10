# 中国观鸟记录中心 · 协议还原笔记

- 日期: 2026-08-09
- 目标页面: https://www.birdreport.cn/home/activity/page.html
- 接口: POST https://api.birdreport.cn/front/activity/search

## 1. 请求路径

页面 `page.html` 用 layui table 渲染，`url: site.domain + 'front/activity/search'`，method POST。
`site.domain` = `https://api.birdreport.cn/`（site.js）。

## 2. 真实请求（浏览器捕获）

```
POST https://api.birdreport.cn/front/activity/search
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
timestamp: 1786260833000
requestId: e3225a2d213242480c280082aeecb1bc
sign: 7ed580df1d694f677656f1dc5ee3c5e6
Body: (RSA 加密后的 base64 字符串, 直接作为 urlencoded body)
```

## 3. 请求头加密逻辑 (jqueryAjax.js 尾部, $.ajaxSetup.beforeSend)

```js
var timestamp = Date.parse(new Date);                 // 毫秒
var requestId = getUuid();                            // 32 hex 伪 uuid
var data = JSON.stringify(sort_ASCII(dataTojson(options.data || "{}")));
options.data = encrypt.encryptLong(data);             // RSA 加密
var sign = MD5(data + requestId + timestamp);         // 明文 data 参与签名
xhr.setRequestHeader("timestamp", timestamp);
xhr.setRequestHeader("requestId", requestId);
xhr.setRequestHeader("sign", sign);
```

- `dataTojson`: `"page=1&limit=20"` → `{page:'1', limit:'20'}`
- `sort_ASCII`: 按键名升序
- `JSON.stringify` 无空格 → 初始页明文为 `{"limit":"20","page":"1"}`
- **验证点**: `MD5('{"limit":"20","page":"1"}' + 'e3225a2d213242480c280082aeecb1bc' + '1786260833000') == 7ed580df1d694f677656f1dc5ee3c5e6` ✅

### getUuid()
```js
s[14]="4";
s[19]=hexDigits[s[19]&3|8];
s[8]=s[13]=s[18]=s[23];
```

### RSA encryptLong (JSEncrypt)
- 公钥: 1024-bit SPKI DER (paramPublicKey)
- 分块: `(n.bitLength()+7>>3) - 11` = 117 字节/块
- 每块 PKCS1v1.5 (block type 2) 加密 → BigInteger.toString(16)（去前导0，补偶长度）
- 全部块 hex 拼接 → `hex2b64`（3 hex=2 base64 的 12bit 分组，非标准 base64）→ 直接作 body

## 4. 响应解密 (aes.util.js, BIRDREPORT_APIJS.decode)

```js
resp.data 为 base64 密文; 明文 = AES.decrypt(data, key, {iv, mode: CBC, padding: Pkcs7}).toString(Utf8)
```

- 混淆数组 `_0x1e7a` 旋转 272 次（`while(--count)` 先自减，实参 0x111）
- 构造器: `this.key = _0x1b50('0x4b')`，`this.iv = _0x1b50('0x43')`
  - key_hex = `6756696653534952657053656868665752665050485566485667545454484967`
  - iv_hex  = `53536868555767547048526949655455`
- `getMapping(hex)`: 逐对 `String.fromCharCode(parseInt(pair, 10))` —— **十进制**，非十六进制！
  - key → `C8EB5514AF5ADDB94B2207B08C66601C` (32B)
  - iv  → `55DD79C6F04E1A67` (16B)
- 浏览器 hook `CryptoJS.enc.Utf8.parse` 确认上述字节序 ✅

## 5. 其他陷阱

- Python `json.dumps` 默认带空格，必须 `separators=(',', ':')` 才能与 JS `JSON.stringify` 一致，否则 sign 全错。
- 服务端返回密文可能缺 base64 padding，解码前补 `=`。
- 分页参数 layui 发送 `page`/`limit`；排序在 `where` 里发 `sortBy`/`orderBy`。
