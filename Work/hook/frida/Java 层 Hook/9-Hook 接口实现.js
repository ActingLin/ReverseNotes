Java.perform(function () {
    // 找到实现了接口的具体类
    var OnClickListener = Java.use("android.view.View$OnClickListener");

    // Hook 所有实现类的 onClick
    Java.choose("android.view.View$OnClickListener", {
        onMatch: function (instance) {
            console.log("[*] Found OnClickListener instance: " + instance.getClass().getName());
        },
        onComplete: function () {}
    });

    // 或者直接 hook 具体实现
    var MyActivity = Java.use("com.example.app.MainActivity");
    MyActivity.onClick.implementation = function (view) {
        console.log("[*] Button clicked: " + view.getId());
        return this.onClick(view);
    };
});