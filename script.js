// ============ 视图切换 ============
const VIEWS = ["knowledge","notes","briefing","trends","library","projects","code","quiz","favorites"];
const VIEW_TITLES = {
  knowledge:"学习图谱", code:"在线编程", quiz:"自我审核", notes:"学习笔记",
  briefing:"AI 晨报", trends:"AI 趋势", library:"资料库", projects:"项目实战", favorites:"收藏夹"
};
const SITE_TITLE = "沐阳 · 数据与 AI 学习图谱";
function showView(v){
  if(!VIEWS.includes(v)) v = "knowledge";
  VIEWS.forEach(x=>{ const el=document.getElementById("view-"+x); if(el) el.classList.toggle("hidden", x!==v); });
  document.querySelectorAll(".nav-tab").forEach(x=>x.classList.toggle("active", x.dataset.view===v));
  if(v==="library") renderLibrary();
  if(v==="code" && !window._codeInited){ window._codeInited=true; setCodeMode("python"); }
  if(v==="briefing"){ renderBriefing(); loadBriefingNews(); }
  if(v==="quiz") refreshBest();
  if(v==="notes") renderNotes();
  if(v==="trends") renderTrends();
  if(v==="projects") renderProjectsView();
  if(v==="favorites") renderFavorites();
  // 更新 URL hash 与标题，使每个视图可独立分享、被搜索引擎收录
  try{ if(location.hash !== "#"+v) history.replaceState(null, "", "#"+v); }catch(e){ try{ location.hash = v; }catch(e2){} }
  document.title = v==="knowledge" ? SITE_TITLE : VIEW_TITLES[v] + " · " + SITE_TITLE;
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".nav-tab").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
// 浏览器前进/后退 + 初始加载时按 hash 路由
window.addEventListener("hashchange", ()=>{ const h=location.hash.replace("#",""); if(VIEWS.includes(h)) showView(h); });

