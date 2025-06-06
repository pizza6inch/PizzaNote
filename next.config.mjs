/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // output: 'export',
  // distDir: "out",
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["source.unsplash.com", "images.unsplash.com", "ext.same-assets.com", "ugc.same-assets.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  trailingSlash: true,
};

export default nextConfig;
