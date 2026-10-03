import React from "react";
import Header, { type MenuItem, type LocaleLink } from "@/components/Header";
import Footer from "@/components/Footer";
import { locales, localeLabel, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getTopicsWithPosts } from "@/lib/content";
import { paths } from "@/lib/urls";
import type { LocalePaths } from "@/lib/seo";

interface MainLayoutProps {
  locale: Locale;
  /** Paths of the current page in each locale where it exists; missing locales link to that locale's home. */
  alternates?: LocalePaths;
  /** Path of the current page, used to mark the matching menu entry. */
  currentPath?: string;
  children: React.ReactNode;
}

const localeShortLabel: Record<Locale, string> = { "zh-tw": "中", en: "EN" };

export default function MainLayout({ locale, alternates, currentPath, children }: MainLayoutProps) {
  const dict = getDictionary(locale);

  const menu: MenuItem[] = [
    ...getTopicsWithPosts(locale).map((topic) => ({ title: topic.title, href: paths.topic(locale, topic.slug) })),
    { title: dict.nav.allPosts, href: paths.posts(locale) },
    { title: dict.nav.about, href: paths.about(locale) },
  ].map((item) => ({ ...item, current: currentPath === item.href }));

  const localeLinks: LocaleLink[] = locales.map((l) => ({
    code: l === "zh-tw" ? "zh-TW" : l,
    label: localeShortLabel[l],
    href: alternates?.[l] ?? paths.home(l),
    current: l === locale,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        homeHref={paths.home(locale)}
        searchIndexUrl={paths.searchIndex(locale)}
        menu={menu}
        localeLinks={localeLinks}
        labels={{
          siteName: dict.site.name,
          search: dict.nav.search,
          menu: dict.nav.menu,
          language: `${dict.nav.language}: ${locales.map((l) => localeLabel[l]).join(" / ")}`,
          theme: dict.nav.theme,
          skip: dict.nav.skip,
          searchTitle: dict.search.title,
          searchPlaceholder: dict.search.placeholder,
          searchLoading: dict.search.loading,
          searchEmpty: dict.search.empty,
          searchHint: dict.search.hint,
          close: dict.search.close,
        }}
      />
      <main id="main" className="flex-grow">
        {children}
      </main>
      <Footer locale={locale} />
    </div>
  );
}
