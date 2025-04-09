// schemas/siteInfo.ts

import { defineType } from "sanity";

export const siteInfoType = defineType({
  name: "siteInfo",
  type: "document",
  fields: [
    {
      name: "launchDate",
      title: "Launch Date",
      type: "datetime",
    },
  ],
});