// ============ 知识点渲染 ============
const state = { topic: "all", lv: "all" };
function escapeHtml(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function tagName(t){ return ({video:"视频",article:"文章",paper:"论文",doc:"文档",course:"课程"})[t] || t; }
function adjust(hex, amt){
  const num = parseInt(hex.replace("#",""),16);
  let r=Math.min(255,Math.max(0,(num>>16)+amt)), g=Math.min(255,Math.max(0,((num>>8)&255)+amt)), b=Math.min(255,Math.max(0,(num&255)+amt));
  return "#"+((r<<16)|(g<<8)|b).toString(16).padStart(6,"0");
}
const FAV_KEY = "site-favs";
let _favCache = null; // 收藏内存缓存：必须在任何 getFavs() 调用前完成声明（防止 TDZ 崩溃）

function render(){
  const box = document.getElementById("content");
  const topics = state.topic === "all" ? Object.keys(TOPICS) : [state.topic];
  let html = "", total = 0;
  topics.forEach(t => {
    const items = DATA.filter(d => d.topic === t && (state.lv === "all" || String(d.level) === String(state.lv)));
    if(!items.length) return;
    total += items.length;
    const meta = TOPICS[t];
    html += `<div class="topic-title">
      <div class="topic-icon" style="background:linear-gradient(135deg,${meta.accent},${adjust(meta.accent,40)})">${meta.icon}</div>
      <span>${meta.name}</span><span class="topic-desc">${meta.desc}</span></div><div class="grid">`;
    items.forEach(d => {
      const di = DATA.indexOf(d);
      const l = LEVELS[d.level];
      let inner = `<div class="kp" style="--bd:${l.color}">
        ${favStarHtml("知识点", "kp::"+d.topic+"::"+d.title, d.title, "#", d.topic)}
        <div class="kp-head"><h3>${escapeHtml(d.title)}</h3>
          <span class="badge" style="background:${l.color}">${l.icon} ${l.name}</span></div>
        <p>${escapeHtml(d.desc)}</p>`;
      if(d.code) inner += `<pre><code>${escapeHtml(d.code)}</code></pre>`;
      if(d.tip) inner += `<div class="tip">💡 ${escapeHtml(d.tip)}</div>`;
      if(d.res && d.res.length){
        inner += `<div class="res"><div class="res-title">📚 推荐资源</div><div class="res-list">${
          d.res.map(r => `<a class="res-item" href="${r.url}" target="_blank" rel="noopener"><span class="tag ${r.t}">${tagName(r.t)}</span>${escapeHtml(r.title)}</a>`).join("")}</div></div>`;
      }
      inner += `<button class="lib-btn" onclick="showView('library');window.scrollTo({top:0,behavior:'smooth'})">📚 去资料库找资源</button>`;
      inner += `</div>`;
      html += inner;
    });
    html += `</div>`;
  });
  box.innerHTML = total ? html : `<div class="empty">该筛选下暂无知识点，换个方向或学习阶段试试～</div>`;
  document.getElementById("s-count").textContent = DATA.length;
  renderProjects();
}

function renderProjects(){
  const box = document.getElementById("projects");
  box.innerHTML = PROJECTS.map(p => {
    const ref = findDoc(p.ref);
    const refHtml = ref
      ? `<a class="ref" href="${ref.url}" target="_blank" rel="noopener">📄 参考资源：${escapeHtml(ref.name)} ↗</a>`
      : `<span class="ref" style="color:var(--muted)">📚 对应上方知识点 + 资料库</span>`;
    return `<div class="proj">
      ${favStarHtml("项目", "proj::"+p.title, p.title, (ref?ref.url:"#"), p.tag)}
      <span class="tag" style="background:${p.color}">${p.tag}</span>
      <h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.desc)}</p>
      <div class="stack">${p.stack.map(s=>`<span>${escapeHtml(s)}</span>`).join("")}</div>${refHtml}</div>`;
  }).join("");
}

// ============ AI 趋势全景渲染 ============
const CONF_LABEL = { high:["高","conf-high"], mid:["中","conf-mid"], low:["低","conf-low"] };
function renderTrends(){
  const T = window.AI_TRENDS;
  if(!T) return;
  // 关键数据
  document.getElementById("kd-grid").innerHTML = T.keydata.map(g=>`
    <div class="kd-card">
      <h3><span class="kd-dot" style="background:${g.color}"></span>${g.group}</h3>
      ${g.items.map(it=>`
        <div class="kd-item">
          <div class="kd-val">${escapeHtml(it.v)}</div>
          <div class="kd-sub">${escapeHtml(it.s)}</div>
          <div class="kd-src">来源：${escapeHtml(it.src)}</div>
        </div>`).join("")}
    </div>`).join("");
  // 六个切片
  document.getElementById("slice-grid").innerHTML = T.slices.map(s=>`
    <div class="slice-card" style="--sc:${s.color}">
      <div class="slice-head">
        <div class="slice-icon" style="background:linear-gradient(135deg,${s.color},${adjust(s.color,40)})">${s.icon}</div>
        <h3>${s.title}</h3>
      </div>
      <div class="slice-sum">${escapeHtml(s.summary)}</div>
      <div class="slice-points">
        ${s.points.map(p=>`<div class="slice-point"><b>${escapeHtml(p.t)}：</b>${escapeHtml(p.d)}<span class="sp-src">来源：${escapeHtml(p.src)}</span></div>`).join("")}
      </div>
    </div>`).join("");
  // 三极格局
  document.getElementById("pole-grid").innerHTML = T.poles.map(p=>`
    <div class="pole-card" style="--pc:${p.color}">
      <h3>${p.name}</h3>
      <div class="pole-tag">${escapeHtml(p.tag)}</div>
      <ul>${p.bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join("")}</ul>
      <div class="pole-src">来源：${escapeHtml(p.src)}</div>
    </div>`).join("");
  // 预测
  const sliceName = Object.fromEntries(T.slices.map(s=>[s.id,s.title]));
  document.getElementById("pred-grid").innerHTML = T.predictions.map(p=>{
    const [lab,cls] = CONF_LABEL[p.conf] || ["中","conf-mid"];
    return `<div class="pred-card">
      <div class="pred-top"><span class="pred-title">${escapeHtml(p.title)}</span>
        <span class="conf ${cls}">${lab}信度</span></div>
      <div class="pred-d">${escapeHtml(p.d)}</div>
      <div class="pred-meta"><span class="pred-slice">▸ ${escapeHtml(sliceName[p.slice]||"")}</span><span>${escapeHtml(p.src)}</span></div>
    </div>`;
  }).join("");
  // 知识速览
  document.getElementById("kno-grid").innerHTML = (window.AI_KNOWLEDGE||[]).map(k=>`
    <div class="kno-card" style="--kc:${k.color}">
      <div class="kno-top"><div class="kno-ico">${k.icon}</div>
        <div><h3>${escapeHtml(k.title)}</h3><div class="kno-en">${escapeHtml(k.en)}</div></div></div>
      <div class="kno-d">${escapeHtml(k.d)}</div>
      <div class="kno-why"><b>为什么重要 ·</b> ${escapeHtml(k.why)}</div>
    </div>`).join("");

  // GitHub 趋势
  document.getElementById("gh-grid").innerHTML = (window.GH_TRENDS||[]).map(r=>`
    <div class="gh-card">
      ${favStarHtml("项目", "gh::"+r.name, r.name, "https://github.com/"+r.name, "GitHub 趋势")}
      <div class="gh-rank">${r.rank}</div>
      <div class="gh-body">
        <div class="gh-name"><a href="https://github.com/${escapeHtml(r.name)}" target="_blank" rel="noopener">${escapeHtml(r.name)}</a></div>
        <div class="gh-desc">${escapeHtml(r.desc)}</div>
        <div class="gh-meta">
          <span class="gh-star">★ ${escapeHtml(r.stars)}</span>
          <span class="gh-fork">⑂ ${escapeHtml(r.forks)}</span>
          <span class="gh-lang"><span class="ld"></span>${escapeHtml(r.lang)}</span>
        </div>
      </div>
    </div>`).join("");

  // 多方面 AI 资讯（实时拉取 + 分类筛选）
  loadTrendsNews();

  // 来源（含实时资讯与项目趋势）
  document.getElementById("trends-src-list").textContent =
    [...T.sources, "AI HOT · 实时资讯聚合", "GitHub AI 趋势追踪 · 周榜"].join(" · ");
}

// trends 视图内「多方面 AI 资讯」：实时拉取 / 分类筛选 / 收藏
const NEWS_CAT = {
  model:   {label:"模型发布", color:"#6366f1", icon:"🚀"},
  product: {label:"产品/工具", color:"#0ea5e9", icon:"🛠️"},
  industry:{label:"行业动态", color:"#f59e0b", icon:"🏛️"},
  paper:   {label:"论文研究", color:"#ec4899", icon:"📄"},
  tip:     {label:"技巧/观点", color:"#10b981", icon:"💡"}
};
function fmtTime(ts){
  try{ return new Date(ts).toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}); }
  catch(e){ return ""; }
}
// ============ 主页实时时钟 ============
function pad2(n){ return String(n).padStart(2,"0"); }
function cnDateStr(d){ return d.getFullYear()+"-"+pad2(d.getMonth()+1)+"-"+pad2(d.getDate()); }
function cnWeek(d){ return ["周日","周一","周二","周三","周四","周五","周六"][d.getDay()]; }
function startClock(){
  const tick = ()=>{
    const d = new Date();
    const lc = document.getElementById("lc-text");
    if(lc) lc.textContent = cnDateStr(d)+" "+cnWeek(d)+" · "+pad2(d.getHours())+":"+pad2(d.getMinutes())+":"+pad2(d.getSeconds());
    const bd = document.getElementById("brief-date-live");
    if(bd) bd.textContent = cnDateStr(d)+" "+cnWeek(d)+" · 北京时间 · 资讯实时同步";
  };
  tick();
  setInterval(tick, 1000);
}
startClock();
function mapApiItem(it){
  const m = NEWS_CAT[it.category] || {label:"资讯", color:"#64748b", icon:"•"};
  return {
    title: it.title,
    cat: it.category,
    catLabel: m.label,
    color: m.color,
    icon: m.icon,
    source: (it.source && it.source.name) || "AI HOT",
    time: fmtTime(new Date(it.publishedAt).getTime()),
    published: it.publishedAt || "",
    hot: !!it.selected,
    summary: it.summary || "",
    link: (it.links && (it.links.original || it.links.aihot)) || "#"
  };
}
async function loadTrendsNews(force){
  const status = document.getElementById("news-status");
  const cacheKey = "trends-news-cache";
  let cached = null;
  try{ cached = JSON.parse(localStorage.getItem(cacheKey) || "null"); }catch(e){}
  if(!force && cached && cached.ts && Date.now()-cached.ts < 30*60*1000 && cached.items && cached.items.length){
    renderTrendsNewsFrom(cached.items);
    if(status) status.innerHTML = "已缓存 · 更新于 <span class='live'>"+fmtTime(cached.ts)+"</span>";
    return;
  }
  if(status) status.textContent = "正在拉取实时资讯…";
  try{
    const ctrl = new AbortController();
    const timer = setTimeout(()=>ctrl.abort(), 7000);
    const r = await fetch("https://aihot.virxact.com/api/v1/items?mode=selected&window=7d&limit=24", {signal:ctrl.signal});
    clearTimeout(timer);
    if(!r.ok) throw new Error("HTTP "+r.status);
    const j = await r.json();
    const items = (j.items||[]).map(mapApiItem).filter(Boolean);
    if(!items.length) throw new Error("empty");
    try{ localStorage.setItem(cacheKey, JSON.stringify({ts:Date.now(), items})); }catch(e){}
    renderTrendsNewsFrom(items);
    if(status) status.innerHTML = "<span class='live'>● 实时</span> · 更新于 "+fmtTime(Date.now());
  }catch(e){
    // 二级兜底：尝试仓库内每日自动生成的快照
    try{
      const r2 = await fetch("./news-data.json", {cache:"no-store"});
      if(r2.ok){ const j2 = await r2.json(); const items=(j2.items||[]).map(mapApiItem).filter(Boolean);
        if(items.length){ renderTrendsNewsFrom(items); if(status) status.textContent="快照（仓库每日自动刷新）"; return; } }
    }catch(e2){}
    renderTrendsNewsFrom(window.AI_NEWS || []);
    if(status) status.textContent = "离线快照（接口暂不可用，已用内置最近资讯）";
  }
}
function renderTrendsNewsFrom(news){
  const filters = document.getElementById("news-filters");
  const grid = document.getElementById("news-grid");
  if(!filters || !grid) return;
  const CAT_ICON = { model:"🚀", product:"🛠️", industry:"🏛️", paper:"📄", tip:"💡" };
  const counts = { all: news.length };
  news.forEach(n => counts[n.cat] = (counts[n.cat]||0) + 1);
  if(!filters.dataset.built){
    const cats = [["all","全部"],["model","模型发布"],["industry","行业动态"],
      ["tip","技巧/观点"],["paper","论文研究"],["product","产品/工具"]];
    filters.innerHTML = cats.map((c,i)=>{
      const d = c[0]==="all" ? counts.all : (counts[c[0]]||0);
      return `<div class="nf ${i===0?'active':''}" data-cat="${c[0]}">${c[1]}<span class="nfd">${d}</span></div>`;
    }).join("");
    filters.dataset.built = "1";
    filters.addEventListener("click", e=>{
      const f = e.target.closest(".nf"); if(!f) return;
      filters.querySelectorAll(".nf").forEach(x=>x.classList.remove("active"));
      f.classList.add("active");
      drawNews(f.dataset.cat);
    });
  }
  function drawNews(cat){
    grid.innerHTML = "";
    const list = cat==="all" ? news : news.filter(n=>n.cat===cat);
    if(!list.length){ grid.innerHTML = `<div class="news-empty">该分类暂无资讯</div>`; return; }
    grid.innerHTML = list.map(n=>{
      const hot = n.hot ? `<span class="news-hot">🔥 热</span>` : "";
      return `<div class="news-card" style="--nc:${n.color}">
        ${favStarHtml("资讯", "news::"+n.link, n.title, n.link, n.catLabel)}
        <div class="news-top"><span class="news-cat" style="background:${n.color}"><span class="ne">${CAT_ICON[n.cat]||"•"}</span>${escapeHtml(n.catLabel)}</span>
          <span style="display:flex;gap:8px;align-items:center">${hot}<span class="news-time">${escapeHtml(n.time)}</span></span></div>
        <div class="news-title"><a href="${escapeHtml(n.link)}" target="_blank" rel="noopener">${escapeHtml(n.title)}</a></div>
        <div class="news-sum">${escapeHtml(n.summary)}</div>
        <div class="news-foot"><span class="news-src">📡 ${escapeHtml(n.source)}</span>
          <a class="news-link" href="${escapeHtml(n.link)}" target="_blank" rel="noopener">阅读原文 →</a></div>
      </div>`;
    }).join("");
  }
  const active = filters.querySelector(".nf.active");
  drawNews(active ? active.dataset.cat : "all");
}

