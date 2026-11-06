var window = globalThis;
window.document = {}
window.location = {}

var e,
    r,
    u,
    l,
    h = window["document"],
    f = window["location"],
    d = h["body"] || h["getElementsByTagName"]("body")[0],
    p = h["head"] || h["getElementsByTagName"]("head")[0],
    g = (h["documentElement"], f["protocol"] + "//"),
    ht = window["navigator"],
    w = (e = h["createElement"]("canvas"), r = e["getContext"] && e["getContext"]("2d"), u = /msie/i["test"](ht["userAgent"]), !r && u),
    b = /Mobi/i["test"](ht["userAgent"]),
    x = /msie 6\.0/i["test"](ht["userAgent"]),
    E = (/msie 7\.0/i["test"](ht["userAgent"]), h["compatMode"]),
    C = (parseFloat(ht["userAgent"]["slice"](ht["userAgent"]["indexOf"]("Android") + 8)), parseFloat(ht["userAgent"]["slice"](ht["userAgent"]["indexOf"]("Android") + 8)) < 4.4),
    S = -1 < ht["userAgent"]["indexOf"]("Android"),
    T = 3e4,
    R = "geetest_",
    L = "err001",
    N = "err002",
    P = (l = [], {
        "$_HAy": function (t, e) {
            l[t] = e;
        },
        "$_HBq": function (t) {
            return l[t];
        }
    });

var dt,
    gt = "px",
    vt = 1,
    yt = function () {
        "use strict";
        var u,
            l,
            n,
            h,
            t = {},
            e = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

        function r(t) {
            return t < 10 ? "0" + t : t;
        }

        function i() {
            return this["valueOf"]();
        }

        function f(t) {
            return e["lastIndex"] = 0, e["test"](t) ? "\"" + t["replace"](e, function (t) {
                var e = n[t];
                return "string" == typeof e ? e : "\\u" + ("0000" + t["charCodeAt"](0)["toString"](16))["slice"](-4);
            }) + "\"" : "\"" + t + "\"";
        }

        return "function" != typeof Date["prototype"]["toJSON"] && (Date["prototype"]["toJSON"] = function () {
            return isFinite(this["valueOf"]()) ? this["getUTCFullYear"]() + "-" + r(this["getUTCMonth"]() + 1) + "-" + r(this["getUTCDate"]()) + "T" + r(this["getUTCHours"]()) + ":" + r(this["getUTCMinutes"]()) + ":" + r(this["getUTCSeconds"]()) + "Z" : null;
        }, Boolean["prototype"]["toJSON"] = i, Number["prototype"]["toJSON"] = i, String["prototype"]["toJSON"] = i), n = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        }, t["stringify"] = function (t, e, n) {
            var r;
            if (l = u = "", "number" == typeof n) for (r = 0; r < n; r += 1) l += " "; else "string" == typeof n && (l = n);
            if ((h = e) && "function" != typeof e && ("object" != typeof e || "number" != typeof e["length"])) throw new Error("JSON.stringify");
            return function c(t, e) {
                var n,
                    r,
                    i,
                    o,
                    s,
                    a = u,
                    _ = e[t];
                switch (_ && "object" == typeof _ && "function" == typeof _["toJSON"] && (_ = _["toJSON"](t)), "function" == typeof h && (_ = h["call"](e, t, _)), typeof _) {
                    case "string":
                        return f(_);
                    case "number":
                        return isFinite(_) ? String(_) : "null";
                    case "boolean":
                    case "null":
                        return String(_);
                    case "object":
                        if (!_) return "null";
                        if (u += l, s = [], "[object Array]" === Object["prototype"]["toString"]["apply"](_)) {
                            for (o = _["length"], n = 0; n < o; n += 1) s[n] = c(n, _) || "null";
                            return i = 0 === s["length"] ? "[]" : u ? "[\n" + u + s["join"](",\n" + u) + "\n" + a + "]" : "[" + s["join"](",") + "]", u = a, i;
                        }
                        if (h && "object" == typeof h) for (o = h["length"], n = 0; n < o; n += 1) "string" == typeof h[n] && (i = c(r = h[n], _)) && s["push"](f(r) + (u ? ": " : ":") + i); else for (r in _) Object["prototype"]["hasOwnProperty"]["call"](_, r) && (i = c(r, _)) && s["push"](f(r) + (u ? ": " : ":") + i);
                        return i = 0 === s["length"] ? "{}" : u ? "{\n" + u + s["join"](",\n" + u) + "\n" + a + "}" : "{" + s["join"](",") + "}", u = a, i;
                }
            }("", {
                "": t
            });
        }, t;
    }(),
    wt = (dt = {
        "mouseEvent": !1,
        "touchEvent": !1
    }, function le() {
        !function t() {
            if (window["addEventListener"]) {
                function e(t) {
                    dt["mouseEvent"] = !0, h["removeEventListener"]("mousedown", e), h["removeEventListener"]("mousemove", e), h["removeEventListener"]("mouseup", e);
                }

                h["addEventListener"]("mousedown", e), h["addEventListener"]("mousemove", e), h["addEventListener"]("mouseup", e);
            }
        }(), function n() {
            if (window["addEventListener"]) {
                function e(t) {
                    dt["touchEvent"] = !0, h["removeEventListener"]("touchstart", e), h["removeEventListener"]("touchmove", e), h["removeEventListener"]("touchend", e);
                }

                h["addEventListener"]("touchstart", e), h["addEventListener"]("touchmove", e), h["addEventListener"]("touchend", e);
            }
        }();
    }(), dt);

