import React from "react";
import MainLayout from "@/components/MainLayout";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import BlogPagination from "@/components/BlogPagination";
import { blogPosts } from "@/data/posts";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// This function generates all the static pages at build time
export function generateStaticParams() {
  // Get unique category slugs
  const categorySlugs = [...new Set(
    blogPosts
      .filter(post => post.category?.slug)
      .map(post => post.category?.slug)
  )];

  return categorySlugs.map(slug => ({
    slug: slug || "",
  }));
}

export default function CategoryPage({ params }: Props) {
  // Filter posts by category
  const categoryPosts = blogPosts.filter(
    (post) => post.category?.slug === params.slug
  );

  // If no posts found for the category, return 404
  if (categoryPosts.length === 0) {
    notFound();
  }

  // Get the category name from the first post
  const categoryName = categoryPosts[0].category?.name;

  return (
    <MainLayout>
      <section className="section-sm py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center">
              {categoryName} 分類的文章
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Blog Posts */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-6">
                {categoryPosts.map((post) => (
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
            {categoryPosts.length > 6 && (
              <div className="lg:col-span-12 mt-8 flex justify-center">
                <BlogPagination
                  currentPage={1}
                  totalPages={Math.ceil(categoryPosts.length / 6)}
                  basePath={`/categories/${params.slug}/page`}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