// ============ 资料库渲染 ============
const libState = { cat: "all", lv: "all" };
const PDF_COLOR = { python:"#3776ab", mysql:"#00758f", data:"#0d9488", ai:"#7c3aed" };
function buildLibCats(){
  const box = document.getElementById("lib-cat-chips");
  CAT_ORDER.forEach(c => {
    const n = DOCS.filter(d => d.cat === c).length;
    if(!n) return;
    const b = document.createElement("button");
    b.className = "chip libcat"; b.dataset.cat = c;
    b.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:${CAT_COLOR[c]||'#999'};display:inline-block"></span>${c} <span style="opacity:.6">(${n})</span>`;
    box.appendChild(b);
  });
}
function renderLibrary(){
  const box = document.getElementById("library");
  const cats = libState.cat === "all" ? CAT_ORDER : [libState.cat];
  let html = "", shown = 0;
  cats.forEach(c => {
    let docs = DOCS.filter(d => d.cat === c && (libState.lv === "all" || String(d.level) === String(libState.lv)));
    if(!docs.length) return;
    // 「全部」视图下资讯存档类只渲染最新 100 条，避免 DOM 过大导致卡顿；点分类可看全部
    let extra = 0;
    if(libState.cat === "all" && docs.length > 100){
      extra = docs.length - 100;
      docs = docs.slice(0, 100);
    }
    shown += docs.length;
    const col = CAT_COLOR[c] || "#999";
    const minLv = Math.min.apply(null, docs.map(d=>d.level||2));
    html += `<div class="lib-cat"><div class="lib-cat-head">
        <span class="pill" style="background:${col}">${c}</span>
        <span class="cnt">${docs.length} 个 · 难度 ${["","🌱零基础","🌿刚入门","🌳已熟悉","🚀大神级"][minLv]||""} 起</span>
      </div><div class="lib-cat-desc">${DOC_CATS[c]||""}</div>
      <div class="doc-grid">${docs.map(d => {
        const l = LEVELS[d.level];
        return `<div class="doc">
          <a class="doc-anchor" href="${d.url}" target="_blank" rel="noopener" style="display:flex;gap:10px;align-items:flex-start;text-decoration:none;color:inherit;flex:1;min-width:0">
          <span class="lv-dot" style="background:${l.color}"></span>
          <span class="meta"><span class="name">${escapeHtml(d.name)}</span>${d.desc?`<br><span style="font-size:12px;color:var(--muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.5">${escapeHtml(d.desc)}</span>`:""}${(d.src||d.date)?`<br><span style="font-size:11px;color:var(--muted);opacity:.85">${[d.sec,d.src,d.date].filter(Boolean).map(escapeHtml).join(" · ")}</span>`:""}<br><span class="open">打开资源 ↗</span></span></a>
          ${favStarHtml("资料", "doc::"+d.url, d.name, d.url, c)}</div>`;
      }).join("")}</div>${extra?`<div class="lib-more">📦 该分类共 ${docs.length+extra} 条，「全部」视图仅展示最新 ${docs.length} 条 — 点上方分类标签可查看全部</div>`:""}</div>`;
  });
  let htmlAll = html;
  // 本地资料（PDF/PPTX）部分
  const pcats = (libState.cat === "all")
    ? PDF_CATS.map(c=>c[0])
    : (PDF_CATS.some(c=>c[0]===libState.cat) ? [libState.cat] : []);
  let phtml = "";
  pcats.forEach(c=>{
    const items = PDFS.filter(p=>p.cat===c);
    if(!items.length) return;
    const cname = (PDF_CATS.find(x=>x[0]===c)||[c,""])[1];
    phtml += `<div class="lib-cat"><div class="lib-cat-head">
        <span class="pill" style="background:${PDF_COLOR[c]||'#888'}">${cname}</span>
        <span class="cnt">${items.length} 份 · 本机文件</span>
      </div><div class="lib-cat-desc">📁 本地 PDF/PPTX：双击打开本页可直接跳转本地文件；在线部署前请将文件上传到网盘/OSS 后替换 url。</div>
      <div class="doc-grid">${items.map(p=>`<div class="doc">
          <a class="doc-anchor" href="${p.url}" target="_blank" rel="noopener" style="display:flex;gap:10px;align-items:flex-start;text-decoration:none;color:inherit;flex:1;min-width:0">
          <span class="lv-dot" style="background:${PDF_COLOR[c]||'#888'}"></span>
          <span class="meta"><span class="name">${escapeHtml(p.name)}</span><br><span class="open">${p.size} MB · 打开 ↗</span></span></a>
          ${favStarHtml("资料", "pdf::"+p.url, p.name, p.url, cname)}</div>`).join("")}</div></div>`;
  });
  box.innerHTML = (shown || phtml) ? (htmlAll + phtml) : `<div class="empty">该筛选下暂无资源，换个分类或难度试试～</div>`;
}

// ============ 筛选交互 ============
document.querySelectorAll(".chip.topic").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".chip.topic").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); state.topic=b.dataset.topic; render();
}));
document.querySelectorAll(".chip.lv").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".chip.lv").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); state.lv=b.dataset.lv; render();
}));
document.getElementById("lib-cat-chips").addEventListener("click",e=>{
  const b=e.target.closest(".libcat"); if(!b) return;
  document.querySelectorAll(".libcat").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); libState.cat=b.dataset.cat; renderLibrary();
});
document.getElementById("lib-lv-chips").addEventListener("click",e=>{
  const b=e.target.closest(".lvlib"); if(!b) return;
  document.querySelectorAll(".lvlib").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); libState.lv=b.dataset.lv; renderLibrary();
});
function filterPreset(topic, lv){
  state.topic=topic; state.lv=lv;
  document.querySelectorAll(".chip.topic").forEach(x=>x.classList.toggle("active",x.dataset.topic===topic));
  document.querySelectorAll(".chip.lv").forEach(x=>x.classList.toggle("active",x.dataset.lv===String(lv)));
  render();
  showView("knowledge");
  window.scrollTo({top:document.getElementById("view-knowledge").offsetTop+420,behavior:"smooth"});
}

