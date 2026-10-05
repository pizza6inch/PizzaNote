import { locales, htmlLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPosts } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { paths } from "@/lib/urls";

export const dynamic = "force-static";

/** llms.txt: a curated, Markdown index of the site for language models. Links point at the .md versions. */
export function GET() {
  const dict = getDictionary("zh-tw");
  const sections = locales
    .map((locale) => {
      const posts = getPosts(locale);
      if (posts.length === 0) return "";
      const lines = posts.map(
        (p) => `- [${p.title}](${absoluteUrl(paths.postMarkdown(locale, p.topic, p.slug))}): ${p.description}`,
      );
      return `## Posts (${htmlLang[locale]})\n\n${lines.join("\n")}`;
    })
    .filter(Boolean)
    .join("\n\n");

  const text = `# ${dict.site.name} (PizzaNote)

> ${dict.site.description} The same notes are published in Traditional Chinese (zh-TW) and English.

Each post is also available as plain Markdown by appending .md to its URL.

## Author

${siteConfig.author.name}: ${getDictionary("en").post.authorBio}

- [About (zh-TW)](${absoluteUrl(paths.about("zh-tw"))})
- [About (en)](${absoluteUrl(paths.about("en"))})
- [LinkedIn](${siteConfig.author.linkedin})
- [GitHub](${siteConfig.author.github})

${sections}

## Site

- [Home (zh-TW)](${absoluteUrl(paths.home("zh-tw"))})
- [Home (en)](${absoluteUrl(paths.home("en"))})
- [RSS (zh-TW)](${absoluteUrl(paths.feed("zh-tw"))})
- [RSS (en)](${absoluteUrl(paths.feed("en"))})
`;

  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
