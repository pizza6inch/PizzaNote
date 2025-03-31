"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <>
      <header className="navigation">
        <div className="container-fluid border-bottom fixed-top bg-background dark:border-border z-10">
          <div className="container nav-container">
            <nav className="flex items-center justify-between py-3 px-0">
              <Link href="/" className="flex items-center space-x-2">
                {/* <img
                  className="logo-thumb-sm rounded-full"
                  src=""
                  alt=""
                /> */}
                <Image
                  src="/logo.svg"
                  alt="披薩筆記"
                  width={40}
                  height={40}
                  className=""
                />
                <span className="hidden md:inline-block font-medium text-lg">披薩筆記</span>
              </Link>

              <div className="hidden md:flex space-x-4">
                <div className="relative group">
                  <button className="flex items-center px-2 py-2 text-foreground hover:text-primary">
                    後端技術專欄
                    <svg
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-background dark:bg-card shadow-md rounded-md overflow-hidden z-10 hidden group-hover:block">
                    <Link
                      href="/blog/springboot/1"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      Spring Boot 零基礎入門
                    </Link>
                  </div>
                </div>

                <div className="relative group">
                  <button className="flex items-center px-2 py-2 text-foreground hover:text-primary">
                    自媒體 &amp; 敗家專區
                    <svg
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-56 bg-background dark:bg-card shadow-md rounded-md overflow-hidden z-10 hidden group-hover:block">
                    <Link
                      href="/blog/as-a-content-creator/1"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      軟體工程師的自媒體之路
                    </Link>
                  </div>
                </div>

                <Link href="/" className="px-2 py-2 text-foreground hover:text-primary">
                  所有文章
                </Link>

                <Link href="/about" className="px-2 py-2 text-foreground hover:text-primary">
                  關於我
                </Link>

                <button
                  onClick={toggleSearch}
                  className="px-2 py-2 text-foreground hover:text-primary"
                >
                  <Search size={20} />
                </button>

                <ThemeToggle />
              </div>

              <div className="md:hidden flex items-center">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSearch}
                  className="mr-1"
                >
                  <Search size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                >
                  <Menu size={24} />
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="bg-background dark:bg-card h-screen w-[70%] p-4 absolute right-0 z-50">
            <div className="space-y-4 mt-16">
              <div className="border-b pb-2">
                <div className="text-lg font-medium mb-2">後端技術專欄</div>
                <Link
                  href="/blog/springboot/1"
                  className="block py-2 px-4 hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Spring Boot 零基礎入門
                </Link>
              </div>

              <div className="border-b pb-2">
                <div className="text-lg font-medium mb-2">自媒體 &amp; 敗家專區</div>
                <Link
                  href="/blog/as-a-content-creator/1"
                  className="block py-2 px-4 hover:bg-muted"
                  onClick={() => setIsMenuOpen(false)}
                >
                  軟體工程師的自媒體之路
                </Link>
              </div>

              <div className="border-b pb-2">
                <Link
                  href="/"
                  className="block py-2 text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  所有文章
                </Link>
              </div>

              <div className="border-b pb-2">
                <Link
                  href="/about"
                  className="block py-2 text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  關於我
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-background dark:bg-card p-6 rounded-lg w-full max-w-2xl">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">搜尋文章</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSearch}
              >
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
              <div className="text-center text-muted-foreground py-8">
                請輸入關鍵字進行搜尋
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