// ============ 在线编程 ============
const SAMPLES = {
  python: `# 计算 1~100 的和\n total = sum(range(1, 101))\nprint("1到100的和 =", total)\n\n# 列表推导：生成前 5 个数的平方\nsquares = [x*x for x in range(1, 6)]\nprint("平方表:", squares)\n\n# 用字典统计词频\nwords = ["apple","banana","apple","cherry"]\nfrom collections import Counter\nprint(Counter(words))`,
  sql: `CREATE TABLE employee (id INT, name TEXT, salary INT);\nINSERT INTO employee VALUES\n  (1,'小明',8000),(2,'小红',12000),(3,'小刚',9500),(4,'小丽',15000);\n\n-- 薪资高于 9000 的员工，按薪资降序\nSELECT name, salary FROM employee\nWHERE salary > 9000 ORDER BY salary DESC;\n\n-- 部门平均薪资\nSELECT AVG(salary) AS 平均薪资 FROM employee;`
};
let codeMode = "python";
function setCodeMode(m){
  codeMode = m;
  document.getElementById("mode-py").classList.toggle("active", m==="python");
  document.getElementById("mode-sql").classList.toggle("active", m==="sql");
  loadSample();
}
function loadSample(){ document.getElementById("code-editor").value = SAMPLES[codeMode]; }
function setStatus(t){ document.getElementById("code-status").textContent = t; }
function appendOut(t, isErr){ 
  const o = document.getElementById("code-output");
  if(t==="__reset__"){ o.textContent=""; return; }
  const span = document.createElement("span"); if(isErr) span.className="err"; span.textContent = t; o.appendChild(span);
}
let pyodideReady = null, sqlReady = null, pyodide = null;
function loadPyodideRuntime(){
  if(pyodideReady) return pyodideReady;
  setStatus("⏳ 正在加载 Python 运行时（首次约需几秒）…");
  pyodideReady = new Promise((resolve,reject)=>{
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
    s.onload = async ()=>{
      try{ const py = await loadPyodide({indexURL:"https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"});
        pyodide = py; setStatus("✅ Python 就绪"); resolve(py); }
      catch(e){ setStatus("❌ 加载失败，请检查网络"); reject(e); }
    };
    s.onerror = ()=>{ setStatus("❌ 脚本加载失败"); reject(new Error("pyodide load error")); };
    document.head.appendChild(s);
  });
  return pyodideReady;
}
function loadSqlRuntime(){
  if(sqlReady) return sqlReady;
  setStatus("⏳ 正在加载 SQL 运行时…");
  sqlReady = new Promise((resolve,reject)=>{
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js";
    s.onload = ()=>{
      initSqlJs({ locateFile: f=>"https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/"+f })
        .then(SQL=>{ window.SQL=SQL; setStatus("✅ SQL 就绪"); resolve(SQL); })
        .catch(e=>{ setStatus("❌ 加载失败"); reject(e); });
    };
    s.onerror = ()=>{ setStatus("❌ 脚本加载失败"); reject(new Error("sql.js load error")); };
    document.head.appendChild(s);
  });
  return sqlReady;
}
async function runCode(){
  const code = document.getElementById("code-editor").value;
  const btn = document.getElementById("run-btn");
  btn.disabled = true; appendOut("__reset__");
  try{
    if(codeMode==="python"){
      const py = await loadPyodideRuntime();
      let buf = "";
      py.setStdout({ batched:(s)=>{ buf+=s+"\n"; } });
      py.setStderr({ batched:(s)=>{ buf+=s+"\n"; } });
      try{ await py.runPythonAsync(code); appendOut(buf); }
      catch(e){ appendOut(String(e.message||e), true); }
    } else {
      const SQL = await loadSqlRuntime();
      const db = new SQL.Database();
      try{
        const results = db.exec(code);
        if(!results.length){ appendOut("（语句已执行，无返回结果集）"); }
        else{
          let out = "";
          results.forEach(r=>{
            out += r.columns.join(" | ") + "\n";
            out += "-".repeat(r.columns.join(" | ").length) + "\n";
            r.values.forEach(row=>{ out += row.join(" | ") + "\n"; });
            out += "\n";
          });
          appendOut(out);
        }
      }catch(e){ appendOut("SQL 错误: " + e.message, true); }
      db.close();
    }
  }catch(e){ appendOut("运行出错: " + (e.message||e), true); }
  finally{ btn.disabled = false; }
}

