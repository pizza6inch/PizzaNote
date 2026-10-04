import type { Metadata } from "next";
import { locales, htmlLang, ogLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE_URL, absoluteUrl, siteConfig } from "@/lib/site";
import { paths } from "@/lib/urls";
import { OG_SIZE } from "@/lib/og-size";
import { getTag, type Post } from "@/lib/content";

/** Path per locale for pages that exist in that locale, e.g. { "zh-tw": "/zh-tw/about/", en: "/en/about/" }. */
export type LocalePaths = Partial<Record<Locale, string>>;

export interface PageMetaInput {
  locale: Locale;
  /** Path of this page in the current locale (with trailing slash). */
  path: string;
  title: string;
  description: string;
  /** Use the title as-is instead of appending the site name. */
  absoluteTitle?: boolean;
  /** Which locales have this page. Defaults to just the current one. */
  alternates?: LocalePaths;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  /** Path of a Markdown version of this page (advertised as an alternate for crawlers and LLMs). */
  markdownPath?: string;
  /** Path of the share card. Defaults to the site card of the locale. */
  imagePath?: string;
}

export function pageMetadata(input: PageMetaInput): Metadata {
  const { locale, path, title, description, alternates, type = "website" } = input;
  const dict = getDictionary(locale);
  const fullTitle = input.absoluteTitle ? title : `${title} | ${dict.site.name}`;
  const image = { url: absoluteUrl(input.imagePath ?? paths.ogDefault(locale)), ...OG_SIZE, alt: title };

  const languages: Record<string, string> = {};
  for (const l of locales) {
    const p = alternates?.[l];
    if (p) languages[htmlLang[l]] = absoluteUrl(p);
  }
  // x-default points at the default-locale version when it exists.
  if (alternates?.[defaultLocale]) languages["x-default"] = absoluteUrl(alternates[defaultLocale]!);

  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: absoluteUrl(path),
      ...(locales.filter((l) => alternates?.[l]).length > 1 ? { languages } : {}),
      types: {
        "application/rss+xml": absoluteUrl(`/${locale}/feed.xml`),
        ...(input.markdownPath ? { "text/markdown": absoluteUrl(input.markdownPath) } : {}),
      },
    },
    openGraph: {
      type,
      url: absoluteUrl(path),
      siteName: dict.site.name,
      title: fullTitle,
      description,
      locale: ogLocale[locale],
      images: [image],
      alternateLocale: locales.filter((l) => l !== locale && alternates?.[l]).map((l) => ogLocale[l]),
      ...(type === "article"
        ? { publishedTime: input.publishedTime, modifiedTime: input.modifiedTime, authors: [siteConfig.author.name] }
        : {}),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
    ...(input.noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

// ---- JSON-LD ----------------------------------------------------------------

export interface Crumb {
  name: string;
  path: string;
}

export const breadcrumbJsonLd = (crumbs: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: absoluteUrl(c.path),
  })),
});

const AUTHOR_ID = `${SITE_URL}/#author`;
const websiteId = (locale: Locale) => `${SITE_URL}/${locale}/#website`;

export const websiteJsonLd = (locale: Locale) => {
  const dict = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId(locale),
    name: dict.site.name,
    url: absoluteUrl(`/${locale}/`),
    inLanguage: htmlLang[locale],
    description: dict.site.description,
    publisher: { "@id": AUTHOR_ID },
  };
};

/**
 * The author. Search engines read each page on its own, so every page that names the author carries the full node,
 * not only a reference to it.
 */
export const personJsonLd = (locale: Locale) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": AUTHOR_ID,
  name: siteConfig.author.name,
  alternateName: ["Ewan", "Pizza", "pizza6inch"],
  url: absoluteUrl(paths.about(locale)),
  image: absoluteUrl(siteConfig.author.avatar),
  alumniOf: { "@type": "CollegeOrUniversity", name: siteConfig.author.alumniOf },
  knowsAbout: siteConfig.author.knowsAbout,
  sameAs: [siteConfig.author.github, siteConfig.author.instagram],
});

/** The About page: a profile whose subject is the author. */
export const profilePageJsonLd = (locale: Locale) => {
  const { "@context": _context, ...person } = personJsonLd(locale);
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl(paths.about(locale)),
    inLanguage: htmlLang[locale],
    isPartOf: { "@id": websiteId(locale) },
    mainEntity: person,
  };
};

/** Listing pages (all posts, a topic, a category). */
export const collectionPageJsonLd = (locale: Locale, name: string, description: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  description,
  url: absoluteUrl(path),
  inLanguage: htmlLang[locale],
  isPartOf: { "@id": websiteId(locale) },
});

export const articleJsonLd = (post: Post, locale: Locale, path: string, section?: string) => {
  const { "@context": _context, ...author } = personJsonLd(locale);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    inLanguage: htmlLang[locale],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    url: absoluteUrl(path),
    image: { "@type": "ImageObject", url: absoluteUrl(paths.ogPost(locale, post.topic, post.slug)), ...OG_SIZE },
    author,
    publisher: { "@id": AUTHOR_ID },
    isPartOf: { "@id": websiteId(locale) },
    articleSection: section,
    keywords: post.tags.length ? post.tags.map((t) => getTag(locale, t)?.title ?? t).join(", ") : undefined,
  };
};
