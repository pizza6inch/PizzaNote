import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { paths } from "@/lib/urls";
import type { Locale } from "@/i18n/config";
import type { Post } from "@/lib/content";

export interface PostCardProps {
  locale: Locale;
  post: Post;
  categoryTitle?: string;
  /** Use <h2> by default; pages that already have an <h2> hierarchy can pass "h3". */
  headingLevel?: "h2" | "h3";
}

export default function PostCard({ locale, post, categoryTitle, headingLevel = "h2" }: PostCardProps) {
  const Heading = headingLevel;

  return (
    <div className="w-full h-full transition-transform duration-200 hover:-translate-y-1">
      <Card className="shadow-sm dark:bg-card w-full h-full">
        <CardContent className="p-6">
          <Link href={paths.post(locale, post.topic, post.slug)} className="block my-3">
            <Heading className="post-list-title dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-colors">
              {post.title}
            </Heading>
          </Link>

          <div className="mb-3 text-sm text-gray-600 dark:text-gray-400 flex flex-wrap items-center">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>

            {categoryTitle && (
              <>
                <span className="mx-2">•</span>
                <Link href={paths.category(locale, post.category)} className="text-primary hover:underline">
                  {categoryTitle}
                </Link>
              </>
            )}
          </div>

          <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{post.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
