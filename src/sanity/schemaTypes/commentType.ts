import { defineField, defineType } from "sanity";

export const commentType = defineType({
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    defineField({
      name: "authorName",
      title: "Author Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "commentedAt",
      title: "Commented At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "string",
      validation: (Rule) => Rule.required().max(50).error("too much word!!"),
    }),
    defineField({
      name: "post",
      title: "Post",
      type: "reference",
      to: [{ type: "post" }],
      validation: (Rule) => Rule.required(),
    }),
  ],
});
