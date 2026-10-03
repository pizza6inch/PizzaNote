import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, InstagramIcon } from "./BrandIcons";
import Logo from "./Logo";
import DaysAlive from "./DaysAlive";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { paths } from "@/lib/urls";
import { daysSince, siteConfig } from "@/lib/site";

const social = "inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[var(--cheese)] transition-colors hover:bg-[var(--cheese)] hover:text-[var(--crust)]";

export default function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();
  // The client refreshes the number, so the dictionary template becomes a "{days}" placeholder.
  const aliveTemplate = dict.footer.alive(-1).replace("-1", "{days}");

  return (
    <footer>
      <div className="gingham" aria-hidden="true" />
      <div className="bg-[var(--crust)] text-[#fff4d6]">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-8 px-4 py-12 md:flex-row md:items-end md:justify-between md:px-8">
          <div className="space-y-4">
            <Link href={paths.home(locale)} className="flex items-center gap-3">
              <Logo name={dict.site.name} />
            </Link>
            <p className="max-w-md text-[#fff4d6]/80">{dict.site.tagline}</p>
            <p className="text-sm text-[var(--cheese)]">
              <DaysAlive launchDate={siteConfig.launchDate} initial={daysSince(siteConfig.launchDate)} template={aliveTemplate} />
            </p>
          </div>

          <div className="space-y-4 md:text-right">
            <h2 className="font-display text-lg text-[var(--cheese)]">{dict.footer.follow}</h2>
            <ul className="flex gap-3 md:justify-end">
              <li>
                <Link href={siteConfig.author.github} target="_blank" rel="noopener" aria-label="GitHub" className={social}>
                  <GithubIcon className="h-5 w-5" />
                </Link>
              </li>
              <li>
                <Link href={siteConfig.author.instagram} target="_blank" rel="noopener" aria-label="Instagram" className={social}>
                  <InstagramIcon className="h-5 w-5" />
                </Link>
              </li>
              <li>
                <Link href={`mailto:${siteConfig.author.email}`} aria-label="Email" className={social}>
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </Link>
              </li>
            </ul>
            <p className="text-sm text-[#fff4d6]/70" data-numeric>
              © 2025–{year} {dict.site.name} · {dict.footer.rights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
