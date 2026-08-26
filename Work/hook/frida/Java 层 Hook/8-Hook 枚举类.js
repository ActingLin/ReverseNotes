Java.perform(function () {
    var EnumClass = Java.use("com.example.app.StatusEnum");

    // 获取枚举值
    var values = EnumClass.values();
    console.log("[*] Enum values:");
    for (var i = 0; i < values.length; i++) {
        console.log("    " + values[i].toString());
    }

    // Hook 枚举方法
    EnumClass.valueOf.overload('java.lang.String').implementation = function (name) {
        console.log("[*] valueOf called with: " + name);
        return this.valueOf(name);
    };
});