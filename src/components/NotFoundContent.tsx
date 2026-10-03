"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PizzaMark from "@/components/PizzaMark";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

/** Language is taken from the URL prefix (/en/... or /zh-tw/...); anything else falls back to Chinese. */
export default function NotFoundContent() {
  const pathname = usePathname() ?? "/";
  const first = pathname.split("/")[1] ?? "";
  const locale = isLocale(first) ? first : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="field flex min-h-[80vh] items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <PizzaMark size={96} className="mx-auto" />
        <h1 className="mt-6 font-display text-[clamp(2.5rem,2rem+3vw,4.5rem)] leading-none">404</h1>
        <h2 className="mt-4 font-display text-2xl">{dict.notFound.title}</h2>
        <p className="mt-4 text-lg leading-relaxed text-[var(--crust)]/85">{dict.notFound.body}</p>
        <Link href={`/${locale}/`} className="btn-pepperoni mt-8">
          {dict.notFound.home}
        </Link>
      </div>
    </div>
  );
}
