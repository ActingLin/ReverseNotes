# -*- coding: utf-8 -*-
"""
@File    : solve.py
@Author  : Elliot Lin
@Date    : 2026/2/1 21:42
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""

import gzip
from Crypto.Cipher import DES
import zlib
import lz4.block

def unpad_pkcs7(data):
    """安全移除 PKCS7 填充（兼容 DES 块大小=8）"""
    pad_len = data[-1]
    if 1 <= pad_len <= 8 and all(b == pad_len for b in data[-pad_len:]):
        return data[:-pad_len]
    return data  # 无有效填充时原样返回（防御性）

# ===== Stage 1: GZIP → DES(key1) → ZLIB =====
with open('data.bin', 'rb') as f:
    data = gzip.decompress(f.read())

part1 = data[:8]
print("part1 =", part1)  # b'DE5_c0mp'
data = DES.new(part1, DES.MODE_ECB).decrypt(data[8:])
data = unpad_pkcs7(data)
data = zlib.decompress(data)

# ===== Stage 2: DES(key2) → LZ4 =====
part2 = data[:8]
print("part2 =", part2)  # b'r355_m@y'
data = DES.new(part2, DES.MODE_ECB).decrypt(data[8:])
data = unpad_pkcs7(data)

# LZ4 解压：指定足够大的缓冲区（Android 用 length*5）
try:
    data = lz4.block.decompress(data, uncompressed_size=len(data) * 5)
except Exception as e:
    print(f"[!] LZ4 decompress failed: {e}")
    # 尝试无大小参数（部分 LZ4 block 可自动识别）
    data = lz4.block.decompress(data)

# ===== Stage 3: DES(key3) → PNG =====
part3 = data[:8]
print("part3 =", part3)  # 应为 b'_c0nfu53'
data = DES.new(part3, DES.MODE_ECB).decrypt(data[8:])
data = unpad_pkcs7(data)

# ===== 保存结果 =====
with open('output.png', 'wb') as f:
    f.write(data)

print("\n✅ 完整密钥:", (part1 + part2 + part3).decode('latin1', errors='replace'))
print("✅ 图片已保存: output.png")