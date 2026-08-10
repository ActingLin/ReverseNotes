# -*- coding: utf-8 -*-
"""
数据收集器: 搜索 + 分页 + 解密 + 持久化。
Python 拥有 HTTP/分页/重试/解析/存储, JS 仅被复刻为纯 Python 加密原语。
"""
import json
import os
import random
import time

import urllib.request
import urllib.error

from collector import crypto
from collector import protocol
from collector import config as cfg
from collector.config import CollectorConfig, validate_config


class BirdReportCollector:
    def __init__(self, cfg_obj: CollectorConfig):
        self.cfg = cfg_obj

    # ------------------------------------------------------------------ HTTP
    def _post(self, form_string: str):
        """单次 POST, 返回解密后的 JSON。共享请求预算在外部计数。"""
        hdr = protocol.build_request_headers(form_string)
        body = protocol.build_body(form_string)
        wire_headers = protocol.build_headers(hdr)
        req = urllib.request.Request(
            cfg.SEARCH_URL,
            data=body.encode("utf-8"),
            headers=wire_headers,
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=cfg.REQUEST_TIMEOUT) as resp:
            raw = resp.read(cfg.MAX_RESPONSE_BYTES)
        resp_obj = json.loads(raw.decode("utf-8"))
        return resp_obj

    def _post_with_retry(self, form_string: str):
        """指数退避 + 抖动重试 (幂等只读请求)。"""
        last = None
        for attempt in range(cfg.RETRY_TIMES + 1):
            try:
                return self._post(form_string)
            except (urllib.error.HTTPError, urllib.error.URLError,
                    json.JSONDecodeError, UnicodeDecodeError) as e:
                last = e
                if attempt < cfg.RETRY_TIMES:
                    sleep_s = cfg.RETRY_BACKOFF_BASE * (2 ** attempt) + random.random()
                    time.sleep(sleep_s)
        raise RuntimeError(f"请求失败(已重试 {cfg.RETRY_TIMES} 次): {last}")

    # ------------------------------------------------------------------ 业务
    def fetch_page(self, page: int):
        """抓取单页并解密。返回 (rows, count)。"""
        form = self.cfg.next_page_form(page)
        resp_obj = self._post_with_retry(form)
        code = resp_obj.get("code")
        if code in (505, 405):
            raise RuntimeError(f"服务端风险控制 code={code}, 被要求走验证码页")
        if code != 0:
            raise RuntimeError(f"接口返回异常 code={code}, msg={resp_obj.get('msg')}")
        count = resp_obj.get("count") or 0
        data = resp_obj.get("data")
        if not data:
            return [], count
        plain = crypto.aes_decode(data)
        rows = json.loads(plain)
        if not isinstance(rows, list):
            raise RuntimeError(f"解密结果不是数组: {type(rows)}")
        return rows, count

    def collect(self):
        """顺序翻页收集全部结果。返回最终列表。"""
        if not self.cfg.confirm_live:
            raise RuntimeError("未开启 --confirm-live, 拒绝发送真实流量")
        problems = validate_config(self.cfg)
        if problems:
            raise RuntimeError("配置校验失败: " + "; ".join(problems))

        all_rows = []
        page = self.cfg.page_start
        budget = cfg.TOTAL_REQUEST_BUDGET
        while True:
            if budget <= 0:
                print("[warn] 请求预算耗尽, 提前停止")
                break
            budget -= 1
            rows, count = self.fetch_page(page)
            print(f"[page {page}] rows={len(rows)} total={count}")
            all_rows.extend(rows)
            # 最后一页判定: 本页不足 page_size 或已到总条数
            if len(rows) < self.cfg.page_size or len(all_rows) >= count:
                break
            if self.cfg.max_pages and (page - self.cfg.page_start + 1) >= self.cfg.max_pages:
                break
            page += 1
        return all_rows

    # ------------------------------------------------------------------ 持久化
    def save(self, rows: list):
        out_dir = self.cfg.output_path
        os.makedirs(out_dir, exist_ok=True)
        if self.cfg.out_format == "csv":
            self._save_csv(rows, os.path.join(out_dir, "records.csv"))
        else:
            path = os.path.join(out_dir, "records.json")
            with open(path, "w", encoding="utf-8") as f:
                json.dump(rows, f, ensure_ascii=False, indent=2)
            print(f"saved {len(rows)} rows -> {path}")

    @staticmethod
    def _save_csv(rows: list, path: str):
        import csv
        if not rows:
            print("empty, skip csv")
            return
        # 简单防注入: 前缀 = 的单元格加单引号
        keys = list(rows[0].keys())
        with open(path, "w", encoding="utf-8-sig", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            for r in rows:
                writer.writerow({k: r.get(k) for k in keys})
        print(f"saved {len(rows)} rows -> {path}")
