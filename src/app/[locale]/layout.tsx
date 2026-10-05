import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono, Noto_Sans } from "next/font/google";
import "../globals.css";
import ClientBody from "@/components/ClientBody";
import { ThemeProvider } from "@/components/ThemeProvider";
import { locales, htmlLang } from "@/i18n/config";
import { resolveLocale } from "@/i18n/server";
import { SITE_URL } from "@/lib/site";

// Display face: a ~75 KB subset of Huninn holding only the characters headings use (scripts/build-display-font.mjs).
// Body text uses the visitor's own CJK system font, so no large webfont blocks the first paint.
const display = localFont({ src: "../../fonts/huninn-subset.woff2", display: "swap", variable: "--font-huninn" });
// Latin-only body face (~30 KB); Chinese characters fall through to the visitor's system CJK font.
const latin = Noto_Sans({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-latin" });
const code = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-jetbrains" });

// Applies the saved (or default dark) theme before first paint so visitors never see a flash of the other theme.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme")||"dark";if(t==="system"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var r=document.documentElement;r.classList.remove("light","dark");r.classList.add(t)}catch(e){}})();`;

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
    <html lang={htmlLang[locale]} className={`dark ${display.variable} ${latin.variable} ${code.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <ThemeProvider defaultTheme="dark">
        <ClientBody>{children}</ClientBody>
      </ThemeProvider>
    </html>
  );
}
