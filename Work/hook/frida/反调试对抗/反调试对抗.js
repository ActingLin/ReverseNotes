Java.perform(function () {
    console.log("[*] Anti-Debug Bypass loaded");

    // 1. 绕过 Debuggable 检测
    var ApplicationInfo = Java.use("android.content.pm.ApplicationInfo");
    ApplicationInfo.flags.value = 0;

    // 2. 绕过 ptrace 检测
    var libc = Module.findExportByName("libc.so", "ptrace");
    Interceptor.replace(libc, new NativeCallback(function (request, pid, addr, data) {
        console.log("[*] ptrace called with request: " + request);
        if (request === 0) { // PTRACE_TRACEME
            return 0; // 返回成功
        }
        return 0;
    }, 'long', ['int', 'int', 'pointer', 'pointer']));

    // 3. 绕过 TracerPid 检测
    var BufferedReader = Java.use("java.io.BufferedReader");
    BufferedReader.readLine.implementation = function () {
        var line = this.readLine();
        if (line !== null && line.includes("TracerPid")) {
            console.log("[*] TracerPid check bypassed");
            return "TracerPid:\t0";
        }
        return line;
    };

    // 4. 绕过 Frida 检测
    // 隐藏 Frida 端口
    var ServerSocket = Java.use("java.net.ServerSocket");
    ServerSocket.$init.overload('int').implementation = function (port) {
        if (port === 27042) {
            console.log("[*] Frida port 27042 hidden");
            port = 0; // 随机端口
        }
        this.$init(port);
    };

    // 5. 绕过线程名检测
    var Thread = Java.use("java.lang.Thread");
    Thread.setName.implementation = function (name) {
        if (name.includes("frida") || name.includes("gmain")) {
            console.log("[*] Thread name bypassed: " + name);
            name = "normal-thread";
        }
        return this.setName(name);
    };

    // 6. 绕过 maps 文件检测
    var FileInputStream = Java.use("java.io.FileInputStream");
    FileInputStream.$init.overload('java.lang.String').implementation = function (path) {
        if (path.includes("/proc/self/maps") || path.includes("/proc/" + Process.id + "/maps")) {
            console.log("[*] Maps file access detected, may need bypass");
        }
        this.$init(path);
    };
});
