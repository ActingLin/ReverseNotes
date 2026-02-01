const CryptoJS = require("crypto-js")
_n = {
    "rn": 20,
    "lastTime": 1769932392,
    "subscribedColumnIds": "",
    "hasFirstVipArticle": "1",
    "os": "web",
    "sv": "8.4.6",
    "app": "CailianpressWeb"
}
function i(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t && (n = n.filter((function(t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable
        }
        ))),
        r.push.apply(r, n)
    }
    return r
}
function n(e, t, r) {
    return t in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = r,
    e
}
function a(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = null != arguments[t] ? arguments[t] : {};
        t % 2 ? i(Object(r), !0).forEach((function(t) {
            n(e, t, r[t])
        }
        )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : i(Object(r)).forEach((function(t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
        }
        ))
    }
    return e
}
function s(e) {
    return e.filter((function(e) {
        return e
    }
    )).join("&")
}
function u(e) {
    return Object.keys(e).sort()
}
function c(e, t) {
    var r = typeof t
        , n = null;
    return t === n ? n = i ? n : "".concat(a(e), "=").concat(n) : /string|number|boolean/.test(r) ? n = "".concat(a(e), "=").concat(a(t)) : Array.isArray(t) ? n = function(e, t) {
        return t.length ? s(t.map((function(t, r) {
            return c("".concat(e, "[").concat(r, "]"), t)
        }
        ))) : a("".concat(e, "[]"))
    }(e, t) : "object" === r && (n = function(e, t) {
        return s(u(t).map((function(r) {
            return c("".concat(e, "[").concat(r, "]"), t[r])
        }
        )))
    }(e, t)),
    n
}

// wordsToBytes = function(e) {
//     for (var t = [], r = 0; r < 32 * e.length; r += 8)
//         t.push(e[r >>> 5] >>> 24 - r % 32 & 255);
//     return t
// }

// bytesToHex = function(e) {
//     for (var t = [], r = 0; r < e.length; r++)
//         t.push((e[r] >>> 4).toString(16)),
//         t.push((15 & e[r]).toString(16));
//     return t.join("")
// }

// function o(e, r) {
//     if (void 0 === e || null === e)
//         throw new Error("Illegal argument " + e);
//     var n = wordsToBytes(a(e, r));
//     return r && r.asBytes ? n : r && r.asString ? i.bytesToString(n) : bytesToHex(n)
// }

function p(e) {
    var t = e && s(u(e).map((function(t) {
        return c(t, e[t])
    }
    )));
    // return t = n.sync(t),
    // t = o(t)
    return t = CryptoJS.SHA1(t).toString(),
    t = CryptoJS.MD5(t).toString()
}

function get_sign(param_obj) {
    return p(a({}, param_obj))
}

// console.log(a({}, _n))
// sign = p(a({}, _n))
// console.log(sign)
