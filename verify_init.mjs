// 回归测试：用 DOM stub 按浏览器加载顺序执行全部脚本，并模拟切换所有视图
// 用法: node verify_init.mjs  （在项目根目录）
import fs from "fs";
import vm from "vm";

function makeEl(tag = "div") {
  const store = { tagName: tag, style: {}, dataset: {}, value: "", checked: false, children: [], textContent: "", innerHTML: "" };
  const el = {
    get style() { return store.style; },
    get dataset() { return store.dataset; },
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    addEventListener() {}, removeEventListener() {},
    appendChild(c) { store.children.push(c); return c; },
    setAttribute() {}, getAttribute: () => null, removeAttribute() {},
    querySelector: () => makeEl(), querySelectorAll: () => [],
    closest: () => null, scrollIntoView() {}, focus() {}, blur() {}, click() {},
    observe() {}, unobserve() {}, disconnect() {},
    contains: () => false,
    getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
  };
  for (const k of ["textContent", "innerHTML", "value", "checked", "children"]) {
    Object.defineProperty(el, k, { get: () => store[k], set: v => { store[k] = v; } });
  }
  return el;
}

const els = {};
const sandbox = {
  console, setTimeout, setInterval, clearTimeout, clearInterval,
  Date, Math, JSON, Promise, Number, String, Object, Array, RegExp, Error, TypeError,
  isNaN, parseInt, parseFloat, encodeURIComponent, decodeURIComponent,
  AbortController, URL, URLSearchParams, Set, Map, Symbol, Proxy,
  localStorage: { _s: {}, getItem(k) { return this._s[k] ?? null; }, setItem(k, v) { this._s[k] = String(v); }, removeItem(k) { delete this._s[k]; } },
  location: { hash: "", replaceState() {}, origin: "https://x", href: "https://x/" },
  navigator: { userAgent: "node-stub" },
  matchMedia: () => ({ matches: false, addListener() {}, addEventListener() {} }),
  fetch: async () => { throw new Error("offline-stub"); },
  alert() {}, confirm: () => true, open() {},
  requestAnimationFrame: f => setTimeout(f, 0),
  IntersectionObserver: class { observe() {} unobserve() {} disconnect() {} },
  history: { replaceState() {}, pushState() {} },
  crypto: globalThis.crypto,
  addEventListener() {}, removeEventListener() {},
  scrollTo() {}, scrollBy() {},
  getComputedStyle: () => ({ getPropertyValue: () => "" }),
  dispatchEvent() {},
};
sandbox.window = sandbox; sandbox.globalThis = sandbox; sandbox.self = sandbox;
sandbox.document = {
  getElementById(id) { if (!els[id]) els[id] = makeEl(); return els[id]; },
  querySelector: () => makeEl(), querySelectorAll: () => [],
  addEventListener() {}, removeEventListener() {},
  createElement: () => makeEl(), createTextNode: () => makeEl(),
  documentElement: makeEl("html"), body: makeEl("body"), head: makeEl("head"),
  title: "", cookie: "",
};
sandbox.window.document = sandbox.document;
const ctx = vm.createContext(sandbox);

const files = ["vendor/marked.min.js", "ai-trends-data.js", "briefing-data.js", "docs-data.js", "brief-library-data.js", "pdfs-data.js", "knowledge.js", "quizzes.js", "notes-data.js", "script.js"];
let ok = true;
for (const f of files) {
  try {
    vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f });
    console.log("OK  ", f);
  } catch (e) {
    ok = false;
    console.log("FAIL", f, "->", e.constructor.name + ":", e.message);
    if (e.stack) console.log(e.stack.split("\n").slice(1, 4).join("\n"));
  }
}

// 模拟用户操作：切换所有视图 + 渲染各板块
const ops = [
  'typeof renderBriefing==="function" && renderBriefing();',
  'typeof renderLibrary==="function" && renderLibrary();',
  'typeof renderFavorites==="function" && renderFavorites();',
  'typeof renderNotes==="function" && renderNotes();',
  'typeof renderProjectsView==="function" && renderProjectsView();',
  '["knowledge","notes","briefing","trends","library","projects","code","quiz","favorites"].forEach(v=>showView(v));',
];
for (const op of ops) {
  try {
    vm.runInContext(op, ctx);
  } catch (e) {
    ok = false;
    console.log("FAIL op:", op.slice(0, 50), "->", e.constructor.name + ":", e.message);
    if (e.stack) console.log(e.stack.split("\n").slice(1, 4).join("\n"));
  }
}
console.log(ok ? "ALL_PASS" : "HAS_FAILURE");
process.exit(ok ? 0 : 1);
