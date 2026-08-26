Java.perform(function () {
    // 注意：内部类用 $ 分隔
    var InnerClass = Java.use("com.example.app.OuterClass$InnerClass");

    InnerClass.innerMethod.implementation = function () {
        console.log("[*] Inner class method called");
        return this.innerMethod.apply(this, arguments);
    };

    // 匿名内部类（可能有数字后缀）
    var AnonymousClass = Java.use("com.example.app.OuterClass$1");
    AnonymousClass.run.implementation = function () {
        console.log("[*] Anonymous class run() called");
        return this.run();
    };
});