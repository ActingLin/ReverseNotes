# -*- coding: utf-8 -*-
"""
throwaway probe: validate derived crypto against a live request
run:  python js_reverse_cache/probe_validate.py
"""
import hashlib
import json
import random
import re
import sys
import time
import urllib.request
import urllib.parse

from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5, AES

sys.path.insert(0, '')
from collector.crypto import (  # noqa: E402
    get_uuid, build_plaintext, make_sign,
    rsa_encrypt_long, aes_decode, PUBLIC_KEY_PEM,
)

if __name__ == '__main__':
    # 1. build plaintext data
    form = 'page=1&limit=20'
    data = build_plaintext(form)
    print('plaintext json:', data)

    timestamp = str(int(time.time() * 1000))
    request_id = get_uuid()
    sign = make_sign(data, request_id, timestamp)
    print('requestId:', request_id)
    print('timestamp:', timestamp)
    print('sign     :', sign)

    # 2. RSA encrypt body
    rsa_key = RSA.import_key(PUBLIC_KEY_PEM)
    body = rsa_encrypt_long(data, rsa_key)
    print('body len :', len(body))

    url = 'https://api.birdreport.cn/front/activity/search'
    headers = {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://www.birdreport.cn',
        'Referer': 'https://www.birdreport.cn/',
        'User-Agent': ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                       'AppleWebKit/537.36 (KHTML, like Gecko) '
                       'Chrome/138.0.0.0 Safari/537.36'),
        'requestId': request_id,
        'sign': sign,
        'timestamp': timestamp,
    }
    req = urllib.request.Request(url, data=body.encode(), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read()
            print('HTTP status:', resp.status)
            print('raw resp   :', raw[:300])
            j = json.loads(raw.decode('utf-8'))
            print('code/count/msg:', j.get('code'), j.get('count'), j.get('msg'))
            if j.get('count', 0) > 0 and j.get('data'):
                plain = aes_decode(j['data'])
                print('decrypted  :', plain[:500])
                rows = json.loads(plain)
                print('rows count :', len(rows))
                if rows:
                    print('first row keys:', list(rows[0].keys())[:12])
                    print('first serialId:', rows[0].get('serialId'))
    except urllib.error.HTTPError as e:
        print('HTTP error:', e.code, e.read()[:300])
    except Exception as e:
        print('EXC:', type(e).__name__, e)
