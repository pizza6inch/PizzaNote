import React from "react";
import MainLayout from "@/components/MainLayout";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import BlogPagination from "@/components/BlogPagination";
import { blogPosts } from "@/data/posts";
import { notFound } from "next/navigation";

type Props = {
  params: { page: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// This function generates all the static pages at build time
export function generateStaticParams() {
  const postsPerPage = 6;
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  // Generate an array of objects with page params
  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }));
}

export default function PaginatedBlogPage({ params }: Props) {
  const pageNumber = parseInt(params.page, 10);

  // Check if page number is valid
  if (isNaN(pageNumber) || pageNumber < 1) {
    notFound();
  }

  const postsPerPage = 6;
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  // If requested page exceeds available pages, return 404
  if (pageNumber > totalPages) {
    notFound();
  }

  // Calculate the posts for the current page
  const startIndex = (pageNumber - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPagePosts = blogPosts.slice(startIndex, endIndex);

  return (
    <MainLayout>
      <section className="section-sm py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Blog Posts */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-6">
                {currentPagePosts.map((post) => (
                  <PostCard
                    key={post.id}
                    title={post.title}
                    slug={post.slug}
                    author={post.author}
                    date={post.date}
                    category={post.category}
                    description={post.description}
                    isColumnPost={post.isColumnPost}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <Sidebar />
            </div>

            {/* Pagination */}
            <div className="lg:col-span-12 mt-8 flex justify-center">
              <BlogPagination
                currentPage={pageNumber}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
