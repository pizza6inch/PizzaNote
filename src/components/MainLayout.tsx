import React from "react";
import Header, { type MenuItem, type LocaleLink } from "@/components/Header";
import Footer from "@/components/Footer";
import { locales, localeLabel, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCategoriesForTopic, getTopicsWithPosts } from "@/lib/content";
import { paths } from "@/lib/urls";
import type { LocalePaths } from "@/lib/seo";

interface MainLayoutProps {
  locale: Locale;
  /** Paths of the current page in each locale where it exists; missing locales link to that locale's home. */
  alternates?: LocalePaths;
  children: React.ReactNode;
}

export default function MainLayout({ locale, alternates, children }: MainLayoutProps) {
  const dict = getDictionary(locale);

  const menu: MenuItem[] = [
    ...getTopicsWithPosts(locale).map((topic) => ({
      title: topic.title,
      links: paths.topic(locale, topic.slug),
      content: getCategoriesForTopic(locale, topic.slug).map((c) => ({
        links: paths.category(locale, c.slug),
        text: c.title,
      })),
    })),
    { title: dict.nav.allPosts, links: paths.posts(locale), content: [] },
    { title: dict.nav.about, links: paths.about(locale), content: [] },
  ];

  const localeLinks: LocaleLink[] = locales.map((l) => ({
    code: l === "zh-tw" ? "zh-TW" : l,
    label: localeLabel[l],
    href: alternates?.[l] ?? paths.home(l),
    current: l === locale,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        homeHref={paths.home(locale)}
        searchIndexUrl={paths.searchIndex(locale)}
        menu={menu}
        localeLinks={localeLinks}
        labels={{
          siteName: dict.site.name,
          overview: dict.nav.overview,
          search: dict.nav.search,
          menu: dict.nav.menu,
          language: dict.nav.language,
          theme: dict.nav.theme,
          searchTitle: dict.search.title,
          searchPlaceholder: dict.search.placeholder,
          searchLoading: dict.search.loading,
          searchEmpty: dict.search.empty,
          searchHint: dict.search.hint,
          close: dict.search.close,
        }}
      />
      <main className="flex-grow pt-16">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
