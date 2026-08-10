"""
航班数据 MySQL 存储模块
功能：建表 + 解析 API 响应 + 入库
"""

import json
import pymysql
from datetime import datetime
from typing import Optional

from db_config import DB_CONFIG
import loguru


# ──────────────────────────────────────────────
# 建表 SQL
# ──────────────────────────────────────────────

CREATE_ITINERARY_TABLE = """
CREATE TABLE IF NOT EXISTS flight_itineraries (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    -- 行程标识
    trip_id         VARCHAR(255) NOT NULL COMMENT '行程唯一标识（API返回的id）',
    -- 采集元数据
    crawl_time      DATETIME NOT NULL COMMENT '采集时间',
    -- 航班基础信息（取第一程）
    dep_airport     CHAR(3) NOT NULL COMMENT '出发机场三字码',
    arr_airport     CHAR(3) NOT NULL COMMENT '到达机场三字码',
    dep_date        DATE NOT NULL COMMENT '起飞日期',
    dep_time        TIME NOT NULL COMMENT '起飞时刻',
    arr_time        TIME COMMENT '到达时刻',
    airline_code    CHAR(2) NOT NULL COMMENT '承运航司二字码',
    flight_no       VARCHAR(10) NOT NULL COMMENT '航班号',
    itinerary_type  TINYINT NOT NULL DEFAULT 1 COMMENT '1=直飞 2=中转',
    across_day      TINYINT NOT NULL DEFAULT 0 COMMENT '0=当天 1=跨天',
    -- 价格
    price_no_tax    DECIMAL(10,2) NOT NULL COMMENT '票面价(不含税)',
    price_with_tax  DECIMAL(10,2) NOT NULL COMMENT '含税总价',
    tax_amount      DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '税费合计',
    full_y_fare     DECIMAL(10,2) DEFAULT NULL COMMENT 'Y舱全价',
    discount        DECIMAL(5,4) DEFAULT NULL COMMENT '折扣系数',
    -- 舱位库存
    booking_class   VARCHAR(5) COMMENT '最低价对应的子舱位代码',
    inventory_qty   INT COMMENT '剩余座位数',
    over_take       TINYINT NOT NULL DEFAULT 0 COMMENT '0=正常 1=余票紧张',
    -- 行李
    luggage_free    VARCHAR(50) COMMENT '免费托运行李额',
    luggage_carry   VARCHAR(50) COMMENT '手提行李规格',
    -- 餐食
    meal_service    VARCHAR(50) COMMENT '餐食服务说明',
    -- 退改
    refund_rule     VARCHAR(200) COMMENT '退票规则摘要',
    -- 中转
    segment_count   TINYINT NOT NULL DEFAULT 1 COMMENT '航段数量',
    stay_duration   INT COMMENT '中转停留分钟数（直飞为0）',
    overnight       TINYINT NOT NULL DEFAULT 0 COMMENT '是否过夜中转',
    -- 机型
    aircraft_name   VARCHAR(50) COMMENT '机型名称',
    -- 总行程
    total_duration  INT COMMENT '总行程分钟数（含中转）',
    -- 原始数据
    raw_json        JSON COMMENT '完整原始JSON（兜底）',

    -- 索引
    UNIQUE KEY uk_trip_crawl (trip_id, crawl_time),
    INDEX idx_route_date (dep_airport, arr_airport, dep_date),
    INDEX idx_airline_price (airline_code, price_with_tax),
    INDEX idx_crawl_time (crawl_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='航班价格采集快照表';
"""


# ──────────────────────────────────────────────
# 连接管理
# ──────────────────────────────────────────────

def get_connection():
    """获取数据库连接"""
    return pymysql.connect(**DB_CONFIG)


# ──────────────────────────────────────────────
# 建表
# ──────────────────────────────────────────────

def init_db():
    """初始化数据库：创建表"""
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(CREATE_ITINERARY_TABLE)
        conn.commit()
        loguru.logger.info("数据库表 flight_itineraries 初始化完成")
    finally:
        conn.close()


# ──────────────────────────────────────────────
# 数据解析：API响应 → 扁平化字段
# ──────────────────────────────────────────────

