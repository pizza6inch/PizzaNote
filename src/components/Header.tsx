"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import TopDrawerMenu from "@/components/TopDrawerMenu";

import Image from "next/image";
import Logo from "./Logo";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const menuContent = [
    {
      title: "前端",
      links: "/test-topic/test-category/1",
      content: [
        { links: "/blog/springboot/1", text: "測試選項1" },
        {
          links: "/blog/as-a-content-creator/1",
          text: "測試選項2",
        },
      ],
    },
    {
      title: "生活相關",
      links: "/blog/springboot/1",
      content: [
        { links: "/blog/as-a-content-creator/2", text: "測試選項1" },
        { links: "/blog/as-a-content-creator/3", text: "測試選項2" },
      ],
    },
    {
      title: "所有文章",
      links: "/",
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
                {menuContent.map((item, index) => (
                  <div key={index} className="relative group">
                    <Link href={item.links} className="flex items-center px-2 py-2 text-foreground hover:text-primary">
                      {item.title}
                      {item.content.length > 0 && <ChevronDown />}
                    </Link>
                    {item.content.length > 0 && (
                      <div className="absolute left-0 top-full w-64 bg-background dark:bg-card shadow-2xl rounded-lg overflow-hidden z-10 hidden group-hover:block transition-opacity duration-200">
                        <Link
                          href={item.links}
                          className="block px-4 py-4 text-sm text-foreground hover:bg-primary hover:text-primary-foreground"
                        >
                          總覽
                        </Link>
                        {item.content.map((link, idx) => (
                          <Link
                            key={idx}
                            href={link.links}
                            className="block px-4 py-4 text-sm text-foreground hover:bg-primary hover:text-primary-foreground"
                          >
                            {link.text}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <button onClick={toggleSearch} className=" text-foreground hover:text-primary">
                  <Search size={24} />
                </button>

                <ThemeToggle />
              </div>

              <div className="md:hidden flex items-center gap-3 md:gap-6">
                <ThemeToggle size={36} />

                <Search size={36} className=" cursor-pointer" onClick={toggleSearch} />

                <TopDrawerMenu content={menuContent} />
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Header */}

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
              />
            </div>
            <div className="mt-4 h-64 overflow-y-auto border-t pt-4 dark:border-border">
              {/* Search results would go here */}
              <div className="text-center text-muted-foreground py-8">請輸入關鍵字進行搜尋</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
