import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "./config";
import type { LocalePaths } from "@/lib/seo";

/** Resolves the [locale] segment, responding 404 for anything that is not a supported locale. */
export async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

/** Builds the per-locale path map for a page, only including locales where `exists` is true. */
export function localePaths(exists: (l: Locale) => boolean, pathFor: (l: Locale) => string): LocalePaths {
  const result: LocalePaths = {};
  for (const l of locales) if (exists(l)) result[l] = pathFor(l);
  return result;
}
