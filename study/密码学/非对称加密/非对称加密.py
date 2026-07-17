# -*- coding: utf-8 -*-
"""
RSA 非对称加密 —— 多种模块实现对比
依赖: pip install rsa pycryptodome cryptography
"""

import base64


# ============================================================
# 方案一：rsa 模块（纯 Python 实现）
# ============================================================

def rsa_via_rsa_module():
    import rsa

    print('=== 方案一: rsa 模块 ===')

    # 生成密钥对
    public_key, private_key = rsa.newkeys(1024)
    print(f'公钥(n={public_key.n})')
    print(f'私钥(d={private_key.d})')

    # 加密
    message = b'Hello RSA via rsa module!'
    encrypted = rsa.encrypt(message, public_key)
    encrypted_b64 = base64.b64encode(encrypted).decode()
    print(f'密文(base64): {encrypted_b64}')

    # 解密
    decrypted = rsa.decrypt(base64.b64decode(encrypted_b64), private_key)
    print(f'解密: {decrypted.decode()}')


# ============================================================
# 方案二：pycryptodome 模块（C 扩展，速度快）
# ============================================================

def rsa_via_pycryptodome():
    from Crypto.PublicKey import RSA
    from Crypto.Cipher import PKCS1_v1_5, PKCS1_OAEP
    from Crypto.Hash import SHA256

    print('\n=== 方案二: pycryptodome ===')

    # 生成密钥对
    key = RSA.generate(1024)
    private_key = key.export_key()
    public_key = key.publickey().export_key()

    pub_key_obj = RSA.import_key(public_key)
    pri_key_obj = RSA.import_key(private_key)

    # --- PKCS1_v1_5 模式 ---
    print('--- PKCS1_v1_5 ---')
    cipher_v1 = PKCS1_v1_5.new(pub_key_obj)
    message = b'Hello RSA via pycryptodome!'
    encrypted = cipher_v1.encrypt(message)
    encrypted_b64 = base64.b64encode(encrypted).decode()
    print(f'密文(base64): {encrypted_b64}')

    decipher_v1 = PKCS1_v1_5.new(pri_key_obj)
    decrypted = decipher_v1.decrypt(encrypted, None)
    assert decrypted is not None, 'PKCS1_v1_5 解密失败'
    print(f'解密: {decrypted.decode()}')

    # --- PKCS1_OAEP 模式（推荐）---
    print('--- PKCS1_OAEP ---')
    cipher_oaep = PKCS1_OAEP.new(pub_key_obj, hashAlgo=SHA256)
    encrypted_oaep = cipher_oaep.encrypt(b'Hello OAEP!')
    print(f'密文(base64): {base64.b64encode(encrypted_oaep).decode()}')

    decipher_oaep = PKCS1_OAEP.new(pri_key_obj, hashAlgo=SHA256)
    decrypted_oaep = decipher_oaep.decrypt(encrypted_oaep)
    print(f'解密: {decrypted_oaep.decode()}')

    # --- 分段加密（超长明文）---
    print('--- 分段加解密 ---')
    long_msg = b'A' * 200
    # 用公钥分段加密
    chunk_size = 117  # 1024-bit key 最多加密 117 字节（PKCS1_v1_5）
    encrypted_chunks = []
    for i in range(0, len(long_msg), chunk_size):
        chunk = long_msg[i:i + chunk_size]
        encrypted_chunks.append(cipher_v1.encrypt(chunk))
    encrypted_long = b''.join(encrypted_chunks)
    print(f'分段密文长度: {len(encrypted_long)} bytes')

    # 私钥分段解密
    chunk_size_enc = 128  # 1024-bit 密文块 128 字节
    decrypted_long = b''
    for i in range(0, len(encrypted_long), chunk_size_enc):
        chunk = encrypted_long[i:i + chunk_size_enc]
        decrypted_chunk = decipher_v1.decrypt(chunk, None)
        assert decrypted_chunk is not None
        decrypted_long += decrypted_chunk
    print(f'分段解密: {decrypted_long[:50].decode()}...')


# ============================================================
# 方案三：cryptography 模块（现代化，推荐）
# ============================================================

def rsa_via_cryptography():
    from cryptography.hazmat.primitives.asymmetric import rsa, padding
    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.backends import default_backend

    print('\n=== 方案三: cryptography 模块 ===')

    # 生成密钥对
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=1024,
        backend=default_backend(),
    )
    public_key = private_key.public_key()

    # 导出 PEM 格式
    pri_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )
    pub_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )
    print(f'公钥 PEM:\n{pub_pem.decode()[:80]}...')
    print(f'私钥 PEM:\n{pri_pem.decode()[:80]}...')

    # --- OAEP + SHA256 加密 ---
    message = b'Hello RSA via cryptography!'
    encrypted = public_key.encrypt(
        message,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None,
        ),
    )
    encrypted_b64 = base64.b64encode(encrypted).decode()
    print(f'密文(base64): {encrypted_b64}')

    # 解密
    decrypted = private_key.decrypt(
        encrypted,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None,
        ),
    )
    print(f'解密: {decrypted.decode()}')

    # --- PKCS1v15 加密 ---
    print('--- PKCS1v15 ---')
    encrypted_v15 = public_key.encrypt(b'Hello PKCS1v15!', padding.PKCS1v15())
    print(f'密文(base64): {base64.b64encode(encrypted_v15).decode()}')

    decrypted_v15 = private_key.decrypt(encrypted_v15, padding.PKCS1v15())
    print(f'解密: {decrypted_v15.decode()}')

    # --- 签名 & 验签 ---
    print('--- 签名/验签 ---')
    sign_msg = b'Important message'
    signature = private_key.sign(
        sign_msg,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH,
        ),
        hashes.SHA256(),
    )
    print(f'签名(base64): {base64.b64encode(signature).decode()}')

    # 验签
    try:
        public_key.verify(
            signature,
            sign_msg,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH,
            ),
            hashes.SHA256(),
        )
        print('验签: ✓ 通过')
    except Exception:
        print('验签: ✗ 失败')


# ============================================================
# 测试入口
# ============================================================

if __name__ == '__main__':
    # rsa_via_rsa_module()
    rsa_via_pycryptodome()
    rsa_via_cryptography()
