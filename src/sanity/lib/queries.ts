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

export const ALL_POSTS_QUERY = defineQuery(`*[_type == "post"]
  | order(publishedAt desc) {
    "slug": slug.current,
    _id,
    title,
    description,
    publishedAt,
    lastEdAt,
    tags->{
      title,
      "slug":slug.current
    },
    category->{
      title,
      "slug":slug.current,
      topic->{
        title,
        "slug":slug.current
      }
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

export const TOPIC_ROUTE_QUERY = defineQuery(`*[_type == "topic"]{
  "slug":slug.current,
}`);

export const CATEGORY_BY_SLUG = defineQuery(
  `*[_type == "category" && slug.current == $postSlug]{
    "categoryRef":_id,
    "categorySlug":slug.current,
    "slug":slug.current,
    title,
    "categoryTitle":title,
    description,
    lastEdAt,
}[0]`
);

export const POST_DETAIL_BY_SLUG =
  defineQuery(`*[_type == "post" && slug.current == $postSlug]
  {
    _id,
    'categoryRef':category._ref,
    'categoryTitle':category->title,
    'categorySlug':category->slug.current,
    "slug":slug.current,
    title,
    content,
    description,
    lastEdAt,
  }[0]`);

export const POSTS_BY_CATEGORY =
  defineQuery(`*[_type == "subCategory" && category._ref == $categoryRef]{
  title,
  "posts": *[_type == "post" && references(^._id)]{
    title,
    "slug":slug.current
  }
}`);

export const CATEGORY_BY_TOPIC_SLUG = defineQuery(
  `*[_type == "category" && topic->slug.current == $topicSlug]{
  title,
  "slug":slug.current,
  description,
  lastEdAt,

  "topicRef":topic._ref,
  "topicSlug":topic->slug.current,
  "topicTitle":topic->title,
  "posts": *[_type == "post" && references(^._id)]{
    title,
    "slug":slug.current,
    publishedAt,
    lastEdAt,
    description,
    tags->{
      title,
      "slug":slug.current
    }
  }
}[0...6]`
);

export const TOPIC_BY_SLUG =
  defineQuery(`*[_type == "topic" && slug.current == $topicSlug]{
  title,
  "slug":slug.current
}[0]`);

export const TOPIC_PAGE_CONTENT_BY_TOPIC_SLUG = defineQuery(
  `*[_type == "topic" && slug.current == $topicSlug]{
    title,
    "slug":slug.current,
    description,
    "categories": *[_type == "category" && references(^._id)]{
      title,
      "slug":slug.current,
      description,
    }
  }[0]`
);

export const COMMENT_BY_POST_SLUG = defineQuery(
  `*[_type == "comment" && post->slug.current == $postSlug]
  | order(commentedAt desc)
  {
    _id,
    authorName,
    content,
    commentedAt,
    post->{title, slug}
  }`
);
