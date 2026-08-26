// Java 调用栈
function printJavaStack(tag) {
    console.log("\n[*] === Java Stack Trace (" + tag + ") ===");
    console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()));
    console.log("[*] === End Stack Trace ===\n");
}

// 使用示例
Java.perform(function () {
    var Target = Java.use("com.example.app.TargetClass");
    Target.sensitiveMethod.implementation = function () {
        printJavaStack("sensitiveMethod");
        return this.sensitiveMethod.apply(this, arguments);
    };
});