var s = {
        "$_DEg": function () {
            return (window["XDomainRequest"] || window["XMLHttpRequest"] && "withCredentials" in new window["XMLHttpRequest"]()) && window["JSON"];
        },
        "$_DFU": function (t, e, n, r, i) {
            var o = null;
            if (o = "string" == typeof e ? e : window["JSON"]["stringify"](e), !window["XMLHttpRequest"] || "withCredentials" in new window["XMLHttpRequest"]()) {
                if (window["XMLHttpRequest"]) {
                    var s = new window["XMLHttpRequest"]();
                    s["open"]("POST", t, !0), s["setRequestHeader"]("Content-Type", "text/plain;charset=utf-8"), s["setRequestHeader"]("Accept", "application/json"), s["withCredentials"] = !0, s["timeout"] = i || 3e4, s["onload"] = function () {
                        n(window["JSON"]["parse"](s["responseText"]));
                    }, s["onreadystatechange"] = function () {
                        4 === s["readyState"] && (200 === s["status"] ? n(window["JSON"]["parse"](s["responseText"])) : r({
                            "error": "status: " + s["status"]
                        }));
                    }, s["send"](o);
                }
            } else {
                var a = window["location"]["protocol"],
                    _ = new window["XDomainRequest"]();
                _["timeout"] = i || 3e4, -1 === t["indexOf"](a) && (t = t["replace"](/^https?:/, a)), _["ontimeout"] = function () {
                    "function" == typeof r && r({
                        "error": "timeout"
                    });
                }, _["onerror"] = function () {
                    "function" == typeof r && r({
                        "error": "error"
                    });
                }, _["onload"] = function () {
                    "function" == typeof n && n(window["JSON"]["parse"](_["responseText"]));
                }, _["open"]("POST", t), v(function () {
                    _["send"](o);
                }, 0);
            }
        }
    },
    a = {
        "$_DEg": function () {
            return (window["XDomainRequest"] || window["XMLHttpRequest"] && "withCredentials" in new window["XMLHttpRequest"]()) && window["JSON"];
        },
        "$_DFU": function (t, e, n, r, i) {
            var o = null;
            if (o = "string" == typeof e ? e : window["JSON"]["stringify"](e), !window["XMLHttpRequest"] || "withCredentials" in new window["XMLHttpRequest"]()) {
                if (window["XMLHttpRequest"]) {
                    var s = new window["XMLHttpRequest"]();
                    s["open"]("POST", t, !0), s["setRequestHeader"]("Content-Type", "text/plain;charset=utf-8"), s["setRequestHeader"]("Accept", "application/json"), s["withCredentials"] = !0, s["timeout"] = i || 3e4, s["onload"] = function () {
                        n(window["JSON"]["parse"](s["responseText"]));
                    }, s["onreadystatechange"] = function () {
                        4 === s["readyState"] && (200 === s["status"] ? n(window["JSON"]["parse"](s["responseText"])) : r({
                            "error": "status: " + s["status"]
                        }));
                    }, s["send"](o);
                }
            } else {
                var a = window["location"]["protocol"],
                    _ = new window["XDomainRequest"]();
                _["timeout"] = i || 3e4, -1 === t["indexOf"](a) && (t = t["replace"](/^https?:/, a)), _["ontimeout"] = function () {
                    "function" == typeof r && r({
                        "error": "timeout"
                    });
                }, _["onerror"] = function () {
                    "function" == typeof r && r({
                        "error": "error"
                    });
                }, _["onload"] = function () {
                    "function" == typeof n && n(window["JSON"]["parse"](_["responseText"]));
                }, _["open"]("POST", t), v(function () {
                    _["send"](o);
                }, 0);
            }
        }
    },
    m = {
        "$_DJJ": {
            "$_EAM": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()",
            "$_EBl": ".",
            "$_ECx": 7274496,
            "$_EDQ": 9483264,
            "$_EEu": 19220,
            "$_EFh": 235,
            "$_EGw": 24
        },
        "$_EAM": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()",
        "$_EBl": ".",
        "$_ECx": 7274496,
        "$_EDQ": 9483264,
        "$_EEu": 19220,
        "$_EFh": 235,
        "$_EGw": 24,
        "$_EHE": function (t) {
            for (var e = [], n = 0, r = t["length"]; n < r; n += 1) e["push"](t["charCodeAt"](n));
            return e;
        },
        "$_EIK": function (t) {
            for (var e = "", n = 0, r = t["length"]; n < r; n += 1) e += String["fromCharCode"](t[n]);
            return e;
        },
        "$_EJc": function (t) {
            var e = this["$_EAM"];
            return t < 0 || t >= e["length"] ? "." : e["charAt"](t);
        },
        "$_FAC": function (t) {
            return this["$_EAM"]["indexOf"](t);
        },
        "$_FBo": function (t, e) {
            return t >> e & 1;
        },
        "$_FCV": function (t, i) {
            var o = this;
            i || (i = o);
            for (var e = function (t, e) {
                for (var n = 0, r = i["$_EGw"] - 1; 0 <= r; r -= 1) 1 === o["$_FBo"](e, r) && (n = (n << 1) + o["$_FBo"](t, r));
                return n;
            }, n = "", r = "", s = t["length"], a = 0; a < s; a += 3) {
                var _;
                if (a + 2 < s) _ = (t[a] << 16) + (t[a + 1] << 8) + t[a + 2], n += o["$_EJc"](e(_, i["$_ECx"])) + o["$_EJc"](e(_, i["$_EDQ"])) + o["$_EJc"](e(_, i["$_EEu"])) + o["$_EJc"](e(_, i["$_EFh"])); else {
                    var c = s % 3;
                    2 == c ? (_ = (t[a] << 16) + (t[a + 1] << 8), n += o["$_EJc"](e(_, i["$_ECx"])) + o["$_EJc"](e(_, i["$_EDQ"])) + o["$_EJc"](e(_, i["$_EEu"])), r = i["$_EBl"]) : 1 == c && (_ = t[a] << 16, n += o["$_EJc"](e(_, i["$_ECx"])) + o["$_EJc"](e(_, i["$_EDQ"])), r = i["$_EBl"] + i["$_EBl"]);
                }
            }
            return {
                "res": n,
                "end": r
            };
        },
        "$_FDd": function (t) {
            var e = this["$_FCV"](this["$_EHE"](t));
            return e["res"] + e["end"];
        },
        "$_FEu": function (t) {
            var e = this["$_FCV"](t);
            return e["res"] + e["end"];
        },
        "$_FFB": function (t, o) {
            var s = this;
            o || (o = s);
            for (var e = function (t, e) {
                if (t < 0) return 0;
                for (var n = 5, r = 0, i = o["$_EGw"] - 1; 0 <= i; i -= 1) 1 === s["$_FBo"](e, i) && (r += s["$_FBo"](t, n) << i, n -= 1);
                return r;
            }, n = t["length"], r = "", i = 0; i < n; i += 4) {
                var a = e(s["$_FAC"](t["charAt"](i)), o["$_ECx"]) + e(s["$_FAC"](t["charAt"](i + 1)), o["$_EDQ"]) + e(s["$_FAC"](t["charAt"](i + 2)), o["$_EEu"]) + e(s["$_FAC"](t["charAt"](i + 3)), o["$_EFh"]),
                    _ = a >> 16 & 255;
                if (r += String["fromCharCode"](_), t["charAt"](i + 2) !== o["$_EBl"]) {
                    var c = a >> 8 & 255;
                    if (r += String["fromCharCode"](c), t["charAt"](i + 3) !== o["$_EBl"]) {
                        var u = 255 & a;
                        r += String["fromCharCode"](u);
                    }
                }
            }
            return r;
        },
        "$_FGv": function (t) {
            var e = 4 - t["length"] % 4;
            if (e < 4) for (var n = 0; n < e; n += 1) t += this["$_EBl"];
            return this["$_FFB"](t);
        },
        "$_FHw": function (t) {
            return this["$_FGv"](t);
        }
    };
