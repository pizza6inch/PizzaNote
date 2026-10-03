// Builds the 301 map from the pre-migration URL scheme to the new one.
//
// Old scheme (Chinese only, no locale):  /<topic>/<post>  and  /<topic>/<category>  (a category and a post
// shared one URL level, and slugs were case-sensitive, e.g. /front-end/Webpack).
// New scheme: /zh-tw/<topic>/<post>/  and  /zh-tw/category/<category>/.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const LEGACY_LOCALE = "zh-tw";

export function legacyRedirects() {
  const taxonomy = JSON.parse(fs.readFileSync(path.join(ROOT, "content", LEGACY_LOCALE, "taxonomy.json"), "utf8"));
  const redirects = [];
  const seen = new Set();

  const add = (source, destination) => {
    // Matching is case-insensitive in Next, so de-duplicate on the lowercase form.
    const key = source.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    redirects.push({ source, destination, permanent: true });
  };

  // Site-level pages.
  add("/about", `/${LEGACY_LOCALE}/about/`);
  add("/posts", `/${LEGACY_LOCALE}/posts/`);
  add("/studio/:path*", `/${LEGACY_LOCALE}/`); // the Sanity Studio no longer exists
  add("/test-topic", `/${LEGACY_LOCALE}/`); // stray URL that was indexed

  // Topics that have posts keep a page; empty topics (e.g. "life") fall back to the home page.
  const postsDir = path.join(ROOT, "content", LEGACY_LOCALE);
  const topicsWithPosts = new Set(
    fs.readdirSync(postsDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name),
  );
  for (const topic of taxonomy.topics) {
    add(`/${topic.slug}`, topicsWithPosts.has(topic.slug) ? `/${LEGACY_LOCALE}/${topic.slug}/` : `/${LEGACY_LOCALE}/`);
  }

  // Posts: every old spelling (alias) and the new slug point at the new URL.
  for (const topic of topicsWithPosts) {
    for (const file of fs.readdirSync(path.join(postsDir, topic))) {
      if (!file.endsWith(".md")) continue;
      const slug = file.replace(/\.md$/, "");
      const { data } = matter(fs.readFileSync(path.join(postsDir, topic, file), "utf8"));
      const destination = `/${LEGACY_LOCALE}/${topic}/${slug}/`;
      for (const old of [slug, ...(data.aliases ?? [])]) add(`/${topic}/${old}`, destination);
    }
  }

  // Categories used to live at /<topic>/<category>.
  for (const category of taxonomy.categories) {
    const destination = `/${LEGACY_LOCALE}/category/${category.slug}/`;
    for (const old of [category.slug, ...(category.aliases ?? [])]) add(`/${category.topic}/${old}`, destination);
  }

  return redirects;
}
