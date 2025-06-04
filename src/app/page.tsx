import MainLayout from "@/components/MainLayout";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";

// import { sanityFetch } from "@/sanity/lib/live";

import { readClient } from "@/sanity/lib/client";

import PingPongGame from "@/components/PingPongGame";

import { POSTS_QUERY } from "@/sanity/lib/queries";

export default async function Home() {
  const posts = await readClient.fetch(POSTS_QUERY);

  // TODO:: 測試sanity fetch、研究useCdn設定 看看要不要開兩個sanityClient

  if(!posts) {
    console.log("posts", posts);
    
  }

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
