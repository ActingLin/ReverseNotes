Java.perform(function () {
    // Hook Context.sendBroadcast
    var ContextWrapper = Java.use("android.content.ContextWrapper");
    ContextWrapper.sendBroadcast.overload('android.content.Intent').implementation = function (intent) {
        console.log("[*] sendBroadcast: " + intent.getAction());
        console.log("    Extras: " + intent.getExtras());
        return this.sendBroadcast(intent);
    };

    // 方式2: 枚举所有 BroadcastReceiver 并 hook onReceive
    Java.enumerateLoadedClasses({
        onMatch: function (className) {
            if (className.includes("Receiver")) {
                try {
                    var clazz = Java.use(className);
                    clazz.onReceive.implementation = function (context, intent) {
                        console.log("[*] BroadcastReceiver: " + className);
                        console.log("    Action: " + intent.getAction());
                        this.onReceive(context, intent);
                    };
                } catch (e) { }
            }
        },
        onComplete: function () { }
    });
});
