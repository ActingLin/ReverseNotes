var R = global;

function Jt(t) {
    t = R["encodeURIComponent"](t)["replace"](/%([0-9A-F]{2})/g, function(n, t) {
        return o("0x" + t)
    });
    try {
        return R["btoa"](t)
    } catch (n) {
        return R[W5][K5](t)[U5](Z5)
    }
}

function o(n) {
    t = "",
    ["66", "72", "6f", "6d", "43", "68", "61", "72", "43", "6f", "64", "65"]["forEach"](function(n) {
        t += R["unescape"]("%u00" + n)
    });
    var t, e = t;
    return R["String"]["fromCharCode"](n)
}

function Qt(n, t) {
    t = t || u();
    for (var e = (n = n["split"](""))["length"], r = t["length"], a = "charCodeAt", i = 0; i < e; i++)
        n[i] = o(n[i][a](0) ^ t[(i + 10) % r][a](0));
    return n["join"]("")
}



function getAnalysis(page) {
    var a = [
        3,
        "2026-07-13",
        "2026-07-13",
        "2026-07-13",
        "cn",
        "36",
        4,
        page   // 翻页
    ]
    a = a["sort"]()["join"]("");
    a = Jt(a);
    // 14377可能会变
    var r = +new R["Date"] - (14377 || 0) - 1661224081041
    a = (a += "@#" + "/rank/offline") + ("@#" + r) + ("@#" + 3);
    // console.log(a);
    var e = Jt(Qt(a, "xyz517cda96efgh"))
    // console.log(e)
    return e
}

// console.log(get_analysis(1)); // 14377可能会变
// console.log(get_analysis(2)); 
