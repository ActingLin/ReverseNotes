Java.perform(function () {
    var HttpURLConnection = Java.use("java.net.HttpURLConnection");

    HttpURLConnection.connect.implementation = function () {
        console.log("[*] HttpURLConnection.connect: " + this.getURL().toString());
        console.log("    Method: " + this.getRequestMethod());
        this.connect();
    };

    HttpURLConnection.getOutputStream.implementation = function () {
        console.log("[*] HttpURLConnection.getOutputStream: " + this.getURL().toString());
        return this.getOutputStream();
    };

    HttpURLConnection.getInputStream.implementation = function () {
        console.log("[*] HttpURLConnection.getInputStream: " + this.getURL().toString());
        return this.getInputStream();
    };
});
