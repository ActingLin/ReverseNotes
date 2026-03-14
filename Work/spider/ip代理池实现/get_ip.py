# -*- coding: utf-8 -*-
"""
@File    : get_ip.py
@Author  : Elliot Lin
@Date    : 2026/3/13 21:42
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 抓取免费ip的文件
"""
import requests
from lxml import etree
from proxy_redis import ProxyRedis

def get_ip():
    p_r = ProxyRedis()

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0",
        "Referer": "https://www.bing.com/",
    }
    cookies = {
        "https_waf_cookie": "53716f34-36f1-480365b471fa6f9f113cb60e60cfc1e297bd",
        "Hm_lvt_f9e56acddd5155c92b9b5499ff966848": "1773409921",
        "Hm_lpvt_f9e56acddd5155c92b9b5499ff966848": "1773409921",
        "HMACCOUNT": "FFC23AB907CDFB5A"
    }
    url = "https://www.89ip.cn/"

    # 保存页面源码，避免反复请求
    # response = requests.get(url, headers=headers, cookies=cookies)
    # html = response.content.decode()
    # with open("89ip.html", "w", encoding="utf-8") as f:
    #     f.write(html)

    # # 使用你本地保存的HTML文件进行解析
    with open("89ip.html", "r", encoding="utf-8") as f:
        html = f.read()
    tree = etree.HTML(html)

    ip_port_list = tree.xpath('//table[@class="layui-table"]/tbody/tr/td[1]/text()|//table[@class="layui-table"]/tbody/tr/td[2]/text()')

    # print(ip_port)

    # ip:port拼接
    for i in range(0, len(ip_port_list), 2):
        # print(ip_port_list[i].strip()+ ':' + ip_port_list[i + 1].strip())
        ip = ip_port_list[i].strip()+ ':' + ip_port_list[i + 1].strip()
        p_r.zset_zadd(ip)

if __name__ == "__main__":
    get_ip()