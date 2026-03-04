# -*- coding: utf-8 -*-
"""
@File    : parse_and_logout.py
@Author  : Elliot Lin
@Date    : 2026/3/1 21:50
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import logging
import colorlog
import sys
import json

import requests


def setup_logger():
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.DEBUG)

    # 如果已经添加过 handler，避免重复添加导致输出多次
    if logger.handlers:
        return logger

    # 创建 ConsoleHandler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG)

    # 定义颜色配置 (对应截图中的颜色风格)
    # DEBUG: 白色/灰色, INFO: 绿色, WARNING: 黄色, ERROR: 红色, CRITICAL: 紫红色
    log_colors_config = {
        'DEBUG': 'blue',
        'INFO': 'green',
        'WARNING': 'yellow',
        'ERROR': 'red',
        'CRITICAL': 'bold_red',
    }

    # 定义日志格式
    # %(asctime)s: 时间
    # %(log_color)s: 颜色前缀
    # %(levelname)s: 日志级别 (DEBUG/INFO...)
    # %(name)s: 模块名 (__main__)
    # %(funcName)s: 函数名
    # %(lineno)d: 行号
    # %(message)s: 日志内容
    log_format = (
        "%(asctime)s | "
        "%(log_color)s%(levelname)-8s%(reset)s | "
        "%(yellow)s%(name)s:%(funcName)s:%(lineno)d%(reset)s | "
        "%(message_log_color)s%(message)s"
    )

    # 创建 Formatter
    formatter = colorlog.ColoredFormatter(
        log_format,
        datefmt="%Y-%m-%d %H:%M:%S",  # 时间格式
        log_colors=log_colors_config,
        secondary_log_colors={
            # 为 message 内容单独设置颜色逻辑（可选，这里设为默认）
            'message': {'DEBUG': 'blue', 'INFO': 'green', 'WARNING': 'yellow', 'ERROR': 'red'}
        },
        style='%'
    )

    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    return logger

def handle_sse_stream(url, headers, cookies, data):
    """
    使用 requests 原生处理 SSE 流，无需 sseclient 库
    """
    # 初始化 logger
    logger = setup_logger()
    logger.debug("正在发起流式请求...")
    try:
        # 关键：stream=True
        response = requests.post(url, headers=headers, cookies=cookies, data=data, stream=True, timeout=30)
        # 检查 HTTP 响应状态码, 请求失败会主动抛出一个 requests.exceptions.HTTPError 异常
        response.raise_for_status()

        # 逐行迭代
        # iter_lines() 会自动处理换行符，并保持连接打开直到服务器关闭或超时
        for line in response.iter_lines():
            # 解码
            try:
                line_str = line.decode('utf-8')
            except UnicodeDecodeError:
                continue

            # 解析 SSE 格式
            if line_str.startswith("data:"):
                content = line_str[5:].strip()  # 去掉 "data:" 前缀

                # 尝试解析 JSON
                try:
                    json_data = json.loads(content)

                    # 提取业务逻辑
                    inner_data = json_data.get("data", {})
                    event_name = inner_data.get("event", "Unknown")
                    message = inner_data.get("message", "Unknown")

                    # 打印基本信息
                    # print(f"[{event_name}] {message}")

                    # 处理 "翻译中" 结果
                    if event_name == "Translating":
                        result_list = inner_data.get("list", [])
                        for item in result_list:
                            src = item.get("src", "")
                            dst = item.get("dst", "")
                            if src and dst:
                                logger.info(f"翻译: {src} -> {dst}")

                    # 处理 "AI释义" 结果
                    if event_name == "InterpretingSucceed":
                        result = inner_data.get("content", "")
                        logger.info(f"AI翻译: {result}")

                    # 特殊处理结束事件
                    if event_name == "Finish":
                        print("  --- 翻译完成 ---")

                except json.JSONDecodeError:
                    # 有时候 data 可能不是 JSON，或者是空
                    pass

    except requests.exceptions.RequestException as e:
        print(f"请求发生错误: {e}")



# --- 测试效果 ---
if __name__ == "__main__":
    # 初始化 logger
    logger = setup_logger()

    acs_token = "1767031206759_1767112434204_"  # 模拟你的长 token
    response_text = '{"errno":995, "errmsg":"request is not authorized", }'

    # 模拟截图中的输出
    logger.debug(f"成功生成acs_token: {acs_token}")

    # 模拟打印 JSON 数据 (通常用 info 或 debug)
    logger.info(f"data: {response_text}")

    # 测试其他级别看看颜色
    logger.warning("这是一个警告")
    logger.error("这是一个错误")
