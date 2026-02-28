# -*- coding: utf-8 -*-
"""
@File    : 多进程复制文件.py
@Author  : Elliot Lin
@Date    : 2026/2/22 04:28
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 单个大文件多进程分块复制
"""
import time
from multiprocessing import Pool, cpu_count
import os


def copy_chunk(args):
    """复制文件的一个块"""
    src_path, dst_path, start, size = args
    with open(src_path, "rb") as fp1:
        with open(dst_path, "r+b") as fp2:
            fp1.seek(start)
            fp2.seek(start)
            fp2.write(fp1.read(size))
    return size


def copy_file_parallel(src_path, dst_path, processes=None):
    """多进程复制单个大文件"""
    if processes is None:
        processes = cpu_count()

    file_size = os.path.getsize(src_path)
    chunk_size = file_size // processes

    print(f"[*] 文件大小: {file_size / 1024 / 1024:.2f} MB")
    print(f"[*] 分块数: {processes}, 每块约: {chunk_size / 1024 / 1024:.2f} MB")

    # 先创建目标文件（占位）
    with open(src_path, "rb") as fp1:
        with open(dst_path, "wb") as fp2:
            fp2.write(fp1.read())

    # 准备分块任务
    tasks = []
    for i in range(processes):
        start = i * chunk_size
        if i == processes - 1:
            size = file_size - start  # 最后一块包含剩余所有
        else:
            size = chunk_size
        tasks.append((src_path, dst_path, start, size))

    # 多进程复制
    with Pool(processes) as pool:
        pool.map(copy_chunk, tasks)


if __name__ == "__main__":
    t1 = time.time()

    src_path = r"SVID_20230421_222626_1.mp4"
    dst_path = r"./file/SVID_20230421_222626_1.mp4"

    # 确保目标目录存在
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)

    # 检查源文件
    if not os.path.isfile(src_path):
        print(f"[-] 源文件不存在: {src_path}")
        exit(1)

    copy_file_parallel(src_path, dst_path)

    t2 = time.time()
    print(f"[✓] 完成！耗时: {t2 - t1:.2f} 秒")