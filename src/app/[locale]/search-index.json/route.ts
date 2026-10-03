import { NextResponse } from "next/server";
import { locales } from "@/i18n/config";
import { resolveLocale } from "@/i18n/server";
import { getPosts } from "@/lib/content";
import { paths } from "@/lib/urls";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** Small static index (title, description, link) that the header search fetches on first use. */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const locale = await resolveLocale(params);
  const entries = getPosts(locale).map((p) => ({
    title: p.title,
    description: p.description,
    href: paths.post(locale, p.topic, p.slug),
  }));
  return NextResponse.json(entries);
}
