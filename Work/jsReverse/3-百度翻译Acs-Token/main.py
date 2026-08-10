# -*- coding: utf-8 -*-
"""
@File    : main.py
@Author  : Elliot Lin
@Date    : 2026/2/19 17:36
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import json
import parse_and_logout
from acs_token import generate_acs_token

headers = {
    "Accept-Language": "zh-CN,zh;q=0.9",
    # "Acs-Token": "1771437606289_1771493584753_p407caAxXyI5w3/ygpacznxvYqEU2P7FZIsv2g8ALkq694vhHbyCm5pVIhZuCouI+v7fFDrQdwHkcGPBNC6YvxrE74/zPDZ6nWv8cdfeyEzKqPEMZS6lYP4cDgRSsmBff4ErKFEsqVx+lLpuIhRIeq3MahL1iWVT7gcv3YB/J6GWgvf6RZkWMkdTyuTjnHv9UJqZHaQMYu1Kyw/AewAmbuI29ZslJP9f6W/cTB2q0W1KprnXQWtIURJBSw2PYgFI/LzYaOxkfxzcxogACuls9jZKgwaLapP7kFEv7uZTyegPLN015Fr3hTJVR4glzXjEN2tayeI6nlA9aefwQS9zKDoW3i2+518bqZmuPh0mOpSj3unF+ZZyLKYXHUeGiPd2ouVlpyzvoo5hwea1pT3rwwTJmS9tSXN/39artHbYb1dyVMdmbIYf/zZYcw/FzHvfdnXV8mbycXzRfm1rcz1h4+C6J7AWBhubyUKwZ3iWL1uabuAqqP3Ua4+xlgARvA3j",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "application/json",
    "Origin": "https://fanyi.baidu.com",
    "Pragma": "no-cache",
    "Referer": "https://fanyi.baidu.com/mtpe-individual/transText?query=spider&lang=en2zh&ext_channel=DuSearch",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "accept": "text/event-stream",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
cookies = {
    "BIDUPSID": "45D7DB8B5A97F8FA3DCA3111A76EC700",
    "PSTM": "1769518381",
    "ZFY": "c05FrDGRXNvhTMrKzkOCD70Mg3tDwK53rdLuvozx23E:C",
    "BAIDUID": "45D7DB8B5A97F8FA3DCA3111A76EC700:SL=0:NR=10:FG=1",
    "BAIDUID_BFESS": "45D7DB8B5A97F8FA3DCA3111A76EC700:SL=0:NR=10:FG=1",
    "H_PS_PSSID": "63140_66689_67319_67316_67315_67322_67320_67447_67500_67536_67550_67600_67618_67592_67704_67715_67746_67312_67728_67811_67823_67824_67827_67833",
    "BA_HECTOR": "2ga5208l8h2ka42kalaga4ak0k25a11kpdls427",
    "PSINO": "7",
    "delPer": "0",
    "BDORZ": "B490B5EBF6F3CD402E515D22BCDA1598",
    "H_WISE_SIDS": "63140_66689_67319_67316_67315_67322_67320_67447_67500_67536_67550_67600_67618_67592_67704_67715_67746_67312_67728_67811_67823_67824_67827_67833",
    "AIT_PERSONAL_VERSION": "1",
    "AIT_ENTERPRISE_VERSION": "1",
    "ab_sr": "1.0.1_YTk5OGMyYjMzZmFiOTBjMWJlYmQzNjUzZGRiNTIxYTRlZGM4YmU0NWNlMzY5ODAwNDc4MjgxOWM1YWE5NTYzZWI0NjVhZmVmNjM1NjI4OGQ0OGRiOTBlMWU5YTllNWY1YzQ0YzFlMzhiOTkwZjUyN2VmN2ZiZTlhNTBkYmYzNDVjYTNkMzZjZWI3MzZmMGMxYmRlMzY1OWI5Yzc3NzU2ZWFkYzQxOGE5ZTk5OWZkZTExZmZlMjU5MTBiNDg4NjIxNmEyYjBhZGFlNzUyNjQ2OGQ1NDY2ZjllNzc4Y2ZmYzE=",
    "RT": "\"z=1&dm=baidu.com&si=ead735e7-c229-4074-a89a-06eb632a4188&ss=mlt9cmp3&sl=5&tt=fhb&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=6lxr\""
}
data = {
    "needNewlineCombine": False,
    "isAi": False,
    "sseStartTime": 1771493584749,
    "query": "spider",
    "from": "en",
    "to": "zh",
    "reference": "",
    "corpusIds": [],
    "needPhonetic": True,
    "domain": "common",
    "detectLang": "",
    "isIncognitoAI": False,
    "milliTimestamp": 1771493584750
}
data = json.dumps(data, separators=(',', ':'))
acs_token = generate_acs_token(headers['User-Agent'], cookies['BAIDUID'])
headers['Acs-Token'] = acs_token
url = "https://fanyi.baidu.com/ait/text/translate"
# response = requests.post(url, headers=headers, cookies=cookies, data=data)

if __name__ == "__main__":
    logger = parse_and_logout.setup_logger()
    logger.debug(f"成功生成Acs-Token: {acs_token}")
    parse_and_logout.handle_sse_stream(url, headers, cookies, data)
