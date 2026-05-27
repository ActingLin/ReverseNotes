# -*- coding: utf-8 -*-
"""
@File    : first.py
@Author  : Elliot Lin
@Date    : 2026/3/12 15:06
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import matplotlib.pyplot as plt
# 1
# plt.plot([1, 2, 4, 9, 5, 3])
# plt.show()

# 2
# plt.plot([-3, -2, 4, 5, 3, 9], [1, 6, 4, 3, 9, 5])
# plt.axis((-4, 10, 0, 9))    # 改变每个轴的范围[xmin, xmax, ymin, ymax]
# plt.show()

# 3
import numpy as np
x = np.linspace(-2, 2, 500)
y = x**2
plt.plot(x, y)
plt.title("Square Function")
plt.xlabel("x")
plt.ylabel("y = x**2")
plt.grid(True)
plt.show()

# 4
# 可以在一个图上画出多条线:只需通过x1, y1, [style1], x2, y2, [style2], ...
plt.plot([0, 100, 100, 0, 0], [0, 0, 100, 100, 0], "r-")
plt.plot([0, 100, 50, 0, 100], [0, 100, 130, 100, 0], "g--")
plt.axis([-10, 110, -10, 140])
plt.show()
