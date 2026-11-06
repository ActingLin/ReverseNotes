var window = globalThis;
window.location = {
    "protocol": "https:"
}
window.navigator = {
    appName: "Netscape",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    hardwareConcurrency: 12
}
window.document = {
    createElement: function () {
        return {
            getContext: function () {

            }
        }
    },

}

var pe = window["navigator"];
var a = window["location"];
var N = window["document"]
var p = {
    "$_FJP": {
        "$_GAF": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()",
        "$_GBn": ".",
        "$_GCC": 7274496,
        "$_GDn": 9483264,
        "$_GE_": 19220,
        "$_GFq": 235,
        "$_GGH": 24
    },
    "$_GAF": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()",
    "$_GBn": ".",
    "$_GCC": 7274496,
    "$_GDn": 9483264,
    "$_GE_": 19220,
    "$_GFq": 235,
    "$_GGH": 24,
    "$_GHU": function (e) {
        for (var t = [], n = 0, r = e["length"]; n < r; n += 1) t["push"](e["charCodeAt"](n));
        return t;
    },
    "$_GIW": function (e) {
        for (var t = "", n = 0, r = e["length"]; n < r; n += 1) t += String["fromCharCode"](e[n]);
        return t;
    },
    "$_GJ_": function (e) {
        var t = this["$_GAF"];
        return e < 0 || e >= t["length"] ? "." : t["charAt"](e);
    },
    "$_HAA": function (e) {
        return this["$_GAF"]["indexOf"](e);
    },
    "$_HBZ": function (e, t) {
        return e >> t & 1;
    },
    "$_HCB": function (e, o) {
        var i = this;
        o || (o = i);
        for (var t = function (e, t) {
            for (var n = 0, r = o["$_GGH"] - 1; 0 <= r; r -= 1) 1 === i["$_HBZ"](t, r) && (n = (n << 1) + i["$_HBZ"](e, r));
            return n;
        }, n = "", r = "", s = e["length"], a = 0; a < s; a += 3) {
            var _;
            if (a + 2 < s) _ = (e[a] << 16) + (e[a + 1] << 8) + e[a + 2], n += i["$_GJ_"](t(_, o["$_GCC"])) + i["$_GJ_"](t(_, o["$_GDn"])) + i["$_GJ_"](t(_, o["$_GE_"])) + i["$_GJ_"](t(_, o["$_GFq"])); else {
                var c = s % 3;
                2 == c ? (_ = (e[a] << 16) + (e[a + 1] << 8), n += i["$_GJ_"](t(_, o["$_GCC"])) + i["$_GJ_"](t(_, o["$_GDn"])) + i["$_GJ_"](t(_, o["$_GE_"])), r = o["$_GBn"]) : 1 == c && (_ = e[a] << 16, n += i["$_GJ_"](t(_, o["$_GCC"])) + i["$_GJ_"](t(_, o["$_GDn"])), r = o["$_GBn"] + o["$_GBn"]);
            }
        }
        return {
            "res": n,
            "end": r
        };
    },
    "$_HDl": function (e) {
        var t = this["$_HCB"](this["$_GHU"](e));
        return t["res"] + t["end"];
    },
    "$_HEJ": function (e) {
        var t = this["$_HCB"](e);
        return t["res"] + t["end"];
    },
    "$_HFz": function (e, i) {
        var s = this;
        i || (i = s);
        for (var t = function (e, t) {
            if (e < 0) return 0;
            for (var n = 5, r = 0, o = i["$_GGH"] - 1; 0 <= o; o -= 1) 1 === s["$_HBZ"](t, o) && (r += s["$_HBZ"](e, n) << o, n -= 1);
            return r;
        }, n = e["length"], r = "", o = 0; o < n; o += 4) {
            var a = t(s["$_HAA"](e["charAt"](o)), i["$_GCC"]) + t(s["$_HAA"](e["charAt"](o + 1)), i["$_GDn"]) + t(s["$_HAA"](e["charAt"](o + 2)), i["$_GE_"]) + t(s["$_HAA"](e["charAt"](o + 3)), i["$_GFq"]),
                _ = a >> 16 & 255;
            if (r += String["fromCharCode"](_), e["charAt"](o + 2) !== i["$_GBn"]) {
                var c = a >> 8 & 255;
                if (r += String["fromCharCode"](c), e["charAt"](o + 3) !== i["$_GBn"]) {
                    var l = 255 & a;
                    r += String["fromCharCode"](l);
                }
            }
        }
        return r;
    },
    "$_HGf": function (e) {
        var t = 4 - e["length"] % 4;
        if (t < 4) for (var n = 0; n < t; n += 1) e += this["$_GBn"];
        return this["$_HFz"](e);
    },
    "$_HHl": function (e) {
        return this["$_HGf"](e);
    }
}
var d = a["protocol"] + "//";
var ge = "px";
var ve = 1;
var w = /Mobi/i["test"](pe["userAgent"]);
var y = /msie 6\.0/i["test"](pe["userAgent"]);
var b = /msie 7\.0/i["test"](pe["userAgent"]);
var t;
var x = (t = N["createElement"]("canvas"), n = t["getContext"] && t["getContext"]("2d"), r = /msie/i["test"](pe["userAgent"]), !n && r);


function Ae() {
    this["$_BGS"] = this["$_BGHv"]();
}

function Ze(e, t) {
    var n = this,
        r = new Qe(e);
    r["remUnit"] && !isNaN(r["remUnit"]) && (ge = "rem", ve = r["remUnit"]),
    r["autoLanguage"] && !r["hasOwnProperty"]("lang") && (r["lang"] = $_Ja($_BAt())),
    r["https"] && (r["protocol"] = "https://"),
    e["debugConfig"] && r["$_BJBm"](e["debugConfig"]),
    "float" !== r["product"] && "popup" !== r["product"] && "custom" !== r["product"] && "bind" !== r["product"] && (r["product"] = "float"),
    (w || y) && "float" === r["product"] && (r["product"] = "popup"),
    y && "custom" === r["product"] && (r["product"] = "popup"),
        r["cc"] = pe["hardwareConcurrency"] || 0,
        r["supportWorker"] = "undefined" != typeof Worker,
        // n["$_BJCe"] = new Ae(),
        n["$_EIc"] = r,
        n["$_EJN"] = e,
        // n["$_BJDV"] = new U(n),
        // n["$_BAAk"] = new Y(function (e, t) {
        //     n["$_BJEe"](e, t);
        // }),
        // n["$_BJFE"] = t,
        n["$_BJG_"] = w ? 3 : 0,
        n["$_BJHm"] = w ? "web_mobile" : "web", n["$_BJIg"] = -1,
        n["$_EIc"]["$_FFL"] = {
            "pt": 0
        };
    // n["$_BAAk"]["$_HIY"](Oe),
    // n["$_BJJT"] = new Te();
    // n["$_BDHn"] = new De();
}

