import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllPostParams, getCategory, getPost } from "@/lib/content";
import { ogCard } from "@/lib/og";
import { siteConfig } from "@/lib/site";

// One share card per post, rendered at build time.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostParams();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; topic: string; post: string }> },
) {
  const { locale, topic, post: slug } = await params;
  const post = getPost(locale as Locale, topic, slug);
  if (!post) notFound();
  const dict = getDictionary(locale as Locale);
  return ogCard({
    brand: dict.site.name,
    eyebrow: getCategory(locale as Locale, post.category)?.title,
    title: post.title,
    footer: `pizzanote.dev  |  ${siteConfig.author.name}`,
  });
}
