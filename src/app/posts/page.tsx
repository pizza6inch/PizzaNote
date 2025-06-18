import React from "react";
import { readClient } from "@/sanity/lib/client";
import { ALL_POSTS_QUERY } from "@/sanity/lib/queries";
import PostsPage from "@/components/PostsPage";

export const dynamicParams = false;

export const metadata = {
  title: "披薩筆記 - 文章列表",
  description: "披薩筆記中所有文章的列表，涵蓋多種主題與分類，助你持續學習與成長。",
};

export default async function PostsPageWrapper() {
  const posts = await readClient.fetch(ALL_POSTS_QUERY);

  console.log("posts", posts);

  return <PostsPage posts={posts} />;
}

export const revalidate = 43200; // ISR，每 12 小時重新生成一次
