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

export default function BreadcrumbLinks({ items }: { items: Array<{ title: string; links: string }> }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.length > 0 &&
          items.map((item, index) => (
            <React.Fragment key={item.title}>
              <BreadcrumbItem>
                <BreadcrumbLink className=" hover:text-primary" href={item.links}>
                  {item.title === "home" ? <Pizza /> : item.title}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index !== items.length - 1 && <BreadcrumbSeparator className=" text-yellow" />}
            </React.Fragment>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
