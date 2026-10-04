// 格式化為 yyyy/mm/dd
export const formatDate = (date: string): string => {
  const d = new Date(date);
  return `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCDate()).padStart(2, "0")}`;
};

/**
 * Shortens text for a meta description without cutting a word in half: it ends at the last full sentence that fits,
 * or else at the last word boundary (or character, for CJK) with an ellipsis.
 */
export const summarize = (text: string, max = 155): string => {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const sentenceEnd = Math.max(cut.lastIndexOf("。"), cut.lastIndexOf("！"), cut.lastIndexOf("？"), cut.lastIndexOf(". "));
  if (sentenceEnd >= max * 0.5) return cut.slice(0, sentenceEnd + 1).trim();
  const space = cut.lastIndexOf(" ");
  const body = space >= max * 0.6 ? cut.slice(0, space) : cut.slice(0, max - 1);
  return `${body.replace(/[，、,;:：\s]+$/, "")}…`;
};
