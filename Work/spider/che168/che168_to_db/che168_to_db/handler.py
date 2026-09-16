# -*- coding: utf-8 -*-
"""用 curl_cffi 发请求的 Scrapy DownloadHandler，用来通过 EdgeOne 反爬。

为什么是 DownloadHandler 而不是 downloader middleware：
middleware 在 process_request 里 return Response 会直接短路掉 `download_func`
（即 `Downloader._enqueue_request`），而 **DOWNLOAD_DELAY、并发上限、slot 记账
全都在 _enqueue_request 里**。实测写成 middleware 后限速完全失效 —— 4 个请求
1.5 秒跑完，等于在裸奔，很容易被站点拉黑。

DownloadHandler 是在 `_process_queue` 的限速门之后、由 `_download()` 调用的，
所以限速与并发限制都照常生效。
"""
import asyncio
import time

from scrapy.exceptions import IgnoreRequest
from scrapy.http import HtmlResponse

from che168_to_db.edgeone import EdgeOneSession, page_title


class EdgeOneDownloadHandler:
    """curl_cffi（Chrome TLS 指纹）+ 自动过 EdgeOne 挑战。

    EdgeOne 按 TLS 指纹识别客户端，Scrapy 自带的 Twisted HTTP 客户端无论带什么
    cookie 都只会拿到 "Security Verification" 拦截页，所以这里整个换掉传输层。
    """

    lazy = True

    def __init__(self, crawler=None, proxy=None, rotator=None, max_rotate=6):
        self.crawler = crawler
        self.proxy = proxy
        self.session = EdgeOneSession(proxy=proxy)
        # 被硬拦时换新会话重试的次数（新 TLS 会话可能拿到不同判定）
        self.max_block_retry = 2
        # 被封时换节点的轮换器；None 表示不换
        self.rotator = rotator
        self.max_rotate = max_rotate

    @classmethod
    def from_crawler(cls, crawler):
        settings = crawler.settings
        proxy = settings.get('CHE168_PROXY') or None

        rotator = None
        if settings.getbool('CHE168_ROTATE_NODE', False):
            from che168_to_db.clash import NodeRotator
            try:
                rotator = NodeRotator(settings.get('CHE168_CLASH_GROUP') or '节点选择')
                crawler.spider.logger.warning(
                    "已启用节点轮换：组=%s，候选 %d 个",
                    rotator.group, len(rotator))
            except Exception as exc:
                crawler.spider.logger.error("节点轮换初始化失败，降级为不轮换: %s", exc)

        return cls(crawler, proxy=proxy, rotator=rotator)

    async def download_request(self, request):
        # to_thread：_fetch 里是阻塞网络 IO / sleep，不能卡住事件循环
        return await asyncio.to_thread(self._fetch, request)

    def _new_session(self):
        """换一个全新的 curl_cffi 会话，保留累计统计。"""
        stats = self.session.stats
        self.session.close()
        self.session = EdgeOneSession(proxy=self.proxy)
        self.session.stats = stats

    def _rotate(self, request, reason):
        """换到下一个可用节点，成功返回节点名，没有可用节点返回 None。"""
        if not self.rotator:
            return None
        node = self.rotator.switch_next()
        if node is None:
            self.rotator.rewind()      # 都试过了，节点可能陆续解封，再来一轮
            node = self.rotator.switch_next()
        if node is None:
            return None
        self._log("warning", "%s -> 换节点 %s（%s）",
                  reason, node, self.rotator.stats())
        time.sleep(2)                  # 等 Clash 把连接切过去
        self._new_session()
        return node

    def _fetch(self, request):
        """取一页。被封或当前节点连不上时换节点重试。"""
        kind, status, body = "OTHER", 0, ""

        for attempt in range(self.max_rotate + 1):
            try:
                status, body, kind = self.session.fetch(request.url)
            except Exception as exc:
                # 节点连不上（SSL / 超时）也当作该节点不可用，换一个再试。
                # 注意这里是异常而不是返回值——之前漏了这层，导致切到 SSL 不通的
                # 节点时请求直接失败，根本走不到换节点逻辑。
                if self.rotator:
                    self.rotator.mark_current_bad()
                if attempt < self.max_rotate and self._rotate(
                        request, f"请求异常({type(exc).__name__})"):
                    continue
                raise

            if kind == "REAL":
                return HtmlResponse(
                    url=request.url,
                    status=status,
                    # body 已由 curl_cffi 解码成 str，再编码回 utf-8 并显式声明，
                    # 免得 Scrapy 又去猜页面里那个骗人的 charset 声明
                    body=body.encode("utf-8"),
                    encoding="utf-8",
                    request=request,
                )

            # 被封（RISK / CAPTCHA）都是按 IP 记的，换节点才有用；换会话没用。
            if kind in ("RISK", "CAPTCHA"):
                if self.rotator:
                    self.rotator.mark_current_bad()
                if attempt < self.max_rotate and self._rotate(request, kind):
                    continue

                # 不轮换时，CAPTCHA 还能试试换新会话（偶尔能拿到不同判定）
                for _ in range(self.max_block_retry):
                    self._log("warning", "被拦截(CAPTCHA)，重建会话重试: %s", request.url)
                    self._new_session()
                    status, body, kind = self.session.fetch(request.url)
                    if kind == "REAL":
                        return HtmlResponse(url=request.url, status=status,
                                            body=body.encode("utf-8"),
                                            encoding="utf-8", request=request)
                    if kind != "CAPTCHA":
                        break
            break

        # 走到这里说明换节点等手段都用完了，kind 一定不是 REAL。
        # 抛出去让 Scrapy 记为下载失败，而不是把拦截页当正常页解析成 0 条。
        # 把类型含义带上，免得只看到 "0 条" 不知道发生了什么。
        hint = {
            "RISK": "（车168 风控的图片验证码页，协议层解不了，需降速或等冷却）",
            "CAPTCHA": "（EdgeOne 拦截页）",
            "LIGHT": "（EdgeOne 轻量挑战未解开）",
            "HEAVY": "（EdgeOne 重型挑战未解开）",
            "OTHER": f"（未识别的页面，标题={page_title(body)!r}）",
        }.get(kind, "")
        raise IgnoreRequest(
            f"EdgeOne 未通过: {kind}{hint} status={status} {request.url}")

    def _log(self, level, msg, *args):
        spider = getattr(self.crawler, "spider", None)
        logger = getattr(spider, "logger", None)
        if logger is not None:
            getattr(logger, level)(msg, *args)

    async def close(self):
        stats = self.session.stats
        self.session.close()
        self._log("warning", "EdgeOne 请求统计: %s", stats)
