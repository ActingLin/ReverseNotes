# -*- coding: utf-8 -*-
"""
@File    : qimai.py
@Author  : Elliot Lin
@Date    : 2026/5/13 21:10
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 某麦数据下架应用榜
"""
import requests
import execjs


headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Origin": "https://www.qimai.cn",
    "Pragma": "no-cache",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
cookies = {
    "gr_user_id": "c15d2b80-f411-4773-add6-d438c77d696b",
    "ada35577182650f1_gr_last_sent_cs1": "qm27280517439",
    "qm_check": "A1sdRUIQChtxen8pI0dAOTQ+GRdzfX0QZlkBAwgGUC03HBd1QlhAXFEGFUdASAFKBQcCAQ8DDBFFIg4aHRoOBnMDARlGR2dQOVdICAolAGgCHBl0B3xUV05KVFsZXVJRWxsKFghJVktYVElWBRVP",
    "PHPSESSID": "73njrl08ntrcp8dgm2eis6jf2p",
    "ada35577182650f1_gr_session_id": "c2bfcb43-1b44-431a-b9f5-5d6c7b36e87c",
    "ada35577182650f1_gr_last_sent_sid_with_cs1": "c2bfcb43-1b44-431a-b9f5-5d6c7b36e87c",
    "ada35577182650f1_gr_session_id_sent_vst": "c2bfcb43-1b44-431a-b9f5-5d6c7b36e87c",
    "USERINFO": "4RLB3Rql4%2B1VmDe%2BWiaT%2FrKpG46VdNOze6cyBb2vhIBxGZWecOQGLtsWdj8dfN6qJ0JotKnCSAmLXGEoryeusQihBpH%2FUVl7MXNmo%2F6fQgGn%2BDc1YWmOI9jwuxRPGfJjFTJWVA%2Bl1MxSlTsh7pYkJgylGZOSMNR1",
    "AUTHKEY": "PeYlEy9wmEWgMQ2j8IXAah%2B5cCYio63CwZqv5FjlomKVLZp0iMlDJiYWgSfTW33yD%2FDSFUA72jS0nhPhnBBlEkL3f73TEMBumHl4LSLjkKgM4AEzTy0j4g%3D%3D",
    "aso_ucenter": "b667sBpE2TclV%2BE9jse9mjqlm8Jl0NB70mLIGXx4whCayWat5tnAlrbG5NxZEUrHYTw",
    "synct": "1783928408.226",
    "syncd": "-14377",
    "ada35577182650f1_gr_cs1": "qm27280517439"
}
url = "https://api.qimai.cn/rank/offline"

with open("./qimai.js", "r", encoding="utf-8") as f:
    js_code = f.read()
ctx = execjs.compile(js_code)   

for page in range(1, 5):
    params = {
        "analysis": ctx.call("getAnalysis", page),
        "status": "3",
        "date": "2026-07-13",
        "sdate": "2026-07-13",
        "edate": "2026-07-13",
        "country": "cn",
        "genre": "36",
        "option": "4",
        "page": str(page)
    }
    response = requests.get(url, headers=headers, cookies=cookies, params=params)

    print(response.json())
    # print(response)