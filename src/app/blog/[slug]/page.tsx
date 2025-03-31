import React from "react";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import Sidebar from "@/components/Sidebar";
import { blogPosts } from "@/data/posts";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// This function generates all the static pages at build time
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((post) => post.slug === params.slug);

  // If post doesn't exist, return 404
  if (!post) {
    notFound();
  }

  return (
    <MainLayout>
      <section className="section-sm py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <article className="bg-white p-6 rounded-lg shadow-sm">
                {post.isColumnPost && (
                  <div className="bg-primary text-white text-xs py-1 px-2 rounded inline-block mb-4">
                    自媒體專欄
                  </div>
                )}

                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

                <div className="mb-6 text-gray-600 flex flex-wrap">
                  <span>By {post.author}</span>
                  <span className="mx-2">•</span>
                  <span>{post.date}</span>

                  {post.category && (
                    <>
                      <span className="mx-2">•</span>
                      <Link href={`/categories/${post.category.slug}`} className="text-primary hover:underline">
                        {post.category.name}
                      </Link>
                    </>
                  )}
                </div>

                <div className="prose max-w-none">
                  <p className="mb-4">
                    這是一個示範文章頁面，在實際應用中，這裡會顯示完整的部落格文章內容。
                  </p>

                  <h2 className="text-2xl font-bold mt-8 mb-4">什麼是 {post.title.split("？")[0]}？</h2>

                  <p className="mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
                    Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus
                    rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna
                    non est bibendum non venenatis nisl tempor.
                  </p>

                  <p className="mb-4">
                    Vestibulum id ligula porta felis euismod semper. Maecenas faucibus mollis
                    interdum. Vestibulum id ligula porta felis euismod semper. Maecenas faucibus
                    mollis interdum.
                  </p>

                  <h2 className="text-2xl font-bold mt-8 mb-4">為什麼使用 {post.title.split("？")[0]}？</h2>

                  <p className="mb-4">
                    Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque
                    penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id
                    dolor id nibh ultricies vehicula ut id elit.
                  </p>

                  <ul className="list-disc pl-6 mb-4">
                    <li className="mb-2">提高效能</li>
                    <li className="mb-2">降低成本</li>
                    <li className="mb-2">增加可靠性</li>
                    <li className="mb-2">簡化維護</li>
                  </ul>

                  <h2 className="text-2xl font-bold mt-8 mb-4">總結</h2>

                  <p className="mb-4">
                    In conclusion, {post.title.split("？")[0]} is an essential technology for modern development.
                    We've covered the basics and benefits in this article, but there's much more to explore.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <h3 className="text-xl font-semibold mb-4">分享這篇文章</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-primary hover:text-primary/80">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="#" className="text-primary hover:text-primary/80">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </a>
                    <a href="#" className="text-primary hover:text-primary/80">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                  </div>
                </div>
              </article>
            </div>

            <div className="lg:col-span-4">
              <Sidebar />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
