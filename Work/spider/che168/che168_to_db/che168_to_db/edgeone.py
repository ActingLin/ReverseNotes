# -*- coding: utf-8 -*-
"""EdgeOne 反爬客户端：curl_cffi（Chrome TLS 指纹）+ 纯 Python 挑战求解。

为什么必须自己发请求、不能交给 Scrapy 自带下载器：
EdgeOne 按 TLS 指纹识别客户端，标准库 / Twisted 无论带什么 cookie 都只会
拿到 "Security Verification" 拦截页。实测对照见 tmp/test_plain_client.py。

两类挑战都已在本地还原成纯算法（不需要 iv8 / 浏览器）：

1. 轻量 TST（__tst_status / EO_Bot_Ssid）—— 挑战页约 1KB，形如
       document.cookie = "__tst_status=" + a(0) + "#;";
       document.cookie = a(1) + ";";          // a(1) -> "EO_Bot_Ssid=<N>"
   a(0) 是对象字面量里三个数字常量之和。字符串数组会被运行时旋转，所以不能
   按 _0x649a("0x0") 的下标读属性名；但加法可交换，直接求和即可，与旋转无关。

2. 重型 solveChallenge（EO-Bot-Js-Token）—— 算法还原见
   Work/spider/che168/eo_vmp/solver.py（PoW = MD5 原像 + 改动版 XTEA 密钥调度）：
       token = "local#" + challenge + "#" + base64(XTEA_ECB(JSON))
"""
import base64
import hashlib
import json
import re
import threading
import time

from curl_cffi import requests as creq

# ---------- 轻量 TST 挑战 ----------
_NUM_PROP_RE = re.compile(r"[A-Za-z_$][\w$]*\s*:\s*(\d{5,})")
_SSID_RE = re.compile(r"\(\s*t\s*,\s*(\d{5,})\s*\)")

# ---------- 重型 solveChallenge 挑战 ----------
_CHAL_RE = re.compile(r"window\.solveChallenge\(\s*'([^']*)'\s*,\s*'([^']*)'\s*\)")

_M32 = 0xFFFFFFFF
_DELTA = 0x9E3779B9
# 密钥串 "dGGIMWmGbSgDKeHH" 按大端切 4 个 32 位字
_K = [1682392905, 1297575239, 1649633092, 1264928840]
# 改版点在密钥调度：下标 0 与 3 各加一个常数（标准 XTEA 无此步骤）
_XTEA_KEY = [(_K[0] + 921092) & _M32, _K[1], _K[2], (_K[3] + 526339) & _M32]


def _u32(x):
    return x & _M32


def xtea_encrypt(data: bytes) -> bytes:
    """XTEA-ECB（改版密钥调度），组内两字按小端打包。"""
    assert len(data) % 8 == 0, "长度必须是 8 的倍数"
    out = bytearray()
    for i in range(0, len(data), 8):
        v0 = int.from_bytes(data[i:i + 4], "little")
        v1 = int.from_bytes(data[i + 4:i + 8], "little")
        s = 0
        for _ in range(32):
            t = _u32((_u32((_u32(v1 << 4) ^ (v1 >> 5)) + v1)) ^ _u32(s + _XTEA_KEY[s & 3]))
            v0 = _u32(v0 + t)
            s = _u32(s + _DELTA)
            t = _u32((_u32((_u32(v0 << 4) ^ (v0 >> 5)) + v0)) ^ _u32(s + _XTEA_KEY[(s >> 11) & 3]))
            v1 = _u32(v1 + t)
        out += v0.to_bytes(4, "little") + v1.to_bytes(4, "little")
    return bytes(out)


def solve_pow(key2: str, limit: int = 5000):
    """求最小 i 使 md5(prefix + str(i)) == target，命中即停。"""
    prefix, target = key2.split("#", 1)
    for i in range(limit + 1):
        if hashlib.md5((prefix + str(i)).encode()).hexdigest() == target:
            return i, True
    return limit, False


def make_heavy_token(challenge: str, key2: str, limit: int = 5000) -> str:
    """重型挑战的 cookie 值。"""
    answer, hit = solve_pow(key2, limit)
    plain = json.dumps({
        "args": challenge,
        "answer": str(answer),
        "env": "",
        "timestamp": int(time.time()),
        # PoW 未命中（放弃）时 isbypass=1，正常解出为 0
        "isbypass": 0 if hit else 1,
    }, separators=(",", ":")).encode()
    if len(plain) % 8:
        plain += b"\x00" * (8 - len(plain) % 8)
    payload = base64.b64encode(xtea_encrypt(plain)).decode()
    return "local#%s#%s" % (challenge, payload)


def solve_light(body: str) -> dict:
    """从轻量挑战页解析出要写入的 cookie；解析不出返回 {}。"""
    cookies = {}
    nums = [int(x) for x in _NUM_PROP_RE.findall(body)]
    if len(nums) >= 3:
        cookies["__tst_status"] = str(sum(nums)) + "#"
    m = _SSID_RE.search(body)
    if m:
        cookies["EO_Bot_Ssid"] = m.group(1)
    return cookies


# 车168 自己的风控验证页（中文标题，不是 EdgeOne 那个英文的）。
# 出现它说明当前 IP 已被站点风控标记，页面要求做图片验证码：
#   slide / select / icon_select / seq_select / spatial_select（类型随机）
# 这是**协议层解不了**的 —— 和 EdgeOne 的轻量挑战（纯算术）性质完全不同。
# 换 TLS 会话也没用，因为是按 IP 记的。唯一的办法是降速、等冷却。
_RISK_MARKERS = ("二手车之家-安全验证", "为了保护您的访问安全")

