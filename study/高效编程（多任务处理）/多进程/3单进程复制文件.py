# -*- coding: utf-8 -*-
"""
@File    : 单进程复制文件.py
@Author  : Elliot Lin
@Date    : 2026/2/22 04:10
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import os
import time

def copy_file(path, toPath):
    with open(path, "rb") as fp1:
        with open(toPath, "wb") as fp2:
            while 1:
                info = fp1.read(1024)
                if not info:
                    break
                else:
                    fp2.write(info)
                    fp2.flush()

if __name__ == "__main__":
    t1 = time.time()

    # 获取当前脚本所在目录
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # 构建绝对路径
    path = os.path.join(base_dir, "SVID_20230421_222626_1.mp4")
    toPath = os.path.join(base_dir, "file", "SVID_20230421_222626_1.mp4")

    # 确保目标目录存在
    os.makedirs(os.path.dirname(toPath), exist_ok=True)

    # 检查源文件是否存在
    if not os.path.exists(path):
        print(f"[-] 源文件不存在: {path}")
        print(f"[*] 当前工作目录: {os.getcwd()}")
        print(f"[*] 脚本所在目录: {base_dir}")

        # 如果测试文件不存在，创建一个
        print("[*] 测试文件不存在，创建中...")
        with open(path, "wb") as f:
            f.write(b"x" * 1024 * 1024 * 10)  # 创建10MB测试文件
        print(f"[+] 已创建测试文件: {path}")
    else:
        copy_file(path, toPath)
        t2 = time.time()
        print("单进程耗时：%.2f" % (t2 - t1))
        print(f"文件大小: {os.path.getsize(path) / 1024 / 1024:.2f} MB")