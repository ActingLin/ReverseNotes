Java.perform(function () {
    // Hook RegisterNatives（查看动态注册的 JNI 方法）
    var RegisterNatives = Module.findExportByName("libart.so", "artRegisterNatives");

    Interceptor.attach(RegisterNatives, {
        onEnter: function (args) {
            var className = Memory.readUtf8String(args[1]);
            var methodName = Memory.readUtf8String(args[2]);
            var signature = Memory.readUtf8String(args[3]);
            var fnPtr = args[4];
            console.log("[*] RegisterNatives: " + className + "." + methodName + signature + " => " + fnPtr);
        }
    });
});
