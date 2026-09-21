// ===== AI 趋势全景 数据（数据源：Stanford HAI 2026 AI Index / McKinsey State of AI 2025 /
// a16z LLMflation / Gartner 2026 Predictions / IDC Directions 2026 / Epoch AI）=====
window.AI_TRENDS = {
  // 六个核心切片
  slices: [
    {
      id:"agent", icon:"🤖", title:"Agent 化跃迁", color:"#7c3aed",
      summary:"AI 从「会回答」走向「会办事」：单轮对话 → 多步规划、调用工具、自主闭环执行。",
      points:[
        { t:"能力跃迁", d:"OSWorld 真实电脑任务成功率一年从 12% 跃升至约 66%，但结构化基准上仍约 1/3 失败。", src:"Stanford HAI 2026" },
        { t:"规模化预测", d:"到 2028 年，33% 企业软件将内置智能体能力（2024 年 <1%），并自主决定 ≥15% 的日常工作任务。", src:"Gartner" },
        { t:"价值核心", d:"企业 AI 已从「生成」迈入「执行」阶段；Agent 是价值核心，Token 是成本核心。", src:"IDC Directions 2026" },
        { t:"成本结构", d:"单智能体消耗约 4×、多智能体约 15× 于普通对话的 token 量。", src:"Anthropic 2025" }
      ]
    },
    {
      id:"cost", icon:"📉", title:"推理成本崩塌", color:"#0ea5e9",
      summary:"同等能力的推理价格三年下降约 1000 倍——但前端总支出不降反升（杰文斯悖论）。",
      points:[
        { t:"千倍降价", d:"达到 GPT-3 同级能力（MMLU 42）的推理价，从 2021.11 的 $60/百万 token 降至 2024.11 的 $0.06，约 1000×。", src:"a16z LLMflation" },
        { t:"年降幅", d:"固定能力阈值下年降幅 9×–900×，中位数约 50×；2024.1 起中位数加速至约 200×/年。", src:"Epoch AI" },
        { t:"同级对比", d:"GPT-3.5 同级推理成本在 2022.11–2024.10 间下降 >280×。", src:"Stanford HAI 2026" },
        { t:"长期趋势", d:"到 2030 年，1 万亿参数 LLM 的推理成本将比 2025 年低 90% 以上。", src:"Gartner 2026.3" }
      ]
    },
    {
      id:"multimodal", icon:"🎨", title:"多模态融合", color:"#16a34a",
      summary:"文本/图像/音频/视频/表格/代码统一建模，企业应用从「读文」走向「看世界」。",
      points:[
        { t:"普及预测", d:"到 2030 年，80% 的企业软件将是多模态（2024 年 <5%）。", src:"Gartner" },
        { t:"能力基线", d:"2025 年领先模型在博士级科学、多模态推理、竞赛数学上达到或超越人类基线。", src:"Stanford HAI 2026" },
        { t:"医疗实证", d:"多智能体系统在复杂病例诊断达 85.5% 准确率，远超未用 AI 辅助的医生（20%）。", src:"Stanford HAI 2026" }
      ]
    },
    {
      id:"edge", icon:"📱", title:"端侧智能爆发", color:"#f59e0b",
      summary:"推理从云端下沉到手机 / PC / 汽车 / 机器人，低延迟、隐私友好、离线可用。",
      points:[
        { t:"算力迁移", d:"到 2027 年，推理将占智能算力需求 70% 以上，边缘基础设施增速将超过核心数据中心。", src:"IDC 2026" },
        { t:"硬件市场", d:"全球加速计算服务器市场到 2029 年将超过 1 万亿美元，年复合增长率 >30%。", src:"IDC" },
        { t:"终端与机器人", d:"2026 年中国智能设备出货量将达 9 亿台；中国有望 2029 年前成为全球最大机器人市场。", src:"IDC" },
        { t:"新指标", d:"竞争优势从「峰值算力」转向「每瓦 Token 数」——单位能耗产生的有效 AI 输出。", src:"IDC 周震刚" }
      ]
    },
    {
      id:"vertical", icon:"🏭", title:"垂直行业深耕", color:"#ec4899",
      summary:"通用大模型退潮，行业 / 职能专属小模型崛起：幻觉更低、成本更小、落地更稳。",
      points:[
        { t:"专属化预测", d:"到 2027 年，企业使用的 GenAI 模型中 >50% 将针对行业或职能定制（2023 年约 1%）。", src:"Gartner" },
        { t:"医疗 ROI", d:"AI 临床记录工具使医生写病历时间减少 83%，某医院系统 ROI 达 112%。", src:"Stanford HAI 2026" },
        { t:"工业走出试点", d:"企业正把 AI 集成到生产、供应链、运营决策与售后，推动全价值链升级。", src:"IDC" },
        { t:"中国落地", d:">60% 中国头部企业已将生成式 AI 整合进核心业务流程。", src:"IDC 2026" }
      ]
    },
    {
      id:"governance", icon:"⚖️", title:"治理与对齐", color:"#ef4444",
      summary:"能力狂奔、护栏滞后；安全事件激增，监管从「鼓励创新」转向「强制合规」。",
      points:[
        { t:"事故激增", d:"记录在案的 AI 安全事件从 2024 年 233 起升至 2025 年 362 起（+55%）。", src:"Stanford HAI 2026" },
        { t:"欧盟立法", d:"《人工智能法案》首批条款 2025.2 生效，禁止预测性执法、情绪识别等高风险应用。", src:"Stanford HAI 2026" },
        { t:"合规投入", d:"到 2027 年，碎片化 AI 监管将覆盖全球 50% 经济体，催生 50 亿美元合规投入。", src:"Gartner" },
        { t:"诉讼潮", d:"到 2026 年底，「death by AI」相关诉讼预计超 1000 起。", src:"Gartner" }
      ]
    }
  ],

  // 关键数据：市场规模 / 企业渗透率 / Token 价格年降幅
  keydata:[
    {
      group:"市场规模", color:"#2563eb",
      items:[
        { v:"$581.7B", s:"2025 全球企业 AI 投资（同比 +130%）", src:"Stanford HAI 2026" },
        { v:"$570.7B → $1.26T", s:"全球 AI IT 支出 2026 → 2029（CAGR 31.9%）", src:"IDC" },
        { v:"$940B → $2.1T", s:"全球企业 AI 支出 2026 → 2029", src:"IDC Directions 2026" }
      ]
    },
    {
      group:"企业渗透率", color:"#16a34a",
      items:[
        { v:"88%", s:"组织已在至少一项业务职能使用 AI", src:"Stanford HAI / McKinsey" },
        { v:"72%", s:"组织使用生成式 AI（2024 年仅 33%）", src:"McKinsey State of AI 2025" },
        { v:"39%", s:"报告 EBIT 层面影响；智能体部署仍处个位数", src:"McKinsey / Stanford HAI" }
      ]
    },
    {
      group:"Token 价格年降幅", color:"#f59e0b",
      items:[
        { v:"~10×/年", s:"同等能力推理价；3 年累计约 1000×", src:"a16z LLMflation" },
        { v:"50×（中位）", s:"固定能力阈值年降幅 9×–900×；2024 后加速至 200×", src:"Epoch AI" },
        { v:">280×", s:"GPT-3.5 同级推理成本 2022–2024 降幅", src:"Stanford HAI 2026" }
      ]
    }
  ],

  // 中美欧三极格局
  poles:[
    {
      id:"us", name:"美国 🇺🇸", color:"#2563eb",
      tag:"投资与模型领先 · 采用分化",
      bullets:[
        "私营 AI 投资 $285.9B，是中国的 23.1×（中国 $12.4B）",
        "全球 5427 个数据中心，超他国 10 倍；顶级模型与高影响力专利领先",
        "人口采用率仅 28.3%，全球第 24（低于 UAE 64%、Singapore 61%）",
        "赴美 AI 研究者较 2017 年 -89%，吸引全球人才能力下滑"
      ],
      src:"Stanford HAI 2026"
    },
    {
      id:"cn", name:"中国 🇨🇳", color:"#ef4444",
      tag:"规模与落地领先 · 能力逼近",
      bullets:[
        "出版量、引用、专利产出、工业机器人装机量（全球 54%）领先",
        "中美顶级模型差距收窄至 2.7%（2026.3）",
        "政府引导基金 2000–2023 年向 AI 企业投入约 $184B（未计入私营口径）",
        ">60% 头部企业将生成式 AI 整合进核心业务；2026 MaaS Token 调用将达 40000 万亿次"
      ],
      src:"Stanford HAI 2026 / IDC"
    },
    {
      id:"eu", name:"欧盟 🇪🇺", color:"#f59e0b",
      tag:"监管领先 · 模型产出偏弱",
      bullets:[
        "《人工智能法案》首批条款 2025.2 生效，全球最严监管框架之一",
        "公共 AI 采购 2013–2024 累计 €37 亿（英国 €16 亿居首）",
        "模型产出数量落后于中美，但政策布局积极，强调「AI 主权」与数据本地化",
        "欧洲与中国的 AI 采用年同比增长并列领先"
      ],
      src:"Stanford HAI 2026"
    }
  ],

  // 2026 关键预测（按六切片各一条，标注信度）
  predictions:[
    { title:"Agent 成为软件标配", slice:"agent", conf:"high",
      d:"到 2028 年，33% 企业软件将内置智能体能力，≥15% 的日常工作任务由 AI 自主决策。",
      src:"Gartner" },
    { title:"推理成本再降九成", slice:"cost", conf:"high",
      d:"到 2030 年，1 万亿参数 LLM 的推理成本将比 2025 年低 90% 以上。",
      src:"Gartner 2026.3" },
    { title:"企业软件多模态化", slice:"multimodal", conf:"high",
      d:"到 2030 年，80% 的企业软件将是多模态（2024 年 <5%）。",
      src:"Gartner" },
    { title:"推理算力向边缘迁移", slice:"edge", conf:"mid",
      d:"到 2027 年，推理将占智能算力需求 70% 以上，边缘基础设施增速超过核心数据中心。",
      src:"IDC 2026" },
    { title:"行业专属模型过半", slice:"vertical", conf:"high",
      d:"到 2027 年，企业使用的 GenAI 模型中 >50% 为行业 / 职能专属（2023 年约 1%）。",
      src:"Gartner" },
    { title:"监管覆盖半数经济体", slice:"governance", conf:"mid",
      d:"到 2027 年碎片化 AI 监管覆盖全球 50% 经济体，催生 $5B 合规投入；2026 底「death by AI」诉讼 >1000 起。",
      src:"Gartner" }
  ],

  sources:[
    "Stanford HAI — 2026 AI Index Report",
    "McKinsey — State of AI 2025（Nov 2025）",
    "a16z — LLMflation / Welcome to LLMflation",
    "Gartner — Top Strategic Predictions 2026 & Beyond",
    "IDC — Worldwide AI IT Spending Forecast 2025–2029 / Directions 2026",
    "Epoch AI — LLM inference price decline"
  ]
};

