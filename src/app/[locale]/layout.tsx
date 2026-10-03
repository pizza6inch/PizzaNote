import type { Metadata } from "next";
import "../globals.css";
import ClientBody from "@/components/ClientBody";
import { ThemeProvider } from "@/components/ThemeProvider";
import { locales, htmlLang } from "@/i18n/config";
import { resolveLocale } from "@/i18n/server";
import { SITE_URL } from "@/lib/site";

// Applies the saved (or default light) theme before first paint so dark-mode visitors never see a light flash.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme")||"light";if(t==="system"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var r=document.documentElement;r.classList.remove("light","dark");r.classList.add(t)}catch(e){}})();`;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = await resolveLocale(params);

  return (
    <html lang={htmlLang[locale]} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <ThemeProvider defaultTheme="light">
        <ClientBody>{children}</ClientBody>
      </ThemeProvider>
    </html>
  );
}
