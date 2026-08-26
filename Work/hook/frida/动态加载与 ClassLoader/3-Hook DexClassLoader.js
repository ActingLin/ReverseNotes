Java.perform(function () {
    var DexClassLoader = Java.use("dalvik.system.DexClassLoader");
    DexClassLoader.$init.overload('java.lang.String', 'java.lang.String', 'java.lang.String', 'java.lang.ClassLoader')
        .implementation = function (dexPath, optimizedDirectory, librarySearchPath, parent) {
            console.log("[*] DexClassLoader loading: " + dexPath);
            this.$init(dexPath, optimizedDirectory, librarySearchPath, parent);

            // 加载完成后 hook 其中的类
            var loader = this;
            setTimeout(function () {
                Java.classFactory.loader = loader;
                try {
                    var Target = Java.use("com.dynamic.TargetClass");
                    Target.doSomething.implementation = function () {
                        console.log("[*] Dynamic class method hooked!");
                        return this.doSomething();
                    };
                } catch (e) {
                    console.log("[-] Failed to hook dynamic class: " + e);
                }
            }, 1000);
        };
});
