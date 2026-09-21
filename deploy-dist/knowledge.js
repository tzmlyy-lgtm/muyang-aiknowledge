// ============ 板块与等级定义 ============
const TOPICS = {
  python: { name: "Python", icon: "🐍", desc: "从零开始的通用编程语言", accent: "#306998" },
  mysql:  { name: "MySQL", icon: "🗄️", desc: "最常用的关系型数据库", accent: "#00758f" },
  data:   { name: "数据分析", icon: "📊", desc: "用数据讲故事、做决策", accent: "#f97316" },
  ai:     { name: "AI 知识", icon: "🤖", desc: "大模型与机器学习入门到精通", accent: "#7c3aed" }
};

const LEVELS = {
  1: { name: "零基础", color: "var(--lv1)", icon: "🌱" },
  2: { name: "刚入门", color: "var(--lv2)", icon: "🌿" },
  3: { name: "已熟悉", color: "var(--lv3)", icon: "🌳" },
  4: { name: "大神级", color: "var(--lv4)", icon: "🚀" }
};

const R = {
  bilibili: q => `https://search.bilibili.com/all?keyword=${encodeURIComponent(q)}`,
  csdn: q => `https://so.csdn.net/so/search?u=site&q=${encodeURIComponent(q)}`,
  juejin: q => `https://juejin.cn/search?query=${encodeURIComponent(q)}`,
  arxiv: id => `https://arxiv.org/abs/${id}`,
  zhihu: q => `https://www.zhihu.com/search?type=content&q=${encodeURIComponent(q)}`
};

