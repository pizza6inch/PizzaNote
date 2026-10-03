import type { Metadata } from "next";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import MenuRow from "@/components/MenuRow";
import PageHeader from "@/components/PageHeader";
import JsonLd from "@/components/JsonLd";
import { getDictionary } from "@/i18n/dictionaries";
import { localePaths, resolveLocale } from "@/i18n/server";
import { getCategoriesWithPosts, getPostNumber, getPosts, getPostsByCategory } from "@/lib/content";
import { breadcrumbJsonLd, collectionPageJsonLd, pageMetadata } from "@/lib/seo";
import { paths } from "@/lib/urls";

type Props = { params: Promise<{ locale: string }> };

const alternates = () => localePaths((l) => getPosts(l).length > 0, paths.posts);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: paths.posts(locale),
    title: dict.posts.title,
    description: dict.posts.description,
    alternates: alternates(),
  });
}

/** The full menu: one section per category, posts numbered by their permanent menu number. */
export default async function PostsPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const posts = getPosts(locale);
  const categories = getCategoriesWithPosts(locale);

  return (
    <MainLayout locale={locale} alternates={alternates()} currentPath={paths.posts(locale)}>
      <JsonLd
        data={[
          collectionPageJsonLd(locale, dict.posts.title, dict.posts.description, paths.posts(locale)),
          breadcrumbJsonLd([
            { name: dict.breadcrumb.home, path: paths.home(locale) },
            { name: dict.posts.title, path: paths.posts(locale) },
          ]),
        ]}
      />
      <PageHeader
        title={dict.posts.title}
        description={dict.posts.description}
        crumbs={[{ title: dict.breadcrumb.home, links: paths.home(locale), isHome: true }]}
      />

      <div className="mx-auto max-w-[90rem] px-4 py-14 md:px-8 md:py-20">
        {posts.length === 0 ? (
          <p className="text-lg text-muted-foreground">{dict.posts.empty}</p>
        ) : (
          <div className="space-y-16">
            {categories.map((category) => (
              <section key={category.slug} aria-labelledby={`cat-${category.slug}`}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h2 id={`cat-${category.slug}`} className="font-display text-[clamp(1.75rem,1.4rem+1.5vw,2.75rem)]">
                    <Link href={paths.category(locale, category.slug)} className="hover:text-[var(--link)] hover:underline">
                      {category.title}
                    </Link>
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    <span className="font-mono" data-numeric>
                      {getPostsByCategory(locale, category.slug).length}
                    </span>{" "}
                    {dict.posts.countUnit(getPostsByCategory(locale, category.slug).length)}
                  </span>
                </div>
                <ol className="mt-6">
                  {getPostsByCategory(locale, category.slug).map((post) => (
                    <MenuRow key={post.slug} locale={locale} post={post} number={getPostNumber(locale, post)} />
                  ))}
                </ol>
              </section>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
