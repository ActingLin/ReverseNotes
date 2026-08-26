Java.perform(function () {
    // RSA 公钥加密
    var Cipher = Java.use("javax.crypto.Cipher");

    Cipher.doFinal.overload('[B').implementation = function (input) {
        var algorithm = this.getAlgorithm();
        if (algorithm.indexOf("RSA") !== -1) {
            console.log("\n[*] RSA Cipher.doFinal");
            console.log("    Algorithm: " + algorithm);
            console.log("    Input: " + bytesToHex(input));

            // 获取密钥信息
            var key = this.getKey();
            if (key !== null) {
                console.log("    Key format: " + key.getFormat());
                console.log("    Key encoded: " + bytesToHex(key.getEncoded()));
            }
        }
        return this.doFinal(input);
    };

    // 监控 KeyPairGenerator
    var KeyPairGenerator = Java.use("java.security.KeyPairGenerator");
    KeyPairGenerator.generateKeyPair.implementation = function () {
        var keyPair = this.generateKeyPair();
        var publicKey = keyPair.getPublic();
        var privateKey = keyPair.getPrivate();
        console.log("\n[*] KeyPair generated");
        console.log("    Public Key: " + bytesToHex(publicKey.getEncoded()));
        console.log("    Private Key: " + bytesToHex(privateKey.getEncoded()));
        return keyPair;
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
