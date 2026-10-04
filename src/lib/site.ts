import { defaultLocale, type Locale } from "@/i18n/config";

/** Canonical origin, no trailing slash. The apex domain is canonical (www redirects to it). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://pizzanote.dev").replace(/\/+$/, "");

export const siteConfig = {
  launchDate: "2025-04-08T03:25:00.000Z",
  /** Last real edit of the About page (bump it when the About copy changes; used for the sitemap). */
  aboutUpdatedAt: "2026-10-03",
  author: {
    name: "Ewan (Pizza)",
    url: "https://github.com/pizza6inch",
    github: "https://github.com/pizza6inch",
    instagram: "https://www.instagram.com/pg206206/",
    email: "pizza6inch@gmail.com",
    avatar: "/avatar.png",
    alumniOf: "National Taipei University of Technology",
    knowsAbout: ["Front-end development", "JavaScript", "React", "Next.js", "SEO"],
  },
  /** Topics whose slug would collide with a fixed route. */
  reservedTopicSlugs: ["about", "posts", "category", "tags", "feed.xml", "search-index.json", "llms.txt"],
  giscus: {
    repo: process.env.NEXT_PUBLIC_GISCUS_REPO || "pizza6inch/PizzaNote",
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "",
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "Comments",
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "",
  },
} as const;

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Whole days elapsed since the given ISO date. */
export const daysSince = (iso: string) => Math.round(Math.abs(Date.now() - new Date(iso).getTime()) / 86_400_000);

export const isDefaultLocale = (locale: Locale) => locale === defaultLocale;
