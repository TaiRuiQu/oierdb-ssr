# OIerDB SSR

> 信息学竞赛（OI/NOI 系列）选手与学校数据站点。支持按省份/年级筛选选手与比赛记录、学校画像与获奖趋势、比赛详情记录分页等功能。

相比于原先的 OIerDB，本项目采用服务端渲染，避免了打开即加载所有选手的数据，加快了首屏访问速度，同时也降低了浏览器性能要求。

## 项目简介

OIerDB SSR 是基于 Next.js App Router 的数据展示站点，后端数据存储于 Supabase（Postgres）。站点强调服务端渲染、稳定的分页与筛选能力，并通过缓存与 UI 骨架优化页面体验。核心能力包括：
- 选手搜索与排名：支持按省份、年级过滤，结果稳定分页。
- 比赛详情页：展示比赛基础信息、按省份/年级分页的获奖记录表。
- 学校详情页：展示学校评分、城市省份信息、历年各竞赛类型（NOI/CTSC/CSP/IOI 等）获奖趋势图表，以及该校有获奖记录的选手列表并支持年级筛选。
- 公共 API：`GET /api/oier/[uid]` 返回选手详情（用于前端或第三方调用）。

## 技术栈与技术架构

- **框架**：Next.js 15（App Router，React 19，Server Components，`Suspense`，`use cache` 实验特性）
- **语言与构建**：TypeScript 5；Turbopack（开发）/Next 构建（生产）
- **UI**：Tailwind CSS v4 + Shadcn/UI
- **图表**：Recharts（学校获奖趋势）
- **数据层**：
  - Supabase（Postgres）+ `@supabase/supabase-js`
  - 只在服务器端创建客户端实例：`lib/db.ts`
  - 查询服务模块：
    - 比赛：`lib/fetch-contest.ts`（比赛基础信息、记录分页）
    - 学校：`lib/fetch-school.ts`（基础信息、学校选手分页、获奖趋势聚合）
    - 列表：`lib/list-contests-server.ts`、`lib/list-schools-server.ts`
    - 搜索：`lib/search-server.ts`（带学校解析、姓名/简写模糊、年级推导、分页）
  - 类型定义：`types/supabase.ts`（表、枚举、类型工具）
- **缓存**：Next.js `unstable_cache`
- **监测**：`@vercel/speed-insights`
- **其他**：Zod（潜在数据校验）、`tailwind-merge`、`clsx`、`class-variance-authority`

### 目录结构要点

- `app/(home)` 首页，搜索与 FAQ
- `app/oiers` 选手列表页（省份/年级筛选、分页）
- `app/(contest)/contest/[id]` 比赛详情页（记录筛选、分页）
- `app/(school)/school/[id]` 学校详情页（基础信息、趋势图、选手列表）
- `app/api/oier/[uid]` 选手详情 API
- `components/search/*` 搜索表单、筛选控件与结果展示
- `components/ui/*` 基础 UI 组件
- `lib/*` 数据访问与业务逻辑

## 部署指南

以下以 Vercel 部署为例（推荐）。你也可以使用任意支持 Node.js 的环境自行部署。

### 环境变量
必须在部署环境配置以下变量：
- `SUPABASE_URL`：你的 Supabase 项目 URL
- `SUPABASE_SERVICE_ROLE_KEY`：Service Role Key（仅服务端使用，切勿暴露到浏览器）

注意：本项目的 Supabase 客户端仅在服务器端初始化（`lib/db.ts`）。请确保这些变量只在服务器端可见。

### Vercel 一键部署
1. 将仓库推送到 GitHub/GitLab。
2. 在 Vercel 新建项目，导入仓库。
3. 在 Project Settings → Environment Variables 配置 `SUPABASE_URL` 与 `SUPABASE_SERVICE_ROLE_KEY`。
4. 触发部署。部署完成后即可访问站点。

### 自行部署（Node 运行时）
- 需要 Node.js 18+（建议 18/20）
- 先构建后启动：
```bash
pnpm install
pnpm build
pnpm start
```
- 通过反向代理或容器将 3000 端口暴露为对外服务。

## 本地开发指南

### 先决条件
- Node.js 18+（建议 18/20）
- pnpm（也可使用 npm/yarn/bun）
- 一个可用的 Supabase 项目，并在 `.env.local` 配置：
```bash
SUPABASE_URL=你的Supabase项目URL
SUPABASE_SERVICE_ROLE_KEY=你的ServiceRoleKey
```

### 启动开发服务器
```bash
pnpm install
pnpm dev
```
默认运行在 `http://localhost:3000`。

### 常用脚本
```bash
pnpm dev        # 开发（Turbopack）
pnpm build      # 生产构建
pnpm start      # 启动生产服务
```

### 代码结构与关键点
- 仅服务端数据访问：所有数据库读写通过 `lib/*` 模块，依赖 `lib/db.ts` 创建的 `@supabase/supabase-js` 客户端。
- 缓存策略：`unstable_cache` 包裹的函数统一设置 `revalidate: 300`，与路由级 `export const revalidate = 300` 配合，保证 SSR 与再验证一致性。
- 年级推导：`lib/grade.ts` 提供当前时间与比赛时间下的年级文本与筛选区间计算。
- 类型安全：`types/supabase.ts` 提供表结构、枚举、泛型工具；搜索参数与结果类型见 `lib/search-types.ts`。
- UI 交互：列表与详情大量使用 `Suspense` 与骨架组件，保证加载体验。

### 代码风格
- TypeScript 严格类型，避免使用 `any`
- 组件与函数命名语义化，遵循可读性优先
- 使用 Tailwind CSS 组合类，避免内联样式

### 故障排查
- 环境变量为空：确认 `.env.local` 或部署环境已正确配置。
- 数据为空或 404：检查 Supabase 表结构、权限策略以及是否存在对应数据。
- 样式异常：确认 Tailwind v4 配置（`postcss.config.mjs`）与 `app/globals.css` 已加载。

---

如需进一步帮助或反馈问题，请访问站点页脚中的 “Source Code” 链接提交 Issue。
