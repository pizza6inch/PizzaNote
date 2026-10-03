import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import PizzaPlayground from "./PizzaPlayground";
import Avatar from "./Avatar";
import DaysAlive from "./DaysAlive";
import { GithubIcon, InstagramIcon } from "./BrandIcons";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCategoriesWithPosts } from "@/lib/content";
import { paths } from "@/lib/urls";
import { daysSince, siteConfig } from "@/lib/site";

const iconLink = "hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary";

export default function Sidebar({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const categories = getCategoriesWithPosts(locale);
  const initialDays = daysSince(siteConfig.launchDate);
  // The client refreshes the number, so the dictionary template is turned into a "{days}" placeholder.
  const aliveTemplate = dict.sidebar.alive(-1).replace("-1", "{days}");

  return (
    <aside>
      <div className="mb-8">
        <h2 className="widget-title">{dict.sidebar.about}</h2>
        <Avatar />
        <p className="mb-4 dark:text-gray-300">{dict.about.intro}</p>
        <Link href={paths.about(locale)}>
          <Button variant="outline" className="w-full sm:w-auto dark:bg-card dark:hover:bg-accent">
            {dict.sidebar.more}
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="widget-title">{dict.sidebar.heart}</h2>
        <PizzaPlayground />
        <p className="mt-8">
          <DaysAlive launchDate={siteConfig.launchDate} initial={initialDays} template={aliveTemplate} />
        </p>
      </div>

      <div className="mb-8">
        <h2 className="widget-title">{dict.sidebar.categories}</h2>
        <ul className="list-none space-y-2">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link href={paths.category(locale, category.slug)} className={iconLink}>
                {category.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="widget-title">{dict.sidebar.follow}</h2>
        <ul className="flex space-x-4">
          <li>
            <Link href={siteConfig.author.github} target="_blank" rel="noopener" aria-label="GitHub" className={iconLink}>
              <GithubIcon className="h-6 w-6" />
            </Link>
          </li>
          <li>
            <Link
              href={siteConfig.author.instagram}
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
              className={iconLink}
            >
              <InstagramIcon className="h-6 w-6" />
            </Link>
          </li>
          <li>
            <Link href={`mailto:${siteConfig.author.email}`} aria-label="Email" className={iconLink}>
              <Mail />
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
