import { defineArrayMember, defineField, defineType } from "sanity";

export const tagType = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    // defineField({
    //   name: "color",
    //   type: "color",
    //   validation: (Rule) => Rule.required(),
    // }),
  ],
});
