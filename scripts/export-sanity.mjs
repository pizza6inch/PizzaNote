// One-off migration: Sanity dump -> content/zh-tw/**/*.md + taxonomy JSON + local images.
// Usage: node scripts/export-sanity.mjs <path-to-sanity-dump.json>
// Delete this script once the migration has been verified.
import fs from "node:fs";
import path from "node:path";

const dumpPath = process.argv[2];
if (!dumpPath) throw new Error("usage: node scripts/export-sanity.mjs <sanity-dump.json>");

const docs = JSON.parse(fs.readFileSync(dumpPath, "utf8"));
const byId = Object.fromEntries(docs.map((d) => [d._id, d]));
const ofType = (t) => docs.filter((d) => d._type === t);

const LOCALE = "zh-tw";
const root = process.cwd();
const slugOf = (d) => d.slug.current.toLowerCase();
const aliasOf = (d) => (d.slug.current !== slugOf(d) ? [d.slug.current] : []);

const write = (rel, data) => {
  const abs = path.join(root, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, data);
};

const yamlValue = (v) => JSON.stringify(v); // JSON is valid YAML for strings/arrays/numbers

// ---- taxonomy -------------------------------------------------------------
const topics = ofType("topic").map((t) => ({
  slug: slugOf(t),
  title: t.title,
  description: t.description ?? "",
  updatedAt: t.lastEdAt ?? t._updatedAt,
}));

const categories = ofType("category").map((c) => ({
  slug: slugOf(c),
  aliases: aliasOf(c),
  title: c.title,
  description: c.description ?? "",
  topic: slugOf(byId[c.topic._ref]),
  updatedAt: c.lastEdAt ?? c._updatedAt,
}));

const tags = ofType("tag").map((t) => ({ slug: slugOf(t), title: t.title }));

write(`content/${LOCALE}/taxonomy.json`, JSON.stringify({ topics, categories, tags }, null, 2) + "\n");

// ---- images: download external/Sanity images into public/images/posts -------
const imageMap = new Map();
async function localizeImages(slug, body) {
  const re = /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
  const matches = [...body.matchAll(re)];
  let i = 0;
  for (const m of matches) {
    const url = m[2];
    if (imageMap.has(url)) continue;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`image download failed (${res.status}): ${url}`);
    const type = res.headers.get("content-type") ?? "";
    const ext = type.includes("png") ? "png" : type.includes("jpeg") ? "jpg" : type.includes("svg") ? "svg" : type.includes("webp") ? "webp" : "png";
    const rel = `public/images/posts/${slug}/${String(++i).padStart(2, "0")}.${ext}`;
    write(rel, Buffer.from(await res.arrayBuffer()));
    imageMap.set(url, "/" + rel.replace(/^public\//, ""));
  }
  return body.replace(re, (all, alt, url) => `![${alt}](${imageMap.get(url) ?? url})`);
}

// ---- posts ----------------------------------------------------------------
const viewsSeed = {};
for (const p of ofType("post")) {
  const cat = byId[p.category._ref];
  const topic = byId[cat.topic._ref];
  const sub = p.subCategory ? byId[p.subCategory._ref] : null;
  const postTags = [].concat(p.tags ?? []).map((t) => slugOf(byId[t._ref]));
  const slug = slugOf(p);

  const body = await localizeImages(slug, p.content.replace(/\r\n/g, "\n").trimEnd());

  const fm = {
    title: p.title,
    description: p.description ?? "",
    publishedAt: p.publishedAt,
    updatedAt: p.lastEdAt ?? p._updatedAt,
    category: slugOf(cat),
    series: sub?.title ?? undefined,
    tags: postTags,
    aliases: aliasOf(p),
  };
  const front = Object.entries(fm)
    .filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => `${k}: ${yamlValue(v)}`)
    .join("\n");

  write(`content/${LOCALE}/${slugOf(topic)}/${slug}.md`, `---\n${front}\n---\n\n${body}\n`);
  if (typeof p.views === "number") viewsSeed[`${slugOf(topic)}/${slug}`] = p.views;
}

write(`content/views-seed.json`, JSON.stringify(viewsSeed, null, 2) + "\n");

const site = ofType("siteInfo")[0];
console.log(JSON.stringify({
  topics: topics.length,
  categories: categories.length,
  tags: tags.length,
  posts: ofType("post").length,
  imagesDownloaded: imageMap.size,
  launchDate: site?.launchDate,
  viewsSeed,
}, null, 2));
