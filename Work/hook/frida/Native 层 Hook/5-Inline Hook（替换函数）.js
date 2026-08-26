// 完全替换函数实现
var targetAddr = Module.findBaseAddress("libnative.so").add(0x1234);

Interceptor.replace(targetAddr, new NativeCallback(function (arg0, arg1) {
    console.log("[*] Replaced function called");
    console.log("    arg0: " + arg0);
    console.log("    arg1: " + Memory.readUtf8String(arg1));

    // 如果需要调用原函数，保存原函数指针
    // return originalFunc(arg0, arg1);
    return ptr(0);
}, 'int', ['pointer', 'pointer']));
