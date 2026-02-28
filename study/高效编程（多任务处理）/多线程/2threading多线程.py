# -*- coding: utf-8 -*-
"""
@File    : threading多线程.py
@Author  : Elliot Lin
@Date    : 2026/2/26 12:02
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import threading
import time
import random

# --- 全局共享资源 ---
# 模拟一个共享的日志文件列表
shared_log_buffer = []
# 模拟数据库连接池的最大连接数
DB_POOL_SIZE = 3

# --- 同步原语初始化 ---
# 1. 锁 (Lock): 保护 shared_log_buffer 的写入操作
buffer_lock = threading.Lock()

# 2. 条件变量 (Condition): 用于协调“日志生成者”和“日志处理者”
# 当缓冲区满时通知生成者等待，当缓冲区有数据时通知处理者工作
condition = threading.Condition(buffer_lock)

# 3. 事件 (Event): 用于控制所有线程的优雅停止
stop_event = threading.Event()

# 4. 信号量 (Semaphore): 限制同时只有 3 个线程能访问“数据库”
db_semaphore = threading.Semaphore(DB_POOL_SIZE)


# --- 线程类定义 ---

class LogGenerator(threading.Thread):
    """生产者：生成日志数据"""

    def __init__(self, name, count):
        super().__init__(name=name)
        self.count = count

    def run(self):
        print(f"[{self.name}] 启动 (Daemon: {self.daemon})")
        for i in range(self.count):
            if stop_event.is_set():
                break

            # 模拟生成数据耗时
            time.sleep(random.uniform(0.5, 1.5))

            data = f"Log-{i}-{time.time():.2f}"

            with condition:
                # 如果缓冲区满了（假设最大5条），等待
                while len(shared_log_buffer) >= 5 and not stop_event.is_set():
                    print(f"[{self.name}] 缓冲区满，等待处理者...")
                    condition.wait()

                if stop_event.is_set():
                    break

                shared_log_buffer.append(data)
                print(f"[{self.name}] 生成数据: {data} (当前缓冲: {len(shared_log_buffer)})")

                # 通知处理者有新数据了
                condition.notify_all()

        print(f"[{self.name}] 生成任务完成。")


class LogProcessor(threading.Thread):
    """消费者：处理日志并模拟写入数据库"""

    def __init__(self, name):
        super().__init__(name=name)
        # 设置为守护线程，主程序结束时如果它还在跑，会被强制结束
        self.daemon = True

    def run(self):
        print(f"[{self.name}] 启动 (Daemon: {self.daemon})")
        while not stop_event.is_set():
            data_to_process = None

            with condition:
                # 如果缓冲区为空，等待生成者
                while len(shared_log_buffer) == 0 and not stop_event.is_set():
                    condition.wait(timeout=1.0)  # 设置超时以防死锁

                if stop_event.is_set() and len(shared_log_buffer) == 0:
                    break

                if shared_log_buffer:
                    data_to_process = shared_log_buffer.pop(0)
                    # 通知生成者缓冲区有空位了
                    condition.notify_all()

            if data_to_process:
                self.write_to_db_simulated(data_to_process)

        print(f"[{self.name}] 处理器退出。")

    def write_to_db_simulated(self, data):
        """模拟耗时的数据库写入，受信号量限制"""
        thread_name = threading.current_thread().name

        print(f"[{thread_name}] 尝试获取数据库连接 (剩余可用: {db_semaphore._value})")

        # 获取信号量，如果达到上限（3个），这里会阻塞等待
        db_semaphore.acquire()
        try:
            print(f"[{thread_name}] >>> 正在写入数据库: {data}")
            time.sleep(random.uniform(1, 2))  # 模拟写入耗时
            print(f"[{thread_name}] <<< 写入完成: {data}")
        finally:
            # 释放信号量
            db_semaphore.release()


# --- 主程序逻辑 ---

def main():
    print("=== 多线程综合演示开始 ===")
    print(f"当前线程: {threading.current_thread().name}")
    print(f"活跃线程数: {threading.active_count()}")

    # 创建线程实例
    generator = LogGenerator(name="Gen-Thread", count=8)
    processor1 = LogProcessor(name="Proc-Thread-1")
    processor2 = LogProcessor(name="Proc-Thread-2")

    # 启动线程
    generator.start()
    processor1.start()
    processor2.start()

    print(f"所有线程已启动，活跃线程数: {threading.active_count()}")

    # 主线程等待生成器完成 (join)
    # 注意：processor 是 daemon 线程，理论上不需要 join，但为了观察输出，我们可以稍微等一下
    generator.join()

    print("\n--- 生成器已完成，准备发送停止信号 ---")

    # 给处理器一点时间处理剩余数据
    time.sleep(1)

    # 发送停止信号 (Event)
    stop_event.set()

    # 唤醒所有因 condition.wait() 而阻塞的线程，让它们检查 stop_event
    with condition:
        condition.notify_all()

    # 等待非守护线程结束（这里主要是 generator，processor 是守护的会自动退）
    # 为了让输出更清晰，我们手动 join 一下 processor，虽然它们是 daemon
    processor1.join(timeout=2)
    processor2.join(timeout=2)

    print("\n=== 主程序结束 ===")
    print(f"最终活跃线程数: {threading.active_count()}")


if __name__ == "__main__":
    main()
