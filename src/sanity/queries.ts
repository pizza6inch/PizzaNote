import { defineQuery } from "next-sanity";

export const postsQuery = defineQuery(`*[_type == "post"]
| order(publishedAt desc)
{
  category->{
    title,
    topic->{
      title
    }
  },
    title,
    "slug": slug.current,
    publishedAt,
    lastEdAt
}
`);

export const topicsQuery = defineQuery(`*[_type == "topic"]
| order(title asc)
{
  "slug": slug.current,
  title,
    _id,
    description
}
`);

export const categoriesByTopicQuery = (topicSlug: string) =>
  defineQuery(`*[_type == "category" && topic->slug.current == "${topicSlug}"]
| order(title asc)
{
  "slug":slug.current,
  title,
    _id,
    description
}
`);

export const postsByCategoryQuery = (categorySlug: string) =>
  defineQuery(`*[_type == "post" && category->slug.current == "${categorySlug}"]
| order(publishedAt desc)
{
    "slug": slug.current,
    title,
    _id,
}
`);

// export const categoriesBySlugQuery = (slug: string) =>
//   defineQuery(`*[_type == "category" && slug.current == "${slug}"]
// | order(title asc)
// {
//   "slug":slug.current,
//   title,
//   _id,
// }
// `);

export const postDetailBySlugQuery = (slug: string) =>
  defineQuery(`*[_type == "post" && slug.current == "${slug}"]
{
  "slug": slug.current,
    title,
    mainImage,
    publishedAt,
    lastEdAt,
    category->{
      title,
    },
    tags->{
      title,
    },
    body
}
`);
