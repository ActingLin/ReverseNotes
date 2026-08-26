// 通过 IDA/Ghidra 找到偏移后 hook
Java.perform(function () {
    var libapp = Module.findBaseAddress("libapp.so");
    console.log("[*] libapp.so base: " + libapp);

    // IDA 中找到的目标函数偏移
    var targetFunc = libapp.add(0x123456);

    Interceptor.attach(targetFunc, {
        onEnter: function (args) {
            console.log("[*] Dart function called");
            // Dart 字符串需要特殊处理
            console.log("    arg0: " + args[0]);
        },
        onLeave: function (retval) {
            console.log("[*] Dart function returned: " + retval);
        }
    });
});
