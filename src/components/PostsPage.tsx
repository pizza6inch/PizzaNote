"use client";

import { useState } from "react";
import PostCard from "@/components/PostCard";
import { ALL_POSTS_QUERYResult } from "../../sanity.types";
import MainLayout from "@/components/MainLayout";
import PaginationComponent from "@/components/Pagination";

const POSTS_PER_PAGE = 6;

export default function PostsPage({ posts }: { posts: ALL_POSTS_QUERYResult }) {
  const [currentPage, setCurrentPage] = useState(1);

  const postCount = posts.length;

  const totalPages = Math.ceil(postCount / POSTS_PER_PAGE);

  return (
    <MainLayout>
      <div className="py-10 px-10 md:px-20 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-start">所有文章</h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {[...posts].slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE).map((post) => (
            <PostCard
              key={post._id}
              title={post.title}
              slug={post.slug}
              date={post.lastEdAt}
              category={post.category}
              description={post.description}
              tags={post.tags}
            />
          ))}
        </ul>
        <PaginationComponent currentPage={currentPage} totalPages={totalPages} setPages={setCurrentPage} />
      </div>
    </MainLayout>
  );
}
