import { legacyRedirects } from "./config/legacy-redirects.mjs";

// Static pages carry Next's inline bootstrap scripts, so scripts allow 'unsafe-inline' (no per-request nonce on a
// prerendered site). The policy still pins every other source: comments come from giscus, nothing else is external.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src https://giscus.app",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  poweredByHeader: false,
  experimental: {
    // Most readers arrive from search on a first visit: the stylesheet ships inside the HTML instead of a
    // render-blocking request (Tailwind keeps it small).
    inlineCss: true,
  },

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
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
        ],
      },
    ];
  },
};

export default nextConfig;
