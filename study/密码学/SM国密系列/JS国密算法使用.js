// npm install sm-crypto
const sm2 = require('sm-crypto').sm2;
const sm3 = require('sm-crypto').sm3;
const sm4 = require('sm-crypto').sm4;
const {Buffer} = require('buffer');

// 1. SM2 密钥生成与加解密
const keyPair = sm2.generateKeyPairHex(); // 生成密钥对
const publicKey = keyPair.publicKey; // 04 开头的压缩公钥
const privateKey = keyPair.privateKey; // 64 位私钥

const sm2PlainText = 'Hello, SM2!';
const sm2EncryptedData = sm2.doEncrypt(sm2PlainText, publicKey); // 加密
const sm2DecryptedData = sm2.doDecrypt(sm2EncryptedData, privateKey); // 解密

console.log('SM2 公钥:', publicKey);
console.log('SM2 私钥:', privateKey);
console.log('SM2 加密结果:', sm2EncryptedData);
console.log('SM2 解密结果:', sm2DecryptedData);

// 2. SM3 哈希
const sm3Message = 'Hello, SM3!';
const hashValue = sm3(sm3Message);
console.log('SM3 哈希:', hashValue);

// 3. SM4 加解密
const sm4Key = '0123456789abcdeffedcba9876543210'; // 16字节密钥
const sm4Iv = '00000000000000000000000000000000';  // 16字节初始向量
const sm4PlainText = 'Hello, SM4!';

// CBC 模式加密
const sm4Cipher = sm4.encrypt(
    Buffer.from(sm4PlainText),
    Buffer.from(sm4Key, 'hex'),
    {iv: Buffer.from(sm4Iv, 'hex')}
);

// CBC 模式解密
const sm4Decipher = sm4.decrypt(
    sm4Cipher,
    Buffer.from(sm4Key, 'hex'),
    {iv: Buffer.from(sm4Iv, 'hex')}
);

console.log('SM4 加密结果:', sm4Cipher.toString('hex'));
console.log('SM4 解密结果:', sm4Decipher.toString());