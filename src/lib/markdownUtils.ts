export interface Post {
  title: string | null;
  slug: string | null;
}

export interface Category {
  title: string | null;
  posts: Post[];
}

export const getGeneratedCategoryPostsContent = (
  categoryPosts: Category[],
  topicSlug: string
): string => {
  if (!categoryPosts || categoryPosts.length === 0) {
    return "";
  }

  let markdownContent = "";

  categoryPosts.forEach((category) => {
    const categoryTitle = category.title ?? "";
    markdownContent += `## ${categoryTitle}\n\n`;
    if (category.posts && category.posts.length > 0) {
      markdownContent += category.posts
        .filter((post) => post.title && post.slug)
        .map((post) => `- [${post.title}](/${topicSlug}/${post.slug})`)
        .join("\n");
      markdownContent += "\n\n";
    }
  });

  return markdownContent.trim();
};
