import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import MainLayout from "@/components/MainLayout";
import PageHeader from "@/components/PageHeader";
import JsonLd from "@/components/JsonLd";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/BrandIcons";
import { getDictionary } from "@/i18n/dictionaries";
import { localePaths, resolveLocale } from "@/i18n/server";
import { breadcrumbJsonLd, pageMetadata, profilePageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { paths } from "@/lib/urls";

type Props = { params: Promise<{ locale: string }> };

const alternates = () => localePaths(() => true, paths.about);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: paths.about(locale),
    title: dict.about.seoTitle,
    description: dict.about.description,
    alternates: alternates(),
  });
}

const contact =
  "inline-flex items-center gap-2 rounded-full border-2 border-[var(--crust)] px-4 py-2 font-bold text-[var(--crust)] transition-colors hover:border-[var(--pepperoni-surface)] hover:bg-[var(--pepperoni-surface)] hover:text-white";

export default async function AboutPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);

  return (
    <MainLayout locale={locale} alternates={alternates()} currentPath={paths.about(locale)}>
      <JsonLd
        data={[
          profilePageJsonLd(locale),
          breadcrumbJsonLd([
            { name: dict.breadcrumb.home, path: paths.home(locale) },
            { name: dict.about.title, path: paths.about(locale) },
          ]),
        ]}
      />
      <PageHeader title={dict.about.title} crumbs={[{ title: dict.breadcrumb.home, links: paths.home(locale), isHome: true }]}>
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-center">
          <Image
            src="/avatar.png"
            alt={siteConfig.author.name}
            width={160}
            height={160}
            priority
            className="h-40 w-40 shrink-0 rounded-full border-4 border-[var(--crust)] object-cover"
          />
          <div>
            <p className="max-w-3xl text-lg leading-[1.9] text-[var(--crust)]">{dict.about.intro}</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              <li>
                <Link href={siteConfig.author.linkedin} target="_blank" rel="noopener" className={contact}>
                  <LinkedinIcon className="h-5 w-5" />
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href={`mailto:${siteConfig.author.email}`} className={contact}>
                  <Mail className="h-5 w-5" aria-hidden="true" />
                  Email
                </Link>
              </li>
              <li>
                <Link href={siteConfig.author.github} target="_blank" rel="noopener" className={contact}>
                  <GithubIcon className="h-5 w-5" />
                  GitHub
                </Link>
              </li>
              <li>
                <Link href={siteConfig.author.instagram} target="_blank" rel="noopener" className={contact}>
                  <InstagramIcon className="h-5 w-5" />
                  Instagram
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </PageHeader>

      <div className="mx-auto grid max-w-[90rem] gap-16 px-4 py-14 md:px-8 md:py-20">
        <section className="max-w-4xl" aria-labelledby="services">
          <h2 id="services" className="font-display text-[clamp(1.75rem,1.4rem+1.5vw,2.75rem)]">
            {dict.about.services}
          </h2>
          <dl className="mt-8 border-t-2 border-[hsl(var(--foreground))]">
            {dict.services.map((group) => (
              <div
                key={group.title}
                className="grid gap-x-8 gap-y-3 border-b border-[hsl(var(--border))] py-6 sm:grid-cols-[11rem_minmax(0,1fr)]"
              >
                <dt className="font-display text-xl">{group.title}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item} className="rounded-full border border-[hsl(var(--border))] px-3 py-1 text-sm text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="max-w-4xl" aria-labelledby="experience">
          <h2 id="experience" className="font-display text-[clamp(1.75rem,1.4rem+1.5vw,2.75rem)]">
            {dict.about.experience}
          </h2>
          <ol className="mt-8 border-t-2 border-[hsl(var(--foreground))]">
            {dict.experience.map((item) => (
              <li
                key={item.title}
                className="grid gap-x-8 gap-y-1 border-b border-[hsl(var(--border))] py-6 sm:grid-cols-[11rem_minmax(0,1fr)]"
              >
                <span className="font-mono text-sm text-muted-foreground" data-numeric>
                  {item.date}
                </span>
                <div>
                  <h3 className="font-display text-xl">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

      </div>
    </MainLayout>
  );
}
