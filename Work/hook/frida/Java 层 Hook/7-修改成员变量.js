Java.perform(function () {
    var TargetClass = Java.use("com.example.app.TargetClass");

    // 读取实例变量
    TargetClass.targetMethod.implementation = function () {
        console.log("[*] field1: " + this.field1.value);
        console.log("[*] field2: " + this.field2.value);

        // 修改实例变量
        this.field1.value = "modified_value";
        this.field2.value = 100;

        return this.targetMethod.apply(this, arguments);
    };

    // 读取/修改静态变量
    console.log("[*] staticField: " + TargetClass.staticField.value);
    TargetClass.staticField.value = "new_value";
});