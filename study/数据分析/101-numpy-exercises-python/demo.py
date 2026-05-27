# -*- coding: utf-8 -*-
"""
@File    : demo.py
@Author  : Elliot Lin
@Date    : 2026/3/12 15:21
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import pandas as pd
import numpy as np

# 1.查看版本
# print(pd.__version__)
# print(pd.show_versions(as_json=True))

# 2.从列表、numpy 数组和 dict 创建 Series系列
# mylist = list('abcedfghijklmnopqrstuvwxyz')
# myarr = np.arange(26)
# mydict = dict(zip(mylist, myarr))
# # Solution
# ser1 = pd.Series(mylist)
# ser2 = pd.Series(myarr)
# ser3 = pd.Series(mydict)
# print(ser1)
# print(ser2)
# print(ser3)
# print(ser3.head())

# 3.将一个Series序列的索引转换为数据框的一列
# Input
mylist = list('abcedfghijklmnopqrstuvwxyz')
myarr = np.arange(26)
mydict = dict(zip(mylist, myarr))
ser = pd.Series(mydict)

# Solution
df = ser.to_frame().reset_index()
print(df.head())

