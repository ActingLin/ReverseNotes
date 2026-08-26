// 通用 SSL Pinning 绕过
Java.perform(function () {
    console.log("[*] SSL Pinning Bypass loaded");

    // 1. TrustManager 绕过
    var X509TrustManager = Java.use("javax.net.ssl.X509TrustManager");
    var SSLContext = Java.use("javax.net.ssl.SSLContext");

    var TrustManager = Java.registerClass({
        name: "com.bypass.TrustManager",
        implements: [X509TrustManager],
        methods: {
            checkClientTrusted: function (chain, authType) { },
            checkServerTrusted: function (chain, authType) { },
            getAcceptedIssuers: function () { return []; }
        }
    });

    var TrustManagers = [TrustManager.$new()];
    SSLContext.init.overload('[Ljavax.net.ssl.KeyManager;', '[Ljavax.net.ssl.TrustManager;', 'java.security.SecureRandom')
        .implementation = function (km, tm, sr) {
            console.log("[*] SSLContext.init called");
            this.init(km, TrustManagers, sr);
        };

    // 2. OkHttp3 CertificatePinner 绕过
    try {
        var CertificatePinner = Java.use("okhttp3.CertificatePinner");
        CertificatePinner.check.overload('java.lang.String', 'java.util.List').implementation = function (hostname, peerCertificates) {
            console.log("[*] OkHttp3 CertificatePinner.check bypassed for: " + hostname);
        };
    } catch (e) { }

    // 3. WebView SSL 错误绕过
    try {
        var WebViewClient = Java.use("android.webkit.WebViewClient");
        WebViewClient.onReceivedSslError.implementation = function (webView, sslErrorHandler, sslError) {
            console.log("[*] WebView SSL error bypassed");
            sslErrorHandler.proceed();
        };
    } catch (e) { }

    // 4. HostnameVerifier 绕过
    try {
        var HostnameVerifier = Java.use("javax.net.ssl.HostnameVerifier");
        var HttpsURLConnection = Java.use("javax.net.ssl.HttpsURLConnection");
        var hostnameVerifier = Java.registerClass({
            name: "com.bypass.HostnameVerifier",
            implements: [HostnameVerifier],
            methods: {
                verify: function (hostname, session) {
                    console.log("[*] HostnameVerifier.verify bypassed for: " + hostname);
                    return true;
                }
            }
        });

        HttpsURLConnection.setDefaultHostnameVerifier(hostnameVerifier.$new());
    } catch (e) { }

    console.log("[*] SSL Pinning Bypass complete");
});
