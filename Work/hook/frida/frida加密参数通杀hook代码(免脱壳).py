import frida  # 导入frida模块
import sys  # 导入sys模块

jscode = """
function showStacks() {
    Java.perform(function() {
        send(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()));
        var kgh = Java.use("com.kc.openset.util.VerifyUtil");
            kgh.getMD5Verify.overload('java.lang.String','java.lang.String').implementation = function (x1,x2) {
                console.log("getMD5Verify x1:",x1);
                console.log("getMD5Verify x2:",x2);
                var result = this.getMD5Verify(x1,x2);
                    console.log(result);
                    return result;


                }
    });
}

function bytesToHex(arr) {
    var str = "";
    for (var i = 0; i < arr.length; i++) {
        var tmp = arr[i];
        if (tmp < 0) {
            tmp = (255 + tmp + 1).toString(16);
        } else {
            tmp = tmp.toString(16);
        }
        if (tmp.length == 1) {
            tmp = "0" + tmp;
        }
        str += tmp;
    }
    return str;
}
function bytesToBase64(e) {
    var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var r, a, c, h, o, t;
    for (c = e.length, a = 0, r = ''; a < c;) {
        if (h = 255 & e[a++], a == c) {
            r += base64EncodeChars.charAt(h >> 2),
            r += base64EncodeChars.charAt((3 & h) << 4),
            r += '==';
            break
        }
        if (o = e[a++], a == c) {
            r += base64EncodeChars.charAt(h >> 2),
            r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
            r += base64EncodeChars.charAt((15 & o) << 2),
            r += '=';
            break
        }
        t = e[a++],
        r += base64EncodeChars.charAt(h >> 2),
        r += base64EncodeChars.charAt((3 & h) << 4 | (240 & o) >> 4),
        r += base64EncodeChars.charAt((15 & o) << 2 | (192 & t) >> 6),
        r += base64EncodeChars.charAt(63 & t)
    }
    return r
}
function bytesToString(arr) {
    if (typeof arr === 'string') {
        return arr;
    }
    var str = '',
    _arr = arr;
    for (var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2),
        v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_arr[i]);
        }
    }
    return str;
}

Java.perform(function () {
    var secretKeySpec = Java.use('javax.crypto.spec.SecretKeySpec');
    secretKeySpec.$init.overload('[B','java.lang.String').implementation = function (a,b) {
        showStacks();
        var result = this.$init(a, b);
        send("======================================");
        send("算法名：" + b + "|Dec密钥:" + bytesToString(a));
        send("算法名：" + b + "|Hex密钥:" + bytesToHex(a));
        return result;
    }
    var mac = Java.use('javax.crypto.Mac');
    mac.getInstance.overload('java.lang.String').implementation = function (a) {
        showStacks();
        var result = this.getInstance(a);
        send("======================================");
        send("算法名：" + a);
        return result;
    }
    mac.update.overload('[B').implementation = function (a) {
        showStacks();
        this.update(a);
        send("======================================");
        send("update:" + bytesToString(a))
    }
    mac.update.overload('[B','int','int').implementation = function (a,b,c) {
        showStacks();
        this.update(a,b,c)
        send("======================================");
        send("update:" + bytesToString(a) + "|" + b + "|" + c);
    }
    mac.doFinal.overload().implementation = function () {
        showStacks();
        var result = this.doFinal();
        send("======================================");
        send("doFinal结果(hex):" + bytesToHex(result));
        send("doFinal结果(base64):" + bytesToBase64(result));
        return result;
    }
    mac.doFinal.overload('[B').implementation = function (a) {
        showStacks();
        var result = this.doFinal(a);
        send("======================================");
        send("doFinal参数:" + bytesToString(a));
        send("doFinal结果(hex):" + bytesToHex(result));
        send("doFinal结果(base):" + bytesToBase64(result));
        return result;
    }
        var md = Java.use('java.security.MessageDigest');
    md.getInstance.overload('java.lang.String','java.lang.String').implementation = function (a,b) {
        showStacks();
        send("======================================");
        send("算法名：" + a);
        return this.getInstance(a, b);
    }
    md.getInstance.overload('java.lang.String').implementation = function (a) {
        showStacks();
        send("======================================");
        send("算法名：" + a);
        return this.getInstance(a);
    }
    md.update.overload('[B').implementation = function (a) {
        showStacks();
        send("======================================");
        send("update:" + bytesToString(a))
        return this.update(a);
    }
    md.update.overload('[B','int','int').implementation = function (a,b,c) {
        showStacks();
        send("======================================");
        send("update:" + bytesToString(a) + "|" + b + "|" + c);
        return this.update(a,b,c);
    }
    md.digest.overload().implementation = function () {
        showStacks();
        send("======================================");
        var result = this.digest();
        send("digest结果(hex):" + bytesToHex(result));
        send("digest结果(base64):" + bytesToBase64(result));
        return result;
    }
    md.digest.overload('[B').implementation = function (a) {
        showStacks();
        send("======================================");
        send("digest参数:" + bytesToString(a));
        var java_string = Java.use("java.lang.String");
        console.log('bArr to string: ' + java_string.$new(a));
        console.log(bytesToString(a));
        var result = this.digest(a);
        send("digest结果(hex):" + bytesToHex(result));
        send("digest结果(base64):" + bytesToBase64(result));
        return result;
    }
        var ivParameterSpec = Java.use('javax.crypto.spec.IvParameterSpec');
    ivParameterSpec.$init.overload('[B').implementation = function (a) {
        showStacks();
        var result = this.$init(a);
        send("======================================");
        send("iv向量:" + bytesToString(a));
        send("iv向量(hex):" + bytesToHex(a));
        return result;
    }
    var cipher = Java.use('javax.crypto.Cipher');
    cipher.getInstance.overload('java.lang.String').implementation = function (a) {
        showStacks();
        var result = this.getInstance(a);
        send("======================================");
        send("模式填充:" + a);
        return result;
    }
    cipher.update.overload('[B').implementation = function (a) {
        showStacks();
        var result = this.update(a);
        send("======================================");
        send("update:" + bytesToString(a));
        return result;
    }
    cipher.update.overload('[B','int','int').implementation = function (a,b,c) {
        showStacks();
        var result = this.update(a,b,c);
        send("======================================");
        send("update:" + bytesToString(a) + "|" + b + "|" + c);
        return result;
    }
    cipher.doFinal.overload().implementation = function () {
        showStacks();
        var result = this.doFinal();
        send("======================================");
        send("doFinal结果(hex):" + bytesToHex(result));
        send("doFinal结果(base64):" + bytesToBase64(result));
        return result;
    }
    cipher.doFinal.overload('[B').implementation = function (a) {
        showStacks();
        var result = this.doFinal(a);
        send("======================================");
        send("doFinal参数:" + bytesToString(a));
        send("doFinal结果(hex):" + bytesToHex(result));
        send("doFinal结果(base64):" + bytesToBase64(result));
        return result;
    }
    var x509EncodedKeySpec = Java.use('java.security.spec.X509EncodedKeySpec');
    x509EncodedKeySpec.$init.overload('[B').implementation = function (a) {
        showStacks();
        var result = this.$init(a);
        send("======================================");
        send("RSA密钥:" + bytesToBase64(a));
        return result;
    }
    var rSAPublicKeySpec = Java.use('java.security.spec.RSAPublicKeySpec');
    rSAPublicKeySpec.$init.overload('java.math.BigInteger','java.math.BigInteger').implementation = function (a,b) {
        showStacks();
        var result = this.$init(a,b);
        send("======================================");
        //send("RSA密钥:" + bytesToBase64(a));
        send("RSA密钥N:" + a.toString(16));
        send("RSA密钥E:" + b.toString(16));
        return result;
    }
});
"""


def on_message(message, data):  # js中执行send函数后要回调的函数
    if message["type"] == "send":
        print("[*] {0}".format(message["payload"]))
    else:
        print(message)


process = frida.get_usb_device().attach('app名')  # app名
script = process.create_script(jscode)  # 创建js脚本
script.on('message', on_message)  # 加载回调函数，也就是js中执行send函数规定要执行的python函数
script.load()  # 加载脚本
sys.stdin.read()