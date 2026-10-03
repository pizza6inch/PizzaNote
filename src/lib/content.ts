import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { locales, type Locale } from "@/i18n/config";
import { siteConfig } from "@/lib/site";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface Topic {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
}

export interface Category {
  slug: string;
  aliases: string[];
  title: string;
  description: string;
  topic: string;
  updatedAt: string;
}

export interface Tag {
  slug: string;
  title: string;
}

export interface Post {
  locale: Locale;
  slug: string;
  topic: string;
  category: string;
  series?: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  aliases: string[];
  /** Markdown body with the leading H1 removed (the title is rendered from frontmatter). */
  body: string;
  readingMinutes: number;
}

interface Taxonomy {
  topics: Topic[];
  categories: Category[];
  tags: Tag[];
}

interface LocaleContent extends Taxonomy {
  posts: Post[];
}

const cache = new Map<Locale, LocaleContent>();

const stripLeadingH1 = (body: string) => body.replace(/^\s*#\s+[^\n]*\n+/, "");

/** CJK characters count as one word each; Latin text is counted per whitespace-separated token. */
const estimateReadingMinutes = (body: string) => {
  const noCode = body.replace(/```[\s\S]*?```/g, " ");
  const cjk = (noCode.match(/[㐀-鿿]/g) || []).length;
  const latin = noCode
    .replace(/[㐀-鿿]/g, " ")
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w)).length;
  return Math.max(1, Math.round(cjk / 400 + latin / 220));
};

const asArray = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);

function load(locale: Locale): LocaleContent {
  const hit = cache.get(locale);
  if (hit) return hit;

  const dir = path.join(CONTENT_DIR, locale);
  const taxonomy: Taxonomy = JSON.parse(fs.readFileSync(path.join(dir, "taxonomy.json"), "utf8"));

  const posts: Post[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if ((siteConfig.reservedTopicSlugs as readonly string[]).includes(entry.name)) {
      throw new Error(`Topic folder "${entry.name}" collides with a reserved route.`);
    }
    for (const file of fs.readdirSync(path.join(dir, entry.name))) {
      if (!file.endsWith(".md")) continue;
      const raw = fs.readFileSync(path.join(dir, entry.name, file), "utf8");
      const { data, content } = matter(raw);
      for (const key of ["title", "description", "publishedAt", "updatedAt", "category"]) {
        if (!data[key]) throw new Error(`${locale}/${entry.name}/${file}: missing frontmatter "${key}"`);
      }
      const body = stripLeadingH1(content.trim());
      posts.push({
        locale,
        slug: file.replace(/\.md$/, ""),
        topic: entry.name,
        category: String(data.category),
        series: data.series ? String(data.series) : undefined,
        title: String(data.title),
        description: String(data.description),
        publishedAt: new Date(data.publishedAt).toISOString(),
        updatedAt: new Date(data.updatedAt).toISOString(),
        tags: asArray(data.tags),
        aliases: asArray(data.aliases),
        body,
        readingMinutes: estimateReadingMinutes(body),
      });
    }
  }
  posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  const result = { ...taxonomy, posts };
  cache.set(locale, result);
  return result;
}

// ---- posts ------------------------------------------------------------------

export const getPosts = (locale: Locale) => load(locale).posts;

export const getPost = (locale: Locale, topic: string, slug: string) =>
  load(locale).posts.find((p) => p.topic === topic && p.slug === slug);

/** Every (locale, topic, slug) that has a page, for generateStaticParams. */
export const getAllPostParams = () =>
  locales.flatMap((locale) => getPosts(locale).map((p) => ({ locale, topic: p.topic, post: p.slug })));

export const hasPostTranslation = (locale: Locale, topic: string, slug: string) => !!getPost(locale, topic, slug);

// ---- taxonomy ---------------------------------------------------------------

export const getTopic = (locale: Locale, slug: string) => load(locale).topics.find((t) => t.slug === slug);

/** Only topics that have at least one post get a page and a menu entry. */
export const getTopicsWithPosts = (locale: Locale) => {
  const { topics, posts } = load(locale);
  return topics.filter((t) => posts.some((p) => p.topic === t.slug));
};

export const getCategory = (locale: Locale, slug: string) => load(locale).categories.find((c) => c.slug === slug);

export const getCategoriesWithPosts = (locale: Locale) => {
  const { categories, posts } = load(locale);
  return categories.filter((c) => posts.some((p) => p.category === c.slug));
};

export const getCategoriesForTopic = (locale: Locale, topic: string) =>
  getCategoriesWithPosts(locale).filter((c) => c.topic === topic);

export const getPostsByTopic = (locale: Locale, topic: string) => getPosts(locale).filter((p) => p.topic === topic);

export const getPostsByCategory = (locale: Locale, category: string) =>
  getPosts(locale).filter((p) => p.category === category);

export const getTag = (locale: Locale, slug: string) => load(locale).tags.find((t) => t.slug === slug);

export const getPostsByTag = (locale: Locale, tag: string) => getPosts(locale).filter((p) => p.tags.includes(tag));

/** A tag page is only generated (and listed in the sitemap) when it has 2+ posts, to avoid thin pages. */
export const MIN_POSTS_FOR_TAG_PAGE = 2;
export const getIndexableTags = (locale: Locale) =>
  load(locale).tags.filter((t) => getPostsByTag(locale, t.slug).length >= MIN_POSTS_FOR_TAG_PAGE);

export const topicOfCategory = (locale: Locale, category: string) => getCategory(locale, category)?.topic;

// ---- series navigation (table of contents) -----------------------------------

export interface SeriesGroup {
  title: string | null;
  posts: Post[];
}

/** Posts of one category grouped by `series`, oldest first so a series reads in order. */
export function getSeriesGroups(locale: Locale, category: string): SeriesGroup[] {
  const posts = [...getPostsByCategory(locale, category)].sort((a, b) => (a.publishedAt > b.publishedAt ? 1 : -1));
  const groups: SeriesGroup[] = [];
  for (const post of posts) {
    const title = post.series ?? null;
    const existing = groups.find((g) => g.title === title);
    if (existing) existing.posts.push(post);
    else groups.push({ title, posts: [post] });
  }
  return groups;
}

// ---- cross-language availability --------------------------------------------

export const getOtherLocales = (locale: Locale) => locales.filter((l) => l !== locale);

export function getLegacyRedirectSources(locale: Locale) {
  const { posts, categories } = load(locale);
  return {
    posts: posts.map((p) => ({ topic: p.topic, slug: p.slug, aliases: p.aliases })),
    categories: categories.map((c) => ({ topic: c.topic, slug: c.slug, aliases: c.aliases })),
  };
}
