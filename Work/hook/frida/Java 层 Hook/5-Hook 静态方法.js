Java.perform(function () {
    var TargetClass = Java.use("com.example.app.TargetClass");

    // 静态方法直接通过类调用
    TargetClass.staticMethod.overload('int').implementation = function (num) {
        console.log("[*] staticMethod called with: " + num);
        var result = TargetClass.staticMethod(num);
        console.log("[*] staticMethod returns: " + result);
        return result;
    };
});