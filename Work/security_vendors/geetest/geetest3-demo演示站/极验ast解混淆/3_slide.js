!function () {
  !function (t, e) {
    "use strict";
    "object" == typeof module && "object" == typeof module["exports"] ? module["exports"] = t["document"] ? e(t, !0) : function (t) {
      if (!t["document"]) throw new Error("Geetest requires a window with a document");
      return e(t);
    } : e(t);
  }("undefined" != typeof window ? window : this, function (window, t) {
    function $_BIT(t) {
      for (var e in t) if ("object" == typeof t && t["hasOwnProperty"](e)) return t;
      return {
        "loading": "加载中...",
        "slide": "拖动左边滑块完成上方拼图",
        "refresh": "刷新验证",
        "feedback": "帮助反馈",
        "fail": "拖动滑块将悬浮图像正确拼合",
        "success": "sec 秒的速度超过 score% 的用户",
        "forbidden": "哇哦～怪物吃了拼图 3 秒后重试",
        "error": "请关闭验证重试",
        "logo": "由极验提供技术支持",
        "close": "关闭验证",
        "voice": "视觉障碍"
      };
    }
    function $_BHp(t, e, n) {
      var r = t["split"]("."),
        i = r[0] || "div",
        o = new ct(r)["$_BJq"](1)["$_CAZ"](function (t, e, n) {
          return R + t;
        })["$_CBa"](" "),
        s = new lt(i);
      return n("." + r[1], s), "input" == i && s["$_CCR"]({
        "type": "hidden",
        "name": o
      }), s["$_CDI"]({
        "className": o
      }), K(e) ? s["$_CCR"]({
        "textContent": e
      }) : new ut(e)["$_CEj"](function (t, e) {
        s["$_CFV"]($_BHp(t, e, n));
      }), s;
    }
    function $_BGl(t) {
      return {
        ".popup_ghost": {},
        ".popup_box": {
          ".popup_header": {
            "span.popup_tip": {},
            "span.popup_close": {}
          },
          ".popup_wrap": t
        }
      };
    }
    function $_BFZ(t, e) {
      var n = t["$_CGE"],
        r = n["src"],
        i = n["height"] / 2;
      e["$_CHt"]();
      for (var o = 0; o < 52; o += 1) {
        var s = Ut[o] % 26 * 12 + 1,
          a = 25 < Ut[o] ? i : 0,
          _ = "-" + $_BDZ(s) + " -" + $_BDZ(a);
        new lt("div")["$_sTyyle"]({
          "backgroundImage": "url(" + r + ")",
          "backgroundPosition": _
        })["$_CIm"](e);
      }
    }
    function $_BEN(t, e) {
      t = t["$_CGE"], e = e["$_CGE"];
      var n = t["width"],
        r = t["height"],
        i = h["createElement"]("canvas");
      i["width"] = n, i["height"] = r;
      var o = i["getContext"]("2d");
      o["drawImage"](t, 0, 0);
      var s = e["getContext"]("2d");
      e["height"] = r, e["width"] = 260;
      for (var a = r / 2, _ = 0; _ < 52; _ += 1) {
        var c = Ut[_] % 26 * 12 + 1,
          u = 25 < Ut[_] ? a : 0,
          l = o["getImageData"](c, u, 10, a);
        s["putImageData"](l, _ % 26 * 10, 25 < _ ? a : 0);
      }
    }
    function $_BDZ(t) {
      try {
        return (t / vt)["toFixed"](4) + gt;
      } catch (e) {
        return t + "px";
      }
    }
    function $_BCm() {
      return new G(function (t) {
        var e = h["createElement"]("img");
        e["onload"] = e["onerror"] = function () {
          2 === e["height"] ? t(!0) : t(!1);
        }, e["src"] = "data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wAiMwAgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA";
      });
    }
    function $_BBj(t) {
      return t["status"] ? t["data"] : t;
    }
    function $_BAV(n, t) {
      new ut(t)["$_CEj"](function (t, e) {
        n[t] = e;
      });
    }
    function $_Jl() {
      var t = new Date(),
        e = t["getFullYear"](),
        n = t["getMonth"]() + 1,
        r = t["getDate"](),
        i = t["getHours"](),
        o = t["getMinutes"](),
        s = t["getSeconds"]();
      return 1 <= n && n <= 9 && (n = "0" + n), 0 <= r && r <= 9 && (r = "0" + r), 0 <= i && i <= 9 && (i = "0" + i), 0 <= o && o <= 9 && (o = "0" + o), 0 <= s && s <= 9 && (s = "0" + s), e + "-" + n + "-" + r + " " + i + ":" + o + ":" + s;
    }
    function $_Im() {
      return new Date()["getTime"]();
    }
    function $_HL() {
      var n = {};
      return function (t, e) {
        if (!e) return n[t["replace"](R, "")];
        n[t] = e;
      };
    }
    function $_GQ() {
      return parseInt(1e4 * Math["random"]()) + new Date()["valueOf"]();
    }
    function $_Fc(t) {
      return "function" == typeof t;
    }
    function $_EF(t) {
      return "boolean" == typeof t;
    }
    function K(t) {
      return "string" == typeof t;
    }
    function Q(t) {
      return "number" == typeof t;
    }
    function z(n) {
      return console && console["error"] && console["error"](n), new G(function (t, e) {
        e(n);
      });
    }
    function q(t, e, n) {
      var r = e["$_CJQ"],
        i = (e["$_DAa"], "GeetestError");
      return n && (i = "UserCallBackError", t["detail"] = n, r["error_code"] = "604", r["msg"] = t["msg"], c(j(r, "./usercallback/" + (t["detail"] && t["detail"]["type"])), r["post"], r["protocol"])), e["$_DBw"](t), new Error(i + ": " + (t && t["msg"]));
    }
    function F(t, e, n) {
      var r = e["$_CJQ"];
      return r["error_code"] = t["error_code"], c(j(r, n), r["post"], r["protocol"]), q({
        "msg": (t = t || {})["error"],
        "code": t["error_code"],
        "error_code": t["error_code"],
        "user_error": t["user_error"]
      }, e);
    }
    function $(t, e, n) {
      var r = {
        "api_appendTo": {
          "msg": "传给appendTo接口的参数有误：只接受id选择器和DOM元素，并且需保证其存在于页面中",
          "code": "error_100"
        },
        "api_bindOn": {
          "msg": "传给bindOn接口的参数有误：只接受id选择器和DOM元素，并且需保证其存在于页面中",
          "code": "error_101"
        },
        "api_onXxx": {
          "msg": "传给各回调的参数不是函数类型：请传入函数类型参数",
          "code": "error_102"
        },
        "config_gt": {
          "msg": "配置参数gt有误：请检查初始化时传入的配置参数gt（对应申请时的ID）",
          "code": "error_103"
        },
        "url_get": {
          "msg": "/get.php请求报错：1.请保持网络畅通；2.检查初始化时传入的配置参数gt和challenge",
          "code": "error_104"
        },
        "url_ajax": {
          "msg": "/ajax.php请求报错：1.请保持网络畅通；2.请联系极验官网客服",
          "code": "error_105"
        },
        "url_refresh": {
          "msg": "/refresh.php请求报错：1.请保持网络畅通；2.刷新次数本身有限制（10次以内），超过限制请刷新整个页面再试",
          "code": "error_106"
        },
        "url_skin": {
          "msg": "皮肤加载失败：1.请保持网络畅通；2.请联系极验官网客服",
          "code": "error_107"
        },
        "url_picture": {
          "msg": "验证图片加载失败：1.请保持网络畅通；2.请联系极验官网客服",
          "code": "error_108"
        },
        "url_reset": {
          "msg": "/reset.php请求报错：1.请保持网络畅通；2.请联系极验官网客服",
          "code": "error_109"
        },
        "js_not_exist": {
          "msg": "验证的js地址不存在",
          "code": "error_110"
        },
        "js_unload": {
          "msg": "验证的js地址无法加载",
          "code": "error_111"
        },
        "config_area": {
          "msg": "配置参数area有误：只接受id选择器和DOM元素，并且需保证其存在于页面中",
          "code": "error_112"
        },
        "server_forbidden": {
          "msg": "服务端forbidden： 请联系极验官网客服",
          "code": "error_113"
        },
        "config_lack": {
          "msg": "initGeetest里面的gt或者challenge参数缺少: 请检查初始化参数",
          "code": "error_114"
        },
        "url_voice": {
          "msg": "语音文件加载失败：1.请保持网络畅通；2.请联系极验官网客服",
          "code": "error_115"
        },
        "user_callback": {
          "msg": "用户回调函数执行异常",
          "code": "error_116"
        },
        "unknown": {
          "msg": "无此类错误类型",
          "code": "error_117"
        },
        "api_bindForm": {
          "msg": "传给bindForm接口的参数有误：只接受id选择器和DOM元素，并且需保证其存在于页面中",
          "code": "error_118"
        }
      };
      r[t] || (t = "unknown");
      var i = r[t],
        o = e["$_DAa"];
      return i["user_error"] = function (t, e) {
        var n = {
            "neterror": {
              "zh-cn": "网络不给力",
              "en": "Network failure",
              "zh-tw": "網絡不給力"
            },
            "configerror": {
              "zh-cn": "配置错误",
              "en": "Configuration Error",
              "zh-tw": "配置錯誤"
            }
          },
          r = function (t) {
            var e = {
              "neterror": ["error_104", "error_105", "error_106", "error_107", "error_108", "error_109", "error_110", "error_111", "error_113", "error_115"],
              "configerror": ["error_100", "error_101", "error_102", "error_103", "error_112", "error_114", "error_116", "error_117", "error_118"]
            };
            for (var n in e) {
              var r = e[n];
              if (r["length"]) for (var i = r["length"] - 1; 0 <= i; i--) if (r[i] === t) return n;
            }
            return "";
          }(t),
          i = function (t) {
            var e = (t = (t = t || "zh-cn")["toLowerCase"]())["indexOf"]("-"),
              n = -1 < e ? t["slice"](0, e) : t;
            return "zh" === n && (-1 < t["indexOf"]("tw") || -1 < t["indexOf"]("hk") ? n += "-tw" : n += "-cn"), n;
          }(e);
        return n[r] && n[r][i] || n[r]["en"];
      }(i["code"], o["lang"]), i["error_code"] = i["code"], q(i, e, n);
    }
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
    function I(t, e, n) {
      return t["offline"] ? $_DCx["$_DDq"](t, e, n) : void 0 !== a && a["$_DEg"]() && t["post"] ? function (i, o, s) {
        return new G(function (e, n) {
          for (var t in s) s["hasOwnProperty"](t) && "number" == typeof s[t] && (s[t] = "" + s[t]);
          s["a"] && (s["a"] = decodeURIComponent(s["a"]));
          var r = O(i["protocol"], i["api_server"] || i["apiserver"], o);
          a["$_DFU"](r, s, function (t) {
            e(t);
          }, function (t) {
            i["error_code"] = 508, c(j(i, r), !0, i["protocol"]), n(t);
          });
        });
      }(t, e, n) : function (t, i, o) {
        return new G(function (n, e) {
          var r = "geetest_" + $_GQ();
          window[r] = function (t) {
            n(t), window[r] = undefined;
            try {
              delete window[r];
            } catch (e) {}
          }, o["callback"] = r, B(t, "js", t["protocol"], [t["api_server"] || t["apiserver"]], i, o)["$_DGt"](function () {}, function (t) {
            e(t);
          });
        });
      }(t, e, n);
    }
    function j(t, e) {
      var n = "",
        r = 0;
      return t["$_DHz"] && (n = t["$_DHz"]["ip"], r = t["$_DHz"]["$_BCm"]), {
        "time": $_Jl(),
        "user_ip": n,
        "captcha_id": t["gt"],
        "challenge": t["challenge"],
        "$_BCm": r,
        "exception_url": e,
        "error_code": t["error_code"] || "",
        "msg": t["msg"] || ""
      };
    }
    function B(r, t, e, n, i, o, s) {
      var a;
      "js" == t ? a = k : "css" == t ? a = A : "img" == t ? a = D : "audio" === t && (a = M);
      for (var _ = function (n) {
          return function (t, e) {
            a(n, r["timeout"], r, s)["$_DGt"](function (t) {
              e(t);
            }, function () {
              t();
            });
          };
        }, c = [], u = 0, l = n["length"]; u < l; u += 1) c["push"](_(O(e, n[u], i, o)));
      return new G(function (e, t) {
        G["step"](c)["$_DGt"](function () {
          t();
        }, function (t) {
          e(t);
        });
      });
    }
    function O(t, e, n, r) {
      e = function (t) {
        return t["replace"](/^https?:\/\/|\/$/g, "");
      }(e);
      var i = function (t) {
        return 0 !== (t = t["replace"](/\/+/g, "/"))["indexOf"]("/") && (t = "/" + t), t;
      }(n) + function (t) {
        if (!t) return "";
        var n = "?";
        return new ut(t)["$_CEj"](function (t, e) {
          (K(e) || Q(e) || $_EF(e)) && (n = n + encodeURIComponent(t) + "=" + encodeURIComponent(e) + "&");
        }), "?" === n && (n = ""), n["replace"](/&$/, "");
      }(r);
      return e && (i = t + e + i), i;
    }
    function M(r, i, o) {
      return new G(function (t, e) {
        var n = new lt("audio");
        n["$_CDI"]({
          "onerror": function () {
            c(j(o, r), o["post"], o["protocol"]), e(L);
          },
          "onloadedmetadata": function () {
            t(n);
          }
        }), n["$_CCR"]({
          "src": r
        }), v(function () {
          e(N);
        }, i || T);
      });
    }
    function D(r, i, o, s) {
      return new G(function (t, e) {
        var n = new lt("img");
        n["$_CDI"]({
          "onerror": function () {
            c(j(o, r), o["post"], o["protocol"]), e(L);
          },
          "onload": function () {
            t(n);
          }
        }), !1 !== s && n["$_CDI"]({
          "crossOrigin": "anonymous"
        })["$_CCR"]({
          "crossorigin": "anonymous"
        }), n["$_CCR"]({
          "src": r
        }), v(function () {
          e(N);
        }, i || T);
      });
    }
    function A(i, o, s) {
      return new G(function (t, e) {
        var n = new lt("link"),
          r = !1;
        v(function () {
          r = !0, t(n);
        }, 2e3), n["$_CDI"]({
          "onerror": function () {
            c(j(s, i), s["post"], s["protocol"]), n["$_DIS"](), e(L);
          },
          "onload": function () {
            r = !0, t(n);
          },
          "href": i,
          "rel": "stylesheet"
        })["$_CIm"](new lt(p)), v(function () {
          r || n["$_DIS"](), e(N);
        }, o || T);
      });
    }
    function k(s, a, _) {
      return new G(function (t, e) {
        function o() {
          i || r["readyState"] && "loaded" !== r["readyState"] && "complete" !== r["readyState"] || (i = !0, v(function () {
            t(n);
          }, 0));
        }
        var n = new lt("script"),
          r = n["$_CGE"],
          i = !1;
        /static\.geetest\.com/g["test"](s) && n["$_CDI"]({
          "crossOrigin": "anonymous"
        }), n["$_CDI"]({
          "charset": "UTF-8",
          "aysnc": !1,
          "onload": o,
          "onreadystatechange": o,
          "onerror": function () {
            _["error_code"] = 508, _["gt"] && c(j(_, s["split"]("?")[0]), _["post"], _["protocol"]), n["$_DIS"](), i = !0, e(L);
          },
          "src": s
        })["$_CIm"](new lt(p)), v(function () {
          i || (n["$_DIS"](), _["gt"] && (_["error_code"] = 408, c(j(_, s["split"]("?")[0]), _["post"], _["protocol"]))), e(N);
        }, a || T);
      });
    }
    function y(t) {
      window["clearTimeout"](t);
    }
    function v(t, e) {
      return window["setTimeout"](t, e);
    }
    function n(t, e) {
      if (t && t["filename"] && /static\.geetest\.com/g["test"](t["filename"]) || e) {
        try {
          var n = {
            "captcha_id": window && window["GeeGT"] || "",
            "challenge": window && window["GeeChallenge"] || "",
            "error_code": e ? "603" : "602",
            "exception_url": t["filename"] || "",
            "$_BCm": /Mobi/i["test"](window["navigator"]["userAgent"]) ? "3" : "0",
            "time": function a() {
              var t = new Date(),
                e = t["getFullYear"](),
                n = t["getMonth"]() + 1,
                r = t["getDate"](),
                i = t["getHours"](),
                o = t["getMinutes"](),
                s = t["getSeconds"]();
              return 1 <= n && n <= 9 && (n = "0" + n), 0 <= r && r <= 9 && (r = "0" + r), 0 <= i && i <= 9 && (i = "0" + i), 0 <= o && o <= 9 && (o = "0" + o), 0 <= s && s <= 9 && (s = "0" + s), e + "-" + n + "-" + r + " " + i + ":" + o + ":" + s;
            }(),
            "msg": t["error"] && t["error"]["message"] || t["message"] || "",
            "stack": t["error"] && t["error"]["stack"] || t["stack"] || ""
          };
          s["$_DEg"]() && s["$_DFU"]("https://monitor.geetest.com/monitor/send", n, function (t) {}, function (t) {});
        } catch (r) {}
      }
    }
    function o(t, r) {
      return new G(function (e, n) {
        a["$_DFU"](r + "monitor.geetest.com/monitor/send", t, function (t) {
          e(t);
        }, function (t) {
          n(t);
        });
      });
    }
    function i(n, r) {
      return new G(function (t, e) {
        B({
          "timeout": 3e3
        }, "js", r, ["monitor.geetest.com"], "/monitor/send", n)["$_DGt"](function () {}, function (t) {
          e(t);
        });
      });
    }
    function c(t, e, n) {
      if (void 0 !== a && a["$_DEg"]() && e) try {
        o(t, n);
      } catch (r) {} else try {
        i(t, n);
      } catch (r) {}
    }
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
    function _(t) {
      this["$_FId"] = t, this["$_FJP"] = new lt(window), this["$_GAb"]();
    }
    _["prototype"] = {
      "$_GAb": function () {
        var e = this;
        try {
          var n = window["localStorage"];
        } catch (t) {
          n = !1;
        }
        n && e["$_FJP"]["$_GBC"]("pageshow", function (t) {
          t["$_DCx"]["persisted"] && (!n["bfcache_detect"] && n["setItem"]("bfcache_detect", !0), e["$_FJP"]["$_GCd"]("pageshow"));
        });
      },
      "$_GDz": function (t) {
        var i = new window["Date"]()["getTime"]();
        function e(t) {
          var e = new Date()["getTime"](),
            n = window["Math"]["max"](0, 16 - (e - i)),
            r = window["setTimeout"](function () {
              t(e + n);
            }, n);
          return i = e + n, r;
        }
        var n = window["requestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["mozRequestAnimationFrame"] || e;
        try {
          var r = window["localStorage"];
        } catch (o) {
          r = !1;
        }
        return r && r["bfcache_detect"] && (n = e), n(t);
      },
      "$_GEo": function (t) {
        return (window["cancelAnimationFrame"] || window["webkitCancelRequestAnimationFrame"] || window["mozCancelRequestAnimationFrame"] || y)(t);
      },
      "$_GFW": function () {
        return this["$_GGM"] = !0, this;
      },
      "$_GHx": function () {
        var t = this;
        return t["$_GIv"] = t["$_GDz"](function () {
          t["$_GGM"] || (t["$_FId"](), t["$_GHx"]());
        }), t;
      },
      "$_GJF": function () {
        return this["$_GGM"] = !1, this["$_GEo"](this["$_GIv"]), this["$_GHx"]();
      }
    };
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
    oe["jscrambler"] = "Start";
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
    oe["jscrambler"] = "End";
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
        } catch (T) {}
        var _ = 0,
          c = function (t) {
            if (256 <= (_ = _ || 0) || s <= o) window["removeEventListener"] ? (_ = 0, window["removeEventListener"]("mousemove", c, !1)) : window["detachEvent"] && (_ = 0, window["detachEvent"]("onmousemove", c));else try {
              var e = t["x"] + t["y"];
              i[o++] = 255 & e, _ += 1;
            } catch (T) {}
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
      function l() {}
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
        if (16 == e) n = 4;else if (8 == e) n = 3;else if (256 == e) n = 8;else if (2 == e) n = 1;else if (32 == e) n = 5;else {
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
        if (n >= this["t"]) e["t"] = 0;else {
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
        while (0 <= --o) if (e["sqrTo"](n, r), 0 < (t & 1 << o)) e["mulTo"](r, i, n);else {
          var s = n;
          n = r, r = s;
        }
        return e["revert"](n);
      }, y["prototype"]["toString"] = function $_GQ(t) {
        if (this["s"] < 0) return "-" + this["negate"]()["toString"](t);
        var e;
        if (16 == t) e = 4;else if (8 == t) e = 3;else if (2 == t) e = 1;else if (32 == t) e = 5;else {
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
    oe["jscrambler"] = "Start controlFlowFlattening";
    var V = function () {
      var t,
        n = Object["create"] || function () {
          function n() {}
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
          "init": function () {},
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
              for (var t = this["$_JBQ"] = this["$_IAg"], e = t["words"], n = t["sigBytes"] / 4, r = 4 * (1 + (this["$_JAa"] = 6 + n)), i = this["$_JCl"] = [], o = 0; o < r; o++) if (o < n) i[o] = e[o];else {
                var s = i[o - 1];
                o % n ? 6 < n && o % n == 4 && (s = y[s >>> 24] << 24 | y[s >>> 16 & 255] << 16 | y[s >>> 8 & 255] << 8 | y[255 & s]) : (s = y[(s = s << 8 | s >>> 24) >>> 24] << 24 | y[s >>> 16 & 255] << 16 | y[s >>> 8 & 255] << 8 | y[255 & s], s ^= D[o / n | 0] << 24), i[o] = i[o - n] ^ s;
              }
              for (var a = this["$_JDn"] = [], _ = 0; _ < r; _++) {
                o = r - _;
                if (_ % 4) s = i[o];else s = i[o - 4];
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
    oe["jscrambler"] = "End";
    var G = function (t) {
      var s = function (t) {
          return "function" == typeof t;
        },
        a = function (t) {
          t();
        };
      function r() {
        this["$_JFP"] = this["$_JGf"] = null;
      }
      var _ = function (e, t) {
        if (e === t) e["$_JHG"](new TypeError());else if (t instanceof u) t["then"](function (t) {
          _(e, t);
        }, function (t) {
          e["$_JHG"](t);
        });else if (s(t) || function (t) {
          return "object" == typeof t && null !== t;
        }(t)) {
          var n;
          try {
            n = t["then"];
          } catch (i) {
            return u["$_JIo"](i), void e["$_JHG"](i);
          }
          var r = !1;
          if (s(n)) try {
            n["call"](t, function (t) {
              r || (r = !0, _(e, t));
            }, function (t) {
              r || (r = !0, e["$_JHG"](t));
            });
          } catch (i) {
            if (r) return;
            r = !0, e["$_JHG"](i);
          } else e["$_JJn"](t);
        } else e["$_JJn"](t);
      };
      function u(t) {
        var e = this;
        if (e["$_BAAw"] = e["PENDING"], e["$_BABd"] = new r(), e["$_BACD"] = new r(), s(t)) try {
          t(function (t) {
            e["$_JJn"](t);
          }, function (t) {
            e["$_JHG"](t);
          });
        } catch (n) {
          u["$_JIo"](n);
        }
      }
      var e = !(r["prototype"] = {
        "enqueue": function (t) {
          var e = this,
            n = {
              "ele": t,
              "next": null
            };
          null === e["$_JFP"] ? e["$_JFP"] = this["$_JGf"] = n : (e["$_JGf"]["next"] = n, e["$_JGf"] = e["$_JGf"]["next"]);
        },
        "dequeue": function () {
          if (null === this["$_JFP"]) throw new Error("queue is empty");
          var t = this["$_JFP"]["ele"];
          return this["$_JFP"] = this["$_JFP"]["next"], t;
        },
        "isEmpty": function () {
          return null === this["$_JFP"];
        },
        "clear": function () {
          this["$_JFP"] = this["$_BADZ"] = null;
        },
        "each": function (t) {
          this["isEmpty"]() || (t(this["dequeue"]()), this["each"](t));
        }
      });
      return u["debug"] = function () {
        e = !0;
      }, u["$_JIo"] = function (t) {
        n(t, !0), e && "undefined" != typeof console && console["error"](t);
      }, u["prototype"] = {
        "PENDING": 0,
        "RESOLVED": 1,
        "REJECTED": -1,
        "$_JJn": function (t) {
          var e = this;
          e["$_BAAw"] === e["PENDING"] && (e["$_BAAw"] = e["RESOLVED"], e["$_BAEh"] = t, e["$_BAFv"]());
        },
        "$_JHG": function (t) {
          var e = this;
          e["$_BAAw"] === e["PENDING"] && (e["$_BAAw"] = e["REJECTED"], e["$_BAGS"] = t, e["$_BAFv"]());
        },
        "$_BAFv": function () {
          var t,
            e,
            n = this,
            r = n["$_BAAw"];
          r === n["RESOLVED"] ? (t = n["$_BABd"], n["$_BACD"]["clear"](), e = n["$_BAEh"]) : r === n["REJECTED"] && (t = n["$_BACD"], n["$_BABd"]["clear"](), e = n["$_BAGS"]), t["each"](function (t) {
            a(function () {
              t(r, e);
            });
          });
        },
        "$_BAHp": function (n, r, i) {
          var o = this;
          a(function () {
            if (s(r)) {
              var t;
              try {
                t = r(i);
              } catch (e) {
                return u["$_JIo"](e), void o["$_JHG"](e);
              }
              _(o, t);
            } else n === o["RESOLVED"] ? o["$_JJn"](i) : n === o["REJECTED"] && o["$_JHG"](i);
          });
        },
        "then": function (n, r) {
          var t = this,
            i = new u();
          return t["$_BABd"]["enqueue"](function (t, e) {
            i["$_BAHp"](t, n, e);
          }), t["$_BACD"]["enqueue"](function (t, e) {
            i["$_BAHp"](t, r, e);
          }), t["$_BAAw"] === t["RESOLVED"] ? t["$_BAFv"]() : t["$_BAAw"] === t["REJECTED"] && t["$_BAFv"](), i;
        }
      }, u["all"] = function (c) {
        return new u(function (r, i) {
          var o = c["length"],
            s = 0,
            a = !1,
            _ = [];
          function n(t, e, n) {
            a || (null !== t && (a = !0, i(t)), _[n] = e, (s += 1) === o && (a = !0, r(_)));
          }
          for (var t = 0; t < o; t += 1) !function (e) {
            var t = c[e];
            t instanceof u || (t = new u(t)), t["then"](function (t) {
              n(null, t, e);
            }, function (t) {
              n(t || !0);
            });
          }(t);
        });
      }, u["race"] = function (_) {
        return new u(function (n, r) {
          var t,
            i = _["length"],
            o = !1,
            s = 0;
          function e(t, e) {
            o || (null == t ? (o = !0, n(e)) : i <= (s += 1) && (o = !0, r(t)));
          }
          for (var a = 0; a < i; a += 1) t = void 0, (t = _[a]) instanceof u || (t = new u(t)), t["then"](function (t) {
            e(null, t);
          }, function (t) {
            e(t || !0);
          });
        });
      }, u["step"] = function (n) {
        var r = n["length"],
          i = new u(),
          o = function (e, t) {
            if (r <= e) return i["$_JJn"](t);
            new u(n[e])["then"](function (t) {
              o(e + 1, t);
            }, function (t) {
              i["$_JHG"](t);
            });
          };
        return new u(n[0])["then"](function (t) {
          o(1, t);
        }, function (t) {
          i["$_JHG"](t);
        }), i;
      }, u["prototype"]["$_DGt"] = function (t, e) {
        return this["then"](t, e);
      }, u;
    }();
    function J(t) {
      this["$_BAIg"] = t, this["$_BAJw"] = {};
    }
    function Y(t, e) {
      return t["type"] || (t["type"] = "slide"), new Y[t["type"]](t, e);
    }
    function W(t) {
      this["$_HCP"] = [t];
    }
    function Z(t) {
      this["$_BBAj"] = t;
    }
    G["debug"](), J["prototype"] = {
      "$_GBC": function (t, e) {
        return this["$_BAJw"][t] ? this["$_BAJw"][t]["push"](e) : this["$_BAJw"][t] = [e], this;
      },
      "$_BBBg": function (t, e) {
        var n = this,
          r = n["$_BAJw"][t];
        if (r) {
          for (var i = 0, o = r["length"]; i < o; i += 1) try {
            r[i](e);
          } catch (a) {
            var s = {
              "error": a,
              "type": t
            };
            return z($("user_callback", n["$_BAIg"], s));
          }
          return n;
        }
      },
      "$_BBCq": function () {
        this["$_BAJw"] = {};
      }
    }, Y["type"] = "shell", Y["noConflict"] = function (window, t) {
      window["Geetest"] ? window["Geetest"]["type"] === Y["type"] ? window["Geetest"][t["type"]] = t : (Y[t["type"]] = t, Y[window["Geetest"]["type"]] = window["Geetest"], window["Geetest"] = Y) : (Y[t["type"]] = t, window["Geetest"] = Y);
    }, W["prototype"] = {
      "$_BBDu": function (t) {
        return this["$_HCP"]["push"](t), this;
      },
      "$_FDd": function () {
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
          }(this["$_HCP"]),
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
      },
      "$_BBEl": function (t, e, n) {
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
      },
      "$_BBFd": function (t, e, n) {
        if (!e || !n || 0 === t) return t;
        return t + (e[1] * n * n + e[3] * n + e[5]) % 50;
      }
    }, Z["prototype"] = {
      "$_HAy": function (t) {
        var e = this;
        return e["$_BBGd"] = e["$_BBHA"], e["$_BBHA"] = t, e["$_BBAj"](e["$_BBHA"], e["$_BBGd"]), e;
      },
      "$_HBq": function () {
        return this["$_BBHA"];
      },
      "$_BBIB": function (t) {
        for (var e = ct["$_BBJl"](t) ? t : [t], n = 0, r = e["length"]; n < r; n += 1) if (e[n] === this["$_HBq"]()) return !0;
        return !1;
      }
    };
    var rt = function () {
      function t() {
        return (65536 * (1 + Math["random"]()) | 0)["toString"](16)["substring"](1);
      }
      return function () {
        return t() + t() + t() + t();
      };
    }();
    function ct(t) {
      this["$_BCAm"] = t || [];
    }
    function ut(t) {
      this["$_BCBz"] = t;
    }
    function lt(t) {
      this["$_CGE"] = "string" == typeof t ? h["createElement"](t) : t;
    }
    function ft(t, e) {
      this["$_DCx"] = e, this["$_CGE"] = t;
    }
    ct["prototype"] = {
      "$_HBq": function (t) {
        return this["$_BCAm"][t];
      },
      "$_BCCB": function () {
        return this["$_BCAm"]["length"];
      },
      "$_BJq": function (t, e) {
        return new ct(Q(e) ? this["$_BCAm"]["slice"](t, e) : this["$_BCAm"]["slice"](t));
      },
      "$_BCDd": function (t) {
        return this["$_BCAm"]["push"](t), this;
      },
      "$_BCEX": function (t, e) {
        return this["$_BCAm"]["splice"](t, e || 1);
      },
      "$_CBa": function (t) {
        return this["$_BCAm"]["join"](t);
      },
      "$_BCF_": function (t) {
        return new ct(this["$_BCAm"]["concat"](t));
      },
      "$_CAZ": function (t) {
        var e = this["$_BCAm"];
        if (e["map"]) return new ct(e["map"](t));
        for (var n = [], r = 0, i = e["length"]; r < i; r += 1) n[r] = t(e[r], r, this);
        return new ct(n);
      },
      "$_BCGj": function (t) {
        var e = this["$_BCAm"];
        if (e["filter"]) return new ct(e["filter"](t));
        for (var n = [], r = 0, i = e["length"]; r < i; r += 1) t(e[r], r, this) && n["push"](e[r]);
        return new ct(n);
      },
      "$_BCHY": function (t) {
        var e = this["$_BCAm"];
        if (e["indexOf"]) return e["indexOf"](t);
        for (var n = 0, r = e["length"]; n < r; n += 1) if (e[n] === t) return n;
        return -1;
      },
      "$_BCIM": function (t) {
        var e = this["$_BCAm"];
        if (!e["forEach"]) for (var n = arguments[1], r = 0; r < e["length"]; r++) r in e && t["call"](n, e[r], r, this);
        return e["forEach"](t);
      }
    }, ct["$_BBJl"] = function (t) {
      return Array["isArray"] ? Array["isArray"](t) : "[object Array]" === Object["prototype"]["toString"]["call"](t);
    }, ut["prototype"] = {
      "$_CEj": function (t) {
        var e = this["$_BCBz"];
        for (var n in e) e["hasOwnProperty"](n) && t(n, e[n]);
        return this;
      },
      "$_BCJM": function () {
        var t = this["$_BCBz"];
        for (var e in t) if (t["hasOwnProperty"](e)) return !1;
        return !0;
      }
    }, lt["prototype"] = {
      "$_BDAm": {
        "down": ["mousedown", "touchstart", "pointerdown", "MSPointerDown"],
        "move": ["mousemove", "touchmove", "pointermove", "MSPointerMove"],
        "up": ["mouseup", "touchend", "pointerup", "MSPointerUp"],
        "enter": ["mouseenter"],
        "leave": ["mouseleave"],
        "cancel": ["touchcancel"],
        "click": ["click"],
        "scroll": ["scroll"],
        "resize": ["resize"],
        "blur": ["blur"],
        "focus": ["focus"],
        "unload": ["unload"],
        "input": ["input"],
        "keyup": ["keyup"],
        "ended": ["ended"],
        "keydown": ["keydown"],
        "beforeunload": ["beforeunload"],
        "focusin": ["focusin"],
        "pageshow": ["pageshow"]
      },
      "$_CHt": function () {
        var t = this["$_CGE"];
        return t["innerHTML"] = "", "input" === t["tagName"]["toLocaleLowerCase"]() && (t["value"] = ""), this;
      },
      "$_BDBq": function () {
        return this["$_sTyyle"]({
          "display": "none"
        });
      },
      "$_BDCn": function () {
        return this["$_sTyyle"]({
          "display": "block"
        });
      },
      "$_BDDZ": function (t) {
        return this["$_sTyyle"]({
          "opacity": t
        });
      },
      "$_BDEB": function (t) {
        return this["$_CGE"]["getAttribute"](t);
      },
      "$_CCR": function (t) {
        var n = this["$_CGE"];
        return new ut(t)["$_CEj"](function (t, e) {
          n["setAttribute"](t, e);
        }), this;
      },
      "$_BDFk": function (t) {
        var e = this["$_CGE"];
        return new ct(t)["$_CAZ"](function (t) {
          e["removeAttribute"](t);
        }), this;
      },
      "$_CDI": function (t) {
        var n = this["$_CGE"];
        return new ut(t)["$_CEj"](function (t, e) {
          n[t] = e;
        }), this;
      },
      "$_sTyyle": function (t) {
        var n = this["$_CGE"];
        return new ut(t)["$_CEj"](function (t, e) {
          n["style"][t] = e;
        }), this;
      },
      "setStyles": function (t) {
        var n = this["$_CGE"];
        return new ut(t)["$_CEj"](function (t, e) {
          n["style"][t] = e;
        }), this;
      },
      "$_BDGr": function () {
        return new lt(this["$_CGE"]["parentNode"]);
      },
      "$_CIm": function (t) {
        return t["$_CGE"]["appendChild"](this["$_CGE"]), this;
      },
      "$_BDHm": function (t) {
        var e = this["$_CGE"];
        return e["parentNode"]["removeChild"](e), this["$_CIm"](t), this;
      },
      "$_BDIh": function (t) {
        return t["$_CGE"]["parentNode"]["insertBefore"](this["$_CGE"], t["$_CGE"]), this;
      },
      "$_CFV": function (t) {
        return t["$_CIm"](this), this;
      },
      "$_DIS": function () {
        var t = this["$_CGE"],
          e = t["parentNode"];
        return e && e["removeChild"](t), this;
      },
      "$_BDJR": function (t) {
        var e = this["$_CGE"];
        return -1 === new ct(e["className"] ? e["className"]["split"](" ") : [])["$_BCHY"](R + t) ? this["$_BEAc"](t) : this["$_BEBB"](t), this;
      },
      "$_BEAc": function (t) {
        var e = this["$_CGE"],
          n = new ct(e["className"] ? e["className"]["split"](" ") : []);
        return t = R + t, -1 == n["$_BCHY"](t) && (n["$_BCDd"](t), e["className"] = n["$_CBa"](" ")), this;
      },
      "$_BECL": function () {
        return this["$_CGE"]["children"];
      },
      "$_BEDi": function () {
        var t = this["$_CGE"];
        return t && t["style"] && t["style"]["right"] || 0;
      },
      "$_BEBB": function (t) {
        var e = this["$_CGE"],
          n = new ct(e["className"]["split"](" "));
        t = R + t;
        var r = n["$_BCHY"](t);
        return -1 < r && (n["$_BCEX"](r), e["className"] = n["$_CBa"](" ")), this;
      },
      "$_BEEC": function (t, e) {
        return this["$_BEBB"](e)["$_BEAc"](t), this;
      },
      "$_BEFr": function (t, n) {
        function o(t) {
          n(new ft(r, t));
        }
        var r = this,
          i = r["$_CGE"],
          e = r["$_BDAm"][t];
        return new ct(e)["$_CAZ"](function (t) {
          if (h["addEventListener"]) i["addEventListener"](t, o);else if (h["attachEvent"]) i["attachEvent"]("on" + t, o);else {
            var e = i["on" + t];
            i["on" + t] = function (t) {
              n(new ft(r, t)), "function" == typeof e && e["call"](this, t);
            };
          }
        }), {
          "$_BBCq": function () {
            new ct(e)["$_CAZ"](function (t) {
              h["removeEventListener"] ? i["removeEventListener"](t, o) : h["detachEvent"] ? i["detachEvent"]("on" + t, o) : i["on" + t] = null;
            });
          }
        };
      },
      "$_GBC": function (t, e) {
        var n = this,
          r = n["$_BEFr"](t, e);
        return n["$_BEGv"] = n["$_BEGv"] || {}, n["$_BEGv"][t] ? n["$_BEGv"][t]["push"](r) : n["$_BEGv"][t] = [r], n;
      },
      "$_GCd": function (t) {
        var e = this;
        if (e["$_BEGv"]) if (t) {
          if (e["$_BEGv"][t] && 0 < e["$_BEGv"][t]["length"]) for (var n = e["$_BEGv"][t]["length"] - 1; 0 <= n; n--) e["$_BEGv"][t][n]["$_BBCq"]();
        } else for (var r in e["$_BEGv"]) if (e["$_BEGv"][r] && 0 < e["$_BEGv"][r]["length"]) for (n = e["$_BEGv"][r]["length"] - 1; 0 <= n; n--) e["$_BEGv"][r][n]["$_BBCq"]();
        return e;
      },
      "$_BEHe": function (t) {
        var e = this["$_CGE"]["getBoundingClientRect"]();
        return 1 !== (t = t || 1) && (e["x"] = e["x"] * t, e["y"] = e["y"] * t, e["top"] = e["top"] * t, e["left"] = e["left"] * t, e["right"] = e["right"] * t, e["bottom"] = e["bottom"] * t, e["width"] = e["width"] * t, e["height"] = e["height"] * t), e;
      },
      "$_BEIZ": function (t) {
        var e = this["$_BEHe"](),
          n = h["body"],
          r = h["documentElement"],
          i = window["pageYOffset"] || r["scrollTop"] || n["scrollTop"],
          o = window["pageXOffset"] || r["scrollLeft"] || n["scrollLeft"],
          s = r["clientTop"] || n["clientTop"] || 0,
          a = r["clientLeft"] || n["clientLeft"] || 0,
          _ = e["top"] + i - s,
          c = e["left"] + o - a;
        return {
          "top": Math["round"](_),
          "left": Math["round"](c),
          "width": e["right"] - e["left"],
          "height": e["bottom"] - e["top"]
        };
      },
      "$_BEJG": function (t) {
        var e = this["$_CGE"];
        return this["$_CHt"](), e["appendChild"](h["createTextNode"](t)), this;
      },
      "$_BFAk": function (t) {
        return this["$_CGE"]["innerHTML"] = t, this;
      },
      "_style": function (t) {
        var e = this["$_CGE"];
        return h["getElementsByTagName"]("head")[0]["appendChild"](e), e["styleSheet"] ? e["styleSheet"]["cssText"] = t : e["appendChild"](h["createTextNode"](t)), this;
      },
      "$_BFBG": function (t) {
        var e,
          n,
          r = this["$_CGE"],
          i = !((n = h["createElement"]("canvas"))["getContext"] && n["getContext"]("2d"));
        if (t) {
          if (i) {
            var o = h["createElement"]("div");
            o["innerHTML"] = r["outerHTML"], e = new lt(o["childNodes"][0]);
          } else e = new lt(this["$_CGE"]["cloneNode"](!0));
          r["id"] = "origin_" + r["id"], e["$_BDFk"](["href"]);
        } else (e = new lt(this["$_CGE"]["cloneNode"](!1)))["$_BEAc"]("sandbox");
        return e;
      },
      "$_BFCI": function () {
        return this["$_CGE"]["click"](), this;
      },
      "$_BFDH": function () {
        return this["$_CGE"]["play"](), this;
      },
      "$_BFEN": function () {
        return this["$_CGE"]["currentTime"] = 0, this["$_CGE"]["play"](), this;
      },
      "$_GFW": function () {
        return this["$_CGE"]["currentTime"] = 0, this["$_CGE"]["pause"](), this;
      },
      "$_BFFl": function () {
        return this["$_CGE"]["value"];
      },
      "$_BFGn": function () {
        return this["$_CGE"]["focus"](), this;
      },
      "$_BFHo": function () {
        var t = this["$_BEHe"]();
        return t["right"] - t["left"];
      },
      "$_BFIE": function (t) {
        var e = this["$_CGE"];
        return window["getComputedStyle"] ? window["getComputedStyle"](e)[t] : e["currentStyle"][t];
      },
      "$_BFJY": function () {
        var t, e, n;
        try {
          var r = this["$_CGE"],
            i = r;
          while (i["parentNode"] != h["body"] && r["offsetTop"] - i["parentNode"]["offsetTop"] < 160) i = i["parentNode"], "hidden" == (e = "overflow", n = void 0, (t = i)["currentStyle"] ? n = t["currentStyle"][e] : window["getComputedStyle"] && (n = window["getComputedStyle"](t, null)["getPropertyValue"](e)), n) && (i["style"]["overflow"] = "visible");
        } catch (o) {}
        return this;
      },
      "$_BGAq": function () {
        var t = this["$_CGE"],
          e = t["offsetLeft"],
          n = t["offsetParent"];
        while (null !== n) e += n["offsetLeft"], n = n["offsetParent"];
        return e;
      },
      "$_BGBS": function () {
        var t = this["$_CGE"],
          e = t["offsetTop"],
          n = t["offsetParent"];
        while (null !== n) e += n["offsetTop"], n = n["offsetParent"];
        return e;
      }
    }, lt["$"] = function (t) {
      var e, n;
      "string" == typeof t ? "#" === t[0] ? e = h["getElementById"](t["slice"](1)) : "querySelector" in h ? e = h["querySelector"](t) : $_Fc(window["jQuery"]) ? e = window["jQuery"](t)[0] : "#" === t["slice"](0, 1) && (e = h["getElementById"](t["slice"](1))) : e = t["length"] ? t[0] : t;
      try {
        n = Node["ELEMENT_NODE"];
      } catch (r) {
        n = 1;
      }
      try {
        if (e["nodeType"] === n) return new lt(e);
      } catch (r) {
        return !1;
      }
    }, ft["prototype"] = {
      "$_BGCu": function () {
        var t = this["$_DCx"];
        if (Q(t["clientX"])) return t["clientX"];
        var e = t["changedTouches"] && t["changedTouches"][0];
        return e ? e["clientX"] : -1;
      },
      "$_BGDy": function () {
        var t = this["$_DCx"];
        if (Q(t["clientY"])) return t["clientY"];
        var e = t["changedTouches"] && t["changedTouches"][0];
        return e ? e["clientY"] : -1;
      },
      "$_BGEE": function () {
        var t = this["$_DCx"];
        return t["cancelable"] && $_Fc(t["preventDefault"]) ? t["preventDefault"]() : t["returnValue"] = !1, this;
      },
      "$_BGFd": function () {
        var t = this["$_DCx"];
        return $_Fc(t["stopPropagation"]) && t["stopPropagation"](), this;
      }
    };
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
          if (l = u = "", "number" == typeof n) for (r = 0; r < n; r += 1) l += " ";else "string" == typeof n && (l = n);
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
                if (h && "object" == typeof h) for (o = h["length"], n = 0; n < o; n += 1) "string" == typeof h[n] && (i = c(r = h[n], _)) && s["push"](f(r) + (u ? ": " : ":") + i);else for (r in _) Object["prototype"]["hasOwnProperty"]["call"](_, r) && (i = c(r, _)) && s["push"](f(r) + (u ? ": " : ":") + i);
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
    function bt() {}
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
    xt = h["createElement"]("canvas"), Et = xt["getContext"] && xt["getContext"]("2d"), Ct = /msie/i["test"](ht["userAgent"]), w = !Et && Ct, x = /msie 6\.0/i["test"](ht["userAgent"]), /UCBrowser/i["test"](ht["userAgent"]), E = "BackCompat" === h["compatMode"], L = "Network Error";
    var xt,
      Et,
      Ct,
      St,
      Tt,
      kt,
      At,
      Dt,
      Mt,
      Ot,
      Bt = "init",
      jt = "load",
      It = "ready",
      Rt = "success",
      Lt = "fail",
      Nt = "forbidden",
      Pt = "abuse",
      Ht = "error",
      $t = "move",
      Ft = "refresh",
      qt = "status_change",
      zt = "close",
      Xt = "change",
      Ut = function () {
        for (var t, e = "6_11_7_10_4_12_3_1_0_5_2_9_8"["split"]("_"), n = [], r = 0; r < 52; r++) t = 2 * parseInt(e[parseInt(r % 26 / 2)]) + r % 2, parseInt(r / 2) % 2 || (t += r % 2 ? -1 : 1), t += r < 26 ? 26 : 0, n["push"](t);
        return n;
      }(),
      Jt = (St = h["createElement"]("canvas"), Tt = St["getContext"] && St["getContext"]("2d"), kt = /msie (?:9|10)\.0/i["test"](ht["userAgent"]), At = /Trident\/[\d](?=[^\?]+).*rv:11.0/i["test"](ht["userAgent"]), Dt = ht["userAgent"]["indexOf"]("Android"), Mt = -1 !== Dt && parseFloat(ht["userAgent"]["slice"](Dt + 8)) < 4.4, Tt && !kt && !At && !Mt),
      Yt = {
        ".widget": {
          ".window": {
            "a.link.absolute": Jt ? {
              ".slicebg.absolute": {
                "canvas.bg.absolute": {},
                ".slice": {}
              },
              "canvas.fullbg.fade.absolute": {}
            } : {
              ".slicebg.absolute": {
                ".bg.absolute": {},
                ".slice": {}
              },
              ".fullbg.fade.absolute": {}
            },
            ".flashlight.absolute": {},
            ".loading.absolute": {
              ".loading_icon": {},
              ".loading_tip": {}
            },
            ".result.enter": {
              ".result_icon": {},
              ".result_title": {},
              ".result_content": {}
            }
          },
          ".panel": {
            "a.close": {
              ".close_tip": {}
            },
            "a.refresh": {
              ".refresh_tip": {}
            },
            "a.feedback": {
              ".feedback_tip": {}
            },
            "a.logo": {}
          }
        },
        ".slider": {
          ".slider_tip": {},
          ".slider_button": {},
          ".slider_status": {}
        }
      },
      Wt = {
        ".wrap": {
          ".widget": {
            ".window": {
              "a.link": {
                ".canvas_img.absolute": {
                  ".slicebg.absolute": {
                    "canvas.canvas_bg.absolute": {},
                    "canvas.canvas_slice.absolute": {}
                  },
                  "canvas.canvas_fullbg.fade.absolute": {}
                },
                ".div_img.absolute": {
                  ".slicebg.absolute": {
                    ".div_bg.absolute": {},
                    ".div_slice.absolute": {}
                  },
                  ".div_fullbg.fade.absolute": {}
                }
              },
              ".refresh": {
                ".refresh_tip": {}
              },
              ".loading.absolute.fade": {
                ".loading_icon": {},
                ".loading_tip": {}
              },
              ".result.absolute.fade": {
                ".result_box": {
                  ".result_icon": {},
                  ".result_title": {},
                  ".result_content": {}
                }
              }
            }
          },
          ".slider": {
            ".slider_track": {
              ".slider_tip.fade": {}
            },
            ".slider_button": {}
          }
        },
        ".panel": {
          ".small": {
            "a.close": {
              ".close_tip": {}
            },
            "a.refresh_1": {
              ".refresh_icon": {},
              ".refresh_tip": {}
            },
            "a.feedback": {
              ".feedback_icon": {},
              ".feedback_tip": {}
            },
            "a.voice": {
              ".voice_tip": {}
            }
          },
          "a.copyright": {
            ".logo": {},
            ".copyright_tip": {}
          }
        }
      },
      Zt = {
        ".wrap": {
          ".header": {
            ".tips": {
              ".tip_content": {}
            }
          },
          ".widget": {
            ".window": {
              "a.link": {
                ".canvas_img.absolute": {
                  ".slicebg.absolute": {
                    "canvas.canvas_bg.absolute": {},
                    "canvas.canvas_slice.absolute": {}
                  },
                  "canvas.canvas_fullbg.fade.absolute": {}
                },
                ".div_img.absolute": {
                  ".slicebg.absolute": {
                    ".div_bg.absolute": {},
                    ".div_slice.absolute": {}
                  },
                  ".div_fullbg.fade.absolute": {}
                }
              },
              ".refresh": {
                ".refresh_tip": {}
              },
              ".loading.absolute.fade": {
                ".loading_icon": {},
                ".loading_tip": {}
              },
              ".result.absolute.fade": {
                ".result_box": {
                  ".result_icon": {},
                  ".result_title": {},
                  ".result_content": {}
                }
              }
            }
          },
          ".slider": {
            ".slider_track": {
              ".slider_tip.fade": {},
              ".progress_left": {},
              ".progress_right": {}
            },
            ".slider_button": {}
          },
          "a.close": {
            ".close_tip": {}
          },
          "a.refresh_1": {
            ".refresh_icon": {},
            ".refresh_tip": {}
          },
          "a.feedback": {
            ".feedback_icon": {},
            ".feedback_tip": {}
          },
          "a.voice": {
            ".voice_tip": {}
          },
          "a.copyright": {
            ".logo": {},
            ".copyright_tip": {}
          }
        }
      };
    function ee(t) {
      var e = this,
        n = t["$_CGE"];
      n["height"] = n["width"] = 0, e["$_BGIO"] = n["getContext"]("2d"), e["$_BGJw"] = e["$_BHA_"] = e["$_BHBS"] = e["$_BHCv"] = 0, e["$_BHDe"] = n;
    }
    function ne(t, e) {
      var n = this,
        r = new re(t);
      r["remUnit"] && !isNaN(r["remUnit"]) && (gt = "rem", vt = r["remUnit"]), r["https"] && (r["protocol"] = "https://"), t["debugConfig"] && r["$_BHEO"](t["debugConfig"]), n["$_CJQ"] = r, n["$_DAa"] = t, n["$_BHFY"] = new J(n), n["$_BBHA"] = new Z(function (t, e) {
        n["$_BHGD"](t, e);
      }), n["$_BBHA"]["$_HAy"](Bt), n["$_BHHO"] = $_BCm(), n["$_BHIq"] = b ? 3 : 0, n["$_BHJZ"] = b ? "web_mobile" : "web", n["$_CJQ"]["$_DHz"] = {
        "$_BCm": n["$_BHIq"]
      };
    }
    function re(t) {
      this["$_GIv"] = $_GQ(), this["$_BHEO"]({
        "protocol": g
      })["$_BHEO"](t);
    }
    function ie(t) {
      var e = this,
        n = t["$_CJQ"];
      e["$_BBHA"] = t["$_BBHA"], e["$_BAIg"] = t, e["$_CJQ"] = n, e["$_DAa"] = t["$_DAa"], e["$_BHFY"] = t["$_BHFY"], e["$_BIAg"] = $_BIT(e["$_CJQ"]["i18n_labels"]), e["$"] = $_HL();
      var r = n["product"],
        i = ".holder." + n["theme"];
      w && (i += ".ie8"), "popup" === r ? e["$_BIBo"] = $_BHp(i + ".popup", $_BGl(Yt), e["$"]) : "float" === r ? e["$_BIBo"] = $_BHp(i + ".float", Yt, e["$"]) : "embed" === r && (e["$_BIBo"] = $_BHp(i + ".embed", Yt, e["$"])), e["$_GAb"]()["$_GBC"]();
    }
    function oe(t, e) {
      this["$_BICi"] = $_GQ(), this["$_BIDy"] = !0, P["$_HAy"](this["$_BICi"], new ne(t, e));
    }
    function se(t, e, n, r, i) {
      var o = this;
      o["$_BIE_"] = r, o["$_BIFE"] = i, o["$_BJq"] = t, e = e["$_CGE"], x ? t["$_sTyyle"]({
        "filter": "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\"" + e["src"] + "\")"
      }) : t["$_sTyyle"]({
        "backgroundImage": "url(\"" + e["src"] + "\")"
      }), t["$_sTyyle"]({
        "left": $_BDZ(o["$_BIE_"] / 260),
        "top": $_BDZ(o["$_BIFE"]),
        "width": $_BDZ(e["width"]),
        "height": $_BDZ(e["height"])
      });
    }
    function ae(t) {
      var e = this,
        n = t["$_CJQ"];
      n["mobile"] && "float" === n["product"] && (n["product"] = "embed"), e["$_BBHA"] = t["$_BBHA"], e["$_BAIg"] = t, e["$_CJQ"] = n, e["$_DAa"] = t["$_DAa"], e["$_BHFY"] = t["$_BHFY"], e["$_BIAg"] = $_BIT(e["$_CJQ"]["i18n_labels"]), e["$"] = $_HL();
      var r = n["product"],
        i = ".holder.mobile." + n["theme"];
      "popup" === r || "custom" === n["product"] ? (n["template"] && "common" === n["template"] ? e["$_BIBo"] = $_BHp(i + ".popup", $_BGl(Zt), e["$"]) : e["$_BIBo"] = $_BHp(i + ".popup", $_BGl(Wt), e["$"]), n["width"] && e["$"](".popup_box")["$_sTyyle"]({
        "width": n["width"]
      }), n["bg_color"] && e["$"](".popup_ghost")["$_sTyyle"]({
        "backgroundColor": n["bg_color"]
      }), e["$_BIGK"]()) : n["template"] && "common" === n["template"] ? e["$_BIBo"] = $_BHp(i + ".embed", Zt, e["$"]) : e["$_BIBo"] = $_BHp(i + ".embed", Wt, e["$"]), "embed" === n["product"] && e["$_DAa"]["isPC"] && e["$_DAa"]["$"] && (e["$_DAa"]["$"](".panel_ghost")["setStyles"]({
        "backgroundColor": n["bg_color"]
      }), e["$_BIGK"]("embed")), n["is_next"] && e["$"](".result")["$_BEBB"]("absolute")["$_BEBB"]("fade"), e["$_BIHi"](), e["$_GAb"]()["$_GBC"]();
    }
    function $_DCx() {}
    function ce(t, e) {
      var n = this;
      n["$_BIIm"] = t(".result_icon"), n["$_BIJE"] = t(".result_title"), n["$_BJAw"] = t(".result_content"), n["$"] = t, n["$_BIAg"] = e;
    }
    function ue() {}
    ee["prototype"] = {
      "$_BJBV": function (t, e) {
        var n = this["$_BHDe"];
        return n["height"] !== e && (n["height"] = e), n["width"] !== t && (n["width"] = t), this;
      },
      "$_BJCp": function (t, e, n) {
        var r = this;
        return r["$_CHt"](), r["$_BJDi"] = t["$_CGE"], r["$_BJET"] = e, r["$_BJFn"] = n, r["$_BHBS"] = t["width"], r["$_BJGc"] = t["height"], r["$_BJHU"](e), r;
      },
      "$_CHt": function () {
        var t = this["$_BGIO"],
          e = this["$_BHDe"];
        return t["clearRect"](0, 0, e["width"], e["height"]), this;
      },
      "$_BJHU": function (t) {
        var e = this;
        return e["$_BGIO"]["drawImage"](e["$_BJDi"], t + e["$_BJET"], e["$_BJFn"]), e;
      },
      "$_BJIG": function (t) {
        return this["$_CHt"]()["$_BJHU"](t);
      }
    }, ne["prototype"] = {
      "$_BHGD": function (t, e) {
        var n = this,
          r = n["$_BJJs"],
          i = n["$_BBHA"],
          o = n["$_BHFY"],
          s = n["$_CJQ"];
        if (t !== e) if (null !== e && r && r["$_CAAG"](t, e), t === Bt) n["$_CABN"] = n["$_GAb"]()["$_DGt"](function (t) {
          return t["status"] === Ht ? z(F(t, n)) : (s["$_BHEO"]($_BBj(t)), s["debugConfig"] && s["$_BHEO"](s["debugConfig"]), s["gct_path"] && n["$_CACQ"]()["$_DGt"](function () {}), s["mobile"] ? n["$_BJJs"] = new ae(n) : n["$_BJJs"] = new ie(n), n["$_CADD"](), o["$_BBBg"](Bt), i["$_HAy"](jt), n["$_BJJs"]["$_CAEN"]);
        }, function () {
          return z($("url_get", n));
        });else if (t === jt) {
          var a = $_Im();
          n["$_DDq"]()["$_DGt"](function (t) {
            r["$_CAFn"](t), n["$_CAGC"] = $_Im() - a, i["$_HAy"](It);
          }, function () {
            return z($("url_picture", n));
          });
        } else t === It ? r["$_CAHE"]() : t === $t ? r["$_CAIT"]() : "lock" === t ? r["$_CAJl"](e) : t === Ft ? (-1 < new ct([It, Nt, Pt, Rt])["$_BCHY"](e) && (o["$_BBBg"](Ft), r["$_CBAP"]()), y(n["$_CBBh"]), n["$_CADD"]()) : t === Rt ? (y(n["$_CBBh"]), r["$_CBCG"](n["$_CBDA"], n["$_CBE_"])["$_DGt"](function () {
          o["$_BBBg"](Rt, n["$_CBE_"]);
        })) : t === Lt ? (o["$_BBBg"](Lt), r["$_CBFF"]()["$_DGt"](function () {
          i["$_HAy"](It);
        })) : t === Pt ? (o["$_BBBg"](Pt), r["$_CBGH"]()["$_DGt"](function () {
          i["$_HAy"](Ft);
        })) : t === Nt ? (o["$_BBBg"](Nt), r["$_CBHF"]()["$_DGt"](function () {
          z($("server_forbidden", n));
        })) : t === Ht ? (o["$_BBBg"](Ht, n["$_CBIQ"]), r && r["$_CBJq"]()) : t === Xt && o["$_BBBg"](Xt, "voice");
      },
      "$_GAb": function () {
        var t = this["$_CJQ"];
        return I(t, "/get.php", this["$_DAa"]);
      },
      "$_CACQ": function () {
        var t = this["$_CJQ"];
        return B(t, "js", t["protocol"], t["static_servers"], t["gct_path"]);
      },
      "$_CADD": function () {
        var t = this,
          e = t["$_CJQ"],
          n = t["$_BBHA"];
        return e["autoReset"] && (t["$_CBBh"] = v(function () {
          n["$_HAy"](Ft);
        }, 54e4)), t;
      },
      "$_DBw": function (t) {
        return this["$_CBIQ"] = t, this["$_BBHA"]["$_HAy"](Ht), this;
      },
      "$_CIm": function (t) {
        var e = this;
        return e["$_CABN"]["$_DGt"](function () {
          e["$_BJJs"]["$_CIm"](t);
        }), e;
      },
      "$_CCAA": function (t) {
        var e = this;
        return e["$_CABN"]["$_DGt"](function () {
          e["$_BJJs"]["$_CCAA"](t);
        }), e;
      },
      "$_DDq": function () {
        var r = this["$_CJQ"],
          i = r["protocol"],
          o = r["static_servers"] || r["staticservers"];
        return this["$_BHHO"]["$_DGt"](function (t) {
          var n = t ? ".webp" : ".jpg";
          return G["all"]([new G(function (e) {
            B(r, "img", i, o, r["fullbg"]["replace"](".jpg", n))["$_DGt"](function (t) {
              e(t);
            }, function () {
              e(!1);
            });
          }), B(r, "img", i, o, r["bg"]["replace"](".jpg", n)), B(r, "img", i, o, r["slice"]["replace"](".jpg", n))]);
        });
      },
      "$_CCBb": function (t, e, n) {
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
        } catch (v) {}
        i["offline"] && (o["x"] = t), o["rp"] = X(i["gt"] + i["challenge"]["slice"](0, 32) + o["passtime"]);
        var u = r["$_CCDh"](),
          l = V["encrypt"](yt["stringify"](o), r["$_CCEp"]()),
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
      },
      "$_CCFy": function (t) {
        var e = this["$_CJQ"],
          n = Ht,
          r = t && t["result"],
          i = t && t["message"];
        if (t) {
          if ("success" == r || "success" == i) {
            var o = t["validate"]["split"]("|")[0];
            this["$_CBE_"] = t["score"], this["$_CBDA"] = {
              "geetest_challenge": e["challenge"],
              "geetest_validate": o,
              "geetest_seccode": o + "|jordan"
            }, n = Rt;
          } else "fail" == r || "fail" == i ? n = Lt : "forbidden" == r || "forbidden" == i ? n = Nt : "abuse" != r && "abuse" != i || (n = Pt);
        } else n = Ht;
        this["$_BBHA"]["$_HAy"](n);
      },
      "$_CCGL": function () {
        return this["$_CBDA"];
      },
      "$_BDCn": function () {
        return this["$_BJJs"] && this["$_BJJs"]["$_BDCn"](), this;
      },
      "$_BDBq": function () {
        return this["$_BJJs"] && this["$_BJJs"]["$_BDBq"](), this;
      },
      "$_GBC": function (e, n) {
        var r = this,
          i = r["$_CJQ"];
        return r["$_BHFY"]["$_GBC"](e, function (t) {
          n(t), -1 < new ct([Rt, Lt, Nt, Pt])["$_BCHY"](e) ? (r["$_BHFY"]["$_BBBg"](qt), $_Fc(window["gt_custom_ajax"]) && (i["mobile"] ? window["gt_custom_ajax"](e === Rt ? 1 : 0, !1, e) : window["gt_custom_ajax"](e === Rt ? 1 : 0, r["$"], e))) : e === Ft ? $_Fc(window["gt_custom_refresh"]) && window["gt_custom_refresh"](r["$"]) : e === Ht ? $_Fc(window["gt_custom_error"]) && window["gt_custom_error"](r, r["$"]) : e === Bt && $_Fc(window["onGeetestLoaded"]) && window["onGeetestLoaded"](r);
        }), r;
      },
      "$_CBAP": function () {
        return this["$_BBHA"]["$_HAy"](Ft), this;
      },
      "$_CCHL": function (t) {
        return this["$_CJQ"]["mobile"] && this["$_BJJs"]["$_CCHL"](t), this;
      },
      "$_BBCq": function () {
        var t = this;
        t["$_CBBh"] && y(t["$_CBBh"]), t["$_BJJs"] && t["$_BJJs"]["$_BBCq"](), t["$_BHFY"]["$_BBCq"]();
      },
      "$_CCEp": (Ot = rt(), function (t) {
        return !0 === t && (Ot = rt()), Ot;
      }),
      "$_CCDh": function (t) {
        var e = new U()["encrypt"](this["$_CCEp"](t));
        while (!e || 256 !== e["length"]) e = new U()["encrypt"](this["$_CCEp"](!0));
        return e;
      },
      "$_CCC_": function () {
        return {
          "v": "7.9.3",
          "$_BIT": wt["touchEvent"],
          "me": wt["mouseEvent"],
          "tm": new bt()["$_BGGG"](),
          "td": this["td"] || -1
        };
      }
    }, re["prototype"] = {
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
    }, ie["prototype"] = {
      "$_GAb": function () {
        var t = this["$"],
          e = this["$_BIAg"];
        return this["$_CCID"](), t(".refresh_tip")["$_BEJG"](e["refresh"]), this;
      },
      "$_CCJM": function () {
        var t = this;
        return t["$_CDAN"] && t["$_CDAN"]["$_sTyyle"]({
          "top": t["$_BIBo"]["$_BGBS"]() - 10 + "px",
          "left": t["$_BIBo"]["$_BGAq"]() + "px"
        }), t;
      },
      "$_CDBB": function () {
        var t = this,
          e = t["$"],
          n = t["$_BIBo"]["$_BFBG"](!1);
        return e(".widget")["$_BDHm"](n), n["$_CIm"](new lt(d)), (t["$_CDAN"] = n)["$_GBC"]("enter", function () {
          t["$_CDCK"](!0);
        })["$_GBC"]("leave", function () {
          t["$_CDCK"](!1);
        }), t["$_CCJM"](), t;
      },
      "$_CDDW": function () {
        var t = this,
          e = t["$_CJQ"],
          n = t["$"];
        t["$_CDE_"] || t["$_CDFB"] ? (t["$_CCJM"](), n(".widget")["$_BDCn"](), v(function () {
          (t["$_CDE_"] || t["$_CDFB"]) && n(".widget")["$_BEAc"]("show");
        }, e["show_delay"])) : v(function () {
          t["$_CDE_"] || t["$_CDFB"] || (n(".widget")["$_BEBB"]("show"), v(function () {
            n(".widget")["$_BDBq"]();
          }, 500));
        }, e["hide_delay"]);
      },
      "$_CDCK": function (t) {
        this["$_CDE_"] !== t && (this["$_CDE_"] = t, this["$_CDDW"]());
      },
      "$_CDGv": function (t) {
        this["$_CDFB"] !== t && (this["$_CDFB"] = t, this["$_CDDW"]());
      },
      "$_CDHO": function (t) {
        var e = this;
        v(function () {
          e["$_CDGv"](!1);
        }, t);
      },
      "$_CDIJ": function (t) {
        var e = this;
        return e["$_CDJR"](t, function () {
          e["$_CDGv"](!0);
        });
      },
      "$_CEAc": function (e, t, n) {
        var r = this,
          i = r["$"],
          o = r["$_BIAg"],
          s = i(".result");
        return e == Rt ? r["$_CEBh"]["$_CECM"](e, {
          "sec": (r["$_CEDS"] / 1e3)["toFixed"](1),
          "score": 100 - r["$_CBE_"]
        }) : r["$_CEBh"]["$_CECM"](e), i(".result")["$_BEEC"](e, r["$_CEEJ"] || null), r["$_CEEJ"] = e, new G(function (t) {
          s["$_BEAc"]("showTip"), 35 < o[e]["length"] && i(".result")["$_BEAc"]("multi_line"), v(function () {
            t();
          }, n || 1500);
        })["$_DGt"](function () {
          if (!t) return new G(function (t) {
            s["$_BEBB"]("showTip"), 35 < o[e]["length"] && i(".result")["$_BEBB"]("multi_line"), v(function () {
              t();
            }, 200);
          });
        });
      },
      "$_CEFM": function () {
        var e = (0, this["$"])(".slice")["$_BEAc"]("flicker");
        return new G(function (t) {
          e["$_BDDZ"](0), v(t, 100);
        })["$_DGt"](function () {
          return new G(function (t) {
            e["$_BDDZ"](1), v(t, 100);
          });
        })["$_DGt"](function () {
          return new G(function (t) {
            e["$_BDDZ"](0), v(t, 100);
          });
        })["$_DGt"](function () {
          return new G(function (t) {
            e["$_BDDZ"](1), v(t, 200);
          });
        })["$_DGt"](function () {
          e["$_BEBB"]("flicker");
        });
      },
      "$_CEGU": function () {
        var e = this["$"];
        return e(".slice")["$_BEAc"]("animate"), e(".slider_button")["$_BEAc"]("animate"), this["$_CEHr"](this["$_CEIy"]), new G(function (t) {
          v(function () {
            e(".slice")["$_BEBB"]("animate"), e(".slider_button")["$_BEBB"]("animate"), t();
          }, 400);
        });
      },
      "$_CEJd": function () {
        var t = this["$"],
          e = t(".flashlight")["$_BEAc"]("flash")["$_sTyyle"]({
            "left": "-260px"
          });
        return new G(function (t) {
          v(function () {
            e["$_BEBB"]("flash")["$_sTyyle"]({
              "left": "260px"
            }), t();
          }, 1500);
        });
      },
      "$_CBCG": function (t, e) {
        var n = this;
        n["$_CBE_"] = e;
        var r = n["$"],
          i = (n["$_CJQ"], n["$_DAa"]);
        return r(".fullbg")["$_BDDZ"](1)["$_BDCn"](), n["$_CEJd"](), i && i["hideSuccess"] ? new G(function (t) {
          t();
        }) : n["$_CEAc"](Rt, null, 350)["$_DGt"](function () {
          return new G(function (t) {
            t();
          });
        });
      },
      "$_CBFF": function () {
        var t = this;
        return t["$_CEAc"](Lt), "float" === t["$_CJQ"]["product"] && t["$_CDHO"](1e3), t["$_CEFM"]()["$_DGt"](function () {
          return t["$_CEGU"]();
        });
      },
      "$_CBJq": function () {
        "float" === this["$_CJQ"]["product"] && this["$_CDHO"](800), this["$_CFAm"]();
      },
      "$_CBGH": function () {
        var t = this;
        return t["$_CFBr"]()["$_DGt"](function () {
          "float" === t["$_CJQ"]["product"] && t["$_CDHO"](1e3);
        });
      },
      "$_CBHF": function () {
        var t = this;
        return t["$_CFCZ"]()["$_DGt"](function () {
          "float" === t["$_CJQ"]["product"] && t["$_CDHO"](1e3);
        });
      },
      "$_CAFn": function (t) {
        var e = this,
          n = e["$"],
          r = e["$_CJQ"];
        E && n(".widget")["$_sTyyle"]({
          "width": "290px"
        }), n(".window")["$_sTyyle"]({
          "height": r["height"] + 2 + "px"
        }), n(".loading")["$_sTyyle"]({
          "paddingTop": 8 * (r["height"] - e["$_CFDO"]) / 44 + "%"
        });
        var i = t[0],
          o = t[1],
          s = t[2];
        if (Jt) try {
          i && $_BEN(i, n(".fullbg"), r["height"]), $_BEN(o, n(".bg"), r["height"]);
        } catch (a) {
          i && $_BFZ(i, n(".fullbg"), r["height"]), $_BFZ(o, n(".bg"), r["height"]);
        } else i && $_BFZ(i, n(".fullbg"), r["height"]), $_BFZ(o, n(".bg"), r["height"]);
        return e["$_BJq"] = new se(n(".slice"), s, r["height"], r["xpos"], r["ypos"]), e;
      },
      "$_CAHE": function () {
        var t = this["$"];
        this["$_CEHr"](0), t(".loading")["$_BDBq"]();
      },
      "$_CCHL": function () {
        return this["$_CFEG"] = 1, this;
      }
    }, oe["type"] = "slide3", oe["prototype"] = {
      "appendTo": function (t) {
        return this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_CIm"](t), this;
      },
      "bindOn": function (t) {
        return this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_CCAA"](t), this;
      },
      "refresh": function () {
        return this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_CBAP"](), this;
      },
      "show": function () {
        return this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_BDCn"](), this;
      },
      "hide": function () {
        return this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_BDBq"](), this;
      },
      "getValidate": function () {
        return !!this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_CCGL"]();
      },
      "onChangeCaptcha": function (t) {
        this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_GBC"](Xt, t);
      },
      "onStatusChange": function (t) {
        this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_GBC"](qt, t);
      },
      "onReady": function (t) {
        return this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_GBC"](Bt, t), this;
      },
      "onRefresh": function (t) {
        return this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_GBC"](Ft, t), this;
      },
      "onSuccess": function (t) {
        return this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_GBC"](Rt, t), this;
      },
      "onFail": function (t) {
        return this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_GBC"](Lt, t), this;
      },
      "onError": function (t) {
        return this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_GBC"](Ht, t), this;
      },
      "onForbidden": function (t) {
        return this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_GBC"](Nt, t), this;
      },
      "onAbuse": function (t) {
        return this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_GBC"](Pt, t), this;
      },
      "onClose": function (t) {
        return this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_GBC"](zt, t), this;
      },
      "zoom": function (t) {
        return this["$_BIDy"] && P["$_HBq"](this["$_BICi"])["$_CCHL"](t), this;
      },
      "destroy": function () {
        this["$_BIDy"] && (this["$_BIDy"] = !1, P["$_HBq"](this["$_BICi"])["$_BBCq"](), P["$_HAy"](this["$_BICi"], null));
      }
    }, se["prototype"] = {
      "$_BJIG": function (t) {
        if ("webkitTransform" in h["body"]["style"] || "transform" in h["body"]["style"]) {
          var e = "translate(" + $_BDZ(t - this["$_BIE_"]) + ", 0px)";
          this["$_BJq"]["$_sTyyle"]({
            "transform": e,
            "webkitTransform": e
          });
        } else this["$_BJq"]["$_sTyyle"]({
          "left": $_BDZ(t)
        });
      }
    }, ae["prototype"] = {
      "$_BIHi": function () {
        for (var t = this["$"], e = [".canvas_bg", ".canvas_fullbg", ".canvas_img", ".canvas_slice"], n = 0; n < e["length"]; n++) try {
          var r = t(e[n]);
          this["$_CFFN"](r);
        } catch (i) {}
      },
      "$_CFFN": function (t) {
        var e = this,
          n = t["$_CGE"]["toDataURL"];
        t["$_CGE"]["toDataURL"] = function () {
          return e["$_BAIg"]["td"] = 1, n["call"](this);
        }, t["$_CGE"]["toDataURL"]["toString"] = function () {
          return "function toDataURL() { [native code] }";
        }, t["$_CGE"]["toDataURL"]["toString"]["toString"] = function () {
          return "function toString() { [native code] }";
        };
        var r = t["$_CGE"]["toBlob"];
        t["$_CGE"]["toBlob"] = function () {
          return e["$_BAIg"]["td"] = 1, r["call"](this);
        }, t["$_CGE"]["toBlob"]["toString"] = function () {
          return "function toBlob() { [native code] }";
        };
      },
      "$_BIGK": function (t) {
        var e = this["$_CJQ"],
          n = this["$"],
          r = this["$_DAa"];
        if (e["area"]) {
          var i = lt["$"](e["area"]);
          if (i) {
            var o = i["$_BEIZ"](),
              s = t ? r["$"](".panel") : n(".holder");
            s && s["$_sTyyle"]({
              "position": "absolute",
              "left": $_BDZ(o["left"]),
              "top": $_BDZ(o["top"]),
              "width": $_BDZ(o["width"]),
              "height": $_BDZ(o["height"])
            });
          }
        }
      },
      "$_GAb": function () {
        var n = this,
          t = n["$_CJQ"],
          e = n["$"],
          r = n["$_BIAg"];
        t["template"] && "common" === t["template"] && e(".tip_content")["$_BEJG"](r["tip"]), n["$_CCID"](), t["feedback"] || t["logo"] || t["is_next"] || e(".panel")["$_BDBq"]();
        var i = -20,
          o = setInterval(function () {
            !function e(t) {
              n["$_CEHr"](t, !0), 0 === t && clearInterval(o);
            }(i), i++;
          }, 15);
        return n;
      },
      "$_CDIJ": function (t, e) {
        var n = this,
          r = n["$"],
          i = r(".window")["$_BEHe"]();
        return n["$_CFEG"] = (i["right"] - i["left"]) / n["$_CFGx"], n["$_CDJR"](t, e, function () {
          r(".refresh")["$_BDBq"](), n["$_BGJw"] = n["$_CEIy"], n["$_CFHi"]["$_GJF"]();
        });
      },
      "$_CEAc": function (e, t, n) {
        var r = this,
          i = r["$"],
          o = i(".result"),
          s = r["$_BIAg"];
        return e == Rt ? r["$_CEBh"]["$_CECM"](e, {
          "sec": (r["$_CEDS"] / 1e3)["toFixed"](1),
          "score": 100 - r["$_CBE_"]
        }) : r["$_CEBh"]["$_CECM"](e), o["$_BEEC"](e, r["$_CEEJ"] || null), i(".result_icon")["$_BEEC"](e, r["$_CEEJ"] || null), r["$_CEEJ"] = e, r["$_CJQ"]["is_next"] ? new G(function (t) {
          o["$_BEAc"]("showTip"), 35 < s[e]["length"] && i(".result")["$_BEAc"]("multi_line"), v(function () {
            t();
          }, n || 1500);
        })["$_DGt"](function () {
          if (!t) return new G(function (t) {
            o["$_BEBB"]("showTip"), 35 < s[e]["length"] && i(".result")["$_BEBB"]("multi_line"), v(function () {
              t();
            }, 200);
          });
        }) : new G(function (t) {
          o["$_sTyyle"]({
            "opacity": "1",
            "zIndex": "0"
          }), v(function () {
            t();
          }, n || 1500);
        })["$_DGt"](function () {
          if (!t) return new G(function (t) {
            o["$_sTyyle"]({
              "opacity": "0"
            }), v(function () {
              t(), o["$_sTyyle"]({
                "zIndex": "-1"
              });
            }, 200);
          });
        });
      },
      "$_CEGU": function () {
        var e = this["$"];
        return e(".slider_button")["$_BEAc"]("animate"), e(".progress_left") && e(".progress_left")["$_BEAc"]("animate_process"), e(".slice")["$_BDBq"](), this["$_CEHr"](this["$_CEIy"]), new G(function (t) {
          v(function () {
            e(".slider_button")["$_BEBB"]("animate"), e(".progress_left") && e(".progress_left")["$_BEBB"]("animate_process"), e(".slice")["$_BDCn"](), t();
          }, 400);
        });
      },
      "$_CAHE": function () {
        var t = this["$"];
        return t(".fullbg")["$_BDBq"](), t(".loading")["$_BDDZ"](0), v(function () {
          t(".loading")["$_BDBq"]();
        }, 500), t(".refresh")["$_BDCn"](), this;
      },
      "$_CBCG": function (t, e) {
        this["$_CBE_"] = e;
        var n = this["$"],
          r = this["$_DAa"];
        return n(".fullbg")["$_BDCn"]()["$_BDDZ"](1), n(".refresh")["$_BDCn"](), n(".canvas_img")["$_BEAc"]("flash"), n(".div_img")["$_BEAc"]("flash"), r && r["hideSuccess"] ? new G(function (t) {
          t();
        }) : this["$_CEAc"](Rt, null, 350)["$_DGt"](function () {
          return new G(function (t) {
            t();
          });
        });
      },
      "$_CBFF": function () {
        var t = this,
          e = t["$"];
        t["$_CEAc"](Lt), e(".slice")["$_BDDZ"](1);
        var n = t["$_CJQ"];
        return "popup" !== n["product"] && "custom" !== n["product"] || (e(".popup_box")["$_BEAc"]("shake"), v(function () {
          e(".popup_box")["$_BEBB"]("shake");
        }, 400)), new G(function (t) {
          v(function () {
            t();
          }, 1500);
        })["$_DGt"](function () {
          return t["$_CEGU"]();
        });
      },
      "$_CBJq": function () {
        return this["$_CFAm"]();
      },
      "$_CBGH": function () {
        return this["$_CFBr"]();
      },
      "$_CBHF": function () {
        return this["$_CFCZ"]();
      },
      "$_CAFn": function (t) {
        function a() {
          n(".canvas_img")["$_BDBq"](), n(".div_img")["$_BDCn"](), n(".fullbg", n(".div_fullbg")), n(".bg", n(".div_bg")), n(".slice", n(".div_slice")), i && $_BFZ(i, n(".fullbg"), r["height"]), $_BFZ(o, n(".bg"), r["height"]), e["$_BJq"] = new se(n(".slice"), s, r["height"], r["xpos"], r["ypos"]), "popup" === r["product"] || "custom" === r["product"] ? n(".popup_box")["$_sTyyle"]({
            "width": $_BDZ(278)
          }) : n(".holder")["$_sTyyle"]({
            "width": $_BDZ(278)
          }), n(".div_bg")["$_sTyyle"]({
            "height": $_BDZ(r["height"])
          }), n(".div_fullbg")["$_sTyyle"]({
            "height": $_BDZ(r["height"])
          });
        }
        var e = this,
          n = e["$"],
          r = e["$_CJQ"];
        n(".window")["$_sTyyle"]({
          "paddingBottom": Number(r["height"] / e["$_CFGx"] * 100)["toFixed"](2) + "%"
        }), n(".loading")["$_sTyyle"]({
          "paddingTop": 10 * (r["height"] - e["$_CFDO"]) / 44 + "%"
        }), n(".result_box")["$_sTyyle"]({
          "paddingTop": 10 * (r["height"] - e["$_CFDO"]) / 44 + "%"
        });
        var i = t[0],
          o = t[1],
          s = t[2];
        if (Jt) try {
          n(".canvas_img")["$_BDCn"](), n(".div_img")["$_BDBq"](), n(".fullbg", n(".canvas_fullbg")), n(".bg", n(".canvas_bg")), n(".slice", n(".canvas_slice")), i && $_BEN(i, n(".fullbg"), r["height"]), $_BEN(o, n(".bg"), r["height"]), e["$_BJq"] = new ee(n(".slice"))["$_BJBV"](260, r["height"])["$_BJCp"](s, r["xpos"], r["ypos"]);
        } catch (_) {
          a();
        } else a();
        return "embed" === r["product"] && e["$_CFIa"](), e;
      },
      "$_CCHL": function (t) {
        var e = this["$"],
          n = this["$_CJQ"],
          r = this["$_CFJy"] = t;
        return Q(t) && (r = $_BDZ(t)), "popup" === n["product"] || "custom" === n["product"] || e(".holder")["$_sTyyle"]({
          "width": r
        }), this;
      }
    }, $_DCx["$_HBq"] = function (t, e, n) {
      for (var r = parseInt(6 * Math["random"]()), i = parseInt(300 * Math["random"]()), o = X(r + "")["slice"](0, 9), s = X(i + "")["slice"](10, 19), a = "", _ = 0; _ < 9; _++) a += _ % 2 == 0 ? o["charAt"](_) : s["charAt"](_);
      var c = a["slice"](0, 4),
        u = function (t) {
          if (5 == t["length"]) {
            var e = (parseInt(t, 16) || 0) % 200;
            return e < 40 && (e = 40), e;
          }
        }(a["slice"](4)),
        l = function (t) {
          if (4 == t["length"]) return (parseInt(t, 16) || 0) % 70;
        }(c);
      return t["$_CGAS"] = $_GQ(), P["$_HAy"](t["$_CGAS"], {
        "rand0": r,
        "rand1": i,
        "x_pos": u
      }), new G(function (t) {
        t({
          "bg": "/pictures/gt/" + o + "/bg/" + s + ".jpg",
          "fullbg": "/pictures/gt/" + o + "/" + o + ".jpg",
          "slice": "/pictures/gt/" + o + "/slice/" + s + ".png",
          "type": "slide",
          "ypos": l,
          "xpos": 0
        });
      });
    }, $_DCx["$_CGBC"] = function (t, e, n) {
      var r,
        i = P["$_HBq"](t["$_CGAS"]),
        o = n["x"],
        s = i["x_pos"],
        a = i["rand0"],
        _ = i["rand1"];
      return r = s - 3 <= o && o <= s + 3 ? {
        "success": !0,
        "message": "success",
        "validate": H(o, t["challenge"]) + "_" + H(a, t["challenge"]) + "_" + H(_, t["challenge"]),
        "score": Math["round"](n["passtime"] / 200)
      } : {
        "success": 0,
        "message": "fail"
      }, new G(function (t) {
        t(r);
      });
    }, $_DCx["$_DDq"] = function (t, e, n) {
      return "/get.php" === e || "/refresh.php" === e ? $_DCx["$_HBq"](t, e, n) : "/ajax.php" === e ? $_DCx["$_CGBC"](t, e, n) : void 0;
    }, ce["prototype"] = {
      "$_CECM": function (t, e, n) {
        var r = this["$_BIAg"][t],
          i = r;
        return this["$_BIJE"]["$_BEJG"](r["replace"](n, "")), e && new ut(e)["$_CEj"](function (t, e) {
          i = i["replace"](t, e);
        }), this["$_BJAw"]["$_BEJG"](i), this;
      }
    }, $_BAV(ae["prototype"], ue["prototype"] = {
      "$_CFGx": 260,
      "$_CGCh": 300,
      "$_CFDO": 116,
      "$_CEIy": 0,
      "$_CGDe": 200,
      "$_CGEb": function () {
        var t = this["$_CJQ"],
          e = "/static/" + t["theme"] + "/style" + ("https://" === t["protocol"] ? "_https" : "") + "." + t["theme_version"] + ".css",
          n = t["debugConfig"];
        return n && n["skin_path"] && (e = e["replace"]("/static", n["skin_path"])), B(t, "css", t["protocol"], t["static_servers"] || t["staticservers"], e);
      },
      "$_CAAG": function (t, e) {
        var n = this["$"];
        this["$_CJQ"];
        return n(".slider")["$_BEEC"](t, e || null), this;
      },
      "$_CCID": function () {
        var t = this,
          e = t["$_CJQ"];
        e["lang"] = e["lang"] || "zh-cn";
        var n = t["$"],
          r = t["$_BIAg"],
          i = parseInt(t["$_CJQ"]["width"]);
        return n(".slider_tip")["$_BEJG"](r["slide"]), n(".feedback_tip")["$_BEJG"](r["feedback"]), n(".loading_tip")["$_BEJG"](r["loading"]), n(".refresh")["$_CCR"]({
          "href": "javascript:;",
          "aria-label": r["refresh"],
          "role": "button",
          "tabIndex": "-1"
        }), "popup" === e["product"] || e["product"], e["feedback"] ? n(".feedback")["$_CCR"]({
          "target": "_blank",
          "href": e["feedback"] + "&challenge=" + e["challenge"]
        }) : n(".feedback")["$_BDBq"](), e["is_next"] ? (n(".refresh_tip")["$_BEJG"](r["refresh"]), n(".refresh_1")["$_CCR"]({
          "href": "javascript:;",
          "aria-label": r["refresh"],
          "role": "button",
          "tabIndex": "-1"
        }), n(".close")["$_CCR"]({
          "aria-label": r["close"],
          "role": "button",
          "tabIndex": "-1"
        }), n(".close_tip")["$_BEJG"](r["close"]), i < 257 ? -1 != e["lang"]["toLowerCase"]()["indexOf"]("cn") || "zh" === e["lang"] ? n(".copyright_tip")["$_BEJG"]("极验") : n(".copyright_tip")["$_BEJG"]("Geetest") : n(".copyright_tip")["$_BEJG"](r["logo"]), e["logo"] ? n(".copyright")["$_CCR"]({
          "target": "_blank",
          "href": e["homepage"]
        }) : n(".copyright")["$_BDBq"]()) : e["logo"] ? n(".logo")["$_CCR"]({
          "target": "_blank",
          "href": e["homepage"]
        }) : n(".logo")["$_BDBq"](), e["hideClose"] && n(".geetest_close")["$_DIS"](), e["hideRefresh"] && n(".geetest_refresh_1")["$_DIS"](), b && (n(".feedback_tip")["$_DIS"](), n(".refresh_tip")["$_DIS"](), n(".close_tip")["$_DIS"]()), e["link"] && n(".link")["$_CCR"]({
          "target": "_blank",
          "href": e["link"]
        }), t["$_CEBh"] = new ce(n, r), t["$_CAEN"] = t["$_CGEb"](), e["remUnit"] && !isNaN(e["remUnit"]) && t["$_CGFu"](), t["$_CFHi"] = new _(function () {
          t["$_CEHr"](t["$_BGJw"] || t["$_CEIy"]);
        }), t["$_CFEG"] = 1, t["$_CCHL"](e["width"]), t;
      },
      "$_CGFu": function () {
        var t = function (t) {
            return t["replace"](/(-?[\d\.]+px)/g, function (t) {
              var e = t["slice"](0, -2);
              return $_BDZ(e);
            });
          }(".geetest_holder.geetest_mobile.geetest_ant{width:278px}.geetest_holder.geetest_mobile.geetest_ant .geetest_widget .geetest_window a.geetest_link .geetest_div_fullbg div,.geetest_holder.geetest_mobile.geetest_ant .geetest_widget .geetest_window a.geetest_link .geetest_div_bg div{width:10px}.geetest_holder.geetest_mobile.geetest_ant .geetest_widget .geetest_window .geetest_flash::after{right:-280px;width:140px;height:400px}@keyframes moveTo-left{0%{right:-280px}100%{right:240px}}@-webkit-keyframes moveTo-left{0%{right:-280px}100%{right:240px}}.geetest_holder.geetest_mobile.geetest_ant .geetest_widget .geetest_window .geetest_loading .geetest_loading_icon{width:34px;height:26px}.geetest_holder.geetest_mobile.geetest_ant .geetest_widget .geetest_window .geetest_loading .geetest_loading_tip{font-size:14px}.geetest_holder.geetest_mobile.geetest_ant .geetest_widget .geetest_window .geetest_result{bottom:-25px;height:24px}.geetest_holder.geetest_mobile.geetest_ant .geetest_widget .geetest_window .geetest_result .geetest_result_content{text-indent:16px;font-size:14px;line-height:24px;height:24px}.geetest_holder.geetest_mobile.geetest_ant .geetest_widget .geetest_window .geetest_result .geetest_right_space{padding-right:16px}.geetest_holder.geetest_mobile.geetest_ant .geetest_widget .geetest_window .geetest_multi_line{height:48px}.geetest_holder.geetest_mobile.geetest_ant .geetest_widget .geetest_window .geetest_multi_line .geetest_result_content{padding-left:16px}.geetest_holder.geetest_mobile.geetest_ant .geetest_widget .geetest_window .geetest_showTip{bottom:0px}.geetest_holder.geetest_mobile.geetest_ant .geetest_slider .geetest_slider_track{height:38px;margin:-19px 0 0 0}.geetest_holder.geetest_mobile.geetest_ant .geetest_slider .geetest_slider_track .geetest_slider_tip{line-height:38px;font-size:14px}.geetest_holder.geetest_mobile.geetest_ant .geetest_slider .geetest_slider_track .geetest_slider_tip.geetest_multi_slide{line-height:18px}.geetest_holder.geetest_mobile.geetest_ant .geetest_panel{border-top:1px solid #EEEEEE}.geetest_holder.geetest_mobile.geetest_ant .geetest_panel .geetest_close_tip,.geetest_holder.geetest_mobile.geetest_ant .geetest_panel .geetest_feedback_tip,.geetest_holder.geetest_mobile.geetest_ant .geetest_panel .geetest_refresh_tip,.geetest_holder.geetest_mobile.geetest_ant .geetest_panel .geetest_voice_tip{top:-32px;left:10px;border-radius:2px;padding:0 4px;height:22px;min-width:50px;line-height:22px}.geetest_holder.geetest_mobile.geetest_ant .geetest_panel .geetest_close_tip:before,.geetest_holder.geetest_mobile.geetest_ant .geetest_panel .geetest_feedback_tip:before,.geetest_holder.geetest_mobile.geetest_ant .geetest_panel .geetest_refresh_tip:before,.geetest_holder.geetest_mobile.geetest_ant .geetest_panel .geetest_voice_tip:before{bottom:-6px;border-width:4px 6px}.geetest_holder.geetest_mobile.geetest_ant .geetest_panel .geetest_copyright .geetest_logo{width:11px;height:11px}.geetest_holder.geetest_mobile.geetest_ant .geetest_panel .geetest_copyright .geetest_copyright_tip{margin:0 0 0 4px;line-height:11px;font-size:12px}@keyframes geetest_shake{25%{margin-left:-6px}75%{margin-left:6px}100%{margin-left:0}}@-webkit-keyframes geetest_shake{25%{margin-left:-6px}75%{margin-left:6px}100%{margin-left:0}}.geetest_holder.geetest_mobile.geetest_ant.geetest_popup .geetest_popup_box{width:278px;min-width:230px;max-width:278px;border:1px solid #d1d1d1;margin-left:-139px;margin-top:-143px}"),
          e = new lt("style");
        e["type"] = "text/css", e["_style"](t), e["$_CIm"](new lt(p));
      },
      "$_GBC": function () {
        var a = this,
          _ = a["$"],
          c = a["$_CJQ"];
        "float" === c["product"] ? _(".holder")["$_GBC"]("enter", function () {
          a["$_CDCK"](!0);
        })["$_GBC"]("leave", function () {
          a["$_CDCK"](!1);
        }) : "popup" !== c["product"] && "custom" !== c["product"] || (_(".popup_ghost")["$_GBC"]("click", function () {
          a["$_CGGI"]();
        }), _(".popup_close")["$_GBC"]("click", function () {
          a["$_CGGI"]();
        })), c["is_next"] && (_(".close")["$_GBC"]("click", function () {
          "popup" === c["product"] || "custom" === c["product"] ? a["$_CGGI"]() : a["$_BHFY"]["$_BBBg"](zt);
        }), _(".refresh_1")["$_GBC"]("click", function (t) {
          a["$_BBHA"]["$_HAy"](Ft), t["$_BGEE"]();
        })), _(".slider_button")["$_GBC"]("down", function (t) {
          t["$_BGEE"](), a["$_CDIJ"](t, !0), a["$_CGHW"]();
        }), _(".canvas_slice")["$_GBC"]("down", function (t) {
          var e = a["$_BJq"]["$_BJET"],
            n = a["$_BJq"]["$_BJFn"],
            r = e + 60,
            i = n + 65,
            o = t["$_BGCu"]() - t["$_CGE"]["$_BEHe"]()["left"],
            s = t["$_BGDy"]() - t["$_CGE"]["$_BEHe"]()["top"];
          try {
            e < o && o < r && n < s && s < i && (a["$_CDIJ"](t, !1), a["$_CGHW"](), c["link"] && _(".link")["$_BDFk"](["href", "target"]));
          } catch (t) {}
        }), _(".div_slice")["$_GBC"]("down", function (t) {
          a["$_CDIJ"](t, !1), a["$_CGHW"]();
        }), _(".holder")["$_GBC"]("move", function (t) {
          a["$_BJIG"](t);
        })["$_GBC"]("up", function (t) {
          a["$_CGIy"](t);
        }), S && _(".holder")["$_GBC"]("cancel", function (t) {
          a["$_CGIy"](t, !0);
        }), _(".refresh")["$_GBC"]("click", function (t) {
          a["$_BBHA"]["$_HAy"](Ft), t["$_BGEE"]();
        });
      },
      "$_CGHW": function () {
        var e = this;
        e["$_CGJC"] = new lt(h), e["$_CHA_"] = new lt(window), e["$_CGJC"]["$_GBC"]("up", function (t) {
          e["$_CGIy"](t), e["$_CGJC"]["$_GCd"]("up");
        }), e["$_CHA_"]["$_GBC"]("up", function (t) {
          e["$_CGIy"](t), e["$_CGJC"]["$_GCd"]("up");
        });
      },
      "$_CIm": function (t) {
        var e = this,
          n = e["$_CJQ"];
        e["$"];
        if (e["$_CHBN"] = lt["$"](t), !e["$_CHBN"]) return z($("api_appendTo", e["$_BAIg"]));
        "popup" === n["product"] || "custom" === n["product"] ? e["$_BIBo"]["$_CIm"](new lt(d)) : e["$_BIBo"]["$_CIm"](e["$_CHBN"]), "float" === n["product"] && (n["sandbox"] ? e["$_CDBB"]() : e["$_BIBo"]["$_BFJY"]()), "embed" !== n["product"] && e["$_CHCz"](), e["$_CJQ"]["show_voice"] && e["$_CHDj"](), e["$_CHEc"] = $_Im();
      },
      "$_CFIa": function () {
        function o() {
          var t = n(".wrap")["$_BFHo"]();
          r === t && 0 !== r || 5 < i ? e["$_CHCz"]() : (i += 1, r = t, v(o, 100));
        }
        var e = this,
          n = e["$"],
          r = n(".wrap")["$_BFHo"](),
          i = 0;
        v(o, 100);
      },
      "$_CHCz": function () {
        var t = this["$_CJQ"],
          e = this["$"];
        e(".slider")["$_BFHo"]() < e(".slider_track")["$_BFHo"]() && e(".slider_tip")["$_BEAc"]("multi_slide");
        -1 < new ct(["ar", "fa", "iw", "ur"])["$_BCHY"](t["lang"] && t["lang"]["split"]("-")[0]) && (e(".wrap")["$_sTyyle"]({
          "direction": "rtl"
        }), e(".slider_tip")["$_sTyyle"]({
          "textAlign": "right"
        }), e(".slider_track")["$_sTyyle"]({
          "width": "70%"
        }), e(".result_content")["$_BEAc"]("right_space"));
      },
      "$_CHDj": function () {
        var e = this,
          t = e["$"],
          n = e["$_BIAg"],
          r = e["$_BBHA"];
        t(".small")["$_CCR"]({
          "tabIndex": "-1"
        })["$_BFGn"]()["$_sTyyle"]({
          "outline": "none"
        }), t(".voice_tip")["$_BEJG"](n["voice"]), t(".close")["$_CCR"]({
          "tabIndex": "-1",
          "aria-label": n["close"],
          "role": "button"
        }), t(".refresh_1")["$_CCR"]({
          "tabIndex": "-1",
          "aria-label": n["refresh"],
          "role": "button"
        }), t(".feedback")["$_CCR"]({
          "tabIndex": "-1"
        }), t(".voice")["$_CCR"]({
          "tabIndex": "0",
          "aria-label": n["voice"],
          "role": "button"
        })["$_sTyyle"]({
          "display": "inline-block"
        })["$_BFGn"](), t(".voice")["$_GBC"]("keydown", function (t) {
          13 === t["$_DCx"]["keyCode"] && (r["$_HAy"](Xt), e["$_BAIg"]["$_BBCq"]());
        }), t(".voice")["$_GBC"]("click", function () {
          r["$_HAy"](Xt), e["$_BAIg"]["$_BBCq"]();
        });
      },
      "$_CCAA": function (t) {
        var e = this;
        if ("popup" !== e["$_CJQ"]["product"] || "custom" === e["$_CJQ"]["product"]) return e;
        if (e["$_CHFq"] = lt["$"](t), !e["$_CHFq"]) return z($("api_bindOn", e["$_BAIg"]));
        var n = e["$_CHFq"]["$_BFBG"](!0);
        return n["$_BDIh"](e["$_CHFq"]), e["$_CHFq"]["$_BDBq"](), n["$_GBC"]("click", function (t) {
          e["$_CHGl"](), t["$_BGEE"]();
        }), e;
      },
      "$_BDCn": function () {
        var t = this;
        return "popup" !== t["$_CJQ"]["product"] && "custom" !== t["$_CJQ"]["product"] || t["$_CHGl"](), t;
      },
      "$_BDBq": function () {
        var t = this;
        return "popup" !== t["$_CJQ"]["product"] && "custom" !== t["$_CJQ"]["product"] || t["$_CGGI"](), t;
      },
      "$_CHGl": function () {
        var t = this;
        "custom" === t["$_CJQ"]["product"] && t["$_BIGK"](), t["$_BIBo"]["$_BDCn"](), v(function () {
          t["$_BIBo"]["$_BDDZ"](1);
        }, 10);
      },
      "$_CGGI": function () {
        var e = this;
        return e["$_BIBo"]["$_BDDZ"](0), new G(function (t) {
          v(function () {
            e["$_BIBo"]["$_BDBq"](), e["$_BHFY"]["$_BBBg"](zt), t();
          }, 0);
        });
      },
      "$_CHHn": function () {
        var t = this["$_BIAg"];
        return (0, this["$"])(".popup_tip")["$_BEJG"](t["popup_finish"]), new G(function (t) {
          v(t, 1e3);
        });
      },
      "$_CDJR": function (t, e, n) {
        var r = this,
          i = r["$_BBHA"];
        if (i["$_HBq"]() === It) {
          i["$_HAy"]($t), t["$_BGEE"](), r["$_CHId"] = "pointerdown" == t["type"];
          var o = r["$"](".slider_button")["$_BEHe"](),
            s = r["$"](".canvas_slice")["$_BEHe"]();
          r["$_CHJt"] = $_Im();
          var a,
            _,
            c = r["$_CFEG"];
          return r["$_CIAf"] = t["$_BGCu"]() / c, r["$_CIBm"] = t["$_BGDy"]() / c, _ = e ? (a = o["top"], o["left"]) : (a = s["top"] + r["$_BJq"]["$_BJFn"], s["left"]), r["$_CICC"] = new W([Math["round"](_ / c - r["$_CIAf"]), Math["round"](a / c - r["$_CIBm"]), 0])["$_BBDu"]([0, 0, 0]), r["$_BGJw"] = r["$_CEIy"], r["$_CFHi"]["$_GJF"](), r["lastPoint"] = {
            "x": 0,
            "y": 0
          }, $_Fc(n) && n(), r;
        }
      },
      "$_BJIG": function (t) {
        var e = this;
        if (e["$_BBHA"]["$_HBq"]() === $t && (!e["$_CHId"] || "pointermove" == t["type"])) {
          t["$_BGEE"]();
          var n = e["$_CFEG"],
            r = t["$_BGCu"]() / n - e["$_CIAf"],
            i = e["$_CIBm"] - t["$_BGDy"]() / n;
          e["$_BGJw"] = r, e["$_CICC"]["$_BBDu"]([Math["round"](r), Math["round"](i), $_Im() - e["$_CHJt"]]), e["lastPoint"] && (e["lastPoint"]["x"] = r, e["lastPoint"]["y"] = i), r >= e["$_CGDe"] && e["$_CGIy"](t);
        }
      },
      "$_CGIy": function (t, e) {
        var n = this,
          r = n["$_BAIg"],
          i = n["$_BBHA"],
          o = n["$_CJQ"],
          s = n["$"];
        try {
          if (i["$_HBq"]() !== $t) return;
          if (n["$_CHId"] && "pointerup" != t["type"]) return;
          v(function () {
            o["link"] && s(".link")["$_CCR"]({
              "target": "_blank",
              "href": o["link"]
            });
          }, 0), t["$_BGEE"](), i["$_HAy"]("lock");
          var a = n["$_CFEG"],
            _ = e ? n["lastPoint"]["x"] : t["$_BGCu"]() / a - n["$_CIAf"],
            c = e ? n["lastPoint"]["y"] : n["$_CIBm"] - t["$_BGDy"]() / a;
          n["$_CEDS"] = $_Im() - n["$_CHJt"], n["$_CICC"]["$_BBDu"]([Math["round"](_), Math["round"](c), n["$_CEDS"]]);
          var u = parseInt(_),
            l = n["$_CICC"]["$_BBEl"](n["$_CICC"]["$_FDd"](), n["$_CJQ"]["c"], n["$_CJQ"]["s"]);
          r["$_CCBb"](u, l, n["$_CEDS"]), n["$_CFHi"]["$_GFW"]();
        } catch (t) {
          r["$_DBw"](t);
        }
        return n;
      },
      "$_CBAP": function () {
        var e = this,
          n = e["$"],
          r = e["$_CJQ"],
          i = e["$_BBHA"];
        n(".loading")["$_BDCn"]()["$_BDDZ"](1), n(".fullbg")["$_BDDZ"](1)["$_BDCn"](), n(".slice")["$_BDDZ"](1), I(r, "/refresh.php", {
          "gt": r["gt"],
          "challenge": r["challenge"],
          "lang": r["lang"] || "zh-cn",
          "type": r["type"]
        })["$_DGt"](function (t) {
          if (t["status"] == Ht) return z(F(t, e["$_BAIg"], "/refresh.php"));
          e["$_CEGU"](), e["$_CEHr"](e["$_CEIy"]), r["$_BHEO"]($_BBj(t)), r["link"] && n(".link")["$_CCR"]({
            "target": "_blank",
            "href": r["link"]
          }), i["$_HAy"](jt);
        }, function () {
          return z($("url_refresh", e["$_BAIg"]));
        });
      },
      "$_CAJl": function () {
        var t = this["$"];
        return this["$_CJQ"]["mobile"] || t(".slice")["$_BDDZ"](.8), this;
      },
      "$_CAIT": function () {
        var t = this["$"];
        t(".fullbg")["$_BDDZ"](0), v(function () {
          t(".fullbg")["$_BDBq"]();
        }, 200);
      },
      "$_CFAm": function () {
        this["$_CEAc"](Ht, !0);
      },
      "$_CFBr": function () {
        return this["$_CEAc"](Pt), new G(function (t) {
          v(t, 1500);
        });
      },
      "$_CFCZ": function () {
        return this["$_CEAc"](Nt), new G(function (t) {
          v(t, 1500);
        });
      },
      "$_CEHr": function (t, e) {
        var n = this,
          r = n["$"];
        if (t < (e ? -20 : n["$_CEIy"]) ? t = n["$_CEIy"] : t > n["$_CGDe"] && (t = n["$_CGDe"]), e) {
          var i = t / 20 + 1;
          r(".slider_button")["$_sTyyle"]({
            "opacity": i
          });
        }
        if ("webkitTransform" in h["body"]["style"] || "transform" in h["body"]["style"]) {
          if (C || /EzvizStudio/["test"](ht["userAgent"])) var o = "translate(" + t * n["$_CFEG"] + "px, -10px)";else o = "translate(" + t * n["$_CFEG"] + "px, 0px)";
          r(".slider_button")["$_sTyyle"]({
            "transform": o,
            "webkitTransform": o
          });
        } else r(".slider_button")["$_sTyyle"]({
          "left": t * n["$_CFEG"] + "px"
        });
        var s = .9 * r(".slider_button")["$_BFHo"]();
        r(".progress_left") && r(".progress_left")["$_sTyyle"]({
          "width": t * n["$_CFEG"] + s + "px",
          "opacity": 1
        }), "undefined" != typeof n["$_CJQ"]["so"] && 0 !== n["$_CJQ"]["so"] && n["$_CICC"] && (t = n["$_CICC"]["$_BBFd"](parseInt(t), n["$_CJQ"]["c"], n["$_CJQ"]["so"])), n["$_BJq"] && n["$_BJq"]["$_BJIG"](t);
      },
      "$_BBCq": function () {
        (0, this["$"])(".holder")["$_DIS"]();
      }
    }), $_BAV(ie["prototype"], ue["prototype"]), Y["noConflict"](window, oe);
  });
}();