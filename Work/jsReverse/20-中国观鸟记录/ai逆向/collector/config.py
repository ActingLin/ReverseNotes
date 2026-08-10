# -*- coding: utf-8 -*-
"""
运行配置与授权策略。
"""
from dataclasses import dataclass, field
from typing import List, Optional

# ---------------------------------------------------------------- 授权门
AUTHORIZATION_BASIS = "public-unauthenticated"     # 公开活动列表, 只读
ALLOWED_HOSTS = ["api.birdreport.cn", "www.birdreport.cn"]
ALLOWED_ROUTE_PREFIXES = ["/front/activity/"]       # 绝对路径段感知
ACTION_CLASS = "read-only"
ACCOUNT_OR_SESSION_USE = "none"

API_BASE = "https://api.birdreport.cn"
SEARCH_URL = API_BASE + "/front/activity/search"

# ---------------------------------------------------------------- 预算
TOTAL_REQUEST_BUDGET = 500        # bootstrap+分页+重试 共享预算
DEFAULT_LIMIT = 20                # 每页条数 (layui 默认)
MAX_LIMIT = 50                    # 服务端 limits: [20, 50]
REQUEST_TIMEOUT = 30
RETRY_TIMES = 2
RETRY_BACKOFF_BASE = 1.0          # 指数退避基数(秒)
MAX_RESPONSE_BYTES = 20 * 1024 * 1024


@dataclass
class CollectorConfig:
    """业务级配置。"""
    page_start: int = 1
    page_size: int = DEFAULT_LIMIT
    max_pages: int = 0                    # 0 = 全部
    where: dict = field(default_factory=dict)   # 搜索条件: serialId/username/pointName/startTime/endTime
    sort_by: Optional[str] = None         # 排序字段
    order_by: Optional[str] = None        # 'asc' / 'desc'
    output_path: str = "output"           # 输出目录 (相对项目根)
    out_format: str = "json"              # json / csv
    confirm_live: bool = False            # 需要 --confirm-live 才能发流量

    def form_string(self) -> str:
        """构造 layui 表单字符串 (与页面 toolbar where 一致)。"""
        parts = [f"page={self.page_start}", f"limit={self.page_size}"]
        for k, v in self.where.items():
            if v not in (None, ""):
                parts.append(f"{k}={v}")
        if self.sort_by and self.order_by:
            parts.append(f"sortBy={self.sort_by}")
            parts.append(f"orderBy={self.order_by}")
        return "&".join(parts)

    def next_page_form(self, page: int) -> str:
        """基于当前配置构造第 page 页的表单串。"""
        parts = [f"page={page}", f"limit={self.page_size}"]
        for k, v in self.where.items():
            if v not in (None, ""):
                parts.append(f"{k}={v}")
        if self.sort_by and self.order_by:
            parts.append(f"sortBy={self.sort_by}")
            parts.append(f"orderBy={self.order_by}")
        return "&".join(parts)


def validate_config(cfg: CollectorConfig) -> List[str]:
    """离线校验配置, 返回问题列表; 为空则通过。"""
    problems = []
    if not cfg.confirm_live:
        problems.append("confirm_live 未开启: 收集器不会发送任何真实流量 (dry-run 预览模式)")
    if cfg.page_size not in (20, 50):
        problems.append(f"page_size={cfg.page_size} 不在服务端允许范围 [20,50] 内")
    if cfg.order_by and cfg.order_by not in ("asc", "desc"):
        problems.append(f"order_by={cfg.order_by} 非法, 仅支持 asc/desc")
    if not (1 <= cfg.page_start):
        problems.append("page_start 必须 >= 1")
    return problems