// ============ 自我审核测验 ============
const QUIZ_BATCH = 10;
let quiz = { list:[], idx:0, score:0, wrong:[], scoreAtBatch:0 };
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=a[i]; a[i]=a[j]; a[j]=t; } }
function refreshBest(){
  const t = document.getElementById("quiz-topic").value;
  const best = JSON.parse(localStorage.getItem("quiz_best")||"{}")[t];
  document.getElementById("quiz-best").textContent = best ? `历史最佳：${best.score}/${best.total}（${best.acc}%）` : "暂无记录";
}
function startQuiz(){
  const t = document.getElementById("quiz-topic").value;
  let arr = (QUIZZES[t]||[]).map((q,i)=>({...q, id:t+"-"+i}));
  shuffle(arr);
  quiz.list = arr; quiz.idx = 0; quiz.score = 0; quiz.wrong = []; quiz.scoreAtBatch = 0;
  renderQuestion();
}
function renderQuestion(){
  const area = document.getElementById("quiz-area");
  if(quiz.idx >= quiz.list.length){ return finishQuiz(); }
  const q = quiz.list[quiz.idx];
  const total = quiz.list.length;
  let optsHtml = "";
  if(q.type==="single"){
    optsHtml = q.options.map((o,i)=>`<div class="quiz-opt" data-i="${i}" onclick="answer(${i})">${String.fromCharCode(65+i)}. ${escapeHtml(o)}</div>`).join("");
  } else {
    // 判断题固定：索引 1=对，索引 0=错
    optsHtml = `<div class="quiz-opt" data-i="1" onclick="answer(1)">✔ 对（正确）</div>
                <div class="quiz-opt" data-i="0" onclick="answer(0)">✘ 错（错误）</div>`;
  }
  area.innerHTML = `<div class="quiz-card">
    <div class="quiz-meta"><span>第 ${quiz.idx+1} / ${total} 题 · 第 ${Math.floor(quiz.idx/QUIZ_BATCH)+1}/${Math.ceil(total/QUIZ_BATCH)} 组</span><span>本组已答对 ${quiz.score - quiz.scoreAtBatch}</span></div>
    <div class="prog"><div style="width:${quiz.idx/total*100}%"></div></div>
    <div class="quiz-q">${q.type==="tf"?"【判断】":""}${escapeHtml(q.q)}</div>
    <div class="quiz-opts" id="qopts">${optsHtml}</div>
    <div id="qexplain"></div>
    <div class="quiz-actions"><span></span>
      <button class="btn" id="qnext" style="display:none" onclick="nextQ()">下一题 →</button></div>
  </div>`;
}
function answer(val){
  const q = quiz.list[quiz.idx];
  // 把判断题 answer 统一转成索引：true->1, false->0
  const qAnswer = q.type==="tf" ? (q.answer ? 1 : 0) : q.answer;
  const correct = (val === qAnswer);
  const opts = document.querySelectorAll("#qopts .quiz-opt");
  opts.forEach(o=>o.onclick=null);
  // 高亮正确答案
  if(opts[qAnswer]) opts[qAnswer].classList.add("correct");
  if(correct){
    quiz.score++;
  } else {
    if(opts[val]) opts[val].classList.add("wrong");
    quiz.wrong.push(q);
  }
  document.getElementById("qexplain").innerHTML = `<div class="quiz-explain">💡 ${escapeHtml(q.explain)}</div>`;
  // 每完成一组（10 题）且仍有剩余题目 → 弹出「换一批练习」，避免重复刷题
  if((quiz.idx+1) % QUIZ_BATCH === 0 && (quiz.idx+1) < quiz.list.length){
    showBatchCard();
    return;
  }
  const next = document.getElementById("qnext");
  next.style.display = "inline-block";
  next.textContent = "下一题 →";
  // 保存错题
  let wb = JSON.parse(localStorage.getItem("quiz_wrong")||"[]");
  if(!correct && !wb.find(x=>x.id===q.id)) wb.push({id:q.id, q:q.q, type:q.type, answer:q.answer, options:q.options, explain:q.explain});
  localStorage.setItem("quiz_wrong", JSON.stringify(wb));
}
function nextQ(){ quiz.idx++; renderQuestion(); }
function showBatchCard(){
  const batchNo = Math.floor(quiz.idx / QUIZ_BATCH) + 1;
  const roundScore = quiz.score - quiz.scoreAtBatch;
  const area = document.getElementById("quiz-area");
  area.innerHTML = `<div class="quiz-card quiz-result">
    <div class="big">${roundScore} / ${QUIZ_BATCH}</div>
    <div style="font-size:18px;font-weight:800;margin-top:6px">本组（第 ${batchNo} 组）正确率 ${Math.round(roundScore/QUIZ_BATCH*100)}%</div>
    <p style="color:var(--muted);margin-top:10px">已练习 ${quiz.idx+1} / ${quiz.list.length} 题，继续练习下一组～</p>
    <button class="btn" style="margin-top:16px" onclick="nextBatch()">🔁 换一批练习（下 ${Math.min(QUIZ_BATCH, quiz.list.length-(quiz.idx+1))} 题）→</button>
  </div>`;
}
function nextBatch(){ quiz.scoreAtBatch = quiz.score; quiz.idx++; renderQuestion(); }
function finishQuiz(){
  const total = quiz.list.length, acc = Math.round(quiz.score/total*100);
  const area = document.getElementById("quiz-area");
  let msg = acc>=90?"太强了，稳！🏆" : acc>=60?"不错，继续巩固～💪" : "别急，多刷几遍就熟了 📚";
  area.innerHTML = `<div class="quiz-card quiz-result">
    <div class="big">${quiz.score} / ${total}</div>
    <div style="font-size:18px;font-weight:800;margin-top:6px">正确率 ${acc}%</div>
    <p style="color:var(--muted);margin-top:10px">${msg}</p>
    ${quiz.wrong.length?`<button class="btn btn-ghost" style="margin-top:16px" onclick="retryWrong()">🔁 只重做错题（${quiz.wrong.length} 道）</button>`:""}
    <button class="btn" style="margin-top:16px" onclick="startQuiz()">再来一次</button>
  </div>`;
  const best = JSON.parse(localStorage.getItem("quiz_best")||"{}");
  const t = document.getElementById("quiz-topic").value;
  if(!best[t] || acc>best[t].acc) best[t] = {score:quiz.score, total, acc};
  localStorage.setItem("quiz_best", JSON.stringify(best));
  refreshBest();
}
function retryWrong(){
  const wb = JSON.parse(localStorage.getItem("quiz_wrong")||"[]");
  if(!wb.length){ startQuiz(); return; }
  quiz.list = wb.map((w)=>({type:w.type, q:w.q, answer:w.answer, options:w.options, explain:w.explain, id:w.id, _fromWrong:true}));
  quiz.idx=0; quiz.score=0; quiz.wrong=[]; quiz.scoreAtBatch=0; renderQuestion();
}
function showWrongBook(){
  const wb = JSON.parse(localStorage.getItem("quiz_wrong")||"[]");
  const area = document.getElementById("quiz-area");
  if(!wb.length){ area.innerHTML = `<div class="empty">🎉 还没有错题，去测验里练练吧！</div>`; return; }
  area.innerHTML = `<div class="quiz-card"><h3 style="margin-bottom:12px">📕 错题本（${wb.length} 道）</h3>` +
    wb.map(w=>`<div style="padding:12px 0;border-bottom:1px dashed var(--line)">
      <div style="font-weight:700">${escapeHtml(w.q)}</div>
      <div class="quiz-explain" style="margin-top:8px">💡 ${escapeHtml(w.explain)}</div></div>`).join("") +
    `<button class="btn" style="margin-top:14px" onclick="retryWrong()">🔁 重做错题</button></div>`;
}

// ============ AI 晨报 ============
const BRIEF_CATS = {
  "model":{name:"模型发布/更新",color:"#3B6CB7"},
  "product":{name:"产品发布/更新",color:"#7BA05B"},
  "industry":{name:"行业动态",color:"#E0A33D"},
  "paper":{name:"论文研究",color:"#C25B4E"},
  "tip":{name:"技巧与观点",color:"#8C8475"}
};
let bFilter = "all";
// 晨报实时数据源：与 AI 趋势资讯同源（AI HOT API），每日自动更新；静态 BRIEFING 仅作离线兜底
let BRIEF_LIVE = null;
function toBriefItems(items){
  return items.map((it,i)=>({no:i+1, title:it.title, url:it.link, summary:it.summary, source:it.source, time:it.time, cat:it.cat, reason:""}));
}
let _briefLoading = false;
async function loadBriefingNews(){
  if(_briefLoading) return; // 防止初始化预热与视图切换并发重复请求
  _briefLoading = true;
  try{
    let cached = null;
    try{ cached = JSON.parse(localStorage.getItem("trends-news-cache") || "null"); }catch(e){}
    if(cached && cached.items && cached.items.length){ BRIEF_LIVE = toBriefItems(cached.items); renderBriefing(); return; }
    try{
      const ctrl = new AbortController(); const timer = setTimeout(()=>ctrl.abort(), 7000);
      const r = await fetch("https://aihot.virxact.com/api/v1/items?mode=selected&window=7d&limit=24", {signal:ctrl.signal});
      clearTimeout(timer);
      if(!r.ok) throw new Error("HTTP "+r.status);
      const j = await r.json();
      const items = (j.items||[]).map(mapApiItem).filter(Boolean);
      if(items.length){
        try{ localStorage.setItem("trends-news-cache", JSON.stringify({ts:Date.now(), items})); }catch(e){}
        BRIEF_LIVE = toBriefItems(items);
        renderBriefing();
      }
    }catch(e){ /* 接口不可用时静默保留静态兜底 */ }
  } finally { _briefLoading = false; }
}
function renderBriefing(){
  const src = (BRIEF_LIVE && BRIEF_LIVE.length) ? BRIEF_LIVE : BRIEFING;
  // 统计
  const counts = {};
  Object.keys(BRIEF_CATS).forEach(k=>counts[k]=src.filter(b=>b.cat===k).length);
  document.getElementById("brief-total").textContent = src.length;
  Object.keys(BRIEF_CATS).forEach(k=>{
    const el = document.getElementById("brief-stat-"+k);
    if(el) el.textContent = counts[k];
  });
  // 今日学习知识点
  const learns = src.filter(b=>b.learn).slice(0,3);
  document.getElementById("brief-learn").innerHTML = learns.length
    ? `今日学习 · ${learns.length} 个知识点：<b style="color:var(--brand)">${learns.map(l=>l.learn).join(" / ")}</b>`
    : "今日学习 · 暂无知识点标签";
  // 导航高亮
  document.querySelectorAll(".brief-nav-chip").forEach(c=>{
    c.classList.toggle("active", c.dataset.cat===bFilter);
  });
  // 渲染列表
  const box = document.getElementById("brief-main");
  const cats = bFilter==="all" ? Object.keys(BRIEF_CATS) : [bFilter];
  let html = "";
  cats.forEach(cat=>{
    const items = src.filter(b=>b.cat===cat);
    if(!items.length) return;
    const meta = BRIEF_CATS[cat];
    html += `<section class="brief-section" id="brief-${cat}">
      <div class="brief-sec-head">
        <span class="brief-sec-icon" style="background:${meta.color}">${meta.name[0]}</span>
        <h2>${meta.name}</h2>
        <span class="brief-sec-count">${items.length} 条</span>
      </div>
      <div class="brief-grid">${items.map((b,i)=>`
        <article class="brief-card" style="--accent:${meta.color}">
          <div class="brief-card-head">
            <span class="brief-no" style="background:${meta.color}">#${b.no}</span>
            <span class="brief-time">${escapeHtml(b.time)}</span>
            ${favStarHtml("资讯","brief::"+b.url, b.title, b.url, escapeHtml(b.source)+" · "+escapeHtml(b.time))}
          </div>
          <h3 class="brief-title"><a href="${b.url}" target="_blank" rel="noopener">${escapeHtml(b.title)}</a></h3>
          <p class="brief-summary">${escapeHtml(b.summary)}</p>
          ${b.reason?`<div class="brief-reason"><b>💡 为什么值得关注</b><br>${escapeHtml(b.reason)}</div>`:""}
          <div class="brief-foot">
            <span class="brief-chip" style="color:${meta.color};border-color:${meta.color}">${escapeHtml(b.source)}</span>
            <a class="brief-link" href="${b.url}" target="_blank" rel="noopener" style="color:${meta.color}">阅读原文 →</a>
          </div>
        </article>
      `).join("")}</div>
    </section>`;
  });
  box.innerHTML = html || `<div class="empty">暂无该分类资讯</div>`;
  // 滚动动画
  setTimeout(()=>{
    const io = new IntersectionObserver((es)=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold:.08});
    document.querySelectorAll(".brief-card").forEach(el=>io.observe(el));
  }, 50);
}
function setBriefFilter(cat){
  bFilter = cat;
  renderBriefing();
  if(cat!=="all"){
    const el = document.getElementById("brief-"+cat);
    if(el) el.scrollIntoView({behavior:"smooth",block:"start"});
  } else {
    window.scrollTo({top:0,behavior:"smooth"});
  }
}

