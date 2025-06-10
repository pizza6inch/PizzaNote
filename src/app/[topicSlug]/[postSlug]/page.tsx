import React from "react";
import MainLayout from "@/components/MainLayout";
import { sanityFetch } from "@/sanity/lib/live";
import { readClient, writeClient } from "@/sanity/lib/client";

import {
  POST_ROUTE_QUERY,
  POST_DETAIL_BY_SLUG,
  POSTS_BY_CATEGORY,
  TOPIC_BY_SLUG,
  CATEGORY_BY_SLUG,
  COMMENT_BY_POST_SLUG,
  VIEWS_BY_POST_SLUG,
} from "@/sanity/lib/queries";

import MarkdownBlock from "@/components/MarkdownBlock";
import BreadcrumbLinks from "@/components/BreadcrumbLinks";
import Link from "next/link";
import { title } from "process";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getGeneratedCategoryPostsContent } from "@/lib/markdownUtils";
import CommentSection from "@/components/CommentSection";
import ViewerWidget from "@/components/ViewerWidget";
import ViewerWidgetClient from "@/components/ViewerWidgetClient";
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await readClient.fetch(POST_ROUTE_QUERY);

  if (!posts) return [];

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

  return [...postRoutes, ...categoryRoutes];
}

export default async function Page({ params }: { params: Promise<{ topicSlug: string; postSlug: string }> }) {
  const { topicSlug, postSlug } = await params;
  // const postDetail = await sanityFetch({ query: postDetailQuery });
  let postDetail = await readClient.fetch(POST_DETAIL_BY_SLUG, { postSlug });
  const category = await readClient.fetch(CATEGORY_BY_SLUG, { postSlug });

  console.log("postDetail", postDetail);
  console.log("category", category);
  console.log("postSlug", postSlug);

  const { data: comments } = await sanityFetch({
    query: COMMENT_BY_POST_SLUG,
    params: { postSlug },
  });

  // if postDetail is not found, it means that the postSlug is actually a category slug
  // so we need to fetch the category detail instead

  if (!postDetail) {
    postDetail = {
      _id: "456",
      categoryRef: category?.categoryRef || null,
      categorySlug: category?.categorySlug || null,
      slug: category?.slug || null,
      title: category?.title || null,
      categoryTitle: category?.categoryTitle || null,
      description: category?.description || null,
      content: null,
      lastEdAt: category?.lastEdAt || null,
    };
  }
  let categoryPosts = await readClient.fetch(POSTS_BY_CATEGORY, {
    categoryRef: postDetail.categoryRef,
  });
  categoryPosts = [
    {
      title: "總覽",
      posts: [{ title: postDetail.categoryTitle, slug: postDetail.categorySlug }],
    },
    ...categoryPosts,
  ];

  if (category) {
    postDetail.content = getGeneratedCategoryPostsContent(categoryPosts, topicSlug);
  }

  const topic = await readClient.fetch(TOPIC_BY_SLUG, { topicSlug: topicSlug });

  // console.log(postDetail);
  // console.log(categoryPosts);

  const findPrevNextPosts = (postSlug: string) => {
    const allPosts = categoryPosts.flatMap((category) => category.posts);

    console.log(allPosts);

    const currentIndex = allPosts.findIndex((post) => post.slug === postSlug);

    if (currentIndex === -1) return { prev: null, next: null }; // 沒找到

    const prev = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const next = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

    return { prev, next };
  };

  const { prev: prevPost, next: nextPost } = findPrevNextPosts(postDetail.slug || "");

  const breadcrumbItems = [
    {
      title: "home",
      links: "/",
    },
    {
      title: topic?.title || "error",
      links: `/${topicSlug}`,
    },
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
              {categoryPosts &&
                categoryPosts.map((category) => (
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

        <div className=" py-10 px-5 md:px-10 relative space-y-10 md:w-[80%] w-[100%]">
          <div>
            <BreadcrumbLinks items={breadcrumbItems} />
            {postDetail && (
              <div className=" fixed top-15 right-5">{postDetail && <ViewerWidget postId={postDetail._id} />}</div>
            )}
          </div>
          <div className=" space-y-2">
            <h1 className="text-4xl font-bold">{postDetail.title}</h1>
            <div className="py-4">{postDetail.description && <MarkdownBlock content={postDetail.description} />}</div>
            <p className="text-sm text-gray-400">{formatDate(postDetail.lastEdAt)}</p>
          </div>
          <hr />
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
      <hr />
      {!category && <CommentSection comments={comments} postId={postDetail._id} />}
    </MainLayout>
  );
}

export const revalidate = 43200; // ISR，每 12 小時重新生成一次
