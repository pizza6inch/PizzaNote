"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import TopDrawerMenu from "@/components/TopDrawerMenu";
import { MainNav, CustomHoverNav } from "@/components/NavMenu";
import Logo from "./Logo";
import { readClient } from "@/sanity/lib/client";
import { ALL_POSTS_QUERY } from "@/sanity/lib/queries";
import PostCard from "./PostCard"; // Assuming PostCard can be used for search results

interface Post {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: {
    title: string;
    slug: string;
    topic: {
      title: string;
      slug: string;
    };
  };
  publishedAt: string;
  tags?: Array<{ title: string; slug: string }>;
}

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    // Reset search when closing
    if (isSearchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const fetchAllPosts = async () => {
    setIsLoading(true);
    try {
      const posts = await readClient.fetch<Post[]>(ALL_POSTS_QUERY);
      setAllPosts(posts || []); // Ensure posts is an array
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setAllPosts([]); // Set to empty array on error
    }
    setIsLoading(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filteredPosts = allPosts.filter((post) => {
      const titleMatch = post.title?.toLowerCase().includes(query.toLowerCase());
      const descriptionMatch = post.description?.toLowerCase().includes(query.toLowerCase());
      return titleMatch || descriptionMatch;
    });
    setSearchResults(filteredPosts);
  };

  // Fetch posts when search is opened for the first time
  useEffect(() => {
    if (isSearchOpen && allPosts.length === 0) {
      fetchAllPosts();
    }
  }, [isSearchOpen]); // Removed allPosts from dependency array to prevent re-fetching

  const menuContent = [
    {
      title: "前端",
      links: "/front-end",
      content: [
        { links: "/front-end/Bundler", text: "打包工具" },
        {
          links: "/front-end/seo",
          text: "SEO",
        },
      ],
    },
    {
      title: "生活相關",
      links: "/life",
      content: [
        { links: "/life/", text: "暫無" },
        { links: "/life/", text: "暫無" },
      ],
    },
    {
      title: "所有文章",
      links: "/posts",
      content: [],
    },
    {
      title: "關於我",
      links: "/about",
      content: [],
    },
  ];

  return (
    <>
      <header className="navigation w-full fixed top-0 z-50 shadow-sm shadow-yellow">
        <div className="container-fluid border-bottom fixed-top bg-background dark:border-border ">
          <div className="container nav-container">
            <nav className="flex items-end justify-between py-3 px-0">
              <Link href="/" className="flex items-center space-x-4">
                <Logo />
              </Link>

              <div className="hidden md:flex space-x-4">
                {/* {menuContent.map((item, index) => (
                  <div key={index} className="relative group">
                    <Link href={item.links} className="flex items-center px-2 py-2 text-foreground hover:text-primary">
                      {item.title}
                      {item.content.length > 0 && <ChevronDown />}
                    </Link>
                    {item.content.length > 0 && (
                      <div className="absolute left-0 top-full w-64 bg-background dark:bg-card shadow-2xl rounded-lg overflow-hidden z-10 hidden group-hover:block transition-opacity duration-200">
                        <Link
                          href={item.links}
                          className="block px-4 py-4 text-sm font-bold text-foreground hover:bg-primary hover:text-primary-foreground"
                        >
                          總覽
                        </Link>
                        {item.content.map((link, idx) => (
                          <Link
                            key={idx}
                            href={link.links}
                            className="block px-4 py-4 text-sm font-bold text-foreground hover:bg-primary hover:text-primary-foreground"
                          >
                            {link.text}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))} */}
                <MainNav menuContent={menuContent} />
                {/* <CustomHoverNav /> */}

                <button
                  onClick={toggleSearch}
                  className=" text-foreground hover:text-primary"
                  aria-label="Search"
                >
                  <Search size={24} />
                </button>

                <ThemeToggle />
              </div>

              <div className="md:hidden flex items-center gap-3 md:gap-6">
                <ThemeToggle size={36} />

                <button onClick={toggleSearch} aria-label="Search" className="cursor-pointer">
                  <Search size={36} />
                </button>

                <TopDrawerMenu content={menuContent} />
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-background dark:bg-card p-6 rounded-lg w-full max-w-2xl">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">搜尋文章</h3>
              <Button variant="ghost" size="sm" onClick={toggleSearch}>
                ✕
              </Button>
            </div>
            <div className="relative">
              <input
                type="search"
                placeholder="搜尋文章"
                className="w-full p-3 border rounded-md dark:bg-card dark:border-border"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="mt-4 h-64 overflow-y-auto border-t pt-4 dark:border-border">
              {isLoading ? (
                <div className="text-center text-muted-foreground py-8">載入中...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((post) => (
                  <Link
                    key={post._id}
                    href={`/${post.category.topic.slug}/${post.category.slug}/${post.slug}`}
                    onClick={toggleSearch} // Close search bar on click
                  >
                    <div className="p-2 hover:bg-muted rounded-md cursor-pointer">
                      <h4 className="font-medium">{post.title}</h4>
                      <p className="text-sm text-muted-foreground ">
                        {post.description.substring(0, 100)}...
                      </p>
                    </div>
                  </Link>
                ))
              ) : searchQuery.trim() !== "" && !isLoading ? (
                <div className="text-center text-muted-foreground py-8">找不到相關文章</div>
              ) : (
                <div className="text-center text-muted-foreground py-8">請輸入關鍵字進行搜尋</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
