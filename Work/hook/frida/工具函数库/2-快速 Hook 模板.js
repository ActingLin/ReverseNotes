// Hook 单个方法并打印参数和返回值
function quickHook(className, methodName) {
    Java.perform(function () {
        var clazz = Java.use(className);
        var overloads = clazz[methodName].overloads;
        for (var i = 0; i < overloads.length; i++) {
            overloads[i].implementation = function () {
                var args = [];
                for (var j = 0; j < arguments.length; j++) {
                    args.push(arguments[j]);
                }
                console.log("[*] " + className + "." + methodName + "(" + args.join(", ") + ")");
                var result = this[methodName].apply(this, arguments);
                console.log("[*] => " + result);
                return result;
            };
        }
    });
}

// 使用: quickHook("com.example.App", "login");
