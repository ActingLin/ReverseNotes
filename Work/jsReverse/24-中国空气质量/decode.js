var CryptoJS = require('crypto-js');

function str2rstr_utf8(input) {
    var output = "";
    var i = -1;
    var x, y;
    while (++i < input.length) {
        x = input.charCodeAt(i);
        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
            x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
            i++
        }
        if (x <= 0x7F)
            output += String.fromCharCode(x);
        else if (x <= 0x7FF)
            output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
        else if (x <= 0xFFFF)
            output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
        else if (x <= 0x1FFFFF)
            output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F))
    }
    return output
}
function safe_add(a, b) {
    var c = (65535 & a) + (65535 & b)
      , d = (a >> 16) + (b >> 16) + (c >> 16);
    return d << 16 | 65535 & c
}
function bit_rol(a, b) {
    return a << b | a >>> 32 - b
}
function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
}
function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
}
function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
}
function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t)
}
function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
}
function rstr2binl(input) {
    var output = Array(input.length >> 2);
    for (var i = 0; i < output.length; i++)
        output[i] = 0;
    for (var i = 0; i < input.length * 8; i += 8)
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
    return output
}
function binl2rstr(input) {
    var output = "";
    for (var i = 0; i < input.length * 32; i += 8)
        output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
    return output
}
function binl_md5(x, len) {
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd)
    }
    return Array(a, b, c, d)
}
function rstr_md5(s) {
    return binl2rstr(binl_md5(rstr2binl(s), s.length * 8))
}
function rstr2hex(input) {
    try {
        hexcase
    } catch (e) {
        hexcase = 0
    }
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var output = "";
    var x;
    for (var i = 0; i < input.length; i++) {
        x = input.charCodeAt(i);
        output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F)
    }
    return output
}
function hex_md5(s) {
    return rstr2hex(rstr_md5(str2rstr_utf8(s)))
}
function osZ34YC04S(obj){
    var newObject = {};
    Object.keys(obj).sort().map(function(key){
        newObject[key] = obj[key];
    });
    return newObject;
}

