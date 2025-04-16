import React from "react";
import MainLayout from "@/components/MainLayout";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import NotFound from "@/app/not-found";

import { POST_ROUTE_QUERY, POST_DETAIL_BY_SLUG, POSTS_BY_CATEGORY } from "@/sanity/lib/queries";

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

  // const categoryPosts =

  // 寫query fetch post detail

  // 寫query fetch 同個category下的post 按照subCategory分類

  return (
    <MainLayout>
      <div className=" grid grid-cols-12">
        <div className="md:block hidden col-span-3 ">
          <nav>
            <ul>
              <li>
                <h2>目錄</h2>
                <ul>
                  <h2></h2>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
        <div className=" col-span-12 md:col-span-9 lg:col-span-6 ">Center</div>
        <div className="lg:block hidden col-span-3 ">Right </div>
      </div>
    </MainLayout>
  );
}

export const revalidate = 43200; // ISR，每 12 小時重新生成一次