// ============ 知识点数据 ============
const DATA = [
  // ===== Python =====
  { topic: "python", level: 1, title: "什么是 Python", desc: "Python 是一门语法接近自然语言的编程语言，适合新手。用它可做数据分析、网站、自动化脚本、AI。先装好解释器，写第一行 print 就能跑起来。",
    code: "# 第一个程序\nprint(\"你好，世界\")\nprint(1 + 2)  # 输出 3",
    tip: "直接去 python.org 下载安装，或者用官网的交互式环境 IDLE 边写边看。",
    res: [{t:"video",title:"Python 零基础入门视频",url:R.bilibili("Python 零基础入门 黑马程序员")},{t:"article",title:"Python 官方中文教程",url:"https://docs.python.org/zh-cn/3/tutorial/"},{t:"doc",title:"Python 官方文档",url:"https://docs.python.org/zh-cn/3/"}]},
  { topic: "python", level: 1, title: "变量与数据类型", desc: "变量就是给数据起名字。常见类型：整数 int、小数 float、字符串 str、布尔 bool。不用声明类型，赋值即定义。",
    code: "name = \"小明\"\nage = 20\nheight = 1.75\nis_student = True\nprint(type(name))",
    res: [{t:"video",title:"变量与数据类型",url:R.bilibili("Python 变量与数据类型")},{t:"article",title:"Python 变量完全指南",url:R.juejin("Python 变量与数据类型")},{t:"doc",title:"内置类型文档",url:"https://docs.python.org/zh-cn/3/library/stdtypes.html"}]},
  { topic: "python", level: 1, title: "输入输出与运算符", desc: "input() 接收键盘输入，print() 输出；运算符包括加减乘除、取余 %、整除 //、幂运算 **。",
    code: "a = int(input(\"输入一个整数：\"))\nprint(\"平方=\", a ** 2)\nprint(\"除以3余\", a % 3)",
    res: [{t:"video",title:"Python 输入输出",url:R.bilibili("Python input print 教学")},{t:"article",title:"Python 运算符详解",url:R.csdn("Python 运算符")},{t:"doc",title:"Input/Output",url:"https://docs.python.org/zh-cn/3/tutorial/inputoutput.html"}]},
  { topic: "python", level: 2, title: "条件判断与循环", desc: "用 if/elif/else 做分支，用 for/while 做重复。这是写任何程序的基础逻辑。",
    code: "for i in range(5):\n    if i % 2 == 0:\n        print(f\"{i} 是偶数\")\n    else:\n        print(f\"{i} 是奇数\")",
    res: [{t:"video",title:"Python 流程控制",url:R.bilibili("Python if for while")},{t:"article",title:"条件与循环",url:R.juejin("Python 条件判断 循环")},{t:"doc",title:"Control Flow",url:"https://docs.python.org/zh-cn/3/tutorial/controlflow.html"}]},
  { topic: "python", level: 2, title: "函数与列表/字典", desc: "函数用 def 封装可复用逻辑；列表 [] 存有序数据，字典 {} 存键值对，是数据处理的核心结构。",
    code: "def add(a, b):\n    return a + b\nnums = [1, 2, 3]\nd = {\"语文\": 90, \"数学\": 95}\nprint(add(nums[0], d[\"语文\"]))",
    res: [{t:"video",title:"函数与数据结构",url:R.bilibili("Python 函数 列表 字典")},{t:"article",title:"Python 数据结构",url:R.csdn("Python list dict 详解")},{t:"doc",title:"Datastructures",url:"https://docs.python.org/zh-cn/3/tutorial/datastructures.html"}]},
  { topic: "python", level: 2, title: "模块与包管理", desc: "用 import 引入他人写好的模块；pip 安装第三方包，如 pandas、requests。学会看官方文档是关键。",
    code: "import random\nprint(random.randint(1, 10))\n# 终端：pip install requests",
    res: [{t:"video",title:"pip 与模块",url:R.bilibili("Python pip 模块")},{t:"article",title:"模块与包",url:R.juejin("Python 模块 包 pip")},{t:"doc",title:"pip 文档",url:"https://pip.pypa.io/"}]},
  { topic: "python", level: 3, title: "文件读写与异常处理", desc: "用 open() 读写文件，用 try/except 捕获错误，避免程序因异常崩溃——这是写出健壮脚本的关键。",
    code: "try:\n    with open(\"data.txt\", encoding=\"utf-8\") as f:\n        print(f.read())\nexcept FileNotFoundError:\n    print(\"文件不存在\")",
    res: [{t:"video",title:"文件操作",url:R.bilibili("Python 文件读写 异常处理")},{t:"article",title:"异常处理最佳实践",url:R.csdn("Python try except")},{t:"doc",title:"Errors",url:"https://docs.python.org/zh-cn/3/tutorial/errors.html"}]},
  { topic: "python", level: 3, title: "常用标准库与第三方包", desc: "标准库自带 datetime、os、json；第三方用 pip 安装，如 requests（网络）、numpy（计算）。虚拟环境 venv 隔离依赖。",
    code: "import datetime, json\nprint(datetime.datetime.now().strftime(\"%Y-%m-%d\"))",
    res: [{t:"video",title:"常用库",url:R.bilibili("Python requests datetime json")},{t:"article",title:"标准库速查",url:R.juejin("Python 标准库")},{t:"doc",title:"Library",url:"https://docs.python.org/zh-cn/3/library/"}]},
  { topic: "python", level: 3, title: "面向对象编程 OOP", desc: "类 class 封装数据和行为，对象 object 是类的实例。继承、多态让代码更易复用。",
    code: "class Dog:\n    def __init__(self, name):\n        self.name = name\n    def bark(self):\n        return f\"{self.name}: 汪汪!\"\nprint(Dog(\"小白\").bark())",
    res: [{t:"video",title:"面向对象",url:R.bilibili("Python 面向对象 OOP")},{t:"article",title:"类与对象详解",url:R.csdn("Python class object")},{t:"doc",title:"Classes",url:"https://docs.python.org/zh-cn/3/tutorial/classes.html"}]},
  { topic: "python", level: 4, title: "装饰器与生成器", desc: "装饰器在不改原函数的情况下增强功能；生成器用 yield 惰性产出，省内存。两者是写出优雅、高性能 Python 的进阶武器。",
    code: "def log(func):\n    def wrap(*a, **k):\n        print(\"调用\", func.__name__); return func(*a, **k)\n    return wrap\n@log\ndef hello(): return \"hi\"",
    res: [{t:"video",title:"装饰器与生成器",url:R.bilibili("Python 装饰器 生成器")},{t:"article",title:"进阶：装饰器完全指南",url:R.juejin("Python decorator generator")},{t:"doc",title:"Iterators",url:"https://docs.python.org/zh-cn/3/tutorial/classes.html#iterators"}]},
  { topic: "python", level: 4, title: "并发与性能优化", desc: "用 asyncio 处理高并发 IO，用 multiprocessing 利用多核；用 pyproject.toml 管理项目，用 cProfile 定位瓶颈。",
    code: "import asyncio\nasync def t(n):\n    await asyncio.sleep(1); return n*2\nasync def main():\n    print(await asyncio.gather(*[t(i) for i in range(5)]))\nasyncio.run(main())",
    res: [{t:"video",title:"asyncio 并发",url:R.bilibili("Python asyncio 异步")},{t:"article",title:"性能优化指南",url:R.csdn("Python 性能优化 asyncio")},{t:"doc",title:"asyncio",url:"https://docs.python.org/zh-cn/3/library/asyncio.html"}]},

  // ===== MySQL =====
  { topic: "mysql", level: 1, title: "什么是数据库", desc: "数据库像电子表格，但能高效存储、查询海量数据。MySQL 是最流行的开源关系型数据库，数据按「表」组织，表由行（记录）和列（字段）组成。",
    code: "CREATE TABLE user (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(50),\n  age INT\n);",
    res: [{t:"video",title:"MySQL 零基础入门",url:R.bilibili("MySQL 零基础入门")},{t:"article",title:"数据库基础概念",url:R.csdn("MySQL 数据库基础")},{t:"doc",title:"MySQL 文档",url:"https://dev.mysql.com/doc/refman/8.0/en/"}]},
  { topic: "mysql", level: 1, title: "第一个查询", desc: "SELECT 用来取数据。先插入几条数据，再查询它。SQL 不区分大小写，但约定关键字大写更易读。",
    code: "INSERT INTO user (name, age) VALUES ('小明',20),('小红',22);\nSELECT * FROM user;\nSELECT name FROM user WHERE age > 20;",
    res: [{t:"video",title:"SQL 基础查询",url:R.bilibili("MySQL SELECT 入门")},{t:"article",title:"SQL 入门教程",url:R.juejin("SQL 基础 SELECT")},{t:"doc",title:"SELECT",url:"https://dev.mysql.com/doc/refman/8.0/en/select.html"}]},
  { topic: "mysql", level: 1, title: "数据类型与约束", desc: "字段要指定类型（INT/VARCHAR/DATE 等）。主键 PRIMARY KEY 唯一标识一行，NOT NULL 禁止空值，DEFAULT 设置默认值。",
    code: "CREATE TABLE product (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(100) NOT NULL,\n  price DECIMAL(10,2) DEFAULT 0.00\n);",
    res: [{t:"video",title:"数据类型",url:R.bilibili("MySQL 数据类型 约束")},{t:"article",title:"SQL 约束详解",url:R.csdn("MySQL 主键 外键 约束")},{t:"doc",title:"Data Types",url:"https://dev.mysql.com/doc/refman/8.0/en/data-types.html"}]},
  { topic: "mysql", level: 2, title: "条件与排序、聚合", desc: "WHERE 过滤、ORDER BY 排序、GROUP BY 分组统计。聚合函数 COUNT/SUM/AVG 帮你从明细得到结论。",
    code: "SELECT city, COUNT(*) AS 人数\nFROM user GROUP BY city\nORDER BY 人数 DESC LIMIT 10;",
    res: [{t:"video",title:"条件排序聚合",url:R.bilibili("MySQL WHERE ORDER BY GROUP BY")},{t:"article",title:"聚合函数",url:R.juejin("MySQL 聚合函数")},{t:"doc",title:"Aggregate",url:"https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html"}]},
  { topic: "mysql", level: 2, title: "多表 JOIN", desc: "数据常分散在多张表，用 JOIN 按关联字段拼起来。内连接 INNER JOIN 只保留两边都匹配的行。",
    code: "SELECT u.name, o.amount\nFROM user u\nJOIN `order` o ON u.id = o.user_id\nWHERE o.amount > 100;",
    res: [{t:"video",title:"JOIN 详解",url:R.bilibili("MySQL JOIN 多表查询")},{t:"article",title:"JOIN 图解",url:R.csdn("MySQL JOIN 内连接 外连接")},{t:"doc",title:"JOIN",url:"https://dev.mysql.com/doc/refman/8.0/en/join.html"}]},
  { topic: "mysql", level: 2, title: "子查询与常用函数", desc: "子查询是嵌套在另一个查询里的 SELECT。配合字符串、日期函数，能解决很多复杂报表需求。",
    code: "SELECT * FROM user WHERE age > (SELECT AVG(age) FROM user);",
    res: [{t:"video",title:"子查询",url:R.bilibili("MySQL 子查询 函数")},{t:"article",title:"子查询与函数",url:R.juejin("MySQL 子查询")},{t:"doc",title:"Functions",url:"https://dev.mysql.com/doc/refman/8.0/en/built-in-functions.html"}]},
  { topic: "mysql", level: 3, title: "索引与事务", desc: "索引让查询从「翻全书」变成「查目录」，大幅提速；事务（BEGIN/COMMIT）保证一组操作要么全成功要么全失败，保证数据一致。",
    code: "CREATE INDEX idx_age ON user(age);\nSTART TRANSACTION;\nUPDATE account SET balance=balance-100 WHERE id=1;\nCOMMIT;",
    res: [{t:"video",title:"索引与事务",url:R.bilibili("MySQL 索引 事务 ACID")},{t:"article",title:"索引原理与优化",url:R.csdn("MySQL 索引 B+树 事务")},{t:"doc",title:"Indexes",url:"https://dev.mysql.com/doc/refman/8.0/en/optimization-indexes.html"}]},
  { topic: "mysql", level: 3, title: "视图与存储过程", desc: "视图是保存的查询，像虚拟表；存储过程是服务端的一段可复用 SQL。二者简化复杂查询、统一业务逻辑。",
    code: "CREATE VIEW vip AS SELECT * FROM user WHERE age>=18;\nCREATE PROCEDURE add_user(IN nm VARCHAR(50))\nBEGIN INSERT INTO user(name) VALUES (nm); END;",
    res: [{t:"video",title:"视图与存储过程",url:R.bilibili("MySQL 视图 存储过程")},{t:"article",title:"视图和存储过程",url:R.juejin("MySQL view procedure")},{t:"doc",title:"Views",url:"https://dev.mysql.com/doc/refman/8.0/en/views.html"}]},
  { topic: "mysql", level: 4, title: "查询优化与执行计划", desc: "用 EXPLAIN 看执行计划，避免全表扫描；理解回表、覆盖索引、慢查询日志，配合连接池与读写分离扛住高并发。",
    code: "EXPLAIN SELECT * FROM user WHERE name='小明';\n-- 关注 type / rows / key",
    res: [{t:"video",title:"性能优化",url:R.bilibili("MySQL EXPLAIN 优化")},{t:"article",title:"慢查询优化实战",url:R.csdn("MySQL EXPLAIN 慢查询优化")},{t:"doc",title:"EXPLAIN",url:"https://dev.mysql.com/doc/refman/8.0/en/explain-output.html"}]},
  { topic: "mysql", level: 4, title: "分区、主从与高可用", desc: "大表用分区拆分；主从复制做读写分离与备份；配合 Redis 缓存热点、用 Binlog 做数据同步，构建稳健架构。",
    code: "CREATE TABLE log (id BIGINT, ts DATETIME)\nPARTITION BY RANGE (TO_DAYS(ts)) (\n  PARTITION p2026 VALUES LESS THAN (TO_DAYS('2027-01-01'))\n);",
    res: [{t:"video",title:"主从复制",url:R.bilibili("MySQL 主从复制 读写分离")},{t:"article",title:"高可用架构",url:R.juejin("MySQL 主从 分区 高可用")},{t:"doc",title:"Partitioning",url:"https://dev.mysql.com/doc/refman/8.0/en/partitioning.html"}]},

  // ===== 数据分析 =====
  { topic: "data", level: 1, title: "什么是数据分析", desc: "数据分析是用数据回答业务问题：发生了什么、为什么、将来会怎样。从 Excel 开始没问题，但 Python+pandas 能处理更大、更乱的数据。",
    tip: "先明确问题，再找数据，最后用图表和结论说话——不要反过来。",
    res: [{t:"video",title:"数据分析入门",url:R.bilibili("数据分析入门 零基础")},{t:"article",title:"数据分析流程",url:R.juejin("数据分析 方法 流程")},{t:"doc",title:"pandas 文档",url:"https://pandas.pydata.org/docs/getting_started/index.html"}]},
  { topic: "data", level: 1, title: "pandas 入门", desc: "pandas 是数据分析的核心库。DataFrame 像带列名的表格，一行代码完成筛选、统计。",
    code: "import pandas as pd\ndf = pd.DataFrame({\"城市\":[\"北京\",\"上海\"],\"销量\":[120,200]})\nprint(df[\"销量\"].mean())",
    res: [{t:"video",title:"pandas 快速入门",url:R.bilibili("pandas 入门教程")},{t:"article",title:"10 分钟学会 pandas",url:"https://pandas.pydata.org/docs/user_guide/10min.html"},{t:"doc",title:"User Guide",url:"https://pandas.pydata.org/docs/user_guide/index.html"}]},
  { topic: "data", level: 1, title: "用 Excel 做数据分析", desc: "Excel 是很多人的第一步：透视表、VLOOKUP、条件格式。理解业务口径比工具更重要。",
    res: [{t:"video",title:"Excel 数据分析",url:R.bilibili("Excel 数据透视表 数据分析")},{t:"article",title:"Excel 技巧",url:R.csdn("Excel 数据透视表 VLOOKUP")},{t:"doc",title:"Excel 支持",url:"https://support.microsoft.com/zh-cn/excel"}]},
  { topic: "data", level: 2, title: "数据清洗与描述统计", desc: "真实数据常有缺失、重复、异常值。用 dropna/duplicated 清洗，用 describe 看均值、标准差等分布特征。",
    code: "df['销量']=df['销量'].fillna(df['销量'].median())\ndf=df[df['销量']<df['销量'].quantile(0.99)]\nprint(df.describe())",
    res: [{t:"video",title:"数据清洗实战",url:R.bilibili("pandas 数据清洗 缺失值")},{t:"article",title:"数据清洗流程",url:R.juejin("pandas 数据清洗")},{t:"doc",title:"Missing data",url:"https://pandas.pydata.org/docs/user_guide/missing_data.html"}]},
  { topic: "data", level: 2, title: "分组聚合与可视化", desc: "groupby 做分组汇总；matplotlib/plotly 把数字变成图，让结论一目了然。中文数据语境：涨红、跌绿。",
    code: "import matplotlib.pyplot as plt\ns=df.groupby('城市')['销量'].sum()\nplt.bar(s.index,s.values);plt.show()",
    res: [{t:"video",title:"可视化",url:R.bilibili("matplotlib 数据可视化 pandas")},{t:"article",title:"Python 可视化",url:R.csdn("matplotlib pyplot 教程")},{t:"doc",title:"matplotlib",url:"https://matplotlib.org/stable/contents.html"}]},
  { topic: "data", level: 2, title: "SQL 数据分析", desc: "分析师日常工作大量写 SQL：提数、宽表、报表。SQL + Python 是数据岗位的黄金组合。",
    code: "SELECT DATE(order_date) 日期, SUM(amount) 销售额\nFROM orders GROUP BY 日期 ORDER BY 日期;",
    res: [{t:"video",title:"SQL 数据分析",url:R.bilibili("SQL 数据分析 实战")},{t:"article",title:"数据分析 SQL 面试题",url:R.juejin("数据分析 SQL")},{t:"doc",title:"MySQL SELECT",url:"https://dev.mysql.com/doc/refman/8.0/en/select.html"}]},
  { topic: "data", level: 3, title: "时间序列与透视表", desc: "按时间维度分析趋势是高频需求。pd.to_datetime 转时间，pivot_table 做交叉汇总，发现周期性与异常。",
    code: "df['日期']=pd.to_datetime(df['日期'])\nmonthly=df.resample('M',on='日期')['销量'].sum()",
    res: [{t:"video",title:"时间序列",url:R.bilibili("pandas 时间序列 resample")},{t:"article",title:"时间序列分析",url:R.csdn("pandas 时间序列 pivot_table")},{t:"doc",title:"Time Series",url:"https://pandas.pydata.org/docs/user_guide/timeseries.html"}]},
  { topic: "data", level: 3, title: "相关性分析与假设检验", desc: "用 corr 看变量关系，用 scipy 做 t 检验等显著性判断，避免把「相关」当成「因果」。",
    code: "from scipy import stats\nr,p=stats.pearsonr(df['广告'],df['销量'])\nprint(f\"r={r:.2f}, p={p:.3f}\")",
    res: [{t:"video",title:"假设检验入门",url:R.bilibili("假设检验 t检验 相关性")},{t:"article",title:"统计学与数据分析",url:R.juejin("相关性分析 假设检验")},{t:"doc",title:"scipy.stats",url:"https://docs.scipy.org/doc/scipy/reference/stats.html"}]},
  { topic: "data", level: 4, title: "机器学习建模", desc: "用 scikit-learn 做分类/回归：划分训练集、训练模型、评估指标（准确率、AUC）。记住：数据是核心，特征工程决定上限。",
    code: "from sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nXtr,Xte,ytr,yte=train_test_split(X,y,test_size=0.2)\nm=RandomForestClassifier().fit(Xtr,ytr)\nprint(m.score(Xte,yte))",
    res: [{t:"video",title:"sklearn 机器学习",url:R.bilibili("scikit-learn 机器学习")},{t:"article",title:"机器学习项目流程",url:R.juejin("sklearn 机器学习流程")},{t:"doc",title:"scikit-learn",url:"https://scikit-learn.org/stable/"}]},
  { topic: "data", level: 4, title: "可解释性与可视化进阶", desc: "用 SHAP 解释模型、用交互式 Plotly/Dash 做看板，让业务方看得懂、信得过。数据故事比模型本身更重要。",
    tip: "用 Pyecharts / Streamlit 快速搭建可分享的分析应用，比静态报告更有说服力。",
    res: [{t:"video",title:"SHAP 可解释性",url:R.bilibili("SHAP 模型可解释性")},{t:"article",title:"数据看板设计",url:R.juejin("Streamlit Plotly 数据看板")},{t:"doc",title:"SHAP",url:"https://shap.readthedocs.io/en/latest/"}]},

  // ===== AI 知识 =====
  { topic: "ai", level: 1, title: "AI / 机器学习 / 深度学习", desc: "AI 是让机器模仿智能行为的统称；机器学习用数据自动找规律；深度学习是其中的「神经网络」方法。大模型（LLM）是当下最火的深度学习应用。",
    tip: "大模型不是「搜索」，而是「基于概率生成」——它可能在自信地胡说，所以要会验证。",
    res: [{t:"video",title:"AI 入门科普",url:R.bilibili("人工智能 机器学习 深度学习 入门")},{t:"article",title:"AI、ML、DL 关系",url:R.juejin("AI 机器学习 深度学习 区别")},{t:"doc",title:"Google AI 术语表",url:"https://developers.google.com/machine-learning/glossary"}]},
  { topic: "ai", level: 1, title: "提示词工程入门", desc: "和大模型对话，prompt（提示词）决定输出质量。给清角色、任务、格式与示例，比含糊提问强百倍。",
    code: "你是一名资深数据分析师。\n任务：把销售数据总结成 3 条结论。\n格式：每条结论含数字支撑。\n数据：{粘贴你的数据}",
    res: [{t:"video",title:"提示词工程",url:R.bilibili("提示词工程 Prompt Engineering")},{t:"article",title:"Prompt 指南",url:R.juejin("提示词工程 技巧")},{t:"doc",title:"OpenAI Prompt",url:"https://platform.openai.com/docs/guides/prompt-engineering"}]},
  { topic: "ai", level: 1, title: "大模型与生成式 AI", desc: "ChatGPT、Claude、DeepSeek、文心一言、通义千问都属于大语言模型（LLM）。生成式 AI 还能做图片、音频、视频。",
    res: [{t:"video",title:"大模型科普",url:R.bilibili("大语言模型 LLM 科普")},{t:"article",title:"生成式 AI 全景",url:R.zhihu("大语言模型 生成式 AI")},{t:"doc",title:"State of AI",url:"https://www.stateof.ai/"}]},
  { topic: "ai", level: 2, title: "调用大模型 API", desc: "用一行代码接入 OpenAI/国内大模型，把 AI 嵌进自己的程序。注意 API Key 保密、控制 token 成本。",
    code: "from openai import OpenAI\nc=OpenAI(api_key='你的KEY')\nr=c.chat.completions.create(model='gpt-4o-mini',messages=[{'role':'user','content':'解释向量数据库'}])\nprint(r.choices[0].message.content)",
    res: [{t:"video",title:"API 调用",url:R.bilibili("OpenAI API 调用 Python")},{t:"article",title:"LLM API 教程",url:R.juejin("OpenAI API 教程")},{t:"doc",title:"OpenAI Docs",url:"https://platform.openai.com/docs"}]},
  { topic: "ai", level: 2, title: "常见模型与名词", desc: "Transformer 是现代大模型底座；RAG = 检索+生成，让模型用你的资料回答；Fine-tuning 是微调。理解它们，才知道该用什么方案。",
    tip: "优先用 RAG 解决「私有知识」问题，比直接微调更省成本、更可控。",
    res: [{t:"video",title:"Transformer 通俗讲解",url:R.bilibili("Transformer 模型 科普")},{t:"article",title:"RAG 与 Fine-tuning 对比",url:R.juejin("RAG Fine-tuning 区别")},{t:"doc",title:"Hugging Face",url:"https://huggingface.co/docs/transformers/index"}]},
  { topic: "ai", level: 2, title: "Python AI 工具栈", desc: "做 AI 离不开 numpy、pandas、torch/transformers、LangChain 等。先用 pip 安装，再跟着官方 example 跑通。",
    code: "pip install numpy pandas torch transformers\npip install langchain langchain-openai",
    res: [{t:"video",title:"AI 工具链",url:R.bilibili("Python AI 工具 numpy torch")},{t:"article",title:"AI 开发环境",url:R.juejin("Python AI 环境配置")},{t:"doc",title:"PyTorch 教程",url:"https://pytorch.org/tutorials/"}]},
  { topic: "ai", level: 3, title: "向量数据库与 Embedding", desc: "Embedding 把文本变成向量，相似内容向量也相近。向量数据库（Milvus/FAISS）据此做语义搜索，是 RAG 的核心。",
    code: "from sentence_transformers import SentenceTransformer\nm=SentenceTransformer('BAAI/bge-small-zh')\nv=m.encode('今天天气真好');print(len(v))",
    res: [{t:"video",title:"向量数据库",url:R.bilibili("向量数据库 Embedding RAG")},{t:"article",title:"Embedding 原理",url:R.juejin("文本 Embedding 向量数据库")},{t:"doc",title:"FAISS",url:"https://github.com/facebookresearch/faiss/wiki"}]},
  { topic: "ai", level: 3, title: "训练流程与评估", desc: "训练=前向+反向传播；关注过拟合与欠拟合；用准确率/召回/F1 综合评估。",
    code: "for x,y in dataloader:\n    pred=model(x); loss=criterion(pred,y)\n    loss.backward(); optimizer.step(); optimizer.zero_grad()",
    tip: "数据质量 >> 模型复杂度。先把数据做干净，再谈调参。",
    res: [{t:"video",title:"训练流程",url:R.bilibili("神经网络 训练 反向传播")},{t:"article",title:"模型评估指标",url:R.juejin("准确率 精确率 召回率 F1")},{t:"course",title:"吴恩达机器学习",url:"https://www.coursera.org/learn/machine-learning"}]},
  { topic: "ai", level: 3, title: "RAG 应用架构", desc: "RAG 让 LLM 先查资料再回答，显著减少幻觉。流程：加载文档 → 切分 → Embedding → 向量检索 → 注入 Prompt。",
    code: "from langchain.vectorstores import FAISS\nfrom langchain.embeddings import OpenAIEmbeddings\nvectordb=FAISS.from_documents(docs,OpenAIEmbeddings())\nrelevant=vectordb.as_retriever().get_relevant_documents('Q3 销售额')",
    res: [{t:"video",title:"RAG 实战",url:R.bilibili("RAG 应用实战 LangChain")},{t:"article",title:"RAG 系统设计",url:R.juejin("RAG 架构 知识库")},{t:"doc",title:"LangChain RAG",url:"https://python.langchain.com/docs/use_cases/question_answering/"}]},
  { topic: "ai", level: 3, title: "上下文工程 Context Engineering", desc: "2025–2026 的新热词：与其堆长提示词，不如系统地给 Agent 喂「对的知识、工具、结构与记忆」（skills/插件/MCP/子代理）。它是提示工程的进阶版，直接决定 Agent 表现。",
    tip: "Hugging Face 已推出专门的 Context 课程，配合 AI Agents 课程一起学效果最佳。",
    res: [{t:"video",title:"上下文工程讲解",url:R.bilibili("Context Engineering 上下文工程")},{t:"article",title:"从 Prompt 到 Context",url:R.juejin("上下文工程 Context Engineering")},{t:"course",title:"HF Context 课程",url:"https://huggingface.co/learn/agents-course"}]},
  { topic: "ai", level: 4, title: "Transformer 与注意力机制", desc: "Self-Attention 让模型关注关键 token，是 LLM 的心脏。理解 Q/K/V、位置编码、多头注意力，才算真正入门大模型原理。",
    tip: "读原论文《Attention Is All You Need》之前，先把 Q/K/V 的关系看明白。",
    res: [{t:"video",title:"Transformer 原理",url:R.bilibili("Transformer 注意力机制")},{t:"article",title:"Attention 图解",url:R.juejin("Self-Attention Transformer")},{t:"paper",title:"Attention Is All You Need",url:R.arxiv("1706.03762")}]},
  { topic: "ai", level: 4, title: "大模型微调 Fine-tuning", desc: "微调是用私有数据继续训练预训练模型，让它更懂你的领域。LoRA/QLoRA 是高效微调方法，显存占用低。",
    code: "from peft import LoraConfig, get_peft_model\ncfg=LoraConfig(r=8, lora_alpha=32, target_modules=['q_proj','v_proj'])\nmodel=get_peft_model(model, cfg)",
    res: [{t:"video",title:"LoRA 微调实战",url:R.bilibili("LoRA 大模型微调")},{t:"article",title:"PEFT 与 LoRA",url:R.juejin("LoRA QLoRA 微调")},{t:"doc",title:"Hugging Face PEFT",url:"https://huggingface.co/docs/peft/index"}]},
  { topic: "ai", level: 4, title: "Agent 与自动化编排", desc: "Agent = 模型 + 工具 + 记忆 + 规划。2026 年 Agent 已成最热落地方向：本地开源模型（如 Qwen3.8、智谱 GLM-5.3）让 Agent 跑在自己的电脑上，配合工具调用完成多步任务。",
    tip: "2026-08 热点：智谱开源 GLM-5.3（主打智能体编程与网络防御）；Qwen3.8 27B 可在 Mac Studio 本地运行。",
    res: [{t:"video",title:"AI Agent 实战",url:R.bilibili("AI Agent 智能体 实战")},{t:"article",title:"Agent 架构设计",url:R.juejin("AI Agent 架构 ReAct")},{t:"paper",title:"ReAct",url:R.arxiv("2210.03629")}]},
  { topic: "ai", level: 4, title: "本地部署与开源生态", desc: "用 Ollama/llama.cpp 把开源大模型跑在本地，数据不出本机、零 API 成本。适合隐私敏感与离线场景，是 2026 个人开发者的主流选择。",
    code: "# 终端一行拉起本地模型\nollama run qwen3.8:27b\n# 用 Python 调用本地模型\nfrom openai import OpenAI\nc=OpenAI(base_url='http://localhost:11434/v1',api_key='ollama')",
    res: [{t:"video",title:"本地部署大模型",url:R.bilibili("Ollama 本地部署 大模型")},{t:"article",title:"llama.cpp 量化部署",url:R.juejin("本地部署 大模型 Ollama")},{t:"doc",title:"Ollama 文档",url:"https://ollama.com/"}]}
];

