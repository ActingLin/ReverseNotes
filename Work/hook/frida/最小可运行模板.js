// template_minimal.js
Java.perform(function () {
    console.log("[*] Frida script loaded");

    var TargetClass = Java.use("com.example.app.TargetClass");

    TargetClass.targetMethod.implementation = function () {
        console.log("[+] targetMethod called");
        return this.targetMethod.apply(this, arguments);
    };
});