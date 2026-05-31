(function (){
    'use strict';
    var _cookie = {};   // hook cookie
    Object.defineProperty(r.options, 'querystring', {
        set: function (val){
            console.log('cookie set->', new Date().getTime(), val);
            debugger;
            _cookie = val;
            return val;
        },
        get: function () {
            return _cookie;
        }
    });
})();
// 对象已经生成了，关键参数没生成

(function () {
    var cookieTemp = document.cookie;
    Object.defineProperty(document, 'cookie', {
        set: function (val) {
            if (val.indexOf('v') != -1) {
                debugger;
            }
            console.log('Hook捕获到cookie设置->', val);
            cookieTemp = val;
        },
        get: function () {
            return cookieTemp;
        },
    });
})();