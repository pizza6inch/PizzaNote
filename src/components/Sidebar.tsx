import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Sidebar() {
  // TODO::文章分類去sanity 抓category
  return (
    <div>
      <div className="mb-8">
        <h4 className="widget-title">關於我</h4>
        <p className="mb-2 font-bold">3.1 K Followers</p>
        <p className="mb-4 dark:text-gray-300">
          我是 Ewan（Pizza），就讀於北科資工大四，目前在易遊網擔任實習軟體工程師。
          這個部落格不只是紀錄技術的地方，更是我成長軌跡的延伸。
          我希望透過每一篇分享，把學習中的困惑與突破、實作中的反思與靈感，真實地傳遞給正在努力成長的你。
          無論你是剛踏上工程師這條路，還是在追夢途中迷了路，希望這裡的內容能成為你的助力，一起學習、一起前進，為未來點亮更多可能！
        </p>
        <Link href="/about">
          <Button variant="outline" className="w-full sm:w-auto dark:bg-card dark:hover:bg-accent">
            了解更多
          </Button>
        </Link>
      </div>

      {/* <div className="mb-8">
        <h4 className="widget-title">訂閱電子報</h4>
        <div className="px-0 sm:px-3">
          <p className="mb-4 dark:text-gray-300">免費訂閱電子報，每週二學習後端技術🚀</p>
          <div className="newsletter">
            <form className="space-y-4">
              <Input type="email" placeholder="輸入你的 Email" className="w-full dark:bg-card" required />
              <Button type="submit" className="w-full">
                訂閱
              </Button>
            </form>
          </div>
        </div>
      </div> */}
      <div className="mb-8"></div>

      <div className="mb-8">
        <h4 className="widget-title">文章分類</h4>
        <ul className="list-none space-y-2">
          <li>
            <Link
              href="/categories/elastic-search"
              className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary"
            >
              Elastic Search
            </Link>
          </li>
          <li>
            <Link
              href="/categories/intellij"
              className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary"
            >
              Intellij
            </Link>
          </li>
          <li>
            <Link
              href="/categories/java"
              className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary"
            >
              Java
            </Link>
          </li>
          <li>
            <Link
              href="/categories/life"
              className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary"
            >
              Life
            </Link>
          </li>
          <li>
            <Link
              href="/categories/linux"
              className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary"
            >
              Linux
            </Link>
          </li>
          <li>
            <Link
              href="/categories/spring-boot"
              className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary"
            >
              Spring Boot
            </Link>
          </li>
          <li>
            <Link
              href="/categories/其他技術分享"
              className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary"
            >
              其他技術分享
            </Link>
          </li>
          <li>
            <Link
              href="/categories/職涯相關"
              className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary"
            >
              職涯相關
            </Link>
          </li>
          <li>
            <Link
              href="/categories/自媒體經營"
              className="hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-primary"
            >
              自媒體經營
            </Link>
          </li>
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
              href="https://www.facebook.com"
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
                className="lucide lucide-facebook"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
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
