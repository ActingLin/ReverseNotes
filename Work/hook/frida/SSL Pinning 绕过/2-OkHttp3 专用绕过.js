Java.perform(function () {
    // 方式1: Hook CertificatePinner
    try {
        var CertificatePinner = Java.use("okhttp3.CertificatePinner");
        CertificatePinner.check$okhttp.overload('java.lang.String', 'kotlin.jvm.functions.Function0').implementation = function (hostname, cleanupFn) {
            console.log("[*] OkHttp3 pinning bypassed for: " + hostname);
            // 不调用原方法，直接返回
        };
    } catch (e) {
        console.log("[-] OkHttp3 bypass failed: " + e);
    }

    // 方式2: 置空 CertificatePinner 的 pins
    try {
        Java.choose("okhttp3.CertificatePinner", {
            onMatch: function (instance) {
                console.log("[*] Found CertificatePinner instance, clearing pins");
                instance.pins.value = Java.use("java.util.ArrayList").$new();
            },
            onComplete: function () { }
        });
    } catch (e) { }
});
