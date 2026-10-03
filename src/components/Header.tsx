"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "./Logo";

export interface MenuItem {
  title: string;
  href: string;
  current?: boolean;
}

export interface HeaderLabels {
  siteName: string;
  search: string;
  menu: string;
  language: string;
  theme: string;
  skip: string;
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);

  const openSearch = () => {
    setIsSearchOpen(true);
    dialogRef.current?.showModal();
  };
  const closeSearch = () => {
    dialogRef.current?.close();
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
    <ul className="flex items-center rounded-full bg-black/15 p-0.5 text-sm" aria-label={labels.language}>
      {localeLinks.map((l) => (
        <li key={l.code}>
          {l.current ? (
            <span className="block rounded-full bg-[var(--cheese)] px-2.5 py-1 font-bold text-[var(--crust)]" aria-current="true">
              {l.label}
            </span>
          ) : (
            <Link href={l.href} hrefLang={l.code} className="block rounded-full px-2.5 py-1 font-bold hover:bg-white/20">
              {l.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );

  const searchButton = (
    <button type="button" onClick={openSearch} className="masthead-link inline-flex items-center" aria-label={labels.search}>
      <Search size={22} aria-hidden="true" />
    </button>
  );

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--cheese)] focus:px-4 focus:py-2 focus:text-[var(--crust)]"
      >
        {labels.skip}
      </a>
      <header className="masthead sticky top-0 z-50">
        <nav className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-4 px-4 md:px-8">
          <Link href={homeHref} className="flex shrink-0 items-center gap-3">
            <Logo name={labels.siteName} size={38} />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <ul className="flex items-center gap-1">
              {menu.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="masthead-link" aria-current={item.current ? "page" : undefined}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <span className="mx-2 h-6 w-px bg-white/35" aria-hidden="true" />
            {searchButton}
            <ThemeToggle size={22} label={labels.theme} />
            <span className="ml-2">{languageSwitch}</span>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            {searchButton}
            <ThemeToggle size={22} label={labels.theme} />
            <details className="group relative">
              <summary
                className="masthead-link flex cursor-pointer list-none items-center [&::-webkit-details-marker]:hidden"
                aria-label={labels.menu}
              >
                <Menu size={24} aria-hidden="true" className="group-open:hidden" />
                <X size={24} aria-hidden="true" className="hidden group-open:block" />
              </summary>
              <div className="absolute right-0 top-[calc(100%+0.75rem)] w-64 rounded-xl bg-[var(--masthead)] p-3 shadow-[0_18px_30px_rgba(42,20,12,0.35)]">
                <ul className="flex flex-col gap-1">
                  {menu.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="masthead-link block"
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 border-t border-white/30 pt-3">{languageSwitch}</div>
              </div>
            </details>
          </div>
        </nav>
      </header>

      <dialog
        ref={dialogRef}
        aria-label={labels.searchTitle}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchQuery("");
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeSearch();
        }}
        className="m-auto mt-20 w-[min(42rem,calc(100vw-2rem))] rounded-2xl bg-background p-0 text-foreground shadow-[0_24px_48px_rgba(42,20,12,0.35)] backdrop:bg-[rgba(42,20,12,0.55)]"
      >
        <div className="field flex items-center justify-between gap-4 px-6 py-4">
          <h2 className="font-display text-2xl">{labels.searchTitle}</h2>
          <button type="button" onClick={closeSearch} aria-label={labels.close} className="rounded-full p-2 hover:bg-black/10">
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <div className="p-6">
          <input
            type="search"
            autoFocus
            placeholder={labels.searchPlaceholder}
            aria-label={labels.searchPlaceholder}
            className="w-full rounded-xl border-2 border-[hsl(var(--foreground)/0.25)] bg-background px-4 py-3 text-lg outline-none focus:border-[var(--pepperoni)] dark:focus:border-[var(--cheese)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="mt-4 max-h-80 overflow-y-auto" aria-live="polite">
            {isLoading ? (
              <p className="py-8 text-center text-muted-foreground">{labels.searchLoading}</p>
            ) : results.length > 0 ? (
              <ul>
                {results.map((post) => (
                  <li key={post.href}>
                    <Link
                      href={post.href}
                      onClick={closeSearch}
                      className="block rounded-xl px-3 py-3 hover:bg-[var(--cheese-soft)]"
                    >
                      <span className="block font-display text-lg">{post.title}</span>
                      <span className="mt-1 block text-sm text-muted-foreground line-clamp-2">{post.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-center text-muted-foreground">{query !== "" ? labels.searchEmpty : labels.searchHint}</p>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
