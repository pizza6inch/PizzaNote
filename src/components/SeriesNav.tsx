import React from "react";
import Link from "next/link";
import { ListOrdered } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { paths } from "@/lib/urls";
import { getPostNumber, type SeriesGroup } from "@/lib/content";

interface SeriesNavProps {
  locale: Locale;
  heading: string;
  overviewLabel: string;
  category: { slug: string; title: string };
  groups: SeriesGroup[];
  currentSlug?: string;
}

/** The category's contents as an order ticket: one copy, sticky beside the article on desktop, after it on mobile. */
export default function SeriesNav({ locale, heading, overviewLabel, category, groups, currentSlug }: SeriesNavProps) {
  return (
    <nav aria-label={heading} className="ticket">
      <h2 className="ticket-title">{heading}</h2>
      <Link href={paths.category(locale, category.slug)} className="ticket-link">
        <span className="ticket-no">
          <ListOrdered className="h-4 w-4" aria-hidden="true" />
        </span>
        <span>
          {overviewLabel} · {category.title}
        </span>
      </Link>
      {groups.map((group) => (
        <div key={group.title ?? "_"}>
          {group.title && <h3 className="ticket-group">{group.title}</h3>}
          <ul>
            {group.posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={paths.post(locale, post.topic, post.slug)}
                  aria-current={post.slug === currentSlug ? "page" : undefined}
                  className="ticket-link"
                >
                  <span className="ticket-no" data-numeric>
                    {String(getPostNumber(locale, post)).padStart(2, "0")}
                  </span>
                  <span>{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
