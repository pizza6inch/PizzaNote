import type { Metadata } from "next";
import MainLayout from "@/components/MainLayout";
import Avatar from "@/components/Avatar";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import JsonLd from "@/components/JsonLd";
import { getDictionary } from "@/i18n/dictionaries";
import { localePaths, resolveLocale } from "@/i18n/server";
import { breadcrumbJsonLd, pageMetadata, personJsonLd } from "@/lib/seo";
import { paths } from "@/lib/urls";

type Props = { params: Promise<{ locale: string }> };

const alternates = () => localePaths(() => true, paths.about);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: paths.about(locale),
    title: dict.about.title,
    description: dict.about.intro.slice(0, 150),
    alternates: alternates(),
  });
}

export default async function AboutPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  return (
    <MainLayout locale={locale} alternates={alternates()}>
      <JsonLd
        data={[
          personJsonLd(),
          breadcrumbJsonLd([
            { name: dict.breadcrumb.home, path: paths.home(locale) },
            { name: dict.about.title, path: paths.about(locale) },
          ]),
        ]}
      />
      <section className="py-6">
        <div className="container">
          <h1 className="widget-title text-center mx-auto mb-8">{dict.about.title}</h1>

          <div className="flex justify-center mb-8">
            <Avatar />
          </div>

          <div className="content mb-12" id="introduction">
            <p className="mb-4">{dict.about.intro}</p>
          </div>

          <h2 className="widget-title text-center mx-auto mb-8">{dict.about.experience}</h2>

          <ExperienceTimeline items={dict.experience} />
        </div>
      </section>
    </MainLayout>
  );
}
