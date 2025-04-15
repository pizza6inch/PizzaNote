import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const subCategoryType = defineType({
  name: "subCategory",
  title: "SubCategory",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
  ],
});
