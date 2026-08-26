Java.perform(function () {
    // AES/DES 加密
    var Cipher = Java.use("javax.crypto.Cipher");

    Cipher.doFinal.overload('[B').implementation = function (input) {
        var algorithm = this.getAlgorithm();
        console.log("\n[*] Cipher.doFinal - Algorithm: " + algorithm);
        console.log("    Input: " + bytesToHex(input));

        var result = this.doFinal(input);
        console.log("    Output: " + bytesToHex(result));
        return result;
    };

    // 监控密钥
    var SecretKeySpec = Java.use("javax.crypto.spec.SecretKeySpec");
    SecretKeySpec.$init.overload('[B', 'java.lang.String').implementation = function (keyBytes, algorithm) {
        console.log("\n[*] SecretKeySpec created");
        console.log("    Algorithm: " + algorithm);
        console.log("    Key: " + bytesToHex(keyBytes));
        this.$init(keyBytes, algorithm);
    };

    // 监控 IV
    var IvParameterSpec = Java.use("javax.crypto.spec.IvParameterSpec");
    IvParameterSpec.$init.overload('[B').implementation = function (ivBytes) {
        console.log("[*] IV: " + bytesToHex(ivBytes));
        this.$init(ivBytes);
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
