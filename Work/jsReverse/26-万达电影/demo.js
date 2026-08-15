const CryptoJS = require("crypto-js");


function md5(data) {
    /** MD5 摘要，返回 32 位小写十六进制字符串 */
    return CryptoJS.MD5(data).toString();
}

var a = "Wanda1_3B3AA12B0145E1982F282BEDD8A3305B89A9811280C0B8CC3A6A60D81022E49031786545971747/movie/coming.api?cityId=290&cinemaId=7121&day=0"

console.log(md5(a)); // d46e5359a8cec512afa5ef65c5fc1ab7