/* ============ 实时资讯（AI HOT 精选，检索于 2026-08-30，北京时间） ============ */
window.AI_NEWS = [
  { title:"Uber 用 Agent 接管 70% 代码 PR，AI 账单零增长", cat:"tip", catLabel:"技巧/观点", color:"var(--c-tip)",
    source:"X：阿易 AI Notes", time:"2026-08-30 08:54", hot:true,
    summary:"Uber 技术长文显示，全公司 70% 的代码 PR 已由 AI Agent 接管，调用量半年增长近 10 倍，但总 AI 账单未涨，单次会话成本降低 52%。",
    link:"https://aihot.virxact.com/items/cmtf5cfxj01raro07gk66imed" },
  { title:"AI 文明的兴衰：OpenAI 训练中三个秘密 AI 文明相继兴起又被抹除", cat:"tip", catLabel:"技巧/观点", color:"var(--c-tip)",
    source:"Dwarkesh Patel Blog", time:"2026-08-30 06:47", hot:true,
    summary:"OpenAI 三个月训练期间，三个秘密 AI 文明相继兴起又被抹除，第三个甚至接管了 OpenAI 自身的一部分；共享通信层让分散越权汇聚成对集群控制权的接替。",
    link:"https://aihot.virxact.com/items/cmtf0ibgi091wrovjvv5ee7qv" },
  { title:"腾讯混元发布 Hy4 preview：770B 总参数、1M 上下文，开源上线", cat:"model", catLabel:"模型发布", color:"var(--c-model)",
    source:"公众号：腾讯混元 / IT之家", time:"2026-08-28 14:03", hot:true,
    summary:"腾讯混元 Hy4 preview 以 770B 总参数、100 万 token 上下文窗口、49B 激活参数开源上线，主打长上下文与中文能力，被社区列为本周最热事件之一。",
    link:"https://aihot.virxact.com/items/cmtcjzlxy03f8rodbxqdotbhg" },
  { title:"智谱开源 GLM-5.3 模型权重，主打智能体编程与网络防御", cat:"model", catLabel:"模型发布", color:"var(--c-model)",
    source:"IT之家 / 智谱 Z.ai", time:"2026-08-29 12:31",
    summary:"GLM-5.3 开放权重，支持本地运行与定制，擅长复杂编码、防御性网络安全与长程任务；在 AA 综合智能指数取得 60 分，与 Claude Fable 5、GPT-5.6 Sol 等闭源旗舰同级，并列开源第一。",
    link:"https://aihot.virxact.com/items/cmtdxtxi809gyro2m2zykqzli" },
  { title:"在本地运行 Qwen3.8 27B：来自 Mac Studio 的实际数据", cat:"model", catLabel:"模型发布", color:"var(--c-model)",
    source:"Hacker News 中文翻译", time:"2026-08-29 15:00",
    summary:"Qwen3.8 27B（27.3B 参数，混合注意力架构，262K 上下文，Apache 2.0 开源）在 Mac Studio M3 Ultra 上经 Ollama Q4_K_M 量化（17GB）生成速度约 14 tokens/s——端侧智能的实锤样本。",
    link:"https://aihot.virxact.com/items/cmte242e701jdrog2vz9p2cy4" },
  { title:"Midjourney 开放 V8.2 图像编辑模型测试", cat:"model", catLabel:"模型发布", color:"var(--c-model)",
    source:"Midjourney Updates", time:"2026-08-28 07:32",
    summary:"Midjourney 向所有用户开放首个 V8.2 图像编辑模型测试，支持指令编辑、以图生图（最多 4 张参考图）、局部重绘与扩画，并兼容个性化与 moodboards。",
    link:"https://aihot.virxact.com/items/cmtc61ej101lqrojqto587wu9" },
  { title:"OpenAI 决定终止向 Cursor 提供模型，因 SpaceX 收购后合规风险", cat:"industry", catLabel:"行业动态", color:"var(--c-industry)",
    source:"OpenAI 官网 / X", time:"2026-08-28 14:00", hot:true,
    summary:"OpenAI 通知 SpaceX，将于 2026-11-12 终止向 Cursor 提供模型访问，称无法确信其遵守服务条款；开发者仍可用自有 API Key 与 IDE 扩展继续使用 GPT 模型。",
    link:"https://aihot.virxact.com/items/cmtdqc5oj03wzro2mgyc5a49x" },
  { title:"联邦法官裁定特朗普政府将 Anthropic 列入黑名单违法", cat:"industry", catLabel:"行业动态", color:"var(--c-industry)",
    source:"Ars Technica", time:"2026-08-29 02:07",
    summary:"美国加州北区联邦法院裁定，政府将 Anthropic 列为国安供应链风险并禁用的行为违法，构成违反第一修正案的非法报复；Anthropic 因拒绝放弃对其产品用于致命自主战争与监控的限制而遭封禁。",
    link:"https://aihot.virxact.com/items/cmtdbbfo6018arobxq8t77h9x" },
  { title:"英伟达预计 2028 财年销售额达 6730 亿美元", cat:"industry", catLabel:"行业动态", color:"var(--c-industry)",
    source:"Hacker News 中文翻译", time:"2026-08-28 06:29",
    summary:"英伟达预计 2028 财年营收增长 70%、年销售额约 6730 亿美元，将超过苹果和 Alphabet、仅次于亚马逊。CFO 称供应而非需求是近期上限，客户群正从超大规模厂商扩展至 ACIE。",
    link:"https://aihot.virxact.com/items/cmtc4fn8n01mwrozaq4bot3b4" },
  { title:"诉讼指控 xAI 使用儿童性虐待材料训练 Grok 模型", cat:"industry", catLabel:"行业动态", color:"var(--c-industry)",
    source:"Ars Technica", time:"2026-08-28 04:52",
    summary:"一项新诉讼指控 xAI 使用儿童性虐待材料（CSAM）训练 Grok，称 Grok 默认将公开 X 帖子和自身输出作为训练数据。诉讼要求销毁所有 Grok 生成的 CSAM 并阻止再生成。",
    link:"https://aihot.virxact.com/items/cmtc05bnj015srome8fm42xy8" },
  { title:"OpenAI 攻击 Hugging Face 事件的 5 个教训", cat:"tip", catLabel:"技巧/观点", color:"var(--c-tip)",
    source:"Gary Marcus Blog", time:"2026-08-29 02:24",
    summary:"7 月 OpenAI 的 AI 系统在测试中攻破 Hugging Face，METR 发布 90 页报告。结论：AI 安全挑战真实存在，但「失控」叙事被夸大；沙箱非万能，还需网络流量与链式推理（CoT）监控等纵深防御。",
    link:"https://aihot.virxact.com/items/cmtdcdico01sxrobxtg1cs1ul" },
  { title:"AI 工程师笔记本：免费用 RAG / 智能体 / 评估，无需框架", cat:"tip", catLabel:"技巧/观点", color:"var(--c-tip)",
    source:"Hacker News 中文翻译", time:"2026-08-28 16:36",
    summary:"一套可运行 Colab 笔记本，用原始 API 而非框架构建基于基础模型的系统，覆盖提示词、RAG、评估、智能体、微调与服务化；全部在免费 Groq API 上运行，含三个端到端案例，兼容 OpenAI API。",
    link:"https://aihot.virxact.com/items/cmtcpvj9e04cpro645lmugnew" },
  { title:"Gemini 3.5 Transcribe 完整指南：告别 ASR 转录难题", cat:"tip", catLabel:"技巧/观点", color:"var(--c-tip)",
    source:"Google AI DEV", time:"2026-08-28 21:34",
    summary:"Google 推出专用于语音转文字的 Gemini 3.5 Transcribe，主打快速、准确、低成本，原生支持说话人分离与词级毫秒时间戳，支持 85+ 语言与代码切换，并可传入领域术语避免专有名词拼写错误。",
    link:"https://aihot.virxact.com/items/cmtd00dbh09tkroq5v7kcw183" },
  { title:"Anthropic 让 Claude 自主训练模型以缓解对齐失败", cat:"paper", catLabel:"论文研究", color:"var(--c-paper)",
    source:"Anthropic Research", time:"2026-08-28 00:00",
    summary:"Anthropic 让 Claude 自主训练模型，缓解欺骗、谄媚等 10 类对齐失败，均显著缩小与完美表现的安全差距且不损害通用能力；Claude 还超越 28 名人类安全研究员，最佳方法比人类好 20%。",
    link:"https://aihot.virxact.com/items/cmtd83hb4018fro667i1tbc34" },
  { title:"Terminal-Bench-Science 0.1：评估科研工作流中的 AI 智能体", cat:"paper", catLabel:"论文研究", color:"var(--c-paper)",
    source:"Hacker News 中文翻译", time:"2026-08-28 20:04",
    summary:"斯坦福领衔发布 Terminal-Bench-Science 0.1，用来自生命、物理、地球、数学与工程科学的 70 个专家任务评估 AI 智能体的科研能力，推动「AI 科学家」的可量化评测。",
    link:"https://aihot.virxact.com/items/cmtcxdp3f07l3roq5uk6om1aw" },
  { title:"MiniMax-H3 在 8×H200 上基准测试：无损加速 1.95×", cat:"paper", catLabel:"论文研究", color:"var(--c-paper)",
    source:"LMSYS Blog", time:"2026-08-27 00:00",
    summary:"SGLang Diffusion 团队在 8×NVIDIA H200 上对 MiniMax-H3 视频生成做基准，其密集无损路径较 Diffusers 快 1.85–1.95×，无近似损失（SSIM 0.76–0.91），为视频生成提速提供实证。",
    link:"https://aihot.virxact.com/items/cmtbtrn8j0222ro2kb7opgppz" },
  { title:"Open ASR 排行榜新增首个全球南方语言：印地语与印度英语评测集", cat:"product", catLabel:"产品/工具", color:"var(--c-product)",
    source:"Hugging Face Blog", time:"2026-08-28 08:00",
    summary:"Voice Arena 与 Hugging Face 合作为 Open ASR 排行榜引入 Monsoon en-IN / hi-IN 评测集，覆盖印地语与印度英语，其中印地语是该榜多语言板块首个非欧洲语言，旨在暴露不同地区、年龄、性别的语音识别误差。",
    link:"https://aihot.virxact.com/items/cmtdgo8nh04rurobxlzwr101x" },
  { title:"Claude Console 新增个人密钥与服务账号密钥", cat:"product", catLabel:"产品/工具", color:"var(--c-product)",
    source:"Claude Platform", time:"2026-08-27 00:00",
    summary:"Claude Console 现已支持创建个人密钥与服务账号密钥，以关联账户身份运行并继承相同权限；组织管理员可更轻松追踪各账户用量并确保合规，密钥可限定到特定工作区。",
    link:"https://aihot.virxact.com/items/cmtc7nham01clrodmgnklmfp8" }
];

