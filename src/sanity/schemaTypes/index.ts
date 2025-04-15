import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";

import { topicType } from "./topicType";
import { tagType } from "./tagType";
import { siteInfoType } from "./siteInfoType";
import { subCategoryType } from "./subCategoryType";
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, topicType, tagType, siteInfoType, subCategoryType],
};
