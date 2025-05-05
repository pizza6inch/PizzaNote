import React from "react";
import { client } from "@/sanity/lib/client";
import { ALL_POSTS_QUERY } from "@/sanity/lib/queries";
import PostsPage from "@/components/PostsPage";

export const dynamicParams = false;

export default async function PostsPageWrapper() {
  const posts = await client.fetch(ALL_POSTS_QUERY);

  console.log("posts", posts);
  

  return <PostsPage posts={posts} />;
}



export const revalidate = 43200; // ISR，每 12 小時重新生成一次