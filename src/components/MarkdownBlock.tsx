import fs from "node:fs";
import path from "node:path";
import { MarkdownAsync, type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeShiki from "@shikijs/rehype";
import { imageSize } from "image-size";
import Image from "next/image";

/** Local images get intrinsic dimensions at build time, which prevents layout shift. */
function localImageSize(src: string) {
  try {
    const file = path.join(process.cwd(), "public", src.replace(/^\//, ""));
    const { width, height } = imageSize(fs.readFileSync(file));
    return width && height ? { width, height } : null;
  } catch {
    return null;
  }
}

const buildComponents = (tableLabel: string): Components => ({
  // The page title is the only <h1>; headings inside the body start at <h2>.
  h1: ({ node, ...props }) => <h2 {...props} />,
  a: ({ node, href, children, ...props }) => {
    const external = !!href && /^https?:\/\//.test(href);
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...props}>
        {children}
      </a>
    );
  },
  img: ({ node, src, alt }) => {
    const source = typeof src === "string" ? src : "";
    const size = source.startsWith("/") ? localImageSize(source) : null;
    if (size) {
      return <Image src={source} alt={alt ?? ""} width={size.width} height={size.height} sizes="(min-width: 768px) 640px, 90vw" />;
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={source} alt={alt ?? ""} loading="lazy" />;
  },
  table: ({ node, ...props }) => (
    // A focusable scroll region: wide tables scroll sideways on phones instead of widening the page.
    <div className="table-scroll" tabIndex={0} role="region" aria-label={tableLabel}>
      <table {...props} />
    </div>
  ),
});

export default async function MarkdownBlock({ content, tableLabel }: Readonly<{ content: string; tableLabel: string }>) {
  return (
    <div className="markdown-body">
      <MarkdownAsync
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeShiki, { theme: "dark-plus", fallbackLanguage: "text" }]]}
        components={buildComponents(tableLabel)}
      >
        {content}
      </MarkdownAsync>
    </div>
  );
}
