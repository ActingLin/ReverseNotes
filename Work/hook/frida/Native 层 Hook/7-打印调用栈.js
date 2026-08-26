Interceptor.attach(Module.findExportByName("libnative.so", "target_func"), {
    onEnter: function (args) {
        console.log("[*] target_func called");
        console.log(Thread.backtrace(this.context, Backtracer.ACCURATE)
            .map(DebugSymbol.fromAddress).join('\n'));
    }
});

// 或者使用 fuzzy backtracer
console.log(Thread.backtrace(this.context, Backtracer.FUZZY)
    .map(DebugSymbol.fromAddress).join('\n'));
