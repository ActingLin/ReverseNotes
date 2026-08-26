Java.perform(function () {
    var JSONObject = Java.use("org.json.JSONObject");

    // Hook toString 打印所有 JSON
    JSONObject.toString.implementation = function () {
        var result = this.toString();
        // 过滤太长的或不相关的
        if (result.length > 10 && result.length < 10000) {
            console.log("[JSON] " + result);
        }
        return result;
    };

    // Hook 构造函数看 JSON 输入
    JSONObject.$init.overload('java.lang.String').implementation = function (jsonStr) {
        console.log("[JSON Input] " + jsonStr);
        this.$init(jsonStr);
    };
});
