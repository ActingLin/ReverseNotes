Java.perform(function () {
    // Retrofit 基于 OkHttp，hook OkHttp3即可
    // 额外 hook Retrofit 的接口方法调用
    try {
        var Retrofit = Java.use("retrofit2.Retrofit");
        Retrofit.create.implementation = function (service) {
            console.log("[*] Retrofit.create: " + service.getName());
            return this.create(service);
        };
    } catch (e) { }

    // Hook HttpLoggingInterceptor（如果有的话）
    try {
        var HttpLoggingInterceptor = Java.use("okhttp3.logging.HttpLoggingInterceptor");
        HttpLoggingInterceptor.intercept.implementation = function (chain) {
            var request = chain.request();
            console.log("[Retrofit] " + request.method() + " " + request.url());
            return this.intercept(chain);
        };
    } catch (e) { }
});
