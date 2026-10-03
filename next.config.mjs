import { legacyRedirects } from "./config/legacy-redirects.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  poweredByHeader: false,

  async redirects() {
    return [
      // The root has no content of its own; the default language is Traditional Chinese.
      // Temporary on purpose, so language detection can be added later without fighting browser caches.
      { source: "/", destination: "/zh-tw/", permanent: false },
      ...legacyRedirects(),
    ];
  },

  async rewrites() {
    return [
      // /<locale>/<topic>/<post>.md serves the plain-Markdown version of a post.
      { source: "/:locale(zh-tw|en)/:topic/:post.md", destination: "/md/:locale/:topic/:post" },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
