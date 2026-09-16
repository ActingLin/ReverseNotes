-- ============================================================================
-- che168 二手车数据建表脚本
--
-- 列名与 che168_to_db/che168_to_db/items.py 的字段名一一对应（英文下划线风格），
-- 中文含义写在每列的 COMMENT 里。CSV 那边仍用中文表头，方便人阅读，两者不冲突。
--
-- 执行方式（在 Work/spider/che168/ 目录下，任选一种）：
--
--   1) 直接管道执行（推荐，不用进容器）：
--      MSYS_NO_PATHCONV=1 docker exec -i mysql-scrapy mysql -uroot -p --default-character-set=utf8mb4 < sql/create_table.sql
--
--   2) 进容器后再执行：
--      docker exec -it mysql-scrapy mysql -uroot -p --default-character-set=utf8mb4
--      然后：USE scrapy_data; SOURCE /tmp/create_table.sql;
--
-- ⚠️ 建议带上 --default-character-set=utf8mb4。
--    mysql 客户端从管道读入时的默认字符集是 latin1，会把本文件的 UTF-8 字节按
--    latin1 解释再存成 utf8mb4（双重编码）。列名现在是英文，不受影响，
--    但**列的中文 COMMENT 会变乱码**。建完可核对：
--        docker exec mysql-scrapy mysql -uroot -p --default-character-set=utf8mb4 \
--            -e "USE scrapy_data; DESC car_info;"
--
-- ⚠️ 本脚本用的是 CREATE TABLE IF NOT EXISTS，表已存在时不会改动它。
--    如果之前建过中文列名的版本，需要先 DROP：
--        DROP TABLE IF EXISTS scrapy_data.car_info;
--    再执行本脚本。
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `scrapy_data`
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `scrapy_data`;

-- ----------------------------------------------------------------------------
-- 车辆列表表
--
-- 主键选 info_id（车辆的唯一编号），一辆车只会有一行。
-- 注意：同一辆车可能出现在多个地区的列表里（例如合肥列表里出现武汉的车源），
--       这是正常现象，不在爬取阶段过滤，靠主键去重即可。
--       写入时建议用：
--           INSERT INTO car_info (...) VALUES (...)
--           ON DUPLICATE KEY UPDATE price=VALUES(price), ...;
--       这样重复爬到同一辆车时会更新最新信息，而不是报错或产生重复行。
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `car_info` (
    -- ---------- 基础信息 ----------
    `info_id`         VARCHAR(32)     NOT NULL                COMMENT '车辆唯一编号，主键。源数据为li标签的infoid属性｜CSV: 信息ID',
    `car_name`        VARCHAR(255)    NULL                    COMMENT '车辆完整名称，如：奔驰E级 2020款 E 300 L 豪华型｜CSV: 车辆完整名称',
    `specid`          VARCHAR(20)     NULL                    COMMENT '车168的车型规格编号｜CSV: 规格配置ID',

    -- ---------- 价格信息 ----------
    `price`           DECIMAL(10,2)   NULL                    COMMENT '当前售价，单位万元｜CSV: 当前售价',
    `guide_price`     DECIMAL(10,2)   NULL                    COMMENT '新车指导价，单位万元，来自列表页的<s>标签｜CSV: 新车指导价',
    `mileage`         DECIMAL(10,2)   NULL                    COMMENT '行驶里程，单位万公里｜CSV: 行驶里程',

    -- ---------- 车况信息 ----------
    `reg_date`        VARCHAR(10)     NULL                    COMMENT '上牌日期，格式YYYY/MM。源数据只到月份，故不用DATE类型｜CSV: 上牌日期',

    -- ---------- 地理位置 ----------
    `province_id`     VARCHAR(12)     NULL                    COMMENT '省份ID，6位行政区划代码，如340000｜CSV: 省份ID',
    `city_id`         VARCHAR(12)     NULL                    COMMENT '城市ID，6位行政区划代码，如340100｜CSV: 城市ID',
    `city_name`       VARCHAR(64)     NULL                    COMMENT '城市名称，如：合肥｜CSV: 城市名称',

    -- ---------- 经销商 ----------
    `dealer_id`       VARCHAR(20)     NULL                    COMMENT '车168经销商编号｜CSV: 经销商ID',

    -- ---------- 链接 & 图片 ----------
    `detail_url`      VARCHAR(512)    NULL                    COMMENT '详情页链接，实际存的是完整URL（爬虫已做urljoin）｜CSV: 详情页相对路径',
    `img_url`         VARCHAR(512)    NULL                    COMMENT '缩略图完整URL，https开头｜CSV: 缩略图URL',

    -- ---------- 状态标志 ----------
    `is_newcar`       TINYINT         NULL                    COMMENT '是否新车 0/1｜CSV: 是否新车',
    `is_credit`       TINYINT         NULL                    COMMENT '是否支持贷款 0/1｜CSV: 是否支持贷款',
    `is_cpl`          TINYINT         NULL                    COMMENT '是否已售 0/1｜CSV: 是否已售',
    `is_afteraudit`   INT             NULL                    COMMENT '车168内部审核状态码｜CSV: 审核状态码',
    `is_recom`        INT             NULL                    COMMENT '车168内部推荐级别｜CSV: 推荐级别',

    -- ---------- 发布 & 追踪 ----------
    -- ⚠️ 源数据是 UTC 时间，形如 2026-09-07T15:32:09Z（结尾带 Z）。
    --    写库前必须转换，不能直接把字符串塞进来。两种做法二选一：
    --      a) 想存北京时间：datetime.strptime(s, '%Y-%m-%dT%H:%M:%SZ') + timedelta(hours=8)
    --      b) 想存 UTC：    datetime.strptime(s, '%Y-%m-%dT%H:%M:%SZ')
    --    选一种并统一，否则查出来的时间会差 8 小时且不自知。
    `public_date`     DATETIME        NULL                    COMMENT '车辆发布时间。注意源数据是UTC，见上方说明｜CSV: 发布日期时间',
    `query_id`        VARCHAR(64)     NULL                    COMMENT '车168追踪用ID，形如1789225247$0$$73822$3｜CSV: 查询会话ID',
    `recom_id`        VARCHAR(20)     NULL                    COMMENT '车168推荐位编号｜CSV: 推荐ID',

    -- ---------- 抓取元信息 ----------
    `page`            INT             NULL                    COMMENT '该车被抓到时所处的列表页页码｜CSV: 当前页码',
    `pos`             INT             NULL                    COMMENT '该车在列表页中的排位｜CSV: 在列表中的位置',
    `car_unit`        VARCHAR(255)    NULL                    COMMENT '列表页原始文本「里程／上牌／城市／会员」，便于备查（CSV 未导出此列）',

    -- ---------- 入库时间（数据库自动维护，爬虫不用管） ----------
    `created_at`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP                          COMMENT '首次入库时间',
    `updated_at`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间（重复爬到时刷新）',

    PRIMARY KEY (`info_id`),

    -- 常用查询维度的索引。索引能加快查询但会拖慢写入，
    -- 后续导入大批量数据时如果嫌慢，可以先把这几个 KEY 注释掉，导完再补建。
    KEY `idx_city_id`      (`city_id`),
    KEY `idx_province_id`  (`province_id`),
    KEY `idx_dealer_id`    (`dealer_id`),
    KEY `idx_public_date`  (`public_date`),
    KEY `idx_price`        (`price`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='che168 二手车列表数据';

-- ----------------------------------------------------------------------------
-- 建好后自查（可选）
-- ----------------------------------------------------------------------------
-- SHOW TABLES;
-- DESC car_info;
-- SELECT COUNT(*) FROM car_info;
