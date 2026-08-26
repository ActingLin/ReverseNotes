Java.perform(function () {
    var TargetClass = Java.use("com.example.app.TargetClass");

    // hook 构造方法
    TargetClass.$init.overload('java.lang.String').implementation = function (str) {
        console.log("[*] Constructor called with: " + str);
        this.$init(str);
    };

    // hook 无参构造
    TargetClass.$init.overload().implementation = function () {
        console.log("[*] Default constructor called");
        this.$init();
    };
});