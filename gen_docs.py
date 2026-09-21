# -*- coding: utf-8 -*-
import os, json, urllib.parse

SRC = r"D:/BaiduNetdiskDownload"
OUT = r"D:/workbuddy/2026-08-29-17-25-58/docs-data.js"

# 分类规则：按顺序匹配，命中即归类（关键词均为小写）
RULES = [
    ("项目实战", ["项目实战", "含开源代码", "qa抽取"]),
    ("面试准备", ["面试", "面试题", "高频", "八股", "经验汇总", "岗位面试"]),
    ("Agent 智能体", ["agent", "智能体", "skill", "架构设计", "进入深水区", "设计模式", "框架"]),
    ("RAG 检索增强", ["rag", "向量库", "文档对话", "知识库", "rerank", "graph rag", "版面", "召回", "负样本", "rag-fusion"]),
    ("提示工程", ["提示", "prompt", "提示词"]),
    ("模型微调", ["微调", "lora", "peft", "adapter", "预训练", "二次预训练"]),
    ("训练与分布式", ["分布式", "deepspeed", "zero", "流水线", "ddp", "混合精度", "显存", "accelerate",
                    "训练经验", "训练集", "sft", "图解分布式", "强化学习", "rlhf", "ppo"]),
    ("模型架构", ["transformer", "moe", "layer normalization", "激活函数", "损失函数", "相似度",
                 "黑书", "架构", "gpt-3", "gpt-4", "自然语言处理"]),
    ("评测与基准", ["benchmark", "评测", "基准"]),
    ("行业应用与工具", ["行业", "医疗", "金融", "教育", "职场", "红利", "科研", "deepresearch",
                      "成功步骤", "幻觉", "部署", "docker", "数据预处理", "api", "办公", "aigc", "mcp", "本地部署"]),
]

LEVEL_BY_CAT = {
    "新手入门": 1, "提示工程": 2, "行业应用与工具": 2,
    "RAG 检索增强": 3, "模型架构": 3, "Agent 智能体": 3,
    "模型微调": 4, "训练与分布式": 4, "评测与基准": 4, "面试准备": 4, "项目实战": 4,
}

CAT_DESC = {
    "新手入门": "通识与入门读物，建立对 AI / 大模型的整体认知。",
    "提示工程": "如何写好 Prompt，让大模型稳定输出你想要的结果。",
    "RAG 检索增强": "检索增强生成：让模型基于你的资料回答，减少幻觉。",
    "Agent 智能体": "能自主规划、调用工具的 AI 智能体架构与框架。",
    "模型架构": "Transformer、MoE、注意力等底层结构与原理。",
    "模型微调": "LoRA、PEFT、预训练等让模型更懂你领域的方法。",
    "训练与分布式": "从训练经验到分布式、显存优化的工程实战。",
    "评测与基准": "如何科学地衡量模型能力（Benchmark）。",
    "面试准备": "大模型岗位高频面试题与实战经验汇总。",
    "行业应用与工具": "落地场景、部署工具与办公提效。",
    "项目实战": "带开源代码的端到端项目，照着做就能攒作品集。",
}

def classify(title):
    t = title.lower()
    # 面试：以"面.pdf"结尾（如 1-大模型基础面）
    if t.rstrip(".pdf").rstrip(".pptx").endswith("面"):
        return "面试准备"
    for cat, kws in RULES:
        if any(k in t for k in kws):
            return cat
    return "新手入门"

docs = []
for fn in sorted(os.listdir(SRC)):
    if not fn.lower().endswith((".pdf", ".pptx")):
        continue
    cat = classify(fn)
    level = LEVEL_BY_CAT.get(cat, 2)
    abs_path = os.path.join(SRC, fn)
    url = "file:///" + urllib.parse.quote(abs_path.replace("\\", "/"), safe="/:")
    docs.append({
        "name": fn,
        "cat": cat,
        "level": level,
        "url": url,
    })

# 统计
from collections import Counter
cnt = Counter(d["cat"] for d in docs)

with open(OUT, "w", encoding="utf-8") as f:
    f.write("// 自动生成：D:/BaiduNetdiskDownload 文档分类（按内容关键词归类）\n")
    f.write("const DOC_CATS = " + json.dumps(CAT_DESC, ensure_ascii=False, indent=2) + ";\n\n")
    f.write("const DOCS = " + json.dumps(docs, ensure_ascii=False, indent=2) + ";\n")

print("总文档数:", len(docs))
print("分类统计:")
for c, n in cnt.most_common():
    print(f"  {c}: {n}")
