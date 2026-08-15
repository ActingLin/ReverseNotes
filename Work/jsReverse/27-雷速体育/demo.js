// var e = {
//     "url": "/v1/web/match/common/home_matches",
//     "headers": {
//         "common": {
//             "Accept": "application/json, text/plain, */*"
//         },
//         "delete": {},
//         "get": {},
//         "head": {},
//         "post": {
//             "Content-Type": "application/x-www-form-urlencoded"
//         },
//         "put": {
//             "Content-Type": "application/x-www-form-urlencoded"
//         },
//         "patch": {
//             "Content-Type": "application/x-www-form-urlencoded"
//         }
//     },
//     "baseURL": "https://api-gateway.leisu.com",
//     "transformRequest": [
//         null
//     ],
//     "transformResponse": [
//         null
//     ],
//     "timeout": 30000,
//     "withCredentials": true,
//     "xsrfCookieName": "XSRF-TOKEN",
//     "xsrfHeaderName": "X-XSRF-TOKEN",
//     "maxContentLength": 2097152,
//     "maxBodyLength": 2097152,
//     "method": "get"
// }
//
// var headers = {
//     "common": {
//         "Accept": "application/json, text/plain, */*"
//     },
//     "delete": {},
//     "get": {},
//     "head": {},
//     "post": {
//         "Content-Type": "application/x-www-form-urlencoded"
//     },
//     "put": {
//         "Content-Type": "application/x-www-form-urlencoded"
//     },
//     "patch": {
//         "Content-Type": "application/x-www-form-urlencoded"
//     }
// }
//
// var m = "m_leisu";
// function p_a(e, headers, m){
//
// }
//
// var t = function (b) {
//   if (b && Object.prototype.hasOwnProperty.call(b, "timestamp")) {
//     return b.timestamp;
//   }
//   var c = typeof window == "undefined" ? a : window;
//   return parseInt(new Date() / 1000 + 10 - (c.DEFER || 0));
// }(k);

const CryptoJS = require('crypto-js');
const crypto = require('crypto');

/**
 * 生成加密后的请求头（完全复刻原逻辑）
 * @param {string} url - 请求的 URL（如 "https://api.example.com/test"）
 * @param {object} headers - 原始请求头（如 { "Accept": "application/json" }）
 * @param {string} source - 来源标识（对应原函数的第三个参数 j）
 * @param {object} options - 可选参数 { timestamp, uuid }
 * @returns {object} 新的请求头（已包含加密后的 Accept）
 */
function buildSignedHeaders(url, headers = {}, source = '', options = {}) {
    // 1. 生成时间戳 (秒级 + 10偏移)
    const timestamp = options.timestamp || Math.floor(Date.now() / 1000) + 10;

    // 2. 生成 UUID (去掉横线)
    const uuid = options.uuid || crypto.randomUUID().replace(/-/g, '');

    // 3. 确定 source (优先从 headers 中取)
    const finalSource = headers['source'] || source || '';

    // 4. 构造原始签名串 (固定盐值)
    const salt = "uHhANonwd4UdpzOdsUqUsnl5PjurM877";
    const rawString = `${url}-${timestamp}-${uuid}-0-${salt}`;

    // 5. 计算 MD5 并组装 auth_data
    const md5Hash = CryptoJS.MD5(rawString).toString(); // 默认输出 hex
    const authData = `${timestamp}-${uuid}-0-${md5Hash}`;

    // 6. 组装 JSON 载荷
    const payload = JSON.stringify({ auth_data: authData, source: finalSource });

    // 7. AES-ECB 加密 (密钥固定)
    const key = CryptoJS.enc.Utf8.parse("kw@h*8gCIn$8X#df");
    const encrypted = CryptoJS.AES.encrypt(payload, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    encrypted.toString() // 得到第一层 Base64 密文

    // 8. 二次 Base64 编码 (将第一次的 Base64 字符串当作字节再编码一次)
    const firstBase64 = encrypted.toString();
    const doubleBase64 = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Base64.parse(firstBase64)
    );

    // 9. 处理 Accept 头：取原值中 ";;" 前的部分，拼上二次编码
    let originalAccept = headers['accept'] || headers['Accept'] || "application/json, text/plain, */*";
    const baseAccept = originalAccept.split(';;')[0];

    // 10. 构建新 Headers (删除旧的小写 accept，设置大写 Accept)
    const newHeaders = { ...headers };
    delete newHeaders['accept'];
    delete newHeaders['Accept'];
    newHeaders['Accept'] = `${baseAccept};;${doubleBase64}`;

    return newHeaders;
}

// ============ 使用示例 ============
// const url = "https://httpbin.org/post";
// const originalHeaders = {
//     "Content-Type": "application/json",
//     "Accept": "application/json, text/plain, */*"
// };

var e = {
    "url": "/v1/web/match/common/home_matches",
    "headers": {
        "common": {
            "Accept": "application/json, text/plain, */*"
        },
        "delete": {},
        "get": {},
        "head": {},
        "post": {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        "put": {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        "patch": {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    },
    "baseURL": "https://api-gateway.leisu.com",
    "transformRequest": [
        null
    ],
    "transformResponse": [
        null
    ],
    "timeout": 30000,
    "withCredentials": true,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": 2097152,
    "maxBodyLength": 2097152,
    "method": "get"
}

var headers = {
    "common": {
        "Accept": "application/json, text/plain, */*"
    },
    "delete": {},
    "get": {},
    "head": {},
    "post": {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    "put": {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    "patch": {
        "Content-Type": "application/x-www-form-urlencoded"
    }
}

var m = "m_leisu";

// const signedHeaders = buildSignedHeaders(e['url'], headers['common'], m);
//
// console.log("生成的请求头:");
// console.log(signedHeaders);
// 输出示例: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain, */*;;NjM4...' }
// var a = "m_BpRmoVCveGQryB4IVVry9o8hR_hA86-jJZ_BBCTVYFzR1hJngs7fMyVSoPSN9tUWGZvpBDdQjhde_d4MS5WNELELDA_f0NXTLjb5JNMKuOzDazttRr3Q6Mawt7bBlGCNacA6PVCHd5Yo_9N-1AIJbyUitgiYFNGmXAaSHvNpI";
// var b = 'm/BpRmoVCveGQryB4IVVr8nFpQxMYgnDoCgWUX6VrmCjnmKCWTr9eLUScJnEaKShwuHyLvo7+DELpU+dRcRB60CmFsugyZRBaRlQ93QOn3tdn/m5rj90pKPcfzJiLMrIe+vG7Sg3KT9/b0qZtHEuSW49jkO5RcZ0HjSml8OvRHw='