# -*- coding: utf-8 -*-
"""
@File    : decode_buf.py
@Author  : Elliot Lin
@Date    : 2026/8/11 16:21
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import blackboxprotobuf
import binascii

import loguru

hex_str = "000000003d0a240a0570617065721206e788ace899ab280130144201004801620270636a067365617263681001220741495f52454144220a41495f45585452414354"
raw = binascii.unhexlify(hex_str)

# ---- 拆包 ----
header_fixed = raw[:4]          # 前4字节
length_byte = raw[4]            # 第5字节 = 长度
protobuf_data = raw[5:5 + length_byte]   # 真正的protobuf数据（长度由length_byte指定）

loguru.logger.debug(f"固定头 ==> {header_fixed.hex()}")
loguru.logger.debug(f"长度字段 ==> {length_byte} (0x{length_byte:02x})")
loguru.logger.debug(f"Protobuf数据长度 ==> {len(protobuf_data)}")
# ---- 解码 ----
# message_dict, type_def = blackboxprotobuf.protobuf_to_json(protobuf_data)
message_dict, type_def = blackboxprotobuf.decode_message(protobuf_data)
loguru.logger.debug(f"解码后的数据 ==> {message_dict}")
loguru.logger.debug(f"自动推断的类型定义 ==> {type_def}")
# ---- 修改 ----
# 例如：将第一个字段中的 "paper" 改为 "hacked"，并将数字 20 改为 99
if 1 in message_dict and isinstance(message_dict[1], dict):
    message_dict[1][1] = "hacked"
    message_dict[1][4] = 99

print("\n修改后的数据:")
print(message_dict)
# ---- 编码 ----
new_protobuf_data = blackboxprotobuf.encode_message(message_dict, type_def)
new_len = len(new_protobuf_data)

# 检查长度是否超过255（单字节最大255）
if new_len > 255:
    raise ValueError(f"新数据长度 {new_len} 超过单字节长度限制，需调整协议处理")

# ---- 重新组装 ----
new_raw = header_fixed + bytes([new_len]) + new_protobuf_data
new_hex = new_raw.hex()

print("\n编码后的完整十六进制:")
print(new_hex)
print(f"新长度字段: {new_len} (0x{new_len:02x})")
