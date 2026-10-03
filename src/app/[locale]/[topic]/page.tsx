import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import PostCard from "@/components/PostCard";
import JsonLd from "@/components/JsonLd";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePaths, resolveLocale } from "@/i18n/server";
import {
  getCategoriesForTopic,
  getCategory,
  getPostsByTopic,
  getTopic,
  getTopicsWithPosts,
} from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";

export const dynamicParams = false;

type Props = { params: Promise<{ locale: string; topic: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => getTopicsWithPosts(locale).map((t) => ({ locale, topic: t.slug })));
}

const hasTopic = (locale: (typeof locales)[number], slug: string) =>
  getTopicsWithPosts(locale).some((t) => t.slug === slug);

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
    alternates: localePaths((l) => hasTopic(l, slug), (l) => paths.topic(l, slug)),
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

  return (
    <MainLayout locale={locale} alternates={localePaths((l) => hasTopic(l, slug), (l) => paths.topic(l, slug))}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.breadcrumb.home, path: paths.home(locale) },
          { name: topic.title, path: paths.topic(locale, slug) },
        ])}
      />
      <div className="py-10 px-5 md:px-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-center">{topic.title}</h1>
        {topic.description && (
          <p className="mb-8 text-gray-600 dark:text-gray-400 text-center max-w-3xl">{topic.description}</p>
        )}

        <h2 className="sr-only">{dict.topic.categories}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-7xl">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={paths.category(locale, category.slug)}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
              {category.description && (
                <p className="text-gray-500 dark:text-gray-400 line-clamp-5">{category.description}</p>
              )}
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6 w-full max-w-7xl">{dict.topic.posts}</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-7xl">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard
                locale={locale}
                post={post}
                categoryTitle={getCategory(locale, post.category)?.title}
                headingLevel="h3"
              />
            </li>
          ))}
        </ul>
      </div>
    </MainLayout>
  );
}
