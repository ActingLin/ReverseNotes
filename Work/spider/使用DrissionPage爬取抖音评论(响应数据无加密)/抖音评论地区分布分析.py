# -*- coding: utf-8 -*-
"""
@File    : 抖音评论地区分布分析.py
@Author  : Elliot Lin
@Date    : 2026/2/6 14:24
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    :
"""

import pandas as pd
from pyecharts import options as opts  # 导入可视化配置项
from pyecharts.charts import Map  # 导致可视化地图

# from pyecharts.faker import Faker   # 随机生成的数据


# 读取csv文件(抖音评论数据)
df = pd.read_csv('output.csv')
# 地区数据
regions = df['地区'].value_counts().index.to_list()
values = df['地区'].value_counts().to_list()
# 地区名称映射字典（简写 -> 标准名称）
region_mapping = {
    # 直辖市
    '北京': '北京市',
    '上海': '上海市',
    '天津': '天津市',
    '重庆': '重庆市',

    # 省份
    '山东': '山东省',
    '江苏': '江苏省',
    '广东': '广东省',
    '河南': '河南省',
    '浙江': '浙江省',
    '山西': '山西省',
    '河北': '河北省',
    '湖北': '湖北省',
    '吉林': '吉林省',
    '辽宁': '辽宁省',
    '安徽': '安徽省',
    '四川': '四川省',
    '黑龙江': '黑龙江省',
    '贵州': '贵州省',
    '陕西': '陕西省',
    '福建': '福建省',
    '云南': '云南省',
    '江西': '江西省',
    '甘肃': '甘肃省',
    '青海': '青海省',
    '湖南': '湖南省',
    '海南': '海南省',
    '台湾': '台湾省',

    # 自治区
    '广西': '广西壮族自治区',
    '内蒙古': '内蒙古自治区',
    '新疆': '新疆维吾尔自治区',
    '宁夏': '宁夏回族自治区',
    '西藏': '西藏自治区',

    # 特别行政区
    '香港': '香港特别行政区',
    '澳门': '澳门特别行政区',

    # 海外地区（不在中国地图内显示）
    '美国': '美国',
    'IP未知': '未知地区'
}

# 转换地区名称
standard_regions = []
filtered_values = []

for region, value in zip(regions, values):
    if region in region_mapping:
        standard_regions.append(region_mapping[region])
        filtered_values.append(value)
    else:
        # 如果不在映射中，尝试添加"省"后缀
        if region not in ['美国', 'IP未知']:
            standard_regions.append(f"{region}省")
            filtered_values.append(value)
        else:
            standard_regions.append(region)
            filtered_values.append(value)

print("转换后的地区名称:")
for region, value in zip(standard_regions, filtered_values):
    print(f"{region}: {value}")

# 创建地图
map_chart = Map(init_opts=opts.InitOpts(width="1200px", height="600px", page_title="抖音评论地区分布"))

# 准备数据对（排除海外和未知地区）
china_data = []
other_data = []

for region, value in zip(standard_regions, filtered_values):
    if '省' in region or '自治区' in region or '市' in region or '特别行政区' in region:
        china_data.append([region, value])
    else:
        other_data.append([region, value])

# 添加中国地图数据
map_chart.add(
    series_name="评论数量",
    data_pair=china_data,
    maptype="china",
    label_opts=opts.LabelOpts(is_show=True, formatter="{b}: {c}"),  # 显示地区和数值
)

# 设置全局选项
map_chart.set_global_opts(
    title_opts=opts.TitleOpts(
        title="抖音评论地区分布分析",
        subtitle=f"总评论数: {sum(filtered_values)}条，覆盖{len(china_data)}个地区",
        title_textstyle_opts=opts.TextStyleOpts(font_size=24),
        subtitle_textstyle_opts=opts.TextStyleOpts(font_size=16, color="#666"),
        pos_left="center"
    ),
    visualmap_opts=opts.VisualMapOpts(
        is_show=True,
        min_=min(filtered_values),
        max_=max(filtered_values),
        range_color=["#E0ECFF", "#1E90FF", "#4169E1"],
        pos_left="10%",
        pos_bottom="10%",
        textstyle_opts=opts.TextStyleOpts(color="#000")
    ),
    tooltip_opts=opts.TooltipOpts(
        trigger="item",
        formatter="{b}<br/>评论数量: {c}条"
    ),
    legend_opts=opts.LegendOpts(is_show=False)
)

# 渲染图表
output_file = "抖音评论地区分布.html"
map_chart.render(output_file)

print(f"\n图表已生成: {output_file}")
print(f"中国地区数量: {len(china_data)}个")
print(f"其他地区: {[item[0] for item in other_data]}")

# 打印统计数据
print("\n=== 统计数据 ===")
print(f"评论总数: {sum(filtered_values)}")
print(f"最多评论地区: {china_data[0][0]} ({china_data[0][1]}条)")
print(f"最少评论地区: {china_data[-1][0]} ({china_data[-1][1]}条)")
