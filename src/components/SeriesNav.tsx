import React from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { paths } from "@/lib/urls";
import type { SeriesGroup } from "@/lib/content";

interface SeriesNavProps {
  locale: Locale;
  heading: string;
  overviewLabel: string;
  category: { slug: string; title: string };
  groups: SeriesGroup[];
  currentSlug?: string;
}

const linkClass =
  "text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:dark:text-gray-200 cursor-pointer transition-colors relative pb-1";

/** One copy of the table of contents: a sticky sidebar on desktop, placed after the article on mobile. */
export default function SeriesNav({ locale, heading, overviewLabel, category, groups, currentSlug }: SeriesNavProps) {
  return (
    <nav aria-label={heading} className="p-5 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-700">
      <h2 className="text-3xl font-bold mb-4 border-b-2 text-foreground border-gray-300 dark:border-gray-700 pb-2">
        {heading}
      </h2>
      <ul className="space-y-5">
        <li>
          <h3 className="text-xl font-semibold text-foreground mb-2">{overviewLabel}</h3>
          <ul className="pl-4 space-y-2">
            <li>
              <Link href={paths.category(locale, category.slug)} className={`block ${linkClass}`}>
                {category.title}
              </Link>
            </li>
          </ul>
        </li>
        {groups.map((group) => (
          <li key={group.title ?? "_"}>
            {group.title && <h3 className="text-xl font-semibold text-foreground mb-2">{group.title}</h3>}
            <ul className="pl-4 space-y-2">
              {group.posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={paths.post(locale, post.topic, post.slug)}
                    aria-current={post.slug === currentSlug ? "page" : undefined}
                    className={
                      post.slug === currentSlug
                        ? "block text-primary relative pb-1 border-b-2 border-primary"
                        : `block ${linkClass}`
                    }
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
