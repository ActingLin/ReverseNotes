# -*- coding: utf-8 -*-
"""
@File    : python国密算法使用.py
@Author  : Elliot Lin
@Date    : 2026/7/16 17:00
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
# pip install gmssl
from gmssl import sm2, sm3, sm4, func

"""sm2 加密解密"""
private_key = '00B9AB0B828FF68872F21A837FC303668428DEA11DCD1B24429D0C99E24EED83D5'
public_key = 'B9C9A6E04E9C91F7BA880429273747D7EF5DDEB0BB2FF6317EB00BEF331A83081A6994B8993F3F5D6EADDDB81872266C87C018FB4162F5AF347B483E24620207'
sm2_crypt = sm2.CryptSM2(public_key=public_key, private_key=private_key)

# 待加密数据和加密后数据为 bytes 类型
data = b"Hello, SM2!"
enc_data = sm2_crypt.encrypt(data)
dec_data = sm2_crypt.decrypt(enc_data)

print('sm2-加密数据: ', enc_data.hex())
print('sm2-解密数据: ', dec_data)

print('\n', end='')

"""sm3 哈希算法"""
data = b"Hello, SM3!"
hash_data = sm3.sm3_hash(func.bytes_to_list(data))  # 将数据转换为列表并进行哈希运算
print('sm3-哈希数据: ', hash_data)

print('\n', end='')

"""sm4 对称加密算法"""
sm4_crypt = sm4.CryptSM4()
key = b'0123456789ABCDEF0123456789ABCDEF'
sm4_crypt.set_key(key, sm4.SM4_ENCRYPT)  # 设置密钥
data = b"Hello, SM4!"  # 要加密的数据
ciphertext = sm4_crypt.crypt_ecb(func.bytes_to_list(data))  # 将数据转换为列表并进行加密运算
encrypted_data = bytes(func.list_to_bytes(ciphertext))  # 将加密后的数据转换为 bytes 类型
sm4_crypt.set_key(key, sm4.SM4_DECRYPT)  # 解密数据
decrypted_data = sm4_crypt.crypt_ecb(ciphertext)
decrypted_data = bytes(func.list_to_bytes(decrypted_data))

print("sm4-原始数据:", data.decode("utf-8"))
print("sm4-加密后的数据:", encrypted_data.hex())
print("sm4-解密后的数据:", decrypted_data.decode("utf-8"))
