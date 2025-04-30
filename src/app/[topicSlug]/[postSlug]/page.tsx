import React from "react";
import MainLayout from "@/components/MainLayout";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import NotFound from "@/app/not-found";

import { POST_ROUTE_QUERY, POST_DETAIL_BY_SLUG, POSTS_BY_CATEGORY, TOPIC_BY_SLUG } from "@/sanity/lib/queries";

import MarkdownBlock from "@/components/MarkdownBlock";
import BreadcrumbLinks from "@/components/BreadcrumbLinks";
import Link from "next/link";
import { title } from "process";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await client.fetch(POST_ROUTE_QUERY);

  const postRoutes = posts.map((post) => {
    return {
      topicSlug: post.category?.topic?.slug || null,
      postSlug: post?.slug || null,
    };
  });

  const categoryRoutes = posts.map((post) => {
    return {
      topicSlug: post.category?.topic?.slug || null,
      postSlug: post.category?.slug || null,
    };
  });

  return postRoutes;
}

export default async function Page({ params }: { params: Promise<{ topicSlug: string; postSlug: string }> }) {
  const { topicSlug, postSlug } = await params;

  // const postDetail = await sanityFetch({ query: postDetailQuery });
  const postDetail = await client.fetch(POST_DETAIL_BY_SLUG, { postSlug });
  if (!postDetail) return NotFound;

  const categoryPosts = await client.fetch(POSTS_BY_CATEGORY, { categoryRef: postDetail.categoryRef });

  const topic = await client.fetch(TOPIC_BY_SLUG, { topicSlug: topicSlug });

  console.log(postDetail);
  console.log(categoryPosts);

  const findPrevNextPosts = (postSlug: string) => {
    const allPosts = categoryPosts.flatMap((category) => category.posts);

    const currentIndex = allPosts.findIndex((post) => post.slug === postSlug);

    if (currentIndex === -1) return { prev: null, next: null }; // 沒找到

    const prev = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const next = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

    return { prev, next };
  };

  const { prev: prevPost, next: nextPost } = findPrevNextPosts(postDetail.slug || "");

  const testCategoryPosts = [
    {
      title: "Test Category 1",
      posts: [
        { title: "Test Post 1", slug: "test-post-1" },
        { title: "Test Post 2", slug: "test-post-2" },
        { title: "Test Post 3", slug: "test-post-2" },
        { title: "Test Post 4", slug: "test-post-2" },
        { title: "Test Post 5", slug: "test-post-2" },
      ],
    },
    {
      title: "Test Category 2",
      posts: [
        { title: "Test Post 2", slug: "test-post-2" },
        { title: "Test Post 2", slug: "test-post-2" },
        { title: "Test Post 2", slug: "test-post-2" },
        { title: "Test Post 2", slug: "test-post-2" },
      ],
    },
    {
      title: "Test Category 3",
      posts: [
        { title: "Test Post 2", slug: "test-post-2" },
        { title: "Test Post 2", slug: "test-post-2" },
        { title: "Test Post 2", slug: "test-post-2" },
      ],
    },
  ];

  const breadcrumbItems = [
    {
      title: "home",
      links: "/",
    },
    {
      title: topic?.title || "error",
      links: `/${topicSlug}`,
    },
    // {
    //   title: postDetail?.categoryTitle || "error",
    //   links: `/${topicSlug}`,
    // },
    {
      title: postDetail?.title || "error",
      links: `/${topicSlug}/${postDetail.slug}`,
    },
  ];

  return (
    <MainLayout>
      <div className="flex">
        <div className="md:block hidden sticky top-[10vh] w-[320px] overflow-y-auto h-[90vh] py-10 px-5 bg-gray-100 dark:bg-gray-900 custom-scrollbar ">
          <nav className="p-5 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-700">
            <h2 className="text-2xl font-bold mb-4 border-b-2 text-foreground border-gray-300 dark:border-gray-700 pb-2">
              目錄
            </h2>
            <ul className="space-y-5">
              {categoryPosts.map((category) => (
                <li key={category.title}>
                  <h3 className="text-lg font-semibold text-foreground mb-2 ">{category.title}</h3>
                  <ul className="pl-4 space-y-2">
                    {category.posts.map((post) => (
                      <li key={post.title} className="group">
                        <Link href={`/${topicSlug}/${post.slug}`}>
                          {post.slug === postDetail.slug ? (
                            <p className="text-primary relative  pb-1">
                              {post.title}
                              <span className="h-[2px] bg-primary absolute right-0 bottom-0 w-full"></span>
                            </p>
                          ) : (
                            <p className="text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:dark:text-gray-200 cursor-pointer transition-colors relative pb-1">
                              {post.title}
                              <span className="absolute right-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-500 group-hover:w-full group-hover:left-0"></span>
                            </p>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className=" py-10 px-5 md:px-10 space-y-10 w-full">
          <BreadcrumbLinks items={breadcrumbItems} />
          <div className=" space-y-1">
            <h1 className="text-4xl">{postDetail.title}</h1>
            <p className="text-sm text-gray-400">{formatDate(postDetail.lastEdAt)}</p>
          </div>
          {postDetail.description && <MarkdownBlock content={postDetail.description} />}
          {postDetail.content && <MarkdownBlock content={postDetail.content} />}
          {/* next post & prev post */}
          <hr />
          <div className="flex justify-between items-center mt-10">
            {prevPost ? (
              <Link
                href={`/${topicSlug}/${prevPost.slug}`}
                className="group text-sm flex flex-col items-start text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:dark:text-gray-200 cursor-pointer transition-colors"
              >
                <p className="mb-2 flex items-center gap-1 arrow">
                  <ArrowLeft className="w-4 h-4" />
                  上一篇
                </p>
                <span>{prevPost.title}</span>
              </Link>
            ) : (
              <div />
            )}

            {nextPost ? (
              <Link
                href={`/${topicSlug}/${nextPost.slug}`}
                className="group text-sm flex flex-col items-end text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:dark:text-gray-200 cursor-pointer transition-colors"
              >
                <p className="mb-2 flex items-center gap-1 arrow">
                  下一篇
                  <ArrowRight className="w-4 h-4" />
                </p>
                <span>{nextPost.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      {/* comment */}
      <div className="h-60 bg-black">comment section</div>
    </MainLayout>
  );
}

export const revalidate = 43200; // ISR，每 12 小時重新生成一次
