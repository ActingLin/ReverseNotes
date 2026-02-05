# -*- coding: utf-8 -*-
"""
@File    : 爬取抖音视频评论.py
@Author  : Elliot Lin
@Date    : 2026/2/5 21:12
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""

# 第一次使用需配置DrissionPage
# from DrissionPage import ChromiumOptions
#
# # 电脑内Chrome可执行文件路径(edge/谷歌/火狐)
# path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
# ChromiumOptions().set_browser_path(path).save()
#
# # 配置已保存到文件: D:\Program Files (x86)\python\Lib\site-packages\DrissionPage\_configs\configs.ini
# # 以后程序可自动从文件加载配置

from DrissionPage import Chromium
from datetime import datetime
import csv


# 创建文件对象
f = open('output.csv', 'w', encoding='utf-8', newline='')
# 以字典形式写入
csv_writer = csv.DictWriter(f, fieldnames=[
    "时间",
    "昵称",
    "地区",
    "评论",
    "点赞",
])
# 写入表头
csv_writer.writeheader()

# 启动或接管浏览器，并获取标签页对象
tab = Chromium().latest_tab
# 评论区链接'https://www.douyin.com/aweme/v1/web/comment/list/'
# 先监听数据包特征
tab.listen.start('web/comment/list/')
# 首页推荐页: https://www.douyin.com/?recommend=1
# 搜索的得到的视频页: https://www.douyin.com/video/7486114666737880330
# 两种布局不一样
# 再跳转到目标页面
tab.get('https://www.douyin.com/video/7486114666737880330')
# 循环翻页
page = 1
while True:
    print(f"正在爬取第{page}页评论")
    try:
        # 等待数据包加载
        resp = tab.listen.wait(timeout=10)
        # 获取响应数据, json数据类型
        json_data = resp.response.body
        # print(json_data)
        # 提取评论信息
        comments = json_data['comments']
        for comment in comments:
            # 评论区时间转换
            create_time= comment['create_time'] # 评论区时间戳
            date = str(datetime.fromtimestamp(create_time))
            dic = {
                "时间": date,
                "昵称": comment['user']['nickname'],
                "地区": comment['ip_label'],
                "评论": comment['text'],
                "点赞": comment['digg_count'],
            }
            print(dic)
            csv_writer.writerow(dic)
        # 定位底部元素
        down = tab.ele('css:.Rcc71LyU')
        # 下滑页面可见
        tab.scroll.to_see(down)
        page += 1
    except Exception as e:
        print("已经下滑到底了！")
        exit()
