var CryptoJS = require("crypto-js");

var s = {
    _makeSign: function(e, t, n, r, i) {
        r = "6093941774D84495A5D15D8F909CAA1E",
        i = "21047C596EAD45209346AE29F0350491";
        var l = this._getHQBSortString(e, t, n);
        return hmac_sha1(l + r, i).toString().toUpperCase()
    },
    emptyIgnore: function(e) {
        return null == e && (e = ""),
        e + ""
    },
    _getHQBSortString: function(e, t, n) {
        for (var r = [], a = this._getObjectKeys(e).sort(), i = [], o = 0; o < a.length; o++)
            0 === a[o].indexOf("hna") && i.push(a[o]);
        for (o = 0; o < i.length; o++)
            r.push(this.emptyIgnore(e[i[o]]));
        var l = this._getObjectKeys(t).sort();
        for (o = 0; o < l.length; o++)
            r.push(this.emptyIgnore(t[l[o]]));
        var s = this._getObjectKeys(n).sort();
        for (o = 0; o < s.length; o++)
            r.push(this.emptyIgnore(n[s[o]]));
        // console.log("r: ", r.join(""));
        return r.join("")
    },
    _getObjectKeys: function(e) {
        var t = [];
        if ("" !== this._trim(e) && null != e)
            for (var n in e) {
                var a = e[n];
                (this._isNumberOrStringOrBoolean(a)) && t.push(n + "")
            }
        return t
    },
    _trim: function(e) {
        return null == e ? "" : (e + "").replace(/^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g, "$1")
    },
    _isNumberOrStringOrBoolean: function isNumberOrStringOrBoolean(a) {
        const tag = Object.prototype.toString.call(a);
        return (
            tag === '[object Number]' ||
            tag === '[object String]' ||
            tag === '[object Boolean]'
        );
    }
};



// var lr = "APPHTML5/book/query/start648329E4BBDDEC6C8416EA380E418161A7CD3com.hnair.spa.web.standardstandard10.16.21784870677072WPHe9LUE094b3HTML5gioenc-0cb37171,1b45,5c21,cb63,00e446e75444SZXdefualt_web_gtcidfalsefalseCSX6a61e07e1u1Xo9y9ZXo9Cga6mJJQkuEECm9Fnkp1HTML5%hna%gvnva4gE3sEXviyHG5bmUreTHKEOjexucBqAfND7IUo=zh-CNslatslngWin3217848779879735.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36-4806093941774D84495A5D15D8F909CAA1E";
// var i = "21047C596EAD45209346AE29F0350491";
// console.log(s._makeSign(lr, i, null));

function hmac_sha1(data, key) {
    /** HMAC-SHA1 消息认证码，返回 40 位小写十六进制字符串 */
    return CryptoJS.HmacSHA1(data, key).toString();
}

// console.log(hmac_sha1(i, lr).toUpperCase());

var header_info = {
    "appver": "10.16.2",
    "hna-app": "APP",
    "hna-channel": "HTML5",
    "ekingCode": "THhDTnE4ejMzT0piSDF5aSBcqbLlfIgPjKXGgL0XuL4gGnoyawEosfq7kTLUwK74W7T683GP+luKMpyMrkulWvycnKqrnF/gTPVzXkXrbjDnHIaJbaeqPgatMjI/Aijl"
};

var c = {};

var f  = {
    "sname": "Win32",
    "sver": "5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36",
    "schannel": "HTML5",
    "caller": "HTML5",
    "slang": "zh-CN",
    "did": "gioenc-0cb37171,1b45,5c21,cb63,00e446e75444",
    "stime": 1784883075290,
    "szone": -480,
    "aname": "com.hnair.spa.web.standard",
    "aver": "10.16.2",
    "akey": "9E4BBDDEC6C8416EA380E418161A7CD3",
    "abuild": "64832",
    "atarget": "standard",
    "slat": "slat",
    "slng": "slng",
    "gtcid": "defualt_web_gtcid",
    "riskToken": "6a61e07e1u1Xo9y9ZXo9Cga6mJJQkuEECm9Fnkp1",
    "captchaToken": "",
    "blackBox": "1784881518638WPHbEoU0EWte7",
    "validateToken": "",
    "sens": "%hna%gvnva4gE3sEXviyHG5bmUm+uUiCKjGGNxEM4yyDrEjQ=",
    "originDestinations": [
        {
            "departureDate": "2026-07-25",
            "destination": "SZX",
            "origin": "CSX",
            "destinationType": "1",
            "originType": "1"
        }
    ],
    "passenger": "ADT:1,CNN:1,INF:1",
    "_referer": "/book/query/start"
};

