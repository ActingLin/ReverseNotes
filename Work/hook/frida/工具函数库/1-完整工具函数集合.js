// ==================== 工具函数库 ====================

// 字节转十六进制
function bytesToHex(bytes) {
    if (bytes === null || bytes === undefined) return "null";
    var hex = [];
    for (var i = 0; i < bytes.length; i++) {
        hex.push(('0' + (bytes[i] & 0xFF).toString(16)).slice(-2));
    }
    return hex.join('');
}

// 十六进制转字节
function hexToBytes(hex) {
    var bytes = [];
    for (var i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return bytes;
}

// 字节转字符串
function bytesToString(bytes) {
    if (bytes === null || bytes === undefined) return "null";
    try {
        return Java.use("java.lang.String").$new(bytes, "UTF-8");
    } catch (e) {
        return bytesToHex(bytes);
    }
}

// 打印 Java 调用栈
function printStack(tag) {
    tag = tag || "";
    console.log("\n[*] === Stack Trace (" + tag + ") ===");
    console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()));
    console.log("[*] === End Stack ===\n");
}

// 打印对象所有字段
function dumpObject(obj) {
    var clazz = obj.getClass();
    console.log("[*] Dumping object of class: " + clazz.getName());
    var fields = clazz.getDeclaredFields();
    for (var i = 0; i < fields.length; i++) {
        fields[i].setAccessible(true);
        try {
            var value = fields[i].get(obj);
            console.log("    " + fields[i].getName() + " = " + value);
        } catch (e) {
            console.log("    " + fields[i].getName() + " = [Error reading]");
        }
    }
}

// 打印类所有方法
function dumpMethods(className) {
    Java.perform(function () {
        var clazz = Java.use(className);
        var methods = clazz.class.getDeclaredMethods();
        console.log("[*] Methods of " + className + ":");
        for (var i = 0; i < methods.length; i++) {
            console.log("    " + methods[i].toString());
        }
    });
}

// 格式化 JSON 输出
function prettyJSON(obj) {
    return JSON.stringify(obj, null, 2);
}

// 获取当前时间戳
function getTimestamp() {
    return new Date().toISOString();
}

// 延迟执行
function delay(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
