"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/i18n/config";

/** Language is taken from the URL prefix (/en/... or /zh-tw/...); anything else falls back to Chinese. */
export default function NotFoundContent() {
  const pathname = usePathname() ?? "/";
  const first = pathname.split("/")[1] ?? "";
  const locale = isLocale(first) ? first : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md w-full text-center p-8">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <h2 className="text-2xl font-semibold mb-6">{dict.notFound.title}</h2>
        <p className="text-gray-600 mb-8">{dict.notFound.body}</p>
        <div className="flex justify-center">
          <Link href={`/${locale}/`}>
            <Button>{dict.notFound.home}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
