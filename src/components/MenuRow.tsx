import Link from "next/link";
import CjkText from "./CjkText";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Post } from "@/lib/content";
import { paths } from "@/lib/urls";

interface MenuRowProps {
  locale: Locale;
  post: Post;
  /** Stable menu number (1 = oldest post). */
  number: number;
  categoryTitle?: string;
  headingLevel?: "h2" | "h3" | "h4";
}

/** One line of the menu: number, title and summary, dotted leader, then minutes and category. */
export default function MenuRow({ locale, post, number, categoryTitle, headingLevel = "h3" }: MenuRowProps) {
  const dict = getDictionary(locale);
  const Heading = headingLevel;
  return (
    <li>
      <Link href={paths.post(locale, post.topic, post.slug)} className="menu-row">
        <span className="menu-no" data-numeric>
          {String(number).padStart(2, "0")}
        </span>
        <Heading className="menu-title">
          <CjkText>{post.title}</CjkText>
        </Heading>
        <span className="menu-leader" aria-hidden="true" />
        <span className="menu-time">
          <span className="menu-num" data-numeric>
            {post.readingMinutes}
          </span>{" "}
          {dict.post.minUnit}
        </span>
        <span className="menu-summary">{post.description}</span>
        {categoryTitle && <span className="menu-cat">{categoryTitle}</span>}
      </Link>
    </li>
  );
}
