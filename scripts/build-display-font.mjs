// Builds a tiny subset of the display face (Huninn) containing only the characters that headings can show:
// UI strings, taxonomy names, post titles and series, and Markdown headings. A full CJK webfont costs hundreds of
// kilobytes of render-blocking CSS plus dozens of glyph files; this subset is a single ~20 KB woff2.
//
// The output is committed. The script only goes to the network when the character set changes, and if the
// network is unavailable it keeps the existing file (any missing glyph falls back to the body font).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "src", "fonts");
const FONT_FILE = path.join(OUT_DIR, "huninn-subset.woff2");
const STAMP_FILE = path.join(OUT_DIR, "huninn-subset.chars");
const FAMILY = "Huninn";

const chars = new Set();
const add = (s) => {
  for (const ch of String(s ?? "")) if (!/\s/.test(ch)) chars.add(ch);
};
for (let c = 33; c < 127; c++) chars.add(String.fromCharCode(c));
chars.add(" ");

add(fs.readFileSync(path.join(ROOT, "src", "i18n", "dictionaries.ts"), "utf8"));

const contentDir = path.join(ROOT, "content");
for (const locale of fs.readdirSync(contentDir, { withFileTypes: true }).filter((e) => e.isDirectory())) {
  const dir = path.join(contentDir, locale.name);
  const taxonomy = JSON.parse(fs.readFileSync(path.join(dir, "taxonomy.json"), "utf8"));
  for (const item of [...taxonomy.topics, ...taxonomy.categories, ...taxonomy.tags]) add(item.title);
  for (const topic of fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory())) {
    for (const file of fs.readdirSync(path.join(dir, topic.name)).filter((f) => f.endsWith(".md"))) {
      const text = fs.readFileSync(path.join(dir, topic.name, file), "utf8");
      add(text.match(/^title:\s*(.*)$/m)?.[1]);
      add(text.match(/^series:\s*(.*)$/m)?.[1]);
      for (const heading of text.matchAll(/^#{1,4}\s+(.*)$/gm)) add(heading[1]);
    }
  }
}

const list = [...chars].sort().join("");
const digest = crypto.createHash("sha256").update(list).digest("hex");

if (fs.existsSync(FONT_FILE) && fs.existsSync(STAMP_FILE) && fs.readFileSync(STAMP_FILE, "utf8").split("\n")[0] === digest) {
  console.log(`display font: up to date (${chars.size} characters)`);
  process.exit(0);
}

try {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(FAMILY)}&text=${encodeURIComponent(list)}`;
  // A modern browser user agent makes the API answer with woff2.
  const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
  const css = await (await fetch(cssUrl, { headers: { "User-Agent": ua } })).text();
  const fontUrl = css.match(/url\((https:[^)]+)\)\s*format\('woff2'\)/)?.[1];
  if (!fontUrl) throw new Error("no woff2 URL in the Google Fonts response");
  const font = Buffer.from(await (await fetch(fontUrl)).arrayBuffer());
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(FONT_FILE, font);
  fs.writeFileSync(STAMP_FILE, `${digest}\n${list}\n`);
  console.log(`display font: rebuilt ${path.relative(ROOT, FONT_FILE)} (${chars.size} characters, ${font.length} bytes)`);
} catch (error) {
  if (fs.existsSync(FONT_FILE)) {
    console.warn(`display font: could not refresh (${error.message}); keeping the existing subset`);
  } else {
    console.error(`display font: could not build the subset and none exists yet: ${error.message}`);
    process.exit(1);
  }
}
