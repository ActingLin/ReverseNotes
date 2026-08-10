// var k = function(n, t) {
//     var r = Date.now().toString()
//         , e = a()(r + "9527" + r.substr(0, 6))
//         , o = t;
//     o || (o = f()().get("next-i18next") || f()().get("language"));
//     var i = {
//         code: e,
//         timestamp: r,
//         platform: "web_pc",
//         v: "0.1.0",
//         mytoken: null !== n && void 0 !== n ? n : f()().get("mytoken_sid")
//     };
//     return o && (i.language = (0,
//     l.m)(o)),
//     i
// }

// var e = a()(r + "9527" + r.substr(0, 6))

// console.log(e); 

//a()是md5摘要算法的一个函数引用,a()("abc")即可调用函数

var CryptoJS = require("crypto-js");


function md5(data) {
    /** MD5 摘要，返回 32 位小写十六进制字符串 */
    return CryptoJS.MD5(data).toString();
}


function get_params() {
    var r = Date.now().toString()
    var e = md5(r + "9527" + r.substr(0, 6))
    // console.log(e); 
    return {
        timestamp: r,
        code: e
    }
}
// console.log(get_params(1)); 

function get_code(pt_time) {
    return md5(pt_time + "9527" + pt_time.substr(0, 6))
}