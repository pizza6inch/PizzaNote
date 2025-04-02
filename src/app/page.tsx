import MainLayout from "@/components/MainLayout";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import BlogPagination from "@/components/BlogPagination";
import { blogPosts } from "@/data/posts";

export default function Home() {
  // For the home page, we'll show the first 6 posts
  const posts = blogPosts.slice(0, 6);
  const totalPages = Math.ceil(blogPosts.length / 6);

  // TODO:: 測試sanity fetch、研究useCdn設定 看看要不要開兩個sanityClient

  return (
    <MainLayout>
      <section className="section-sm py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Blog Posts */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    title={post.title}
                    slug={post.slug}
                    author={"披薩本薩"}
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
              <BlogPagination currentPage={1} totalPages={totalPages} />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