def parse_itinerary(itinerary: dict, crawl_time: datetime) -> Optional[dict]:
    """
    将 API 返回的单条 itinerary 解析为数据库行字典。
    返回 None 表示数据不完整，跳过。
    """
    try:
        # ── 基础信息 ──
        trip_id = itinerary.get("id")
        if not trip_id:
            return None

        itinerary_type_raw = itinerary.get("itineraryType", "1")
        itinerary_type = 2 if itinerary_type_raw == "2" else 1

        across_day_raw = itinerary.get("acrossDay", 0)
        across_day = 1 if across_day_raw and int(across_day_raw) > 0 else 0

        overnight_raw = itinerary.get("overnight", False)
        overnight = 1 if overnight_raw else 0

        total_duration = itinerary.get("duration")  # 分钟

        # ── 价格 ──
        price_no_tax = itinerary.get("minLowPrice")
        price_with_tax = itinerary.get("minLowPriceWithTax")
        tax_amount = itinerary.get("taxPrice", 0)

        # 从 airItineraryPrices 提取成人价格和折扣
        full_y_fare = None
        discount = None
        air_prices = itinerary.get("airItineraryPrices", [])
        for price_item in air_prices:
            for tp in price_item.get("travelerPrices", []):
                if tp.get("travelerType") == "ADT":
                    full_y_fare = price_item.get("fullYFare")
                    discount = price_item.get("discount")
                    break

        # ── 航段（取第一程和最后一程） ──
        segments = itinerary.get("flightSegments", [])
        if not segments:
            return None

        first_seg = segments[0]
        last_seg = segments[-1]

        dep_airport = first_seg.get("departureAirportCode", "")
        arr_airport = last_seg.get("arrivalAirportCode", "")
        dep_date = first_seg.get("departureDate")
        dep_time = first_seg.get("departureTime")
        arr_time = last_seg.get("arrivalTime")

        airline_code = first_seg.get("operatingAirlineCode", "")
        flight_no = first_seg.get("flightNumber", "")

        segment_count = len(segments)

        # 中转停留时长（各段 ctStayDuration 之和）
        stay_duration = sum(
            s.get("ctStayDuration", 0) or 0 for s in segments[:-1]
        )

        # 机型（取第一程）
        aircraft_name = first_seg.get("displayAircraftName") or first_seg.get("aircraftCode")

        # ── 舱位库存 ──
        booking_classes = itinerary.get("flightBookingClasses", [])
        booking_class = None
        inventory_qty = None
        if booking_classes:
            first_bc = booking_classes[0]
            booking_class = first_bc.get("bookingClass")
            inventory_qty = first_bc.get("inventoryQuantity")

        over_take_raw = itinerary.get("overTake", False)
        over_take = 1 if over_take_raw else 0

        # ── 行李 ──
        luggage_free = None
        luggage_carry = None
        for benefit in itinerary.get("benefits", []):
            code = benefit.get("code", "")
            if code == "LUGGAGE-WEIGHT":
                luggage_free = benefit.get("addition")
            elif code == "BAGGAGE-SIZE":
                luggage_carry = benefit.get("previewContext") or benefit.get("addition")

        # ── 餐食 ──
        meal_service = None
        for benefit in itinerary.get("benefits", []):
            if benefit.get("code") == "MEAL":
                meal_service = benefit.get("remark")
                break
        if not meal_service:
            meal_service = first_seg.get("mealService") or first_seg.get("mealText")

        # ── 退改规则摘要 ──
        refund_rule = None
        for rule in itinerary.get("ruleInfos", []):
            if rule.get("ruleType") == "REFUND":
                desc = rule.get("description", "")
                rate = rule.get("rate")
                amount = rule.get("amount")
                if rate is not None:
                    refund_rule = f"{desc}: {int(rate * 100)}%"
                elif amount is not None:
                    refund_rule = f"{desc}: ¥{amount}"
                else:
                    refund_rule = desc
                break
        if not refund_rule:
            # 检查是否有"不得退票"类规则
            for rule in itinerary.get("ruleInfos", []):
                if rule.get("ruleType") == "REFUND":
                    refund_rule = rule.get("description", "")
                    break

        # ── 组装 ──
        return {
            "trip_id": trip_id,
            "crawl_time": crawl_time,
            "dep_airport": dep_airport,
            "arr_airport": arr_airport,
            "dep_date": dep_date,
            "dep_time": dep_time,
            "arr_time": arr_time,
            "airline_code": airline_code,
            "flight_no": str(flight_no),
            "itinerary_type": itinerary_type,
            "across_day": across_day,
            "price_no_tax": price_no_tax,
            "price_with_tax": price_with_tax,
            "tax_amount": tax_amount,
            "full_y_fare": full_y_fare,
            "discount": discount,
            "booking_class": booking_class,
            "inventory_qty": inventory_qty,
            "over_take": over_take,
            "luggage_free": luggage_free,
            "luggage_carry": luggage_carry,
            "meal_service": meal_service,
            "refund_rule": refund_rule,
            "segment_count": segment_count,
            "stay_duration": stay_duration,
            "overnight": overnight,
            "aircraft_name": aircraft_name,
            "total_duration": total_duration,
            "raw_json": json.dumps(itinerary, ensure_ascii=False),
        }

    except Exception as e:
        loguru.logger.warning(f"解析 itinerary 失败: {e}, trip_id={itinerary.get('id')}")
        return None


