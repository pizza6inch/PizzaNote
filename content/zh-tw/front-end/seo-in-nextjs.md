---
title: "Next.js SEO 實作筆記：最佳化網站在搜尋引擎的曝光度"
description: "在開發現代網站時，良好的 SEO（搜尋引擎最佳化）不再是選項，而是必要。這篇筆記整理了我在使用 Next.js 開發網站過程中，實作 SEO 的關鍵技巧與最佳做法，從 favicon、metadata 設定、自訂字體、自動產生 sitemap、robots.txt，到利用 SSG 與 ISR 提升效能與搜尋引擎收錄。希望能幫助同樣在學習或實戰中的開發者，打造更容易被搜尋引擎發現與收錄的網站。"
publishedAt: "2025-06-11T08:52:58.201Z"
updatedAt: "2025-06-11T08:52:58.201Z"
category: "seo"
series: "nextJS"
---

# SEO in nextJS

## favicon
- 在 `app` 目錄底下修改 `favicon.ico`
- 可使用 [Real Favicon Generator](https://realfavicongenerator.net/) 來產生 `.ico` 檔案

## opengraph-image
- 在 `app` 目錄底下加入分享網站到社群媒體時所顯示的圖片
- 可使用 [GIMP](https://gimp.org) 製作圖片

## Metadata

- Next.js 提供詳細的 Metadata 設定
- 可透過開發者工具檢查 `<head>` 是否有正確的 meta 標籤
- 可使用 Social Share Preview 工具測試（需部署到公網）
- 也可透過 SSH 將本機開放至網路上：  
  [https://docs.srv.us/](https://docs.srv.us/)

---



## Self-hosted Fonts

- 使用 Google Fonts 的 CDN 方式載入會向 Google 傳送使用者資訊（IP、User-Agent、語言等）
- 在歐盟 GDPR 等隱私法下可能不合規
- 建議將字型自架（Self-hosted），好處包括：
  - 提升隱私合規性
  - 提升載入速度

**Next.js Self-hosted 字型用法：**

```tsx
// layout.js
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

## Dynamic Metadata

- 使用 generateMetadata 可根據不同資料動態產生 metadata
- 此函式為 Server Function，不能與 "use client" 同頁共存

ex:

```jsx!

export async function generateMetadata({
  params: { postId },
}: BlogPostPageProps): Promise<Metadata> {
  const response = await fetch(`https://dummyjson.com/posts/${postId}`);
  const post: BlogPost = await response.json();

  return {
    title: post.title,
    description: post.body,
    // openGraph: {
    //   images: [
    //     {
    //       url: post.imageUrl
    //     }
    //   ]
    // }
  };
}
```


generateMetadata函式是一個server function，所以你不能在這個頁面宣告"use-client"，也就是說如果你需要在這個頁面中執行交互操作、state控制等等client-side的行為，你需要把它包成另一個component引用他


### Fetch Request Deduplication

通常情況下除了metadata使用到API資料以外，page component中也會需要用到API資料，那如果server fetch的是同一支API回傳的內容也一樣，那不就會浪費時間等待API回傳嗎?

ex:

```jsx!
export async function generateMetadata({
  params: { postId },
}: BlogPostPageProps): Promise<Metadata> {
  const response = await fetch(`https://dummyjson.com/posts/${postId}`);
  const post: BlogPost = await response.json();
  
  return ...
}

export default async function BlogPostPage({
  params: { postId },
}: BlogPostPageProps) {
  const response = await fetch(`https://dummyjson.com/posts/${postId}`);
  const { title, body }: BlogPost = await response.json();

```
- 其實Next.js 會自動 deduplicate 相同的 fetch 請求
- 只適用於 fetch，不適用於 axios、prisma 等
- 若使用非fetch可手動使用 cache() 優化重複資料請求

範例:
```javascript!
import { cache } from "react"

// Manually deduplicate requests if not using fetch
const getPost = cache(async (postId: string) => {
  const post = await prisma.post.findUnique(postId);
  return post;
})

export async function generateMetadata({
  params: { postId },
}: BlogPostPageProps): Promise<Metadata> {
  const response = await getPost()
  
  return ...
}

export default async function BlogPostPage({
  params: { postId },
}: BlogPostPageProps) {
  const response = await getPost();
  const { title, body }: BlogPost = await response.json();

```

### SSG (Static Site Generation)


- 由於根據先前寫法每次 request 時等待 fetch 會影響 SEO
- 可透過實作SSG預先建置資料並快取至 server，提升效能與 SEO 分數
- 使用 generateStaticParams() 在 build 階段定義靜態頁面


ex:
```jsx!

export async function generateStaticParams() {
  const response = await fetch("https://dummyjson.com/posts");
  const { posts }: BlogPostsResponse = await response.json();

  return posts.map(({ id }) => id);
}

```


這個函式只會在build時執行一次，所以:

- 不需要太擔心函式內的優化，不論這個函式需要跑多久都不會影響到用戶體驗，頂多只是影響到build的時間
- 在裡面fetch的資料必須符合不太會頻繁更新的特性，例如:blog post 產品介紹、Landing Page 等，不然可能每次資料更新都需要手動build一次來更新cache。

除了build更新cache以外也可以透過設置revalidate time來告訴next server，定期去更新page data。而這也被稱做ISR(Incremental Static Regeneration)。

```jsx!
// app/posts/[id]/page.tsx
export const revalidate = 60;
```

此外針對沒有在return list裡面的ID route，假設return [{id:1}]，而請求 /posts/2時，會按照SSR方法將API結果組好page傳給user後，再將page cache起來。

這麼做的優點在於有時候根據需求特性，你會有成千上百個頁面，而你又不想在build的時後一次性fetch所有的page data，導致可能的流量尖峰或是怕耗用流量資源，就可以根據這個特性讓使用者瀏覽過的頁面cache起來。

而有一個設定可以規定只要導向沒有在return list裡面的route時回傳404頁面給user。

```javascript!
export const dynamic = 'force-static' //強制快取

```

## Sitemap

Sitemap是用來讓搜尋引擎能夠完整瀏覽網站中的每個頁面，以防有些頁面並沒有辦法透過其他頁面抵達，導致搜尋引擎遺失該頁面。

通常情況下應該不會犯這個錯誤，但是有這個sitemap對SEO肯定有幫助! 所以還是乖乖設定吧~畢竟才幾行程式碼而已

通常在 baseurl/sitemap.xml裡面
看起來會像這樣:
```html!
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://myawesomeblog.com/about</loc>
        <lastmod>2025-06-11T07:07:09.092Z</lastmod>
        </url>
    <url>
        <loc>https://myawesomeblog.com/posts/1</loc>
        <lastmod>2025-06-11T07:07:09.092Z</lastmod>
        <changefreq>daily</changefreq>
    </url>
    ...
</url>
```
由於sitemap內的頁面通常是需要常常更新，且會有大量頁面，所以會需要動態的產生這個sitemap，而nextJS有提供產生sitemap的方法

```typescript!
// sitemap.ts
import { BlogPostsResponse } from "@/models/BlogPost";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = await fetch("https://dummyjson.com/posts");
  const { posts }: BlogPostsResponse = await response.json();

  const postEntries: MetadataRoute.Sitemap = posts.map(({ id }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${id}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    // priority:
  }));

  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
      lastModified: new Date(),
    },
    ...postEntries,
  ];
}

```

priority這個設定是number權重，但比較少人設置
lastModified 如果都設置為最新時間 new Date()的話，搜尋引擎會偵測出來並當作你沒有設置這個設定，欺騙不了搜尋引擎XD

## Robot.txt

告訴搜尋引擎一些設定，你想針對的裝置類別、允許被爬蟲的頁面等等

ex:
```typescript!
// robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/privacy"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}

```

## Google Search Console


[Google Search Console](https://search.google.com/search-console/about)
可以將部署好的網站放上去，可以看看你的網站是否有被google index，也可以幫你分析流量，以及是下了那些關鍵字搜索到你的網站等等。

前提是你要先購買域名QQ

購買域名的教學之後再寫
