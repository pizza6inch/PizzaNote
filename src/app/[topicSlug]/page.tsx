import React from "react";
import MainLayout from "@/components/MainLayout";
import { client } from "@/sanity/lib/client";

import {
  TOPIC_BY_SLUG,
  TOPIC_PAGE_CONTENT_BY_TOPIC_SLUG,
} from "@/sanity/lib/queries";
import Link from "next/link";

export const dynamicParams = false;

export async function generateStaticParams() {
  const topics = await client.fetch(`*[_type == "topic"]{
    "slug": slug.current
  }`);

  return topics.map((topic: { slug: string }) => ({
    topicSlug: topic.slug,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ topicSlug: string }>;
}) {
  const { topicSlug } = await params;

  const topicDetail = await client.fetch(TOPIC_PAGE_CONTENT_BY_TOPIC_SLUG, {
    topicSlug,
  });

  if (!topicDetail) {
    return;
  }

  return (
    <MainLayout>
      <div className="py-10 px-5 md:px-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {topicDetail.title}
        </h1>
        {topicDetail.description && (
          <p className="mb-8 text-gray-600 dark:text-gray-400 text-center max-w-3xl">
            {topicDetail.description}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-7xl">
          {topicDetail.categories?.map((category: any) => (
            <Link
              key={category.slug}
              href={`/${topicSlug}/${category.slug}`}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{category.title}</h2>
              {category.description && (
                <p className="text-gray-500 dark:text-gray-400">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export const revalidate = 43200; // ISR，每 12 小時重新生成一次
