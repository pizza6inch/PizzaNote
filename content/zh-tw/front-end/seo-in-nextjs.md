---
title: "Next.js SEO 實作筆記：App Router 的 Metadata、Sitemap 與結構化資料"
seoTitle: "Next.js SEO 實作筆記：Metadata、Sitemap 與 JSON-LD"
description: "用 Next.js App Router 做 SEO 的實作筆記：Metadata API、SSG 與 ISR、sitemap、robots.txt、canonical 與 hreflang、JSON-LD，以及還需不需要 next-seo。"
publishedAt: "2025-06-11T08:52:58.201Z"
updatedAt: "2026-10-04T00:00:00.000Z"
category: "seo"
series: "Next.js"
---

# SEO in Next.js

Next.js 的 App Router 把 SEO 需要的東西幾乎都內建了：用 Metadata API 設定 `<title>`、description 與分享卡片，用 `generateStaticParams` 在 build 時產生靜態頁面，再用 `sitemap.ts`、`robots.ts` 產生給搜尋引擎的檔案。這篇筆記依照我實際做部落格的順序整理（本站就是用這些做法建的），程式碼以 Next.js 15 / 16 為準。

## favicon

- 在 `app` 目錄底下放 `favicon.ico`（或 `icon.png`），Next.js 會自動產生對應的 `<link rel="icon">`
- 可使用 [Real Favicon Generator](https://realfavicongenerator.net/) 來產生 `.ico` 檔案

## opengraph-image

分享到 LINE、Facebook、X 時看到的預覽圖就是 Open Graph 圖片。

- 最簡單：在 `app` 目錄底下放 `opengraph-image.png`（建議 1200×630），可用 [GIMP](https://gimp.org) 製作
- 每篇文章都要不同的圖：在路由資料夾放 `opengraph-image.tsx`，用 `next/og` 的 `ImageResponse` 以 JSX 畫出圖片，build 時就會產生

```tsx
// app/posts/[postId]/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const post = await getPost(postId);

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", padding: 64, fontSize: 64, background: "#ffc72c" }}>
      {post.title}
    </div>,
    size,
  );
}
```

> 中文標題要另外用 `fonts` 選項傳入中文字型（TTF/OTF），不然會變成方塊。

## Metadata

- 在 `layout.tsx` 或 `page.tsx` 匯出 `metadata` 物件，Next.js 會產生對應的 `<head>` 標籤
- `metadataBase` 一定要設：它是相對網址（canonical、Open Graph 圖片）的基準，沒設的話分享卡片的圖片網址會錯
- 可透過開發者工具檢查 `<head>` 是否有正確的 meta 標籤
- 可使用 Social Share Preview 工具測試（需部署到公網）
- 也可透過 SSH 將本機開放至網路上：
  [https://docs.srv.us/](https://docs.srv.us/)

```tsx
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://myawesomeblog.com"),
  title: { default: "My Awesome Blog", template: "%s | My Awesome Blog" },
  description: "一句話說清楚這個網站在寫什麼",
};
```

`title.template` 會讓子頁面只要寫 `title: "文章標題"`，就自動變成「文章標題 | My Awesome Blog」。

## Self-hosted Fonts

- 用 `<link>` 直接從 Google Fonts CDN 載入，瀏覽器會把使用者資訊（IP、User-Agent、語言等）送到 Google
- 在歐盟 GDPR 等隱私法下可能不合規
- 建議將字型自架（Self-hosted），好處包括：
  - 提升隱私合規性
  - 提升載入速度（少一個第三方網域的連線）

`next/font/google` 會在 **build 時**下載字型檔，和網站放在一起，所以雖然名字有 google，使用者的瀏覽器並不會連到 Google。

**Next.js Self-hosted 字型用法：**

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="p-5">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

> 中文字型檔很大（完整的 Noto Sans TC 會讓首頁慢好幾秒）。本站的做法是內文用系統字型，標題字型只保留標題用到的字（subset）。

## Dynamic Metadata

- 使用 `generateMetadata` 可根據不同資料動態產生 metadata
- 它只能在 Server Component 裡匯出，所以不能和 `"use client"` 放在同一個檔案
- Next.js 15 起 `params` 是 Promise，要先 `await`

ex:

```tsx
// app/posts/[postId]/page.tsx
import type { Metadata } from "next";

type Props = { params: Promise<{ postId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const response = await fetch(`https://dummyjson.com/posts/${postId}`);
  const post: BlogPost = await response.json();

  return {
    title: post.title,
    description: post.body.slice(0, 150),
    alternates: { canonical: `/posts/${postId}` },
  };
}
```

如果這個頁面需要互動、state 控制等 client-side 的行為，就把那一塊拆成另一個加了 `"use client"` 的 component，再在頁面裡引用它。

### Fetch Request Deduplication

通常情況下除了 metadata 使用到 API 資料以外，page component 中也會需要用到同一份資料。那如果兩邊 fetch 的是同一支 API，不就要等兩次嗎？

ex:

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const response = await fetch(`https://dummyjson.com/posts/${postId}`);
  const post: BlogPost = await response.json();

  return { title: post.title };
}

export default async function BlogPostPage({ params }: Props) {
  const { postId } = await params;
  const response = await fetch(`https://dummyjson.com/posts/${postId}`);
  const { title, body }: BlogPost = await response.json();
  // ...
}
```

- 其實同一次 render 裡相同網址的 `GET` fetch 會被自動合併（request memoization），只會真的打一次
- 只適用於 `fetch`，不適用於 axios、prisma 等
- 若使用非 fetch，可以用 React 的 `cache()` 包起來，效果一樣

範例：

```tsx
import { cache } from "react";

// Manually deduplicate requests if not using fetch
const getPost = cache(async (postId: string) => {
  return prisma.post.findUnique({ where: { id: postId } });
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const post = await getPost(postId);
  return { title: post?.title };
}

export default async function BlogPostPage({ params }: Props) {
  const { postId } = await params;
  const post = await getPost(postId);
  // ...
}
```

### SSG (Static Site Generation)

- 如果每次 request 才去 fetch，使用者和搜尋引擎都要等 API 回應，頁面會變慢
- 可透過 SSG 在 build 時就把頁面產生好，之後直接回傳靜態 HTML
- 使用 `generateStaticParams()` 告訴 Next.js 要預先產生哪些頁面

ex:

```tsx
export async function generateStaticParams() {
  const response = await fetch("https://dummyjson.com/posts");
  const { posts }: BlogPostsResponse = await response.json();

  // 每一個物件就是一組路由參數，key 要和資料夾名稱 [postId] 一樣
  return posts.map(({ id }) => ({ postId: String(id) }));
}
```

這個函式只會在 build 時執行，所以：

- 不需要太擔心函式內的優化，跑多久都不會影響到使用者，頂多影響 build 的時間
- 裡面 fetch 的資料最好是不太會頻繁更新的內容，例如部落格文章、產品介紹、Landing Page，不然每次資料更新都要重新 build

除了重新 build，也可以設定 revalidate 時間，讓 Next.js 定期在背景重新產生頁面，這就是 ISR（Incremental Static Regeneration）。

```tsx
// app/posts/[postId]/page.tsx
export const revalidate = 60; // 最多每 60 秒重新產生一次
```

如果使用者請求了沒有在清單裡的 ID，例如清單只有 `[{ postId: "1" }]` 而請求 `/posts/2`：預設會在第一次請求時即時產生頁面，產生完再快取起來。

這麼做的好處是，當你有成千上百個頁面、又不想在 build 時一次抓完所有資料，就可以只預先產生熱門的頁面，其他的等有人瀏覽再產生。

反過來，如果希望清單以外的路由一律回 404，要設定的是 `dynamicParams`：

```tsx
export const dynamicParams = false; // 不在 generateStaticParams 清單裡的路由直接回 404
```

> 常見誤會：`export const dynamic = "force-static"` 是「強制這個頁面用靜態方式產生」（`cookies()`、`headers()` 會拿到空值），並不會讓清單以外的路由回 404。

## Canonical 與多語系（hreflang）

同一篇內容如果可以用不同網址打開（有沒有結尾斜線、帶追蹤參數、`www` 和非 `www`），要用 canonical 告訴搜尋引擎哪一個才是正式網址。網站有多種語言時，再用 `alternates.languages` 產生 hreflang，讓 Google 把中文版和英文版當成「同一篇的不同語言」，而不是重複內容。

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  return {
    alternates: {
      canonical: `/zh-tw/posts/${postId}/`,
      languages: {
        "zh-TW": `/zh-tw/posts/${postId}/`,
        en: `/en/posts/${postId}/`,
        "x-default": `/zh-tw/posts/${postId}/`,
      },
    },
  };
}
```

## JSON-LD 結構化資料

結構化資料是用 schema.org 的格式描述「這頁是一篇文章、作者是誰、什麼時候發布」，Google 和 AI 搜尋都會讀。App Router 沒有專用的 API，直接在頁面輸出一個 `<script type="application/ld+json">` 就好：

```tsx
export default async function BlogPostPage({ params }: Props) {
  const { postId } = await params;
  const post = await getPost(postId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: "Ewan (Pizza)", url: "https://myawesomeblog.com/about/" },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        // 把 < 跳脫掉，避免內容裡的字串提早結束 script 標籤
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* ... */}
    </article>
  );
}
```

注意作者要在每一頁都寫完整（至少要有 `name`）。只放一個 `@id` 指到首頁的話，搜尋引擎單獨讀這一頁時會不知道作者是誰。寫完可以丟到 [Rich Results Test](https://search.google.com/test/rich-results) 檢查。

## next-seo 還需要嗎？

搜尋「next seo」時最常看到的是 [next-seo](https://github.com/garmeeh/next-seo) 這個套件。它是在 Pages Router 時代很好用的工具，用 `<NextSeo>` 元件幫你在 `<Head>` 裡輸出 title、description 與 Open Graph 標籤。

| 需求 | App Router 內建 | next-seo |
| --- | --- | --- |
| title、description、Open Graph、Twitter | `metadata` / `generateMetadata` | `<NextSeo>` |
| canonical、hreflang | `alternates` | `canonical`、`languageAlternates` |
| robots meta | `robots` | `noindex`、`nofollow` |
| sitemap.xml、robots.txt | `sitemap.ts`、`robots.ts` | 不提供（常搭配 next-sitemap） |
| JSON-LD | 自己輸出 `<script>`（幾行） | 有現成的 JSON-LD 元件 |

我的結論：**新專案用 App Router 的話，不需要 next-seo**，Metadata API 已經涵蓋它大部分的功能，而且是在 server 端產生、不會增加前端的 JavaScript。還在用 Pages Router 的專案，或想直接用現成的 JSON-LD 元件，next-seo 仍然好用。

## Sitemap

Sitemap 是用來讓搜尋引擎能夠找到網站中的每個頁面，以防有些頁面沒辦法透過其他頁面的連結抵達，導致搜尋引擎漏掉它。

通常在 `baseurl/sitemap.xml`，
看起來會像這樣：

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://myawesomeblog.com/about/</loc>
    <lastmod>2025-06-11</lastmod>
  </url>
  <url>
    <loc>https://myawesomeblog.com/posts/1/</loc>
    <lastmod>2025-06-09</lastmod>
  </url>
  ...
</urlset>
```

由於 sitemap 內的頁面常常更新、數量又多，最好由程式自動產生。Next.js 只要在 `app` 底下放一個 `sitemap.ts`：

```tsx
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = await fetch("https://dummyjson.com/posts");
  const { posts }: BlogPostsResponse = await response.json();

  const postEntries: MetadataRoute.Sitemap = posts.map(({ id, updatedAt }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${id}/`,
    lastModified: new Date(updatedAt), // 文章真正更新的時間
  }));

  return [{ url: `${process.env.NEXT_PUBLIC_BASE_URL}/about/` }, ...postEntries];
}
```

- Google 會忽略 `priority` 和 `changefreq`，不用設
- `lastModified` 要放內容**真正**更新的時間。如果全部都設成 `new Date()`（每次 build 的時間），Google 會發現它不準，乾脆不採用，騙不了搜尋引擎 XD
- sitemap 裡只放 canonical 網址：不要放會轉址的網址，也不要放 noindex 的頁面

## Robots.txt

告訴爬蟲哪些路徑可以抓、哪些不行，以及 sitemap 在哪裡。

ex:

```tsx
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}
```

> robots.txt 只是請爬蟲不要抓，不是權限控管。不想被收錄的頁面要用 `robots: { index: false }`（noindex），真正私密的頁面要做登入驗證。

## Google Search Console

[Google Search Console](https://search.google.com/search-console/about)
可以把部署好的網站加進去，看看網站有沒有被 Google 收錄（index）、送出 sitemap，也可以看到流量，以及使用者是搜尋哪些關鍵字找到你的網站。

前提是你要先有自己的網域，購買網域並接到 Vercel 的步驟我寫在這篇：[用 Namecheap 快速為 Vercel 架站設定自訂網域](/zh-tw/front-end/namecheap/)。