var V = function () {
    var t,
        n = Object["create"] || function () {
            function n() {
            }

            return function (t) {
                var e;
                return n["prototype"] = t, e = new n(), n["prototype"] = null, e;
            };
        }(),
        e = {},
        r = e["lib"] = {},
        i = r["Base"] = {
            "extend": function (t) {
                var e = n(this);
                return t && e["mixIn"](t), e["hasOwnProperty"]("init") && this["init"] !== e["init"] || (e["init"] = function () {
                    e["$super"]["init"]["apply"](this, arguments);
                }), (e["init"]["prototype"] = e)["$super"] = this, e;
            },
            "create": function () {
                var t = this["extend"]();
                return t["init"]["apply"](t, arguments), t;
            },
            "init": function () {
            },
            "mixIn": function (t) {
                for (var e in t) t["hasOwnProperty"](e) && (this[e] = t[e]);
                t["hasOwnProperty"]("toString") && (this["toString"] = t["toString"]);
            }
        },
        u = r["WordArray"] = i["extend"]({
            "init": function (t, e) {
                t = this["words"] = t || [], e != undefined ? this["sigBytes"] = e : this["sigBytes"] = 4 * t["length"];
            },
            "concat": function (t) {
                var e = this["words"],
                    n = t["words"],
                    r = this["sigBytes"],
                    i = t["sigBytes"];
                if (this["clamp"](), r % 4) for (var o = 0; o < i; o++) {
                    var s = n[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                    e[r + o >>> 2] |= s << 24 - (r + o) % 4 * 8;
                } else for (o = 0; o < i; o += 4) e[r + o >>> 2] = n[o >>> 2];
                return this["sigBytes"] += i, this;
            },
            "clamp": function () {
                var t = this["words"],
                    e = this["sigBytes"];
                t[e >>> 2] &= 4294967295 << 32 - e % 4 * 8, t["length"] = Math["ceil"](e / 4);
            }
        }),
        o = e["enc"] = {},
        l = o["Latin1"] = {
            "parse": function (t) {
                for (var e = t["length"], n = [], r = 0; r < e; r++) n[r >>> 2] |= (255 & t["charCodeAt"](r)) << 24 - r % 4 * 8;
                return new u["init"](n, e);
            }
        },
        s = o["Utf8"] = {
            "parse": function (t) {
                return l["parse"](unescape(encodeURIComponent(t)));
            }
        },
        a = r["BufferedBlockAlgorithm"] = i["extend"]({
            "reset": function () {
                this["$_HCP"] = new u["init"](), this["$_HDs"] = 0;
            },
            "$_HEL": function (t) {
                "string" == typeof t && (t = s["parse"](t)), this["$_HCP"]["concat"](t), this["$_HDs"] += t["sigBytes"];
            },
            "$_HFr": function (t) {
                var e = this["$_HCP"],
                    n = e["words"],
                    r = e["sigBytes"],
                    i = this["blockSize"],
                    o = r / (4 * i),
                    s = (o = t ? Math["ceil"](o) : Math["max"]((0 | o) - this["$_HGI"], 0)) * i,
                    a = Math["min"](4 * s, r);
                if (s) {
                    for (var _ = 0; _ < s; _ += i) this["$_HHk"](n, _);
                    var c = n["splice"](0, s);
                    e["sigBytes"] -= a;
                }
                return new u["init"](c, a);
            },
            "$_HGI": 0
        }),
        _ = e["algo"] = {},
        c = r["Cipher"] = a["extend"]({
            "cfg": i["extend"](),
            "createEncryptor": function (t, e) {
                return this["create"](this["$_HIG"], t, e);
            },
            "init": function (t, e, n) {
                this["cfg"] = this["cfg"]["extend"](n), this["$_HJf"] = t, this["$_IAg"] = e, this["reset"]();
            },
            "reset": function () {
                a["reset"]["call"](this), this["$_IBP"]();
            },
            "process": function (t) {
                return this["$_HEL"](t), this["$_HFr"]();
            },
            "finalize": function (t) {
                return t && this["$_HEL"](t), this["$_ICv"]();
            },
            "keySize": 4,
            "ivSize": 4,
            "$_HIG": 1,
            "$_IDp": 2,
            "$_IEE": function (c) {
                return {
                    "encrypt": function (t, e, n) {
                        e = l["parse"](e), n && n["iv"] || ((n = n || {})["iv"] = l["parse"]("0000000000000000"));
                        for (var r = m["encrypt"](c, t, e, n), i = r["ciphertext"]["words"], o = r["ciphertext"]["sigBytes"], s = [], a = 0; a < o; a++) {
                            var _ = i[a >>> 2] >>> 24 - a % 4 * 8 & 255;
                            s["push"](_);
                        }
                        return s;
                    }
                };
            }
        }),
        h = e["mode"] = {},
        f = r["BlockCipherMode"] = i["extend"]({
            "createEncryptor": function (t, e) {
                return this["Encryptor"]["create"](t, e);
            },
            "init": function (t, e) {
                this["$_IFI"] = t, this["$_IGB"] = e;
            }
        }),
        d = h["CBC"] = ((t = f["extend"]())["Encryptor"] = t["extend"]({
            "processBlock": function (t, e) {
                var n = this["$_IFI"],
                    r = n["blockSize"];
                (function s(t, e, n) {
                    var r = this["$_IGB"];
                    if (r) {
                        var i = r;
                        this["$_IGB"] = undefined;
                    } else var i = this["$_IHU"];
                    for (var o = 0; o < n; o++) t[e + o] ^= i[o];
                })["call"](this, t, e, r), n["encryptBlock"](t, e), this["$_IHU"] = t["slice"](e, e + r);
            }
        }), t),
        p = (e["pad"] = {})["Pkcs7"] = {
            "pad": function (t, e) {
                for (var n = 4 * e, r = n - t["sigBytes"] % n, i = r << 24 | r << 16 | r << 8 | r, o = [], s = 0; s < r; s += 4) o["push"](i);
                var a = u["create"](o, r);
                t["concat"](a);
            }
        },
        g = r["BlockCipher"] = c["extend"]({
            "cfg": c["cfg"]["extend"]({
                "mode": d,
                "padding": p
            }),
            "reset": function () {
                c["reset"]["call"](this);
                var t = this["cfg"],
                    e = t["iv"],
                    n = t["mode"];
                if (this["$_HJf"] == this["$_HIG"]) var r = n["createEncryptor"];
                this["$_IIM"] && this["$_IIM"]["$_IJA"] == r ? this["$_IIM"]["init"](this, e && e["words"]) : (this["$_IIM"] = r["call"](n, this, e && e["words"]), this["$_IIM"]["$_IJA"] = r);
            },
            "$_HHk": function (t, e) {
                this["$_IIM"]["processBlock"](t, e);
            },
            "$_ICv": function () {
                var t = this["cfg"]["padding"];
                if (this["$_HJf"] == this["$_HIG"]) {
                    t["pad"](this["$_HCP"], this["blockSize"]);
                    var e = this["$_HFr"](!0);
                }
                return e;
            },
            "blockSize": 4
        }),
        v = r["CipherParams"] = i["extend"]({
            "init": function (t) {
                this["mixIn"](t);
            }
        }),
        m = r["SerializableCipher"] = i["extend"]({
            "cfg": i["extend"](),
            "encrypt": function (t, e, n, r) {
                r = this["cfg"]["extend"](r);
                var i = t["createEncryptor"](n, r),
                    o = i["finalize"](e),
                    s = i["cfg"];
                return v["create"]({
                    "ciphertext": o,
                    "key": n,
                    "iv": s["iv"],
                    "algorithm": t,
                    "mode": s["mode"],
                    "padding": s["padding"],
                    "blockSize": t["blockSize"],
                    "formatter": r["format"]
                });
            }
        }),
        y = [],
        w = [],
        b = [],
        x = [],
        E = [],
        C = [],
        S = [],
        T = [],
        k = [],
        A = [];
    !function () {
        for (var t = [], e = 0; e < 256; e++) t[e] = e < 128 ? e << 1 : e << 1 ^ 283;
        var n = 0,
            r = 0;
        for (e = 0; e < 256; e++) {
            var i = r ^ r << 1 ^ r << 2 ^ r << 3 ^ r << 4;
            i = i >>> 8 ^ 255 & i ^ 99, y[n] = i;
            var o = t[w[i] = n],
                s = t[o],
                a = t[s],
                _ = 257 * t[i] ^ 16843008 * i;
            b[n] = _ << 24 | _ >>> 8, x[n] = _ << 16 | _ >>> 16, E[n] = _ << 8 | _ >>> 24, C[n] = _;
            _ = 16843009 * a ^ 65537 * s ^ 257 * o ^ 16843008 * n;
            S[i] = _ << 24 | _ >>> 8, T[i] = _ << 16 | _ >>> 16, k[i] = _ << 8 | _ >>> 24, A[i] = _, n ? (n = o ^ t[t[t[a ^ o]]], r ^= t[t[r]]) : n = r = 1;
        }
    }();
    var D = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
        M = _["AES"] = g["extend"]({
            "$_IBP": function () {
                if (!this["$_JAa"] || this["$_JBQ"] !== this["$_IAg"]) {
                    for (var t = this["$_JBQ"] = this["$_IAg"], e = t["words"], n = t["sigBytes"] / 4, r = 4 * (1 + (this["$_JAa"] = 6 + n)), i = this["$_JCl"] = [], o = 0; o < r; o++) if (o < n) i[o] = e[o]; else {
                        var s = i[o - 1];
                        o % n ? 6 < n && o % n == 4 && (s = y[s >>> 24] << 24 | y[s >>> 16 & 255] << 16 | y[s >>> 8 & 255] << 8 | y[255 & s]) : (s = y[(s = s << 8 | s >>> 24) >>> 24] << 24 | y[s >>> 16 & 255] << 16 | y[s >>> 8 & 255] << 8 | y[255 & s], s ^= D[o / n | 0] << 24), i[o] = i[o - n] ^ s;
                    }
                    for (var a = this["$_JDn"] = [], _ = 0; _ < r; _++) {
                        o = r - _;
                        if (_ % 4) s = i[o]; else s = i[o - 4];
                        a[_] = _ < 4 || o <= 4 ? s : S[y[s >>> 24]] ^ T[y[s >>> 16 & 255]] ^ k[y[s >>> 8 & 255]] ^ A[y[255 & s]];
                    }
                }
            },
            "encryptBlock": function (t, e) {
                this["$_JEE"](t, e, this["$_JCl"], b, x, E, C, y);
            },
            "$_JEE": function (t, e, n, r, i, o, s, a) {
                for (var _ = this["$_JAa"], c = t[e] ^ n[0], u = t[e + 1] ^ n[1], l = t[e + 2] ^ n[2], h = t[e + 3] ^ n[3], f = 4, d = 1; d < _; d++) {
                    var p = r[c >>> 24] ^ i[u >>> 16 & 255] ^ o[l >>> 8 & 255] ^ s[255 & h] ^ n[f++],
                        g = r[u >>> 24] ^ i[l >>> 16 & 255] ^ o[h >>> 8 & 255] ^ s[255 & c] ^ n[f++],
                        v = r[l >>> 24] ^ i[h >>> 16 & 255] ^ o[c >>> 8 & 255] ^ s[255 & u] ^ n[f++],
                        m = r[h >>> 24] ^ i[c >>> 16 & 255] ^ o[u >>> 8 & 255] ^ s[255 & l] ^ n[f++];
                    c = p, u = g, l = v, h = m;
                }
                p = (a[c >>> 24] << 24 | a[u >>> 16 & 255] << 16 | a[l >>> 8 & 255] << 8 | a[255 & h]) ^ n[f++], g = (a[u >>> 24] << 24 | a[l >>> 16 & 255] << 16 | a[h >>> 8 & 255] << 8 | a[255 & c]) ^ n[f++], v = (a[l >>> 24] << 24 | a[h >>> 16 & 255] << 16 | a[c >>> 8 & 255] << 8 | a[255 & u]) ^ n[f++], m = (a[h >>> 24] << 24 | a[c >>> 16 & 255] << 16 | a[u >>> 8 & 255] << 8 | a[255 & l]) ^ n[f++];
                t[e] = p, t[e + 1] = g, t[e + 2] = v, t[e + 3] = m;
            },
            "keySize": 8
        });
    return e["AES"] = g["$_IEE"](M), e["AES"];
}();

function $_BDZ(t) {
    try {
        return (t / vt)["toFixed"](4) + gt;
    } catch (e) {
        return t + "px";
    }
}

function bt() {
}

function re(t) {
    this["$_GIv"] = $_GQ(), this["$_BHEO"]({
        "protocol": g
    })["$_BHEO"](t);
}

bt["prototype"] = {
    "$_BGGG": function () {
        return window["performance"] && window["performance"]["timing"] && this["$_BGHo"]() || -1;
    },
    "$_BGHo": function () {
        var t = window["performance"]["timing"];
        return {
            "a": t["navigationStart"],
            "b": t["unloadEventStart"],
            "c": t["unloadEventEnd"],
            "d": t["redirectStart"],
            "e": t["redirectEnd"],
            "f": t["fetchStart"],
            "g": t["domainLookupStart"],
            "h": t["domainLookupEnd"],
            "i": t["connectStart"],
            "j": t["connectEnd"],
            "k": t["secureConnectionStart"],
            "l": t["requestStart"],
            "m": t["responseStart"],
            "n": t["responseEnd"],
            "o": t["domLoading"],
            "p": t["domInteractive"],
            "q": t["domContentLoadedEventStart"],
            "r": t["domContentLoadedEventEnd"],
            "s": t["domComplete"],
            "t": t["loadEventStart"],
            "u": t["loadEventEnd"]
        };
    }
};
re["prototype"] = {
    "protocol": "http://",
    "apiserver": "api.geetest.com",
    "staticservers": ["static.geetest.com", "static.geevisit.com"],
    "product": "embed",
    "lang": "zh-cn",
    "bg": "",
    "fullbg": "",
    "slice": "",
    "xpos": 0,
    "ypos": 0,
    "height": 116,
    "width": $_BDZ(300),
    "type": "slide",
    "sandbox": !1,
    "autoReset": !0,
    "challenge": "",
    "gt": "",
    "https": !1,
    "logo": !0,
    "mobile": !1,
    "theme": "ant",
    "theme_version": "1.2.7",
    "version": "7.9.3",
    "feedback": "http://www.geetest.com/contact",
    "homepage": "https://www.geetest.com/first_page",
    "show_delay": 250,
    "hide_delay": 800,
    "$_BHEO": function (t) {
        var n = this;
        return new ut(t)["$_CEj"](function (t, e) {
            n[t] = e;
        }), n;
    }
};

function ne(t, e) {
    var n = this;
    var r = new re(t);
    r["remUnit"] && !isNaN(r["remUnit"]) && (gt = "rem", vt = r["remUnit"]),
    r["https"] && (r["protocol"] = "https://"),
    t["debugConfig"] && r["$_BHEO"](t["debugConfig"]);
    n["$_CJQ"] = r,
        // n["$_DAa"] = t,
        // n["$_BHFY"] = new J(n),
        // n["$_BBHA"] = new Z(function (t, e) {
        //     n["$_BHGD"](t, e);
        // }),
        // n["$_BBHA"]["$_HAy"](Bt),
        // n["$_BHHO"] = $_BCm(),
        // n["$_BHIq"] = b ? 3 : 0,
        // n["$_BHJZ"] = b ? "web_mobile" : "web",
        n["$_CJQ"]["$_DHz"] = {
            "$_BCm": n["$_BHIq"]
        };
}


function calc_w3(t, e, n) {
    var r = this,
        i = r["$_CJQ"],
        o = {
            "lang": i["lang"] || "zh-cn",
            "userresponse": H(t, i["challenge"]),
            "passtime": n,
            "imgload": r["$_CAGC"],
            "aa": e,
            "ep": r["$_CCC_"]()
        };
    try {
        if (window["_gct"]) {
            var s = {
                    "lang": o["lang"],
                    "ep": o["ep"]
                },
                a = window["_gct"](s);
            if (a["lang"]) {
                var _ = function d(t) {
                        for (var e in t) if ("ep" !== e && "lang" !== e) return e;
                    }(s),
                    c = function p(t, e, n) {
                        for (var r = new t["gg"]["f"](e, n), i = ["n", "s", "e", "es", "en", "w", "wn", "ws"], o = i["length"] - 2, s = 0; s < n["length"]; s++) {
                            var a,
                                _ = Math["abs"](n[s]["charCodeAt"]() - 70)["toString"]()[1];
                            a = o < _ ? t["gg"][i[1 + o]](r) : t["gg"][i[_]](r);
                            for (var c = Math["abs"](n[s]["charCodeAt"]() - 70)["toString"]()[0], u = 0; u < c; u++) a["cc"]();
                        }
                        return r["random"]["join"]("")["slice"](0, 10);
                    }(a, s, _);
                s[_] = c;
            }
            !function g(t) {
                if ("function" == typeof Object["assign"]) return Object["assign"]["apply"](Object, arguments);
                if (null == t) throw new Error("Cannot convert undefined or null to object");
                t = Object(t);
                for (var e = 1; e < arguments["length"]; e++) {
                    var n = arguments[e];
                    if (null !== n) for (var r in n) Object["prototype"]["hasOwnProperty"]["call"](n, r) && (t[r] = n[r]);
                }
                return t;
            }(o, s);
        }
    } catch (v) {
    }
    i["offline"] && (o["x"] = t), o["rp"] = X(i["gt"] + i["challenge"]["slice"](0, 32) + o["passtime"]);
    var u = r["$_CCDh"](),
        l = V["encrypt"](JSON["stringify"](o), r["$_CCEp"]()),
        h = m["$_FEu"](l),
        f = {
            "gt": i["gt"],
            "challenge": i["challenge"],
            "lang": o["lang"],
            "$_BCm": r["$_BHIq"],
            "client_type": r["$_BHJZ"],
            "w": h + u
        };
    I(r["$_CJQ"], "/ajax.php", f)["$_DGt"](function (t) {
        if (t["status"] == Ht) return z(F(t, r, "/ajax.php"));
        r["$_CCFy"]($_BBj(t));
    }, function () {
        return z($("url_ajax", r));
    });
}