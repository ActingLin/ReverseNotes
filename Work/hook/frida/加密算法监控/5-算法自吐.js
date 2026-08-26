// 算法自吐脚本 - 监控 Java 层所有加密相关调用
Java.perform(function () {
    console.log("[*] Algorithm Monitor started");

    // 1. Cipher
    var Cipher = Java.use("javax.crypto.Cipher");
    Cipher.getInstance.overload('java.lang.String').implementation = function (transformation) {
        console.log("\n[Cipher] getInstance: " + transformation);
        return this.getInstance(transformation);
    };

    // 2. SecretKeySpec
    var SecretKeySpec = Java.use("javax.crypto.spec.SecretKeySpec");
    SecretKeySpec.$init.overload('[B', 'java.lang.String').implementation = function (key, algo) {
        console.log("[KeySpec] Algorithm: " + algo + " | Key: " + bytesToHex(key));
        this.$init(key, algo);
    };

    // 3. MessageDigest
    var MessageDigest = Java.use("java.security.MessageDigest");
    MessageDigest.getInstance.overload('java.lang.String').implementation = function (algo) {
        console.log("[Digest] getInstance: " + algo);
        return this.getInstance(algo);
    };

    // 4. Mac
    var Mac = Java.use("javax.crypto.Mac");
    Mac.getInstance.overload('java.lang.String').implementation = function (algo) {
        console.log("[HMAC] getInstance: " + algo);
        return this.getInstance(algo);
    };

    // 5. Signature
    var Signature = Java.use("java.security.Signature");
    Signature.getInstance.overload('java.lang.String').implementation = function (algo) {
        console.log("[Signature] getInstance: " + algo);
        return this.getInstance(algo);
    };

    // 6. KeyGenerator
    var KeyGenerator = Java.use("javax.crypto.KeyGenerator");
    KeyGenerator.getInstance.overload('java.lang.String').implementation = function (algo) {
        console.log("[KeyGen] getInstance: " + algo);
        return this.getInstance(algo);
    };
});

// 依赖工具函数: bytesToHex（见 加密算法监控/6-工具函数.js）
function bytesToHex(bytes) {
    if (bytes === null || bytes === undefined) return "null";
    var hex = [];
    for (var i = 0; i < bytes.length; i++) {
        hex.push(('0' + (bytes[i] & 0xFF).toString(16)).slice(-2));
    }
    return hex.join('');
}
