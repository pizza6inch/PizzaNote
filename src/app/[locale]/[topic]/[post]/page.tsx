import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import MarkdownBlock from "@/components/MarkdownBlock";
import BreadcrumbLinks from "@/components/BreadcrumbLinks";
import SeriesNav from "@/components/SeriesNav";
import CommentSection from "@/components/CommentSection";
import ViewCounter from "@/components/ViewCounter";
import JsonLd from "@/components/JsonLd";
import { htmlLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePaths, resolveLocale } from "@/i18n/server";
import { getAllPostParams, getCategory, getPost, getSeriesGroups, getTopic, hasPostTranslation } from "@/lib/content";
import { articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { paths } from "@/lib/urls";
import { formatDate } from "@/lib/utils";

export const dynamicParams = false;

type Props = { params: Promise<{ locale: string; topic: string; post: string }> };

export function generateStaticParams() {
  return getAllPostParams();
}

const alternatesFor = (topic: string, slug: string) =>
  localePaths(
    (l) => hasPostTranslation(l, topic, slug),
    (l) => paths.post(l, topic, slug),
  );

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { topic, post: slug } = await params;
  const post = getPost(locale, topic, slug);
  if (!post) notFound();

  return pageMetadata({
    locale,
    path: paths.post(locale, topic, slug),
    title: post.title,
    description: post.description,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    alternates: alternatesFor(topic, slug),
    markdownPath: paths.postMarkdown(locale, topic, slug),
  });
}

export default async function PostPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const { topic: topicSlug, post: slug } = await params;
  const post = getPost(locale, topicSlug, slug);
  if (!post) notFound();

  const dict = getDictionary(locale);
  const topic = getTopic(locale, topicSlug);
  const category = getCategory(locale, post.category);
  const groups = getSeriesGroups(locale, post.category);

  // Previous / next follow the reading order of the category (series first, oldest first).
  const ordered = groups.flatMap((g) => g.posts);
  const index = ordered.findIndex((p) => p.slug === post.slug);
  const prev = index > 0 ? ordered[index - 1] : null;
  const next = index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : null;

  const path = paths.post(locale, topicSlug, slug);
  const crumbs = [
    { title: dict.breadcrumb.home, links: paths.home(locale), isHome: true },
    ...(topic ? [{ title: topic.title, links: paths.topic(locale, topicSlug) }] : []),
    ...(category ? [{ title: category.title, links: paths.category(locale, category.slug) }] : []),
  ];

  const navLink =
    "group text-lg flex flex-col text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:dark:text-gray-200 cursor-pointer transition-colors";

  return (
    <MainLayout locale={locale} alternates={alternatesFor(topicSlug, slug)}>
      <JsonLd
        data={[
          articleJsonLd(post, locale, path),
          breadcrumbJsonLd([...crumbs.map((c) => ({ name: c.title, path: c.links })), { name: post.title, path }]),
        ]}
      />

      <div className="flex md:flex-row flex-col">
        <article className="py-10 px-5 md:px-10 relative space-y-10 md:w-[80%] w-[100%] md:order-2">
          <div>
            <BreadcrumbLinks items={crumbs} />
            <div className="fixed top-15 right-5 z-10">
              <ViewCounter postKey={`${topicSlug}/${slug}`} label={dict.post.views} />
            </div>
          </div>

          <header className="space-y-2">
            <h1 className="text-4xl font-bold">{post.title}</h1>
            <p className="py-4 text-lg text-gray-700 dark:text-gray-300">{post.description}</p>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              {dict.post.updated}: <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
              <span className="mx-2">•</span>
              {dict.post.minRead(post.readingMinutes)}
            </p>
          </header>
          <hr />

          <MarkdownBlock content={post.body} />

          <hr />
          <div className="flex justify-between items-center mt-10">
            {prev ? (
              <Link href={paths.post(locale, prev.topic, prev.slug)} className={`${navLink} items-start`} rel="prev">
                <span className="mb-2 flex items-center gap-1 arrow">
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  {dict.post.prev}
                </span>
                <span>{prev.title}</span>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link href={paths.post(locale, next.topic, next.slug)} className={`${navLink} items-end`} rel="next">
                <span className="mb-2 flex items-center gap-1 arrow">
                  {dict.post.next}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
                <span>{next.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </article>

        {category && (
          <aside className="md:order-1 md:sticky md:top-[10vh] md:w-[320px] md:shrink-0 md:h-[90vh] md:overflow-y-auto py-10 px-5 md:bg-gray-100 md:dark:bg-gray-900 custom-scrollbar">
            <SeriesNav
              locale={locale}
              heading={dict.post.toc}
              overviewLabel={dict.post.overview}
              category={{ slug: category.slug, title: category.title }}
              groups={groups}
              currentSlug={post.slug}
            />
          </aside>
        )}
      </div>

      <hr />
      <CommentSection
        heading={dict.post.comments}
        term={`${topicSlug}/${slug}`}
        lang={htmlLang[locale] === "zh-TW" ? "zh-TW" : "en"}
        repo={siteConfig.giscus.repo}
        repoId={siteConfig.giscus.repoId}
        category={siteConfig.giscus.category}
        categoryId={siteConfig.giscus.categoryId}
      />
    </MainLayout>
  );
}
