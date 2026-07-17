/**
 * DES / AES 对称加密算法实现（基于 crypto-js）
 * 依赖: npm install crypto-js
 */

var CryptoJS = require("crypto-js");


// ============================================================
// DES（CBC 模式，Pkcs7 填充）
// ============================================================

function desEncrypt(plainText, secretKey, initVector) {
    /** DES 加密，返回 base64 字符串 */
    var key = CryptoJS.enc.Utf8.parse(secretKey);
    var iv = CryptoJS.enc.Utf8.parse(initVector);
    var textToEncrypt = CryptoJS.enc.Utf8.parse(plainText);

    var encrypted = CryptoJS.DES.encrypt(textToEncrypt, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
}


function desDecrypt(cipherText, secretKey, initVector) {
    /** DES 解密，输入 base64 字符串，返回明文 */
    var key = CryptoJS.enc.Utf8.parse(secretKey);
    var iv = CryptoJS.enc.Utf8.parse(initVector);

    var decrypted = CryptoJS.DES.decrypt(cipherText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}


// ============================================================
// AES（CBC 模式，Pkcs7 填充）
// ============================================================

function aesEncrypt(plainText, secretKey, iv) {
    /** AES 加密，返回 base64 字符串 */
    var key = CryptoJS.enc.Utf8.parse(secretKey);
    var ivParam = CryptoJS.enc.Utf8.parse(iv);

    var encrypted = CryptoJS.AES.encrypt(plainText, key, {
        iv: ivParam,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
}


function aesDecrypt(cipherText, secretKey, iv) {
    /** AES 解密，输入 base64 字符串，返回明文 */
    var key = CryptoJS.enc.Utf8.parse(secretKey);
    var ivParam = CryptoJS.enc.Utf8.parse(iv);

    var decrypted = CryptoJS.AES.decrypt(cipherText, key, {
        iv: ivParam,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}


// ============================================================
// 测试
// ============================================================

if (require.main === module) {
    // ----- DES 测试 -----
    var desKey = "6f726c64f2c2057";
    var desIv = "0123456789ABCDEF";
    var desText = "I love Python!";

    var desEnc = desEncrypt(desText, desKey, desIv);
    var desDec = desDecrypt(desEnc, desKey, desIv);
    console.log("DES 加密:", desEnc);
    console.log("DES 解密:", desDec);

    console.log();

    // ----- AES 测试 -----
    var aesKey = "1234567890123456";  // 16 字节密钥
    var aesIv = "1234567890123456";   // 16 字节初始向量
    var aesText = "这是暂未被加密的原始数据...";

    var aesEnc = aesEncrypt(aesText, aesKey, aesIv);
    var aesDec = aesDecrypt(aesEnc, aesKey, aesIv);
    console.log("AES 加密:", aesEnc);
    console.log("AES 解密:", aesDec);
}