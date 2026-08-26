Java.perform(function () {
    var SharedPreferencesImpl = Java.use("android.app.SharedPreferencesImpl");

    SharedPreferencesImpl.getString.implementation = function (key, defValue) {
        var result = this.getString(key, defValue);
        console.log("[*] SharedPreferences.getString(\"" + key + "\") => \"" + result + "\"");
        return result;
    };

    SharedPreferencesImpl.putString.overload('java.lang.String', 'java.lang.String').implementation = function (key, value) {
        console.log("[*] SharedPreferences.putString(\"" + key + "\", \"" + value + "\")");
        return this.putString(key, value);
    };
});
