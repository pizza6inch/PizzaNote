import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import MenuRow from "@/components/MenuRow";
import PageHeader from "@/components/PageHeader";
import PizzaToc from "@/components/PizzaToc";
import JsonLd from "@/components/JsonLd";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePaths, resolveLocale } from "@/i18n/server";
import {
  getCategoriesForTopic,
  getCategory,
  getPostNumber,
  getPostsByCategory,
  getPostsByTopic,
  getTopic,
  getTopicsWithPosts,
} from "@/lib/content";
import { breadcrumbJsonLd, collectionPageJsonLd, pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";

export const dynamicParams = false;

type Props = { params: Promise<{ locale: string; topic: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => getTopicsWithPosts(locale).map((t) => ({ locale, topic: t.slug })));
}

const hasTopic = (locale: Locale, slug: string) => getTopicsWithPosts(locale).some((t) => t.slug === slug);
const alternatesFor = (slug: string) => localePaths((l) => hasTopic(l, slug), (l) => paths.topic(l, slug));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { topic: slug } = await params;
  const topic = getTopic(locale, slug);
  if (!topic || !hasTopic(locale, slug)) notFound();
  return pageMetadata({
    locale,
    path: paths.topic(locale, slug),
    title: topic.title,
    description: topic.description,
    alternates: alternatesFor(slug),
  });
}

export default async function TopicPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const { topic: slug } = await params;
  const topic = getTopic(locale, slug);
  if (!topic || !hasTopic(locale, slug)) notFound();

  const dict = getDictionary(locale);
  const categories = getCategoriesForTopic(locale, slug);
  const posts = getPostsByTopic(locale, slug);
  const slices = categories.map((c) => ({
    slug: c.slug,
    title: c.title,
    count: getPostsByCategory(locale, c.slug).length,
    href: paths.category(locale, c.slug),
  }));

  return (
    <MainLayout locale={locale} alternates={alternatesFor(slug)} currentPath={paths.topic(locale, slug)}>
      <JsonLd
        data={[
          collectionPageJsonLd(locale, topic.title, topic.description, paths.topic(locale, slug)),
          breadcrumbJsonLd([
            { name: dict.breadcrumb.home, path: paths.home(locale) },
            { name: topic.title, path: paths.topic(locale, slug) },
          ]),
        ]}
      />
      <PageHeader
        title={topic.title}
        description={topic.description}
        crumbs={[{ title: dict.breadcrumb.home, links: paths.home(locale), isHome: true }]}
      />

      <div className="mx-auto grid max-w-[90rem] gap-12 px-4 py-14 md:px-8 md:py-20 lg:grid-cols-12">
        <section className="lg:col-span-4" aria-labelledby="topic-categories">
          <h2 id="topic-categories" className="font-display text-3xl">
            {dict.topic.categories}
          </h2>
          <div className="mx-auto mt-6 max-w-[20rem]">
            <PizzaToc slices={slices} label={dict.topic.categories} />
          </div>
          <ul className="mt-8 divide-y divide-[hsl(var(--border))] border-y border-[hsl(var(--border))]">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={paths.category(locale, category.slug)} className="block px-2 py-4 hover:bg-[var(--cheese-soft)]">
                  <span className="block font-display text-xl">{category.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {category.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="lg:col-span-8" aria-labelledby="topic-posts">
          <h2 id="topic-posts" className="font-display text-3xl">
            {dict.topic.posts}
          </h2>
          <ol className="mt-6">
            {posts.map((post) => (
              <MenuRow
                key={post.slug}
                locale={locale}
                post={post}
                number={getPostNumber(locale, post)}
                categoryTitle={getCategory(locale, post.category)?.title}
              />
            ))}
          </ol>
        </section>
      </div>
    </MainLayout>
  );
}
