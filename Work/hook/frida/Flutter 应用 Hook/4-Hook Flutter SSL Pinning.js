// Hook SSL_CTX_set_verify 禁用证书验证
var ssl_verify = Module.findExportByName("libflutter.so", "SSL_CTX_set_verify");
if (ssl_verify) {
    Interceptor.attach(ssl_verify, {
        onEnter: function (args) {
            console.log("[*] Flutter SSL_CTX_set_verify bypassed");
            args[1] = ptr(0); // SSL_VERIFY_NONE
        }
    });
}
