---
title: "Next.js SEO Notes: Metadata, Sitemaps and Structured Data in the App Router"
seoTitle: "Next.js SEO: Metadata, Sitemap and JSON-LD"
description: "Next.js App Router SEO in practice: the Metadata API, SSG and ISR, sitemap.xml, robots.txt, canonical and hreflang, JSON-LD, and whether you still need next-seo."
publishedAt: "2025-06-11T08:52:58.201Z"
updatedAt: "2026-10-04T00:00:00.000Z"
category: "seo"
series: "Next.js"
---

# SEO in Next.js

The Next.js App Router has almost everything SEO needs built in: the Metadata API sets the `<title>`, description and share cards, `generateStaticParams` renders pages at build time, and `sitemap.ts` and `robots.ts` produce the files search engines read. These notes follow the order I used while building this blog (this site is built exactly this way), and the code targets Next.js 15 / 16.

## favicon

- Put `favicon.ico` (or `icon.png`) in the `app` directory and Next.js adds the matching `<link rel="icon">`
- You can use [Real Favicon Generator](https://realfavicongenerator.net/) to produce the `.ico` file

## opengraph-image

The preview image you see when a link is shared on LINE, Facebook or X is the Open Graph image.

- Simplest: put `opengraph-image.png` (1200×630 is a good size) in the `app` directory. You can make it with [GIMP](https://gimp.org)
- A different image per post: add `opengraph-image.tsx` to the route folder and draw the image in JSX with `ImageResponse` from `next/og`; it is generated at build time

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

> For Chinese, Japanese or Korean titles, pass a CJK font (TTF/OTF) through the `fonts` option, or the text renders as boxes.

## Metadata

- Export a `metadata` object from `layout.tsx` or `page.tsx` and Next.js writes the matching `<head>` tags
- Always set `metadataBase`: relative URLs (canonical, Open Graph images) resolve against it, and without it share-card image URLs come out wrong
- Check the `<head>` in your browser's developer tools
- Test share previews with a Social Share Preview tool (the site must be publicly reachable)
- You can also expose your local machine to the internet over SSH:
  [https://docs.srv.us/](https://docs.srv.us/)

```tsx
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://myawesomeblog.com"),
  title: { default: "My Awesome Blog", template: "%s | My Awesome Blog" },
  description: "One sentence that says what this site is about",
};
```

With `title.template`, a child page only writes `title: "Post title"` and gets "Post title | My Awesome Blog".

## Self-hosted Fonts

- Loading fonts from the Google Fonts CDN with a `<link>` sends visitor data (IP, User-Agent, language and so on) to Google
- That may not comply with privacy laws such as the EU's GDPR
- Self-hosting your fonts is recommended. Benefits:
  - Better privacy compliance
  - Faster loading (one less third-party connection)

`next/font/google` downloads the font files **at build time** and serves them with your site, so despite the name, visitors' browsers never contact Google.

**Self-hosted fonts in Next.js:**

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

> CJK fonts are huge (the full Noto Sans TC made this site's home page several seconds slower). This site sets body text in the system font and ships the heading font as a subset holding only the characters headings use.

## Dynamic Metadata

- `generateMetadata` builds metadata from your data
- It can only be exported from a Server Component, so it cannot live in a file marked `"use client"`
- Since Next.js 15, `params` is a Promise: `await` it first

e.g.:

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

If the page needs interaction or state on the client, move that part into a separate component marked `"use client"` and use it from the page.

### Fetch Request Deduplication

Usually the page component needs the same API data as the metadata. If both fetch the same endpoint, aren't we waiting twice?

e.g.:

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

- Identical `GET` fetches within one render are merged automatically (request memoization), so the API is only called once
- This only works for `fetch`, not for axios, Prisma and the like
- Without fetch, wrap the call in React's `cache()` for the same effect

Example:

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

- If every request waits for a fetch, both visitors and search engines wait for the API, and the page is slow
- SSG renders the pages at build time and then serves static HTML
- `generateStaticParams()` tells Next.js which pages to render ahead of time

e.g.:

```tsx
export async function generateStaticParams() {
  const response = await fetch("https://dummyjson.com/posts");
  const { posts }: BlogPostsResponse = await response.json();

  // Each object is one set of route params; the key matches the folder name [postId]
  return posts.map(({ id }) => ({ postId: String(id) }));
}
```

This function only runs at build time, so:

- Don't worry much about optimising it; however long it takes only affects build time, not visitors
- The data should be content that rarely changes, such as blog posts, product pages or landing pages; otherwise every update needs a rebuild

Instead of rebuilding, you can set a revalidate time so Next.js regenerates the page in the background. This is ISR (Incremental Static Regeneration).

```tsx
// app/posts/[postId]/page.tsx
export const revalidate = 60; // regenerate at most every 60 seconds
```

If a visitor requests an ID that isn't in the list, say the list is `[{ postId: "1" }]` and someone opens `/posts/2`, by default the page is rendered on that first request and then cached.

That's useful when you have thousands of pages and don't want to fetch all of them at build time: pre-render the popular ones and render the rest when someone visits.

If you want every route outside the list to return 404 instead, the setting is `dynamicParams`:

```tsx
export const dynamicParams = false; // routes not returned by generateStaticParams return 404
```

> A common mix-up: `export const dynamic = "force-static"` forces the page to render statically (`cookies()` and `headers()` return empty values). It does not make unlisted routes return 404.

## Canonical and hreflang

If the same content opens at several URLs (with or without a trailing slash, with tracking parameters, `www` and bare domain), the canonical tells search engines which one is the real address. For a multilingual site, `alternates.languages` produces hreflang, so Google treats the Chinese and English pages as language versions of one article instead of duplicate content.

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  return {
    alternates: {
      canonical: `/en/posts/${postId}/`,
      languages: {
        "zh-TW": `/zh-tw/posts/${postId}/`,
        en: `/en/posts/${postId}/`,
        "x-default": `/zh-tw/posts/${postId}/`,
      },
    },
  };
}
```

## JSON-LD structured data

Structured data describes the page in schema.org terms ("this is an article, this is the author, this is when it was published"), and both Google and AI search read it. The App Router has no dedicated API for it; render a `<script type="application/ld+json">` in the page:

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
        // Escape < so a string in the data can't close the script tag early
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* ... */}
    </article>
  );
}
```

Write the author out in full on every page (at least a `name`). A bare `@id` pointing at the home page leaves a search engine that reads only this page with a nameless author. Check the result with the [Rich Results Test](https://search.google.com/test/rich-results).

## Do you still need next-seo?

Search for "next seo" and the [next-seo](https://github.com/garmeeh/next-seo) package comes first. It was the go-to tool in the Pages Router era: its `<NextSeo>` component writes the title, description and Open Graph tags into `<Head>`.

| Need | Built into the App Router | next-seo |
| --- | --- | --- |
| Title, description, Open Graph, Twitter | `metadata` / `generateMetadata` | `<NextSeo>` |
| Canonical, hreflang | `alternates` | `canonical`, `languageAlternates` |
| Robots meta | `robots` | `noindex`, `nofollow` |
| sitemap.xml, robots.txt | `sitemap.ts`, `robots.ts` | Not included (often paired with next-sitemap) |
| JSON-LD | Render a `<script>` yourself (a few lines) | Ready-made JSON-LD components |

My take: **for a new App Router project you don't need next-seo.** The Metadata API covers most of what it does, and it runs on the server without adding client JavaScript. On the Pages Router, or if you want ready-made JSON-LD components, next-seo is still handy.

## Sitemap

A sitemap lets search engines find every page on your site, in case some pages can't be reached through links from other pages and would otherwise be missed.

It usually lives at `baseurl/sitemap.xml`
and looks like this:

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

Sitemap pages change often and there are many of them, so generate the file in code. In Next.js, add `sitemap.ts` under `app`:

```tsx
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = await fetch("https://dummyjson.com/posts");
  const { posts }: BlogPostsResponse = await response.json();

  const postEntries: MetadataRoute.Sitemap = posts.map(({ id, updatedAt }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${id}/`,
    lastModified: new Date(updatedAt), // when the content really changed
  }));

  return [{ url: `${process.env.NEXT_PUBLIC_BASE_URL}/about/` }, ...postEntries];
}
```

- Google ignores `priority` and `changefreq`, so skip them
- `lastModified` should be when the content **really** changed. If everything is `new Date()` (the build time), Google notices it's unreliable and stops using it. You can't fool search engines XD
- List only canonical URLs: no redirecting URLs and no noindex pages

## Robots.txt

Tells crawlers which paths they may fetch and where the sitemap is.

e.g.:

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

> robots.txt asks crawlers not to fetch a path; it is not access control. Keep a page out of search results with `robots: { index: false }` (noindex), and protect private pages with authentication.

## Google Search Console

[Google Search Console](https://search.google.com/search-console/about)
lets you add your deployed site, see whether Google has indexed it, submit your sitemap, and see your traffic and the keywords people used to find you.

You need your own domain first. I wrote up buying one and connecting it to Vercel here: [Set Up a Custom Domain for Your Vercel Site with Namecheap](/en/front-end/namecheap/).
