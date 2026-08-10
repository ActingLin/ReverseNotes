# -*- coding: utf-8 -*-
"""
离线固定输入自检: 无需真实流量, 验证加密原语与真实样本一致。
运行: python -m pytest tests/ -v  或  python tests/test_crypto.py
"""
import hashlib
import json
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../.."))

from collector import crypto


class TestGetUuid(unittest.TestCase):
    def test_format(self):
        for _ in range(50):
            u = crypto.get_uuid()
            self.assertEqual(len(u), 32)
            self.assertRegex(u, r"^[0-9a-f]{32}$")
            self.assertEqual(u[14], "4")                  # 复刻 getUuid
            self.assertIn(u[19], "89ab")                  # s[19]&3|8
            self.assertEqual(u[8], u[23])
            self.assertEqual(u[13], u[23])
            self.assertEqual(u[18], u[23])


class TestPlaintext(unittest.TestCase):
    def test_no_space_json(self):
        # JS JSON.stringify 无空格
        self.assertEqual(crypto.build_plaintext("page=1&limit=20"),
                         '{"limit":"20","page":"1"}')
        # 排序
        self.assertEqual(crypto.build_plaintext("limit=20&page=1"),
                         '{"limit":"20","page":"1"}')

    def test_empty(self):
        self.assertEqual(crypto.build_plaintext("{}"), '{"{}":""}')
        self.assertEqual(crypto.build_plaintext(""), "{}")


class TestSignFixedInput(unittest.TestCase):
    def test_captured_sample(self):
        # 浏览器捕获的真实请求三元组
        ts = "1786260833000"
        rid = "e3225a2d213242480c280082aeecb1bc"
        sign = "7ed580df1d694f677656f1dc5ee3c5e6"
        data = '{"limit":"20","page":"1"}'
        self.assertEqual(crypto.make_sign(data, rid, ts), sign)


class TestHex2b64(unittest.TestCase):
    def test_known_vectors(self):
        # hex2b64 对字节对齐输入等价于标准 base64
        self.assertEqual(crypto._hex2b64("414243"), "QUJD")   # "ABC"
        self.assertEqual(crypto._hex2b64("0f0011ff"), "DwAR/w==")
        self.assertEqual(crypto._hex2b64("0f001122"), "DwARIg==")
        self.assertEqual(crypto._hex2b64("0f"), "Dw==")
        # 与 jsbn hex2b64 在浏览器侧逐字节对拍过 (真实请求 body 已验证)

    def test_even_len_hex(self):
        # 1024bit RSA 密文块 -> 256 hex 字符, 无异常
        h = "ab" * 128
        out = crypto._hex2b64(h)
        self.assertIsInstance(out, str)
        self.assertGreater(len(out), 0)


class TestAesDecode(unittest.TestCase):
    def test_real_sample(self):
        # 真实响应密文样本 (js_reverse_cache/last_cipher.txt)
        p = os.path.join(os.path.dirname(__file__), "../..", "js_reverse_cache", "last_cipher.txt")
        if not os.path.exists(p):
            self.skipTest("缺少 js_reverse_cache/last_cipher.txt")
        cipher = open(p, encoding="utf-8").read().strip()
        plain = crypto.aes_decode(cipher)
        rows = json.loads(plain)
        self.assertIsInstance(rows, list)
        self.assertGreater(len(rows), 0)
        self.assertIn("serialId", rows[0])
        self.assertIn("username", rows[0])
        self.assertEqual(rows[0]["reportId"], "a0722e7d-b6b8-4f40-a69d-738f6d4285eb")


class TestRsaEncrypt(unittest.TestCase):
    def test_body_shape(self):
        # 验证 RSA 密文形状与样本一致 (172 字符级, PKCS1 随机所以值不同)
        body = crypto.rsa_encrypt_long('{"limit":"20","page":"1"}')
        self.assertRegex(body, r"^[A-Za-z0-9+/]+=*$")
        self.assertIn(len(body), (172, 171, 170))  # 单块 128 字节 -> 12bit 分组


if __name__ == "__main__":
    unittest.main(verbosity=2)