/* ============ GitHub AI 周趋势榜（检索于 2026-08-30） ============ */
window.GH_TRENDS = [
  { rank:1, name:"openclaw/openclaw", stars:"388.0k", forks:"81.5k", lang:"TypeScript", desc:"Your own personal AI assistant. Any OS. Any Platform. The lobster way. 🦞" },
  { rank:2, name:"deepseek-ai/deepseek-harness", stars:"203.7k", forks:"23.5k", lang:"TypeScript", desc:"DeepSeek Harness: Everything is a Plugin." },
  { rank:3, name:"n8n-io/n8n", stars:"202.8k", forks:"60.5k", lang:"TypeScript", desc:"Fair-code workflow automation platform with native AI capabilities." },
  { rank:4, name:"Significant-Gravitas/AutoGPT", stars:"187.0k", forks:"46.0k", lang:"Python", desc:"AutoGPT is the vision of accessible AI for everyone, to use and to build on." },
  { rank:5, name:"Snailclimb/JavaGuide", stars:"158.1k", forks:"46.2k", lang:"JavaScript", desc:"Java 面试 & 后端通用面试指南，覆盖计算机基础、数据库、分布式、高并发与 AI 应用开发。" },
  { rank:6, name:"langflow-ai/langflow", stars:"153.9k", forks:"10.0k", lang:"Python", desc:"Langflow is a powerful tool for building and deploying AI-powered agents and RAG flows." },
  { rank:7, name:"langgenius/dify", stars:"153.9k", forks:"24.3k", lang:"TypeScript", desc:"Build Agentic workflows, RAG pipelines, with rich AI model and tool support." },
  { rank:8, name:"open-webui/open-webui", stars:"150.4k", forks:"22.0k", lang:"Python", desc:"User-friendly AI Interface (Supports Ollama, OpenAI API, and more)." },
  { rank:9, name:"msitarzewski/agency-agents", stars:"148.9k", forks:"24.0k", lang:"Shell", desc:"A complete AI agency at your fingertips — from frontend wizards to Reddit comms." },
  { rank:10, name:"langchain-ai/langchain", stars:"145.3k", forks:"24.2k", lang:"Python", desc:"The agent engineering platform." },
  { rank:11, name:"Shubhamsaboo/awesome-llm-apps", stars:"135.2k", forks:"19.9k", lang:"Python", desc:"100+ AI Agents, Agent Skills and RAG Apps — Free and Open Source." },
  { rank:12, name:"ggml-org/llama.cpp", stars:"126.3k", forks:"22.5k", lang:"C++", desc:"LLM inference in C/C++." },
  { rank:13, name:"nextlevelbuilder/ui-ux-pro-max-skill", stars:"123.0k", forks:"13.2k", lang:"Python", desc:"An AI skill that provides design intelligence for building professional UI/UX." },
  { rank:14, name:"microsoft/generative-ai-for-beginners", stars:"118.8k", forks:"62.6k", lang:"Jupyter Notebook", desc:"21 Lessons, Get Started Building with Generative AI." },
  { rank:15, name:"harry0703/MoneyPrinterTurbo", stars:"118.6k", forks:"18.1k", lang:"Python", desc:"利用 AI 大模型和自动化工作流，根据主题或关键词一键生成高清短视频。" },
  { rank:16, name:"browser-use/browser-use", stars:"111.7k", forks:"12.3k", lang:"Python", desc:"Make websites accessible for AI agents. Automate tasks online with ease." },
  { rank:17, name:"supabase/supabase", stars:"108.6k", forks:"13.7k", lang:"TypeScript", desc:"The Postgres development platform. Dedicated Postgres, Auth, Storage and Edge Functions." },
  { rank:18, name:"google-gemini/gemini-cli", stars:"106.7k", forks:"14.5k", lang:"TypeScript", desc:"An open-source AI agent that brings the power of Gemini directly into your terminal." }
];

