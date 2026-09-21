# 沐阳站点 · GitHub Pages 上传全流程指南

> 目标：把站点推送到 `https://tzmlyy-lgtm.github.io`（用户站点），部署由仓库里已备好的
> `.github/workflows/deploy.yml` 自动完成，后续每次 `git push` 自动重新部署。

---

## 前置说明

- 本地仓库已就绪：分支 `main`、初始提交完成、remote `origin` 已指向
  `https://github.com/tzmlyy-lgtm/tzmlyy-lgtm.github.io.git`（尚未推送）。
- 仓库内已有两个工作流：
  - `deploy.yml`：push 到 main 时自动部署 GitHub Pages
  - `refresh-news.yml`：每 6 小时自动拉取 AI 资讯写入 `news-data.json`（离线兜底数据）

---

## 第 1 步：在 GitHub 网页上创建仓库

1. 登录 GitHub（账号：tzmlyy-lgtm）。
2. 右上角 **+** → **New repository**。
3. Repository name 填：`tzmlyy-lgtm.github.io`（必须与此完全一致，才是用户站点域名）。
4. 可见性选 **Public**（免费账户使用 Pages 必须公开）。
5. **不要**勾选 "Add a README"、"Add .gitignore"、"Choose a license"（本地已有内容，避免冲突）。
6. 点击 **Create repository**。创建后页面先不用管那些推送提示。

## 第 2 步：生成 Personal Access Token（PAT）

> 用途：本地 push 时的身份凭证。不要用账号密码。

1. GitHub → 右上角头像 → **Settings**。
2. 左栏最底部 **Developer settings**。
3. **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**。
4. Note 随意（如 `muyang-push`），Expiration 建议选 **90 days** 或 **No expiration**。
5. 勾选权限：**repo**（整个 repo 大类勾上即可）。
6. 点击 **Generate token**，**立即复制保存**（只显示这一次），形如 `ghp_xxxxxxxxxxxx`。

## 第 3 步：推送（三选一）

### 方式 A：把 Token 交给 WorkBuddy 执行（最省事）

直接在对话里发 Token（或存到本地文件告诉我路径），我会执行：
```bash
git push -u origin main
# 提示输入 Username 时填: tzmlyy-lgtm
# 提示输入 Password 时填: ghp_你的token
```

### 方式 B：自己在命令行推（Git Bash / 终端）

```bash
cd "D:/workbuddy/2026-08-29-17-25-58"
git push -u origin main
# Username: tzmlyy-lgtm
# Password: ghp_你的token（不是 GitHub 登录密码！）
```

### 方式 C：用 Git 凭证管理器（推荐长期使用）

1. 安装 Git 时默认自带 **Git Credential Manager**。
2. 执行 `git push -u origin main`，弹出的登录窗口选 **Browser** → 授权。
3. 之后 push 不再需要输密码。

## 第 4 步：启用 GitHub Pages（仅首次）

1. 仓库页面 → **Settings** → 左栏 **Pages**。
2. **Build and deployment → Source** 选择：**GitHub Actions**（不是 Deploy from a branch）。
3. 保存。push 成功后 `deploy.yml` 会自动跑；到 **Actions** 标签页可看到运行进度。
4. 约 1–2 分钟后访问：**https://tzmlyy-lgtm.github.io** ✅

> 如果 Actions 没有自动运行：仓库 **Actions** 标签页 → 选中 "Deploy to GitHub Pages" → **Run workflow** 手动触发一次。

## 第 5 步：验证清单

- [ ] https://tzmlyy-lgtm.github.io 打开正常，九个视图可切换
- [ ] F12 控制台无红色报错
- [ ] AI 晨报 / AI 趋势显示「● 实时」
- [ ] Ctrl+K 搜索可用
- [ ] 手机浏览器打开 → 「添加到主屏幕」→ 图标 standalone 打开

## 第 6 步：日常更新流程（以后每次改版）

```bash
cd "D:/workbuddy/2026-08-29-17-25-58"
git add -A
git commit -m "描述本次改动"
git push          # 自动触发 deploy.yml 重新部署
```

同时记得让我重新构建 `deploy-dist/` 并同步 CloudStudio（双端一致），或以后只保留 GitHub 一端。

## 常见问题

| 问题 | 处理 |
|---|---|
| push 提示 403 | Token 过期或没勾 repo 权限，重新生成 |
| Pages 打开 404 | 检查 Pages Source 是否为 GitHub Actions；看 Actions 是否跑成功 |
| 样式/脚本 404 | 确认推送的是仓库根目录（index.html 在根），不是嵌套文件夹 |
| Actions 定时任务没跑 | GitHub 对免费账户的 cron 可能有延迟，属正常；也可手动 Run workflow |

---

安全提醒：**Token 等同账号密码，不要提交进仓库、不要发给别人**。若泄露，去
Settings → Developer settings 里 **Revoke** 后重新生成即可。
