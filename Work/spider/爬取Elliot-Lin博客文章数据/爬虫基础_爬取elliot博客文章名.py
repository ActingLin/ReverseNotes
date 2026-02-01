import requests
from lxml import etree
from tabulate import tabulate

url = 'https://www.elliot-lin.top/'

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0'
}

res = requests.get(url, headers=headers)
data = res.content.decode('utf-8')
# print(data)

# with open('elliot-lin.html', 'w', encoding='utf-8') as f:
#     f.write(data)

tree = etree.HTML(data)
articles = tree.xpath('//div[@class="recent-post-info"]')
# 文章名
article_title = tree.xpath('//div[@class="recent-post-info"]/a/text()')
# 文章日期
article_time = tree.xpath('//div[@class="recent-post-info"]/div/span/time/@title')
# print(article_title)
# print(article_time)
# 准备表格数据
table_data = []
for article in articles:
    # 提取标题
    title = article.xpath('./a/text()')[0]
    print(title)
    # 提取文章
    article_time = article.xpath('./div/span/time[1]/@title')[0]
    at1 = article_time.replace("发表于", "")

    article_time2 = article.xpath('./div/span/time[2]/@title')[0]
    at2 = article_time2.replace("更新于", "")

    table_data.append([title, at1, at2])

# 定义表头
t_headers = ["文章名", "发表时间", "更新时间"]
# 使用 tabulate 输出
print(tabulate(table_data, headers=t_headers, tablefmt="heavy_grid", maxcolwidths=[50, 50]))
