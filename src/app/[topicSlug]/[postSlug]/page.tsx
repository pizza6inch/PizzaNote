import React from "react";
import MainLayout from "@/components/MainLayout";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import NotFound from "@/app/not-found";

import { POST_ROUTE_QUERY, POST_DETAIL_BY_SLUG, POSTS_BY_CATEGORY } from "@/sanity/lib/queries";
import { title } from "process";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await client.fetch(POST_ROUTE_QUERY);

  const postRoutes = posts.map((post) => {
    return {
      topicSlug: post.category?.topic?.slug || null,
      postSlug: post?.slug || null,
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

  console.log(postDetail);
  console.log(categoryPosts);

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

  // const categoryPosts =

  // 寫query fetch post detail

  // 寫query fetch 同個category下的post 按照subCategory分類

  return (
    <MainLayout>
      <div className=" grid grid-cols-12 ">
        <div className="md:block hidden col-span-4 overflow-y-auto h-[90vh] py-10 px-5 bg-gray-100 dark:bg-gray-900">
          <nav className="p-5 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md dark:shadow-gray-700">
            <h2 className="text-2xl font-bold mb-4 border-b-2 text-foreground border-gray-300 dark:border-gray-700 pb-2">
              目錄
            </h2>
            <ul className="space-y-5">
              {categoryPosts.map((category) => (
                <li key={category.title}>
                  <h3 className="text-xl font-semibold text-foreground mb-2 ">{category.title}</h3>
                  <ul className="pl-4 space-y-2">
                    {category.posts.map((post) => (
                      <li key={post.title} className="group">
                        <p className="text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:dark:text-gray-200 cursor-pointer transition-colors relative">
                          {post.title}
                          <span className="absolute right-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-500 group-hover:w-full group-hover:left-0"></span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className=" col-span-12 md:col-span-8 lg:col-span-6 ">Center</div>
        <div className="lg:block hidden col-span-2 ">Right </div>
      </div>
    </MainLayout>
  );
}

export const revalidate = 43200; // ISR，每 12 小時重新生成一次
