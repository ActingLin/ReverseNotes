// Hook SSL_CTX_set_verify 禁用证书验证
Interceptor.attach(Module.findExportByName("libssl.so", "SSL_CTX_set_verify"), {
    onEnter: function (args) {
        console.log("[*] SSL_CTX_set_verify called, mode: " + args[1].toInt32());
        // 设置为 SSL_VERIFY_NONE (0)
        args[1] = ptr(0);
    }
});

// Hook SSL_get_peer_certificate 获取证书信息
Interceptor.attach(Module.findExportByName("libssl.so", "SSL_get_peer_certificate"), {
    onLeave: function (retval) {
        console.log("[*] SSL_get_peer_certificate returned: " + retval);
    }
});
