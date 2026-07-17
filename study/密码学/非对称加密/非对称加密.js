/**
 * RSA 非对称加密 —— 多种模块实现对比
 * 依赖: npm install node-rsa
 * Node.js 内置 crypto 模块无需额外安装
 */

var crypto = require("crypto");
var NodeRSA = require("node-rsa");


// ============================================================
// 方案一：node-rsa 模块
// ============================================================

function rsaViaNodeRSA() {
    console.log("=== 方案一: node-rsa 模块 ===");

    // 生成密钥对
    var rsaKey = new NodeRSA({ b: 1024 });
    var publicKey = rsaKey.exportKey("pkcs8-public");
    var privateKey = rsaKey.exportKey("pkcs8-private");

    console.log("公钥 PEM:\n" + publicKey.slice(0, 80) + "...");
    console.log("私钥 PEM:\n" + privateKey.slice(0, 80) + "...");

    // 加密
    var pubInstance = new NodeRSA(publicKey, "pkcs8-public");
    // 设置加密方案为 pkcs1 (默认), 也可用 pkcs1_oaep
    var message = "Hello RSA via node-rsa!";
    var encrypted = pubInstance.encrypt(message, "base64");
    console.log("密文(base64):", encrypted);

    // 解密
    var priInstance = new NodeRSA(privateKey, "pkcs8-private");
    var decrypted = priInstance.decrypt(encrypted, "utf8");
    console.log("解密:", decrypted);

    // --- OAEP 模式 ---
    console.log("--- OAEP ---");
    var rsaKey2 = new NodeRSA({ b: 1024 });
    rsaKey2.setOptions({ encryptionScheme: "pkcs1_oaep" });
    var encOaep = rsaKey2.encrypt("Hello OAEP!", "base64");
    console.log("密文(base64):", encOaep);
    console.log("解密:", rsaKey2.decrypt(encOaep, "utf8"));
}


// ============================================================
// 方案二：Node.js 内置 crypto 模块（公钥加密 / 私钥解密）
// ============================================================

function rsaViaNativeCrypto() {
    console.log("\n=== 方案二: Node.js 内置 crypto 模块 ===");

    // 生成密钥对
    var { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 1024,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    console.log("公钥 PEM:\n" + publicKey.slice(0, 80) + "...");
    console.log("私钥 PEM:\n" + privateKey.slice(0, 80) + "...");

    // --- PKCS1_OAEP 加密 ---
    console.log("--- PKCS1_OAEP ---");
    var message = Buffer.from("Hello RSA via native crypto!");
    var encrypted = crypto.publicEncrypt(
        { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
        message
    );
    console.log("密文(base64):", encrypted.toString("base64"));

    var decrypted = crypto.privateDecrypt(
        { key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
        encrypted
    );
    console.log("解密:", decrypted.toString("utf8"));

    // --- PKCS1_v1_5 加密 ---
    console.log("--- PKCS1_v1_5 ---");
    var encryptedV15 = crypto.publicEncrypt(
        { key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
        Buffer.from("Hello PKCS1v15!")
    );
    console.log("密文(base64):", encryptedV15.toString("base64"));

    var decryptedV15 = crypto.privateDecrypt(
        { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
        encryptedV15
    );
    console.log("解密:", decryptedV15.toString("utf8"));

    // --- 签名 & 验签 ---
    console.log("--- 签名/验签 ---");
    var signMsg = Buffer.from("Important message");
    var sign = crypto.createSign("SHA256");
    sign.update(signMsg);
    sign.end();
    var signature = sign.sign(privateKey, "base64");
    console.log("签名(base64):", signature);

    var verify = crypto.createVerify("SHA256");
    verify.update(signMsg);
    verify.end();
    var isValid = verify.verify(publicKey, signature, "base64");
    console.log("验签:", isValid ? "✓ 通过" : "✗ 失败");
}


// ============================================================
// 测试入口
// ============================================================

if (require.main === module) {
    rsaViaNodeRSA();
    rsaViaNativeCrypto();
}
