import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"}/sitemap.xml`,
  };
}
