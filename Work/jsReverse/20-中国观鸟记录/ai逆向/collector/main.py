# -*- coding: utf-8 -*-
"""
CLI 入口。支持两种调用方式:
  python -m collector.main            (项目根目录)
  python main.py                      (collector/ 目录内)

无参数运行时即按默认值执行:
  python main.py
  等价于 python main.py --max-pages 2 --output <项目根>/output --format csv
  默认直接发送真实流量 (可用 --dry-run 关闭)。
"""
import argparse
import os
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 兼容直接运行: python main.py。直接运行时无父包上下文,
# 需把项目根目录插入 sys.path 以解析 collector 包。
if __package__ in (None, ""):
    sys.path.insert(0, PROJECT_ROOT)


def _parse_where(s: str) -> dict:
    """解析 --where 'serialId=xx,username=yy' 为 dict。"""
    out = {}
    if not s:
        return out
    for item in s.split(","):
        if "=" in item:
            k, v = item.split("=", 1)
            out[k] = v
    return out


def main(argv=None):
    ap = argparse.ArgumentParser(description="中国观鸟记录中心 活动记录收集器")
    ap.add_argument("--dry-run", action="store_true",
                    help="不发送真实流量, 仅校验配置 (默认会真实请求)")
    ap.add_argument("--page-size", type=int, default=20, help="每页条数 20/50")
    ap.add_argument("--start-page", type=int, default=1)
    ap.add_argument("--max-pages", type=int, default=2, help="抓取页数上限, 0=全部")
    ap.add_argument("--where", default="", help="搜索条件, 如 'username=liuqin127,pointName=北川水湾'")
    ap.add_argument("--sort-by", default=None)
    ap.add_argument("--order-by", default=None, choices=["asc", "desc"])
    ap.add_argument("--output", default=None,
                    help=f"输出目录 (默认: {os.path.join(PROJECT_ROOT, 'output')})")
    ap.add_argument("--format", default="csv", choices=["json", "csv"])
    args = ap.parse_args(argv)

    from collector.config import CollectorConfig, validate_config

    # 默认输出到项目根/output (从 collector/ 目录运行时即 ../output)
    out_path = args.output or os.path.join(PROJECT_ROOT, "output")

    cfg_obj = CollectorConfig(
        page_start=args.start_page,
        page_size=args.page_size,
        max_pages=args.max_pages,
        where=_parse_where(args.where),
        sort_by=args.sort_by,
        order_by=args.order_by,
        output_path=out_path,
        out_format=args.format,
        confirm_live=not args.dry_run,
    )

    # dry-run: 只校验配置并预览, 不发真实流量
    if args.dry_run:
        problems = validate_config(cfg_obj)
        if problems:
            print("配置校验:")
            for p in problems:
                print("  -", p)
        else:
            print("配置校验: 通过")
        print(f"[dry-run] 请求: {cfg_obj.next_page_form(cfg_obj.page_start)}")
        print(f"[dry-run] 输出: {out_path} ({args.format})")
        return

    from collector.collector import BirdReportCollector
    col = BirdReportCollector(cfg_obj)
    rows = col.collect()
    col.save(rows)
    print(f"done, {len(rows)} rows in total")


if __name__ == "__main__":
    main()
