// Hook 导出的 native 函数
Interceptor.attach(Module.findExportByName("libnative.so", "native_function"), {
    onEnter: function (args) {
        console.log("[*] native_function called");
        // args[0] 是 JNINIEnv*，args[1] 是 jobject/jclass
        console.log("    arg2: " + args[2]);
        console.log("    arg2 (int): " + args[2].toInt32());

        // 读取 C 字符串
        if (!args[3].isNull()) {
            console.log("    arg3 (string): " + Memory.readUtf8String(args[3]));
        }
    },
    onLeave: function (retval) {
        console.log("[*] native_function returned: " + retval);
        // 修改返回值
        // retval.replace(ptr(0x1));
    }
});
