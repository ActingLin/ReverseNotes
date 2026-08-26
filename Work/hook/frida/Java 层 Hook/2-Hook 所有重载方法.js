Java.perform(function () {
    var TargetClass = Java.use("com.example.app.TargetClass");

    // 遍历所有重载
    var overloads = TargetClass.targetMethod.overloads;
    console.log("[*] Found " + overloads.length + " overloads");

    for (var i = 0; i < overloads.length; i++) {
        overloads[i].implementation = function () {
            console.log("[+] targetMethod called with " + arguments.length + " args");
            for (var j = 0; j < arguments.length; j++) {
                console.log("    arg[" + j + "]: " + arguments[j]);
            }
            return this.targetMethod.apply(this, arguments);
        };
    }
});