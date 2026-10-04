// Validates the Markdown content before every build (npm run check:content, also runs as `prebuild`).
//
// Errors (fail the build): missing frontmatter, unknown category/tag, bad slug, alias collisions, missing images.
// Warnings (printed only): a post that exists in one language but not the other, zh/en drifting apart,
// and titles/descriptions that will be truncated in search results.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const LOCALES = ["zh-tw", "en"];
const RESERVED = ["about", "posts", "category", "tags", "feed.xml", "search-index.json", "llms.txt", "md", "api"];
const REQUIRED = ["title", "description", "publishedAt", "updatedAt", "category"];
const DRIFT_DAYS = 3;
const SUFFIX = { "zh-tw": " | 披薩筆記", en: " | PizzaNote" };
const width = (text) => [...String(text)].reduce((n, ch) => n + (/[⺀-鿿＀-￯]/.test(ch) ? 2 : 1), 0);

const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

const posts = {}; // locale -> Map("topic/slug" -> data)
const taxonomies = {};

for (const locale of LOCALES) {
  const dir = path.join(CONTENT, locale);
  taxonomies[locale] = JSON.parse(fs.readFileSync(path.join(dir, "taxonomy.json"), "utf8"));
  const { topics, categories, tags } = taxonomies[locale];
  const topicSlugs = new Set(topics.map((t) => t.slug));
  const categorySlugs = new Set(categories.map((c) => c.slug));
  const tagSlugs = new Set(tags.map((t) => t.slug));
  posts[locale] = new Map();
  const aliasOwner = new Map();

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (RESERVED.includes(entry.name)) err(`${locale}/${entry.name}: topic folder collides with a reserved route`);
    if (!topicSlugs.has(entry.name)) err(`${locale}/${entry.name}: topic is not in taxonomy.json`);

    for (const file of fs.readdirSync(path.join(dir, entry.name))) {
      if (!file.endsWith(".md")) continue;
      const rel = `${locale}/${entry.name}/${file}`;
      const slug = file.replace(/\.md$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(dir, entry.name, file), "utf8"));

      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) err(`${rel}: slug must be lowercase kebab-case`);
      for (const key of REQUIRED) if (!data[key]) err(`${rel}: missing frontmatter "${key}"`);
      if (data.category && !categorySlugs.has(String(data.category))) err(`${rel}: unknown category "${data.category}"`);
      for (const tag of data.tags ?? []) if (!tagSlugs.has(tag)) err(`${rel}: unknown tag "${tag}"`);
      for (const key of ["publishedAt", "updatedAt"]) {
        if (data[key] && Number.isNaN(new Date(data[key]).getTime())) err(`${rel}: ${key} is not a valid date`);
      }
      if (new Date(data.updatedAt) < new Date(data.publishedAt)) err(`${rel}: updatedAt is before publishedAt`);

      for (const alias of data.aliases ?? []) {
        const key = `${entry.name}/${alias.toLowerCase()}`;
        if (aliasOwner.has(key)) err(`${rel}: alias "${alias}" is already used by ${aliasOwner.get(key)}`);
        aliasOwner.set(key, rel);
      }

      // Local images must exist in /public.
      for (const m of content.matchAll(/!\[[^\]]*\]\((\/[^)\s]+)\)/g)) {
        if (!fs.existsSync(path.join(ROOT, "public", m[1]))) err(`${rel}: image not found: ${m[1]}`);
      }

      // Search results cut by pixel width: a CJK character is about two Latin ones. The page title also carries the
      // site-name suffix, so the check measures what is actually shown.
      const shownTitle = `${data.seoTitle ?? data.title ?? ""}${SUFFIX[locale]}`;
      if (width(shownTitle) > 62) warn(`${rel}: title "${shownTitle}" is ${width(shownTitle)} units wide (>62); add a shorter seoTitle`);
      const desc = String(data.description ?? "");
      if (width(desc) > 165) warn(`${rel}: description is ${width(desc)} units wide (>165)`);
      if (width(desc) < 100) warn(`${rel}: description is short (${width(desc)} units, <100)`);

      posts[locale].set(`${entry.name}/${slug}`, data);
    }
  }
}

// An alias must not shadow another post's real slug in the same topic.
for (const locale of LOCALES) {
  for (const [key, data] of posts[locale]) {
    const topic = key.split("/")[0];
    for (const alias of data.aliases ?? []) {
      const other = `${topic}/${alias.toLowerCase()}`;
      if (other !== key && posts[locale].has(other)) err(`${locale}/${key}: alias "${alias}" shadows the post ${other}`);
    }
  }
}

// Translation parity and drift.
const [a, b] = LOCALES;
for (const [key, data] of posts[a]) {
  const other = posts[b].get(key);
  if (!other) {
    warn(`${a}/${key} has no ${b} translation`);
    continue;
  }
  for (const field of ["category", "publishedAt"]) {
    if (String(data[field]) !== String(other[field])) err(`${key}: "${field}" differs between ${a} and ${b}`);
  }
  const days = Math.abs(new Date(data.updatedAt) - new Date(other.updatedAt)) / 86_400_000;
  if (days > DRIFT_DAYS) {
    const newer = new Date(data.updatedAt) > new Date(other.updatedAt) ? a : b;
    warn(`${key}: ${newer} was updated ${days.toFixed(0)} days after the other language; translation may be stale`);
  }
}
for (const key of posts[b].keys()) if (!posts[a].has(key)) warn(`${b}/${key} has no ${a} version`);

for (const w of warnings) console.warn(`  warning  ${w}`);
for (const e of errors) console.error(`  ERROR    ${e}`);
console.log(
  `content check: ${posts[a].size} zh-tw + ${posts[b].size} en posts, ${errors.length} error(s), ${warnings.length} warning(s)`,
);
process.exit(errors.length ? 1 : 0);
