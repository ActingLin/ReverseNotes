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
};
var w = /Mobi/i["test"](pe["userAgent"]);
var y = /msie 6\.0/i["test"](pe["userAgent"]);
var b = /msie 7\.0/i["test"](pe["userAgent"]);
var t;
var x = (t = N["createElement"]("canvas"), n = t["getContext"] && t["getContext"]("2d"), r = /msie/i["test"](pe["userAgent"]), !n && r);
var W = function () {
        function c(e, t) {
            return e in t;
        }

        function l(e) {
            return e ? a : s;
        }

        function i(e) {
            return e ? _ : a;
        }

        var s = 0,
            a = 1,
            _ = 2;

        function u(e) {
            return typeof e;
        }

        var r = window,
            e = Object,
            t = N,
            p = "undefined",
            n = "function",
            h = e["getPrototypeOf"],
            f = u(h) == n;

        function o(n, r) {
            return function (e, t) {
                return l(c(n, r));
            };
        }

        var d = "hantom",
            g = o(["_p", d]["join"](""), r);
        var v = e["getOwnPropertyDescriptor"],
            m = u(v) == n,
            x = "webdriver";
        for (var w, y, b, E = ["ph", "cp", "ek", "wd", "nt", "si", "sc"], C = [g, function A() {
            var e,
                t = "callP" + d;
            if (!c(t, r)) return s;
            try {
                r[t];
            } catch (n) {
                e = [];
            }
            return e ? 9 : a;
        }, function D() {
            var e = 5 * Math["random"](2),
                t = e - 1,
                n = [];
            try {
                n["push"](e(n, t));
            } catch (_) {
                n = _;
            }
            for (var r = ["line", "column", "Number"], o = [r[0], r[1], r[0] + r[2], r[1] + r[2], "fileName", "message", r[2]["toLowerCase"](), "description", "sourceURL", "stack"], i = o["slice"](o["length"]), s = 0, a = o["length"]; s < a; ++s) i[s] = l(c(o[s], n));
            return parseInt(i["join"](""), 2)["toString"](16);
        }, function O() {
            var e = x,
                t = pe,
                n = function o(e) {
                    var t;
                    if (u(e) != p) return f && (t = h(e)), u(t) != p ? t : u(t = e["$_BADN"]) != p ? t : u(t = e["constructor"]) != p ? t["prototype"] : void 0;
                }(t);
            if (!n) return 8;
            if (!c(e, n)) return c(e, t) ? t[e] ? _ : a : s;
            if (!m) return i(t[e]);
            var r = v(n, e);
            return "object" != u(r) ? 9 : r["get"] ? i(r["get"]["call"](t)) : i(r["value"]);
        }, o(["_", "_nig", "htma", "re"]["join"](""), r), (w = t, o([y = "_", x, "script", "fn"]["join"](y), w)), (b = t, o(["$cdc_as", "djflasu", "topfhvc", "ZLmcfl_"]["join"](""), b))], k = [], S = -1, T = E["length"]; ++S < T;) k[S] = [E[S], C[S]];
        return function L(e, t) {
            for (var n, r, o = k, i = -1, s = o["length"]; ++i < s;) r = (n = o[i])[1](i), t[n[0]] = r;
            return e;
        };
    }(),
    te = function () {
        function e() {
            return (65536 * (1 + Math["random"]()) | 0)["toString"](16)["substring"](1);
        }

        return function () {
            return e() + e() + e() + e();
        };
    }();

