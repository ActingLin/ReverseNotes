Java.perform(function () {
    // Hook startActivity
    var Instrumentation = Java.use("android.app.Instrumentation");
    Instrumentation.execStartActivity.overload(
        'android.content.Context', 'android.content.Context',
        'android.os.IBinder', 'android.os.IBinder',
        'android.app.Activity', 'android.content.Intent',
        'int', 'android.os.Bundle'
    ).implementation = function (who, context, token, target, activity, intent, requestCode, options) {
        console.log("[*] startActivity: " + intent.getComponent().getClassName());
        console.log("    Action: " + intent.getAction());
        console.log("    Data: " + intent.getDataString());
        return this.execStartActivity(who, context, token, target, activity, intent, requestCode, options);
    };

    // Hook Activity 生命周期
    var Activity = Java.use("android.app.Activity");
    Activity.onCreate.overload('android.os.Bundle').implementation = function (savedInstanceState) {
        console.log("[*] Activity.onCreate: " + this.getClass().getName());
        this.onCreate(savedInstanceState);
    };

    Activity.onResume.implementation = function () {
        console.log("[*] Activity.onResume: " + this.getClass().getName());
        this.onResume();
    };
});
