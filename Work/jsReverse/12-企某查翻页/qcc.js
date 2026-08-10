var CryptoJs = require('crypto-js')

var headers = {}

function encode_HmacSha512(data ,key) {
    return CryptoJs.HmacSHA512(data, key).toString();
}

var a_default = {
    "n": 20,
    "codes": {
        "0": "W",
        "1": "l",
        "2": "k",
        "3": "B",
        "4": "Q",
        "5": "g",
        "6": "f",
        "7": "i",
        "8": "i",
        "9": "r",
        "10": "v",
        "11": "6",
        "12": "A",
        "13": "K",
        "14": "N",
        "15": "k",
        "16": "4",
        "17": "L",
        "18": "1",
        "19": "8"
    }
}

var o_default = function() {
    for (var e = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "/").toLowerCase(), t = e + e, n = "", i = 0; i < t.length; ++i) {
        var o = t[i].charCodeAt() % a_default.n;
        n += a_default.codes[o]
    }
    return n
}

var get_key = function() {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
      , t = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "/").toLowerCase()
      , n = JSON.stringify(e).toLowerCase();
    return encode_HmacSha512(t + n, o_default(t)).toLowerCase().substr(8, 20)
}

var get_value = function() {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
      , t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : ""
      , n = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "/").toLowerCase()
      , i = JSON.stringify(e).toLowerCase();
    return encode_HmacSha512(n + "pathString" + i + t, o_default(n))
}

// var window = {}

function get_headers_info(data, tid) {
    var t = "/api/search/searchmulti";

    var i = get_key(t, data);
    // console.log(i);

    var u = get_value(t, data, tid); // window.tid = '43adbb3910f063ee7539929b12be2a63'
    // console.log(u)

    var headers = {};
    headers['key'] = i;
    headers['value'] = u;
    headers[i] = u;

    return headers
}

// 直接 Node.js 运行时用这个
// var test_data = {
//     "searchKey": "小米",
//     "pageIndex": 2,
//     "pageSize": 20
// }
// console.log(get_headers_info(test_data, '43adbb3910f063ee7539929b12be2a63'))