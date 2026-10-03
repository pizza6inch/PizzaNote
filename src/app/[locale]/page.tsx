import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CjkText from "@/components/CjkText";
import MainLayout from "@/components/MainLayout";
import MenuRow from "@/components/MenuRow";
import PizzaToc from "@/components/PizzaToc";
import JsonLd from "@/components/JsonLd";
import { getDictionary } from "@/i18n/dictionaries";
import { localePaths, resolveLocale } from "@/i18n/server";
import { getCategoriesWithPosts, getCategory, getPostNumber, getPosts, getPostsByCategory } from "@/lib/content";
import { pageMetadata, personJsonLd, websiteJsonLd } from "@/lib/seo";
import { paths } from "@/lib/urls";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

const alternates = () => localePaths(() => true, paths.home);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: paths.home(locale),
    title: `${dict.site.name} - ${dict.site.tagline}`,
    absoluteTitle: true,
    description: dict.site.description,
    alternates: alternates(),
  });
}

export default async function Home({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const posts = getPosts(locale);
  const [special] = posts;
  const slices = getCategoriesWithPosts(locale).map((c) => ({
    slug: c.slug,
    title: c.title,
    count: getPostsByCategory(locale, c.slug).length,
    href: paths.category(locale, c.slug),
  }));

  return (
    <MainLayout locale={locale} alternates={alternates()} currentPath={paths.home(locale)}>
      <JsonLd data={[websiteJsonLd(locale), personJsonLd()]} />

      <section className="field">
        <div className="mx-auto grid max-w-[90rem] gap-10 px-4 pb-14 pt-10 md:px-8 lg:grid-cols-12 lg:items-start lg:gap-12 lg:pb-12 lg:pt-10">
          <div className="lg:col-span-7">
            <h1 className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-tight">{dict.site.tagline}</h1>

            {special && (
              <article className="mt-8 border-t-2 border-[var(--crust)] pt-6 lg:mt-10">
                <h2 className="font-display text-[clamp(2rem,1.4rem+2.8vw,4rem)] leading-[1.1]">
                  <Link href={paths.post(locale, special.topic, special.slug)} className="hover:underline decoration-[3px] underline-offset-[0.15em]">
                    <CjkText>{special.title}</CjkText>
                  </Link>
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--crust)]/85">{special.description}</p>
                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <Link href={paths.post(locale, special.topic, special.slug)} className="btn-pepperoni">
                    {dict.home.read}
                    <span className="font-normal opacity-90" data-numeric>
                      · {dict.post.minShort(special.readingMinutes)}
                    </span>
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                  <p className="text-sm font-bold text-[var(--crust)]/80">
                    {dict.home.special} · <time dateTime={special.publishedAt}>{formatDate(special.publishedAt)}</time>
                  </p>
                </div>
              </article>
            )}
          </div>

          <div className="mx-auto w-full max-w-[18rem] sm:max-w-[22rem] lg:col-span-5 lg:max-w-[24rem]">
            <PizzaToc slices={slices} label={dict.home.topics} />
            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {slices.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={s.href}
                    className="inline-flex items-baseline gap-1.5 rounded-full border-2 border-[var(--crust)] px-3 py-1 text-sm font-bold transition-colors hover:border-[var(--pepperoni)] hover:bg-[var(--pepperoni)] hover:text-white"
                  >
                    {s.title}
                    <span className="font-mono text-xs" data-numeric>
                      {s.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[90rem] px-4 py-14 md:px-8 md:pb-20 lg:pt-10" aria-labelledby="menu-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="menu-heading" className="font-display text-[clamp(2rem,1.5rem+2vw,3.25rem)] leading-none">
            {dict.home.menu}
          </h2>
          <Link href={paths.posts(locale)} className="inline-flex items-center gap-1 font-bold text-[var(--link)] hover:underline">
            {dict.nav.allPosts}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ol className="mt-8">
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
    </MainLayout>
  );
}
