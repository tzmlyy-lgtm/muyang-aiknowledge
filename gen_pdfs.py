# -*- coding: utf-8 -*-
"""读取 D:/BaiduNetdiskDownload 下的 PDF/PPTX，按四大方向分类、去重，生成 pdfs-data.js（构建期嵌入，本地双击与部署均可用）。
注意：这是只读扫描，不会移动/删除任何个人文件；生成的链接为 file:// 本地路径（双击打开可用）。
"""
import os, json
from urllib.parse import quote

SRC_DIR = r"D:/BaiduNetdiskDownload"
OUT = os.path.join(os.path.dirname(__file__), "pdfs-data.js")

CATS = [
    ("python", "Python / 编程"),
    ("mysql",  "MySQL / 数据库"),
    ("data",   "数据分析 / 数据科学"),
    ("ai",     "AI / 大模型"),
]
CAT_NAME = {c[0]: c[1] for c in CATS}

KW = {
    "python": ["python", "pytorch", "numpy", "pandas", "tensorflow", "caffe", "scikit", "编程", "代码"],
    "mysql":  ["sql", "数据库", "mysql", "数仓", "数据仓库", "clickhouse", "hive", "postgres"],
    "data":   ["数据分析", "数据科学", "报表", "统计", "可视化", "大数据", "数智", "特征", "数据要素", "bi", "指标体系"],
}

def classify(name):
    low = name.lower()
    for cat, kws in KW.items():
        if any(k in low for k in kws):
            return cat
    return "ai"  # 大模型 / LLM / Agent / RAG 等默认归入 AI

records = []
seen = set()
total_size = 0
for fn in os.listdir(SRC_DIR):
    if not fn.lower().endswith((".pdf", ".pptx")):
        continue
    if fn in seen:
        continue
    seen.add(fn)
    path = os.path.join(SRC_DIR, fn)
    try:
        size = os.path.getsize(path)
    except OSError:
        continue
    total_size += size
    url = "file:///" + quote(os.path.abspath(path).replace("\\", "/"))
    records.append({
        "name": fn,
        "cat": classify(fn),
        "catName": CAT_NAME[classify(fn)],
        "size": round(size/1048576, 1),
        "url": url,
    })

# 排序：按方向分组，组内按文件名
records.sort(key=lambda r:(CATS.index((r["cat"], r["catName"])), r["name"]))

with open(OUT, "w", encoding="utf-8") as f:
    f.write("// 自动生成，请勿手改。来源：D:/BaiduNetdiskDownload（本地 PDF/PPTX 资料扫描，共 %d 份，%.1f MB）\n" % (len(records), total_size/1048576))
    f.write("// 链接为 file:// 本地路径，双击 index.html 时可打开；在线部署需将文件上传到网盘/对象存储后替换 url 字段。\n")
    f.write("const PDF_CATS = " + json.dumps(CATS, ensure_ascii=False) + ";\n")
    f.write("const PDFS = " + json.dumps(records, ensure_ascii=False) + ";\n")

print("OK 生成 pdfs-data.js，共 %d 份，%.1f MB" % (len(records), total_size/1048576))
from collections import Counter
c = Counter(r["cat"] for r in records)
for cid, cname in CATS:
    print("  %-8s %s : %d" % (cid, cname, c.get(cid, 0)))
