import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SanityLive } from "@/sanity/lib/live";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "easymde/dist/easymde.min.css";

// Import Noto Sans TC for traditional Chinese
const notoSansTC = {
  variable: "--font-noto-sans-tc",
};

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "披薩筆記",
  description: "這裡是披薩的學習紀錄",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className={cn(raleway.variable, notoSansTC.variable)}>
      <ThemeProvider defaultTheme="light">
        <ClientBody>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-16">{children}</main>
            <Footer />
          </div>
          <SanityLive />
        </ClientBody>
      </ThemeProvider>
    </html>
  );
}
