import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CjkText from "@/components/CjkText";
import MainLayout from "@/components/MainLayout";
import MarkdownBlock from "@/components/MarkdownBlock";
import BreadcrumbLinks from "@/components/BreadcrumbLinks";
import SeriesNav from "@/components/SeriesNav";
import PostToc from "@/components/PostToc";
import CommentSection from "@/components/CommentSection";
import ViewCounter from "@/components/ViewCounter";
import JsonLd from "@/components/JsonLd";
import { htmlLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePaths, resolveLocale } from "@/i18n/server";
import {
  getAllPostParams,
  getCategory,
  getPost,
  getPostNumber,
  getSeriesGroups,
  getTopic,
  hasPostTranslation,
} from "@/lib/content";
import { getHeadings } from "@/lib/headings";
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
    title: post.seoTitle ?? post.title,
    description: post.description,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    alternates: alternatesFor(topic, slug),
    markdownPath: paths.postMarkdown(locale, topic, slug),
    imagePath: paths.ogPost(locale, topic, slug),
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
  const headings = getHeadings(post.body);

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

  const stepLink =
    "group flex flex-col gap-2 rounded-xl border-2 border-[hsl(var(--border))] p-5 transition-colors hover:border-[var(--pepperoni)] hover:bg-[var(--cheese-soft)] dark:hover:border-[var(--cheese)]";

  return (
    <MainLayout locale={locale} alternates={alternatesFor(topicSlug, slug)}>
      <JsonLd
        data={[
          articleJsonLd(post, locale, path, category?.title),
          breadcrumbJsonLd([...crumbs.map((c) => ({ name: c.title, path: c.links })), { name: post.title, path }]),
        ]}
      />

      <header className="field">
        <div className="mx-auto max-w-[90rem] px-4 pb-12 pt-8 md:px-8 md:pb-14 md:pt-10">
          <BreadcrumbLinks items={crumbs} />
          <h1 className="mt-6 max-w-5xl font-display text-[clamp(2.1rem,1.5rem+2.8vw,4.25rem)] leading-[1.12]">
            <CjkText>{post.title}</CjkText>
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--crust)]/85">{post.description}</p>
          <dl className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-bold">
            <div className="flex items-baseline gap-2">
              <dt className="sr-only">No.</dt>
              <dd className="rounded-full bg-[var(--crust)] px-3 py-1 font-mono text-[var(--cheese)]" data-numeric>
                No.{String(getPostNumber(locale, post)).padStart(2, "0")}
              </dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt>{dict.post.by}</dt>
              <dd>
                <Link href={paths.about(locale)} rel="author" className="underline decoration-2 underline-offset-4">
                  {siteConfig.author.name}
                </Link>
              </dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt>{dict.post.updated}</dt>
              <dd>
                <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
              </dd>
            </div>
            <div>
              <dt className="sr-only">{dict.post.minRead(post.readingMinutes)}</dt>
              <dd data-numeric>{dict.post.minRead(post.readingMinutes)}</dd>
            </div>
            <div className="text-[var(--crust)]">
              <dt className="sr-only">{dict.post.views}</dt>
              <dd>
                <ViewCounter postKey={`${topicSlug}/${slug}`} label={dict.post.views} />
              </dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="mx-auto grid max-w-[90rem] gap-12 px-4 py-12 md:px-8 md:py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <article className="min-w-0">
          <MarkdownBlock content={post.body} tableLabel={dict.post.table} />

          <section aria-labelledby="about-author" className="ticket mt-16 flex flex-col gap-5 sm:flex-row sm:items-center">
            <Image
              src={siteConfig.author.avatar}
              alt=""
              width={88}
              height={88}
              className="h-22 w-22 shrink-0 rounded-full border-4 border-[var(--crust)] object-cover"
            />
            <div>
              <h2 id="about-author" className="font-display text-2xl">
                {dict.post.aboutAuthor}
              </h2>
              <p className="mt-1 font-bold">{siteConfig.author.name}</p>
              <p className="mt-2 leading-relaxed">{dict.post.authorBio}</p>
              <Link href={paths.about(locale)} rel="author" className="mt-3 inline-flex min-h-11 items-center font-bold underline decoration-2 underline-offset-4">
                {dict.post.moreAboutAuthor}
              </Link>
            </div>
          </section>

          <nav aria-label={`${dict.post.prev} / ${dict.post.next}`} className="mt-16 grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link href={paths.post(locale, prev.topic, prev.slug)} className={stepLink} rel="prev">
                <span className="flex items-center gap-1 text-sm font-bold text-muted-foreground">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  {dict.post.prev}
                </span>
                <span className="font-display text-lg leading-snug underline-offset-[0.35em] [text-decoration-skip-ink:none] group-hover:underline">{prev.title}</span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
            {next && (
              <Link href={paths.post(locale, next.topic, next.slug)} className={`${stepLink} sm:items-end sm:text-right`} rel="next">
                <span className="flex items-center gap-1 text-sm font-bold text-muted-foreground">
                  {dict.post.next}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="font-display text-lg leading-snug underline-offset-[0.35em] [text-decoration-skip-ink:none] group-hover:underline">{next.title}</span>
              </Link>
            )}
          </nav>
        </article>

        {(category || headings.length > 1) && (
          <aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
            {/* The section list only helps beside the text; on mobile the aside comes after the article. */}
            {headings.length > 1 && (
              <div className="hidden lg:block">
                <PostToc heading={dict.post.toc} headings={headings} />
              </div>
            )}
            {category && (
              <SeriesNav
                locale={locale}
                heading={dict.post.series}
                overviewLabel={dict.post.overview}
                category={{ slug: category.slug, title: category.title }}
                groups={groups}
                currentSlug={post.slug}
              />
            )}
          </aside>
        )}
      </div>

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
