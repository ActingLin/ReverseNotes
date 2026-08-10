# -*- coding: utf-8 -*-
PUBPASS = "BX1o65CoobwcDP33iQW6ld1OyIPsNzF1"

def decrypt(t: str) -> str:
    keylen = int(t[4], 36)                 # 第5个字符 = 密钥长度(base36)
    randstr = t[5:5 + keylen]              # 随机密钥
    randcodes = [ord(c) for c in randstr]
    passcodes = [ord(c) for c in PUBPASS]
    body = t[5 + keylen:]                  # 剩余密文
    out = []
    c = 0  # rand index
    a = 0  # pass index
    for h in range(0, len(body), 2):
        u = int(body[h:h+2], 36)
        if c == len(randcodes): c = 0
        u -= randcodes[c]; c += 1
        if a == len(passcodes): a = 0
        u -= passcodes[a]; a += 1
        out.append(chr(u))
    s = ''.join(out)
    return s

# 请求体(从浏览器捕获)
req = "006cirrka9n9cp83duihf8i61705q6t4m6d4h7b825b646x827x5c5q6c676z627l6i4f745z666q7x6u7q6q5n7w6r6a8u7t677q8x7j786a6j6h5n3v5l7k6e6c5t6f6q5x6r9g7w6w976k8w8a50628l5n7h695c4t7e7v6x7r7b4i6o4e72946v716z9b8c7081808786907w8u6n7l687y5i644s5a6i7e776l6c7j636s5s6v7i886t7b9c6f5l8c7n6f6z72547p6q5k6a703z7j4h7e8867616v9q75847z5x7b7i8a86737w6v4f6t7i4z51776g7s6p584s6r7r9c7g6z6i76657c7g5p4p6m7q7l8t83575g7n7t5d6a6c7u6t8v83806l617s8a799a4y73898y736w6r6u4v6d65405v6v6p5y7s6u3y6l8e686l7a6g976r7b5z5h4n6w655s6d6y647h7i7g6p5y4h6c5j6e6x5z776l636z7a69567q6d816s534t6w6493664k4n917t8z9l8i6j807c7p8l6g51616g6k5v55605u6y7z637m4w74898m7c805s7r6c6v7o655r6x6j6r5c5q6c676z627a885p8d847l83616c99885k7h8c479b7h7d658h7s8p678s6f5365708w6h80747c837g8k997y708k6z8u8a5u6g8g7j8r7l5c4w7v7a7a7o6o4i6r4v577f576j7g948w5a6i6s5z6s7r6r7450694g6o6c5o4b5n6f8x918c7o906d8i7k777g846r7h8f755j779b7t7x7c6n9d7w7c85664f80445m6d5v5v6j817k5t6l4v5d7k7b6f5q6h6v4c6c"

# 响应体(从浏览器捕获)
rsp = "0086tvv4qe96rndimt3lpomqqvhm4l4s1465794n795p4g6j929c8r98908b4o5t5x7m6b716h7b77684o7r4v887q6s7p6m476l8b677l7o5r5o7e7i8n7w8m876c5u5y7o6k6s6d5h794p6m5r4v6w9e6e7k654c4y6n5t797l7r6n617g907v948f8a7s768p6t844g785j476i865d6e7h5n64655t608l7h9a5q7j607k7i7h9i9a7s89435g5r6u6y5r9f7y5i8k8z4n547r6u7j6e5y6k585y7q655w6h7s7t727k586a527j5k5e6x734k766z4c6v9s6n6j7h8d836q7783737a9d7i6765755x745z6z4n527v7i7k7a7x6b7b6z5t6d7w6f6z666o7v6m5x6j6z647j634f5w6286"

print("=== 请求体解密 ===")
try:
    print(decrypt(req))
except Exception as ex:
    print("ERR:", ex)
print()
print("=== 响应体解密 ===")
try:
    print(decrypt(rsp))
except Exception as ex:
    print("ERR:", ex)
