# -*- coding: utf-8 -*-
"""读取 D:/BaiduNetdiskDownload 下的 21 篇 .md，按站点四大方向（Python / MySQL / 数据分析 / AI）归类并嵌入 notes-data.js。
构建期方案：正文直接写进 JS 变量，本地双击(file://)与 GitHub Pages 部署均可用。
"""
import os, json, re

SRC_DIR = r"D:/BaiduNetdiskDownload"
OUT = os.path.join(os.path.dirname(__file__), "notes-data.js")

# 四大方向（顺序即展示顺序）
CATS = [
    ("python", "Python",      "🐍"),
    ("mysql",  "MySQL",       "🗄️"),
    ("data",   "数据分析",     "📈"),
    ("ai",     "AI / 大模型",  "🤖"),
]

# 文件名 -> 方向（显式映射，避免关键词冲突）
MAP = {
    # —— Python ——（当前笔记暂无纯 Python 主题，保留空类便于后续补充）
    # —— MySQL ——（当前笔记暂无数据库主题，保留空类便于后续补充）
    # —— 数据分析 ——
    "6个机器学习的核心算法.md": "data",
    "十大数据预处理方法总结.md": "data",
    "十大时间序列模型最强总结手册 (无图版).md": "data",
    "十大时间序列模型最强总结手册.md": "data",
    # —— AI / 大模型 ——
    "AI大模型提示词技巧.md": "ai",
    "14种常见的Prompt策略.md": "ai",
    "大模型提示词工程分类.md": "ai",
    "RAG聊天机器人 VS AI Agent：哪个更高效？.md": "ai",
    "高级RAG技术.md": "ai",
    "Agent进入深水区后的十大趋势.md": "ai",
    "人工智能Agent的基本原理与架构.md": "ai",
    "API调用大模型.md": "ai",
    "一篇搞懂大模型LLM.md": "ai",
    "大型语言模型的11种高效微调方法.md": "ai",
    "基准测试（Benchmark）.md": "ai",
    "Docker 命令汇总.md": "ai",
    "大模型部署：Rerank 模型的部署及使用.md": "ai",
    "【大模型项目实战】使用RAG技术构建企业级文档问答系统之QA抽取，非常详细！（含开源代码）.md": "ai",
    "掌握AI项目成功的10个关键步骤.md": "ai",
    "【图文】大模型算法岗常见面试题及答案解析.md": "ai",
    "各个行业的AI大模型：医疗、心理、法律、金融、教育.....md": "ai",
}
CAT_NAME = {c[0]: c[1] for c in CATS}

def excerpt(md):
    # 去代码块、图片、标题符号，取前 90 字做摘要
    txt = re.sub(r"```[\s\S]*?```", " ", md)
    txt = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", txt)
    txt = re.sub(r"[#>*_`\-]+", " ", txt)
    txt = re.sub(r"\s+", " ", txt).strip()
    return txt[:90] + ("…" if len(txt) > 90 else "")

notes = []
missing = []
for fn, cat in MAP.items():
    path = os.path.join(SRC_DIR, fn)
    if not os.path.exists(path):
        missing.append(fn); continue
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    title = os.path.splitext(fn)[0]
    notes.append({
        "id": len(notes) + 1,
        "title": title,
        "cat": cat,
        "catName": CAT_NAME[cat],
        "excerpt": excerpt(content),
        "content": content,
        "src": path,
    })

with open(OUT, "w", encoding="utf-8") as f:
    f.write("// 自动生成，请勿手改。来源：D:/BaiduNetdiskDownload（21 篇 .md 学习笔记）\n")
    f.write("// 归类：站点四大方向 Python / MySQL / 数据分析 / AI\n")
    f.write("const NOTE_CATS = " + json.dumps(CATS, ensure_ascii=False) + ";\n")
    f.write("const NOTES = " + json.dumps(notes, ensure_ascii=False) + ";\n")

print("OK 生成 notes-data.js，共 %d 篇" % len(notes))
from collections import Counter
c = Counter(n["cat"] for n in notes)
for cid, _, _ in CATS:
    print("  %-8s %s : %d" % (cid, CAT_NAME[cid], c.get(cid, 0)))
if missing:
    print("MISSING:", missing)
