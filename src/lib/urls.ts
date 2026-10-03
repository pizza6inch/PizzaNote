import type { Locale } from "@/i18n/config";

/** All internal paths carry a trailing slash (next.config trailingSlash: true). */
export const paths = {
  home: (l: Locale) => `/${l}/`,
  about: (l: Locale) => `/${l}/about/`,
  posts: (l: Locale) => `/${l}/posts/`,
  topic: (l: Locale, topic: string) => `/${l}/${topic}/`,
  post: (l: Locale, topic: string, slug: string) => `/${l}/${topic}/${slug}/`,
  postMarkdown: (l: Locale, topic: string, slug: string) => `/${l}/${topic}/${slug}.md`,
  category: (l: Locale, category: string) => `/${l}/category/${category}/`,
  tag: (l: Locale, tag: string) => `/${l}/tags/${tag}/`,
  feed: (l: Locale) => `/${l}/feed.xml`,
  searchIndex: (l: Locale) => `/${l}/search-index.json`,
};
