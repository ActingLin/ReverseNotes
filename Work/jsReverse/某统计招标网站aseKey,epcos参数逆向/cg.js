const CryptoJS = require('crypto-js')
const JSencrypt = require('jsencrypt')

function r_(e, t) {
    var n, i, a = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), r = [];
    if (t = t || a.length,
    e)
        for (n = 0; n < e; n++)
            r[n] = a[0 | Math.random() * t];
    else
        for (r[8] = r[13] = r[18] = r[23] = "-",
        r[14] = "4",
        n = 0; n < 36; n++)
            r[n] || (i = 0 | 16 * Math.random(),
            r[n] = a[19 == n ? 3 & i | 8 : i]);
    return r.join("")
}
window = global
function h(e) {
    var f = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCC3Lb0O4zgEakDfJ4XJO5zadXep9bQeWyJ6pa0e328PYQYZgLNP7eVrAP7mVZgG+8D4MicIcStTQnBxF8AEyJKrh/M/3WSSK2zDvrZn1paWf4SA8zFIn5cuYlcUH+WuxghQn3kKRUW2qtBY9eaGF5qntascctNgQTHmW3eqQzDBQIDAQAB";
    var t = r_(16, 16)
      , n = CryptoJS.enc.Utf8.parse(t)
      , i = CryptoJS.enc.Utf8.parse(e)
      , r = CryptoJS.AES.encrypt(i, n, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
      , c = r.toString()
      , l = new JSencrypt;
    l.setPublicKey(f);
    var u = l.encrypt(t);
    return {
        content: c,
        aesKey: u
    }
}
(function xxx(c){
    function t(e) {
        var u = {};
        if (u[e])
            return u[e].exports;
        var n = u[e] = {
            i: e,
            l: !1,
            exports: {}
        };
        return c[e].call(n.exports, n, n.exports, t),
        n.l = !0,
        n.exports
    }
    t.d = function(c, e, n) {
        t.o(c, e) || Object.defineProperty(c, e, {
            enumerable: !0,
            get: n
        })
    }
    t.o = function(c, e) {
        return Object.prototype.hasOwnProperty.call(c, e)
    }

    window.zy = t;
})({
    e762: function(e, t, r) {
        "use strict";
        r.d(t, "a", (function() {
            return B
        }
        ));
        const n = "3.7.7"
          , i = n
          , a = "function" === typeof Buffer
          , o = "function" === typeof TextDecoder ? new TextDecoder : void 0
          , s = "function" === typeof TextEncoder ? new TextEncoder : void 0
          , u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
          , c = Array.prototype.slice.call(u)
          , l = (e => {
            let t = {};
            return e.forEach( (e, r) => t[e] = r),
            t
        }
        )(c)
          , f = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/
          , h = String.fromCharCode.bind(String)
          , d = "function" === typeof Uint8Array.from ? Uint8Array.from.bind(Uint8Array) : e => new Uint8Array(Array.prototype.slice.call(e, 0))
          , p = e => e.replace(/=/g, "").replace(/[+\/]/g, e => "+" == e ? "-" : "_")
          , m = e => e.replace(/[^A-Za-z0-9\+\/]/g, "")
          , v = e => {
            let t, r, n, i, a = "";
            const o = e.length % 3;
            for (let s = 0; s < e.length; ) {
                if ((r = e.charCodeAt(s++)) > 255 || (n = e.charCodeAt(s++)) > 255 || (i = e.charCodeAt(s++)) > 255)
                    throw new TypeError("invalid character found");
                t = r << 16 | n << 8 | i,
                a += c[t >> 18 & 63] + c[t >> 12 & 63] + c[t >> 6 & 63] + c[63 & t]
            }
            return o ? a.slice(0, o - 3) + "===".substring(o) : a
        }
          , _ = "function" === typeof btoa ? e => btoa(e) : a ? e => Buffer.from(e, "binary").toString("base64") : v
          , y = a ? e => Buffer.from(e).toString("base64") : e => {
            const t = 4096;
            let r = [];
            for (let n = 0, i = e.length; n < i; n += t)
                r.push(h.apply(null, e.subarray(n, n + t)));
            return _(r.join(""))
        }
          , g = (e, t=!1) => t ? p(y(e)) : y(e)
          , b = e => {
            if (e.length < 2) {
                var t = e.charCodeAt(0);
                return t < 128 ? e : t < 2048 ? h(192 | t >>> 6) + h(128 | 63 & t) : h(224 | t >>> 12 & 15) + h(128 | t >>> 6 & 63) + h(128 | 63 & t)
            }
            t = 65536 + 1024 * (e.charCodeAt(0) - 55296) + (e.charCodeAt(1) - 56320);
            return h(240 | t >>> 18 & 7) + h(128 | t >>> 12 & 63) + h(128 | t >>> 6 & 63) + h(128 | 63 & t)
        }
          , w = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g
          , k = e => e.replace(w, b)
          , T = a ? e => Buffer.from(e, "utf8").toString("base64") : s ? e => y(s.encode(e)) : e => _(k(e))
          , M = (e, t=!1) => t ? p(T(e)) : T(e)
          , S = e => M(e, !0)
          , E = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g
          , x = e => {
            switch (e.length) {
            case 4:
                var t = (7 & e.charCodeAt(0)) << 18 | (63 & e.charCodeAt(1)) << 12 | (63 & e.charCodeAt(2)) << 6 | 63 & e.charCodeAt(3)
                  , r = t - 65536;
                return h(55296 + (r >>> 10)) + h(56320 + (1023 & r));
            case 3:
                return h((15 & e.charCodeAt(0)) << 12 | (63 & e.charCodeAt(1)) << 6 | 63 & e.charCodeAt(2));
            default:
                return h((31 & e.charCodeAt(0)) << 6 | 63 & e.charCodeAt(1))
            }
        }
          , L = e => e.replace(E, x)
          , O = e => {
            if (e = e.replace(/\s+/g, ""),
            !f.test(e))
                throw new TypeError("malformed base64.");
            e += "==".slice(2 - (3 & e.length));
            let t, r, n, i = "";
            for (let a = 0; a < e.length; )
                t = l[e.charAt(a++)] << 18 | l[e.charAt(a++)] << 12 | (r = l[e.charAt(a++)]) << 6 | (n = l[e.charAt(a++)]),
                i += 64 === r ? h(t >> 16 & 255) : 64 === n ? h(t >> 16 & 255, t >> 8 & 255) : h(t >> 16 & 255, t >> 8 & 255, 255 & t);
            return i
        }
          , A = "function" === typeof atob ? e => atob(m(e)) : a ? e => Buffer.from(e, "base64").toString("binary") : O
          , D = a ? e => d(Buffer.from(e, "base64")) : e => d(A(e).split("").map(e => e.charCodeAt(0)))
          , C = e => D(P(e))
          , Y = a ? e => Buffer.from(e, "base64").toString("utf8") : o ? e => o.decode(D(e)) : e => L(A(e))
          , P = e => m(e.replace(/[-_]/g, e => "-" == e ? "+" : "/"))
          , j = e => Y(P(e))
          , N = e => {
            if ("string" !== typeof e)
                return !1;
            const t = e.replace(/\s+/g, "").replace(/={0,2}$/, "");
            return !/[^\s0-9a-zA-Z\+/]/.test(t) || !/[^\s0-9a-zA-Z\-_]/.test(t)
        }
          , R = e => ({
            value: e,
            enumerable: !1,
            writable: !0,
            configurable: !0
        })
          , I = function() {
            const e = (e, t) => Object.defineProperty(String.prototype, e, R(t));
            e("fromBase64", (function() {
                return j(this)
            }
            )),
            e("toBase64", (function(e) {
                return M(this, e)
            }
            )),
            e("toBase64URI", (function() {
                return M(this, !0)
            }
            )),
            e("toBase64URL", (function() {
                return M(this, !0)
            }
            )),
            e("toUint8Array", (function() {
                return C(this)
            }
            ))
        }
          , F = function() {
            const e = (e, t) => Object.defineProperty(Uint8Array.prototype, e, R(t));
            e("toBase64", (function(e) {
                return g(this, e)
            }
            )),
            e("toBase64URI", (function() {
                return g(this, !0)
            }
            )),
            e("toBase64URL", (function() {
                return g(this, !0)
            }
            ))
        }
          , H = () => {
            I(),
            F()
        }
          , B = {
            version: n,
            VERSION: i,
            atob: A,
            atobPolyfill: O,
            btoa: _,
            btoaPolyfill: v,
            fromBase64: j,
            toBase64: M,
            encode: M,
            encodeURI: S,
            encodeURL: S,
            utob: k,
            btou: L,
            decode: j,
            isValid: N,
            fromUint8Array: g,
            toUint8Array: C,
            extendString: I,
            extendUint8Array: F,
            extendBuiltins: H
        }
    },
})

function get_data() {
    // e = 'dictType=supplier_type'
    // console.log(h(e))
    a = h(e)
    b = window.zy("e762");
    epcos = b["a"].encodeURL(a.content)
    // console.log(epcos)
    return {
        "aesKey": a.aesKey,
        "epcos": epcos
    }
}

// {
//   content: '+Ysyv4Aaym1qiR6tV9ILnc60TcbAH1Ot1szk9/1V+zU=',
//   aesKey: 'EoH5sBtaGuYf9wkJtV6MaqjsTHoaOB/NWn1gWZI4Qooh5QNPnHkq/D+D4W7jk6WJmIzB6fHE/U1Xl/ky1nJtjtL15HSOlcYzCww4hVviQwbZjjKDvVlUqwUVtVXFbadKAsLpWriBU/bcrW+tl1GS46fJLp88Mcq7Qxq6HQDUR9k='
// }
// bzByY2ZRSnlFUTNYR0JhaVhLemVnRnNTYzlhbWJvS2V2OXRpNXRCMGp6ST0
