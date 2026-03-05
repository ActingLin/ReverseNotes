import random
import time
import ddddocr
from requests import session
import execjs



requests = session()
requests.headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "https://login.dangdang.com",
    "Pragma": "no-cache",
    "Referer": "https://login.dangdang.com/?returnurl=https^%^3A^%^2F^%^2Fwww.dangdang.com^%^2F",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
}

# 获取rankey
# "https://login.dangdang.com/api/customer/loginapi/getRankey"
url = "https://login.dangdang.com/api/customer/loginapi/getRankey"
param = {
            "ct": "pc",
            "permanent_id": "20231020220718452376655418332264106",
            "t": f'{int(time.time() * 1000)}'
        }
data = execjs.compile(open('当当.js', 'r', encoding='utf-8').read()).call('data1', param, "")
data['requestId'] = ""
data = '&'.join([k+'='+v for k,v in data.items()])
resp = requests.post(url,data=data)

requests.cookies['JSESSIONID'] = resp.cookies.get_dict()['JSESSIONID']
rankey =  resp.json()['rankey']
requestId = resp.json()['requestId']
print('密钥获取成功！')

# https://login.dangdang.com/api/customer/loginapi/getSlidingVerifyCode     ---    获取滑块图片
url = "https://login.dangdang.com/api/customer/loginapi/getSlidingVerifyCode"
paraml = {
            "ct": "pc",
            "permanent_id": "20231020220718452376655418332264106",
            "requestId": requestId,
            "situation": "login",
            "t": f'{int(time.time() * 1000)}'
        }
data = execjs.compile(open('当当.js', 'r', encoding='utf-8').read()).call('data1', paraml, rankey)
resp1 = requests.post(url,data=data)

requests.cookies['JSESSIONID'] = resp1.cookies.get('JSESSIONID')
result1 = resp1.json()
print(result1)
print("获取滑块图片：",result1['errorMsg'])

# 保存滑块图片
slideImg = result1['data']['slideImg']
bgImg = result1['data']['bgImg']

with open('../study/slideImg.png', 'wb') as f:
    f.write(requests.get(slideImg).content)

with open('../study/bgImg.png', 'wb') as f:
    f.write(requests.get(bgImg).content)
print('滑块图片保存成功！')

# 获取滑块距离
det = ddddocr.DdddOcr(det=False, ocr=False, show_ad=False)

with open('../study/slideImg.png', 'rb') as f:
    target_bytes = f.read()

with open('../study/bgImg.png', 'rb') as f:
    background_bytes = f.read()

slide_match = det.slide_match(target_bytes, background_bytes, simple_target=True)['target']
slide_x = int(slide_match[0] * 0.8578431372549019) / 350

# 参数加密
slide_obj = '{"x":'+str(slide_x)+',"y":'+ str(result1['data']['y']) +'}'
point_json = execjs.compile(open('当当.js', 'r', encoding='utf-8').read()).call('Y', slide_obj, result1['data']['encryptKey'])

print('等待5秒.....')
time.sleep(5)

# 滑块验证   "https://login.dangdang.com/api/customer/loginapi/checkSlidingVerifyCode"
paramv = {
    "ct": "pc",
    "need_new_verifydata": 0,
    "permanent_id": "20231020220718452376655418332264106",
    "point_json": point_json,
    "requestId": requestId,
    "situation": "login",
    "slide_cost_time": random.randint(2700,3300),
    "t": f'{int(time.time() * 1000)}',
    "verifyToken": result1['data']['token']
}
data1 = execjs.compile(open('当当.js', 'r', encoding='utf-8').read()).call('data1', paramv, rankey)
urls = "https://login.dangdang.com/api/customer/loginapi/checkSlidingVerifyCode"
resp2 = requests.post(urls,data=data1).json()

print('滑块验证：',resp2['errorMsg'])

# 登录
check_code = resp2['data']['checkCode']
username = '17264469761'
password= '1234567'
rankeys = execjs.compile(open('当当.js', 'r', encoding='utf-8').read()).call('L', "cXJjb2RlX3BAc3N3MHJkSw==")
password = execjs.compile(open('当当.js', 'r', encoding='utf-8').read()).call('Y', password, rankeys)
paramg = {
    "autokey": "off",
    "check_code": check_code,
    "check_code_type": "1",
    "ct": "pc",
    "password": password,
    "permanent_id": "20231020220718452376655418332264106",
    "requestId": requestId,
    "t": f'{int(time.time() * 1000)}',
    "token": result1['data']['token'],
    "username": username
}
data2 = execjs.compile(open('当当.js', 'r', encoding='utf-8').read()).call('data1', paramg, rankey)
urlg = "https://login.dangdang.com/api/customer/loginapi/accountLogin"
response = requests.post(urlg,data=data2)
print(response.text)



