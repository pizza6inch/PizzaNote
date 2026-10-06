import GithubSlugger from "github-slugger";

export interface Heading {
  id: string;
  text: string;
}

/** Plain text of a Markdown heading: links keep their label, inline code and emphasis lose their markers. */
const plainText = (raw: string) =>
  raw
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__|\*|_|~~)(.+?)\1/g, "$2")
    .replace(/\s+#+\s*$/, "")
    .trim();

/**
 * The h2 sections of a post, with the same ids rehype-slug gives them on the page. Every heading goes through one
 * slugger, in document order, so duplicate titles get the same "-1", "-2" suffixes rehype-slug would add.
 */
export function getHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let fence: string | null = null;

  for (const line of markdown.split(/\r?\n/)) {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (!fence) fence = marker;
      else if (fence === marker) fence = null;
      continue;
    }
    if (fence) continue;

    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (!match) continue;
    const text = plainText(match[2]);
    const id = slugger.slug(text);
    // A Markdown "#" renders as <h2> (the page title is the only <h1>), so it counts as a section too.
    if (match[1].length <= 2) headings.push({ id, text });
  }
  return headings;
}
