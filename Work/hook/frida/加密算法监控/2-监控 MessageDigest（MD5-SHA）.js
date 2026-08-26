Java.perform(function () {
    var MessageDigest = Java.use("java.security.MessageDigest");

    MessageDigest.digest.overload('[B').implementation = function (input) {
        var algorithm = this.getAlgorithm();
        console.log("\n[*] MessageDigest.digest - Algorithm: " + algorithm);
        console.log("    Input: " + bytesToString(input));
        console.log("    Input Hex: " + bytesToHex(input));

        var result = this.digest(input);
        console.log("    Output: " + bytesToHex(result));
        return result;
    };

    MessageDigest.update.overload('[B').implementation = function (input) {
        console.log("[*] MessageDigest.update: " + bytesToString(input));
        return this.update(input);
    };
});

// 依赖工具函数: bytesToHex / bytesToString（见 加密算法监控/6-工具函数.js）
function bytesToHex(bytes) {
    if (bytes === null || bytes === undefined) return "null";
    var hex = [];
    for (var i = 0; i < bytes.length; i++) {
        hex.push(('0' + (bytes[i] & 0xFF).toString(16)).slice(-2));
    }
    return hex.join('');
}

function bytesToString(bytes) {
    if (bytes === null || bytes === undefined) return "null";
    try {
        return Java.use("java.lang.String").$new(bytes, "UTF-8");
    } catch (e) {
        return bytesToHex(bytes);
    }
}