function Base64() {
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    this.encode = function(a) {
        var c, d, e, f, g, h, i, b = "", j = 0;
        for (a = _utf8_encode(a); j < a.length; )
            c = a.charCodeAt(j++),
            d = a.charCodeAt(j++),
            e = a.charCodeAt(j++),
            f = c >> 2,
            g = (3 & c) << 4 | d >> 4,
            h = (15 & d) << 2 | e >> 6,
            i = 63 & e,
            isNaN(d) ? h = i = 64 : isNaN(e) && (i = 64),
            b = b + _keyStr.charAt(f) + _keyStr.charAt(g) + _keyStr.charAt(h) + _keyStr.charAt(i);
        return b
    }
    ,
    this.decode = function(a) {
        var c, d, e, f, g, h, i, b = "", j = 0;
        for (a = a.replace(/[^A-Za-z0-9\+\/\=]/g, ""); j < a.length; )
            f = _keyStr.indexOf(a.charAt(j++)),
            g = _keyStr.indexOf(a.charAt(j++)),
            h = _keyStr.indexOf(a.charAt(j++)),
            i = _keyStr.indexOf(a.charAt(j++)),
            c = f << 2 | g >> 4,
            d = (15 & g) << 4 | h >> 2,
            e = (3 & h) << 6 | i,
            b += String.fromCharCode(c),
            64 != h && (b += String.fromCharCode(d)),
            64 != i && (b += String.fromCharCode(e));
        return b = _utf8_decode(b)
    }
    ,
    _utf8_encode = function(a) {
        var b, c, d;
        for (a = a.replace(/\r\n/g, "\n"),
        b = "",
        c = 0; c < a.length; c++)
            d = a.charCodeAt(c),
            128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(192 | d >> 6),
            b += String.fromCharCode(128 | 63 & d)) : (b += String.fromCharCode(224 | d >> 12),
            b += String.fromCharCode(128 | 63 & d >> 6),
            b += String.fromCharCode(128 | 63 & d));
        return b
    }
    ,
    _utf8_decode = function(a) {
        for (var b = "", c = 0, d = c1 = c2 = 0; c < a.length; )
            d = a.charCodeAt(c),
            128 > d ? (b += String.fromCharCode(d),
            c++) : d > 191 && 224 > d ? (c2 = a.charCodeAt(c + 1),
            b += String.fromCharCode((31 & d) << 6 | 63 & c2),
            c += 2) : (c2 = a.charCodeAt(c + 1),
            c3 = a.charCodeAt(c + 2),
            b += String.fromCharCode((15 & d) << 12 | (63 & c2) << 6 | 63 & c3),
            c += 3);
        return b
    }
}
var BASE64 = {
    encrypt: function(text) {
        var b = new Base64();
        return b.encode(text);
    },
    decrypt: function(text) {
        var b = new Base64();
        return b.decode(text);
    }
};
const  acky6QolJSJi = "dLRSzDrm8xkryEyL";//AESkey，可自定义
const  acixHVhiNqmK = "fex6AA4zRfVrSPmr";//密钥偏移量IV，可自定义
var AES = {
  encrypt: function(text, key, iv) {
    var secretkey = (CryptoJS.MD5(key).toString()).substr(16, 16);
    var secretiv = (CryptoJS.MD5(iv).toString()).substr(0, 16);
    // console.log('real key:', secretkey);
    // console.log('real iv:', secretiv);
    secretkey = CryptoJS.enc.Utf8.parse(secretkey);
    secretiv = CryptoJS.enc.Utf8.parse(secretiv);
    var result = CryptoJS.AES.encrypt(text, secretkey, {
      iv: secretiv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return result.toString();
  },
  decrypt: function(text, key, iv) {
    var secretkey = (CryptoJS.MD5(key).toString()).substr(16, 16);
    var secretiv = (CryptoJS.MD5(iv).toString()).substr(0, 16);
    secretkey = CryptoJS.enc.Utf8.parse(secretkey);
    secretiv = CryptoJS.enc.Utf8.parse(secretiv);
    var result = CryptoJS.AES.decrypt(text, secretkey, {
      iv: secretiv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return result.toString(CryptoJS.enc.Utf8);
  }
};
function get_hA4Nse2cT(m0fhOhhGL, oNLhNQ){
    var aMFs = '3c9208efcfb2f5b843eec8d96de6d48a';
    var cVWG2 = 'WEB';
    var t5GECZQ = new Date().getTime();

    var pKmSFk8 = {
      appId: aMFs,
      method: m0fhOhhGL,
      timestamp: t5GECZQ,
      clienttype: cVWG2,
      object: oNLhNQ,
      secret: hex_md5(aMFs + m0fhOhhGL + t5GECZQ + cVWG2 + JSON.stringify(osZ34YC04S(oNLhNQ)))
    };
    pKmSFk8 = BASE64.encrypt(JSON.stringify(pKmSFk8));
    pKmSFk8 = AES.encrypt(pKmSFk8, acky6QolJSJi, acixHVhiNqmK);
    return pKmSFk8;
}

// var data1 = 'GETDAYDATA';
// var data2 = {
//     "city": "长沙",
//     "month": "201610"
// }
// console.log(get_hA4Nse2cT(data1, data2));

const  dskQCqpdBOGo = "hEaIOlrX7tlhAOkz";//DESkey，可自定义
const  dsiqYiQHbZQp = "xMBwDXG1HOubUV04";//密钥偏移量IV，可自定义
const  ask4u6FbhGV8 = "a0QHmC1Ova5958nC";//AESkey，可自定义
const  asi2hhkBUJbo = "bMu71lHRX6bRmPxU";//密钥偏移量IV，可自定义
var DES = {
 encrypt: function(text, key, iv){
    var secretkey = (CryptoJS.MD5(key).toString()).substr(0, 16);
    var secretiv = (CryptoJS.MD5(iv).toString()).substr(24, 8);
    secretkey = CryptoJS.enc.Utf8.parse(secretkey);
    secretiv = CryptoJS.enc.Utf8.parse(secretiv);
    var result = CryptoJS.DES.encrypt(text, secretkey, {
      iv: secretiv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return result.toString();
 },
 decrypt: function(text, key, iv){
    var secretkey = (CryptoJS.MD5(key).toString()).substr(0, 16);
    var secretiv = (CryptoJS.MD5(iv).toString()).substr(24, 8);
    secretkey = CryptoJS.enc.Utf8.parse(secretkey);
    secretiv = CryptoJS.enc.Utf8.parse(secretiv);
    var result = CryptoJS.DES.decrypt(text, secretkey, {
      iv: secretiv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return result.toString(CryptoJS.enc.Utf8);
  }
};
function decode_resp(data) {
    data = BASE64.decrypt(data);
    data = DES.decrypt(data, dskQCqpdBOGo, dsiqYiQHbZQp);
    data = AES.decrypt(data, ask4u6FbhGV8, asi2hhkBUJbo);
    data = BASE64.decrypt(data);
    return data;
}

console.log(decode_resp("ckFDTTBNU3ZQdEk4RkUzamQzTllxSlV1SVhVQk05N2U1ZzdxL1B5cmtWdUttM3pCRCtLZGc2T0JTR1ZWYXlqbUZJQUNaV3N3eWs0clNTLzBUdmZGU3BreDN1ZnRkS3JTR214N2k3dUJzUXpWRGdwWDFxUDZiMnBBQmF4ekhKUVBKdzZ3MU4yOG9Kdnp3NlZQRkYvbGRNUWdmZGRmOGM0S25aM3dNRFc3eEo3NnJzQUZaNC9GVTUzN1M5NVFMcSsvWEd1SzRHeHB6VnBiWTJFcnRLR3k1TktEMy9yaXRqMitpMnJJcXhzeDlaM3lESm5EMU1TTS9uQ2pMVkNJNkFCQkNjOXg0NFFVSGFJeUF6RjVVUXh3T0lVR0Q0NUpsUVBNTTh3czdYK3BQbzFvWnN0bzNBOTdIWEtRQ2IrZG1MaThSbTJEeUdyT2E0U21sNmhMQ2RBcE41V05OdytvRGNZZ0NSdGVnM2x6SUpFQXI5U0djRHZiT2t5NXduWGt0S1d2QVFKb25sa2pOdXJJTnVLOUh6eWVSZGhLWmpNSnQxNzFSL3o2bFJsaTA0M0NsYVRhMDMwQVVSc2lsaVp3REQ0VXI1WXdXWjMwYXErTzd3aGlBWTllUVYwUHh3azNyRGFpK0hOQjg5c2tVUjJIWFh2OEt6NUd4MWc1VzFQYjFNL2dwT0QxaS95Q3RhTFVuZ05uWVpLWTdFSHVSbUw3Q1drVzZhUTFTMDhWOEFKZlRYbWJRdnRyajJsY3JOLzROSENPRm56TEtWQldiZVhzcS95SkYzblNHcm02Q1huckorVDIzb29WRlkzR3l2bUxsT0g4QlVycDV4VzV3b1VMcjNvRmw5anN4Y2JyZThWQmVjNHU5Q3o5MXlSQ2JlNVIwOUlEcGtQd2c4SWJ5MG84ait5QTlMNk13czNvS0Z4bG5DQWYzbHBIcUI2TVgxeFJNS01MaWJxdHFvTW9IMGhmVzJLUUVvSENmVFdGOGtndDhpSkJEQlpraGZBZEVuNlVvTmJySCtvejZuTXoyY3o3b1pkcUZ5eDJsemNIMUNsSFdJby8wZDEwLzlzT1l2SmJ1UEdRaVJKUERTMGcrTTAvL0prS1Zrck9DUy9nZng3Y1U5MEp1bWUwdVlRU2k2Y1BQMGFXUXhHNTZpSmtRQXZFMWpDTVM0ZTJ4dnZwVDMvYi9YTFdVWWRsNXBDSnVtTzFmZ1h0enFHV2pFMGZnVDlxZ09pSWk4S3BDNEFabEZibUR2QXY2TWVYMXFXN1pYWWhaOGxwVnhzbzVPY1MzWHNsSjdVaytqQmdrK1BweEI5WXoxVXN1bUFBSVFVcVVQYjl5UHZiMkdyVCs2c3poVy9FYkJrNmp4RFVJVWFNMWUyVnFXNGJJRWQ2ME9UU1JoRUNTa1B3VzN1VFhqaUdXbFBxUGtDRCtvWlVzVFNpMW1maTdhTDg3TTFyNG9CSklzWll0eUE2U2h0MXJhTVllZ2Y0cGtHSjFCR1dOOHRUVnZmanZGTzQzTWxEOGgyNFFSd0FyemlGekFOK2paNnFnNW5LWjVRQ3hMd1dyOWlaL01Gak1lL0FGdXl6bk9aTHJBYWVQckJlWllHeHludTQxZGFoemhOZUpOWnhhTzhCV0FmOWVwZlRSMHdQOUR0TTA0K0RrRHhvMmVzWVRzUjNqUnpKM2Y1R3BWeW1iWEt3bFE4YmZlZ0pTOGhMWkFYVG5LNldETkJ5ZXhrV3puOFk5emU0cFpqZkRWRERjZHl6UHRlcWpIbVNqTTE0TzlUdFJEMS93NjNqa0JIOG1qRnpMOHNweG0xY2hmejhZc1pxdjBHWEdGMDJKNGR0Y0ZtN3Y0RGFTaXZ1SWJnK1NPblo4b1BjZlBURW1QSmlSakswNmJaejZNdUxtYjJ3NlAxNkswNmJKa0lyRXlrRmpIVG8veWxkeGdCS2VnRXE3bUc5cTRPdkFRRDFCRjd6WXVaVnN0emUwRWRpWDFmVmhvOUZjQ215STJ6bFl4THlwZzNSR3BFZ0U3ZlBsd3llMHg5ckxzRTJLZjN2Ui9OdW9PdlErUUNsQlNZZ2cwYVRtdjBkb3A0b2VtOUtBUFRSN3p0QlVISGJ2bm9YYzhlTmdTdTRlUVRhcWdBMTM5T1VEbC9FUWRmNTY1alNMYjdudzdPNEdDSTJZWVJZMzFSZ1lIeEJLOTI2aEgxTFVqck1ERnNHTmJ2L2J3RHZLZVo4TmZrc3NqVFVEcVYwa2hmL2hjODZoWEI1L1pEZ3dnYTFITWhyVmRvVUU2aHBxcU1kTjNoNEEwbXYzMGh0ZjB2b0NjUk1jcVNjckJoZVlyMzYzNUR5eERoZjFYOW4wMTN4T1AwSlF2VWthR1BLUmdXVk9nSDVTa3lSK1VBblZpdWNaQmg5SWxpS254eHZWcjFFNGdTdmdIL2hXOWkrVG5UUmZEWVBqNG1DbWVKbWZRVU1FRHhaSEtodUxXaFdIYXBKMkJzeWNuWFRES1JmcVJlekEzdm5tYjF2SnR5Vmo4VTA0U3M3d0c4Rk9vQ2pXY3g2bnlXWnhoWm1TaUxqc1lXN2pBa1ZCbzJRTTVXQkwremdKNGFZVWtQVmRleWVjQ0hub0g2bDc0NHVwVGx2TGF1a013bFB6RHhwNDNJUzdCT3htUHVqOVJYTVJUcm9KbW1hdjdQeGwvYk5RYTB0MEpZdU1kU0l0UURqMndibkllOElnQnJnNnMxek1OWnQ0QnhmR0ZQQ2FublBWRXhNb1E5Z2xrbjBBSE01Sk5rUENyNVNDSXRoSitFUTRER3hMNmQ2cFFUc1RTdkpTTUtZeHBNSDhOK25IbXJmNWVBcEVlaW1rem1Sd2pZSU9FTTZPeVJ6U0NwUmhJaThZcU1rTTJodVJhbkNoUG5MUEdMQWxKYllGYVVDSnVWY3ZIZGJQTThYUnJraHVTQzBRZFBDVjZnSnBvNHJ4dUZPUThuS3ZYMzNyRmRsb3l4ZVBqYjFSS3UxbzByRVpsaGlLUytUR0doTzJYcHdKZGxQTFRzeFdPME5tTGVneHFsYlhhNFREVzNjY3BKYXhMSm4rL1JQdjdMZ0NIelA2a2RFNEZqYTlhK2J5Tm5YNm9uUUJKd1YrVVNRb0M3N0lLY2xyUUxyUjFsdUN6ckpvdEdCazZvV2ZqSVdQUnJDUk9STFROeGNCZ0JMZTQvcjlDZEZJTFkyK0tyeUgvNjZadTFlT2dUNjRicW05V3BVdjlOTGRFZUd3NlBPcGZTT3A4emYzTGVxY0IrK25ydEVhSXR0SVZqZllZYTFFOFFMYUdvUjhvZnhTWm1sZ3dya2NUMkJncUFXbm5CZUpmNGtnVjRndkw4QmxOaVpkUEZoL3Bwd29ad2tMb1Y4STVsZ3ZPTEZOVGJWajFVdnoya2dvcXo2NUtBRlFpaU5lbTk1T0lUU1ZQeXh3dUpaVG1wSk55SU5HZzFreTExT3l3WmJ3ZWxrcEhmaUh3M0Z6bEhiRTloQ3l6TUp0R3VWQUoxZ1dkcGdKbUNvTlRCY1lCY0FvZXhSdFhEWFpMaEZGQjRKd2ZDSWxpUHBQUG9ZcGFPVEN5SWZIMmp0a1U3bk1NdXp5NUtmTitGSlY5VWhGTWgwanhuemU0cFFkMDI2S2tjQ3pJTTdWV082T3JBcWdPTWdGR21CMWM2QTVLSzJoeTErWFJEVTJqbjk0MEJtOU9VRmZ2NFFnR2YwUXRLK3VVTUlpQ3VFcVhJZ1RndlJhT01ta2U1RU1zTDZSNk1aTmdVU1U3MnhMZUJQVGQxR09uZHo0cmhGcWhhdm1RRlQ4bkFnMU8veHhib3JwRmpKSUFvcjFnbjVnU1VxTjlnRkRpZXg3WXNaR1c5WktSNDBDbHlvekdwWmpxY29TUlp0eW16ODBQMnZWQnl5Z0NTeUZ2c0pNQ0x3TmhjKzlBVDNYVmozTTZCY01pZG1udW9pcXc2M2pzRXpkYks5N2VSeldDUWJET3J3UkZzZ2JScWs5cmtnZ0NvTm5FT0FRMkJUK0xxNFBoRHRMamhoWnAxZjdhd0xIMDkyVEdmejhZY015Y2FRaXZZY3czUzBCV1J1L2ltZWhnUmUvTzU0L1ZxTkFFejl2cERsQzdLR2RFa1Y3eGtZN1pIdHZLYlFSNHpiQm9MZmovOUpwS3liVnFwY2VPU3U4OWJaL2FuYjJVSVQvY3oybEtheE5UeHFqcXczVytEbUJGbUx3YUlYczBBTkFYSzU5V00xWWJxbVk4ZlN0TmVycXNHSWVvK25iZEY5eG9CZERNVVJLLyt6OXNoR3V0YkVXZlY0bUFPejRHWjFiWjM1Q2swNDByS0VKTjJuY1hhV3VVSzNnWFVSUFpOZXp4dzREbWd3QnhXMnZLVmtiRzFseDEveXE5Sm90NG5nZndlYkZGbEhHTDJYWUloVjB6K2NXbXdPMmZHeEduMDRXYWZ0TUJHZW5xVFYxVGl5ZG1yYVFMa2ZoUE8wVG11YlBVS2xSZVdhbCs4czJNRDFZMy95NmFjL1o2a1kwRFRucnBaSVJRZVhDOHBMd25JeS9paEFXS1JGSlNGQ2s5bGFWS1NiTTI0anhiOXoydHdDaFlkOThBK1h0NXl0ajFRVHR3M2NIV3liYXJRTE9NRVNlNFRZT0doaHRTaHh5SmMwenhjaGFlTFY0QXRRL0NaalhxMWQzeDZHek51a3ZoZUdOcjhjclljUmpoREsvaHdvTEswcXNhbFdaaHlLVDk3VXlRK2M1MG54RDIyMUM1ZlordDFpUFFpcTBIc3Q2VVZIUWVzZ3I2cnluMFd6MFpnSjdWVjVYbFZVcWR4L0Z6OXdMckdDSXFrT04vTjM2aTFPQkhZYkY3cmkxTzgwRjl3ekM3NlVMa21SK01pN1VGYjFSUzVvOHh2blJHYzcxemZIUnBlWmxIbVFZV05IVE54OGhhWDBSMXkzVk8rOUFaN0VsZmlsV2JxK29NSFRUTTRNRlk2OUlheWtIc0ZDMzdzRXdiNFg1bDJOYzRFVEdxVU0vODd0T0lPYUIwWjIxcEYzNkUwRXozRFo1SDlRbXpmSTBWVzZBdVQ1aEhXTERRZmF4enZZUmxQWmc5WVZjYkVoVHByVnA5UFFZVjFzMDFza3B3ZDZnWG5ySkxvZnRIdkhDRHY5TUh1YWlvQm1idTM2eC9xcXlDeld6Z1d6WTZHbERuVnFSM200aDYwNXJnclBsalJGVFQvcXduMmZJcTFCa0RvVTgvQ0x4WHNselJtMUZsUUJINkR4MkJDS2FuTVFEM3JnYkRodTRXcnJtQkVTODBCZWFiamt4OW5ha2hGN054ZVlZVEh1U3c0Q1JaejEwQWg5dTlKckxwVFVxaE8yZjk0R0QwaGdrZEJvaGpmNXRSWkxqVG5naUpySzNuRmF5d3Z1enZaa1h1Yk5qNm50MmNjbVE5bGdqNmRvZ2wrY2cwdWdoQUNPdnk2MmdiallrVEtMQklHaTRpbUQxbG1QdnJuNXZoTU8wT01EeTdUY25vdW9HMzB5OUVkUG9pZWdXaVM2cWR2VGhmVlVzaWZJVnN1bkwrTy9UcTZ1dWxvRkV4OFdZN3FObWdIZStUditNMHZnV1EyaW9HeFl5MHA4Z0wzeWNZRWp4NW82Y3VNd1lYUjlmOHhwUW5oZS9HRUZNV0VUZ1ltT3dtQXhQNjFFNUI5UklSMkpTQ3JRTk14N3dNWEZsazFZV3A1V2VpcVd3dXI3aDBxTTZwU3VGVWU4ajlDVVZweXpMNjBZY1M3eXEwZE1NM2RnWTE3VjVTdXNyMG9PV09GSXdManY3eERsaXVlV1VYaXJzMEUwQUFKWVZtV0FjblMwai9WMm00WHpjTlFCOHZCSWJPN0JERXByZzc4aVBrRmFQZytDa0JSa0kxY0VIWHZMUVpqbkxLeThvaklRMTMvS1FLS3Q1K2gvR25RRE91cmhpMHo3eTZWZFV0c002Vk1UaFI3ZkJnem1MUkdJOGdUVDV0ejJ1YmdaUEdQeDBTOC9QVEFCRnRLYUZUci9hdmQwcXcvRTZHOEtmYlFrOXluN1JvUnFMK1Q1NSt1RDJkME1TV0xuUExrblRnV3pnODAwSElrZGVqMVEwYStNc1RaRXN5N1N5clNQenREa0pJakkrNFE1YjRjNi9GeUVFY1FJYjVPRUtZU3VwQnFoTTc0eUxWUWdXQTEzVHkvWmpVYVpDcUwrS00wbFdYbmhmM2g1NnRkdjh6bm1UTEtLNDAwdE0xUndoZEN4eUZYQk5ISllseXlXMHZ4QXM1VFhmTGViR0cvUTFJdVc4TndvamE5OGxSZ2RnOHVKSEJ1YWlnZXNDeC8vVFBqRGtTSmdNenNtQktWVTRNcWNGVWhBTCtCMEY2WVNRMm9VQlo0R2QyRC92UXN0aytTalJ1S2c4czNub0lmOTFoaGtscHdFbG1RcWQ5MmZrbCtYRk9UTlFJVkFpRk5xYXFLUVVQWTBYS0lMU2JEb2RoTkt5cnlrWS8zTjhnbEoyaUVDbHJaVEtQU1FSUThkZUgzYXdhcEUzcTZaRkhYYkJkTEVERzdoeEhtMDJsUVAwbXU0ZFczazZyQ05kSGlrS2p6UzhrdzEyT1NIaklSZzJDT25lOWczclRad3dZakNjenBJYXA1RW84TGxGSDRSc1hkWm55QmNwdGpNZEJ4ZC85eXRlYkRoZkE2QW1vWXhBdlgwL0k1am9wZ3BqcEVFWGlhVFFPalV6SE1HQ0I2VThMcSsxYzl3Rk0wSW13NVpNQ0NjdEdacExPbVJRSDdvNDZobG1odXU0d0FWRzNoNkJYaEFUdDYvK1pjanJCNzlMOU1iU2pHWllYV2Z4bmlySlpqalhTOWNqcVlPZE5kWjg2R1lNK0s0bm1xbVh2MmJjT0R3a0JvUDRYUzY1YUVZbFBBMDF6UzFUMVhUenZQTmloM3kzUzhrWWRUeDdocVhtYndjZ3pwcmNGZnA5Njg2bktMVjZxa1gya1YwdWFkeFJqZXozbDM2WlRFVHhweThZVTdtOGZCZ3lSZ0xIVWxuUFBXdHY2YVU3Q0VqU0xlR3FyOUdUM1E3RGpyY1YzeDB1U0dpcUFoeFhYVzBNSGIzOThLWlNkMUZldXlHK1dzdldXMGs2WXZhMVBOSFFCN2c1TGp4aW5sUTJGT09EQ2ZFWXRuNmVqMU80dkJUWWFiR2NpU0FDQlBKTGZLMU45QmdObnpSSUVVYW5vMDZ6Z3ljd2M1RnBmdGZDaU9RaU9QT0k1dTgrSFk2TXZKNDgzaUZoYkhoZzFXaUtjTnVJRnNUVEFsUXVLNE5lNFJYMTNDMnRNdS83Y083YjFNSEZlakMxMmNYM3ZXTE9TWm5PYWdwUlBQUXNVRkJvd05ZYWtyVFRaNkF6TjhuN1V1NnlYUE5kKzhLdlNkdzd0OE9IV0lwb01JQkNHaWptTnlQa0RoTEh6MVhZZWppVmhOSFR2YVZtZm9SNXBNTlRXemduTVNFOEZmaXJGazIrWWpyTHRCWEdablJnTGpnV3ZMSXREdmpLWURDN2hjaVJMSVdjR1c5Nkk1YVBzMWlURHhLcFNLOEUwbEUrUllzZ3pGL3ErcjErS2VUczBmYlhtNVpNVFZvaHNkL29tMC9SazR6bXdUVksxaWhIQmxHK3N5MzRNQ2F1V3NiMFZ5ZnBmZTVYOUlEUHlEV1UxNDBGbU9tUlBEclJUeHhsTjFxMkFjN0FRcWpqNElSRjRtTzdlWnRHeU9Lc1k1UEdaMFE4Y2Z4TlhjUXlzbG5DcjhmQnlOSTdqREl5L1pDdTJkV0VMNkhBZFBzU2ptY3U3YUxLZ2NsL2QwQUNtQ29UVkRsQ2NEeDVjU1YvNUlzeGE1YkxSSDZjY3FjL3lIOW50czc5N2I5VXJkdFRyTEZtbERkUnNVTU51bUpvUUMxMTVhbG13QlJWR2lGNDJKNEFOdW90WmRCcittazJkMUNEaE5qa2twV1YrWC9ncU5Id2NBMWtlQVpNQnZiQzZsSFhMTXlac3ZDbWJrUTVEdERvbkh3SGZ3bThDNWN6NEtwVVJPMEU0aGpVN0MvN0JNM3YvRkYxU055ajZCOE5Ca0pZSE1OcUk0RG11alhDQVduTGkvOEtYck5HWHNFbTc5ZDRTajFiVlhSUDJFblBGRlVQV2d3amJkQUc4aC9sTURNYVdsSDJaKysxWXVTOXVJRnY0Y2sxMk5wdkxtUUNCeWdUa2VqKytobjFnVTM1cmpoK3hwdWE5ZGVpeHg4Vkg4ODE1SWkwQWJmYlBETjN0M003Tjd6RXRXMFVmREZPQ0lPdVZ4WXo1RnBMR3BWK1pwam9CdllVcEZqMmZLeWYzbE1EK1pQKzkrWGQ4Rm1ZUVNnSUQwenlaaHpUNW1ibVZsNlp6Vlh0NjIrMThVNFdHZ3luakQyUGc5ZFZPOVNzNGZHajlnS2ZhMGpiZXI5VVdOKzR3YTFjaWd3ekg3NVNFb25EdlVGWFhrWjVhbERndVI3RmNpWmtYUmU1SDFoMk5qNTlYNDZPa1JkZDl5dVRFNit3bVE1aHhkUC83ME8xbVNMWHR3Wk84WThvUFJHZk9SWGsrc3drQzRRRGpMVWQzaHRySE5kSEQ3ditZMTlQbnpER3BvS2c2WW1vbmMrSUdTc2dmZGdnMFljWVA1RktDcnR1VGxOcTRSbHdUSTBXcjFNWGFSTDhIdElVZFZZYmFXazZVTEFDRUJvV2R3U3dmb2FNanV3ZUhWSEpDZytOOEJZYnZwUTlVOHlaSGlTbnZVTlNrYTFPN0xkTmFkZnZpWEJZeGhsa01FcFRSdWFPZE1ZVUhMQlZEeDg3NHQ3dkZyWW5ycWJnTmFFWkZWakhFVDRsMmJ5d3pwekcrN2tyb0E0ZzQrMVZJOSttczBHR3RIY0VvNmhaV0I3UU91NkZqdFk2ZEI3NG1MeUI3eVBwYXdKTXhHRW5aenB6NXkvNDZjOVptMmtqazZ3RFAzNjNudzZGL0hXK2tWTUp5QWFPQXJWUGpEMjl5Q3V3bUgxVThWNlMwVm5oY1diYzhCaTVwRG5aV2tWcDlDMys5Z2tkUEViR0J5b25ONFlHdGp3RVd5ZWg3T1pNc1lKMkZnYnZwY0Z2SitiT0NKMjZFM2RucHo5UmYvUjZGejIrbzlqOUZtRGNEL1daZGRIZlBqV3d3Qm9HOW0wNDNOUlE0elFidldkZFI5OUlxSUM4eWxFSEtHa1pQM0MwS3RQcnhIb1B6Z3dnY1ErUHFKdGwvTndlc1VaZUtUTzhmMzM0aHQyRThxNnVieVcrbHFqWExnUE1KTXlYVnB3c01HUENNMUdDK3NIZGZxajErNmg3QTRteHpxTjQxMCtqMytSUDNIVmUzK2UwSFhwZkxGVXpySDRXbnQzQzVsZCtYT21XOEJUeDVnUXk2ZFEzNzF1dC9iVnlEcTdTNFZ1dXBJblVZMVd2R0xiN1ZBU3IzSVJGVnBOd0o3WGdZKzI2Vnh3L093bHNvU2U5TlEybzB5bFhOL01ocVhQRUV2RURWTEM1UTZBRlFvYzNPM0QyZk1HWUg1Yk5WSU41QjlrUHQvTkhVMndGWWlCSnpTNTd6SXh0Tjl6Yk8wUlVhNXdmSGNsWVYrTmpCNGlUS3BkeUFlZ1BiNnh1YjV6bUZ4UmwwQ1lqcWVwTDlXQ3UzdmxUdzl6VTdxRVd4ZWNiR3RQeHVHblczZjRGS0hRTmFOckFqaWRSMTc0TWh0Y3RTMm5NMmMrbys4bHErTmtyNTd5RHRYeW9jY3g3b0RsZ2NkSWFQNk9BR20zU1JuZXZFVklaZ1RER2ZOclRoakhaYW5Yb3ZuQ3p0TC9SVjM2d1dhNHpaNjJVTVpNZGJPVDJ6UkRINE5jYUZ5NU5jcEt6eS8wamlaNEpDN3dlWGFBa29NNlI3RjJkUGRLWUhpeFV1c0grdFBXWjVkR0NqZFhadkRWeVNSWUpDZ3BjK1lMK2N0Um5VK2NLNDdQM0RwQ3ZDWDBEcDM…"))