var he,
    fe,
    de = function () {
        "use strict";
        var l,
            u,
            n,
            p,
            e = {},
            t = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

        function r(e) {
            return e < 10 ? "0" + e : e;
        }

        function o() {
            return this["valueOf"]();
        }

        function h(e) {
            return t["lastIndex"] = 0, t["test"](e) ? "\"" + e["replace"](t, function (e) {
                var t = n[e];
                return "string" == typeof t ? t : "\\u" + ("0000" + e["charCodeAt"](0)["toString"](16))["slice"](-4);
            }) + "\"" : "\"" + e + "\"";
        }

        return "function" != typeof Date["prototype"]["toJSON"] && (Date["prototype"]["toJSON"] = function () {
            return isFinite(this["valueOf"]()) ? this["getUTCFullYear"]() + "-" + r(this["getUTCMonth"]() + 1) + "-" + r(this["getUTCDate"]()) + "T" + r(this["getUTCHours"]()) + ":" + r(this["getUTCMinutes"]()) + ":" + r(this["getUTCSeconds"]()) + "Z" : null;
        }, Boolean["prototype"]["toJSON"] = o, Number["prototype"]["toJSON"] = o, String["prototype"]["toJSON"] = o), n = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        }, e["stringify"] = function (e, t, n) {
            var r;
            if (u = l = "", "number" == typeof n) for (r = 0; r < n; r += 1) u += " "; else "string" == typeof n && (u = n);
            if ((p = t) && "function" != typeof t && ("object" != typeof t || "number" != typeof t["length"])) throw new Error("JSON.stringify");
            return function c(e, t) {
                var n,
                    r,
                    o,
                    i,
                    s,
                    a = l,
                    _ = t[e];
                switch (_ && "object" == typeof _ && "function" == typeof _["toJSON"] && (_ = _["toJSON"](e)), "function" == typeof p && (_ = p["call"](t, e, _)), typeof _) {
                    case "string":
                        return h(_);
                    case "number":
                        return isFinite(_) ? String(_) : "null";
                    case "boolean":
                    case "null":
                        return String(_);
                    case "object":
                        if (!_) return "null";
                        if (l += u, s = [], "[object Array]" === Object["prototype"]["toString"]["apply"](_)) {
                            for (i = _["length"], n = 0; n < i; n += 1) s[n] = c(n, _) || "null";
                            return o = 0 === s["length"] ? "[]" : l ? "[\n" + l + s["join"](",\n" + l) + "\n" + a + "]" : "[" + s["join"](",") + "]", l = a, o;
                        }
                        if (p && "object" == typeof p) for (i = p["length"], n = 0; n < i; n += 1) "string" == typeof p[n] && (o = c(r = p[n], _)) && s["push"](h(r) + (l ? ": " : ":") + o); else for (r in _) Object["prototype"]["hasOwnProperty"]["call"](_, r) && (o = c(r, _)) && s["push"](h(r) + (l ? ": " : ":") + o);
                        return o = 0 === s["length"] ? "{}" : l ? "{\n" + l + s["join"](",\n" + l) + "\n" + a + "}" : "{" + s["join"](",") + "}", l = a, o;
                }
            }("", {
                "": e
            });
        }, e;
    }(),
    ge = "px",
    ve = 1,
    xe = function () {
        var _,
            e = Object["prototype"],
            c = e["hasOwnProperty"],
            t = "function" == typeof Symbol ? Symbol : {},
            o = t["iterator"] || "@@iterator",
            n = t["toStringTag"] || "@@toStringTag";
        "function" != typeof Object["create"] && (Object["create"] = function (e) {
            if (null !== e && "object" != typeof e && "function" != typeof e) throw TypeError("Argument must be an object, or null");

            function t() {
            }

            return t["prototype"] = e, new t();
        }), Array["prototype"]["forEach"] || (Array["prototype"]["forEach"] = function (e) {
            var t, n;
            if (null == this) throw new TypeError("this is null or not defined");
            var r = Object(this),
                o = r["length"] >>> 0;
            if ("function" != typeof e) throw new TypeError(e + " is not a function");
            1 < arguments["length"] && (t = arguments[1]), n = 0;
            while (n < o) {
                var i;
                n in r && (i = r[n], e["call"](t, i, n, r)), n++;
            }
        });
        var r = {};

        function l(e, t, n) {
            try {
                return {
                    "type": "normal",
                    "arg": e["call"](t, n)
                };
            } catch (r) {
                return {
                    "type": "throw",
                    "arg": r
                };
            }
        }

        r["wrap"] = function k(e, t, n, r) {
            var o = t && t["prototype"] instanceof a ? t : a,
                i = Object["create"](o["prototype"]),
                s = new b(r || []);
            return i["$_BFCh"] = function c(i, s, a) {
                var _ = u;
                return function (e, t) {
                    if (_ === h) throw new Error("Generator is already running");
                    if (_ === f) {
                        if ("throw" === e) throw t;
                        return C();
                    }
                    a["method"] = e, a["arg"] = t;
                    while (1) {
                        var n = a["delegate"];
                        if (n) {
                            var r = maybeInvokeDelegate(n, a);
                            if (r) {
                                if (r === d) continue;
                                return r;
                            }
                        }
                        if ("next" === a["method"]) a["sent"] = a["$_BFDP"] = a["arg"]; else if ("throw" === a["method"]) {
                            if (_ === u) throw _ = f, a["arg"];
                            a["dispatchException"](a["arg"]);
                        } else "return" === a["method"] && a["abrupt"]("return", a["arg"]);
                        _ = h;
                        var o = l(i, s, a);
                        if ("normal" === o["type"]) {
                            if (_ = a["done"] ? f : p, o["arg"] === d) continue;
                            return {
                                "value": o["arg"],
                                "done": a["done"]
                            };
                        }
                        "throw" === o["type"] && (_ = f, a["method"] = "throw", a["arg"] = o["arg"]);
                    }
                };
            }(e, n, s), i;
        };
        var u = "suspendedStart",
            p = "suspendedYield",
            h = "executing",
            f = "completed",
            d = {};

        function a() {
        }

        function i() {
        }

        function s() {
        }

        var g = {};
        g[o] = function () {
            return this;
        };
        var v = Object["getPrototypeOf"],
            m = v && v(v(E([])));
        m && m !== e && c["call"](m, o) && (g = m);
        var x = s["prototype"] = a["prototype"] = Object["create"](g);

        function w(e) {
            var t = {
                "tryLoc": e[0]
            };
            1 in e && (t["catchLoc"] = e[1]), 2 in e && (t["finallyLoc"] = e[2], t["afterLoc"] = e[3]), this["tryEntries"]["push"](t);
        }

        function y(e) {
            var t = e["completion"] || {};
            t["type"] = "normal", delete t["arg"], e["completion"] = t;
        }

        function b(e) {
            this["tryEntries"] = [{
                "tryLoc": "root"
            }], e["forEach"](w, this), this["reset"](!0);
        }

        function E(e) {
            if (e) {
                var t = e[o];
                if (t) return t["call"](e);
                if ("function" == typeof e["next"]) return e;
                if (!isNaN(e["length"])) {
                    var n = -1,
                        r = function r() {
                            while (++n < e["length"]) if (c["call"](e, n)) return r["value"] = e[n], r["done"] = !1, r;
                            return r["value"] = _, r["done"] = !0, r;
                        };
                    return r["next"] = r;
                }
            }
            return {
                "next": C
            };
        }

        function C() {
            return {
                "value": _,
                "done": !0
            };
        }

        return i["prototype"] = x["constructor"] = s, s["constructor"] = i, s[n] = i["displayName"] = "GeneratorFunction", r["mark"] = function (e) {
            return Object["setPrototypeOf"] ? Object["setPrototypeOf"](e, s) : (e["$_BADN"] = s, n in e || (e[n] = "GeneratorFunction")), e["prototype"] = Object["create"](x), e;
        }, function S(e) {
            ["next", "throw", "return"]["forEach"](function (t) {
                e[t] = function (e) {
                    return this["$_BFCh"](t, e);
                };
            });
        }(x), x[n] = "Generator", x[o] = function () {
            return this;
        }, x["toString"] = function () {
            return "[object Generator]";
        }, r["keys"] = function (t) {
            var n = [];
            for (var e in t) n["push"](e);
            return n["reverse"](), function r() {
                while (n["length"]) {
                    var e = n["pop"]();
                    if (e in t) return r["value"] = e, r["done"] = !1, r;
                }
                return r["done"] = !0, r;
            };
        }, r["values"] = E, b["prototype"] = {
            "constructor": b,
            "reset": function (e) {
                if (this["prev"] = 0, this["next"] = 0, this["sent"] = this["$_BFDP"] = _, this["done"] = !1, this["delegate"] = null, this["method"] = "next", this["arg"] = _, this["tryEntries"]["forEach"](y), !e) for (var t in this) "t" === t["charAt"](0) && c["call"](this, t) && !isNaN(+t["slice"](1)) && (this[t] = _);
            },
            "stop": function () {
                this["done"] = !0;
                var e = this["tryEntries"][0]["completion"];
                if ("throw" === e["type"]) throw e["arg"];
                return this["rval"];
            },
            "dispatchException": function (n) {
                if (this["done"]) throw n;
                var r = this;

                function e(e, t) {
                    return i["type"] = "throw", i["arg"] = n, r["next"] = e, t && (r["method"] = "next", r["arg"] = _), !!t;
                }

                for (var t = this["tryEntries"]["length"] - 1; 0 <= t; --t) {
                    var o = this["tryEntries"][t],
                        i = o["completion"];
                    if ("root" === o["tryLoc"]) return e("end");
                    if (o["tryLoc"] <= this["prev"]) {
                        var s = c["call"](o, "catchLoc"),
                            a = c["call"](o, "finallyLoc");
                        if (s && a) {
                            if (this["prev"] < o["catchLoc"]) return e(o["catchLoc"], !0);
                            if (this["prev"] < o["finallyLoc"]) return e(o["finallyLoc"]);
                        } else if (s) {
                            if (this["prev"] < o["catchLoc"]) return e(o["catchLoc"], !0);
                        } else {
                            if (!a) throw new Error("try statement without catch or finally");
                            if (this["prev"] < o["finallyLoc"]) return e(o["finallyLoc"]);
                        }
                    }
                }
            },
            "abrupt": function (e, t) {
                for (var n = this["tryEntries"]["length"] - 1; 0 <= n; --n) {
                    var r = this["tryEntries"][n];
                    if (r["tryLoc"] <= this["prev"] && c["call"](r, "finallyLoc") && this["prev"] < r["finallyLoc"]) {
                        var o = r;
                        break;
                    }
                }
                o && ("break" === e || "continue" === e) && o["tryLoc"] <= t && t <= o["finallyLoc"] && (o = null);
                var i = o ? o["completion"] : {};
                return i["type"] = e, i["arg"] = t, o ? (this["method"] = "next", this["next"] = o["finallyLoc"], d) : this["complete"](i);
            },
            "complete": function (e, t) {
                if ("throw" === e["type"]) throw e["arg"];
                return "break" === e["type"] || "continue" === e["type"] ? this["next"] = e["arg"] : "return" === e["type"] ? (this["rval"] = this["arg"] = e["arg"], this["method"] = "return", this["next"] = "end") : "normal" === e["type"] && t && (this["next"] = t), d;
            },
            "finish": function (e) {
                for (var t = this["tryEntries"]["length"] - 1; 0 <= t; --t) {
                    var n = this["tryEntries"][t];
                    if (n["finallyLoc"] === e) return this["complete"](n["completion"], n["afterLoc"]), y(n), d;
                }
            },
            "catch": function (e) {
                for (var t = this["tryEntries"]["length"] - 1; 0 <= t; --t) {
                    var n = this["tryEntries"][t];
                    if (n["tryLoc"] === e) {
                        var r = n["completion"];
                        if ("throw" === r["type"]) {
                            var o = r["arg"];
                            y(n);
                        }
                        return o;
                    }
                }
                throw new Error("illegal catch attempt");
            },
            "delegateYield": function (e, t, n) {
                return this["delegate"] = {
                    "iterator": E(e),
                    "resultName": t,
                    "nextLoc": n
                }, "next" === this["method"] && (this["arg"] = _), d;
            }
        }, r;
    }(),
    ye = function () {
        function v(e) {
            for (var t = [], n = [], r = 0, o = e["length"]; r < o; r++) {
                var i = e[r];
                0 < i[1] ? t["push"](i) : n["push"](i);
            }
            t["sort"](function (e, t) {
                return e[0] - t[0];
            }), t["reverse"](), n["sort"](function (e, t) {
                return e[0] - t[0];
            }), t = t["concat"](n);
            var s = [];
            for (r = 0; r < 2; r++) {
                var a = t[r][0],
                    _ = t[r + 1][0],
                    c = t[r + 3][0],
                    l = t[r + 4][0],
                    u = t[r][1],
                    p = t[r + 1][1],
                    h = t[r + 3][1],
                    f = t[r + 4][1];
                s["push"](m(a, u, _, p, c, h, l, f));
            }
            return s;
        }

        function m(e, t, n, r, o, i, s, a) {
            "number" != typeof e && (e = parseFloat(e), t = parseFloat(t), n = parseFloat(n), r = parseFloat(r), o = parseFloat(o), i = parseFloat(i), s = parseFloat(s), a = parseFloat(a));
            var _ = (t - r) / (e - n),
                c = (i - a) / (o - s),
                l = (_ * e - c * o + i - t) / (_ - c);
            return [l, t + (l - e) * _];
        }

        function x(e, t) {
            for (var n = e["length"] - 1; 0 <= n; n--) {
                var r = e[n];
                if (r[0] == t[0] && r[1] == t[1]) return !0;
            }
            return !1;
        }

        return {
            "calculate": function w(e) {
                for (var t, n, r, o, i, s, a, _, c = e["s"] || [], l = e["k"], u = null, p = c["length"] - 1; 0 <= p; p--) {
                    for (var h = c[p], f = (t = h[0], n = h[1], r = h[2], _ = void 0, o = v(t)["concat"](v(n), v(r)), i = m(o[0][0], o[0][1], o[1][0], o[1][1], o[2][0], o[2][1], o[3][0], o[3][1]), s = m(o[0][0], o[0][1], o[1][0], o[1][1], o[4][0], o[4][1], o[5][0], o[5][1]), a = m(o[2][0], o[2][1], o[3][0], o[3][1], o[4][0], o[4][1], o[5][0], o[5][1]), (_ = [])["push"](i), _["push"](s), _["push"](a), _), d = !0, g = 0; g < f["length"]; g++) if (!x(l, f[g])) {
                        d = !1;
                        break;
                    }
                    if (d) {
                        u = h;
                        break;
                    }
                }
                return u;
            }
        };
    }(),
    be = function () {
        var e = xe["mark"](n);

        function n(t, n) {
            var r, o, i, s, a, _, c, l, u, p, h, f;
            return xe["wrap"](function (e) {
                while (1) switch (e["prev"] = e["next"]) {
                    case 0:
                        r = n[0] || [], o = n[1] || [], i = n[2] || [], a = $_BCR(t, (s = 6) - r["length"]), c = [], l = 1e3;
                    case 7:
                        if (!(_ = a["next"]())) {
                            e["next"] = 21;
                            break;
                        }
                        u = d(t, _), p = $_BCR(u, s - o["length"]);
                    case 10:
                        if (!(h = p["next"]())) {
                            e["next"] = 19;
                            break;
                        }
                        if (f = d(u, h), c["push"]([r["concat"](_), o["concat"](h), i["concat"](f)]), c["length"] === l) return e["next"] = 16, c;
                        e["next"] = 17;
                        break;
                    case 16:
                        c = [];
                    case 17:
                        e["next"] = 10;
                        break;
                    case 19:
                        e["next"] = 7;
                        break;
                    case 21:
                        if (c["length"]) return e["next"] = 24, c;
                        e["next"] = 24;
                        break;
                    case 24:
                    case "end":
                        return e["stop"]();
                }
            }, e, this);
        }

        function d(e, t) {
            for (var n = e["slice"](0), r = t["length"] - 1; 0 <= r; r--) {
                var o = i(n, t[r]);
                0 <= o && n["splice"](o, 1);
            }
            return n;
        }

        function i(e, t) {
            if (e["indexOf"]) return e["indexOf"](t);
            for (var n = 0, r = e["length"]; n < r; n++) if (e[n] === t) return n;
            return -1;
        }

        return {
            "build": function r(e, t) {
                return n(e, function s(e) {
                    if (!e || 0 === e["length"]) return [[], [], []];
                    for (var t = [[], [], []], n = Math["ceil"](e["length"] / 3), r = 0; r < n; r++) for (var o = 0; o < 3; o++) {
                        var i = e[o + 3 * r];
                        i && t[o]["push"](i);
                    }
                    return t;
                }(t));
            }
        };
    }(),
    Ee = (function () {
        function r(e, t, n) {
            var r = e["protocol"] + (e["static_servers"][0] || "static.geetest.com") + "/static/html",
                o = "/static/js/worker." + e["worker_version"] + ".js",
                i = e["debugConfig"];
            return i && i["worker_path"] && (r = a["href"] + "/gt-dist/html", o = o["replace"]("/static", i["worker_path"])), function (n) {
                var r = new Date()["getTime"](),
                    e = n["host"] + "/iframe.1.0.5.html?w=" + n["w"] + "&mid=" + r;
                window["addEventListener"]("message", function s(e) {
                    var t = e["data"];
                    switch (t["type"]) {
                        case "gt_w_error_" + r:
                            n["errorCb"] && n["errorCb"]["apply"](null, []);
                            break;
                        case "gt_w_done_" + r:
                            o["apply"](null, [t["result"], t["t"]]);
                            break;
                        case "gt_w_ready_" + r:
                            n["readyCb"] && n["readyCb"]["apply"](null, []);
                            break;
                        case "gt_w_progress_" + r:
                            i && i["apply"](null, []);
                    }
                }, !1);
                var o,
                    i,
                    t = N["createElement"]("iframe");
                t["id"] = r, t["src"] = e, t["style"]["height"] = 0, t["style"]["width"] = 0, t["style"]["border"] = "none", t["style"]["position"] = "absolute", t["onerror"] = n["errorCb"], t["onload"] = n["loadCb"], N["body"]["appendChild"](t);
                return {
                    "start": function (e) {
                        o = e["done"], i = e["progress"], t["contentWindow"]["postMessage"]({
                            "type": "gt_w_start_" + r,
                            "c": e["c"],
                            "a": e["a"],
                            "k": e["k"]
                        }, "*");
                    },
                    "stop": function () {
                        t["contentWindow"]["postMessage"]({
                            "type": "gt_w_stop_" + r
                        }, "*");
                    },
                    "iframe": t
                };
            }({
                "host": r,
                "w": o,
                "loadCb": function () {
                },
                "errorCb": function () {
                    "function" == typeof n && n();
                },
                "readyCb": function () {
                    "function" == typeof t && t();
                }
            });
        }

        function o(e, t, n, r, o, i) {
            "function" == typeof r && r();
            var s,
                a = new Date()["getTime"](),
                _ = 0,
                c = be["build"](e, t);
            "function" == typeof o && o();
            var l = !1;
            while (!l) {
                var u = c["next"]()["value"];
                u ? (s = ye["calculate"]({
                    "k": n,
                    "s": u
                })) && s["length"] && (_ = new Date()["getTime"](), l = !0) : (_ = new Date()["getTime"](), l = !0);
            }
            "function" == typeof i && i(s, _ - a);
        }

        function e(e) {
            var t = e["config"],
                n = this;
            n["config"] = t, n["beforeStart"] = e["beforeStart"], n["done"] = e["done"], n["progress"] = e["progress"], n["supportWorker"] = t["supportWorker"], n["supportWorker"] ? n["powclient"] = r(t, function () {
                g(function () {
                    !function a(e, t, n, r, o, i, s) {
                        "function" == typeof r && r(), s["start"]({
                            "done": i,
                            "progress": o,
                            "k": n,
                            "c": e,
                            "a": t
                        });
                    }(t["vip_content"], t["vip_answer"], t["vip_key"], n["beforeStart"], n["progress"], n["done"], n["powclient"]);
                }, 50);
            }, function () {
                e["done"]();
            }) : o(t["vip_content"], t["vip_answer"], t["vip_key"], n["beforeStart"], n["progress"], n["done"]);
        }

        e["prototype"]["$_BFEu"] = function (e) {
            var t = this;
            t["supportWorker"] ? (t["iframeurl"] || (t["iframeurl"] = t["powclient"]["iframe"]["src"]), t["powclient"]["iframe"]["src"] = t["iframeurl"] + "&t=" + new Date()["getTime"]()) : o(e["vip_content"], e["vip_answer"], e["vip_key"], t["beforeStart"], t["progress"], t["done"]);
        }, e["prototype"]["$_JIQ"] = function () {
            var e = this;
            e["powclient"] && e["powclient"]["iframe"] && (e["powclient"]["stop"](), e["powclient"]["iframe"]["parentNode"]["removeChild"](e["powclient"]["iframe"]));
        }, e["prototype"]["$_BFFr"] = function () {
            this["powclient"] && this["powclient"]["iframe"] && this["powclient"]["stop"]();
        };
    }(), he = function it() {
        try {
            var e,
                t = N["createElement"]("canvas");
            if (!t["getContext"]) return {
                "vendor": -1,
                "renderer": -1
            };
            if (!(e = t["getContext"]("experimental-webgl"))) return {
                "vendor": -1,
                "renderer": -1
            };
            var n = e["getExtension"]("WEBGL_debug_renderer_info"),
                r = n ? n["UNMASKED_VENDOR_WEBGL"] : e["VENDOR"],
                o = n ? n["UNMASKED_RENDERER_WEBGL"] : e["RENDERER"];
            return {
                "vendor": e["getParameter"](r),
                "renderer": e["getParameter"](o)
            };
        } catch (i) {
            return {
                "vendor": -1,
                "renderer": -1
            };
        }
    }(), fe = {
        "puppet": !1,
        "phantom": !1,
        "nightmare": !1,
        "selenium": !1,
        "vendor": he["vendor"],
        "renderer": he["renderer"]
    }, function st() {
        !function e() {
            he["renderer"] && -1 !== he["renderer"]["toString"]()["indexOf"]("SwiftShader") ? fe["puppet"] = !0 : pe["webdriver"] && (fe["puppet"] = !0);
        }(), function t() {
            window["_phantom"] ? fe["phantom"] = !0 : "function" == typeof window["callPhantom"] && (fe["phantom"] = !0);
        }(), function n() {
            "object" == typeof window["__nightmare"] && (fe["nightmare"] = !0);
        }(), function r() {
            "function" == typeof N["$_BFGR"] && (fe["selenium"] = !0);
        }();
    }(), fe);

