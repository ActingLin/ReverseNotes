Java.perform(function () {
    // Hook RealCall.execute (同步请求)
    try {
        var RealCall = Java.use("okhttp3.RealCall");
        RealCall.execute.implementation = function () {
            var request = this.request();
            console.log("\n[OkHttp] ====== Request ======");
            console.log("[URL] " + request.url());
            console.log("[Method] " + request.method());

            // 打印请求头
            var headers = request.headers();
            for (var i = 0; i < headers.size(); i++) {
                console.log("[Header] " + headers.name(i) + ": " + headers.value(i));
            }

            // 打印请求体
            var body = request.body();
            if (body !== null) {
                var Buffer = Java.use("okio.Buffer");
                var buffer = Buffer.$new();
                body.writeTo(buffer);
                console.log("[Body] " + buffer.readUtf8());
            }

            var response = this.execute();
            console.log("[Response] Code: " + response.code());
            return response;
        };
    } catch (e) { }

    // Hook RealCall.enqueue (异步请求)
    try {
        var RealCall = Java.use("okhttp3.RealCall");
        RealCall.enqueue.implementation = function (callback) {
            var request = this.request();
            console.log("\n[OkHttp Async] " + request.method() + " " + request.url());
            return this.enqueue(callback);
        };
    } catch (e) { }
});
