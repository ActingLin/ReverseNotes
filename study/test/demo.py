# -*- coding: utf-8 -*-
"""
@File    : demo.py
@Author  : Elliot Lin
@Date    : 2026/4/1 19:11
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import requests
from lxml import etree
from loguru import logger

def get_one_page_ip(page=1):
    """
    从指定页面获取IP代理列表

    Args:
        page (int): 页面编号

    Returns:
        list: IP:PORT 格式的列表
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0",
        "Referer": "https://www.bing.com/",
    }
    cookies = {
        "https_waf_cookie": "53716f34-36f1-480365b471fa6f9f113cb60e60cfc1e297bd",
        "Hm_lvt_f9e56acddd5155c92b9b5499ff966848": "1773409921",
        "Hm_lpvt_f9e56acddd5155c92b9b5499ff966848": "1773409921",
        "HMACOUNT": "FFC23AB907CDFB5A"
    }
    url = f"https://www.89ip.cn/index_{page}.html"

    try:
        response = requests.get(url, headers=headers, cookies=cookies)
        response.raise_for_status()  # 检查HTTP错误
        html = response.content.decode()
        tree = etree.HTML(html)

        # 获取ip,端口
        ip_port_list = tree.xpath(
            '//table[@class="layui-table"]/tbody/tr/td[1]/text()|//table[@class="layui-table"]/tbody/tr/td[2]/text()')

        ip_list = []
        # ip:port拼接
        for i in range(0, len(ip_port_list), 2):
            if i + 1 < len(ip_port_list):  # 确保索引不越界
                ip = ip_port_list[i].strip() + ':' + ip_port_list[i + 1].strip()
                ip_list.append(ip)

        return ip_list
    except Exception as e:
        logger.error(f"获取IP列表失败: {e}")
        return []


if __name__ == "__main__":
    print(get_one_page_ip(page=1))
