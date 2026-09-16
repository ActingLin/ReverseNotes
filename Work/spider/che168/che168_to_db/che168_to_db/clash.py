# -*- coding: utf-8 -*-
r"""通过 Windows 命名管道调用 Clash(mihomo) 的外部控制 API。

为什么不能用 requests：Clash Verge 把 external-controller 挂在**命名管道**上
（运行时配置里的 `external-controller-pipe: \\.\pipe\verge-mihomo`），
TCP 端口是空的。所以这里手写最简 HTTP over named pipe。

用途：che168 的风控是按 IP 记的，一个 IP 撑不了多少请求就被标记。
被标记后换一个节点就能继续，这套接口就是用来换节点的。
"""
import json
import re
import time

DEFAULT_PIPE = r"\\.\pipe\verge-mihomo"
# mihomo 默认的代理组名，Clash Verge 中文界面下就是这个
DEFAULT_GROUP = "节点选择"

_STATUS_RE = re.compile(rb"^HTTP/1\.\d (\d{3})")


class ClashError(RuntimeError):
    pass


class ClashAPI:
    """极简的 mihomo API 客户端（只实现用得到的几个接口）。"""

    def __init__(self, pipe=DEFAULT_PIPE, timeout=8):
        self.pipe = pipe
        self.timeout = timeout

    # ------------------------------------------------------------------ 底层
    def _request(self, method, path, payload=None):
        """往命名管道发一条 HTTP 请求，返回解析后的 JSON（无 body 时返回 {}）。"""
        body = b""
        if payload is not None:
            body = json.dumps(payload).encode("utf-8")
        head = (
            f"{method} {path} HTTP/1.1\r\n"
            f"Host: localhost\r\n"
            f"Content-Type: application/json\r\n"
            f"Content-Length: {len(body)}\r\n"
            f"Connection: close\r\n\r\n"
        ).encode("utf-8")

        try:
            f = open(self.pipe, "r+b", buffering=0)
        except OSError as exc:
            raise ClashError(f"打不开 Clash 管道 {self.pipe}: {exc}") from exc

        try:
            f.write(head + body)
            raw = b""
            deadline = time.time() + self.timeout
            while time.time() < deadline:
                chunk = f.read(65536)
                if not chunk:
                    break          # 服务端 close 了，读完了
                raw += chunk
        except OSError as exc:
            raise ClashError(f"管道通信失败: {exc}") from exc
        finally:
            f.close()

        if not raw:
            raise ClashError("Clash 管道没有返回任何数据")

        head_part, _, body_part = raw.partition(b"\r\n\r\n")
        m = _STATUS_RE.match(head_part)
        status = int(m.group(1)) if m else 0
        if status >= 400:
            raise ClashError(f"Clash API {method} {path} 返回 {status}: "
                             f"{body_part[:200].decode('utf-8', 'replace')}")

        if b"Transfer-Encoding: chunked" in head_part:
            body_part = _dechunk(body_part)
        if not body_part.strip():
            return {}
        try:
            return json.loads(body_part.decode("utf-8"))
        except json.JSONDecodeError as exc:
            raise ClashError(f"Clash API 返回的不是 JSON: {body_part[:200]!r}") from exc

    # ------------------------------------------------------------------ 接口
    def version(self):
        return self._request("GET", "/version")

    def proxies(self):
        """返回 {组名/节点名: {type, now, all, ...}}"""
        return self._request("GET", "/proxies").get("proxies", {})

    def group_nodes(self, group=DEFAULT_GROUP):
        """取某个代理组里可选的全部节点名（过滤掉流量/到期这类伪节点）。"""
        info = self.proxies().get(group)
        if not info:
            raise ClashError(f"找不到代理组 {group!r}，可用组：{list(self.proxies())[:10]}")
        nodes = []
        for name in info.get("all", []):
            # 订阅里常夹着「剩余流量：xxx」「套餐到期：xxx」这种占位项，跳过
            if any(k in name for k in ("剩余流量", "套餐到期", "官网", "续费")):
                continue
            nodes.append(name)
        return nodes

    def current_node(self, group=DEFAULT_GROUP):
        info = self.proxies().get(group, {})
        return info.get("now")

    def switch(self, node, group=DEFAULT_GROUP):
        """把代理组切到指定节点。"""
        self._request("PUT", f"/proxies/{_quote(group)}", {"name": node})
        return node


class NodeRotator:
    """被封 / 连不上时依次换节点，并记住哪些节点已被验证不可用。

    实测 43 个节点里大部分不能用，失败方式有三种：
      - SSL 错误    ：这个出口连不上国内站点（最常见）
      - CAPTCHA 页  ：EdgeOne 不喜欢这个 IP
      - RISK 页     ：车168 自己的风控标记了这个 IP
    所以必须「切一个、验一个、记住结果」，不能盲目按顺序轮。

    注意切的是**哪个组**取决于 Clash 的模式：
      - 全局模式：流量走 GLOBAL 组，切「节点选择」出口 IP 不变（实测确认）
      - 规则模式：走规则匹配到的组
    """

    def __init__(self, group=DEFAULT_GROUP, api=None, exclude=("自动选择",)):
        self.api = api or ClashAPI()
        self.group = group
        # 「自动选择」是 URLTest 组，切过去不保证换到具体 IP，排除掉
        self.nodes = [n for n in self.api.group_nodes(group) if n not in exclude]
        self.bad = set()        # 已验证不可用的
        self.i = 0
        try:
            self.current = self.api.current_node(group)
        except ClashError:
            self.current = None

    def __len__(self):
        return len(self.nodes)

    def stats(self):
        return {"总数": len(self.nodes), "已排除": len(self.bad),
                "剩余": len(self.nodes) - len(self.bad), "当前": self.current}

    def mark_current_bad(self):
        """把当前节点记为不可用（被封 / 连不上）。"""
        if self.current:
            self.bad.add(self.current)

    def switch_next(self):
        """切到下一个尚未验证为坏的节点，返回名字；全试完了返回 None。"""
        for _ in range(len(self.nodes)):
            node = self.nodes[self.i % len(self.nodes)]
            self.i += 1
            if node in self.bad:
                continue
            try:
                self.api.switch(node, self.group)
            except ClashError:
                self.bad.add(node)
                continue
            self.current = node
            return node
        return None

    def rewind(self):
        """清空「不可用」记录重新来过 —— 节点被封通常是一段时间，会陆续解封。"""
        self.bad.clear()
        self.i = 0


def _quote(s):
    from urllib.parse import quote
    return quote(s, safe="")


def _dechunk(data):
    out = b""
    while data:
        line, _, rest = data.partition(b"\r\n")
        try:
            size = int(line.split(b";")[0], 16)
        except ValueError:
            return out + data
        if size == 0:
            break
        out += rest[:size]
        data = rest[size + 2:]
    return out


def _usable_node(name):
    """过滤掉订阅里的流量/到期等占位项，以及明显不可用的。"""
    bad = ("剩余流量", "套餐到期", "官网", "续费", "窗口", "流量")
    return not any(b in name for b in bad)


if __name__ == "__main__":
    api = ClashAPI()
    print("mihomo 版本:", api.version())
    print()
    groups = [k for k, v in api.proxies().items() if v.get("type") in
              ("Selector", "URLTest", "Fallback", "LoadBalance")]
    print("代理组:", groups)
    print()
    nodes = api.group_nodes()
    print(f"{DEFAULT_GROUP} 组内节点 {len(nodes)} 个:")
    for n in nodes:
        mark = "  <== 当前" if n == api.current_node() else ""
        print(f"  {n}{mark}")