_TITLE_RE = re.compile(r"<title>(.*?)</title>", re.S | re.I)


def page_title(body: str) -> str:
    m = _TITLE_RE.search(body)
    return re.sub(r"\s+", " ", m.group(1)).strip()[:60] if m else ""


def classify(body: str) -> str:
    """判定响应类型。"""
    if 'infoid="' in body:
        return "REAL"
    if "solveChallenge" in body:
        return "HEAVY"
    if "EO_Bot_Ssid" in body or "__tst_status" in body:
        return "LIGHT"
    if "Security Verification" in body or "TEOCaptchaWidget" in body:
        return "CAPTCHA"
    # 车168 自己的中文验证码页
    if any(marker in body for marker in _RISK_MARKERS):
        return "RISK"
    return "OTHER"


class EdgeOneSession:
    """带挑战自解的 curl_cffi 会话。

    curl_cffi 的 Session 不是线程安全的，而 Scrapy 会在多个工作线程里调用，
    所以用锁串行化 —— 反正 settings 里单域名并发本来就是 1。
    """

    def __init__(self, proxy=None):
        # proxy 形如 "http://127.0.0.1:7890"（Clash 混合端口）；None = 直连。
        # 注意：Clash 规则模式下国内域名默认直连，光配这里没用，得先在 Clash 侧
        # 让 che168.com 走节点（加规则或切全局模式），否则出口 IP 根本没变。
        self.proxy = proxy
        self.session = creq.Session(impersonate="chrome", proxy=proxy)
        self.session.headers.update({
            "Referer": "https://www.che168.com/",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Upgrade-Insecure-Requests": "1",
        })
        self._lock = threading.Lock()
        self.stats = {"REAL": 0, "LIGHT": 0, "HEAVY": 0, "CAPTCHA": 0, "OTHER": 0}

    def close(self):
        try:
            self.session.close()
        except Exception:
            pass

    # 单次请求超时。页面上限约 500KB，正常 1~2 秒就下完；
    # 但站点在被高频访问时会「限速」——连接不断开，只是传得很慢，
    # 表现就是 curl: (28) timed out with xxx bytes received。这里给足余量。
    TIMEOUT = 45
    # 总尝试次数。⚠️ 网络异常重试和挑战求解**共用**这一个预算：
    # 一次挑战至少要 2 轮（第 1 轮拿挑战页+写 cookie，第 2 轮才拿到真页面），
    # 所以这个值不能小于 3。曾经把它调成 1 想「快速失败」，结果所有请求都停在
    # 挑战页上，被误判成解不开——排查时注意这一点。
    MAX_TRIES = 6

    def fetch(self, url):
        """请求 URL：遇到挑战就地求解，遇到网络异常退避重试。

        必须自己兜住网络异常。以前只在遇到挑战时重试、网络异常直接抛出去，
        结果一次超时就能让整轮爬取挂掉：RetryMiddleware 重试 3 次全撞上同一个
        瞬时故障 -> Gave up -> 起始请求失败 -> 整个任务结束，0 条数据。

        返回 (status_code, 文本, 最终判定类型)；所有尝试都失败时抛最后一次异常。
        """
        with self._lock:
            body, kind, status = "", "OTHER", 0
            last_exc = None

            for attempt in range(self.MAX_TRIES):
                try:
                    r = self.session.get(url, timeout=self.TIMEOUT)
                except Exception as exc:
                    last_exc = exc
                    self.stats["NETFAIL"] = self.stats.get("NETFAIL", 0) + 1

                    # SSL 握手失败 = 这个出口根本连不上目标站，换多少次都是同样结果
                    # （实测某些代理节点连不上国内站点）。立刻抛给上层去换节点，
                    # 别在这里耗 25 秒退避。
                    if "SSL" in type(exc).__name__ or "SSL" in str(exc):
                        raise

                    wait = min(2 ** attempt, 10)   # 1,2,4,8,10,10 秒退避
                    print(f"  [EdgeOne] 请求异常({type(exc).__name__})，"
                          f"{wait}s 后重试 {attempt + 1}/{self.MAX_TRIES}: {url}")
                    time.sleep(wait)
                    continue

                last_exc = None
                body, kind, status = r.text, classify(r.text), r.status_code

                if kind == "REAL":
                    self.stats["REAL"] += 1
                    return status, body, kind
                if kind in ("CAPTCHA", "RISK"):
                    self.stats[kind] = self.stats.get(kind, 0) + 1
                    if kind == "RISK":
                        # 这里只能用 GBK 能编码的字符：控制台是 GBK，emoji 会让 print 抛
                        # UnicodeEncodeError，反而把整个请求搞挂
                        print(f"  [EdgeOne] !! 触发车168风控验证页（图片验证码）: {url}\n"
                              f"            当前 IP 已被标记，换会话无效，只能降速或等冷却")
                    return status, body, kind

                if kind == "LIGHT":
                    cookies = solve_light(body)
                elif kind == "HEAVY":
                    m = _CHAL_RE.search(body)
                    cookies = ({"EO-Bot-Js-Token": make_heavy_token(m.group(1), m.group(2))}
                               if m else {})
                else:
                    # 认不出来的页面把标题打出来，方便下次排查（这次就是靠它发现
                    # 车168 自己的中文验证码页的）
                    print(f"  [EdgeOne] 未识别的响应: status={status} len={len(body)} "
                          f"title={page_title(body)!r} {url}")
                    cookies = {}

                self.stats[kind] = self.stats.get(kind, 0) + 1
                if not cookies:
                    return status, body, kind
                for k, v in cookies.items():
                    self.session.cookies.set(k, v, domain=".che168.com", path="/")
                time.sleep(1)

            if last_exc is not None:
                raise last_exc
            return status, body, kind
