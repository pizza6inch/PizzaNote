"use client";

import React, { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_BY_PAGE_QUERY } from "@/sanity/lib/queries";
import PostCard from "@/components/PostCard";
const POSTS_PER_PAGE = 6;

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    async function fetchPosts() {
      const start = (currentPage - 1) * POSTS_PER_PAGE;
      const end = start + POSTS_PER_PAGE;

      // Fetch posts for current page only
      const paginatedPosts = await client.fetch(POSTS_BY_PAGE_QUERY, {
        start,
        end,
      });

      // Fetch total count of posts
      const countResult = await client.fetch(`count(*[_type == "post"])`);

      setTotalPosts(countResult);
      setPosts(paginatedPosts);
    }
    fetchPosts();
  }, [currentPage]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="py-10 px-5 md:px-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard
            key={post}
            title={post.title}
            slug={post.slug}
            date={post.lastEdAt}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
