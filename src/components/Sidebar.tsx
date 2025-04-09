import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

import PizzaPlayground from "./PizzaPlayground";
import Avatar from "./Avatar";

import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

const categoriesQuery = defineQuery(`*[_type == "category"]
  | order(title asc)
  {
    "slug":slug.current,
    title,
    _id,
    description,
    topic->{
      "slug":slug.current
    }
  }
  `);
const launchDateQuery = defineQuery(`*[_type == "siteInfo"][0]{
  launchDate
}`);

export default async function Sidebar() {
  // TODO:: 測試sanity fetch、研究useCdn設定 看看要不要開兩個sanityClient

  const { data: categories } = await sanityFetch({ query: categoriesQuery });
  const { data: siteInfo } = await sanityFetch({ query: launchDateQuery });
  const diffDays = Math.abs(new Date().getTime() - new Date(siteInfo.launchDate).getTime()) / (1000 * 60 * 60 * 24);
  const daysSinceLaunch = Math.round(diffDays);
  return (
    <div>
      <div className="mb-8">
        <h4 className="widget-title">關於我</h4>
        {/* <p className="mb-2 font-bold">3.1 K Followers</p> */}
        {/* <Image src={"/avatar.png"} width={150} height={150} alt="avatar" className="mx-auto my-4 rounded-full" /> */}
        <Avatar />
        <p className="mb-4 dark:text-gray-300">
          我是
          Ewan（Pizza），北科資工大四生，目前在易遊網實習。這個部落格紀錄的不只是技術，更是成長的足跡。我想把學習中的困惑與突破、實作中的靈感與反思，真實分享給正在努力的你。希望這裡的內容能陪你一起前進，一起成長，為未來點亮更多可能！
        </p>
        <Link href="/about">
          <Button variant="outline" className="w-full sm:w-auto dark:bg-card dark:hover:bg-accent">
            了解更多
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h4 className="widget-title">披薩心臟！</h4>
        <PizzaPlayground />
        <p className="mt-8">本站已存活:{daysSinceLaunch}天!</p>
      </div>
      <div className="mb-8">
        <h4 className="widget-title">文章分類</h4>
        <ul className="list-none space-y-2">
          {categories.map((category, index) => (
            <li key={index}>
              <Link
                href={`/${category?.topic?.slug}/${category.slug}`}
                className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary"
              >
                {category.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="widget-title">追蹤</h4>
        <ul className="flex space-x-4">
          <li>
            <Link
              href="https://github.com/pizza6inch"
              target="_blank"
              rel="noopener"
              className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-github"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </Link>
          </li>

          <li>
            <Link
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener"
              className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-instagram"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
