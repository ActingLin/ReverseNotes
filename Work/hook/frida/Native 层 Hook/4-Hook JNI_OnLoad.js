Interceptor.attach(Module.findExportByName("libnative.so", "JNI_OnLoad"), {
    onEnter: function (args) {
        console.log("[*] JNI_OnLoad called, JavaVM*: " + args[0]);
    },
    onLeave: function (retval) {
        console.log("[*] JNI_OnLoad returned JNI version: " + retval);
    }
});
