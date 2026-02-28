# -*- coding: utf-8 -*-
"""
@File    : 5aiofiles异步文件操作.py
@Author  : Elliot Lin
@Date    : 2026/2/26 23:40
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import aiofiles
import asyncio

async def read_file():
    async with aiofiles.open('example.txt', 'r') as f:
        content = await f.read()
        print(content)

async def read_file_line_by_line():
    async with aiofiles.open('example.txt', 'r') as f:
        async for line in f:
            print(line.strip())

asyncio.run(read_file_line_by_line())
asyncio.run(read_file())
