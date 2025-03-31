import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";

// Import Noto Sans TC for traditional Chinese
const notoSansTC = {
  variable: "--font-noto-sans-tc"
};

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "古古的後端筆記",
  description: "哈囉，我是古古！這裡是我的後端技術筆記，內容涵蓋 Spring Boot、後端開發、微服務架構、系統設計、雲端服務...等等的知識分享",
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
          {children}
        </ClientBody>
      </ThemeProvider>
    </html>
  );
}
