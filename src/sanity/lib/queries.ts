import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`*[_type == "post"]
  | order(publishedAt desc)[0...6]
  {
    category->{
      title,
      "slug":slug.current,
      topic->{
        title,
        "slug":slug.current
      }
    },
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    lastEdAt,
    description,
    tags->{
      title,
      "slug":slug.current
    }
  }`);

export const POST_ROUTE_QUERY = defineQuery(`*[_type == "post"]{
  category->{
    topic->{
      "slug":slug.current
    }
  },
  "slug":slug.current
}`);

export const POST_DETAIL_BY_SLUG = defineQuery(`*[_type == "post" && slug.current == $postSlug]
  {
    'categoryRef':category._ref,
    slug,
    title,
    body,
    lastEdAt,
    description
  }[0]`);

export const POSTS_BY_CATEGORY = defineQuery(`*[_type == "subCategory" && category._ref == $categoryRef]{
  title,
  "posts": *[_type == "post" && references(^._id)]{
    title,
    slug
  }
}`);