// ============ 学习笔记渲染 ============
const NOTE_CAT_COLORS = {prompt:"#db2777",rag:"#0ea5e9",agent:"#7c3aed",llm:"#2563eb",
  ml:"#16a34a",data:"#0d9488",deploy:"#f59e0b",project:"#ef4444",interview:"#0891b2",industry:"#9333ea"};
const noteState = { cat: "all" };

function buildNoteCats(){
  const box = document.getElementById("note-cat-chips");
  NOTE_CATS.forEach(c=>{
    const n = NOTES.filter(d=>d.cat===c[0]).length;
    if(!n) return;
    const b = document.createElement("button");
    b.className = "chip notecat"; b.dataset.cat = c[0];
    b.innerHTML = `${c[2]} ${c[1]} <span style="opacity:.6">(${n})</span>`;
    box.appendChild(b);
  });
  box.addEventListener("click", e=>{
    const b = e.target.closest(".notecat"); if(!b) return;
    box.querySelectorAll(".notecat").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    noteState.cat = b.dataset.cat;
    renderNotesGrid();
  });
}
function renderNotes(){
  const box = document.getElementById("note-cat-chips");
  if(!box.dataset.built){ buildNoteCats(); box.dataset.built = "1"; }
  renderNotesGrid();
}
function renderNotesGrid(){
  const box = document.getElementById("notes-area");
  const list = noteState.cat === "all" ? NOTES : NOTES.filter(d=>d.cat===noteState.cat);
  box.innerHTML = `<div class="note-grid">${list.map(n=>{
    const col = NOTE_CAT_COLORS[n.cat] || "#7c3aed";
    return `<div class="note-card" style="--nc:${col}" onclick="openNote(${n.id})">
      ${favStarHtml("笔记", "note::"+n.id, n.title, "#", n.catName)}
      <span class="note-cat" style="background:${col}">${n.catName}</span>
      <h3>${escapeHtml(n.title)}</h3>
      <div class="note-ex">${escapeHtml(n.excerpt)}</div>
      <div class="note-open">📖 阅读全文 →</div>
    </div>`;
  }).join("")}</div>`;
}
function openNote(id){
  const n = NOTES.find(x=>x.id===id); if(!n) return;
  const col = NOTE_CAT_COLORS[n.cat] || "#7c3aed";
  const catEl = document.getElementById("note-modal-cat");
  catEl.textContent = n.catName; catEl.style.background = col;
  document.getElementById("note-modal-title").textContent = n.title;
  const body = document.getElementById("note-modal-body");
  body.innerHTML = (typeof marked !== "undefined") ? marked.parse(n.content) : escapeHtml(n.content);
  body.scrollTop = 0;
  document.getElementById("note-modal-foot").textContent = "来源文件：" + n.src;
  document.getElementById("note-modal").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeNote(){
  document.getElementById("note-modal").classList.remove("open");
  document.body.style.overflow = "";
}

// ============ 初始化 ============
document.getElementById("s-doc").textContent = DOCS.length;
document.getElementById("doc-num").textContent = "(" + DOCS.length + ")";
{ const _dh = document.getElementById("doc-num-hero"); if(_dh) _dh.textContent = DOCS.length; }
try{ localStorage.removeItem("brief-docs-live"); }catch(e){} // 清理历史自动同步遗留数据
buildLibCats();
render();
{ const _sy = document.getElementById("s-year"); if(_sy) _sy.textContent = new Date().getFullYear(); }
// 初始加载：按 URL hash 路由到对应视图（支持直接访问 #briefing / #trends 等）
{ const h = location.hash.replace("#",""); if(VIEWS.includes(h) && h!=="knowledge") showView(h); }
// 预热晨报 / 资料库实时数据（30 分钟缓存，多视图共享一次请求）
loadBriefingNews();
// 晨报导航事件委托
document.getElementById("brief-nav").addEventListener("click", e=>{
  const c = e.target.closest(".brief-nav-chip"); if(!c) return;
  setBriefFilter(c.dataset.cat);
});
// 笔记阅读器：Esc 关闭
document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeNote(); });

// ============ 主题切换（日间 / 夜间） ============
function currentIsDark(){
  const t = document.documentElement.getAttribute("data-theme");
  if(t==="dark") return true;
  if(t==="light") return false;
  return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
}
function applyTheme(theme){
  const root = document.documentElement;
  if(theme==="dark" || theme==="light") root.setAttribute("data-theme", theme);
  else root.removeAttribute("data-theme");
  const btn = document.getElementById("theme-btn");
  if(btn) btn.textContent = currentIsDark() ? "☀️" : "🌙";
}
function toggleTheme(){
  const next = currentIsDark() ? "light" : "dark";
  applyTheme(next);
  try{ localStorage.setItem("site-theme", next); }catch(e){}
}
(function initTheme(){
  let saved = null;
  try{ saved = localStorage.getItem("site-theme"); }catch(e){}
  // 未手动选择时跟随系统偏好；一旦选择则固定
  applyTheme(saved || null);
  // 动态计数，纠偏硬编码数值
  const nt = document.getElementById("note-total");
  if(nt && typeof NOTES !== "undefined") nt.textContent = NOTES.length;
  const ba = document.getElementById("brief-nav-all");
  if(ba && typeof BRIEFING !== "undefined") ba.textContent = (BRIEF_LIVE && BRIEF_LIVE.length) ? BRIEF_LIVE.length : BRIEFING.length;
})();

