import type { Metadata } from "next";
import MainLayout from "@/components/MainLayout";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import PingPongGame from "@/components/PingPongGame";
import JsonLd from "@/components/JsonLd";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localePaths, resolveLocale } from "@/i18n/server";
import { getCategory, getPosts } from "@/lib/content";
import { pageMetadata, personJsonLd, websiteJsonLd } from "@/lib/seo";
import { paths } from "@/lib/urls";

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
  const posts = getPosts(locale).slice(0, 6);

  return (
    <MainLayout locale={locale} alternates={alternates()}>
      <JsonLd data={[websiteJsonLd(locale), personJsonLd()]} />
      <section className="py-6">
        <div className="container">
          <h1 className="sr-only">
            {dict.site.name} - {dict.site.tagline}
          </h1>
          <div className="h-[60vh]" aria-hidden="true">
            <PingPongGame />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
            <div className="lg:col-span-8">
              <h2 className="text-2xl font-bold mb-6">{dict.home.latest}</h2>
              <div className="grid grid-cols-1 gap-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.slug}
                    locale={locale}
                    post={post}
                    categoryTitle={getCategory(locale, post.category)?.title}
                    headingLevel="h3"
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <Sidebar locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
