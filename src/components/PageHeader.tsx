import React from "react";
import CjkText from "./CjkText";
import BreadcrumbLinks, { type BreadcrumbEntry } from "./BreadcrumbLinks";

interface PageHeaderProps {
  title: string;
  description?: string;
  crumbs?: BreadcrumbEntry[];
  children?: React.ReactNode;
}

/** The yellow field that opens every listing page: breadcrumbs, the page's single H1, an optional lead. */
export default function PageHeader({ title, description, crumbs, children }: PageHeaderProps) {
  return (
    <header className="field">
      <div className="mx-auto max-w-[90rem] px-4 pb-12 pt-8 md:px-8 md:pb-16 md:pt-10">
        {crumbs && crumbs.length > 0 && <BreadcrumbLinks items={crumbs} />}
        <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.25rem,1.6rem+3vw,4.5rem)] leading-[1.1]">
          <CjkText>{title}</CjkText>
        </h1>
        {description && (
          <p className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-[var(--crust)]/85">{description}</p>
        )}
        {children}
      </div>
    </header>
  );
}
