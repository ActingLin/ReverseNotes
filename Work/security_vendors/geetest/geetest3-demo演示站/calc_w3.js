var window = globalThis;
window.navigator = {
    appName: "Netscape",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    hardwareConcurrency: 12
}
// window.document = {}
// window.location = {}

var ht = window["navigator"];

function H(t, e) {
    for (var n = e["slice"](-2), r = [], i = 0; i < n["length"]; i++) {
        var o = n["charCodeAt"](i);
        r[i] = 57 < o ? o - 87 : o - 48;
    }
    n = 36 * r[0] + r[1];
    var s,
        a = Math["round"](t) + n,
        _ = [[], [], [], [], []],
        c = {},
        u = 0;
    i = 0;
    for (var l = (e = e["slice"](0, -2))["length"]; i < l; i++) c[s = e["charAt"](i)] || (c[s] = 1, _[u]["push"](s), u = 5 == ++u ? 0 : u);
    var h,
        f = a,
        d = 4,
        p = "",
        g = [1, 2, 5, 10, 50];
    while (0 < f) 0 <= f - g[d] ? (h = parseInt(Math["random"]() * _[d]["length"], 10), p += _[d][h], f -= g[d]) : (_["splice"](d, 1), g["splice"](d, 1), d -= 1);
    return p;
}

function $_CCC_() {
    // tm 来自 window.performance.timing（Navigation Timing API），
    // 按真实浏览器的字段顺序与差值构造：fetchStart(f)~connectEnd(k) 应等于 navigationStart(a)，
    // 不能像旧版那样把 f..k 排在 unloadEvent 之后逐级递增，否则时间线不符合规范，易被二次校验识别。
    var base = new Date().getTime() - 2000  // 模拟页面加载于约 2 秒前
    return {
        "v": "7.9.3",
        "$_BIT": false,
        "me": true,
        "tm": {
            "a": base,            // navigationStart
            "b": base + 81,       // unloadEventStart
            "c": base + 82,       // unloadEventEnd
            "d": 0,               // redirectStart
            "e": 0,               // redirectEnd
            "f": base,            // fetchStart
            "g": base,            // domainLookupStart
            "h": base,            // domainLookupEnd
            "i": base,            // connectStart
            "j": base,            // connectEnd
            "k": base,            // secureConnectionStart
            "l": base + 18,       // requestStart
            "m": base + 66,       // responseStart
            "n": base + 66,       // responseEnd
            "o": base + 81,       // domLoading
            "p": base + 185,      // domInteractive
            "q": base + 185,      // domContentLoadedEventStart
            "r": base + 191,      // domContentLoadedEventEnd
            "s": base + 191,      // domComplete
            "t": base + 191,      // loadEventStart
            "u": base + 191       // loadEventEnd
        },
        "td": -1
    }
}

function calc_aa(_road, c, s) {

    var r = $_FDd(_road);
    // console.log(r);
    // console.log(r === "T.1/102/,(!!Jt(((()())ysst(!!(j111120111111$,h");
    var e = $_BBEl(r, c, s);
    // console.log(e);
    // console.log(e === "T.1/102/,(!7!Jtt(((()())ysst(!!(j11112011Y11B11$,h");
    return e;
}

function $_FDd(road) {
    function n(t) {
        var e = "()*,-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqr",
            n = e["length"],
            r = "",
            i = Math["abs"](t),
            o = parseInt(i / n);
        n <= o && (o = n - 1), o && (r = e["charAt"](o));
        var s = "";
        return t < 0 && (s += "!"), r && (s += "$"), s + r + e["charAt"](i %= n);
    }

    var t = function (t) {
            for (var e, n, r, i = [], o = 0, s = 0, a = t["length"] - 1; s < a; s++) e = Math["round"](t[s + 1][0] - t[s][0]), n = Math["round"](t[s + 1][1] - t[s][1]), r = Math["round"](t[s + 1][2] - t[s][2]), 0 == e && 0 == n && 0 == r || (0 == e && 0 == n ? o += r : (i["push"]([e, n, r + o]), o = 0));
            return 0 !== o && i["push"]([e, n, o]), i;
        }(road),
        r = [],
        i = [],
        o = [];
    return new ct(t)["$_CAZ"](function (t) {
        var e = function (t) {
            for (var e = [[1, 0], [2, 0], [1, -1], [1, 1], [0, 1], [0, -1], [3, 0], [2, -1], [2, 1]], n = 0, r = e["length"]; n < r; n++) if (t[0] == e[n][0] && t[1] == e[n][1]) return "stuvwxyz~"[n];
            return 0;
        }(t);
        e ? i["push"](e) : (r["push"](n(t[0])), i["push"](n(t[1]))), o["push"](n(t[2]));
    }), r["join"]("") + "!!" + i["join"]("") + "!!" + o["join"]("");
}
function $_BBEl(t, e, n) {
    if (!e || !n) return t;
    var r,
        i = 0,
        o = t,
        s = e[0],
        a = e[2],
        _ = e[4];
    while (r = n["substr"](i, 2)) {
        i += 2;
        var c = parseInt(r, 16),
            u = String["fromCharCode"](c),
            l = (s * c * c + a * c + _) % t["length"];
        o = o["substr"](0, l) + u + o["substr"](l);
    }
    return o;
}

