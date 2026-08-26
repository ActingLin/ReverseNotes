Java.perform(function () {
    // 枚举所有 ClassLoader
    Java.enumerateClassLoaders({
        onMatch: function (loader) {
            try {
                // 尝试加载目标类
                var targetClass = loader.loadClass("com.example.app.TargetClass");
                if (targetClass !== null) {
                    console.log("[+] Found class in loader: " + loader);

                    // 切换到这个 ClassLoader
                    Java.classFactory.loader = loader;

                    // 现在可以 hook 这个类了
                    var Target = Java.use("com.example.app.TargetClass");
                    Target.secretMethod.implementation = function () {
                        console.log("[*] secretMethod called!");
                        return this.secretMethod.apply(this, arguments);
                    };
                }
            } catch (e) {
                // 这个 loader 找不到目标类，继续
            }
        },
        onComplete: function () {
            console.log("[*] ClassLoader enumeration complete");
        }
    });
});
