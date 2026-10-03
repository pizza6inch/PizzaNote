# 披薩筆記 PizzaNote

Ewan（Pizza）的個人技術部落格，部署於 <https://pizzanote.dev>。繁體中文與英文雙語，內容以 Markdown 存在這個 repo，build 時全部預先渲染成靜態頁面。

- **框架**：Next.js 16（App Router）、React 19、Tailwind CSS 4、TypeScript
- **內容**：`content/<locale>/` 底下的 Markdown，沒有 CMS、沒有執行期資料庫查詢
- **部署**：Vercel（push 到 GitHub 就會 build；branch 會產生 preview）
- **語言**：`zh-tw`（預設）、`en`，網址帶語言前綴

## 開發

```bash
npm install
npm run dev          # http://localhost:3000，根目錄會導向 /zh-tw/
npm run build        # 先跑 check:content，再 next build
npm run lint
npm run typecheck
npm test
```

只需要一個環境變數，其餘功能沒設定時會自動關閉（見下方）：

```bash
cp .env.example .env.local
```

## 內容結構

```
content/
├─ zh-tw/
│  ├─ taxonomy.json          主題（topics）、分類（categories）、標籤（tags）
│  └─ <topic>/<slug>.md      文章
├─ en/                       同上，英文版
└─ views-seed.json           舊的瀏覽數，作為 Redis 計數器的初始值
```

### 新增或修改文章

1. 在 `content/zh-tw/<topic>/<slug>.md` 新增檔案；**英文版放在 `content/en/<topic>/<slug>.md`，兩個語言的 `slug` 要相同**（`hreflang` 靠它對應）。
2. frontmatter：

   ```yaml
   ---
   title: "文章標題"                 # 搜尋結果顯示，建議 ≤ 60 字元
   description: "一兩句摘要"          # 建議 50–160 字元
   publishedAt: "2025-06-24T06:57:07.835Z"
   updatedAt: "2025-06-24T06:57:07.835Z"   # 內容有實質修改時更新；會成為 sitemap 的 lastmod
   category: "javascript"            # 必須存在於 taxonomy.json
   series: "this 物件"                # 選填，同一分類內的系列分組
   tags: ["react"]                   # 選填，必須存在於 taxonomy.json
   aliases: ["OldSlug"]              # 選填，舊網址；會自動 301 到新網址
   ---
   ```

3. 內文**不要**再寫 `# 標題`（標題由 frontmatter 渲染成唯一的 `<h1>`），章節從 `##` 開始。
4. 圖片放 `public/images/posts/<slug>/`，在文章中用 `/images/posts/<slug>/01.png` 引用。
5. `npm run check:content` 會檢查格式、分類/標籤是否存在、圖片是否存在，並**警告中英文章更新日期差太多**（翻譯可能過期）。

網址規則：

| 頁面 | 網址 |
|---|---|
| 文章 | `/<locale>/<topic>/<slug>/` |
| 主題 | `/<locale>/<topic>/` |
| 分類 | `/<locale>/category/<category>/` |
| 標籤 | `/<locale>/tags/<tag>/`（標籤至少 2 篇文章才會產生頁面） |
| 純 Markdown 版本 | `/<locale>/<topic>/<slug>.md` |

沒有任何文章的主題不會產生頁面，也不會出現在選單。

## 自動產生的檔案

`sitemap.xml`（含 `lastmod` 與 `hreflang`）、`robots.txt`（明確允許 AI 爬蟲）、`/<locale>/feed.xml`（RSS）、`llms.txt`、`/<locale>/search-index.json`（站內搜尋）、每篇文章的 JSON-LD（`BlogPosting`、`BreadcrumbList`）。

舊網址（遷移前的 `/<topic>/<post>` 與 Sanity 時期的大小寫 slug）由 `config/legacy-redirects.mjs` 從內容產生 301。

## 選用功能（沒設定就不會顯示）

| 功能 | 環境變數 | 說明 |
|---|---|---|
| 留言（giscus） | `NEXT_PUBLIC_GISCUS_REPO_ID`、`NEXT_PUBLIC_GISCUS_CATEGORY_ID`（另有 `NEXT_PUBLIC_GISCUS_REPO`、`NEXT_PUBLIC_GISCUS_CATEGORY`） | 需在 GitHub repo 開啟 Discussions 並安裝 [giscus app](https://giscus.app) |
| 瀏覽次數 | `KV_REST_API_URL`、`KV_REST_API_TOKEN`（也接受 `UPSTASH_REDIS_REST_URL/TOKEN`） | 透過 Vercel Marketplace 加入 Upstash Redis（`vercel integration add upstash/upstash-kv`），變數會自動注入；頁面本身仍是靜態的，數字由瀏覽器載入後取得 |
| 正式網域 | `NEXT_PUBLIC_SITE_URL` | canonical、sitemap、Open Graph 都以它為準（預設 `https://pizzanote.dev`，不含 `www`） |

## 專案結構

```
src/
├─ app/
│  ├─ [locale]/…           頁面（首頁、about、posts、[topic]、[topic]/[post]、category、tags、feed、search-index）
│  ├─ api/views/           瀏覽數 API（唯一的動態端點）
│  ├─ md/…                 純 Markdown 版本（透過 next.config 的 rewrite 對外為 <slug>.md）
│  ├─ sitemap.ts、robots.ts、llms.txt/
│  └─ not-found.tsx
├─ components/             UI 元件（ui/ 為 shadcn）
├─ i18n/                   語言設定與字典
└─ lib/                    content.ts（讀 Markdown）、seo.ts（metadata 與 JSON-LD）、urls.ts、site.ts
config/legacy-redirects.mjs
scripts/check-content.mjs
```
