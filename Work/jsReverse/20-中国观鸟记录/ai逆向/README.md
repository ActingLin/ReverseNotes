# 中国观鸟记录中心 · 活动记录收集器

浏览器无关的纯 Python 协议收集器，逆向自 `https://www.birdreport.cn/home/activity/page.html`。

## 逆向结论

| 部件 | 来源 | 还原结果 |
|---|---|---|
| 请求体 form | `jqueryAjax.js` `$.ajaxSetup.beforeSend` | `JSON.stringify(sort_ASCII(dataTojson(form)))` 后经 **RSA-1024 PKCS1v1.5** 分块加密（117 字节/块，`hex2b64` 12bit 分组编码） |
| 请求头 `sign` | 同上 | `MD5(明文JSON + requestId + timestamp)`，小写 32 hex |
| 请求头 `requestId` | 同上 `getUuid()` | 32 位随机 hex，`s[14]='4'`，`s[19]=(s[19]&3)|8` |
| 请求头 `timestamp` | 同上 | `Date.parse(new Date)` 毫秒时间戳 |
| 响应体 `data` | `aes.util.js` `BIRDREPORT_APIJS.decode` | **AES-256-CBC / PKCS7**，key=`C8EB5514AF5ADDB94B2207B08C66601C`，iv=`55DD79C6F04E1A67`，base64 密文 |

> 注意：aes.util.js 的 `getMapping` 是把 2 位 hex 对按**十进制** `String.fromCharCode(pair)` 转字节，不是十六进制。混淆数组旋转次数为 272（`while(--count)` 先自减，`0x111`→272 次）。

## 目录

```
中国观鸟记录/
├── analysis/            # 逆向分析笔记
├── collector/
│   ├── config.py        # 授权门 / 预算 / 业务配置
│   ├── crypto.py        # RSA encryptLong / AES decode / sign / requestId 原语
│   ├── protocol.py      # 请求头与 body 编排
│   ├── collector.py     # 搜索 + 分页 + 重试 + 持久化
│   └── main.py          # CLI 入口
├── js_reverse_cache/    # 侦察素材 (下载的 JS、页面、抓包样本) — gitignore 关键样本
├── tests/               # 固定输入离线自检
├── requirements.txt
└── README.md
```

## 使用

```bash
pip install -r requirements.txt

# 无参数直接运行 (默认: 抓 2 页, 输出到项目根 output/records.csv)
cd collector && python main.py

# 或从项目根目录
python -m collector.main
```

### 参数（均有默认值，仅按需覆盖）

- `--dry-run`：只校验配置并预览，不发送真实流量（默认会真实请求）
- `--where`：搜索条件，逗号分隔，如 `username=liuqin127,pointName=北川水湾`
- `--sort-by / --order-by`：排序字段与 `asc|desc`
- `--page-size`：20 或 50（服务端 limits 限制）
- `--max-pages`：默认 2；`0`=全部
- `--start-page`：默认 1
- `--output`：默认 `<项目根>/output`（从 collector/ 目录运行时即 `../output`）
- `--format`：默认 `csv`（UTF-8 BOM，Excel 友好）；可选 `json`（UTF-8）

## 授权与约束

- 授权依据：`public-unauthenticated`，仅只读查询公开活动列表
- 域名白名单：`api.birdreport.cn/front/activity/*`
- 请求预算：`config.TOTAL_REQUEST_BUDGET` 共享于重试/分页；`code=505/405` 视为风控触发并终止
- 幂等只读请求支持指数退避重试（抖动），不重试变更类请求
- 输出仅在显式目录写入，重复运行覆盖前请自备备份

## 测试

```bash
python -m pytest tests/ -v        # 或
python tests/test_crypto.py
```

覆盖：requestId 格式、无空格 JSON、捕获样本 sign 固定输入校验、`hex2b64` 已知向量、真实 AES 样本解密、RSA body 形状。

## 侦察素材

- `js_reverse_cache/page.html`：目标页面
- `js_reverse_cache/assets_js_jqueryAjax.js`：含 JSEncrypt + beforeSend 签名逻辑
- `js_reverse_cache/assets_js_aes.util.js`：混淆的 AES 封装 `BIRDREPORT_APIJS`
- `js_reverse_cache/last_cipher.txt`：真实响应 AES 密文样本（测试用，gitignore）