function get_hnairSign(header_info, f) {
    return s._makeSign(header_info, {}, f, null, null)
}

// console.log(s._makeSign(header_info, c, f, null, null));
console.log(get_hnairSign(header_info, f));

// var o_default = {
//     "preffix": "/mapp",
//     "host": "app.hnair.com",
//     "hardCode": "21047C596EAD45209346AE29F0350491",
//     "akey": "9E4BBDDEC6C8416EA380E418161A7CD3",
//     "dsKey": "m1FP4IS3FbZ7cx5phkMIxSdmF1hNNR6N",
//     "certificateHash": "6093941774D84495A5D15D8F909CAA1E",
//     "sercureEnable": true,
//     "abuild": "64832",
//     "aname": "com.hnair.spa.web.standard",
//     "atarget": "standard",
//     "aver": "10.16.2",
//     "cmsHost": "https://m.hnair.com/cms",
//     "configHost": "/cms/config/standard/",
//     "protocol": "https:",
//     "web": "https://m.hnair.com",
//     "webHost": "https://m.hnair.com",
//     "newH5Path": "/hnams",
//     "uniH5Path": "/hnamp",
//     "msApi": {
//         "um": {
//             "api": "https://app.hnair.com",
//             "path": "/appum"
//         },
//         "common": {
//             "api": "https://app.hnair.com",
//             "path": "/appcommon"
//         },
//         "passenger": {
//             "api": "https://app.hnair.com",
//             "path": "/apppassenger"
//         },
//         "member": {
//             "api": "https://app.hnair.com",
//             "path": "/appmember"
//         },
//         "checkin": {
//             "api": "https://app.hnair.com",
//             "path": "/checkin"
//         },
//         "lobsterpay": {
//             "api": "https://app.hnair.com",
//             "path": "/lobsterpay"
//         },
//         "aireye": {
//             "api": "https://app.hnair.com",
//             "path": "/ticket"
//         },
//         "bill": {
//             "api": "https://app.hnair.com",
//             "path": "/bill"
//         },
//         "advanceUp": {
//             "api": "https://app.hnair.com",
//             "path": "/advanceUp"
//         },
//         "flightdynamic": {
//             "api": "https://app.hnair.com",
//             "path": "/flightdynamic"
//         },
//         "trip": {
//             "api": "https://app.hnair.com",
//             "path": "/trip"
//         },
//         "paymember": {
//             "api": "https://app.hnair.com",
//             "path": "/paymember"
//         },
//         "wallet": {
//             "api": "https://app.hnair.com",
//             "path": "/wallet"
//         },
//         "lottery": {
//             "api": "https://app.hnair.com",
//             "path": "/lottery"
//         },
//         "ancillary": {
//             "api": "https://app.hnair.com",
//             "path": "/ancillary"
//         },
//         "upgrade": {
//             "api": "https://app.hnair.com",
//             "path": "/upgrade"
//         },
//         "live": {
//             "api": "https://app.hnair.com",
//             "path": "/live"
//         }
//     },
//     "environment": "standard",
//     "hash": "497e0dea",
//     "local": false,
//     "isOpenMsApi": true,
//     "server": "https://app.hnair.com",
//     "cmsServer": "https://m.hnair.com/cms/config/standard/",
//     "cmsNormalServer": "https://m.hnair.com",
//     "commonParams": {
//         "sname": "Win32",
//         "sver": "5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36",
//         "schannel": "HTML5",
//         "caller": "HTML5",
//         "slang": "zh-CN",
//         "did": "gioenc-0cb37171,1b45,5c21,cb63,00e446e75444",
//         "stime": 1784880326761,
//         "szone": -480,
//         "aname": "com.hnair.spa.web.standard",
//         "aver": "10.16.2",
//         "akey": "9E4BBDDEC6C8416EA380E418161A7CD3",
//         "abuild": "64832",
//         "atarget": "standard",
//         "slat": "slat",
//         "slng": "slng",
//         "gtcid": "defualt_web_gtcid",
//         "riskToken": "6a61e07e1u1Xo9y9ZXo9Cga6mJJQkuEECm9Fnkp1",
//         "captchaToken": "",
//         "blackBox": "1784879591483WPHOcSQlOQWf9",
//         "validateToken": "",
//         "sens": "%hna%gvnva4gE3sEXviyHG5bmUm+uUiCKjGGNxEM4yyDrEjQ="
//     }
// }
