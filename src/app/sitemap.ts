import type { MetadataRoute } from "next";
import { defaultLocale, locales, htmlLang, type Locale } from "@/i18n/config";
import {
  getCategoriesWithPosts,
  getIndexableTags,
  getPosts,
  getPostsByCategory,
  getPostsByTag,
  getPostsByTopic,
  getTopicsWithPosts,
  hasPostTranslation,
} from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { paths } from "@/lib/urls";

type Entry = MetadataRoute.Sitemap[number];

const latest = (dates: string[]) => (dates.length ? new Date(dates.sort().at(-1)!) : undefined);

/** hreflang alternates for pages that exist in more than one language, with x-default as in the page heads. */
const languagesFor = (pathFor: (l: Locale) => string, exists: (l: Locale) => boolean) => {
  const present = locales.filter(exists);
  if (present.length < 2) return undefined;
  const languages = Object.fromEntries(present.map((l) => [htmlLang[l], absoluteUrl(pathFor(l))]));
  if (present.includes(defaultLocale)) languages["x-default"] = absoluteUrl(pathFor(defaultLocale));
  return { languages };
};

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [];

  for (const locale of locales) {
    const posts = getPosts(locale);
    const siteLastMod = latest(posts.map((p) => p.updatedAt));

    entries.push(
      {
        url: absoluteUrl(paths.home(locale)),
        lastModified: siteLastMod,
        alternates: languagesFor(paths.home, () => true),
      },
      {
        url: absoluteUrl(paths.about(locale)),
        lastModified: new Date(siteConfig.aboutUpdatedAt),
        alternates: languagesFor(paths.about, () => true),
      },
    );

    if (posts.length > 0) {
      entries.push({
        url: absoluteUrl(paths.posts(locale)),
        lastModified: siteLastMod,
        alternates: languagesFor(paths.posts, (l) => getPosts(l).length > 0),
      });
    }

    for (const topic of getTopicsWithPosts(locale)) {
      entries.push({
        url: absoluteUrl(paths.topic(locale, topic.slug)),
        lastModified: latest(getPostsByTopic(locale, topic.slug).map((p) => p.updatedAt)),
        alternates: languagesFor(
          (l) => paths.topic(l, topic.slug),
          (l) => getTopicsWithPosts(l).some((t) => t.slug === topic.slug),
        ),
      });
    }

    for (const category of getCategoriesWithPosts(locale)) {
      entries.push({
        url: absoluteUrl(paths.category(locale, category.slug)),
        lastModified: latest(getPostsByCategory(locale, category.slug).map((p) => p.updatedAt)),
        alternates: languagesFor(
          (l) => paths.category(l, category.slug),
          (l) => getCategoriesWithPosts(l).some((c) => c.slug === category.slug),
        ),
      });
    }

    for (const tag of getIndexableTags(locale)) {
      entries.push({
        url: absoluteUrl(paths.tag(locale, tag.slug)),
        lastModified: latest(getPostsByTag(locale, tag.slug).map((p) => p.updatedAt)),
        alternates: languagesFor(
          (l) => paths.tag(l, tag.slug),
          (l) => getIndexableTags(l).some((t) => t.slug === tag.slug),
        ),
      });
    }

    for (const post of posts) {
      entries.push({
        url: absoluteUrl(paths.post(locale, post.topic, post.slug)),
        lastModified: new Date(post.updatedAt),
        alternates: languagesFor(
          (l) => paths.post(l, post.topic, post.slug),
          (l) => hasPostTranslation(l, post.topic, post.slug),
        ),
      });
    }
  }

  return entries;
}