// ============ 项目实战（学习链条第三阶段） ============
const PROJECTS = [
  { title: "用 RAG 搭建企业级文档问答", tag:"AI 知识", color:"#7c3aed",
    stack:["LangChain","向量库 FAISS","RAG"], ref:"RAG 检索增强",
    desc:"把公司手册/论文变成可对话的知识库：文档切分→Embedding→检索→生成。照着开源示例做，直接产出可演示作品。" },
  { title: "调用大模型 API 做智能助手", tag:"AI 知识", color:"#2563eb",
    stack:["Python","OpenAI API","Prompt"], ref:"调用大模型 API",
    desc:"封装一个能查天气、算数据、写周报的助手。重点是工程化：错误处理、成本控制、流式输出。" },
  { title: "时间序列预测实战", tag:"数据分析", color:"#f97316",
    stack:["pandas","sklearn","ARIMA/Prophet"], ref:"时间序列与透视表",
    desc:"用销售/流量数据预测未来趋势：清洗→特征→建模→回测。沉淀一套可复用的预测脚本。" },
  { title: "本地部署 + 微调垂直模型", tag:"AI 知识", color:"#db2777",
    stack:["PyTorch","LoRA","Ollama"], ref:"本地部署与开源生态",
    desc:"在一张消费级显卡上，用 LoRA 把通用模型微调成你行业的专家，并用 Ollama 对外提供推理接口。" },
  { title: "数据分析可视化看板", tag:"数据分析", color:"#ea580c",
    stack:["pandas","Plotly","Streamlit"], ref:null,
    desc:"把一份杂乱的业务数据做成可交互看板，让老板一眼看懂。比静态报告更有说服力。" },
  { title: "搭一个能调工具的 Agent", tag:"AI 知识", color:"#ef4444",
    stack:["Agent 框架","工具调用","规划"], ref:"Agent 智能体",
    desc:"让 Agent 自主拆解任务、调用搜索/代码/数据库完成目标。理解 ReAct、规划与记忆即可上手。" }
];

// ============ 资料库分类顺序与配色 ============
const CAT_ORDER = ["新手入门","提示工程","RAG 检索增强","Agent 智能体","模型架构","模型微调",
  "训练与分布式","评测与基准","面试准备","行业应用与工具","项目实战","AI 晨报知识库"];
const CAT_COLOR = {
  "新手入门":"#16a34a","提示工程":"#0ea5e9","RAG 检索增强":"#7c3aed","Agent 智能体":"#ef4444",
  "模型架构":"#2563eb","模型微调":"#f59e0b","训练与分布式":"#db2777","评测与基准":"#0891b2",
  "面试准备":"#dc2626","行业应用与工具":"#059669","项目实战":"#7c3aed","AI 晨报知识库":"#3B6CB7"
};

// ============ 文档查找（按分类名匹配 DOCS，用于项目参考） ============
function findDoc(kw){
  if(!kw) return null;
  return DOCS.find(d => d.cat === kw) || null;
}
