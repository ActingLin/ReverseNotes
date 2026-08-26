Java.perform(function () {
    var ContentResolver = Java.use("android.content.ContentResolver");

    // Hook query
    ContentResolver.query.overload(
        'android.net.Uri', '[Ljava.lang.String;',
        'java.lang.String', '[Ljava.lang.String;', 'java.lang.String'
    ).implementation = function (uri, projection, selection, selectionArgs, sortOrder) {
        console.log("[*] ContentResolver.query");
        console.log("    URI: " + uri);
        console.log("    Selection: " + selection);
        return this.query(uri, projection, selection, selectionArgs, sortOrder);
    };

    // Hook insert
    ContentResolver.insert.overload('android.net.Uri', 'android.content.ContentValues').implementation = function (uri, values) {
        console.log("[*] ContentResolver.insert");
        console.log("    URI: " + uri);
        console.log("    Values: " + values);
        return this.insert(uri, values);
    };

    // Hook delete
    ContentResolver.delete.overload('android.net.Uri', 'java.lang.String', '[Ljava.lang.String;').implementation = function (uri, where, selectionArgs) {
        console.log("[*] ContentResolver.delete");
        console.log("    URI: " + uri);
        console.log("    Where: " + where);
        return this.delete(uri, where, selectionArgs);
    };
});
