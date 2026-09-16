# -*- coding: utf-8 -*-
"""
从 che168 首页响应(debug_response.html)中提取地区选择器
(div class="topbar-citypop-scity") 里的省份 / 城市链接。

产出:
    areas.json    —— 树形结构(省 -> 市), 便于分地区调度
    areas.jsonl   —— 扁平结构(一行一个地区), 便于逐条喂给爬虫

用法:
    python extract_areas.py
"""
import json
import re
from pathlib import Path

from lxml import html as lhtml

BASE_DIR = Path(__file__).resolve().parent
SRC = BASE_DIR / "debug_response.html"
OUT_TREE = BASE_DIR / "areas.json"
OUT_FLAT = BASE_DIR / "areas.jsonl"

BASE_URL = "https://www.che168.com"
# ⚠️ 这个文件里的 <meta charset=gb2312> 是骗人的: 实际字节是 UTF-8。
# 坑1: 按声明解 gb2312 -> 全是乱码。
# 坑2: lxml 拿到 str 后会转回字节, 再读到那个 meta 又按 gb2312 解一次 -> 二次乱码。
#      所以解码后必须先把 meta 里的编码声明改掉, 再丢给 lxml。
SRC_ENCODINGS = ("utf-8", "gb18030")  # 依次尝试
AREA_XPATH = '//div[@id="div_Area"]'
META_CHARSET_RE = re.compile(rb"charset=[\"']?[\w-]+", re.I)


def pick(el, name):
    """取属性, 缺失返回空串(避免 None 散落到 JSON 里)。"""
    return (el.get(name) or "").strip()


def parse_area(a_el):
    """<a> -> 地区字典, 并补上完整 URL。"""
    href = pick(a_el, "href")
    area = {
        "name": a_el.text_content().strip(),
        "pid": pick(a_el, "pid"),
        "cid": pick(a_el, "cid"),
        "id": pick(a_el, "id"),
        "areapy": pick(a_el, "areapy"),
        "href": href,
        # 页面里是 /hefei/list/#pvareaid=100943 这类相对链接, 补成绝对地址
        "url": BASE_URL + href if href.startswith("/") else href,
    }
    pname = pick(a_el, "pidName")
    if pname:  # 城市节点才带 pidName(所属省名)
        area["pid_name"] = pname
    return area


def main():
    raw = SRC.read_bytes()
    for enc in SRC_ENCODINGS:
        try:
            raw.decode(enc)
            break
        except UnicodeDecodeError:
            continue
    else:
        raise SystemExit(f"{SRC.name} 既不是 utf-8 也不是 gb18030, 请确认编码")

    # 把 meta 里的 gb2312 改写成 utf-8, 让 lxml 的编码推断跟真实字节一致
    neutralized = META_CHARSET_RE.sub(b"charset=utf-8", raw, count=1)
    doc = lhtml.fromstring(neutralized.decode("utf-8"))

    roots = doc.xpath(AREA_XPATH)
    if not roots:
        raise SystemExit(f"未在 {SRC.name} 中找到 id=div_Area 的地区面板")
    root = roots[0]

    provinces = []
    # 一个 <dl> 是按拼音首字母分组, 内部可能是 <dt>省</dt><dd>市</dd> 重复多组
    # (如 dl#G 里塞了广东/广西/贵州/甘肃四个省), 所以必须按 dt/dd 相邻配对,
    # 不能只取第一个 dt 再把所有 dd 并进去。
    for dl in root.xpath('./dl[contains(@class, "cap-city")]'):
        letter = dl.xpath('./dt//span[@class="nu"]/text()')
        letter = letter[0].strip() if letter else ""
        current = None
        for node in dl:
            if node.tag == "dt":
                # dt 下的 <a> 是省级入口; 全国节点(pid=0)也走这里
                links = node.xpath('./descendant::span[@class="tx"]/a')
                if not links:
                    current = None
                    continue
                current = parse_area(links[0])
                current["letter"] = letter
                current["cities"] = []
                provinces.append(current)
            elif node.tag == "dd" and current is not None:
                current["cities"] = [parse_area(a) for a in node.xpath('./a')]

    tree = {
        "source": SRC.name,
        "base_url": BASE_URL,
        "note": "href 形如 /{areapy}/list/#pvareaid=100943, url 为补全后的绝对地址",
        "province_count": len(provinces),
        "city_count": sum(len(p["cities"]) for p in provinces),
        "provinces": provinces,
    }

    OUT_TREE.write_text(
        json.dumps(tree, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    # 扁平化: 省级 + 市级各占一行, level 区分
    with OUT_FLAT.open("w", encoding="utf-8") as f:
        for prov in provinces:
            f.write(json.dumps({**prov, "level": "province", "cities": None},
                               ensure_ascii=False) + "\n")
            for city in prov["cities"]:
                f.write(json.dumps({**city, "level": "city"}, ensure_ascii=False) + "\n")

    print(f"省份/直辖: {tree['province_count']}, 城市: {tree['city_count']}")
    print(f"-> {OUT_TREE.name}")
    print(f"-> {OUT_FLAT.name}")
    for prov in provinces[:3]:
        print(f"  {prov['letter'] or '-'} {prov['name']}({prov['areapy']}) "
              f"{len(prov['cities'])} 市")
    print("  ...")


if __name__ == "__main__":
    main()
