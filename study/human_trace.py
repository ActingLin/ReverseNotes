# -*- coding: utf-8 -*-
"""
@File    : human_trace.py
@Author  : Elliot Lin
@Date    : 2026/4/9 23:57
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import numpy as np
from scipy.signal import butter, filtfilt

def human_trace(x0,y0, x3,y3, T_ms=420, freq=120):
    # 1. 控制点
    W, H = 1920, 1080
    k = np.hypot(x3-x0, y3-y0)
    ang = np.arctan2(y3-y0, x3-x0)
    p1 = (x0+0.3*k*np.cos(ang+0.4), y0+0.3*k*np.sin(ang+0.4))
    p2 = (x3-0.3*k*np.cos(ang-0.4), y3-0.3*k*np.sin(ang-0.4))
    # 2. 时间轴
    n = int(T_ms*freq//1000)
    t = np.sort(np.random.beta(2,3,n))
    # 3. 贝塞尔
    def B(t): return (1-t)**3*np.array([x0,y0]) + 3*(1-t)**2*t*np.array(p1) + 3*(1-t)*t**2*np.array(p2) + t**3*np.array([x3,y3])
    curve = np.array([B(ti) for ti in t])
    # 4. 微抖动
    b,a = butter(2, [8/(freq/2), 12/(freq/2)], btype='band')
    noise = filtfilt(b,a, np.random.randn(n))
    jitter = 0.8*noise[:,None] + 0.5*np.random.randn(n,1)
    trace = curve + jitter
    # 5. 校验
    ts = np.arange(n)*(1000/freq)
    return [{'x':round(x,2),'y':round(y,2),'t':int(ti)} for x,y,ti in zip(trace[:,0],trace[:,1],ts)]

if __name__ == '__main__':
    print(human_trace(0,0,0,0))