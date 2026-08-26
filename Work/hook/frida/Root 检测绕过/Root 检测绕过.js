Java.perform(function () {
    console.log("[*] Root Detection Bypass loaded");

    // 1. 文件检测绕过
    var File = Java.use("java.io.File");
    File.exists.implementation = function () {
        var path = this.getAbsolutePath();
        var rootPaths = ["/system/app/Superuser.apk", "/sbin/su", "/system/bin/su",
            "/system/xbin/su", "/data/local/xbin/su", "/data/local/bin/su",
            "/system/sd/xbin/su", "/system/bin/failsafe/su", "/data/local/su",
            "/su/bin/su", "/system/xbin/busybox", "/system/bin/busybox"];

        for (var i = 0; i < rootPaths.length; i++) {
            if (path.includes(rootPaths[i])) {
                console.log("[*] Root file check bypassed: " + path);
                return false;
            }
        }
        return this.exists();
    };

    // 2. 命令执行检测绕过
    var Runtime = Java.use("java.lang.Runtime");
    Runtime.exec.overload('java.lang.String').implementation = function (cmd) {
        if (cmd.includes("su") || cmd.includes("which")) {
            console.log("[*] Root command blocked: " + cmd);
            throw Java.use("java.io.IOException").$new("Command not found");
        }
        return this.exec(cmd);
    };

    // 3. 属性检测绕过
    var SystemProperties = Java.use("android.os.SystemProperties");
    SystemProperties.get.overload('java.lang.String').implementation = function (key) {
        if (key.includes("ro.debuggable") || key.includes("ro.secure")) {
            console.log("[*] System property bypassed: " + key);
            return "0";
        }
        return this.get(key);
    };

    // 4. SafetyNet/Play Integrity 绕过（需要更复杂的实现）
    try {
        var SafetyNet = Java.use("com.google.android.gms.safetynet.SafetyNet");
        // ... 绕过逻辑
    } catch (e) { }
});
