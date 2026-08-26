Java.perform(function () {
    var ContextWrapper = Java.use("android.content.ContextWrapper");

    // Hook startService
    ContextWrapper.startService.implementation = function (intent) {
        console.log("[*] startService: " + intent.getComponent().getClassName());
        console.log("    Action: " + intent.getAction());
        return this.startService(intent);
    };

    // Hook bindService
    ContextWrapper.bindService.implementation = function (intent, conn, flags) {
        console.log("[*] bindService: " + intent.getComponent().getClassName());
        return this.bindService(intent, conn, flags);
    };

    // Hook Service 的 onStartCommand
    var Service = Java.use("android.app.Service");
    Service.onStartCommand.implementation = function (intent, flags, startId) {
        console.log("[*] Service.onStartCommand: " + this.getClass().getName());
        if (intent !== null) {
            console.log("    Intent: " + intent.toString());
        }
        return this.onStartCommand(intent, flags, startId);
    };
});
