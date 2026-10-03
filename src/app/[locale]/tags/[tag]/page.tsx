import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import MenuRow from "@/components/MenuRow";
import PageHeader from "@/components/PageHeader";
import JsonLd from "@/components/JsonLd";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePaths, resolveLocale } from "@/i18n/server";
import { getCategory, getIndexableTags, getPostNumber, getPostsByTag, getTag } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";

export const dynamicParams = false;

type Props = { params: Promise<{ locale: string; tag: string }> };

// Tag pages exist only for tags with enough posts (see MIN_POSTS_FOR_TAG_PAGE). Next requires at least one
// static param for a dynamic route, so when no tag qualifies yet we emit a placeholder that responds 404.
export function generateStaticParams() {
  const params = locales.flatMap((locale) => getIndexableTags(locale).map((t) => ({ locale, tag: t.slug })));
  return params.length > 0 ? params : [{ locale: locales[0], tag: "_" }];
}

const hasTag = (locale: Locale, slug: string) => getIndexableTags(locale).some((t) => t.slug === slug);
const alternatesFor = (slug: string) => localePaths((l) => hasTag(l, slug), (l) => paths.tag(l, slug));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { tag: slug } = await params;
  const tag = getTag(locale, slug);
  if (!tag || !hasTag(locale, slug)) notFound();
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: paths.tag(locale, slug),
    title: dict.tag.title(tag.title),
    description: dict.tag.description(tag.title, getPostsByTag(locale, slug).length),
    alternates: alternatesFor(slug),
  });
}

export default async function TagPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const { tag: slug } = await params;
  const tag = getTag(locale, slug);
  if (!tag || !hasTag(locale, slug)) notFound();

  const dict = getDictionary(locale);
  const posts = getPostsByTag(locale, slug);

  return (
    <MainLayout locale={locale} alternates={alternatesFor(slug)}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.breadcrumb.home, path: paths.home(locale) },
          { name: dict.tag.title(tag.title), path: paths.tag(locale, slug) },
        ])}
      />
      <PageHeader
        title={dict.tag.title(tag.title)}
        description={dict.tag.description(tag.title, posts.length)}
        crumbs={[{ title: dict.breadcrumb.home, links: paths.home(locale), isHome: true }]}
      />
      <div className="mx-auto max-w-[90rem] px-4 py-14 md:px-8 md:py-20">
        <ol>
          {posts.map((post) => (
            <MenuRow
              key={post.slug}
              locale={locale}
              post={post}
              number={getPostNumber(locale, post)}
              categoryTitle={getCategory(locale, post.category)?.title}
              headingLevel="h2"
            />
          ))}
        </ol>
      </div>
    </MainLayout>
  );
}
