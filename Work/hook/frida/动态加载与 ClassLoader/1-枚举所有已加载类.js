Java.perform(function () {
    // 方式1: enumerateLoadedClasses
    Java.enumerateLoadedClasses({
        onMatch: function (className) {
            if (className.includes("com.target")) {
                console.log("[*] Found: " + className);
            }
        },
        onComplete: function () {
            console.log("[*] Enumeration complete");
        }
    });
});
