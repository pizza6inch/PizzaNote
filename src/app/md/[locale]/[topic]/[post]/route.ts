import { getAllPostParams, getPost } from "@/lib/content";
import { resolveLocale } from "@/i18n/server";
import { absoluteUrl } from "@/lib/site";
import { paths } from "@/lib/urls";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostParams();
}

/**
 * Plain-Markdown version of a post, served at /<locale>/<topic>/<post>.md (rewritten in next.config).
 * Intended for LLMs and readers; the HTML page stays canonical, so search engines are told not to index this copy.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; topic: string; post: string }> },
) {
  const locale = await resolveLocale(params);
  const { topic, post: slug } = await params;
  const post = getPost(locale, topic, slug);
  if (!post) return new Response("Not found", { status: 404 });

  const canonical = absoluteUrl(paths.post(locale, topic, slug));
  const text = `# ${post.title}

> ${post.description}

- URL: ${canonical}
- Published: ${post.publishedAt.slice(0, 10)}
- Updated: ${post.updatedAt.slice(0, 10)}

${post.body}
`;

  return new Response(text, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex, follow",
      Link: `<${canonical}>; rel="canonical"`,
    },
  });
}
