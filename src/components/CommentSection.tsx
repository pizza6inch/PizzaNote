"use client";

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

  if (!repoId || !categoryId) return null;

  return (
    <section aria-labelledby="comments-heading" className="container py-10">
      <h2 id="comments-heading" className="text-2xl font-bold mb-6">
        {heading}
      </h2>
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
    </section>
  );
}
