Java.perform(function () {
    var Mac = Java.use("javax.crypto.Mac");

    Mac.doFinal.overload('[B').implementation = function (input) {
        var algorithm = this.getAlgorithm();
        console.log("\n[*] HMAC.doFinal - Algorithm: " + algorithm);
        console.log("    Input: " + bytesToHex(input));
        console.log("    Key: " + bytesToHex(this.getEncoded()));

        var result = this.doFinal(input);
        console.log("    Output: " + bytesToHex(result));
        return result;
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
