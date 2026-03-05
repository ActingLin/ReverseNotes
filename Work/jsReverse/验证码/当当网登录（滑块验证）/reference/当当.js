const CryptoJS = require('crypto-js');
var  U = CryptoJS.enc.Utf8.parse("0102030405060708")
, Y = function(t, e) {
    e = CryptoJS.enc.Utf8.parse(e);
    var n = CryptoJS.enc.Utf8.parse(t);
    return CryptoJS.AES.encrypt(n, e, {
        iv: U
    }).toString()
}
,L = function(t) {
    var e = CryptoJS.enc.Base64.parse(t)
      , n = e.toString(CryptoJS.enc.Utf8);
    return n
};
function data1(param,rankey){
    var a = param,
        keys = Object.keys(a);
    var r = "";
    for(var index in keys){
        r += keys[index] + "=" + a[keys[index]];
        if(index != keys.length - 1){
            r += "&";
        }
    }
    r = decodeURIComponent(r);
    r = CryptoJS.MD5(r).toString();
    a["sign"] = Y(r,rankey);
    return a;
}
console.log(data1({'autokey': 'off', 'check_code': 't8a7tL6r9v', 'check_code_type': '1', 'ct': 'pc', 'password': 'T4OisjI0Qr8F5RqeQ2pqFw==', 'permanent_id': '20231020220718452376655418332264106', 'requestId': '2312132344101000k18vqC_0254', 't': '1702482256816', 'token': 'b79587a04dc3449ca011dfbad79f70bb', 'username': '15869854143'},""))
console.log(Y("703b96c8b80ca0c26a06fde56664a9c8",""))