function ct(t) {
    this["$_BCAm"] = t || [];
}

ct["prototype"] = {
    "$_CAZ": function (t) {
        var e = this["$_BCAm"];
        if (e["map"]) return new ct(e["map"](t));
        for (var n = [], r = 0, i = e["length"]; r < i; r += 1) n[r] = t(e[r], r, this);
        return new ct(n);
    }
}

// md5
function X(t) {
    function _(t, e) {
        return t << e | t >>> 32 - e;
    }

    function c(t, e) {
        var n, r, i, o, s;
        return i = 2147483648 & t, o = 2147483648 & e, s = (1073741823 & t) + (1073741823 & e), (n = 1073741824 & t) & (r = 1073741824 & e) ? 2147483648 ^ s ^ i ^ o : n | r ? 1073741824 & s ? 3221225472 ^ s ^ i ^ o : 1073741824 ^ s ^ i ^ o : s ^ i ^ o;
    }

    function e(t, e, n, r, i, o, s) {
        return c(_(t = c(t, c(c(function a(t, e, n) {
            return t & e | ~t & n;
        }(e, n, r), i), s)), o), e);
    }

    function n(t, e, n, r, i, o, s) {
        return c(_(t = c(t, c(c(function a(t, e, n) {
            return t & n | e & ~n;
        }(e, n, r), i), s)), o), e);
    }

    function r(t, e, n, r, i, o, s) {
        return c(_(t = c(t, c(c(function a(t, e, n) {
            return t ^ e ^ n;
        }(e, n, r), i), s)), o), e);
    }

    function i(t, e, n, r, i, o, s) {
        return c(_(t = c(t, c(c(function a(t, e, n) {
            return e ^ (t | ~n);
        }(e, n, r), i), s)), o), e);
    }

    function o(t) {
        var e,
            n = "",
            r = "";
        for (e = 0; e <= 3; e++) n += (r = "0" + (t >>> 8 * e & 255)["toString"](16))["substr"](r["length"] - 2, 2);
        return n;
    }

    var s, a, u, l, h, f, d, p, g, v;
    for (s = function m(t) {
        var e,
            n = t["length"],
            r = n + 8,
            i = 16 * (1 + (r - r % 64) / 64),
            o = Array(i - 1),
            s = 0,
            a = 0;
        while (a < n) s = a % 4 * 8, o[e = (a - a % 4) / 4] = o[e] | t["charCodeAt"](a) << s, a++;
        return s = a % 4 * 8, o[e = (a - a % 4) / 4] = o[e] | 128 << s, o[i - 2] = n << 3, o[i - 1] = n >>> 29, o;
    }(t = function y(t) {
        t = t["replace"](/\r\n/g, "\n");
        for (var e = "", n = 0; n < t["length"]; n++) {
            var r = t["charCodeAt"](n);
            r < 128 ? e += String["fromCharCode"](r) : (127 < r && r < 2048 ? e += String["fromCharCode"](r >> 6 | 192) : (e += String["fromCharCode"](r >> 12 | 224), e += String["fromCharCode"](r >> 6 & 63 | 128)), e += String["fromCharCode"](63 & r | 128));
        }
        return e;
    }(t)), d = 1732584193, p = 4023233417, g = 2562383102, v = 271733878, a = 0; a < s["length"]; a += 16) p = i(p = i(p = i(p = i(p = r(p = r(p = r(p = r(p = n(p = n(p = n(p = n(p = e(p = e(p = e(p = e(l = p, g = e(h = g, v = e(f = v, d = e(u = d, p, g, v, s[a + 0], 7, 3614090360), p, g, s[a + 1], 12, 3905402710), d, p, s[a + 2], 17, 606105819), v, d, s[a + 3], 22, 3250441966), g = e(g, v = e(v, d = e(d, p, g, v, s[a + 4], 7, 4118548399), p, g, s[a + 5], 12, 1200080426), d, p, s[a + 6], 17, 2821735955), v, d, s[a + 7], 22, 4249261313), g = e(g, v = e(v, d = e(d, p, g, v, s[a + 8], 7, 1770035416), p, g, s[a + 9], 12, 2336552879), d, p, s[a + 10], 17, 4294925233), v, d, s[a + 11], 22, 2304563134), g = e(g, v = e(v, d = e(d, p, g, v, s[a + 12], 7, 1804603682), p, g, s[a + 13], 12, 4254626195), d, p, s[a + 14], 17, 2792965006), v, d, s[a + 15], 22, 1236535329), g = n(g, v = n(v, d = n(d, p, g, v, s[a + 1], 5, 4129170786), p, g, s[a + 6], 9, 3225465664), d, p, s[a + 11], 14, 643717713), v, d, s[a + 0], 20, 3921069994), g = n(g, v = n(v, d = n(d, p, g, v, s[a + 5], 5, 3593408605), p, g, s[a + 10], 9, 38016083), d, p, s[a + 15], 14, 3634488961), v, d, s[a + 4], 20, 3889429448), g = n(g, v = n(v, d = n(d, p, g, v, s[a + 9], 5, 568446438), p, g, s[a + 14], 9, 3275163606), d, p, s[a + 3], 14, 4107603335), v, d, s[a + 8], 20, 1163531501), g = n(g, v = n(v, d = n(d, p, g, v, s[a + 13], 5, 2850285829), p, g, s[a + 2], 9, 4243563512), d, p, s[a + 7], 14, 1735328473), v, d, s[a + 12], 20, 2368359562), g = r(g, v = r(v, d = r(d, p, g, v, s[a + 5], 4, 4294588738), p, g, s[a + 8], 11, 2272392833), d, p, s[a + 11], 16, 1839030562), v, d, s[a + 14], 23, 4259657740), g = r(g, v = r(v, d = r(d, p, g, v, s[a + 1], 4, 2763975236), p, g, s[a + 4], 11, 1272893353), d, p, s[a + 7], 16, 4139469664), v, d, s[a + 10], 23, 3200236656), g = r(g, v = r(v, d = r(d, p, g, v, s[a + 13], 4, 681279174), p, g, s[a + 0], 11, 3936430074), d, p, s[a + 3], 16, 3572445317), v, d, s[a + 6], 23, 76029189), g = r(g, v = r(v, d = r(d, p, g, v, s[a + 9], 4, 3654602809), p, g, s[a + 12], 11, 3873151461), d, p, s[a + 15], 16, 530742520), v, d, s[a + 2], 23, 3299628645), g = i(g, v = i(v, d = i(d, p, g, v, s[a + 0], 6, 4096336452), p, g, s[a + 7], 10, 1126891415), d, p, s[a + 14], 15, 2878612391), v, d, s[a + 5], 21, 4237533241), g = i(g, v = i(v, d = i(d, p, g, v, s[a + 12], 6, 1700485571), p, g, s[a + 3], 10, 2399980690), d, p, s[a + 10], 15, 4293915773), v, d, s[a + 1], 21, 2240044497), g = i(g, v = i(v, d = i(d, p, g, v, s[a + 8], 6, 1873313359), p, g, s[a + 15], 10, 4264355552), d, p, s[a + 6], 15, 2734768916), v, d, s[a + 13], 21, 1309151649), g = i(g, v = i(v, d = i(d, p, g, v, s[a + 4], 6, 4149444226), p, g, s[a + 11], 10, 3174756917), d, p, s[a + 2], 15, 718787259), v, d, s[a + 9], 21, 3951481745), d = c(d, u), p = c(p, l), g = c(g, h), v = c(v, f);
    return (o(d) + o(p) + o(g) + o(v))["toLowerCase"]();
}

