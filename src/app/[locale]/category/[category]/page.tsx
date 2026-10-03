import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import PostCard from "@/components/PostCard";
import JsonLd from "@/components/JsonLd";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePaths, resolveLocale } from "@/i18n/server";
import { getCategoriesWithPosts, getCategory, getSeriesGroups, getTopic } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";

export const dynamicParams = false;

type Props = { params: Promise<{ locale: string; category: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => getCategoriesWithPosts(locale).map((c) => ({ locale, category: c.slug })));
}

const hasCategory = (locale: Locale, slug: string) => getCategoriesWithPosts(locale).some((c) => c.slug === slug);
const alternatesFor = (slug: string) => localePaths((l) => hasCategory(l, slug), (l) => paths.category(l, slug));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { category: slug } = await params;
  const category = getCategory(locale, slug);
  if (!category || !hasCategory(locale, slug)) notFound();
  return pageMetadata({
    locale,
    path: paths.category(locale, slug),
    title: category.title,
    description: category.description.replace(/\s+/g, " ").slice(0, 160),
    alternates: alternatesFor(slug),
  });
}

export default async function CategoryPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const { category: slug } = await params;
  const category = getCategory(locale, slug);
  if (!category || !hasCategory(locale, slug)) notFound();

  const dict = getDictionary(locale);
  const topic = getTopic(locale, category.topic);
  const groups = getSeriesGroups(locale, slug);

  return (
    <MainLayout locale={locale} alternates={alternatesFor(slug)}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.breadcrumb.home, path: paths.home(locale) },
          ...(topic ? [{ name: topic.title, path: paths.topic(locale, topic.slug) }] : []),
          { name: category.title, path: paths.category(locale, slug) },
        ])}
      />
      <div className="py-10 px-5 md:px-10 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{category.title}</h1>
        {category.description && (
          <p className="mb-8 text-gray-600 dark:text-gray-400 max-w-3xl whitespace-pre-line">{category.description}</p>
        )}

        {groups.map((group) => (
          <section key={group.title ?? "_"} className="mb-10">
            {group.title && <h2 className="text-2xl font-bold mb-4">{group.title}</h2>}
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {group.posts.map((post) => (
                <li key={post.slug}>
                  <PostCard locale={locale} post={post} headingLevel={group.title ? "h3" : "h2"} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </MainLayout>
  );
}
