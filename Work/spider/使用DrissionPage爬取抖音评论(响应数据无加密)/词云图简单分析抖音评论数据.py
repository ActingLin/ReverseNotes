# -*- coding: utf-8 -*-
"""
@File    : 词云图简单分析抖音评论数据.py
@Author  : Elliot Lin
@Date    : 2026/2/6 11:43
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""

import pandas as pd
import jieba
from wordcloud import WordCloud

# 读取csv文件
df = pd.read_csv('output.csv',encoding='utf-8')
# 获取评论内容
content = ' '.join([str(i) if pd.notna(i) else '' for i in df['评论']])
# print(content)
# 分词处理
String = ' '.join(jieba.lcut(content))
# 词云图配置
wc = WordCloud(
    background_color='white',   # 默认黑色
    width=800,
    height=600,
    font_path='msyh.ttc',   # 中文词云图需添加字体
    stopwords={'啊', '的', '了', '就', '都', '还', '是', '我', '这', '这个', '吗'}    # 停用词
)

wc.generate(String)
wc.to_file('output.png')