// ============ 兴趣收藏（红星） ============
function getFavs(){
  if(_favCache) return _favCache;
  try{ _favCache = JSON.parse(localStorage.getItem(FAV_KEY)||"{}"); }catch(e){ _favCache = {}; }
  return _favCache;
}
function favStarHtml(type, key, title, url, meta){
  const on = !!(getFavs()[key]);
  return `<button class="fav-star ${on?'on':''}" data-fav-key="${escapeHtml(key)}" data-fav-type="${escapeHtml(type)}" data-fav-title="${escapeHtml(title)}" data-fav-url="${escapeHtml(url)}" data-fav-meta="${escapeHtml(meta||'')}" onclick="event.stopPropagation();toggleFav(this)" aria-label="收藏" aria-pressed="${on}">${on?'★':'☆'}</button>`;
}
function toggleFav(btn){
  const f = getFavs(); const k = btn.dataset.favKey;
  if(f[k]){ delete f[k]; btn.classList.remove("on"); btn.textContent="☆"; btn.setAttribute("aria-pressed","false"); }
  else { f[k] = {type:btn.dataset.favType, title:btn.dataset.favTitle, url:btn.dataset.favUrl, meta:btn.dataset.favMeta||""};
    btn.classList.add("on"); btn.textContent="★"; btn.setAttribute("aria-pressed","true"); }
  try{ localStorage.setItem(FAV_KEY, JSON.stringify(f)); _favCache = f; }catch(e){}
  const fv = document.getElementById("view-favorites");
  if(fv && !fv.classList.contains("hidden")) renderFavorites();
}
const FAV_TYPE_COLOR = {资讯:"#6366f1",笔记:"#7c3aed",资料:"#0d9488",项目:"#3B6CB7",知识点:"#E0A33D",GitHub:"#6E9BD8"};
function renderFavorites(){
  const box = document.getElementById("favorites-area");
  if(!box) return;
  const f = getFavs();
  const keys = Object.keys(f);
  if(!keys.length){ box.innerHTML = `<div class="fav-empty">还没有收藏哦～ 在任意卡片右上角点 ☆ 即可收藏，之后会在这里汇总复看。</div>`; return; }
  box.innerHTML = `<div class="fav-grid">${keys.map(k=>{
    const it = f[k]; const col = FAV_TYPE_COLOR[it.type] || "#3B6CB7";
    return `<div class="fav-card">
      <button class="fav-star on" data-fav-key="${escapeHtml(k)}" data-fav-type="${escapeHtml(it.type)}" data-fav-title="${escapeHtml(it.title)}" data-fav-url="${escapeHtml(it.url)}" data-fav-meta="${escapeHtml(it.meta||'')}" onclick="event.stopPropagation();toggleFav(this)" aria-pressed="true" title="取消收藏">★</button>
      <span class="fav-type" style="background:${col}">${escapeHtml(it.type)}</span>
      <a class="fav-link" href="${escapeHtml(it.url)}" target="_blank" rel="noopener"><h3>${escapeHtml(it.title)}</h3></a>
      <div class="fav-meta">${escapeHtml(it.meta||"")}</div>
    </div>`;
  }).join("")}</div>`;
}

// ============ 项目实战（GitHub 练手复现） ============
const PROJECTS_GH = [
  { title:"数据分析入门项目集", tag:"零基础", color:"#6BA368", stack:["pandas","EDA","可视化"],
    desc:"跟着微软官方入门课做 6 个迷你分析：泰坦尼克、销售漏斗、用户留存……每个都产出一张图表与一个结论。",
    url:"https://github.com/microsoft/Data-Science-For-Beginners", why:"统计学生的第一份作品集，练 EDA 与表达。" },
  { title:"机器学习入门 20 课", tag:"刚入门", color:"#3B6CB7", stack:["scikit-learn","回归","分类"],
    desc:"微软 ML-For-Beginners：从线性回归到聚类，每课带 Notebook 与练习，照着跑就能懂。",
    url:"https://github.com/microsoft/ML-For-Beginners", why:"建立建模直觉，面试常问基础。" },
  { title:"生成式 AI 入门", tag:"刚入门", color:"#E0A33D", stack:["Prompt","RAG","LLM"],
    desc:"微软 generative-ai-for-beginners：18 课讲清 Prompt / 向量检索 / 插件，附可运行代码。",
    url:"https://github.com/microsoft/generative-ai-for-beginners", why:"贴合你投递的 CDP/MA/AI 方向。" },
  { title:"pandas 实战练习", tag:"零基础", color:"#6BA368", stack:["pandas","清洗","分组"],
    desc:"Keith Galli 的 pandas 项目仓库：真实数据集 + 完整 Notebook，最适合边抄边悟。",
    url:"https://github.com/KeithGalli/pandas-data-analysis", why:"刷熟练度，简历写「熟练 pandas」有底气。" },
  { title:"OpenAI API 练手", tag:"刚入门", color:"#3B6CB7", stack:["Python","API","JSON"],
    desc:"openai-cookbook：调用大模型做分类 / 摘要 / 抽取，含速率限制与重试范例。",
    url:"https://github.com/openai/openai-cookbook", why:"直接对应你实习里的 SFT/评测经验。" },
  { title:"动手学机器学习（书配套）", tag:"已熟悉", color:"#C25B4E", stack:["numpy","sklearn","Notebook"],
    desc:"《Hands-On ML》第三版代码：从管线到神经网络，适合系统过一遍。",
    url:"https://github.com/ageron/handson-ml3", why:"从「会调包」到「懂原理」的跃迁。" },
  { title:"数据可视化专项", tag:"刚入门", color:"#7BA05B", stack:["matplotlib","seaborn"],
    desc:"matplotlib 官方教程仓库：各类图表画法 + 配色与注解技巧，做出能进报告的好图。",
    url:"https://github.com/matplotlib/matplotlib", why:"可视化是数据分析岗的硬通货。" },
  { title:"RAG 应用搭建", tag:"已熟悉", color:"#3B6CB7", stack:["LangChain","向量库","检索"],
    desc:"LangChain 官方仓库：把文档变成可对话知识库，照示例做端到端 RAG。",
    url:"https://github.com/langchain-ai/langchain", why:"直接对应你简历里的 RAG/检索增强。" },
  { title:"LlamaIndex 索引工程", tag:"已熟悉", color:"#E0A33D", stack:["LlamaIndex","Embedding","Agent"],
    desc:"LlamaIndex：构建多源索引与 Agent，适合做「个人知识库」类作品。",
    url:"https://github.com/run-llama/llama_index", why:"Agent/索引方向的进阶练手。" },
  { title:"PyTorch 教程", tag:"大神级", color:"#C25B4E", stack:["PyTorch","深度学习","训练"],
    desc:"PyTorch 官方 tutorials：从张量到训练自定义模型，冲大神级的深水区。",
    url:"https://github.com/pytorch/tutorials", why:"想做算法 / 建模岗时的底气来源。" }
];
function renderProjectsView(){
  const box = document.getElementById("gh-projects");
  if(!box) return;
  box.innerHTML = PROJECTS_GH.map(p=>{
    return `<div class="proj">
      ${favStarHtml("项目", "ghp::"+p.title, p.title, p.url, p.tag)}
      <span class="tag" style="background:${p.color}">${p.tag}</span>
      <h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(p.desc)}<br><span style="color:var(--muted)">💡 ${escapeHtml(p.why)}</span></p>
      <div class="stack">${p.stack.map(s=>`<span>${escapeHtml(s)}</span>`).join("")}</div>
      <a class="ref" href="${escapeHtml(p.url)}" target="_blank" rel="noopener">🔗 在 GitHub 打开仓库 ↗</a>
    </div>`;
  }).join("");
}

