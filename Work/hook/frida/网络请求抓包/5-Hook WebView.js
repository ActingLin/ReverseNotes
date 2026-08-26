Java.perform(function () {
    var WebView = Java.use("android.webkit.WebView");

    // Hook loadUrl
    WebView.loadUrl.overload('java.lang.String').implementation = function (url) {
        console.log("[*] WebView.loadUrl: " + url);
        this.loadUrl(url);
    };

    // Hook addJavascriptInterface（JS桥接）
    WebView.addJavascriptInterface.implementation = function (obj, name) {
        console.log("[*] WebView.addJavascriptInterface: " + name);
        console.log("    Class: " + obj.getClass().getName());
        this.addJavascriptInterface(obj, name);
    };

    // Hook evaluateJavascript
    WebView.evaluateJavascript.implementation = function (script, callback) {
        console.log("[*] WebView.evaluateJavascript: " + script.substring(0, 200));
        this.evaluateJavascript(script, callback);
    };
});
