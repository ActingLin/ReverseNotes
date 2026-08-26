Java.perform(function () {
    var TargetClass = Java.use("com.example.app.TargetClass");

    // 强制返回 true
    TargetClass.isVip.implementation = function () {
        return true;
    };

    // 强制返回特定字符串
    TargetClass.getLicense.implementation = function () {
        return "PREMIUM_LICENSE_KEY";
    };

    // 修改 int 返回值
    TargetClass.getLevel.implementation = function () {
        return 999;
    };
});