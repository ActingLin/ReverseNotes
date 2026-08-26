Java.perform(function () {
    var Target = Java.use("com.example.app.TargetClass");
    Target.slowMethod.implementation = function () {
        var start = Date.now();
        var result = this.slowMethod.apply(this, arguments);
        var elapsed = Date.now() - start;
        console.log("[*] slowMethod took " + elapsed + "ms");
        return result;
    };
});
