import MainLayout from "@/components/MainLayout";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import BlogPagination from "@/components/BlogPagination";
import { blogPosts } from "@/data/posts";

import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

import { Post } from "../../sanity.types";

import {
  // postsQuery,
  topicsQuery,
  categoriesByTopicQuery,
  postsByCategoryQuery,
  // categoriesBySlugQuery,
  postDetailBySlugQuery,
} from "@/sanity/queries";

export default async function Home() {
  const postsQuery = defineQuery(`*[_type == "post"]
    | order(publishedAt desc)
    {
      category->{
        title,
        "slug":slug.current,
        topic->{
          title,
          "slug":slug.current
        }
      },
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        lastEdAt,
        description,
        tags->{
          title,
          "slug":slug.current
        }
    }
    `);

  // TODO:: 測試sanity fetch、研究useCdn設定 看看要不要開兩個sanityClient

  const { data: testPosts } = await sanityFetch({ query: postsQuery });

  // console.log(testPosts);

  // const { data: testTopics } = await sanityFetch({ query: topicsQuery });
  // console.log(testTopics);

  // const { data: testCategoriesByTopic } = await sanityFetch({ query: categoriesByTopicQuery("test-topic") });
  // console.log(testCategoriesByTopic);

  // const { data: testPostsByCategory } = await sanityFetch({ query: postsByCategoryQuery("testcategory") });
  // console.log(testPostsByCategory);

  // const { data: testPostDetailBySlugQuery } = await sanityFetch({ query: postDetailBySlugQuery("test-post") });
  // console.log(testPostDetailBySlugQuery);

  return (
    <MainLayout>
      <section className="section-sm py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Blog Posts */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-6">
                {testPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    title={post.title}
                    slug={post.slug}
                    date={post.publishedAt}
                    category={post.category}
                    description={post.description}
                    tags={post.tags}
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
              <BlogPagination currentPage={1} totalPages={4} />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
