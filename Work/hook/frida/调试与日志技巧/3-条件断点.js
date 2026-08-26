Java.perform(function () {
    var Target = Java.use("com.example.app.TargetClass");
    Target.processData.overload('java.lang.String').implementation = function (data) {
        // 只在特定条件下打印
        if (data.includes("sensitive_keyword")) {
            console.log("[*] Sensitive data detected: " + data);
            printJavaStack("processData");
        }
        return this.processData(data);
    };
});

// 调用栈函数（见 调试与日志技巧/1-打印调用栈.js）
function printJavaStack(tag) {
    console.log("\n[*] === Java Stack Trace (" + tag + ") ===");
    console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()));
    console.log("[*] === End Stack Trace ===\n");
}
