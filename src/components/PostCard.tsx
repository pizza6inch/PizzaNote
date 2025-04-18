import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export interface PostCardProps {
  title: string | null;
  slug: string | null;
  date: string | null;
  category: {
    title: string | null;
    slug: string | null;
    topic: {
      title: string | null;
      slug: string | null;
    } | null;
  } | null;
  description: string | null;
  tags: string[] | null;
}

export default function PostCard({
  title,
  slug,
  date, // 2025-04-07T02:14:17.968Z
  category,
  description,
  tags = [],
}: PostCardProps) {
  const dateObj = date ? new Date(date) : new Date();

  // 格式化為 yyyy/mm/dd
  const formattedDate =
    dateObj.getFullYear() +
    "/" +
    (dateObj.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    dateObj.getDate().toString().padStart(2, "0");

  return (
    <Card className="mb-4 shadow-sm dark:bg-card">
      <CardContent className="p-6">
        {/* {isColumnPost && (
          <div className="btn btn-primary btn-sm rounded py-1 px-2 mb-3 inline-block text-xs text-white bg-primary">
            自媒體專欄
          </div>
        )} */}

        {title && (
          <Link href={`/${category?.topic?.slug}/${slug}`} className="block my-3">
            <h2 className="post-list-title dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-colors">
              {title}
            </h2>
          </Link>
        )}

        <div className="mb-3 text-sm text-gray-600 dark:text-gray-400 flex flex-wrap items-center">
          {/* <span>By {author}</span> */}
          {/* <span className="mx-2">•</span> */}
          {date && <span>{formattedDate}</span>}

          {category && (
            <>
              <span className="mx-2">•</span>
              <Link href={`/${category?.topic?.slug}/${category.slug}`} className="text-primary hover:underline">
                {category.title}
              </Link>
            </>
          )}

          {/* {tags &&
            tags.map((tag) => (
              <div key={tag}>
                <span className="mx-2">•</span>
                <span className="text-primary   bg-yellow rounded-full p-1 text-sm">{tag}</span>
              </div>
            ))} */}
        </div>

        <p className="text-gray-700 dark:text-gray-300">{description}</p>
      </CardContent>
    </Card>
  );
}