function c(e, t) {
    if (e && e["filename"] && /static\.geetest\.com/g["test"](e["filename"]) || t) {
        try {
            var n = {
                "captcha_id": window && window["GeeGT"] || "",
                "challenge": window && window["GeeChallenge"] || "",
                "error_code": t ? "603" : "602",
                "exception_url": e["filename"] || "",
                "pt": /Mobi/i["test"](window["navigator"]["userAgent"]) ? "3" : "0",
                "time": function a() {
                    var e = new Date(),
                        t = e["getFullYear"](),
                        n = e["getMonth"]() + 1,
                        r = e["getDate"](),
                        o = e["getHours"](),
                        i = e["getMinutes"](),
                        s = e["getSeconds"]();
                    return 1 <= n && n <= 9 && (n = "0" + n), 0 <= r && r <= 9 && (r = "0" + r), 0 <= o && o <= 9 && (o = "0" + o), 0 <= i && i <= 9 && (i = "0" + i), 0 <= s && s <= 9 && (s = "0" + s), t + "-" + n + "-" + r + " " + o + ":" + i + ":" + s;
                }(),
                "msg": e["error"] && e["error"]["message"] || e["message"] || "",
                "stack": e["error"] && e["error"]["stack"] || e["stack"] || ""
            };
            _["$_FCS"]() && _["$_FDw"]("https://monitor.geetest.com/monitor/send", n, function (e) {
            }, function (e) {
            });
        } catch (r) {
        }
    }
}

