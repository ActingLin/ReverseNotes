const CryptoJS = require('crypto-js')
const JSEncrypt = require("jsencrypt");

function w(A) {
    var e, t, n = "", r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = "=";
    for (e = 0; e + 3 <= A.length; e += 3)
        t = parseInt(A.substring(e, e + 3), 16),
            n += r.charAt(t >> 6) + r.charAt(63 & t);
    e + 1 == A.length ? (t = parseInt(A.substring(e, e + 1), 16),
        n += r.charAt(t << 2)) : e + 2 == A.length && (t = parseInt(A.substring(e, e + 2), 16),
        n += r.charAt(t >> 2) + r.charAt((3 & t) << 4));
    while ((3 & n.length) > 0)
        n += a;
    return n
}

function encryptLong(public_key_obj, A) {
    var e = public_key_obj.getKey()
        , t = (e.n.bitLength() + 7 >> 3) - 11;
    try {
        var n = ""
            , r = "";
        if (A.length > t)
            return n = A.match(/.{1,50}/g),
                n.forEach((function (A) {
                        var t = e.encrypt(A);
                        r += t
                    }
                )),
                w(r);
        var a = e.encrypt(A)
            , s = w(a);
        return s
    } catch (i) {
        return i
    }
}

function b(A, e, t) {
    return e in A ? Object.defineProperty(A, e, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : A[e] = t,
        A
}

function v(A, e) {
    var t = Object.keys(A);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(A);
        e && (n = n.filter((function (e) {
                return Object.getOwnPropertyDescriptor(A, e).enumerable
            }
        ))),
            t.push.apply(t, n)
    }
    return t
}

function m(A) {
    for (var e = 1; e < arguments.length; e++) {
        var t = null != arguments[e] ? arguments[e] : {};
        e % 2 ? v(Object(t), !0).forEach((function (e) {
                b(A, e, t[e])
            }
        )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(A, Object.getOwnPropertyDescriptors(t)) : v(Object(t)).forEach((function (e) {
                Object.defineProperty(A, e, Object.getOwnPropertyDescriptor(t, e))
            }
        ))
    }
    return A
}

function md5(text) {
    return CryptoJS.MD5(text).toString()
}

function encrypt_param(public_key, page) {
    var t = new JSEncrypt();
    t.setPublicKey(public_key);
    var e = {
        "inviteMethod": "",
        "businessClassfication": "",
        "mc": "",
        "lx": "ZBGG",
        "dwmc": "",
        "pageIndex": page
    };
    var a = m(m({}, e), {}, {
        sign: md5(JSON.stringify(e)),
        timeStamp: +new Date
    });
    console.log(a);
    return encryptLong(t, JSON.stringify(a))
}

// var publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCiuJmhbFymxOoyulNVk1o0HmKqYx5LAUyj3guWIkOitq4c52a//vXzfqrCKARQSzvGiN4s2PcTycdPv/dBroVTG3w0QVMmjok6CnvlVRs67VYfLb7EZH47tE/MqByeFFSQxCEoQ+QbpsVaAA7zc+AC6JhQWAGWy4tiUcJjBNm/UQIDAQAB";
// console.log(encrypt_param(publicKey, 1));