function $_CCDh(t) {
    var e = new U()["encrypt"]($_CCEp(t));
    while (!e || 256 !== e["length"]) e = new U()["encrypt"]($_CCEp(!0));
    return e;
}

// aeskey
var rt = function () {
    function t() {
        return (65536 * (1 + Math["random"]()) | 0)["toString"](16)["substring"](1);
    }

    return function () {
        return t() + t() + t() + t();
    };
}();
var $_CCEp = (function () {
    let Ot = rt();
    return function (t) {
        if (t === true) {
            Ot = rt();
        }
        return Ot;
    };
})();

// encrypt
var U = function () {
    function n() {
        this["i"] = 0, this["j"] = 0, this["S"] = [];
    }

    n["prototype"]["init"] = function C(t) {
        var e, n, r;
        for (e = 0; e < 256; ++e) this["S"][e] = e;
        for (e = n = 0; e < 256; ++e) n = n + this["S"][e] + t[e % t["length"]] & 255, r = this["S"][e], this["S"][e] = this["S"][n], this["S"][n] = r;
        this["i"] = 0, this["j"] = 0;
    }, n["prototype"]["next"] = function S() {
        var t;
        return this["i"] = this["i"] + 1 & 255, this["j"] = this["j"] + this["S"][this["i"]] & 255, t = this["S"][this["i"]], this["S"][this["i"]] = this["S"][this["j"]], this["S"][this["j"]] = t, this["S"][t + this["S"][this["i"]] & 255];
    };
    var r,
        i,
        o,
        t,
        s = 256;
    if (null == i) {
        var e;
        i = [], o = 0;
        try {
            if (window["crypto"] && window["crypto"]["getRandomValues"]) {
                var a = new Uint32Array(256);
                for (window["crypto"]["getRandomValues"](a), e = 0; e < a["length"]; ++e) i[o++] = 255 & a[e];
            }
        } catch (T) {
        }
        var _ = 0,
            c = function (t) {
                if (256 <= (_ = _ || 0) || s <= o) window["removeEventListener"] ? (_ = 0, window["removeEventListener"]("mousemove", c, !1)) : window["detachEvent"] && (_ = 0, window["detachEvent"]("onmousemove", c)); else try {
                    var e = t["x"] + t["y"];
                    i[o++] = 255 & e, _ += 1;
                } catch (T) {
                }
            };
        window["addEventListener"] ? window["addEventListener"]("mousemove", c, !1) : window["attachEvent"] && window["attachEvent"]("onmousemove", c);
    }

    function u() {
        if (null == r) {
            r = function e() {
                return new n();
            }();
            while (o < s) {
                var t = Math["floor"](65536 * Math["random"]());
                i[o++] = 255 & t;
            }
            for (r["init"](i), o = 0; o < i["length"]; ++o) i[o] = 0;
            o = 0;
        }
        return r["next"]();
    }

    function l() {
    }

    l["prototype"]["nextBytes"] = function k(t) {
        var e;
        for (e = 0; e < t["length"]; ++e) t[e] = u();
    };

    function y(t, e, n) {
        null != t && ("number" == typeof t ? this["fromNumber"](t, e, n) : null == e && "string" != typeof t ? this["fromString"](t, 256) : this["fromString"](t, e));
    }

    function w() {
        return new y(null);
    }

    t = "Microsoft Internet Explorer" == ht["appName"] ? (y["prototype"]["am"] = function A(t, e, n, r, i, o) {
        var s = 32767 & e,
            a = e >> 15;
        while (0 <= --o) {
            var _ = 32767 & this[t],
                c = this[t++] >> 15,
                u = a * _ + c * s;
            i = ((_ = s * _ + ((32767 & u) << 15) + n[r] + (1073741823 & i)) >>> 30) + (u >>> 15) + a * c + (i >>> 30), n[r++] = 1073741823 & _;
        }
        return i;
    }, 30) : "Netscape" != ht["appName"] ? (y["prototype"]["am"] = function D(t, e, n, r, i, o) {
        while (0 <= --o) {
            var s = e * this[t++] + n[r] + i;
            i = Math["floor"](s / 67108864), n[r++] = 67108863 & s;
        }
        return i;
    }, 26) : (y["prototype"]["am"] = function M(t, e, n, r, i, o) {
        var s = 16383 & e,
            a = e >> 14;
        while (0 <= --o) {
            var _ = 16383 & this[t],
                c = this[t++] >> 14,
                u = a * _ + c * s;
            i = ((_ = s * _ + ((16383 & u) << 14) + n[r] + i) >> 28) + (u >> 14) + a * c, n[r++] = 268435455 & _;
        }
        return i;
    }, 28), y["prototype"]["DB"] = t, y["prototype"]["DM"] = (1 << t) - 1, y["prototype"]["DV"] = 1 << t;
    y["prototype"]["FV"] = Math["pow"](2, 52), y["prototype"]["F1"] = 52 - t, y["prototype"]["F2"] = 2 * t - 52;
    var h,
        f,
        d = "0123456789abcdefghijklmnopqrstuvwxyz",
        p = [];
    for (h = "0"["charCodeAt"](0), f = 0; f <= 9; ++f) p[h++] = f;
    for (h = "a"["charCodeAt"](0), f = 10; f < 36; ++f) p[h++] = f;
    for (h = "A"["charCodeAt"](0), f = 10; f < 36; ++f) p[h++] = f;

    function g(t) {
        return d["charAt"](t);
    }

    function v(t) {
        var e = w();
        return e["fromInt"](t), e;
    }

    function b(t) {
        var e,
            n = 1;
        return 0 != (e = t >>> 16) && (t = e, n += 16), 0 != (e = t >> 8) && (t = e, n += 8), 0 != (e = t >> 4) && (t = e, n += 4), 0 != (e = t >> 2) && (t = e, n += 2), 0 != (e = t >> 1) && (t = e, n += 1), n;
    }

    function m(t) {
        this["m"] = t;
    }

    function x(t) {
        this["m"] = t, this["mp"] = t["invDigit"](), this["mpl"] = 32767 & this["mp"], this["mph"] = this["mp"] >> 15, this["um"] = (1 << t["DB"] - 15) - 1, this["mt2"] = 2 * t["t"];
    }

    function E() {
        this["n"] = null, this["e"] = 0, this["d"] = null, this["p"] = null, this["q"] = null, this["dmp1"] = null, this["dmq1"] = null, this["coeff"] = null;
        this["setPublic"]("00C1E3934D1614465B33053E7F48EE4EC87B14B95EF88947713D25EECBFF7E74C7977D02DC1D9451F79DD5D1C10C29ACB6A9B4D6FB7D0A0279B6719E1772565F09AF627715919221AEF91899CAE08C0D686D748B20A3603BE2318CA6BC2B59706592A9219D0BF05C9F65023A21D2330807252AE0066D59CEEFA5F2748EA80BAB81", "10001");
    }

    return m["prototype"]["convert"] = function O(t) {
        return t["s"] < 0 || 0 <= t["compareTo"](this["m"]) ? t["mod"](this["m"]) : t;
    }, m["prototype"]["revert"] = function B(t) {
        return t;
    }, m["prototype"]["reduce"] = function j(t) {
        t["divRemTo"](this["m"], null, t);
    }, m["prototype"]["mulTo"] = function I(t, e, n) {
        t["multiplyTo"](e, n), this["reduce"](n);
    }, m["prototype"]["sqrTo"] = function R(t, e) {
        t["squareTo"](e), this["reduce"](e);
    }, x["prototype"]["convert"] = function L(t) {
        var e = w();
        return t["abs"]()["dlShiftTo"](this["m"]["t"], e), e["divRemTo"](this["m"], null, e), t["s"] < 0 && 0 < e["compareTo"](y["ZERO"]) && this["m"]["subTo"](e, e), e;
    }, x["prototype"]["revert"] = function N(t) {
        var e = w();
        return t["copyTo"](e), this["reduce"](e), e;
    }, x["prototype"]["reduce"] = function P(t) {
        while (t["t"] <= this["mt2"]) t[t["t"]++] = 0;
        for (var e = 0; e < this["m"]["t"]; ++e) {
            var n = 32767 & t[e],
                r = n * this["mpl"] + ((n * this["mph"] + (t[e] >> 15) * this["mpl"] & this["um"]) << 15) & t["DM"];
            t[n = e + this["m"]["t"]] += this["m"]["am"](0, r, t, e, 0, this["m"]["t"]);
            while (t[n] >= t["DV"]) t[n] -= t["DV"], t[++n]++;
        }
        t["clamp"](), t["drShiftTo"](this["m"]["t"], t), 0 <= t["compareTo"](this["m"]) && t["subTo"](this["m"], t);
    }, x["prototype"]["mulTo"] = function H(t, e, n) {
        t["multiplyTo"](e, n), this["reduce"](n);
    }, x["prototype"]["sqrTo"] = function $(t, e) {
        t["squareTo"](e), this["reduce"](e);
    }, y["prototype"]["copyTo"] = function F(t) {
        for (var e = this["t"] - 1; 0 <= e; --e) t[e] = this[e];
        t["t"] = this["t"], t["s"] = this["s"];
    }, y["prototype"]["fromInt"] = function q(t) {
        this["t"] = 1, this["s"] = t < 0 ? -1 : 0, 0 < t ? this[0] = t : t < -1 ? this[0] = t + this["DV"] : this["t"] = 0;
    }, y["prototype"]["fromString"] = function z(t, e) {
        var n;
        if (16 == e) n = 4; else if (8 == e) n = 3; else if (256 == e) n = 8; else if (2 == e) n = 1; else if (32 == e) n = 5; else {
            if (4 != e) return void this["fromRadix"](t, e);
            n = 2;
        }
        this["t"] = 0, this["s"] = 0;
        var r,
            i,
            o = t["length"],
            s = !1,
            a = 0;
        while (0 <= --o) {
            var _ = 8 == n ? 255 & t[o] : (r = o, null == (i = p[t["charCodeAt"](r)]) ? -1 : i);
            _ < 0 ? "-" == t["charAt"](o) && (s = !0) : (s = !1, 0 == a ? this[this["t"]++] = _ : a + n > this["DB"] ? (this[this["t"] - 1] |= (_ & (1 << this["DB"] - a) - 1) << a, this[this["t"]++] = _ >> this["DB"] - a) : this[this["t"] - 1] |= _ << a, (a += n) >= this["DB"] && (a -= this["DB"]));
        }
        8 == n && 0 != (128 & t[0]) && (this["s"] = -1, 0 < a && (this[this["t"] - 1] |= (1 << this["DB"] - a) - 1 << a)), this["clamp"](), s && y["ZERO"]["subTo"](this, this);
    }, y["prototype"]["clamp"] = function X() {
        var t = this["s"] & this["DM"];
        while (0 < this["t"] && this[this["t"] - 1] == t) --this["t"];
    }, y["prototype"]["dlShiftTo"] = function U(t, e) {
        var n;
        for (n = this["t"] - 1; 0 <= n; --n) e[n + t] = this[n];
        for (n = t - 1; 0 <= n; --n) e[n] = 0;
        e["t"] = this["t"] + t, e["s"] = this["s"];
    }, y["prototype"]["drShiftTo"] = function V(t, e) {
        for (var n = t; n < this["t"]; ++n) e[n - t] = this[n];
        e["t"] = Math["max"](this["t"] - t, 0), e["s"] = this["s"];
    }, y["prototype"]["lShiftTo"] = function G(t, e) {
        var n,
            r = t % this["DB"],
            i = this["DB"] - r,
            o = (1 << i) - 1,
            s = Math["floor"](t / this["DB"]),
            a = this["s"] << r & this["DM"];
        for (n = this["t"] - 1; 0 <= n; --n) e[n + s + 1] = this[n] >> i | a, a = (this[n] & o) << r;
        for (n = s - 1; 0 <= n; --n) e[n] = 0;
        e[s] = a, e["t"] = this["t"] + s + 1, e["s"] = this["s"], e["clamp"]();
    }, y["prototype"]["rShiftTo"] = function J(t, e) {
        e["s"] = this["s"];
        var n = Math["floor"](t / this["DB"]);
        if (n >= this["t"]) e["t"] = 0; else {
            var r = t % this["DB"],
                i = this["DB"] - r,
                o = (1 << r) - 1;
            e[0] = this[n] >> r;
            for (var s = n + 1; s < this["t"]; ++s) e[s - n - 1] |= (this[s] & o) << i, e[s - n] = this[s] >> r;
            0 < r && (e[this["t"] - n - 1] |= (this["s"] & o) << i), e["t"] = this["t"] - n, e["clamp"]();
        }
    }, y["prototype"]["subTo"] = function Y(t, e) {
        var n = 0,
            r = 0,
            i = Math["min"](t["t"], this["t"]);
        while (n < i) r += this[n] - t[n], e[n++] = r & this["DM"], r >>= this["DB"];
        if (t["t"] < this["t"]) {
            r -= t["s"];
            while (n < this["t"]) r += this[n], e[n++] = r & this["DM"], r >>= this["DB"];
            r += this["s"];
        } else {
            r += this["s"];
            while (n < t["t"]) r -= t[n], e[n++] = r & this["DM"], r >>= this["DB"];
            r -= t["s"];
        }
        e["s"] = r < 0 ? -1 : 0, r < -1 ? e[n++] = this["DV"] + r : 0 < r && (e[n++] = r), e["t"] = n, e["clamp"]();
    }, y["prototype"]["multiplyTo"] = function W(t, e) {
        var n = this["abs"](),
            r = t["abs"](),
            i = n["t"];
        e["t"] = i + r["t"];
        while (0 <= --i) e[i] = 0;
        for (i = 0; i < r["t"]; ++i) e[i + n["t"]] = n["am"](0, r[i], e, i, 0, n["t"]);
        e["s"] = 0, e["clamp"](), this["s"] != t["s"] && y["ZERO"]["subTo"](e, e);
    }, y["prototype"]["squareTo"] = function Z(t) {
        var e = this["abs"](),
            n = t["t"] = 2 * e["t"];
        while (0 <= --n) t[n] = 0;
        for (n = 0; n < e["t"] - 1; ++n) {
            var r = e["am"](n, e[n], t, 2 * n, 0, 1);
            (t[n + e["t"]] += e["am"](n + 1, 2 * e[n], t, 2 * n + 1, r, e["t"] - n - 1)) >= e["DV"] && (t[n + e["t"]] -= e["DV"], t[n + e["t"] + 1] = 1);
        }
        0 < t["t"] && (t[t["t"] - 1] += e["am"](n, e[n], t, 2 * n, 0, 1)), t["s"] = 0, t["clamp"]();
    }, y["prototype"]["divRemTo"] = function Q(t, e, n) {
        var r = t["abs"]();
        if (!(r["t"] <= 0)) {
            var i = this["abs"]();
            if (i["t"] < r["t"]) return null != e && e["fromInt"](0), void (null != n && this["copyTo"](n));
            null == n && (n = w());
            var o = w(),
                s = this["s"],
                a = t["s"],
                _ = this["DB"] - b(r[r["t"] - 1]);
            0 < _ ? (r["lShiftTo"](_, o), i["lShiftTo"](_, n)) : (r["copyTo"](o), i["copyTo"](n));
            var c = o["t"],
                u = o[c - 1];
            if (0 != u) {
                var l = u * (1 << this["F1"]) + (1 < c ? o[c - 2] >> this["F2"] : 0),
                    h = this["FV"] / l,
                    f = (1 << this["F1"]) / l,
                    d = 1 << this["F2"],
                    p = n["t"],
                    g = p - c,
                    v = null == e ? w() : e;
                o["dlShiftTo"](g, v), 0 <= n["compareTo"](v) && (n[n["t"]++] = 1, n["subTo"](v, n)), y["ONE"]["dlShiftTo"](c, v), v["subTo"](o, o);
                while (o["t"] < c) o[o["t"]++] = 0;
                while (0 <= --g) {
                    var m = n[--p] == u ? this["DM"] : Math["floor"](n[p] * h + (n[p - 1] + d) * f);
                    if ((n[p] += o["am"](0, m, n, g, 0, c)) < m) {
                        o["dlShiftTo"](g, v), n["subTo"](v, n);
                        while (n[p] < --m) n["subTo"](v, n);
                    }
                }
                null != e && (n["drShiftTo"](c, e), s != a && y["ZERO"]["subTo"](e, e)), n["t"] = c, n["clamp"](), 0 < _ && n["rShiftTo"](_, n), s < 0 && y["ZERO"]["subTo"](n, n);
            }
        }
    }, y["prototype"]["invDigit"] = function K() {
        if (this["t"] < 1) return 0;
        var t = this[0];
        if (0 == (1 & t)) return 0;
        var e = 3 & t;
        return 0 < (e = (e = (e = (e = e * (2 - (15 & t) * e) & 15) * (2 - (255 & t) * e) & 255) * (2 - ((65535 & t) * e & 65535)) & 65535) * (2 - t * e % this["DV"]) % this["DV"]) ? this["DV"] - e : -e;
    }, y["prototype"]["isEven"] = function $_EF() {
        return 0 == (0 < this["t"] ? 1 & this[0] : this["s"]);
    }, y["prototype"]["exp"] = function $_Fc(t, e) {
        if (4294967295 < t || t < 1) return y["ONE"];
        var n = w(),
            r = w(),
            i = e["convert"](this),
            o = b(t) - 1;
        i["copyTo"](n);
        while (0 <= --o) if (e["sqrTo"](n, r), 0 < (t & 1 << o)) e["mulTo"](r, i, n); else {
            var s = n;
            n = r, r = s;
        }
        return e["revert"](n);
    }, y["prototype"]["toString"] = function $_GQ(t) {
        if (this["s"] < 0) return "-" + this["negate"]()["toString"](t);
        var e;
        if (16 == t) e = 4; else if (8 == t) e = 3; else if (2 == t) e = 1; else if (32 == t) e = 5; else {
            if (4 != t) return this["toRadix"](t);
            e = 2;
        }
        var n,
            r = (1 << e) - 1,
            i = !1,
            o = "",
            s = this["t"],
            a = this["DB"] - s * this["DB"] % e;
        if (0 < s--) {
            a < this["DB"] && 0 < (n = this[s] >> a) && (i = !0, o = g(n));
            while (0 <= s) a < e ? (n = (this[s] & (1 << a) - 1) << e - a, n |= this[--s] >> (a += this["DB"] - e)) : (n = this[s] >> (a -= e) & r, a <= 0 && (a += this["DB"], --s)), 0 < n && (i = !0), i && (o += g(n));
        }
        return i ? o : "0";
    }, y["prototype"]["negate"] = function rt() {
        var t = w();
        return y["ZERO"]["subTo"](this, t), t;
    }, y["prototype"]["abs"] = function $_HL() {
        return this["s"] < 0 ? this["negate"]() : this;
    }, y["prototype"]["compareTo"] = function $_Im(t) {
        var e = this["s"] - t["s"];
        if (0 != e) return e;
        var n = this["t"];
        if (0 != (e = n - t["t"])) return this["s"] < 0 ? -e : e;
        while (0 <= --n) if (0 != (e = this[n] - t[n])) return e;
        return 0;
    }, y["prototype"]["bitLength"] = function $_Jl() {
        return this["t"] <= 0 ? 0 : this["DB"] * (this["t"] - 1) + b(this[this["t"] - 1] ^ this["s"] & this["DM"]);
    }, y["prototype"]["mod"] = function $_BAV(t) {
        var e = w();
        return this["abs"]()["divRemTo"](t, null, e), this["s"] < 0 && 0 < e["compareTo"](y["ZERO"]) && t["subTo"](e, e), e;
    }, y["prototype"]["modPowInt"] = function $_BBj(t, e) {
        var n;
        return n = t < 256 || e["isEven"]() ? new m(e) : new x(e), this["exp"](t, n);
    }, y["ZERO"] = v(0), y["ONE"] = v(1), E["prototype"]["doPublic"] = function ct(t) {
        return t["modPowInt"](this["e"], this["n"]);
    }, E["prototype"]["setPublic"] = function ut(t, e) {
        null != t && null != e && 0 < t["length"] && 0 < e["length"] ? (this["n"] = function n(t, e) {
            return new y(t, e);
        }(t, 16), this["e"] = parseInt(e, 16)) : console && console["error"] && console["error"]("Invalid RSA public key");
    }, E["prototype"]["encrypt"] = function lt(t) {
        var e = function a(t, e) {
            if (e < t["length"] + 11) return console && console["error"] && console["error"]("Message too long for RSA"), null;
            var n = [],
                r = t["length"] - 1;
            while (0 <= r && 0 < e) {
                var i = t["charCodeAt"](r--);
                i < 128 ? n[--e] = i : 127 < i && i < 2048 ? (n[--e] = 63 & i | 128, n[--e] = i >> 6 | 192) : (n[--e] = 63 & i | 128, n[--e] = i >> 6 & 63 | 128, n[--e] = i >> 12 | 224);
            }
            n[--e] = 0;
            var o = new l(),
                s = [];
            while (2 < e) {
                s[0] = 0;
                while (0 == s[0]) o["nextBytes"](s);
                n[--e] = s[0];
            }
            return n[--e] = 2, n[--e] = 0, new y(n);
        }(t, this["n"]["bitLength"]() + 7 >> 3);
        if (null == e) return null;
        var n = this["doPublic"](e);
        if (null == n) return null;
        var r = n["toString"](16);
        return 0 == (1 & r["length"]) ? r : "0" + r;
    }, E;
}();
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