function Ce() {
}

var ke,
    Se = (ke = {
        "mouseEvent": !(Ce["prototype"] = {
            "$_BFHL": function () {
                return window["performance"] && window["performance"]["timing"] && this["$_BFIe"]() || -1;
            },
            "$_BFIe": function () {
                var e = window["performance"]["timing"];
                return {
                    "a": e["navigationStart"],
                    "b": e["unloadEventStart"],
                    "c": e["unloadEventEnd"],
                    "d": e["redirectStart"],
                    "e": e["redirectEnd"],
                    "f": e["fetchStart"],
                    "g": e["domainLookupStart"],
                    "h": e["domainLookupEnd"],
                    "i": e["connectStart"],
                    "j": e["connectEnd"],
                    "k": e["secureConnectionStart"],
                    "l": e["requestStart"],
                    "m": e["responseStart"],
                    "n": e["responseEnd"],
                    "o": e["domLoading"],
                    "p": e["domInteractive"],
                    "q": e["domContentLoadedEventStart"],
                    "r": e["domContentLoadedEventEnd"],
                    "s": e["domComplete"],
                    "t": e["loadEventStart"],
                    "u": e["loadEventEnd"]
                };
            }
        }),
        "touchEvent": !1
    }, function at() {
        !function e() {
            if (window["addEventListener"]) {
                function t(e) {
                    ke["mouseEvent"] = !0, N["removeEventListener"]("mousedown", t), N["removeEventListener"]("mousemove", t), N["removeEventListener"]("mouseup", t);
                }

                N["addEventListener"]("mousedown", t), N["addEventListener"]("mousemove", t), N["addEventListener"]("mouseup", t);
            }
        }(), function n() {
            if (window["addEventListener"]) {
                function t(e) {
                    ke["touchEvent"] = !0, N["removeEventListener"]("touchstart", t), N["removeEventListener"]("touchmove", t), N["removeEventListener"]("touchend", t);
                }

                N["addEventListener"]("touchstart", t), N["addEventListener"]("touchmove", t), N["addEventListener"]("touchend", t);
            }
        }();
    }(), ke);

function H(e) {
    function _(e, t) {
        return e << t | e >>> 32 - t;
    }

    function c(e, t) {
        var n, r, o, i, s;
        return o = 2147483648 & e, i = 2147483648 & t, s = (1073741823 & e) + (1073741823 & t), (n = 1073741824 & e) & (r = 1073741824 & t) ? 2147483648 ^ s ^ o ^ i : n | r ? 1073741824 & s ? 3221225472 ^ s ^ o ^ i : 1073741824 ^ s ^ o ^ i : s ^ o ^ i;
    }

    function t(e, t, n, r, o, i, s) {
        return c(_(e = c(e, c(c(function a(e, t, n) {
            return e & t | ~e & n;
        }(t, n, r), o), s)), i), t);
    }

    function n(e, t, n, r, o, i, s) {
        return c(_(e = c(e, c(c(function a(e, t, n) {
            return e & n | t & ~n;
        }(t, n, r), o), s)), i), t);
    }

    function r(e, t, n, r, o, i, s) {
        return c(_(e = c(e, c(c(function a(e, t, n) {
            return e ^ t ^ n;
        }(t, n, r), o), s)), i), t);
    }

    function o(e, t, n, r, o, i, s) {
        return c(_(e = c(e, c(c(function a(e, t, n) {
            return t ^ (e | ~n);
        }(t, n, r), o), s)), i), t);
    }

    function i(e) {
        var t,
            n = "",
            r = "";
        for (t = 0; t <= 3; t++) n += (r = "0" + (e >>> 8 * t & 255)["toString"](16))["substr"](r["length"] - 2, 2);
        return n;
    }

    var s, a, l, u, p, h, f, d, g, v;
    for (s = function m(e) {
        var t,
            n = e["length"],
            r = n + 8,
            o = 16 * (1 + (r - r % 64) / 64),
            i = Array(o - 1),
            s = 0,
            a = 0;
        while (a < n) s = a % 4 * 8, i[t = (a - a % 4) / 4] = i[t] | e["charCodeAt"](a) << s, a++;
        return s = a % 4 * 8, i[t = (a - a % 4) / 4] = i[t] | 128 << s, i[o - 2] = n << 3, i[o - 1] = n >>> 29, i;
    }(e = function x(e) {
        console.log("要md5加密的值：" + e);
        e = e["replace"](/\r\n/g, "\n");
        for (var t = "", n = 0; n < e["length"]; n++) {
            var r = e["charCodeAt"](n);
            r < 128 ? t += String["fromCharCode"](r) : (127 < r && r < 2048 ? t += String["fromCharCode"](r >> 6 | 192) : (t += String["fromCharCode"](r >> 12 | 224), t += String["fromCharCode"](r >> 6 & 63 | 128)), t += String["fromCharCode"](63 & r | 128));
        }
        return t;
    }(e)), f = 1732584193, d = 4023233417, g = 2562383102, v = 271733878, a = 0; a < s["length"]; a += 16) d = o(d = o(d = o(d = o(d = r(d = r(d = r(d = r(d = n(d = n(d = n(d = n(d = t(d = t(d = t(d = t(u = d, g = t(p = g, v = t(h = v, f = t(l = f, d, g, v, s[a + 0], 7, 3614090360), d, g, s[a + 1], 12, 3905402710), f, d, s[a + 2], 17, 606105819), v, f, s[a + 3], 22, 3250441966), g = t(g, v = t(v, f = t(f, d, g, v, s[a + 4], 7, 4118548399), d, g, s[a + 5], 12, 1200080426), f, d, s[a + 6], 17, 2821735955), v, f, s[a + 7], 22, 4249261313), g = t(g, v = t(v, f = t(f, d, g, v, s[a + 8], 7, 1770035416), d, g, s[a + 9], 12, 2336552879), f, d, s[a + 10], 17, 4294925233), v, f, s[a + 11], 22, 2304563134), g = t(g, v = t(v, f = t(f, d, g, v, s[a + 12], 7, 1804603682), d, g, s[a + 13], 12, 4254626195), f, d, s[a + 14], 17, 2792965006), v, f, s[a + 15], 22, 1236535329), g = n(g, v = n(v, f = n(f, d, g, v, s[a + 1], 5, 4129170786), d, g, s[a + 6], 9, 3225465664), f, d, s[a + 11], 14, 643717713), v, f, s[a + 0], 20, 3921069994), g = n(g, v = n(v, f = n(f, d, g, v, s[a + 5], 5, 3593408605), d, g, s[a + 10], 9, 38016083), f, d, s[a + 15], 14, 3634488961), v, f, s[a + 4], 20, 3889429448), g = n(g, v = n(v, f = n(f, d, g, v, s[a + 9], 5, 568446438), d, g, s[a + 14], 9, 3275163606), f, d, s[a + 3], 14, 4107603335), v, f, s[a + 8], 20, 1163531501), g = n(g, v = n(v, f = n(f, d, g, v, s[a + 13], 5, 2850285829), d, g, s[a + 2], 9, 4243563512), f, d, s[a + 7], 14, 1735328473), v, f, s[a + 12], 20, 2368359562), g = r(g, v = r(v, f = r(f, d, g, v, s[a + 5], 4, 4294588738), d, g, s[a + 8], 11, 2272392833), f, d, s[a + 11], 16, 1839030562), v, f, s[a + 14], 23, 4259657740), g = r(g, v = r(v, f = r(f, d, g, v, s[a + 1], 4, 2763975236), d, g, s[a + 4], 11, 1272893353), f, d, s[a + 7], 16, 4139469664), v, f, s[a + 10], 23, 3200236656), g = r(g, v = r(v, f = r(f, d, g, v, s[a + 13], 4, 681279174), d, g, s[a + 0], 11, 3936430074), f, d, s[a + 3], 16, 3572445317), v, f, s[a + 6], 23, 76029189), g = r(g, v = r(v, f = r(f, d, g, v, s[a + 9], 4, 3654602809), d, g, s[a + 12], 11, 3873151461), f, d, s[a + 15], 16, 530742520), v, f, s[a + 2], 23, 3299628645), g = o(g, v = o(v, f = o(f, d, g, v, s[a + 0], 6, 4096336452), d, g, s[a + 7], 10, 1126891415), f, d, s[a + 14], 15, 2878612391), v, f, s[a + 5], 21, 4237533241), g = o(g, v = o(v, f = o(f, d, g, v, s[a + 12], 6, 1700485571), d, g, s[a + 3], 10, 2399980690), f, d, s[a + 10], 15, 4293915773), v, f, s[a + 1], 21, 2240044497), g = o(g, v = o(v, f = o(f, d, g, v, s[a + 8], 6, 1873313359), d, g, s[a + 15], 10, 4264355552), f, d, s[a + 6], 15, 2734768916), v, f, s[a + 13], 21, 1309151649), g = o(g, v = o(v, f = o(f, d, g, v, s[a + 4], 6, 4149444226), d, g, s[a + 11], 10, 3174756917), f, d, s[a + 2], 15, 718787259), v, f, s[a + 9], 21, 3951481745), f = c(f, l), d = c(d, u), g = c(g, p), v = c(v, h);
    return (i(f) + i(d) + i(g) + i(v))["toLowerCase"]();
}

