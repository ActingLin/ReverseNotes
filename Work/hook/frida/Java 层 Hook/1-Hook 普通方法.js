Java.perform(function () {
    var TargetClass = Java.use("com.example.app.TargetClass");

    // 无参数方法
    TargetClass.getString.implementation = function () {
        var result = this.getString();
        console.log("[*] getString() => " + result);
        return result;
    };

    // 有参数方法
    TargetClass.login.overload('java.lang.String', 'java.lang.String').implementation = function (username, password) {
        console.log("[*] login called");
        console.log("    username: " + username);
        console.log("    password: " + password);
        return this.login(username, password);
    };
});