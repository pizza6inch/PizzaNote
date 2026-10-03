import type { Metadata } from "next";
import MainLayout from "@/components/MainLayout";
import PostCard from "@/components/PostCard";
import JsonLd from "@/components/JsonLd";
import { getDictionary } from "@/i18n/dictionaries";
import { localePaths, resolveLocale } from "@/i18n/server";
import { getCategory, getPosts } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
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

export default async function PostsPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const posts = getPosts(locale);

  return (
    <MainLayout locale={locale} alternates={alternates()}>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.breadcrumb.home, path: paths.home(locale) },
          { name: dict.posts.title, path: paths.posts(locale) },
        ])}
      />
      <div className="py-10 px-10 md:px-20 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-start">{dict.posts.title}</h1>
        {posts.length === 0 ? (
          <p>{dict.posts.empty}</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {posts.map((post) => (
              <li key={post.slug}>
                <PostCard locale={locale} post={post} categoryTitle={getCategory(locale, post.category)?.title} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </MainLayout>
  );
}
