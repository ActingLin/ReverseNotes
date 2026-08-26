Java.perform(function () {
    var libBase = Module.findBaseAddress("libnative.so");
    console.log("[*] libnative.so base: " + libBase);

    // 偏移地址需要从 IDA/Ghidra 中获取
    var targetFunc = libBase.add(0x1234);

    Interceptor.attach(targetFunc, {
        onEnter: function (args) {
            console.log("[*] Function at offset 0x1234 called");
            console.log("    arg0: " + args[0]);
            console.log("    arg1: " + Memory.readUtf8String(args[1]));
        },
        onLeave: function (retval) {
            console.log("[*] returned: " + retval);
        }
    });
});
