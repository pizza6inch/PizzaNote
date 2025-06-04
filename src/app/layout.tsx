import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SanityLive } from "@/sanity/lib/live";

import "easymde/dist/easymde.min.css";

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
    <html lang="zh-TW">
      <ThemeProvider defaultTheme="light">
        <ClientBody>
          {children}
          <SanityLive />
        </ClientBody>
      </ThemeProvider>
    </html>
  );
}
