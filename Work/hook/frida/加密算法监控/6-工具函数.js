// 加密算法监控所需的工具函数
// 使用方式: 把下面的函数复制到你的 hook 脚本中即可

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

function hexToBytes(hex) {
    var bytes = [];
    for (var i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return bytes;
}

function printStack() {
    console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()));
}