var m = {
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
            if (a + 2 < s) _ = (t[a] << 16) + (t[a + 1] << 8) + t[a + 2], n += o["$_EJc"](e(_, i["$_ECx"])) + o["$_EJc"](e(_, i["$_EDQ"])) + o["$_EJc"](e(_, i["$_EEu"])) + o["$_EJc"](e(_, i["$_EFh"]));else {
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

// t 滑动的时间
// e 被加密后的轨迹
// n 滑动的时间
function calc_w3(gt, challenge, s, c, _road, slide_x, slide_time) {
    var aa = calc_aa(_road, c, s);
    var i = {
        "gt": gt,
        "challenge": challenge,
    }

    var o = {
        "lang": i["lang"] || "zh-cn",
        "userresponse": H(slide_x, i["challenge"]),
        "passtime": slide_time,
        "imgload": 187, // r["$_CAGC"],
        "aa": aa,
        "ep": $_CCC_()
    };
    // 跳转到动态文件gct.js进行了一大堆检测，结果r是一个数组return r["random"]["join"]("")["slice"](0, 10);得到了一个随机值，服务器也不检测
    // 最后在o["h9s9"]添加了这个随机值，直接固定这个值
    o["h9s9"] = "1816378497";
    // try {
    //     if (window["_gct"]) {
    //         var s = {
    //                 "lang": o["lang"],
    //                 "ep": o["ep"]
    //             },
    //             a = window["_gct"](s);
    //         if (a["lang"]) {
    //             var _ = function d(t) {
    //                     for (var e in t) if ("ep" !== e && "lang" !== e) return e;
    //                 }(s),
    //                 c = function p(t, e, n) {
    //                     for (var r = new t["gg"]["f"](e, n), i = ["n", "s", "e", "es", "en", "w", "wn", "ws"], o = i["length"] - 2, s = 0; s < n["length"]; s++) {
    //                         var a,
    //                             _ = Math["abs"](n[s]["charCodeAt"]() - 70)["toString"]()[1];
    //                         a = o < _ ? t["gg"][i[1 + o]](r) : t["gg"][i[_]](r);
    //                         for (var c = Math["abs"](n[s]["charCodeAt"]() - 70)["toString"]()[0], u = 0; u < c; u++) a["cc"]();
    //                     }
    //                     return r["random"]["join"]("")["slice"](0, 10);
    //                 }(a, s, _);
    //             s[_] = c;
    //         }
    //         !function g(t) {
    //             if ("function" == typeof Object["assign"]) return Object["assign"]["apply"](Object, arguments);
    //             if (null == t) throw new Error("Cannot convert undefined or null to object");
    //             t = Object(t);
    //             for (var e = 1; e < arguments["length"]; e++) {
    //                 var n = arguments[e];
    //                 if (null !== n) for (var r in n) Object["prototype"]["hasOwnProperty"]["call"](n, r) && (t[r] = n[r]);
    //             }
    //             return t;
    //         }(o, s);
    //     }
    // } catch (v) {}
    i["offline"] && (o["x"] = slide_time), o["rp"] = X(i["gt"] + i["challenge"]["slice"](0, 32) + o["passtime"]);
    var u = $_CCDh(),  // RSA加密aeskey
        l = V["encrypt"](JSON["stringify"](o), $_CCEp()),  // AES
        h = m["$_FEu"](l),
        f = {
            "gt": i["gt"],
            "challenge": i["challenge"],
            "lang": o["lang"],
            "$_BCm": 0,
            "client_type": "web",
            "w": h + u
        };
    return f;
}
// 轨迹

// var _road = [
//     [
//         -39,
//         -29,
//         0
//     ],
//     [
//         0,
//         0,
//         0
//     ],
//     [
//         2,
//         0,
//         56
//     ],
//     [
//         7,
//         0,
//         64
//     ],
//     [
//         15,
//         0,
//         72
//     ],
//     [
//         21,
//         0,
//         80
//     ],
//     [
//         29,
//         0,
//         88
//     ],
//     [
//         36,
//         1,
//         97
//     ],
//     [
//         45,
//         1,
//         104
//     ],
//     [
//         51,
//         2,
//         112
//     ],
//     [
//         54,
//         3,
//         120
//     ],
//     [
//         57,
//         3,
//         128
//     ],
//     [
//         58,
//         3,
//         136
//     ],
//     [
//         59,
//         3,
//         144
//     ],
//     [
//         61,
//         3,
//         152
//     ],
//     [
//         61,
//         3,
//         401
//     ]
// ]
// var c = [
//     12,
//     58,
//     98,
//     36,
//     43,
//     95,
//     62,
//     15,
//     12
// ];
// var s = "42377459";
// var gt = "019924a82c70bb123aae90d483087f94";
// var challenge = "742cfdc18f2188b02726ceee4c6e1fe37y";
// var slide_x = 61;   // _road[-1][0]
// var slide_time = 401    // _road[-1][2]
// console.log(calc_w3(gt, challenge, s, c, _road, slide_x, slide_time))