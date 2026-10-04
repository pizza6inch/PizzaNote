"use client";

import { useEffect, useRef, useState } from "react";
import Giscus from "@giscus/react";
import { useTheme } from "@/components/ThemeProvider";

interface CommentSectionProps {
  heading: string;
  /** Same term for every language of a post, so zh-TW and en share one discussion thread. */
  term: string;
  lang: string;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

/** Comments live in GitHub Discussions (giscus). Nothing is rendered until the repo/category IDs are configured. */
export default function CommentSection({ heading, term, lang, repo, repoId, category, categoryId }: CommentSectionProps) {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  // The giscus iframe is only mounted when the reader nears the comments: it keeps the article load light and
  // lets the browser keep the page in its back/forward cache for readers who never scroll that far.
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || near) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setNear(true);
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [near]);

  if (!repoId || !categoryId) return null;

  return (
    <section ref={sectionRef} aria-labelledby="comments-heading" className="mx-auto max-w-[90rem] border-t-2 border-dashed border-[hsl(var(--border))] px-4 py-14 md:px-8">
      <h2 id="comments-heading" className="mb-8 font-display text-3xl">
        {heading}
      </h2>
      {near && (
        <Giscus
          repo={repo as `${string}/${string}`}
          repoId={repoId}
          category={category}
          categoryId={categoryId}
          mapping="specific"
          term={term}
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={theme === "dark" ? "dark" : "light"}
          lang={lang}
          loading="lazy"
        />
      )}
    </section>
  );
}