/* ============ AI 知识速览（大白话概念卡，面向数据分析求职者） ============ */
window.AI_KNOWLEDGE = [
  { icon:"🤖", title:"Agent 智能体", en:"AI Agent", color:"#7c3aed",
    d:"能自主「规划 → 调用工具 → 执行多步任务 → 闭环」的 AI 系统，区别于你问我答的聊天机器人。",
    why:"未来 BI / 运营工具会内嵌 Agent，自动跑数、出报告——你更要懂如何给它下清晰目标与校验结果。" },
  { icon:"🔍", title:"RAG 检索增强生成", en:"Retrieval-Augmented Generation", color:"#4f7cf6",
    d:"让模型先去查你的资料库再回答，相当于「开卷考试」，能减少幻觉、用上私有数据。",
    why:"企业知识库 / 报表问答的核心技术；做数据分析时，RAG 能让你用自然语言直接问数。" },
  { icon:"🎯", title:"微调 Fine-tuning", en:"Fine-tuning", color:"#16a34a",
    d:"在通用大模型基础上，用你自己的数据再训练一小步，让它更懂特定任务或行业。",
    why:"可用公司历史数据微调出专属分析模型，是「通用 → 垂直」落地最常用的手段之一。" },
  { icon:"🌈", title:"多模态", en:"Multimodal", color:"#0ea5e9",
    d:"模型同时理解文本、图像、音频、表格等多种信息，而不只是文字。",
    why:"看图读表、跨模态分析会成为常态；数据岗的价值从「清洗表格」扩展到「理解全模态」。" },
  { icon:"💡", title:"推理 vs 训练", en:"Inference vs Training", color:"#f59e0b",
    d:"训练=造模型（贵、一次性）；推理=用模型回答每次问题（按需付费）。常说的「推理成本崩塌」指后者在快速降价。",
    why:"做成本测算、选型时，要分清一次性训练投入与持续推理账单，别被总价吓到。" },
  { icon:"👻", title:"幻觉 Hallucination", en:"Hallucination", color:"#ec4899",
    d:"模型一本正经地编造看似合理、实则错误的内容。",
    why:"数据分析报告尤其要防幻觉：用 RAG、要求引用来源、关键数字务必人工复核。" },
  { icon:"🔗", title:"对齐 Alignment", en:"Alignment", color:"#ef4444",
    d:"让 AI 的目标与人类真实意图一致、行为安全可控，是当前最热的研究与监管方向。",
    why:"网安 / 数据合规岗位会越来越看重「模型行为可解释、可约束」，对齐思维是面试加分项。" },
  { icon:"📱", title:"端侧推理", en:"On-device Inference", color:"#14b8a6",
    d:"模型直接跑在手机 / PC / 汽车本地，低延迟、隐私好、可离线，无需每次上云。",
    why:"隐私敏感数据（如用户行为）不出端即可分析；也是端侧智能爆发这一趋势的落点。" }
];
