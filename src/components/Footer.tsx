import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { GithubIcon, InstagramIcon } from "./BrandIcons";
import Logo from "./Logo";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { paths } from "@/lib/urls";
import { siteConfig } from "@/lib/site";

export default function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <footer className=" bg-background dark:bg-background border-t dark:border-border">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-10">
          <div className="md:col-span-6 pb-3 flex flex-col justify-center items-center">
            <h2 className="text-md font-medium mb-4">{dict.footer.follow}</h2>
            <ul className="flex space-x-4 mb-4">
              <li>
                <Link
                  href={siteConfig.author.github} target="_blank" rel="noopener" aria-label="GitHub"
                  className={cn(buttonVariants({ variant: "outline", size: "icon" }), "rounded-full dark:bg-card dark:hover:bg-accent")}
                >
                  <GithubIcon className="h-5 w-5" />
                </Link>
              </li>
              <li>
                <Link
                  href={siteConfig.author.instagram} target="_blank" rel="noopener" aria-label="Instagram"
                  className={cn(buttonVariants({ variant: "outline", size: "icon" }), "rounded-full dark:bg-card dark:hover:bg-accent")}
                >
                  <InstagramIcon className="h-5 w-5" />
                </Link>
              </li>
              <li>
                <Link
                  href={`mailto:${siteConfig.author.email}`}
                  aria-label="Email"
                  className={cn(buttonVariants({ variant: "outline", size: "icon" }), "rounded-full dark:bg-card dark:hover:bg-accent")}
                >
                  <Mail className="h-5 w-5" />
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-6 text-center flex justify-center items-center">
            <Link href={paths.home(locale)} className=" flex items-center gap-2">
              <Logo name={dict.site.name} />
            </Link>
          </div>
        </div>

        <div className="border-t py-4 text-center text-sm text-gray-600 dark:text-gray-400 dark:border-border">
          © 2025-{year} {dict.site.name} | {dict.footer.rights}
        </div>
      </div>
    </footer>
  );
}
