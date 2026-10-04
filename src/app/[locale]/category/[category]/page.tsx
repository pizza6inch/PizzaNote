import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import MenuRow from "@/components/MenuRow";
import PageHeader from "@/components/PageHeader";
import JsonLd from "@/components/JsonLd";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePaths, resolveLocale } from "@/i18n/server";
import { getCategoriesWithPosts, getCategory, getPostNumber, getSeriesGroups, getTopic } from "@/lib/content";
import { breadcrumbJsonLd, collectionPageJsonLd, pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { summarize } from "@/lib/utils";

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
    description: summarize(category.description),
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
  const crumbs = [
    { title: dict.breadcrumb.home, links: paths.home(locale), isHome: true },
    ...(topic ? [{ title: topic.title, links: paths.topic(locale, topic.slug) }] : []),
  ];

  return (
    <MainLayout locale={locale} alternates={alternatesFor(slug)}>
      <JsonLd
        data={[
          collectionPageJsonLd(locale, category.title, category.description, paths.category(locale, slug)),
          breadcrumbJsonLd([
            ...crumbs.map((c) => ({ name: c.title, path: c.links })),
            { name: category.title, path: paths.category(locale, slug) },
          ]),
        ]}
      />
      <PageHeader title={category.title} description={category.description} crumbs={crumbs} />

      <div className="mx-auto max-w-[90rem] space-y-14 px-4 py-14 md:px-8 md:py-20">
        {groups.map((group) => (
          <section key={group.title ?? "_"}>
            {group.title && <h2 className="font-display text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)]">{group.title}</h2>}
            <ol className="mt-6">
              {group.posts.map((post) => (
                <MenuRow
                  key={post.slug}
                  locale={locale}
                  post={post}
                  number={getPostNumber(locale, post)}
                  headingLevel={group.title ? "h3" : "h2"}
                />
              ))}
            </ol>
          </section>
        ))}
      </div>
    </MainLayout>
  );
}
