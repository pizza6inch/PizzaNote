import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export interface PostCardProps {
  title: string;
  slug: string;
  author: string;
  date: string;
  category?: {
    name: string;
    slug: string;
  };
  description: string;
  isColumnPost?: boolean;
}

export default function PostCard({
  title,
  slug,
  author,
  date,
  category,
  description,
  isColumnPost = false,
}: PostCardProps) {
  return (
    <Card className="mb-4 shadow-sm">
      <CardContent className="p-6">
        {isColumnPost && (
          <div className="btn btn-primary btn-sm rounded py-1 px-2 mb-3 inline-block text-xs text-white bg-primary">
            自媒體專欄
          </div>
        )}

        <Link href={`/blog/${slug}`} className="block my-3">
          <h2 className="post-list-title hover:text-primary transition-colors">
            {title}
          </h2>
        </Link>

        <div className="mb-3 text-sm text-gray-600 flex flex-wrap">
          <span>By {author}</span>
          <span className="mx-2">•</span>
          <span>{date}</span>

          {category && (
            <>
              <span className="mx-2">•</span>
              <Link href={`/categories/${category.slug}`} className="text-primary hover:underline">
                {category.name}
              </Link>
            </>
          )}
        </div>

        <p className="text-gray-700">{description}</p>
      </CardContent>
    </Card>
  );
}