function $_DJL(e) {
    this["$_BAEW"] = e || [];
}

function $_BFr() {
      var e,
        n = Object["create"] || function () {
          function n() {}
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
          "init": function () {},
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
              for (var e = this["$_DFi"] = this["$_CEL"], t = e["words"], n = e["sigBytes"] / 4, r = 4 * (1 + (this["$_DEL"] = 6 + n)), o = this["$_DGM"] = [], i = 0; i < r; i++) if (i < n) o[i] = t[i];else {
                var s = o[i - 1];
                i % n ? 6 < n && i % n == 4 && (s = x[s >>> 24] << 24 | x[s >>> 16 & 255] << 16 | x[s >>> 8 & 255] << 8 | x[255 & s]) : (s = x[(s = s << 8 | s >>> 24) >>> 24] << 24 | x[s >>> 16 & 255] << 16 | x[s >>> 8 & 255] << 8 | x[255 & s], s ^= D[i / n | 0] << 24), o[i] = o[i - n] ^ s;
              }
              for (var a = this["$_DHB"] = [], _ = 0; _ < r; _++) {
                i = r - _;
                if (_ % 4) s = o[i];else s = o[i - 4];
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

function le(e) {
    this["$_FIw"] = "string" == typeof e ? N["createElement"](e) : e;
}

function Ze(e, t) {
    var n = this;
    //     r = new Qe(e);
    // r["remUnit"] && !isNaN(r["remUnit"]) && (ge = "rem", ve = r["remUnit"]),
    // r["autoLanguage"] && !r["hasOwnProperty"]("lang") && (r["lang"] = $_Ja($_BAt())),
    // r["https"] && (r["protocol"] = "https://"),
    // e["debugConfig"] && r["$_BJBm"](e["debugConfig"]),
    // "float" !== r["product"] && "popup" !== r["product"] && "custom" !== r["product"] && "bind" !== r["product"] && (r["product"] = "float"),
    // (w || y) && "float" === r["product"] && (r["product"] = "popup"),
    // y && "custom" === r["product"] && (r["product"] = "popup"),
    //     r["cc"] = pe["hardwareConcurrency"] || 0,
    //     r["supportWorker"] = "undefined" != typeof Worker,
    n["$_BJCe"] = new Ae();
    // n["$_EIc"] = r,
    // n["$_EJN"] = e,
    // n["$_BJDV"] = new U(n),
    // n["$_BAAk"] = new Y(function (e, t) {
    //     n["$_BJEe"](e, t);
    // }),
    // n["$_BJFE"] = t,
    // n["$_BJG_"] = w ? 3 : 0,
    // n["$_BJHm"] = w ? "web_mobile" : "web", n["$_BJIg"] = -1,
    // n["$_EIc"]["$_FFL"] = {
    //     "pt": 0
    // };
    // n["$_BAAk"]["$_HIY"](Oe),
    n["$_BJJT"] = new Te();
    n["$_BDHn"] = new De();
}


function Te() {
    var e = this;
    e["posX"] = 0, e["posY"] = 0, e["scrollLeft"] = 0, e["scrollTop"] = 0, e["lastTime"] = 0,
        e["$_BGS"] = [],
        e["$_BFJI"] = new le(N),
        e["$_BGAm"] = new le(window),
        e["$_BGBk"] = null,
        e["$_BGCU"] = null,
        e["$_BGDG"] = 0,
        e["$_BGEr"] = 0,
        e["$_BGFA"] = 0;
    // e["$_BGGo"]();
}

function Ae() {
    this["$_BGS"] = this["$_BGHv"]();
}

function De() {
    var t = this;
    t["$_BGS"] = [], t["$_BGIU"] = 0, t["$_BGJf"] = [], t["$_BHA_"] = 30, t["$_BHBY"] = N["body"] && N["body"]["nodeType"], t["$_BHCf"] = new le(N);
    // t["$_BHCf"]["$_JGb"]("click", function (e) {
    //     t["$_BHDo"](e["$_DJL"]);
    // });
}

Ze["prototype"] = {
    // 环境检测+记录函数执行时间 扣不了！！！直接复制浏览器中的
    // "$_CEDb": function () {
    //     var e = {
    //         "v": "9.2.0-guwyxh"
    //     };
    //     this["$_EIc"];
    //     e["te"] = Se["touchEvent"], e["$_BBn"] = Se["mouseEvent"];
    //     var t = !w && Ee;
    //     return e["ven"] = t["vendor"] || -1, e["ren"] = t["renderer"] || -1, e["fp"] = this["$_BJJT"]["$_BGBk"], e["lp"] = this["$_BJJT"]["$_BGCU"], e["em"] = {}, W([], e["em"]), e["tm"] = new Ce()["$_BFHL"](), e["dnf"] = "dnf", e["by"] = this["$_BJIg"], e;
    // },
}

// 浏览器指纹检测
Ae["prototype"] = {
    "$_BIIm": ["A", "ARTICLE", "ASIDE", "AUDIO", "BASE", "BUTTON", "CANVAS", "CODE", "IFRAME", "IMG", "INPUT", "LABEL", "LINK", "NAV", "OBJECT", "OL", "PICTURE", "PRE", "SECTION", "SELECT", "SOURCE", "SPAN", "STYLE", "TABLE", "TEXTAREA", "VIDEO"],
    "$_BIJk": ["DIV", "P", "UL", "LI", "SCRIPT"],
    "$_BGHv": function () {
        return {};
    },
    "$_BICU": function (e, t) {
        var n = this,
            r = n["$_BGS"], // 应该是浏览器指纹 但是浏览器中并没有获取
            o = [];
        // console.log(r)
        return new $_DJL(n["$_BJAB"]())["$_EBg"](function (e) {
            var t = r[e];
            o["push"](n["$_BIHu"](t) ? -1 : t);
        }), o["join"]("magic data");
    },
    "$_BJAB": function () {
        return ["textLength", "HTMLLength", "documentMode"]["concat"](this["$_BIIm"])["concat"](["screenLeft", "screenTop", "screenAvailLeft", "screenAvailTop", "innerWidth", "innerHeight", "outerWidth", "outerHeight", "browserLanguage", "browserLanguages", "systemLanguage", "devicePixelRatio", "colorDepth", "userAgent", "cookieEnabled", "netEnabled", "screenWidth", "screenHeight", "screenAvailWidth", "screenAvailHeight", "localStorageEnabled", "sessionStorageEnabled", "indexedDBEnabled", "CPUClass", "platform", "doNotTrack", "timezone", "canvas2DFP", "canvas3DFP", "plugins", "maxTouchPoints", "flashEnabled", "javaEnabled", "hardwareConcurrency", "jsFonts", "timestamp", "performanceTiming", "internalip", "mediaDevices"])["concat"](this["$_BIJk"])["concat"](["touchEvent"]);
    },
    "$_BIHu": function (e) {
        return void 0 === e;
    },
}

// 处理轨迹
Te["prototype"] = {
    "$_BHA_": y || b || x ? 150 : 300,
    // 采集轨迹的函数 函数置空
    "$_BGGo": function () {
        // var r = this;
        // r["$_BFJI"]["$_JGb"]("move", function (e) {
        //     r["$_BHEC"](), r["posX"] = e["$_BEIx"](), r["posY"] = e["$_BEJr"](), r["$_BHFa"]("move", r["posX"], r["posY"], e["$_DJL"]["type"]);
        // })["$_JGb"]("down", function (e) {
        //     var t = r["$_BGS"]["length"];
        //     r["$_BGS"][t - 1] && "down" === r["$_BGS"][t - 1][0] || (r["$_BHEC"](), r["posX"] = e["$_BEIx"](), r["posY"] = e["$_BEJr"](), r["$_BHFa"]("down", r["posX"], r["posY"], e["$_DJL"]["type"]), r["$_BGS"][t - 2] && "move" === r["$_BGS"][t - 2][0] && r["$_BGS"][t - 3] && "up" === r["$_BGS"][t - 3][0] && r["$_BHGe"](t - 2));
        // })["$_JGb"]("up", function (e) {
        //     var t = r["$_BGS"]["length"];
        //     r["$_BGS"][t - 1] && "up" === r["$_BGS"][t - 1][0] || (r["$_BHEC"](), r["posX"] = e["$_BEIx"](), r["posY"] = e["$_BEJr"](), r["$_BHFa"]("up", r["posX"], r["posY"], e["$_DJL"]["type"]), r["$_BGS"][t - 2] && "move" === r["$_BGS"][t - 2][0] && r["$_BGS"][t - 3] && "down" === r["$_BGS"][t - 3][0] && r["$_BHGe"](t - 2));
        // })["$_JGb"]("focusin", function () {
        //     r["$_BHFa"]("focus");
        // }), r["$_BGAm"]["$_JGb"]("scroll", function () {
        //     var e = "pageXOffset" in window,
        //         t = e ? window["pageXOffset"] : N["body"]["scrollLeft"],
        //         n = e ? window["pageYOffset"] : N["body"]["scrollTop"];
        //     r["posX"] = t - r["scrollLeft"] + r["posX"], r["posY"] = n - r["scrollTop"] + r["posY"], r["$_BHFa"]("scroll", t - r["scrollLeft"] + r["posX"], n - r["scrollTop"] + r["posY"]), r["$_BHEC"]();
        // })["$_JGb"]("focus", function () {
        //     r["$_BHFa"]("focus");
        // })["$_JGb"]("blur", function () {
        //     r["$_BHFa"]("blur");
        // })["$_JGb"]("unload", function () {
        //     r["$_BHFa"]("unload");
        // });
    },
    // 处理轨迹 轨迹直接固定
    "$_BIBC": function () {
        // var e = this["$_BGS"];
        // return this["$_BGS"] = [], this["$_HDl"](this["$_BHIh"](e));

        this["$_BGS"] = [
            [
                "move",
                809,
                359,
                1793258215506,
                "pointermove"
            ],
            [
                "move",
                807,
                359,
                1793258215518,
                "pointermove"
            ],
            [
                "move",
                807,
                360,
                1793258215566,
                "pointermove"
            ],
            [
                "move",
                805,
                360,
                1793258215583,
                "pointermove"
            ],
            [
                "move",
                802,
                361,
                1793258215590,
                "pointermove"
            ],
            [
                "move",
                800,
                362,
                1793258215600,
                "pointermove"
            ],
            [
                "move",
                797,
                363,
                1793258215606,
                "pointermove"
            ],
            [
                "move",
                795,
                364,
                1793258215616,
                "pointermove"
            ],
            [
                "move",
                791,
                365,
                1793258215622,
                "pointermove"
            ],
            [
                "move",
                787,
                366,
                1793258215633,
                "pointermove"
            ],
            [
                "move",
                786,
                366,
                1793258215634,
                "mousemove"
            ],
            [
                "move",
                783,
                368,
                1793258215638,
                "pointermove"
            ],
            [
                "move",
                771,
                376,
                1793258215646,
                "pointermove"
            ],
            [
                "move",
                766,
                381,
                1793258215655,
                "pointermove"
            ],
            [
                "move",
                761,
                386,
                1793258215665,
                "pointermove"
            ],
            [
                "move",
                756,
                393,
                1793258215670,
                "pointermove"
            ],
            [
                "move",
                748,
                404,
                1793258215679,
                "pointermove"
            ],
            [
                "move",
                741,
                412,
                1793258215687,
                "pointermove"
            ],
            [
                "move",
                736,
                419,
                1793258215695,
                "pointermove"
            ],
            [
                "move",
                729,
                427,
                1793258215702,
                "pointermove"
            ],
            [
                "move",
                722,
                438,
                1793258215712,
                "pointermove"
            ],
            [
                "move",
                709,
                456,
                1793258215720,
                "pointermove"
            ],
            [
                "move",
                701,
                468,
                1793258215727,
                "pointermove"
            ],
            [
                "move",
                695,
                478,
                1793258215735,
                "pointermove"
            ],
            [
                "move",
                687,
                486,
                1793258215742,
                "pointermove"
            ],
            [
                "move",
                681,
                494,
                1793258215750,
                "pointermove"
            ],
            [
                "move",
                676,
                500,
                1793258215758,
                "pointermove"
            ],
            [
                "move",
                671,
                504,
                1793258215767,
                "pointermove"
            ],
            [
                "move",
                666,
                508,
                1793258215774,
                "pointermove"
            ],
            [
                "move",
                663,
                512,
                1793258215782,
                "pointermove"
            ],
            [
                "move",
                662,
                511,
                1793258215783,
                "mousemove"
            ],
            [
                "move",
                661,
                513,
                1793258215790,
                "pointermove"
            ],
            [
                "move",
                658,
                515,
                1793258215798,
                "pointermove"
            ],
            [
                "move",
                657,
                515,
                1793258215806,
                "pointermove"
            ],
            [
                "move",
                656,
                516,
                1793258215815,
                "pointermove"
            ],
            [
                "move",
                656,
                514,
                1793258215958,
                "pointermove"
            ],
            [
                "move",
                659,
                505,
                1793258215968,
                "pointermove"
            ],
            [
                "move",
                659,
                505,
                1793258215969,
                "mousemove"
            ],
            [
                "move",
                666,
                494,
                1793258215975,
                "pointermove"
            ],
            [
                "move",
                673,
                483,
                1793258215982,
                "pointermove"
            ],
            [
                "move",
                679,
                474,
                1793258215991,
                "pointermove"
            ],
            [
                "move",
                693,
                446,
                1793258216000,
                "pointermove"
            ],
            [
                "move",
                707,
                424,
                1793258216007,
                "pointermove"
            ],
            [
                "move",
                721,
                402,
                1793258216015,
                "pointermove"
            ],
            [
                "move",
                728,
                391,
                1793258216023,
                "pointermove"
            ],
            [
                "move",
                743,
                368,
                1793258216030,
                "pointermove"
            ],
            [
                "move",
                743,
                368,
                1793258216031,
                "mousemove"
            ],
            [
                "move",
                755,
                353,
                1793258216038,
                "pointermove"
            ],
            [
                "move",
                761,
                343,
                1793258216048,
                "pointermove"
            ],
            [
                "move",
                769,
                333,
                1793258216055,
                "pointermove"
            ],
            [
                "move",
                775,
                325,
                1793258216063,
                "pointermove"
            ],
            [
                "move",
                778,
                321,
                1793258216070,
                "pointermove"
            ],
            [
                "move",
                781,
                317,
                1793258216078,
                "pointermove"
            ],
            [
                "move",
                782,
                316,
                1793258216086,
                "pointermove"
            ],
            [
                "move",
                783,
                313,
                1793258216094,
                "pointermove"
            ],
            [
                "move",
                785,
                311,
                1793258216102,
                "pointermove"
            ],
            [
                "move",
                785,
                311,
                1793258216103,
                "mousemove"
            ],
            [
                "move",
                786,
                310,
                1793258216110,
                "pointermove"
            ],
            [
                "move",
                787,
                308,
                1793258216118,
                "pointermove"
            ],
            [
                "move",
                788,
                308,
                1793258216126,
                "pointermove"
            ],
            [
                "move",
                789,
                307,
                1793258216134,
                "pointermove"
            ],
            [
                "move",
                788,
                307,
                1793258216135,
                "mousemove"
            ],
            [
                "move",
                789,
                307,
                1793258216142,
                "pointermove"
            ],
            [
                "move",
                791,
                305,
                1793258216150,
                "pointermove"
            ],
            [
                "move",
                792,
                305,
                1793258216166,
                "pointermove"
            ],
            [
                "move",
                792,
                304,
                1793258216174,
                "pointermove"
            ],
            [
                "move",
                793,
                304,
                1793258216199,
                "pointermove"
            ],
            [
                "move",
                795,
                304,
                1793258216206,
                "pointermove"
            ],
            [
                "move",
                797,
                302,
                1793258216215,
                "pointermove"
            ],
            [
                "move",
                799,
                301,
                1793258216222,
                "pointermove"
            ],
            [
                "move",
                801,
                300,
                1793258216230,
                "pointermove"
            ],
            [
                "move",
                803,
                298,
                1793258216238,
                "pointermove"
            ],
            [
                "move",
                802,
                298,
                1793258216239,
                "mousemove"
            ],
            [
                "move",
                803,
                298,
                1793258216494,
                "pointermove"
            ],
            [
                "move",
                804,
                298,
                1793258216558,
                "pointermove"
            ],
            [
                "down",
                804,
                298,
                1793258216634,
                "pointerdown"
            ],
            [
                "focus",
                1793258216634
            ],
            [
                "up",
                804,
                298,
                1793258216702,
                "pointerup"
            ]
        ];  // 用户的滑动轨迹
        var e = this["$_BGS"];
        this["$_BGS"] = []; // 轨迹是"一次性的"(在浏览器中),用完后置空
        // console.log(this["$_BHIh"](e))
        // console.log(this["$_HDl"](this["$_BHIh"](e)))
        return this["$_HDl"](this["$_BHIh"](e));
    },
    "$_HDl": function (e) {
        var p = {
            "move": 0,
            "down": 1,
            "up": 2,
            "scroll": 3,
            "focus": 4,
            "blur": 5,
            "unload": 6,
            "unknown": 7
        };

        function h(e, t) {
            for (var n = e["toString"](2), r = "", o = n["length"] + 1; o <= t; o += 1) r += "0";
            return n = r + n;
        }

        function f(e) {
            var t = [],
                n = e["length"],
                r = 0;
            while (r < n) {
                var o = e[r],
                    i = 0;
                while (1) {
                    if (16 <= i) break;
                    var s = r + i + 1;
                    if (n <= s) break;
                    if (e[s] !== o) break;
                    i += 1;
                }
                r = r + 1 + i;
                var a = p[o];
                0 != i ? (t["push"](8 | a), t["push"](i - 1)) : t["push"](a);
            }
            for (var _ = h(32768 | n, 16), c = "", l = 0, u = t["length"]; l < u; l += 1) c += h(t[l], 4);
            return _ + c;
        }

        function c(e, t) {
            for (var n = [], r = 0, o = e["length"]; r < o; r += 1) n["push"](t(e[r]));
            return n;
        }

        function d(e, t) {
            e = function _(e) {
                var t = 32767,
                    n = (e = c(e, function (e) {
                        return t < e ? t : e < -t ? -t : e;
                    }))["length"],
                    r = 0,
                    o = [];
                while (r < n) {
                    var i = 1,
                        s = e[r],
                        a = Math["abs"](s);
                    while (1) {
                        if (n <= r + i) break;
                        if (e[r + i] !== s) break;
                        if (127 <= a || 127 <= i) break;
                        i += 1;
                    }
                    1 < i ? o["push"]((s < 0 ? 49152 : 32768) | i << 7 | a) : o["push"](s), r += i;
                }
                return o;
            }(e);
            var n,
                r = [],
                o = [];
            c(e, function (e) {
                var t = Math["ceil"](function n(e, t) {
                    return 0 === e ? 0 : Math["log"](e) / Math["log"](t);
                }(Math["abs"](e) + 1, 16));
                0 === t && (t = 1), r["push"](h(t - 1, 2)), o["push"](h(Math["abs"](e), 4 * t));
            });
            var i = r["join"](""),
                s = o["join"]("");
            return n = t ? c(function a(e, t) {
                var n = [];
                return c(e, function (e) {
                    t(e) && n["push"](e);
                }), n;
            }(e, function (e) {
                return 0 != e && e >> 15 != 1;
            }), function (e) {
                return e < 0 ? "1" : "0";
            })["join"]("") : "", h(32768 | e["length"], 16) + i + s + n;
        }

        return function (e) {
            for (var t = [], n = [], r = [], o = [], i = 0, s = e["length"]; i < s; i += 1) {
                var a = e[i],
                    _ = a["length"];
                t["push"](a[0]), n["push"](2 === _ ? a[1] : a[2]), 3 === _ && (r["push"](a[1][0]), o["push"](a[1][1]));
            }
            var c = f(t) + d(n, !1) + d(r, !0) + d(o, !0),
                l = c["length"];
            return l % 6 != 0 && (c += h(0, 6 - l % 6)), function u(e) {
                for (var t = "", n = e["length"] / 6, r = 0; r < n; r += 1) t += "()*,-./0123456789:?@ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~"["charAt"](window["parseInt"](e["slice"](6 * r, 6 * (r + 1)), 2));
                return t;
            }(c);
        }(e);
    },
    "$_BHIh": function (e) {
        var t = 0,
            n = 0,
            r = [],
            o = this,
            i = o["lastTime"];
        if (e["length"] <= 0) return [];
        for (var s = null, a = null, _ = o["$_BHJq"](e), c = _["length"], l = c < this["$_BHA_"] ? 0 : c - this["$_BHA_"]; l < c; l += 1) {
            var u = _[l],
                p = u[0];
            -1 < new $_DJL(["down", "move", "up", "scroll"])["$_EHE"](p) ? (s || (s = u), a = u, r["push"]([p, [u[1] - t, u[2] - n], o["$_BHHr"](i ? u[3] - i : i)]), t = u[1], n = u[2], i = u[3]) : -1 < new $_DJL(["blur", "focus", "unload"])["$_EHE"](p) && (r["push"]([p, o["$_BHHr"](i ? u[1] - i : i)]), i = u[1]);
        }
        return o["$_BGBk"] = s, o["$_BGCU"] = a, r;
    },
    "$_BHJq": function (e) {
        var t = "",
            n = 0;
        (e || [])["length"];
        while (!t && e[n]) t = e[n] && e[n][4], n++;
        if (!t) return e;
        for (var r = "", o = ["mouse", "touch", "pointer", "MSPointer"], i = 0, s = o["length"]; i < s; i++) 0 === t["indexOf"](o[i]) && (r = o[i]);
        for (var a = e["slice"](), _ = a["length"] - 1; 0 <= _; _--) {
            var c = a[_],
                l = c[0];
            if (-1 < new $_DJL(["move", "down", "up"])["$_EHE"](l)) 0 !== (c[4] || "")["indexOf"](r) && a["splice"](_, 1);
        }
        return a;
    },
    "$_BHHr": function (e) {
        var t = 32767;
        return "number" != typeof e ? e : (t < e ? e = t : e < -t && (e = -t), Math["round"](e));
    },
    "$_BICU": function () {
        return this["$_HDl"](this["$_BGS"]);
    },
}

$_DJL["prototype"] = {
    "$_EHE": function (e) {
        var t = this["$_BAEW"];
        if (t["indexOf"]) return t["indexOf"](e);
        for (var n = 0, r = t["length"]; n < r; n += 1) if (t[n] === e) return n;
        return -1;
    },
    "$_EBg": function (e) {
        var t = this["$_BAEW"];
        if (t["map"]) return new $_DJL(t["map"](e));
        for (var n = [], r = 0, o = t["length"]; r < o; r += 1) n[r] = e(t[r], r, this);
        return new $_DJL(n);
    },
}

De["prototype"] = {
    "$_BIBC": function () {
        var e = this["$_BGS"] || [];
        return this["$_BGS"] = [], this["$_BGIU"] = 0, this["$_BGJf"] = [], (y || b || x) && (e = e["slice"](0, 10)), e["join"]("|");
    },
}

var CryptoJS = require("crypto-js");
function md5(data) {
    /** MD5 摘要，返回 32 位小写十六进制字符串 */
    return CryptoJS.MD5(data).toString();
}
function $_CECm(gt, challenge, _s, finger_print) {

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
    var i = new Ze(config);
    // n["$_BJJT"] = new Te()
    // n["$_BJCe"] = new Ae()
    // n["$_BDHn"] = new De()
    var e = i["$_BJJT"]["$_BIBC"]();    // 这是找到滑动验证码的弹窗入口的轨迹（加密后）
    var t = i["$_BJJT"]["$_BICU"]();    // 确认轨迹只使用一次
    var n = i["$_BJCe"]["$_BICU"]();    // 浏览器指纹(！！！注意！！！这里和没解混淆获取到的数据不一样) 不想麻烦的话直接固定指纹
    var r = "SPAN_0"
    // var r = i["$_BDHn"]["$_BIBC"]();
    // o = i["$_EIc"],  // 数据
    // s = new Date()["getTime"]() - 1793427715517; // 执行时的时间差
    var o = {
        "gt": gt,
        "challenge": challenge,
        "c": [
            12,
            58,
            98,
            36,
            43,
            95,
            62,
            15,
            12
        ],
        "s": _s,
    };
    var s = 26916;  // 时间差 直接固定一个浏览器中的真实值

    // M.38Pjp8O:9U(P(60,(55(b,J-/Rj/1-0-E/1KE-1VVK.*3G/*3GSOUOSVU-1-1-MU94j(bP8e8(.b8(b(5q,q81?/)(*MU*)(E-(3)(?MM/)(QH6-cK),VNE-,MM1gK))QJDB1/.G)Nj/1MEG/M9?)(j-*M9-1-)ME(((((M,K(,5(5bbn5((((((b(8-h(?-U-)*)M?.*/)(cMM2*M9OHM9G)MM/.M)19-*-P2AB/:hbE9f5@0)(U/(((,qqqj
    // M(*((1((M((
    // -1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1magic data-1
    // SPAN_0
    // console.log("加密轨迹: " + e);
    // console.log("轨迹置空后验证: " + t);
    // console.log(n);
    // console.log(r);
    var now = new Date().getTime();
    // $_CCFV临时固定，可以扣
    // i["$_CCFV"] = '-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1!!-1';
    // $_CEDb 检测环境 扣不了！！！
    i["$_CEDb"] = {
        "v": "9.2.0-guwyxh",
        "te": false,
        "$_BBn": true,
        "ven": "Google Inc. (AMD)",
        "ren": "ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001638) Direct3D11 vs_5_0 ps_5_0, D3D11)",
        "fp": [
            "move",
            628,
            250,
            now,  // now
            "pointermove"
        ],
        "lp": [
            "up",
            823,
            302,
            now + 999,  // now + 时间差
            "pointerup"
        ],
        "em": {
            "ph": 0,
            "cp": 0,
            "ek": "11",
            "wd": 1,
            "nt": 0,
            "si": 0,
            "sc": 0
        },
        "tm": {
            "a": 1793448743739, // 时间差检测
            "b": 1793448743810,
            "c": 1793448743810,
            "d": 0,
            "e": 0,
            "f": 1793448743739,
            "g": 1793448743739,
            "h": 1793448743739,
            "i": 1793448743739,
            "j": 1793448743739,
            "k": 0,
            "l": 1793448743741,
            "m": 1793448743807,
            "n": 1793448743808,
            "o": 1793448743812,
            "p": 1793448743909,
            "q": 1793448743909,
            "r": 1793448743910,
            "s": 1793448743921,
            "t": 1793448743921,
            "u": 1793448743921
        },
        "dnf": "dnf",
        "by": 0
    };
    var result = "";
    for (
        var a = [["lang", o["lang"] || "zh-cn"],
            ["type", "fullpage"],
            ["tt", function (e, t, n) {
                if (!t || !n) return e;
                var r,
                    o = 0,
                    i = e,
                    s = t[0],
                    a = t[2],
                    _ = t[4];
                while (r = n["substr"](o, 2)) {
                    o += 2;
                    var c = parseInt(r, 16),
                        l = String["fromCharCode"](c),
                        u = (s * c * c + a * c + _) % e["length"];
                    i = i["substr"](0, u) + l + i["substr"](u);
                }
                return i;
            }(e, o["c"], o["s"]) || -1],
            ["light", r || -1],
            ["s", md5(p["$_HDl"](t))],
            ["h", md5(p["$_HDl"](n))],
            ["hh", md5(n)],
            ["hi", md5(finger_print)],
            ["vip_order", i["vip_order"] || -1],
            ["ct", i["ct"] || -1],
            ["ep", i["$_CEDb"] || -1],
            ["passtime", s || -1],
            ["rp", H(o["gt"] + o["challenge"] + s)]
        ], _ = 0; _ < a["length"]; _++
    )
        result += "\"" + a[_][0] + "\":" + de["stringify"](a[_][1]) + ",";
    console.log("$_CECm的结果：" + result);
    return result;
}

function calc_second_w(gt, challenge, aeskey, _s, finger_print) {
    var code_1 = "function o(e,t){var $_CFGDn=Vwtrj.$_CV,$_CFGCS=['$_CFGGc'].concat($_CFGDn),$_CFGE_=$_CFGCS[1];$_CFGCS.shift();var $_CFGFg=$_CFGCS[0];function n(e){var $_DDHGX=Vwtrj.$_DD()[3][19];for(;$_DDHGX!==Vwtrj.$_DD()[6][16];){switch($_DDHGX){case Vwtrj.$_DD()[15][19]:var t=5381,n=e[$_CFGE_(71)],r=0;$_DDHGX=Vwtrj.$_DD()[9][18];break;case Vwtrj.$_DD()[12][18]:while(n--)t=(t<<5)+t+e[$_CFGE_(49)](r++);$_DDHGX=Vwtrj.$_DD()[12][17];break;case Vwtrj.$_DD()[9][17]:return t&=~(1<<31);break;}}}100<new Date()[$_CFGE_(209)]()-t[$_CFGDn(209)]()&&(e=$_CFGE_(1108)),r=$_CFGDn(732)+i[$_CFGDn(1150)]+$_CFGE_(1194)+n(o[$_CFGE_(47)]()+n(n[$_CFGDn(47)]())+n(e[$_CFGE_(47)]()))+$_CFGE_(1103);}";
    var code_2 = "function n(e){var $_DDHGX=Vwtrj.$_DD()[3][19];for(;$_DDHGX!==Vwtrj.$_DD()[6][16];){switch($_DDHGX){case Vwtrj.$_DD()[15][19]:var t=5381,n=e[$_CFGE_(71)],r=0;$_DDHGX=Vwtrj.$_DD()[9][18];break;case Vwtrj.$_DD()[12][18]:while(n--)t=(t<<5)+t+e[$_CFGE_(49)](r++);$_DDHGX=Vwtrj.$_DD()[12][17];break;case Vwtrj.$_DD()[9][17]:return t&=~(1<<31);break;}}}";
    var code_3 = "bbOy";

    var t = ["bbOy"];
    t["push"]("");
    var r = "";
    !function o(e, t) {
        function n(e) {
            var t = 5381,
                n = e["length"],
                r = 0;
            while (n--) t = (t << 5) + t + e["charCodeAt"](r++);
            return t &= ~(1 << 31);
        }

        100 < new Date()["getTime"]() - t["getTime"]() && (e = "qwe"); // 100ms 时序检查
        // console.log("captcha_token: ", n(code_1 + n(code_2) + n(code_3)));  // 20261029 浏览器 captcha_token:112439067
        r = "{" + $_CECm(gt, challenge, _s, finger_print) + "\"captcha_token\":\"" + n(code_1 + n(code_2) + n(code_3)) + "\",\"tsfq\":\"xovrayel\"}";
    }(t["shift"](), new Date());
    var c = $_BFr();
    var w2 = p["$_HEJ"](c["encrypt"](r, aeskey));
    return w2;
}

var gt = "019924a82c70bb123aae90d483087f94";
var challenge = "b6a540d0298c3fde78c5130153c7947f";
var aeskey = "1f4439941c04319b";
var s = "2c44526e";
console.log(calc_second_w(gt, challenge, aeskey, s));