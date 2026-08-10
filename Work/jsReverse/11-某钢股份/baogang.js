var CryptoJs = require('crypto-js')

function l(e) {
    for (var n = [], t = Array.of("0", "1", "2", "3", "4", "5", "6", "7", "8", "9"), a = 0; a < e; a++) {
        var c = Math.floor(10 * Math.random());
        n[a] = t[c]
    }
    return n.join("")
}

function s() {
    return parseInt((new Date).getTime() / 1e3)
}

var n = l(10)
var t = s();
var o = "0/56f5cff3cad14853a44782c2c689ab2a";
var i = "13ade1de1eff43ffb821735f352a4148";


headers = {}
headers["x-user"] = o;
headers["x-nonce"] = n;
headers["x-date"] = t;

function x_headers_info(pageNo){
    data = {
        "pageNo": pageNo,
        "pageSize": 12,
        "condition": {
            "nodeId": 436
        }
    }
    var a = CryptoJs.MD5(JSON.stringify(data)).toString()

    headers["Content-Md5"] = a;
    var c = "".concat("POST", "\n").concat("/v1/web/api/content/list?domainId=12", "\nx-user:").concat(o, "\nx-nonce:").concat(n, "\nx-date:").concat(t, "\nContent-Md5:").concat(a, "\n");
    headers["x-signature"] = CryptoJs.HmacSHA1(c, i).toString().toUpperCase();
    return headers;
}

// console.log(x_headers_info(3))