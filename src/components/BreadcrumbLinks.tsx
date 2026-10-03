import Link from "next/link";
import { ChevronRight } from "lucide-react";
import React from "react";

export interface BreadcrumbEntry {
  title: string;
  links: string;
  isHome?: boolean;
}

/** Breadcrumbs set in the field's crust ink; the last entry is the current location's parent. */
export default function BreadcrumbLinks({ items }: { items: BreadcrumbEntry[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm font-semibold">
        {items.map((item, index) => (
          <li key={item.links} className="flex items-center gap-1">
            <Link href={item.links} className="inline-flex min-h-11 items-center rounded-full px-1.5 underline-offset-4 hover:underline">
              {item.title}
            </Link>
            {index !== items.length - 1 && <ChevronRight className="h-4 w-4 opacity-60" aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
