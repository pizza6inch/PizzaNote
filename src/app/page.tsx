import MainLayout from "@/components/MainLayout";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";

import { defineQuery } from "next-sanity";
// import { sanityFetch } from "@/sanity/lib/live";

import { client } from "@/sanity/lib/client";

import PingPongGame from "@/components/PingPongGame";

async function fetchPosts() {
  const postsQuery = defineQuery(`*[_type == "post"]
    | order(publishedAt desc)[0...6]
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
    }`);

  const posts = await client.fetch(postsQuery);

  return posts;
}

export default async function Home() {
  const posts = await fetchPosts();

  // TODO:: 測試sanity fetch、研究useCdn設定 看看要不要開兩個sanityClient

  return (
    <MainLayout>
      <section className="py-6">
        <div className="container">
          <div className="h-[60vh]">
            <PingPongGame />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
            {/* Blog Posts */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-6">
                {posts.map((post) => (
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
            {/* <div className="lg:col-span-12 mt-8 flex justify-center">
              <BlogPagination currentPage={1} totalPages={4} />
            </div> */}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export const revalidate = 43200; // ISR，每 12 小時重新生成一次
