import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Pizza } from "lucide-react";
import React from "react";

export interface BreadcrumbEntry {
  title: string;
  links: string;
  isHome?: boolean;
}

export default function BreadcrumbLinks({ items }: { items: BreadcrumbEntry[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={item.links}>
            <BreadcrumbItem>
              <BreadcrumbLink className=" hover:text-primary" href={item.links} aria-label={item.isHome ? item.title : undefined}>
                {item.isHome ? <Pizza aria-hidden="true" /> : item.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index !== items.length - 1 && <BreadcrumbSeparator className=" text-yellow" />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
