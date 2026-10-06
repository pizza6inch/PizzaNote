// github-slugger is ESM-only, which Jest cannot load here. A stand-in slugger keeps these tests about parsing;
// that the ids match rehype-slug's is checked against the built page.
jest.mock("github-slugger", () => {
  return class {
    seen = new Map<string, number>();
    slug(text: string) {
      const base = text.toLowerCase().replace(/\s+/g, "-");
      const n = this.seen.get(base) ?? 0;
      this.seen.set(base, n + 1);
      return n ? `${base}-${n}` : base;
    }
  };
});

import { getHeadings } from "@/lib/headings";

describe("getHeadings", () => {
  it("returns h2 sections and skips deeper headings", () => {
    const md = ["## 前言", "text", "### 細節", "## AI 天馬行空"].join("\n");
    expect(getHeadings(md).map((h) => h.text)).toEqual(["前言", "AI 天馬行空"]);
  });

  it("strips inline markdown and ignores headings inside code fences", () => {
    const md = ["## Use `getHeadings` with [links](https://x.dev)", "```md", "## not a heading", "```", "## **Bold** end"].join("\r\n");
    expect(getHeadings(md).map((h) => h.text)).toEqual(["Use getHeadings with links", "Bold end"]);
  });

  it("feeds deeper headings through the same slugger so duplicate ids stay in step", () => {
    const md = ["## Intro", "### Intro", "## Intro"].join("\n");
    expect(getHeadings(md).map((h) => h.id)).toEqual(["intro", "intro-2"]);
  });
});
