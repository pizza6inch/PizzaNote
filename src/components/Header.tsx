"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import TopDrawerMenu from "@/components/TopDrawerMenu";
import { MainNav } from "@/components/NavMenu";
import Logo from "./Logo";
import { motion, AnimatePresence } from "framer-motion";

export interface MenuItem {
  title: string;
  links: string;
  content: { links: string; text: string }[];
}

export interface HeaderLabels {
  siteName: string;
  overview: string;
  search: string;
  menu: string;
  language: string;
  theme: string;
  searchTitle: string;
  searchPlaceholder: string;
  searchLoading: string;
  searchEmpty: string;
  searchHint: string;
  close: string;
}

export interface LocaleLink {
  code: string;
  label: string;
  href: string;
  current: boolean;
}

interface SearchEntry {
  title: string;
  description: string;
  href: string;
}

interface HeaderProps {
  homeHref: string;
  searchIndexUrl: string;
  menu: MenuItem[];
  labels: HeaderLabels;
  localeLinks: LocaleLink[];
}

export default function Header({ homeHref, searchIndexUrl, menu, labels, localeLinks }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);

  const toggleSearch = () => {
    setIsSearchOpen((open) => !open);
    setSearchQuery("");
  };

  // The index is a small static JSON file; it is only fetched the first time search opens.
  const isLoading = isSearchOpen && entries === null;
  useEffect(() => {
    if (!isSearchOpen || entries !== null) return;
    let cancelled = false;
    fetch(searchIndexUrl)
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => [])
      .then((data: SearchEntry[]) => {
        if (!cancelled) setEntries(data);
      });
    return () => {
      cancelled = true;
    };
  }, [isSearchOpen, entries, searchIndexUrl]);

  const query = searchQuery.trim().toLowerCase();
  const results =
    query === ""
      ? []
      : (entries ?? []).filter(
          (e) => e.title.toLowerCase().includes(query) || e.description.toLowerCase().includes(query),
        );

  const languageSwitch = (
    <ul className="flex items-center gap-1 text-sm" aria-label={labels.language}>
      {localeLinks.map((l) => (
        <li key={l.code}>
          {l.current ? (
            <span className="px-2 py-1 font-bold text-primary" aria-current="true">
              {l.label}
            </span>
          ) : (
            <Link href={l.href} hrefLang={l.code} className="px-2 py-1 hover:text-primary">
              {l.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <header className="navigation w-full fixed top-0 z-50 shadow-sm shadow-yellow">
        <div className="container-fluid border-bottom fixed-top bg-background dark:border-border ">
          <div className="container nav-container">
            <nav className="flex items-end justify-between py-3 px-0">
              <Link href={homeHref} className="flex items-center space-x-4">
                <Logo name={labels.siteName} />
              </Link>

              <div className="hidden md:flex space-x-3 items-center">
                <MainNav menuContent={menu} overviewLabel={labels.overview} />

                <button
                  onClick={toggleSearch}
                  className=" text-foreground hover:bg-primary rounded-lg p-2"
                  aria-label={labels.search}
                >
                  <Search size={24} />
                </button>

                <ThemeToggle size={24} label={labels.theme} />
                {languageSwitch}
              </div>

              <div className="md:hidden flex items-center gap-3 md:gap-6">
                {languageSwitch}
                <ThemeToggle size={24} label={labels.theme} />

                <button onClick={toggleSearch} aria-label={labels.search} className="cursor-pointer">
                  <Search size={24} />
                </button>

                <TopDrawerMenu content={menu} title={labels.menu} siteName={labels.siteName} />
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* 背景遮罩淡入淡出 */}
            <motion.div
              className="fixed inset-0 z-40 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={toggleSearch}
            />

            {/* 搜尋內容彈出動畫 */}
            <motion.div
              className="fixed inset-0 z-50 flex items-start justify-center pt-20 pointer-events-none"
              initial={{ scale: 0.8, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div
                role="dialog"
                aria-label={labels.searchTitle}
                className="bg-background dark:bg-card p-6 rounded-lg w-full max-w-2xl pointer-events-auto"
              >
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-lg font-medium">{labels.searchTitle}</h2>
                  <Button variant="ghost" size="icon" onClick={toggleSearch} aria-label={labels.close}>
                    ✕
                  </Button>
                </div>

                <div className="relative">
                  <input
                    type="search"
                    autoFocus
                    placeholder={labels.searchPlaceholder}
                    aria-label={labels.searchPlaceholder}
                    className="w-full p-3 border rounded-md dark:bg-card dark:border-border"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="mt-4 h-64 overflow-y-auto border-t pt-4 dark:border-border">
                  {isLoading ? (
                    <div className="text-center text-muted-foreground py-8">{labels.searchLoading}</div>
                  ) : results.length > 0 ? (
                    results.map((post) => (
                      <Link key={post.href} href={post.href} onClick={toggleSearch}>
                        <div className="p-2 hover:bg-muted rounded-md cursor-pointer">
                          <h3 className="font-medium">{post.title}</h3>
                          <p className="text-sm text-muted-foreground">{post.description.substring(0, 100)}...</p>
                        </div>
                      </Link>
                    ))
                  ) : query !== "" ? (
                    <div className="text-center text-muted-foreground py-8">{labels.searchEmpty}</div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">{labels.searchHint}</div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
