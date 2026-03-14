# -*- coding: utf-8 -*-
"""
@File    : main.py
@Author  : Elliot Lin
@Date    : 2026/3/13 21:43
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 整个ip代理池运行的入口
"""
# from multiprocessing import Process
# from get_ip import get_ip
# from app import run as flask_run
# from test_ip import run as test_run
#
#
# def main():
#     Process(target=get_ip).start()      # 开启抓ip的进程
#     Process(target=flask_run).start()   # 开启从web获取ip的接口的进程
#     Process(target=test_run).start()    # 开启测试ip的进程
#
#
# if __name__ == '__main__':
#     main()

import signal
import sys
from multiprocessing import Process
from get_ip import get_ip
from app import run as flask_run  # 重命名避免与下面的变量名冲突
from test_ip import run as test_run


def signal_handler(signum, frame):
    """
    信号处理器，用于捕获 Ctrl+C (SIGINT) 信号。
    """
    print("\n\n接收到中断信号 (SIGINT, Ctrl+C)，正在关闭所有子进程...")

    # 停止所有全局子进程
    for process_name, process_obj in globals().items():
        if isinstance(process_obj, Process) and process_obj.is_alive():
            print(f"正在终止进程 '{process_name}' (PID: {process_obj.pid})...")
            process_obj.terminate()  # 发送 SIGTERM 信号
            process_obj.join(timeout=3)  # 等待最多3秒，看它是否能自行退出

            # 如果进程仍未退出，则强制杀死
            if process_obj.is_alive():
                print(f"进程 '{process_name}' 未能正常退出，正在强制杀死...")
                process_obj.kill()  # 发送 SIGKILL 信号

    print("所有子进程已关闭。正在退出主程序...")
    sys.exit(0)


def main():
    # 1. 注册信号处理器
    signal.signal(signal.SIGINT, signal_handler)

    # 2. 创建并启动子进程，并将其引用存储在全局变量中
    #    这样 signal_handler 才能找到它们。
    print("正在启动 IP 代理池的各个组件...")
    p_get_ip = Process(target=get_ip, name="GetIP_Process")
    p_flask_app = Process(target=flask_run, name="Flask_App_Process")
    p_test_ips = Process(target=test_run, name="TestIPs_Process")

    # 将进程对象赋值给全局变量，方便信号处理器访问
    globals()['p_get_ip'] = p_get_ip
    globals()['p_flask_app'] = p_flask_app
    globals()['p_test_ips'] = p_test_ips

    p_get_ip.start()
    p_flask_app.start()
    p_test_ips.start()

    print(f"所有进程已启动:")
    print(f"  - 抓取IP进程 PID: {p_get_ip.pid}")
    print(f"  - Flask API进程 PID: {p_flask_app.pid}")
    print(f"  - 测试IP进程 PID: {p_test_ips.pid}")
    print("\n代理池已就绪！API地址: http://127.0.0.1:5000/")
    print("按 Ctrl+C 停止服务...\n")

    # 3. 主进程进入无限循环，等待子进程结束或接收中断信号
    try:
        # 主进程等待所有子进程完成
        # 如果任何一个子进程意外退出，这里会返回
        p_get_ip.join()
        p_flask_app.join()
        p_test_ips.join()

        # 如果任何一个进程退出，主进程也应退出
        # 通常情况下，我们希望只有在接收到中断信号时才退出
        # 如果子进程因错误退出，也可以在这里处理
        print("检测到一个或多个子进程已退出。")

    except KeyboardInterrupt:
        # 这是一个额外的安全网，以防信号处理器未被触发
        # 但在注册了信号处理器后，这里通常不会被执行
        signal_handler(signal.SIGINT, None)


if __name__ == '__main__':
    main()