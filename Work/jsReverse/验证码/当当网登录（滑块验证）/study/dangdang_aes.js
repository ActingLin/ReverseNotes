const CryptoJS = require("crypto-js");
/*
* 调用 CryptoJS.AES.encrypt(message, key, config) 时，如果传入的 key 是一个字符串（如这里的空字符串 ""），
* CryptoJS 并不会直接将这个字符串作为原始密钥字节。相反，它会使用一个内置的算法（通常是 EVP_BytesToKey 或类似的方法）
* 将这个字符串派生成一个符合AES算法要求长度的密钥（例如AES-256需要32字节）
* */
var U = CryptoJS.enc.Utf8.parse("0102030405060708")
  , Y = function(t, e) {
    e = CryptoJS.enc.Utf8.parse(e);
    var n = CryptoJS.enc.Utf8.parse(t);
    return CryptoJS.AES.encrypt(n, e, {
        iv: U
    }).toString()
}
  , J = function(t) {
    return CryptoJS.MD5(t).toString()
}
  , L = function(t) {
    var e = CryptoJS.enc.Base64.parse(t)
      , n = e.toString(CryptoJS.enc.Utf8);
    return n
};

function addSign(n, t=""){
    var a = {};
    // 值存在且不为 0, null, undefined, false, "" (空字符串), NaN 等
    Object.keys(n).sort().map((function(t) {
        ("sign" != t && n[t] || 0 === n[t]) && (a[t] = n[t])
    }
    ));
    // var r = N.a.stringify(a);
    // return r = decodeURIComponent(r),
    // console.log("按字母顺序排序前:\n", n)
    // console.log("按字母顺序排序后:\n", a);

    // 拼接
    // 1. 获取所有的键
    const keys = Object.keys(a);
    // 2. 将每个键值对映射为 "key=value" 的字符串
    const pairs = keys.map(key => `${key}=${a[key]}`);
    // 3. 用 "&" 符号连接所有字符串
    const queryString = pairs.join('&');
    // console.log("拼接", queryString);

    queryString_md5 = CryptoJS.MD5(queryString).toString();
    var sign = Y(queryString_md5, t);
    a["sign"] = sign;
    // console.log("params:\n", a);
    return a
}

var data = {t: 1772617474059, ct: 'pc', permanent_id: '20260304151407338124938566670200020', requestId: ''}
var sign = addSign(data);
console.log("addSign:",sign)
// K7qjMSN2xBIc0NFtJ1C3JS0sBBzvl2xaFkazLbU+vFuDA30vuMO+GNPQhEivho1L
