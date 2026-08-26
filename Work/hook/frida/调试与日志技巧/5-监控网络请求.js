Java.perform(function () {
    // 监控 URL 请求
    var URL = Java.use("java.net.URL");
    URL.$init.overload('java.lang.String').implementation = function (url) {
        console.log("[*] URL request: " + url);
        this.$init(url);
    };

    // 监控 HttpURLConnection
    var HttpURLConnection = Java.use("java.net.HttpURLConnection");
    HttpURLConnection.setRequestMethod.implementation = function (method) {
        console.log("[*] HTTP Method: " + method + " URL: " + this.getURL().toString());
        return this.setRequestMethod(method);
    };
});
