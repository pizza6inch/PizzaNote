import { MetadataRoute } from "next";
import { readClient } from "@/sanity/lib/client";
import { POST_ROUTE_QUERY, TOPIC_ROUTE_QUERY } from "@/sanity/lib/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls = ["", "about", "posts"].map((path) => {
    return {
      url: `${SITE_URL}/${path}`,
      lastModified: new Date(),
    };
  });

  const topics = (await readClient.fetch(TOPIC_ROUTE_QUERY)) || [];
  const posts = (await readClient.fetch(POST_ROUTE_QUERY)) || [];

  const topicUrls = topics.map((topic) => ({
    url: `${SITE_URL}/${topic.slug}`,
    lastModified: new Date(),
  }));

  const postUrls = posts.map((post) => ({
    url: `${SITE_URL}/${post.category?.slug}/${post.slug}`,
    lastModified: new Date(post.lastEdAt || ""),
  }));

  return [...staticUrls, ...topicUrls, ...postUrls];
}
