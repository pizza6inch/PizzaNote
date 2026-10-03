import "./globals.css";
import NotFoundContent from "@/components/NotFoundContent";

// Rendered for URLs outside any locale. It carries its own <html> because there is no root layout.
export default function RootNotFound() {
  return (
    <html lang="zh-TW">
      <head>
        <title>404 | 披薩筆記</title>
        <meta name="robots" content="noindex" />
      </head>
      <body className="antialiased">
        <NotFoundContent />
      </body>
    </html>
  );
}