// ============ 主题色板（点击切换点缀色） ============
function setAccent(color){
  document.documentElement.style.setProperty("--brand", color);
  document.documentElement.style.setProperty("--brand-2", adjust(color,-34));
  try{ localStorage.setItem("site-accent", color); }catch(e){}
  document.querySelectorAll(".pal-dot").forEach(d=>d.classList.toggle("active", d.dataset.c && d.dataset.c.toLowerCase()===String(color).toLowerCase()));
}
function initAccent(){
  let c=null; try{ c=localStorage.getItem("site-accent"); }catch(e){}
  if(c) setAccent(c);
  else { const def=document.querySelector('.pal-dot[data-c="#3B6CB7"]'); if(def) def.classList.add("active"); }
}
const _pb = document.getElementById("palette-bar");
if(_pb) _pb.addEventListener("click", e=>{ const d=e.target.closest(".pal-dot"); if(!d) return; setAccent(d.dataset.c); });
// 色板隐藏 / 显现（记忆状态）
{ const _pt = document.getElementById("pal-toggle");
  if(_pt && _pb){
    let hid = null; try{ hid = localStorage.getItem("site-pal-hidden"); }catch(e){}
    const apply = ()=>_pb.classList.toggle("pal-hidden", hid==="1");
    apply();
    _pt.addEventListener("click", ()=>{
      hid = (hid==="1" ? "0" : "1");
      try{ localStorage.setItem("site-pal-hidden", hid); }catch(e){}
      apply();
    });
  }
}
initAccent();
// ============ 全站搜索（Ctrl+K）：聚合知识点/笔记/资料/晨报存档/项目 ============
let _searchIndex = null;
function buildSearchIndex(){
  if(_searchIndex) return _searchIndex;
  const idx = [];
  (typeof DATA !== "undefined" ? DATA : []).forEach(d=>{
    idx.push({type:"知识点", color:"#E0A33D", title:d.title, sub:TOPICS[d.topic]?TOPICS[d.topic].name:d.topic, desc:d.desc||"", url:null, act:()=>{ showView("knowledge"); state.topic=d.topic; render(); }});
  });
  (typeof NOTES !== "undefined" ? NOTES : []).forEach(n=>{
    idx.push({type:"笔记", color:"#7c3aed", title:n.title, sub:n.catName||n.cat, desc:n.excerpt||"", url:null, act:()=>{ showView("notes"); setTimeout(()=>openNote(n.id),60); }});
  });
  (typeof DOCS !== "undefined" ? DOCS : []).forEach(d=>{
    const isBrief = d.cat === "AI 晨报知识库";
    idx.push({type:isBrief?"晨报存档":"资料", color:isBrief?"#3B6CB7":"#0d9488", title:d.name, sub:d.cat, desc:d.desc||"", url:d.url, act:null});
  });
  (typeof PDFS !== "undefined" ? PDFS : []).forEach(p=>{
    idx.push({type:"PDF 资料", color:"#8C8475", title:p.name, sub:p.catName||p.cat, desc:"", url:null, act:null, local:true});
  });
  (typeof PROJECTS_GH !== "undefined" ? PROJECTS_GH : []).forEach(p=>{
    idx.push({type:"项目", color:"#6E9BD8", title:p.title, sub:p.tag||"项目实战", desc:p.why||p.desc||"", url:p.url, act:null});
  });
  _searchIndex = idx;
  return idx;
}
let _searchHits = [], _searchActive = 0;
function searchHaystack(it){ return (it.title + " " + it.sub + " " + it.desc).toLowerCase(); }
function renderSearch(q){
  const box = document.getElementById("search-results");
  if(!box) return;
  q = (q||"").trim().toLowerCase();
  if(!q){ box.innerHTML = '<div class="search-empty">输入关键词，聚合搜索知识点 / 笔记 / 资料 / 晨报存档 / 项目<br><span style="font-size:12px">支持空格分词多条件，如「python 可视化」</span></div>'; _searchHits=[]; return; }
  const tokens = q.split(/\s+/).filter(Boolean);
  const hits = buildSearchIndex().filter(it => { const h = searchHaystack(it); return tokens.every(t => h.includes(t)); });
  const groups = [];
  hits.forEach(it=>{ let g = groups.find(x=>x.type===it.type); if(!g){ g={type:it.type,color:it.color,items:[]}; groups.push(g); } if(g.items.length<5) g.items.push(it); });
  _searchHits = groups.flatMap(g=>g.items);
  _searchActive = 0;
  const hl = t => { let out = escapeHtml(t); tokens.forEach(tk=>{ if(!tk) return; out = out.replace(new RegExp("("+tk.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","gi"),"<b>$1</b>"); }); return out; };
  if(!_searchHits.length){ box.innerHTML = '<div class="search-empty">没有找到与「' + escapeHtml(q) + '」相关的内容</div>'; return; }
  let html = "", i = 0;
  groups.forEach(g=>{
    html += '<div class="search-group"><span class="search-group-tag"><span style="width:7px;height:7px;border-radius:50%;background:' + g.color + ';display:inline-block"></span>' + g.type + '</span>';
    g.items.forEach(it=>{
      const cur = i === _searchActive;
      const click = it.url ? "window.open('" + it.url + "','_blank')" : (it.act ? "(" + it.act.toString() + ")()" : "");
      html += '<div class="search-item ' + (cur?"active":"") + '" data-si="' + i + '" onclick="closeSearch();' + (it.local ? "" : click) + (it.local ? "searchLocalTip(this)" : "") + '">' +
        '<span class="si-dot" style="background:' + it.color + '"></span>' +
        '<span class="si-title">' + hl(it.title) + '</span>' +
        '<span class="si-sub">' + (it.local ? "本地" : escapeHtml(it.sub||"")) + '</span></div>';
      i++;
    });
    html += '</div>';
  });
  box.innerHTML = html;
}
function searchLocalTip(el){
  const t = el ? el.querySelector(".si-title").textContent : "";
  alert("「" + t + "」为本地 PDF 资源，链接指向本机路径，线上访问请前往资料库对应条目查看来源。");
}
function searchMove(dir){
  if(!_searchHits.length) return;
  _searchActive = (_searchActive + dir + _searchHits.length) % _searchHits.length;
  document.querySelectorAll("#search-results .search-item").forEach(el=>{
    const on = Number(el.dataset.si) === _searchActive;
    el.classList.toggle("active", on);
    if(on) el.scrollIntoView({block:"nearest"});
  });
}
function searchGo(){
  const it = _searchHits[_searchActive];
  if(!it) return;
  closeSearch();
  if(it.url) window.open(it.url, "_blank");
  else if(it.act) it.act();
}
function openSearch(){
  const m = document.getElementById("search-modal");
  if(!m) return;
  m.classList.add("open");
  renderSearch("");
  const inp = document.getElementById("search-input");
  if(inp){ inp.value = ""; setTimeout(()=>inp.focus(), 40); }
}
function closeSearch(){
  const m = document.getElementById("search-modal");
  if(m) m.classList.remove("open");
}
(function initSearch(){
  document.addEventListener("keydown", e=>{
    const m = document.getElementById("search-modal");
    const open = m && m.classList.contains("open");
    if((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")){ e.preventDefault(); if(open) closeSearch(); else openSearch(); return; }
    if(open){
      if(e.key === "Escape"){ e.preventDefault(); closeSearch(); }
      else if(e.key === "ArrowDown"){ e.preventDefault(); searchMove(1); }
      else if(e.key === "ArrowUp"){ e.preventDefault(); searchMove(-1); }
      else if(e.key === "Enter"){ e.preventDefault(); searchGo(); }
    }
  });
})();

// ============ PWA：Service Worker 注册（仅 https/localhost 生效） ============
if("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("sw.js").catch(()=>{ /* 注册失败不影响使用 */ });
  });
}