# ──────────────────────────────────────────────
# 批量入库
# ──────────────────────────────────────────────

INSERT_SQL = """
INSERT IGNORE INTO flight_itineraries (
    trip_id, crawl_time,
    dep_airport, arr_airport, dep_date, dep_time, arr_time,
    airline_code, flight_no, itinerary_type, across_day,
    price_no_tax, price_with_tax, tax_amount, full_y_fare, discount,
    booking_class, inventory_qty, over_take,
    luggage_free, luggage_carry,
    meal_service, refund_rule,
    segment_count, stay_duration, overnight,
    aircraft_name, total_duration,
    raw_json
) VALUES (
    %(trip_id)s, %(crawl_time)s,
    %(dep_airport)s, %(arr_airport)s, %(dep_date)s, %(dep_time)s, %(arr_time)s,
    %(airline_code)s, %(flight_no)s, %(itinerary_type)s, %(across_day)s,
    %(price_no_tax)s, %(price_with_tax)s, %(tax_amount)s, %(full_y_fare)s, %(discount)s,
    %(booking_class)s, %(inventory_qty)s, %(over_take)s,
    %(luggage_free)s, %(luggage_carry)s,
    %(meal_service)s, %(refund_rule)s,
    %(segment_count)s, %(stay_duration)s, %(overnight)s,
    %(aircraft_name)s, %(total_duration)s,
    %(raw_json)s
)
"""


def save_itineraries(itineraries: list[dict], crawl_time: datetime = None) -> int:
    """
    批量解析并保存航班数据。
    返回成功入库的行数。
    """
    if crawl_time is None:
        crawl_time = datetime.now()

    rows = []
    for it in itineraries:
        parsed = parse_itinerary(it, crawl_time)
        if parsed:
            rows.append(parsed)

    if not rows:
        loguru.logger.warning("没有可入库的数据")
        return 0

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            count = cursor.executemany(INSERT_SQL, rows)
        conn.commit()
        loguru.logger.info(f"入库完成: {count} 条 / 共 {len(itineraries)} 条")
        return count
    except Exception as e:
        conn.rollback()
        loguru.logger.error(f"入库失败: {e}")
        raise
    finally:
        conn.close()


# ──────────────────────────────────────────────
# 从 API 响应直接提取并入库
# ──────────────────────────────────────────────

def save_from_api_response(response_json: dict, crawl_time: datetime = None) -> int:
    """
    传入 API 返回的完整 JSON，自动提取 airItineraries 并入库。
    返回入库条数。
    """
    if crawl_time is None:
        crawl_time = datetime.now()

    # 解析响应结构: data.originDestinations[].airItineraries[]
    data = response_json.get("data", {})
    origin_dests = data.get("originDestinations", [])

    all_itineraries = []
    for od in origin_dests:
        air_its = od.get("airItineraries", [])
        all_itineraries.extend(air_its)

    if not all_itineraries:
        loguru.logger.warning("API 响应中没有航班数据")
        return 0

    return save_itineraries(all_itineraries, crawl_time)


# ──────────────────────────────────────────────
# 独立运行：测试建表
# ──────────────────────────────────────────────

if __name__ == "__main__":
    init_db()
    print("建表成功！请检查数据库。")
