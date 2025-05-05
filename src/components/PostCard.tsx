"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Tilt } from "react-tilt";

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
  const formattedDate = formatDate(date);

  return (
    <Tilt className="w-full h-full">
      <Card className="shadow-sm dark:bg-card w-full h-full">
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
    </Tilt>
  );
}