function Qe(e) {
    this["$_CAAa"] = $_Ei(),
        this["$_BJBm"]({
            "protocol": d
        })["$_BJBm"](e);
}

function $_DJL(e) {
    this["$_BAEW"] = e || [];
}

function ce(e) {
    this["$_BAFP"] = e;
}


Ae["prototype"] = {
    "$_BIDL": -1,
    "$_BGHv": function () {
        return {};
    },
    "$_BIHu": function (e) {
        return void 0 === e;
    }
};
Ze['prototype'] = {
    "$_CCHP": function $_CCHP(e) {
        // console.log(this);
        return this["$_EIc"]["aeskey"] && !e || (this["$_EIc"]["aeskey"] = te()), this["$_EIc"]["aeskey"];
    },
    "$_CCGr": function $_CCGr(e) {
        var t = new X()["encrypt"](this["$_CCHP"](e));
        while (!t || 256 !== t["length"]) t = new X()["encrypt"](this["$_CCHP"](!0));
        return t;
    },
    "$_BIBC": function $_BIBC() {
        var n = new Ae(),
            r = n["$_BGS"],
            o = [];
        // console.log(r);
        var arr = [
            "textLength",
            "HTMLLength",
            "documentMode",
            "A",
            "ARTICLE",
            "ASIDE",
            "AUDIO",
            "BASE",
            "BUTTON",
            "CANVAS",
            "CODE",
            "IFRAME",
            "IMG",
            "INPUT",
            "LABEL",
            "LINK",
            "NAV",
            "OBJECT",
            "OL",
            "PICTURE",
            "PRE",
            "SECTION",
            "SELECT",
            "SOURCE",
            "SPAN",
            "STYLE",
            "TABLE",
            "TEXTAREA",
            "VIDEO",
            "screenLeft",
            "screenTop",
            "screenAvailLeft",
            "screenAvailTop",
            "innerWidth",
            "innerHeight",
            "outerWidth",
            "outerHeight",
            "browserLanguage",
            "browserLanguages",
            "systemLanguage",
            "devicePixelRatio",
            "colorDepth",
            "userAgent",
            "cookieEnabled",
            "netEnabled",
            "screenWidth",
            "screenHeight",
            "screenAvailWidth",
            "screenAvailHeight",
            "localStorageEnabled",
            "sessionStorageEnabled",
            "indexedDBEnabled",
            "CPUClass",
            "platform",
            "doNotTrack",
            "timezone",
            "canvas2DFP",
            "canvas3DFP",
            "plugins",
            "maxTouchPoints",
            "flashEnabled",
            "javaEnabled",
            "hardwareConcurrency",
            "jsFonts",
            "timestamp",
            "performanceTiming",
            "internalip",
            "mediaDevices",
            "DIV",
            "P",
            "UL",
            "LI",
            "SCRIPT",
            "touchEvent"
        ]
        return new $_DJL(arr)["$_EBg"](function (e) {
            var t = r[e];
            o["push"](n["$_BIHu"](t) ? n["$_BIDL"] : t);
        }), o["join"]("!!");
    },
};
Qe["prototype"] = {
    "challenge": "",
    "gt": "",
    "type": "fullpage",
    "api_server": "api.geetest.com",
    "static_servers": ["static.geetest.com", "static.geevisit.com"],
    "product": "popup",
    "lang": "zh-cn",
    "width": $_BBn(300),
    "logo": !0,
    "protocol": "http://",
    "https": !1,
    "autoReset": !0,
    "version": "9.2.0-guwyxh",
    "theme": "wind",
    "theme_version": "1.5.9",
    "homepage": "https://www.geetest.com/first_page",
    "$_BJBm": function (e) {
        return function (n, e) {
            new ce(e)["$_EFy"](function (e, t) {
                n[e] = t;
            });
        }(this, e), this;
    }
}
$_DJL["prototype"] = {
    "$_EBg": function (e) {
        var t = this["$_BAEW"];
        if (t["map"]) return new $_DJL(t["map"](e));
        for (var n = [], r = 0, o = t["length"]; r < o; r += 1) n[r] = e(t[r], r, this);
        return new $_DJL(n);
    },
}
ce["prototype"] = {
    "$_EFy": function (e) {
        var t = this["$_BAFP"];
        for (var n in t) t["hasOwnProperty"](n) && e(n, t[n]);
        return this;
    },
    // "$_BBCs": function () {
    //   var e = this["$_BAFP"];
    //   for (var t in e) if (e["hasOwnProperty"](t)) return !1;
    //   return !0;
    // }
}

function le(e) {
    this["$_FIw"] = "string" == typeof e ? N["createElement"](e) : e;
}

function Te() {
    var e = this;
    e["posX"] = 0, e["posY"] = 0, e["scrollLeft"] = 0, e["scrollTop"] = 0, e["lastTime"] = 0, e["$_BGS"] = [], e["$_BFJI"] = new le(N), e["$_BGAm"] = new le(window), e["$_BGBk"] = null, e["$_BGCU"] = null, e["$_BGDG"] = 0, e["$_BGEr"] = 0, e["$_BGFA"] = 0, e["$_BGGo"]();
}

function $_BAt() {
    return ("Netscape" === pe["appName"] ? pe["language"] : pe["userLanguage"])["substr"](0, 2);
}

function $_Ja(e) {
    if (!e) return "zh";
    var t = e["toLowerCase"](),
        n = t["split"]("-"),
        r = n[0];
    if (3 === n["length"]) {
        var o = n[2];
        "hans" === $_Iv(n[1]) ? o = "" : "hant" === $_Iv(n[1]) && (o = "tw"), t = r + o;
    }
    return t;
}

