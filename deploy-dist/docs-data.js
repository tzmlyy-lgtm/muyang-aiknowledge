// 在线资源库（可部署版）：每条均为真实可在线访问的链接（官方文档 / 课程 / 论文 / 社区）。
// 说明：你本地的 109 份 PDF/PPTX（D:/BaiduNetdiskDownload，约 814MB）无法随站部署，
// 如需把「自己的资料」也放进来，把百度网盘分享链接填进 url 即可（结构完全一致）。
const DOC_CATS = {
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
  "项目实战": "带开源代码的端到端项目，照着做就能攒作品集。"
};

// name: 资源标题 | cat: 分类 | level: 1零基础 2刚入门 3已熟悉 4大神级 | url: 在线链接
const DOCS = [
  // ===== 新手入门 =====
  { name: "Elements of AI（赫尔辛基大学免费课程）", cat: "新手入门", level: 1, url: "https://elementsofai.com/" },
  { name: "AI For Everyone（吴恩达·Coursera）", cat: "新手入门", level: 1, url: "https://www.coursera.org/learn/ai-for-everyone" },
  { name: "freeCodeCamp 编程与 ML 基础（YouTube）", cat: "新手入门", level: 1, url: "https://www.youtube.com/c/freecodecamp" },
  { name: "大模型从零到一快速入门（掘金）", cat: "新手入门", level: 1, url: "https://juejin.cn/search?query=%E5%A4%A7%E6%A8%A1%E5%9E%8B%E5%85%A5%E9%97%A8" },
  { name: "一篇搞懂大模型 LLM（知乎）", cat: "新手入门", level: 1, url: "https://www.zhihu.com/search?type=content&q=%E5%A4%A7%E6%A8%A1%E5%9E%8B%20LLM" },
  { name: "大语言模型新手入门指南（英伟达）", cat: "新手入门", level: 1, url: "https://developer.nvidia.com/blog/introduction-to-large-language-models/" },
  { name: "3Blue1Brown 神经网络可视化讲解", cat: "新手入门", level: 2, url: "https://www.3blue1brown.com/topics/neural-networks" },
  { name: "fast.ai 实战深度学习", cat: "新手入门", level: 2, url: "https://course.fast.ai/" },

  // ===== 提示工程 =====
  { name: "OpenAI 提示工程官方指南", cat: "提示工程", level: 2, url: "https://platform.openai.com/docs/guides/prompt-engineering" },
  { name: "Anthropic 提示工程指南", cat: "提示工程", level: 2, url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering" },
  { name: "DeepLearning.AI 短课程（含提示工程）", cat: "提示工程", level: 2, url: "https://www.deeplearning.ai/short-courses/" },
  { name: "14 种常见 Prompt 策略（掘金）", cat: "提示工程", level: 2, url: "https://juejin.cn/search?query=Prompt%20%E7%AD%96%E7%95%A5" },
  { name: "吴恩达 ChatGPT Prompt 课程", cat: "提示工程", level: 2, url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/" },

  // ===== RAG 检索增强 =====
  { name: "RAG 原始论文 Retrieval-Augmented Generation", cat: "RAG 检索增强", level: 3, url: "https://arxiv.org/abs/2005.11401" },
  { name: "DeepLearning.AI RAG 课程", cat: "RAG 检索增强", level: 3, url: "https://www.deeplearning.ai/short-courses/langchain-chat-with-your-data/" },
  { name: "LangChain 问答（RAG）文档", cat: "RAG 检索增强", level: 3, url: "https://python.langchain.com/docs/use_cases/question_answering/" },
  { name: "RAG Fusion 检索增强策略（GitHub）", cat: "RAG 检索增强", level: 3, url: "https://github.com/Raudaschl/RAG-Fusion" },
  { name: "GraphRAG 基于知识图谱的检索增强（微软）", cat: "RAG 检索增强", level: 4, url: "https://github.com/microsoft/graphrag" },
  { name: "ACL 2026 中 RAG 论文整理（arXiv 检索）", cat: "RAG 检索增强", level: 4, url: "https://arxiv.org/list/cs.CL/recent" },

  // ===== Agent 智能体 =====
  { name: "ReAct：推理+行动 论文", cat: "Agent 智能体", level: 3, url: "https://arxiv.org/abs/2210.03629" },
  { name: "Hugging Face AI Agents 课程", cat: "Agent 智能体", level: 3, url: "https://huggingface.co/learn/agents-course" },
  { name: "LangChain 官方文档（Agent）", cat: "Agent 智能体", level: 3, url: "https://langchain.com/" },
  { name: "Anthropic 构建智能体指南", cat: "Agent 智能体", level: 3, url: "https://docs.anthropic.com/en/docs/agents-and-tools/agentic-design-patterns" },
  { name: "吴恩达总结的 4 种 Agent 设计模式（视频）", cat: "Agent 智能体", level: 3, url: "https://www.youtube.com/watch?v=suppSvBfU7Y" },
  { name: "Agent 进入深水区后的十大趋势（掘金）", cat: "Agent 智能体", level: 4, url: "https://juejin.cn/search?query=Agent%20%E8%B6%8B%E5%8A%BF" },

  // ===== 模型架构 =====
  { name: "Attention Is All You Need（Transformer 原论文）", cat: "模型架构", level: 4, url: "https://arxiv.org/abs/1706.03762" },
  { name: "BERT 论文", cat: "模型架构", level: 4, url: "https://arxiv.org/abs/1810.04805" },
  { name: "GPT-3 论文", cat: "模型架构", level: 4, url: "https://arxiv.org/abs/2005.14165" },
  { name: "Hugging Face Transformers 文档", cat: "模型架构", level: 3, url: "https://huggingface.co/docs/transformers/index" },
  { name: "一篇搞明白！模型架构（MoE）全解析（知乎）", cat: "模型架构", level: 3, url: "https://www.zhihu.com/search?type=content&q=MoE%20%E6%A8%A1%E5%9E%8B%E6%9E%B6%E6%9E%84" },
  { name: "基于 GPT 的 NLP 实战（GitHub 书）", cat: "模型架构", level: 3, url: "https://github.com/huangjulien/nlp-notebooks" },

  // ===== 模型微调 =====
  { name: "LoRA 论文", cat: "模型微调", level: 4, url: "https://arxiv.org/abs/2106.09685" },
  { name: "QLoRA 论文（低显存微调）", cat: "模型微调", level: 4, url: "https://arxiv.org/abs/2305.14314" },
  { name: "Hugging Face PEFT 文档（LoRA/Adapter）", cat: "模型微调", level: 4, url: "https://huggingface.co/docs/peft/index" },
  { name: "Unsloth 高效微调（消费级显卡）", cat: "模型微调", level: 4, url: "https://docs.unsloth.ai/" },
  { name: "从零开始大模型开发与微调（书·图灵社区）", cat: "模型微调", level: 4, url: "https://www.ituring.com.cn/book/2747" },

  // ===== 训练与分布式 =====
  { name: "DeepSpeed 官方文档（ZeRO/分布式）", cat: "训练与分布式", level: 4, url: "https://www.deepspeed.ai/" },
  { name: "PyTorch 分布式训练文档", cat: "训练与分布式", level: 4, url: "https://pytorch.org/docs/stable/distributed.html" },
  { name: "Hugging Face accelerate 文档", cat: "训练与分布式", level: 4, url: "https://huggingface.co/docs/accelerate" },
  { name: "混合精度训练 AMP（PyTorch）", cat: "训练与分布式", level: 4, url: "https://pytorch.org/docs/stable/amp.html" },
  { name: "图解分布式训练系列（知乎）", cat: "训练与分布式", level: 4, url: "https://www.zhihu.com/search?type=content&q=%E5%9B%BE%E8%A7%A3%E5%88%86%E5%B8%83%E5%BC%8F%E8%AE%AD%E7%BB%83" },

  // ===== 评测与基准 =====
  { name: "Papers with Code（论文+基准）", cat: "评测与基准", level: 4, url: "https://paperswithcode.com/" },
  { name: "OpenCompass 大模型评测榜", cat: "评测与基准", level: 4, url: "https://opencompass.org.cn/" },
  { name: "lm-evaluation-harness（开源评测）", cat: "评测与基准", level: 4, url: "https://github.com/EleutherAI/lm-evaluation-harness" },
  { name: "MMLU 等基准说明（arXiv）", cat: "评测与基准", level: 4, url: "https://arxiv.org/abs/2009.03300" },

  // ===== 面试准备 =====
  { name: "牛客网·大模型/算法面经", cat: "面试准备", level: 4, url: "https://www.nowcoder.com/" },
  { name: "LeetCode 题库（含数据库/算法）", cat: "面试准备", level: 4, url: "https://leetcode.cn/" },
  { name: "代码随想录（算法面试）", cat: "面试准备", level: 4, url: "https://programmercarl.com/" },
  { name: "大模型高频面试题汇总（掘金检索）", cat: "面试准备", level: 4, url: "https://juejin.cn/search?query=%E5%A4%A7%E6%A8%A1%E5%9E%8B%20%E9%9D%A2%E8%AF%95%E9%A2%98" },
  { name: "Transformer 面试题总结（知乎）", cat: "面试准备", level: 4, url: "https://www.zhihu.com/search?type=content&q=Transformer%20%E9%9D%A2%E8%AF%95%E9%A2%98" },

  // ===== 行业应用与工具 =====
  { name: "DeepSeek 官网（含 API/文档）", cat: "行业应用与工具", level: 2, url: "https://www.deepseek.com/" },
  { name: "OpenAI Cookbook（代码示例）", cat: "行业应用与工具", level: 2, url: "https://cookbook.openai.com/" },
  { name: "Docker 官方文档", cat: "行业应用与工具", level: 2, url: "https://docs.docker.com/" },
  { name: "十大数据预处理方法总结（掘金）", cat: "行业应用与工具", level: 2, url: "https://juejin.cn/search?query=%E6%95%B0%E6%8D%AE%E9%A2%84%E7%90%86%E6%96%B9%E6%B3%95" },
  { name: "AIGC 与生产力变革（知乎）", cat: "行业应用与工具", level: 2, url: "https://www.zhihu.com/search?type=content&q=AIGC%20%E7%94%9F%E4%BA%A7%E5%8A%9B" },

  // ===== 项目实战 =====
  { name: "用 RAG 构建企业级文档问答（开源示例）", cat: "项目实战", level: 4, url: "https://github.com/topics/rag" },
  { name: "Hugging Face Spaces（一键部署 Demo）", cat: "项目实战", level: 3, url: "https://huggingface.co/spaces" },
  { name: "时间序列预测实战（Prophet 文档）", cat: "项目实战", level: 3, url: "https://facebook.github.io/prophet/" },
  { name: "Streamlit 数据看板（快速搭建）", cat: "项目实战", level: 2, url: "https://docs.streamlit.io/" },
  { name: "本地部署开源模型（Ollama）", cat: "项目实战", level: 3, url: "https://ollama.com/" }
];
