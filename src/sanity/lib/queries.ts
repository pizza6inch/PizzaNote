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

export const CATEGORIES_QUERY = defineQuery(`*[_type == "category"]
    | order(title asc)
    {
      "slug":slug.current,
      title,
      _id,
      description,
      topic->{
        "slug":slug.current
      }
    }
  `);

export const LAUNCH_DATE_QUERY = defineQuery(`*[_type == "siteInfo"][0]{
  launchDate
}`);

export const POST_ROUTE_QUERY = defineQuery(`*[_type == "post"]{
  category->{
    topic->{
      "slug":slug.current
    },
    "slug":slug.current
  },
  "slug":slug.current
}`);

export const POST_DETAIL_BY_SLUG = defineQuery(`*[_type == "post" && slug.current == $postSlug]
  {
    'categoryRef':category._ref,
    'categoryTitle':category->title,
    'categorySlug':category->slug.current,
    "slug":slug.current,
    title,
    content,
    lastEdAt,
    description
  }[0]`);

export const POSTS_BY_CATEGORY = defineQuery(`*[_type == "subCategory" && category._ref == $categoryRef]{
  title,
  "posts": *[_type == "post" && references(^._id)]{
    title,
    "slug":slug.current
  }
}`);

export const TOPIC_BY_SLUG = defineQuery(`*[_type == "topic" && slug.current == $topicSlug]{
  title,
  "slug":slug.current
}[0]`);