function $_BFr() {
    var e,
        n = Object["create"] || function () {
            function n() {
            }

            return function (e) {
                var t;
                return n["prototype"] = e, t = new n(), n["prototype"] = null, t;
            };
        }(),
        t = {},
        r = t["lib"] = {},
        o = r["Base"] = {
            "extend": function (e) {
                var t = n(this);
                return e && t["mixIn"](e), t["hasOwnProperty"]("init") && this["init"] !== t["init"] || (t["init"] = function () {
                    t["$super"]["init"]["apply"](this, arguments);
                }), (t["init"]["prototype"] = t)["$super"] = this, t;
            },
            "create": function () {
                var e = this["extend"]();
                return e["init"]["apply"](e, arguments), e;
            },
            "init": function () {
            },
            "mixIn": function (e) {
                for (var t in e) e["hasOwnProperty"](t) && (this[t] = e[t]);
                e["hasOwnProperty"]("toString") && (this["toString"] = e["toString"]);
            }
        },
        l = r["WordArray"] = o["extend"]({
            "init": function (e, t) {
                e = this["words"] = e || [], t != undefined ? this["sigBytes"] = t : this["sigBytes"] = 4 * e["length"];
            },
            "concat": function (e) {
                var t = this["words"],
                    n = e["words"],
                    r = this["sigBytes"],
                    o = e["sigBytes"];
                if (this["clamp"](), r % 4) for (var i = 0; i < o; i++) {
                    var s = n[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                    t[r + i >>> 2] |= s << 24 - (r + i) % 4 * 8;
                } else for (i = 0; i < o; i += 4) t[r + i >>> 2] = n[i >>> 2];
                return this["sigBytes"] += o, this;
            },
            "clamp": function () {
                var e = this["words"],
                    t = this["sigBytes"];
                e[t >>> 2] &= 4294967295 << 32 - t % 4 * 8, e["length"] = Math["ceil"](t / 4);
            }
        }),
        i = t["enc"] = {},
        u = i["Latin1"] = {
            "parse": function (e) {
                for (var t = e["length"], n = [], r = 0; r < t; r++) n[r >>> 2] |= (255 & e["charCodeAt"](r)) << 24 - r % 4 * 8;
                return new l["init"](n, t);
            }
        },
        s = i["Utf8"] = {
            "parse": function (e) {
                return u["parse"](unescape(encodeURIComponent(e)));
            }
        },
        a = r["BufferedBlockAlgorithm"] = o["extend"]({
            "reset": function () {
                this["$_BGS"] = new l["init"](), this["$_BHV"] = 0;
            },
            "$_BIs": function (e) {
                "string" == typeof e && (e = s["parse"](e)), this["$_BGS"]["concat"](e), this["$_BHV"] += e["sigBytes"];
            },
            "$_BJL": function (e) {
                var t = this["$_BGS"],
                    n = t["words"],
                    r = t["sigBytes"],
                    o = this["blockSize"],
                    i = r / (4 * o),
                    s = (i = e ? Math["ceil"](i) : Math["max"]((0 | i) - this["$_CAZ"], 0)) * o,
                    a = Math["min"](4 * s, r);
                if (s) {
                    for (var _ = 0; _ < s; _ += o) this["$_CBZ"](n, _);
                    var c = n["splice"](0, s);
                    t["sigBytes"] -= a;
                }
                return new l["init"](c, a);
            },
            "$_CAZ": 0
        }),
        _ = t["algo"] = {},
        c = r["Cipher"] = a["extend"]({
            "cfg": o["extend"](),
            "createEncryptor": function (e, t) {
                return this["create"](this["$_CCj"], e, t);
            },
            "init": function (e, t, n) {
                this["cfg"] = this["cfg"]["extend"](n), this["$_CDi"] = e, this["$_CEL"] = t, this["reset"]();
            },
            "reset": function () {
                a["reset"]["call"](this), this["$_CFb"]();
            },
            "process": function (e) {
                return this["$_BIs"](e), this["$_BJL"]();
            },
            "finalize": function (e) {
                return e && this["$_BIs"](e), this["$_CGH"]();
            },
            "keySize": 4,
            "ivSize": 4,
            "$_CCj": 1,
            "$_CHR": 2,
            "$_CIQ": function (c) {
                return {
                    "encrypt": function (e, t, n) {
                        t = u["parse"](t), n && n["iv"] || ((n = n || {})["iv"] = u["parse"]("0000000000000000"));
                        for (var r = m["encrypt"](c, e, t, n), o = r["ciphertext"]["words"], i = r["ciphertext"]["sigBytes"], s = [], a = 0; a < i; a++) {
                            var _ = o[a >>> 2] >>> 24 - a % 4 * 8 & 255;
                            s["push"](_);
                        }
                        return s;
                    },
                    "encrypt1": function (e, t, n) {
                        t = u["parse"](t), n && n["iv"] || ((n = n || {})["iv"] = u["parse"]("0000000000000000"));
                        for (var r = m["encrypt"](c, e, t, n), o = r["ciphertext"]["words"], i = r["ciphertext"]["sigBytes"], s = [], a = 0; a < i; a++) {
                            var _ = o[a >>> 2] >>> 24 - a % 4 * 8 & 255;
                            s["push"](_);
                        }
                        return s;
                    }
                };
            }
        }),
        p = t["mode"] = {},
        h = r["BlockCipherMode"] = o["extend"]({
            "createEncryptor": function (e, t) {
                return this["Encryptor"]["create"](e, t);
            },
            "init": function (e, t) {
                this["$_CJV"] = e, this["$_DAK"] = t;
            }
        }),
        f = p["CBC"] = ((e = h["extend"]())["Encryptor"] = e["extend"]({
            "processBlock": function (e, t) {
                var n = this["$_CJV"],
                    r = n["blockSize"];
                (function s(e, t, n) {
                    var r = this["$_DAK"];
                    if (r) {
                        var o = r;
                        this["$_DAK"] = undefined;
                    } else var o = this["$_DBf"];
                    for (var i = 0; i < n; i++) e[t + i] ^= o[i];
                })["call"](this, e, t, r), n["encryptBlock"](e, t), this["$_DBf"] = e["slice"](t, t + r);
            }
        }), e),
        d = (t["pad"] = {})["Pkcs7"] = {
            "pad": function (e, t) {
                for (var n = 4 * t, r = n - e["sigBytes"] % n, o = r << 24 | r << 16 | r << 8 | r, i = [], s = 0; s < r; s += 4) i["push"](o);
                var a = l["create"](i, r);
                e["concat"](a);
            }
        },
        g = r["BlockCipher"] = c["extend"]({
            "cfg": c["cfg"]["extend"]({
                "mode": f,
                "padding": d
            }),
            "reset": function () {
                c["reset"]["call"](this);
                var e = this["cfg"],
                    t = e["iv"],
                    n = e["mode"];
                if (this["$_CDi"] == this["$_CCj"]) var r = n["createEncryptor"];
                this["$_DCu"] && this["$_DCu"]["$_DDa"] == r ? this["$_DCu"]["init"](this, t && t["words"]) : (this["$_DCu"] = r["call"](n, this, t && t["words"]), this["$_DCu"]["$_DDa"] = r);
            },
            "$_CBZ": function (e, t) {
                this["$_DCu"]["processBlock"](e, t);
            },
            "$_CGH": function () {
                var e = this["cfg"]["padding"];
                if (this["$_CDi"] == this["$_CCj"]) {
                    e["pad"](this["$_BGS"], this["blockSize"]);
                    var t = this["$_BJL"](!0);
                }
                return t;
            },
            "blockSize": 4
        }),
        v = r["CipherParams"] = o["extend"]({
            "init": function (e) {
                this["mixIn"](e);
            }
        }),
        m = r["SerializableCipher"] = o["extend"]({
            "cfg": o["extend"](),
            "encrypt": function (e, t, n, r) {
                r = this["cfg"]["extend"](r);
                var o = e["createEncryptor"](n, r),
                    i = o["finalize"](t),
                    s = o["cfg"];
                return v["create"]({
                    "ciphertext": i,
                    "key": n,
                    "iv": s["iv"],
                    "algorithm": e,
                    "mode": s["mode"],
                    "padding": s["padding"],
                    "blockSize": e["blockSize"],
                    "formatter": r["format"]
                });
            }
        }),
        x = [],
        w = [],
        y = [],
        b = [],
        E = [],
        C = [],
        k = [],
        S = [],
        T = [],
        A = [];
    !function () {
        for (var e = [], t = 0; t < 256; t++) e[t] = t < 128 ? t << 1 : t << 1 ^ 283;
        var n = 0,
            r = 0;
        for (t = 0; t < 256; t++) {
            var o = r ^ r << 1 ^ r << 2 ^ r << 3 ^ r << 4;
            o = o >>> 8 ^ 255 & o ^ 99, x[n] = o;
            var i = e[w[o] = n],
                s = e[i],
                a = e[s],
                _ = 257 * e[o] ^ 16843008 * o;
            y[n] = _ << 24 | _ >>> 8, b[n] = _ << 16 | _ >>> 16, E[n] = _ << 8 | _ >>> 24, C[n] = _;
            _ = 16843009 * a ^ 65537 * s ^ 257 * i ^ 16843008 * n;
            k[o] = _ << 24 | _ >>> 8, S[o] = _ << 16 | _ >>> 16, T[o] = _ << 8 | _ >>> 24, A[o] = _, n ? (n = i ^ e[e[e[a ^ i]]], r ^= e[e[r]]) : n = r = 1;
        }
    }();
    var D = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
        O = _["AES"] = g["extend"]({
            "$_CFb": function () {
                if (!this["$_DEL"] || this["$_DFi"] !== this["$_CEL"]) {
                    for (var e = this["$_DFi"] = this["$_CEL"], t = e["words"], n = e["sigBytes"] / 4, r = 4 * (1 + (this["$_DEL"] = 6 + n)), o = this["$_DGM"] = [], i = 0; i < r; i++) if (i < n) o[i] = t[i]; else {
                        var s = o[i - 1];
                        i % n ? 6 < n && i % n == 4 && (s = x[s >>> 24] << 24 | x[s >>> 16 & 255] << 16 | x[s >>> 8 & 255] << 8 | x[255 & s]) : (s = x[(s = s << 8 | s >>> 24) >>> 24] << 24 | x[s >>> 16 & 255] << 16 | x[s >>> 8 & 255] << 8 | x[255 & s], s ^= D[i / n | 0] << 24), o[i] = o[i - n] ^ s;
                    }
                    for (var a = this["$_DHB"] = [], _ = 0; _ < r; _++) {
                        i = r - _;
                        if (_ % 4) s = o[i]; else s = o[i - 4];
                        a[_] = _ < 4 || i <= 4 ? s : k[x[s >>> 24]] ^ S[x[s >>> 16 & 255]] ^ T[x[s >>> 8 & 255]] ^ A[x[255 & s]];
                    }
                }
            },
            "encryptBlock": function (e, t) {
                this["$_DIY"](e, t, this["$_DGM"], y, b, E, C, x);
            },
            "$_DIY": function (e, t, n, r, o, i, s, a) {
                for (var _ = this["$_DEL"], c = e[t] ^ n[0], l = e[t + 1] ^ n[1], u = e[t + 2] ^ n[2], p = e[t + 3] ^ n[3], h = 4, f = 1; f < _; f++) {
                    var d = r[c >>> 24] ^ o[l >>> 16 & 255] ^ i[u >>> 8 & 255] ^ s[255 & p] ^ n[h++],
                        g = r[l >>> 24] ^ o[u >>> 16 & 255] ^ i[p >>> 8 & 255] ^ s[255 & c] ^ n[h++],
                        v = r[u >>> 24] ^ o[p >>> 16 & 255] ^ i[c >>> 8 & 255] ^ s[255 & l] ^ n[h++],
                        m = r[p >>> 24] ^ o[c >>> 16 & 255] ^ i[l >>> 8 & 255] ^ s[255 & u] ^ n[h++];
                    c = d, l = g, u = v, p = m;
                }
                d = (a[c >>> 24] << 24 | a[l >>> 16 & 255] << 16 | a[u >>> 8 & 255] << 8 | a[255 & p]) ^ n[h++], g = (a[l >>> 24] << 24 | a[u >>> 16 & 255] << 16 | a[p >>> 8 & 255] << 8 | a[255 & c]) ^ n[h++], v = (a[u >>> 24] << 24 | a[p >>> 16 & 255] << 16 | a[c >>> 8 & 255] << 8 | a[255 & l]) ^ n[h++], m = (a[p >>> 24] << 24 | a[c >>> 16 & 255] << 16 | a[l >>> 8 & 255] << 8 | a[255 & u]) ^ n[h++];
                e[t] = d, e[t + 1] = g, e[t + 2] = v, e[t + 3] = m;
            },
            "keySize": 8
        });
    return t["AES"] = g["$_CIQ"](O), t["AES"];
}

function $_Ei() {
    return parseInt(1e4 * Math["random"]()) + new Date()["valueOf"]();
}

function $_BBn(e) {
    try {
        return (e / ve)["toFixed"](4) + ge;
    } catch (t) {
        return e + "px";
    }
}

te = function te() {
    function e() {
        return (65536 * (1 + Math["random"]()) | 0)["toString"](16)["substring"](1);
    }

    return function () {
        return e() + e() + e() + e();
    };
}();
var X = function () {
    function n() {
        this["i"] = 0, this["j"] = 0, this["S"] = [];
    }

    n["prototype"]["init"] = function C(e) {
        var t, n, r;
        for (t = 0; t < 256; ++t) this["S"][t] = t;
        for (t = n = 0; t < 256; ++t) n = n + this["S"][t] + e[t % e["length"]] & 255, r = this["S"][t], this["S"][t] = this["S"][n], this["S"][n] = r;
        this["i"] = 0, this["j"] = 0;
    }, n["prototype"]["next"] = function k() {
        var e;
        return this["i"] = this["i"] + 1 & 255, this["j"] = this["j"] + this["S"][this["i"]] & 255, e = this["S"][this["i"]], this["S"][this["i"]] = this["S"][this["j"]], this["S"][this["j"]] = e, this["S"][e + this["S"][this["i"]] & 255];
    };
    var r,
        o,
        i,
        e,
        s = 256;
    if (null == o) {
        var t;
        o = [], i = 0;
        try {
            if (window["crypto"] && window["crypto"]["getRandomValues"]) {
                var a = new Uint32Array(256);
                for (window["crypto"]["getRandomValues"](a), t = 0; t < a["length"]; ++t) o[i++] = 255 & a[t];
            }
        } catch (S) {
        }
        var _ = 0,
            c = function (e) {
                if (256 <= (_ = _ || 0) || s <= i) window["removeEventListener"] ? (_ = 0, window["removeEventListener"]("mousemove", c, !1)) : window["detachEvent"] && (_ = 0, window["detachEvent"]("onmousemove", c)); else try {
                    var t = e["x"] + e["y"];
                    o[i++] = 255 & t, _ += 1;
                } catch (S) {
                }
            };
        window["addEventListener"] ? window["addEventListener"]("mousemove", c, !1) : window["attachEvent"] && window["attachEvent"]("onmousemove", c);
    }

    function l() {
        if (null == r) {
            r = function t() {
                return new n();
            }();
            while (i < s) {
                var e = Math["floor"](65536 * Math["random"]());
                o[i++] = 255 & e;
            }
            for (r["init"](o), i = 0; i < o["length"]; ++i) o[i] = 0;
            i = 0;
        }
        return r["next"]();
    }

    function u() {
    }

    u["prototype"]["nextBytes"] = function T(e) {
        var t;
        for (t = 0; t < e["length"]; ++t) e[t] = l();
    };

    function x(e, t, n) {
        null != e && ("number" == typeof e ? this["fromNumber"](e, t, n) : null == t && "string" != typeof e ? this["fromString"](e, 256) : this["fromString"](e, t));
    }

    function w() {
        return new x(null);
    }

    e = "Microsoft Internet Explorer" == pe["appName"] ? (x["prototype"]["am"] = function A(e, t, n, r, o, i) {
        var s = 32767 & t,
            a = t >> 15;
        while (0 <= --i) {
            var _ = 32767 & this[e],
                c = this[e++] >> 15,
                l = a * _ + c * s;
            o = ((_ = s * _ + ((32767 & l) << 15) + n[r] + (1073741823 & o)) >>> 30) + (l >>> 15) + a * c + (o >>> 30), n[r++] = 1073741823 & _;
        }
        return o;
    }, 30) : "Netscape" != pe["appName"] ? (x["prototype"]["am"] = function D(e, t, n, r, o, i) {
        while (0 <= --i) {
            var s = t * this[e++] + n[r] + o;
            o = Math["floor"](s / 67108864), n[r++] = 67108863 & s;
        }
        return o;
    }, 26) : (x["prototype"]["am"] = function O(e, t, n, r, o, i) {
        var s = 16383 & t,
            a = t >> 14;
        while (0 <= --i) {
            var _ = 16383 & this[e],
                c = this[e++] >> 14,
                l = a * _ + c * s;
            o = ((_ = s * _ + ((16383 & l) << 14) + n[r] + o) >> 28) + (l >> 14) + a * c, n[r++] = 268435455 & _;
        }
        return o;
    }, 28), x["prototype"]["DB"] = e, x["prototype"]["DM"] = (1 << e) - 1, x["prototype"]["DV"] = 1 << e;
    x["prototype"]["FV"] = Math["pow"](2, 52), x["prototype"]["F1"] = 52 - e, x["prototype"]["F2"] = 2 * e - 52;
    var p,
        h,
        f = "0123456789abcdefghijklmnopqrstuvwxyz",
        d = [];
    for (p = "0"["charCodeAt"](0), h = 0; h <= 9; ++h) d[p++] = h;
    for (p = "a"["charCodeAt"](0), h = 10; h < 36; ++h) d[p++] = h;
    for (p = "A"["charCodeAt"](0), h = 10; h < 36; ++h) d[p++] = h;

    function g(e) {
        return f["charAt"](e);
    }

    function v(e) {
        var t = w();
        return t["fromInt"](e), t;
    }

    function y(e) {
        var t,
            n = 1;
        return 0 != (t = e >>> 16) && (e = t, n += 16), 0 != (t = e >> 8) && (e = t, n += 8), 0 != (t = e >> 4) && (e = t, n += 4), 0 != (t = e >> 2) && (e = t, n += 2), 0 != (t = e >> 1) && (e = t, n += 1), n;
    }

    function m(e) {
        this["m"] = e;
    }

    function b(e) {
        this["m"] = e, this["mp"] = e["invDigit"](), this["mpl"] = 32767 & this["mp"], this["mph"] = this["mp"] >> 15, this["um"] = (1 << e["DB"] - 15) - 1, this["mt2"] = 2 * e["t"];
    }

    function E() {
        this["n"] = null, this["e"] = 0, this["d"] = null, this["p"] = null, this["q"] = null, this["dmp1"] = null, this["dmq1"] = null, this["coeff"] = null;
        this["setPublic"]("00C1E3934D1614465B33053E7F48EE4EC87B14B95EF88947713D25EECBFF7E74C7977D02DC1D9451F79DD5D1C10C29ACB6A9B4D6FB7D0A0279B6719E1772565F09AF627715919221AEF91899CAE08C0D686D748B20A3603BE2318CA6BC2B59706592A9219D0BF05C9F65023A21D2330807252AE0066D59CEEFA5F2748EA80BAB81", "10001");
    }

    return m["prototype"]["convert"] = function L(e) {
        return e["s"] < 0 || 0 <= e["compareTo"](this["m"]) ? e["mod"](this["m"]) : e;
    }, m["prototype"]["revert"] = function N(e) {
        return e;
    }, m["prototype"]["reduce"] = function R(e) {
        e["divRemTo"](this["m"], null, e);
    }, m["prototype"]["mulTo"] = function j(e, t, n) {
        e["multiplyTo"](t, n), this["reduce"](n);
    }, m["prototype"]["sqrTo"] = function B(e, t) {
        e["squareTo"](t), this["reduce"](t);
    }, b["prototype"]["convert"] = function M(e) {
        var t = w();
        return e["abs"]()["dlShiftTo"](this["m"]["t"], t), t["divRemTo"](this["m"], null, t), e["s"] < 0 && 0 < t["compareTo"](x["ZERO"]) && this["m"]["subTo"](t, t), t;
    }, b["prototype"]["revert"] = function P(e) {
        var t = w();
        return e["copyTo"](t), this["reduce"](t), t;
    }, b["prototype"]["reduce"] = function q(e) {
        while (e["t"] <= this["mt2"]) e[e["t"]++] = 0;
        for (var t = 0; t < this["m"]["t"]; ++t) {
            var n = 32767 & e[t],
                r = n * this["mpl"] + ((n * this["mph"] + (e[t] >> 15) * this["mpl"] & this["um"]) << 15) & e["DM"];
            e[n = t + this["m"]["t"]] += this["m"]["am"](0, r, e, t, 0, this["m"]["t"]);
            while (e[n] >= e["DV"]) e[n] -= e["DV"], e[++n]++;
        }
        e["clamp"](), e["drShiftTo"](this["m"]["t"], e), 0 <= e["compareTo"](this["m"]) && e["subTo"](this["m"], e);
    }, b["prototype"]["mulTo"] = function I(e, t, n) {
        e["multiplyTo"](t, n), this["reduce"](n);
    }, b["prototype"]["sqrTo"] = function F(e, t) {
        e["squareTo"](t), this["reduce"](t);
    }, x["prototype"]["copyTo"] = function z(e) {
        for (var t = this["t"] - 1; 0 <= t; --t) e[t] = this[t];
        e["t"] = this["t"], e["s"] = this["s"];
    }, x["prototype"]["fromInt"] = function G(e) {
        this["t"] = 1, this["s"] = e < 0 ? -1 : 0, 0 < e ? this[0] = e : e < -1 ? this[0] = e + this["DV"] : this["t"] = 0;
    }, x["prototype"]["fromString"] = function H(e, t) {
        var n;
        if (16 == t) n = 4; else if (8 == t) n = 3; else if (256 == t) n = 8; else if (2 == t) n = 1; else if (32 == t) n = 5; else {
            if (4 != t) return void this["fromRadix"](e, t);
            n = 2;
        }
        this["t"] = 0, this["s"] = 0;
        var r,
            o,
            i = e["length"],
            s = !1,
            a = 0;
        while (0 <= --i) {
            var _ = 8 == n ? 255 & e[i] : (r = i, null == (o = d[e["charCodeAt"](r)]) ? -1 : o);
            _ < 0 ? "-" == e["charAt"](i) && (s = !0) : (s = !1, 0 == a ? this[this["t"]++] = _ : a + n > this["DB"] ? (this[this["t"] - 1] |= (_ & (1 << this["DB"] - a) - 1) << a, this[this["t"]++] = _ >> this["DB"] - a) : this[this["t"] - 1] |= _ << a, (a += n) >= this["DB"] && (a -= this["DB"]));
        }
        8 == n && 0 != (128 & e[0]) && (this["s"] = -1, 0 < a && (this[this["t"] - 1] |= (1 << this["DB"] - a) - 1 << a)), this["clamp"](), s && x["ZERO"]["subTo"](this, this);
    }, x["prototype"]["clamp"] = function X() {
        var e = this["s"] & this["DM"];
        while (0 < this["t"] && this[this["t"] - 1] == e) --this["t"];
    }, x["prototype"]["dlShiftTo"] = function V(e, t) {
        var n;
        for (n = this["t"] - 1; 0 <= n; --n) t[n + e] = this[n];
        for (n = e - 1; 0 <= n; --n) t[n] = 0;
        t["t"] = this["t"] + e, t["s"] = this["s"];
    }, x["prototype"]["drShiftTo"] = function U(e, t) {
        for (var n = e; n < this["t"]; ++n) t[n - e] = this[n];
        t["t"] = Math["max"](this["t"] - e, 0), t["s"] = this["s"];
    }, x["prototype"]["lShiftTo"] = function $(e, t) {
        var n,
            r = e % this["DB"],
            o = this["DB"] - r,
            i = (1 << o) - 1,
            s = Math["floor"](e / this["DB"]),
            a = this["s"] << r & this["DM"];
        for (n = this["t"] - 1; 0 <= n; --n) t[n + s + 1] = this[n] >> o | a, a = (this[n] & i) << r;
        for (n = s - 1; 0 <= n; --n) t[n] = 0;
        t[s] = a, t["t"] = this["t"] + s + 1, t["s"] = this["s"], t["clamp"]();
    }, x["prototype"]["rShiftTo"] = function Y(e, t) {
        t["s"] = this["s"];
        var n = Math["floor"](e / this["DB"]);
        if (n >= this["t"]) t["t"] = 0; else {
            var r = e % this["DB"],
                o = this["DB"] - r,
                i = (1 << r) - 1;
            t[0] = this[n] >> r;
            for (var s = n + 1; s < this["t"]; ++s) t[s - n - 1] |= (this[s] & i) << o, t[s - n] = this[s] >> r;
            0 < r && (t[this["t"] - n - 1] |= (this["s"] & i) << o), t["t"] = this["t"] - n, t["clamp"]();
        }
    }, x["prototype"]["subTo"] = function W(e, t) {
        var n = 0,
            r = 0,
            o = Math["min"](e["t"], this["t"]);
        while (n < o) r += this[n] - e[n], t[n++] = r & this["DM"], r >>= this["DB"];
        if (e["t"] < this["t"]) {
            r -= e["s"];
            while (n < this["t"]) r += this[n], t[n++] = r & this["DM"], r >>= this["DB"];
            r += this["s"];
        } else {
            r += this["s"];
            while (n < e["t"]) r -= e[n], t[n++] = r & this["DM"], r >>= this["DB"];
            r -= e["s"];
        }
        t["s"] = r < 0 ? -1 : 0, r < -1 ? t[n++] = this["DV"] + r : 0 < r && (t[n++] = r), t["t"] = n, t["clamp"]();
    }, x["prototype"]["multiplyTo"] = function J(e, t) {
        var n = this["abs"](),
            r = e["abs"](),
            o = n["t"];
        t["t"] = o + r["t"];
        while (0 <= --o) t[o] = 0;
        for (o = 0; o < r["t"]; ++o) t[o + n["t"]] = n["am"](0, r[o], t, o, 0, n["t"]);
        t["s"] = 0, t["clamp"](), this["s"] != e["s"] && x["ZERO"]["subTo"](t, t);
    }, x["prototype"]["squareTo"] = function K(e) {
        var t = this["abs"](),
            n = e["t"] = 2 * t["t"];
        while (0 <= --n) e[n] = 0;
        for (n = 0; n < t["t"] - 1; ++n) {
            var r = t["am"](n, t[n], e, 2 * n, 0, 1);
            (e[n + t["t"]] += t["am"](n + 1, 2 * t[n], e, 2 * n + 1, r, t["t"] - n - 1)) >= t["DV"] && (e[n + t["t"]] -= t["DV"], e[n + t["t"] + 1] = 1);
        }
        0 < e["t"] && (e[e["t"] - 1] += t["am"](n, t[n], e, 2 * n, 0, 1)), e["s"] = 0, e["clamp"]();
    }, x["prototype"]["divRemTo"] = function Z(e, t, n) {
        var r = e["abs"]();
        if (!(r["t"] <= 0)) {
            var o = this["abs"]();
            if (o["t"] < r["t"]) return null != t && t["fromInt"](0), void (null != n && this["copyTo"](n));
            null == n && (n = w());
            var i = w(),
                s = this["s"],
                a = e["s"],
                _ = this["DB"] - y(r[r["t"] - 1]);
            0 < _ ? (r["lShiftTo"](_, i), o["lShiftTo"](_, n)) : (r["copyTo"](i), o["copyTo"](n));
            var c = i["t"],
                l = i[c - 1];
            if (0 != l) {
                var u = l * (1 << this["F1"]) + (1 < c ? i[c - 2] >> this["F2"] : 0),
                    p = this["FV"] / u,
                    h = (1 << this["F1"]) / u,
                    f = 1 << this["F2"],
                    d = n["t"],
                    g = d - c,
                    v = null == t ? w() : t;
                i["dlShiftTo"](g, v), 0 <= n["compareTo"](v) && (n[n["t"]++] = 1, n["subTo"](v, n)), x["ONE"]["dlShiftTo"](c, v), v["subTo"](i, i);
                while (i["t"] < c) i[i["t"]++] = 0;
                while (0 <= --g) {
                    var m = n[--d] == l ? this["DM"] : Math["floor"](n[d] * p + (n[d - 1] + f) * h);
                    if ((n[d] += i["am"](0, m, n, g, 0, c)) < m) {
                        i["dlShiftTo"](g, v), n["subTo"](v, n);
                        while (n[d] < --m) n["subTo"](v, n);
                    }
                }
                null != t && (n["drShiftTo"](c, t), s != a && x["ZERO"]["subTo"](t, t)), n["t"] = c, n["clamp"](), 0 < _ && n["rShiftTo"](_, n), s < 0 && x["ZERO"]["subTo"](n, n);
            }
        }
    }, x["prototype"]["invDigit"] = function Q() {
        if (this["t"] < 1) return 0;
        var e = this[0];
        if (0 == (1 & e)) return 0;
        var t = 3 & e;
        return 0 < (t = (t = (t = (t = t * (2 - (15 & e) * t) & 15) * (2 - (255 & e) * t) & 255) * (2 - ((65535 & e) * t & 65535)) & 65535) * (2 - e * t % this["DV"]) % this["DV"]) ? this["DV"] - t : -t;
    }, x["prototype"]["isEven"] = function $_Ei() {
        return 0 == (0 < this["t"] ? 1 & this[0] : this["s"]);
    }, x["prototype"]["exp"] = function te(e, t) {
        if (4294967295 < e || e < 1) return x["ONE"];
        var n = w(),
            r = w(),
            o = t["convert"](this),
            i = y(e) - 1;
        o["copyTo"](n);
        while (0 <= --i) if (t["sqrTo"](n, r), 0 < (e & 1 << i)) t["mulTo"](r, o, n); else {
            var s = n;
            n = r, r = s;
        }
        return t["revert"](n);
    }, x["prototype"]["toString"] = function $_FX(e) {
        if (this["s"] < 0) return "-" + this["negate"]()["toString"](e);
        var t;
        if (16 == e) t = 4; else if (8 == e) t = 3; else if (2 == e) t = 1; else if (32 == e) t = 5; else {
            if (4 != e) return this["toRadix"](e);
            t = 2;
        }
        var n,
            r = (1 << t) - 1,
            o = !1,
            i = "",
            s = this["t"],
            a = this["DB"] - s * this["DB"] % t;
        if (0 < s--) {
            a < this["DB"] && 0 < (n = this[s] >> a) && (o = !0, i = g(n));
            while (0 <= s) a < t ? (n = (this[s] & (1 << a) - 1) << t - a, n |= this[--s] >> (a += this["DB"] - t)) : (n = this[s] >> (a -= t) & r, a <= 0 && (a += this["DB"], --s)), 0 < n && (o = !0), o && (i += g(n));
        }
        return o ? i : "0";
    }, x["prototype"]["negate"] = function $_Gx() {
        var e = w();
        return x["ZERO"]["subTo"](this, e), e;
    }, x["prototype"]["abs"] = function $_HX() {
        return this["s"] < 0 ? this["negate"]() : this;
    }, x["prototype"]["compareTo"] = function $_Iv(e) {
        var t = this["s"] - e["s"];
        if (0 != t) return t;
        var n = this["t"];
        if (0 != (t = n - e["t"])) return this["s"] < 0 ? -t : t;
        while (0 <= --n) if (0 != (t = this[n] - e[n])) return t;
        return 0;
    }, x["prototype"]["bitLength"] = function $_Ja() {
        return this["t"] <= 0 ? 0 : this["DB"] * (this["t"] - 1) + y(this[this["t"] - 1] ^ this["s"] & this["DM"]);
    }, x["prototype"]["mod"] = function $_BAt(e) {
        var t = w();
        return this["abs"]()["divRemTo"](e, null, t), this["s"] < 0 && 0 < t["compareTo"](x["ZERO"]) && e["subTo"](t, t), t;
    }, x["prototype"]["modPowInt"] = function $_DJL(e, t) {
        var n;
        return n = e < 256 || t["isEven"]() ? new m(t) : new b(t), this["exp"](e, n);
    }, x["ZERO"] = v(0), x["ONE"] = v(1), E["prototype"]["doPublic"] = function ce(e) {
        return e["modPowInt"](this["e"], this["n"]);
    }, E["prototype"]["setPublic"] = function le(e, t) {
        null != e && null != t && 0 < e["length"] && 0 < t["length"] ? (this["n"] = function n(e, t) {
            return new x(e, t);
        }(e, 16), this["e"] = parseInt(t, 16)) : console && console["error"] && console["error"]("Invalid RSA public key");
    }, E["prototype"]["encrypt"] = function ue(e) {
        var t = function a(e, t) {
            if (t < e["length"] + 11) return console && console["error"] && console["error"]("Message too long for RSA"), null;
            var n = [],
                r = e["length"] - 1;
            while (0 <= r && 0 < t) {
                var o = e["charCodeAt"](r--);
                o < 128 ? n[--t] = o : 127 < o && o < 2048 ? (n[--t] = 63 & o | 128, n[--t] = o >> 6 | 192) : (n[--t] = 63 & o | 128, n[--t] = o >> 6 & 63 | 128, n[--t] = o >> 12 | 224);
            }
            n[--t] = 0;
            var i = new u(),
                s = [];
            while (2 < t) {
                s[0] = 0;
                while (0 == s[0]) i["nextBytes"](s);
                n[--t] = s[0];
            }
            return n[--t] = 2, n[--t] = 0, new x(n);
        }(e, this["n"]["bitLength"]() + 7 >> 3);
        if (null == t) return null;
        var n = this["doPublic"](t);
        if (null == n) return null;
        var r = n["toString"](16);
        return 0 == (1 & r["length"]) ? r : "0" + r;
    }, E;
}()


function calc_first_w(gt, challenge) {
    var config = {
        "gt": gt,
        "challenge": challenge,
        "offline": false,
        "new_captcha": true,
        "product": "popup",
        "width": "300px",
        "https": true,
        "api_server": "apiv6.geetest.com",
        "protocol": "https://",
        "type": "fullpage",
        "static_servers": [
            "static.geetest.com/",
            "static.geevisit.com/"
        ],
        "click": "/static/js/click.3.1.2.js",
        "beeline": "/static/js/beeline.1.0.1.js",
        "voice": "/static/js/voice.1.2.6.js",
        "fullpage": "/static/js/fullpage.9.2.0-guwyxh.js",
        "slide": "/static/js/slide.7.9.3.js",
        "geetest": "/static/js/geetest.6.0.9.js",
        "aspect_radio": {
            "slide": 103,
            "click": 128,
            "voice": 128,
            "beeline": 50
        }
    }
    var t = new Ze(config),
        n = t["$_EIc"];
    // console.log(t);
    // if (!n["gt"] || !n["challenge"]) return G(I("config_lack", t));
    var e = t.$_BIBC();    // 浏览器指纹字符串
    // console.log(e)
    t["$_CCFV"] = e,
        t["$_EJN"]["cc"] = n["cc"],
        t["$_EJN"]["ww"] = n["supportWorker"],
        t["$_EJN"]["i"] = e;
    // console.log(t["$_EJN"]);
    var r = t.$_CCGr(),
        o = $_BFr()["encrypt1"](JSON["stringify"](t["$_EJN"]), t["$_CCHP"]()),  // encrypt1(指纹, aeskey)
        i = p["$_HEJ"](o),
        s = {
            "gt": t["$_EJN"]["gt"],
            "challenge": t["$_EJN"]["challenge"],
            "lang": n["lang"],
            "pt": t["$_BJG_"],
            "client_type": t["$_BJHm"],
            "w": i + r
          };

    return {
        msg: s,
        aeskey: t["$_CCHP"](),
        finger_print: e
    }
}

// var gt = "019924a82c70bb123aae90d483087f94";
// var challenge = "b6a540d0298c3fde78c5130153c7947f";
// var gen_w = calc_first_w(gt, challenge)
// console.log(gen_w);
// console.log(gen_w['w'].length);
