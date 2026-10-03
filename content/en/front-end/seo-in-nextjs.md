---
title: "Next.js SEO Notes: Getting Your Site Discovered by Search Engines"
description: "Practical Next.js SEO notes: favicon, metadata, self-hosted fonts, SSG and ISR, sitemap.xml, robots.txt and Google Search Console."
publishedAt: "2025-06-11T08:52:58.201Z"
updatedAt: "2025-06-11T08:52:58.201Z"
category: "seo"
series: "Next.js"
---

# SEO in Next.js

## favicon
- Replace `favicon.ico` in the `app` directory
- You can use [Real Favicon Generator](https://realfavicongenerator.net/) to produce the `.ico` file

## opengraph-image
- Add the image that is shown when your site is shared on social media to the `app` directory
- You can create the image with [GIMP](https://gimp.org)

## Metadata

- Next.js has detailed support for configuring metadata
- Use the browser developer tools to check that the `<head>` contains the right meta tags
- You can test with a social share preview tool (the site must be deployed publicly)
- You can also expose your local machine to the internet over SSH:  
  [https://docs.srv.us/](https://docs.srv.us/)

---



## Self-hosted Fonts

- Loading Google Fonts from its CDN sends user information (IP address, User-Agent, language, and so on) to Google
- Under privacy laws such as the EU's GDPR this may not be compliant
- Self-hosting the fonts is recommended. The benefits:
  - Better privacy compliance
  - Faster loading

**Self-hosting fonts in Next.js:**

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

- `generateMetadata` lets you generate metadata dynamically from your data
- It is a Server Function, so it cannot live on the same page as `"use client"`

e.g.:

```jsx

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


`generateMetadata` is a server function, so you cannot declare `"use client"` on that page. If the page needs interactivity, state management or other client-side behaviour, wrap that part in a separate component and import it.


### Fetch Request Deduplication

Often the page component needs the same API data as the metadata. If the server fetches the same API twice with the same result, isn't that wasted waiting time?

e.g.:

```jsx
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
- Next.js automatically deduplicates identical `fetch` requests
- This only applies to `fetch`, not to axios, Prisma and so on
- If you don't use `fetch`, you can deduplicate manually with `cache()`

Example:
```javascript
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


- With the approach above, waiting for `fetch` on every request hurts SEO
- Use SSG to build the data ahead of time and cache it on the server, improving performance and your SEO score
- Use `generateStaticParams()` to define static pages at build time


e.g.:
```jsx

export async function generateStaticParams() {
  const response = await fetch("https://dummyjson.com/posts");
  const { posts }: BlogPostsResponse = await response.json();

  return posts.map(({ id }) => id);
}

```


This function runs only once, at build time, so:

- You don't need to worry much about optimising what's inside it. However long it takes, users never feel it; it only affects build time.
- The data you fetch in it should not change often, for example blog posts, product pages or landing pages. Otherwise you have to rebuild by hand each time the data changes to refresh the cache.

Besides rebuilding, you can set a revalidate time that tells the Next server to refresh the page data periodically. This is called ISR (Incremental Static Regeneration).

```jsx
// app/posts/[id]/page.tsx
export const revalidate = 60;
```

Also, for a route whose ID is not in the returned list (say you return `[{id:1}]` and a request comes in for `/posts/2`), the page is built on demand like SSR, sent to the user, and then cached.

This is useful when you have hundreds or thousands of pages and don't want to fetch all of them at build time (traffic spikes, resource cost): pages are cached as visitors browse them.

There is also a setting that returns a 404 page whenever someone navigates to a route that is not in the returned list.

```javascript
export const dynamic = 'force-static' // force caching

```

## Sitemap

A sitemap lets search engines see every page of your site, in case some pages can't be reached through other pages and would otherwise be missed.

Normally you shouldn't make that mistake, but having a sitemap certainly helps SEO, so just set one up. It's only a few lines of code.

It usually lives at `baseurl/sitemap.xml` and looks like this:
```html
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
Because the pages in a sitemap change often and there can be a lot of them, you'll want to generate it dynamically, and Next.js provides a way to do that:

```typescript
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

`priority` is a numeric weight, but few people set it.
If you set `lastModified` to the current time with `new Date()` everywhere, search engines notice and treat it as if you hadn't set it at all. You can't fool them. 😄

## robots.txt

Tells search engines a few things: which crawlers you are addressing, which pages may be crawled, and so on.

e.g.:
```typescript
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
lets you register your deployed site to see whether Google has indexed it. It also analyses your traffic and shows which keywords people used to find you.

The catch: you need to buy a domain first. 😢

I'll write a domain-purchase tutorial later.
