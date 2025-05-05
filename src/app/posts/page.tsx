import React from "react";
import { client } from "@/sanity/lib/client";
import { ALL_POSTS_QUERY } from "@/sanity/lib/queries";
import PostsPage from "@/components/PostsPage";

export default async function PostsPageWrapper() {
  const posts = await client.fetch(ALL_POSTS_QUERY);
  return <PostsPage posts={posts} />;
}
