# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

# items.py
from dataclasses import dataclass, field
from typing import Optional

def serialize_price(value):
    """将价格（万元）格式化为带单位的字符串，若为空则返回None"""
    if value is None:
        return None
    return f"{value}万"

@dataclass
class Che168ToDbItem:
    # ---------- 基础信息 ----------
    info_id: Optional[str] = None               # 信息ID (来自 li 的 infoid 或 id)
    car_name: Optional[str] = None             # 车辆完整名称
    specid: Optional[str] = None               # 规格配置ID

    # ---------- 价格信息 ----------
    price: Optional[float] = None              # 当前售价（万元），float类型便于计算
    price_str: str = field(metadata={"serializer": serialize_price}, default=None)  # 序列化后的价格字符串（备用）
    guide_price: Optional[float] = None        # 新车指导价（万元），从 <s> 标签获取

    # ---------- 车况信息 ----------
    mileage: Optional[float] = None            # 行驶里程（万公里）
    reg_date: Optional[str] = None             # 上牌日期（格式：YYYY/MM）

    # ---------- 地理位置 ----------
    province_id: Optional[str] = None          # 省份ID
    city_id: Optional[str] = None              # 城市ID
    city_name: Optional[str] = None            # 城市名称（从 cards-unit 文本中提取）

    # ---------- 经销商 ----------
    dealer_id: Optional[str] = None            # 经销商ID

    # ---------- 链接 & 图片 ----------
    detail_url: Optional[str] = None           # 详情页相对路径（可拼接域名）
    img_url: Optional[str] = None              # 缩略图URL（需补全协议）

    # ---------- 状态标志 ----------
    is_newcar: Optional[int] = None            # 是否新车 (0/1)
    is_credit: Optional[int] = None            # 是否支持贷款
    is_cpl: Optional[int] = None               # 是否已售
    is_afteraudit: Optional[int] = None        # 审核状态码
    is_recom: Optional[int] = None             # 推荐级别

    # ---------- 发布 & 追踪 ----------
    public_date: Optional[str] = None          # 发布日期时间
    query_id: Optional[str] = None             # 查询会话ID（用于追踪）
    recom_id: Optional[str] = None             # 推荐ID
    page: Optional[int] = None                 # 当前页码
    pos: Optional[int] = None                  # 在列表中的位置

    # ---------- 额外文本字段 ----------
    car_unit: Optional[str] = None             # 原始的"里程／上牌／城市／会员"文本，便于备查

    # 如果后续需要解析 stra JSON，可添加：
    # stra: Optional[dict] = None

    def __post_init__(self):
        """自动将 price 序列化为 price_str（若需要）"""
        if self.price is not None and self.price_str is None:
            self.price_str = serialize_price(self.price)