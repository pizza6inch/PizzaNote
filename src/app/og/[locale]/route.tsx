import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { ogCard } from "@/lib/og";

// The site's default share card, one per locale, rendered at build time.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);
  return ogCard({ brand: dict.site.name, title: dict.site.tagline, footer: "pizzanote.dev" });
}
