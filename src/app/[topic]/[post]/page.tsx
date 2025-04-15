import React from "react";
import MainLayout from "@/components/MainLayout";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";
// This function generates all the static pages at build time

export const dynamicParams = false;

export async function generateStaticParams() {
  const postRoutesQuery = defineQuery(`*[_type == "post"]{
    category->{
      topic->{
        "slug":slug.current
      }
    },
    "slug":slug.current
  }`);

  const posts = await client.fetch(postRoutesQuery);

  const postRoutes = posts.map((post) => {
    return {
      topic: post.category?.topic?.slug || null,
      post: post?.slug || null,
    };
  });

  return postRoutes;
}

export default async function Page({ params }: { params: Promise<{ topic: string; post: string }> }) {
  const { topic, post } = await params;
  return (
    <MainLayout>
      <div className=" grid grid-cols-12">
        <div className="md:block hidden col-span-3 ">
          <nav>
            <ul>
              <li>
                <h2>目錄</h2>
                <ul>
                  <h2></h2>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
        <div className=" col-span-12 md:col-span-9 lg:col-span-6 ">Center</div>
        <div className="lg:block hidden col-span-3 ">Right </div>
      </div>
    </MainLayout>
  );
}
