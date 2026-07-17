// -*- coding: utf-8 -*-
/**
 * MD5、SHA1、SHA224、SHA256、SHA384、SHA512、HMAC 摘要算法实现（基于 crypto-js）
 */

var CryptoJS = require("crypto-js");


function md5(data) {
    /** MD5 摘要，返回 32 位小写十六进制字符串 */
    return CryptoJS.MD5(data).toString();
}


function sha1(data) {
    /** SHA1 摘要，返回 40 位小写十六进制字符串 */
    return CryptoJS.SHA1(data).toString();
}


function sha224(data) {
    /** SHA-224 摘要，返回 56 位小写十六进制字符串 */
    return CryptoJS.SHA224(data).toString();
}


function sha256(data) {
    /** SHA-256 摘要，返回 64 位小写十六进制字符串 */
    return CryptoJS.SHA256(data).toString();
}


function sha384(data) {
    /** SHA-384 摘要，返回 96 位小写十六进制字符串 */
    return CryptoJS.SHA384(data).toString();
}


function sha512(data) {
    /** SHA-512 摘要，返回 128 位小写十六进制字符串 */
    return CryptoJS.SHA512(data).toString();
}


function hmac_md5(key, data) {
    /** HMAC-MD5 消息认证码，返回 32 位小写十六进制字符串 */
    return CryptoJS.HmacMD5(data, key).toString();
}


function hmac_sha1(key, data) {
    /** HMAC-SHA1 消息认证码，返回 40 位小写十六进制字符串 */
    return CryptoJS.HmacSHA1(data, key).toString();
}


// ============================================================
// 测试
// ============================================================
if (require.main === module) {
    var testCases = [
        // "",
        // "hello",
        "Hello, World!",
        // "The quick brown fox jumps over the lazy dog",
    ];

    console.log("MD5 (32):");
    testCases.forEach(function (msg) {
        var h = md5(msg);
        console.log("  " + h + "  " + h.length + "  <==", JSON.stringify(msg.slice(0, 20)));
    });

    console.log("\nSHA1 (40):");
    testCases.forEach(function (msg) {
        var h = sha1(msg);
        console.log("  " + h + "  " + h.length + "  <==", JSON.stringify(msg.slice(0, 20)));
    });

    console.log("\nSHA224 (56):");
    testCases.forEach(function (msg) {
        var h = sha224(msg);
        console.log("  " + h + "  " + h.length + "  <==", JSON.stringify(msg.slice(0, 20)));
    });

    console.log("\nSHA256 (64):");
    testCases.forEach(function (msg) {
        var h = sha256(msg);
        console.log("  " + h + "  " + h.length + "  <==", JSON.stringify(msg.slice(0, 20)));
    });

    console.log("\nSHA384 (96):");
    testCases.forEach(function (msg) {
        var h = sha384(msg);
        console.log("  " + h + "  " + h.length + "  <==", JSON.stringify(msg.slice(0, 20)));
    });

    console.log("\nSHA512 (128):");
    testCases.forEach(function (msg) {
        var h = sha512(msg);
        console.log("  " + h + "  " + h.length + "  <==", JSON.stringify(msg.slice(0, 20)));
    });

    console.log('\nHMAC-MD5 (key="secret"):');
    testCases.forEach(function (msg) {
        var h = hmac_md5("secret", msg);
        console.log("  " + h + "  " + h.length + "  <==", JSON.stringify(msg.slice(0, 20)));
    });

    console.log('\nHMAC-SHA1 (key="secret"):');
    testCases.forEach(function (msg) {
        var h = hmac_sha1("secret", msg);
        console.log("  " + h + "  " + h.length + "  <==", JSON.stringify(msg.slice(0, 20)));
    });
}
