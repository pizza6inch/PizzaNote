# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: developers who arrive from a Google (or AI-assistant) search with a concrete technical question, such as "namecheap vercel", "next seo" or "js this", read one post, and leave. Most visits so far are of this kind.

Also confirmed: prospective employers, interviewers and industry people who judge the author through the site; and English-speaking developers abroad, the audience for the English version added in 2026. Classmates and peers who follow the author's learning are a minor audience.

## Product Purpose

PizzaNote (披薩筆記) is Ewan (Pizza)'s personal technical blog: notes on front-end development, JavaScript, SEO and tooling, published in Traditional Chinese (zh-TW) and English. The author is a computer-science student at National Taipei University of Technology who has interned as a front-end developer since 2024. More articles about AI are planned.

The site has two jobs of equal weight: be the best answer to a specific technical search (readable, findable, citable by search engines and AI assistants), and show a prospective employer who the author is and what they can do.

## Positioning

A learning-in-public notebook by a Taiwanese front-end developer, written in two languages with the same structure, and published so that machines can read it as easily as people (every post also exists as plain Markdown, plus llms.txt, JSON-LD and hreflang).

## Operating Context

- Content lives as Markdown files in the repository (`content/zh-tw/` and `content/en/`, same slugs); there is no CMS. The site is statically generated and deployed on Vercel at pizzanote.dev.
- Structure: topics, categories (series), tags (a tag page exists only with 2+ posts), posts; "all posts", "about", site search, an RSS feed per language.
- Comments use giscus (GitHub Discussions); a view counter uses Redis. Both are optional and load after the page.
- Growth is organic search and AI citation; Search Console is connected (about 76 clicks and 2.5k impressions lifetime at the time of writing).

## Capabilities and Constraints

- Bilingual zh-TW and en with locale-prefixed URLs; the language switcher links to the translation of the current page when one exists.
- Must keep: one `<h1>` per page, a single table of contents per post (sidebar on desktop, after the article on mobile), the JSON-LD, canonical and hreflang output, readable server-rendered HTML with no content hidden until JavaScript runs.
- Animations must never leave content transparent, shifted or invisible before scripts load, and must not hurt SEO or Core Web Vitals.
- Code blocks are rendered at build time with shiki; long technical articles with code, tables and images are the main content type.
- Chinese and English text must both set well (CJK line length, mixed Latin and CJK, long titles).
- Performance baseline from the 2026-10 audit: Lighthouse performance 93-100, LCP 2.4-2.7 s on mobile (target under 2.5 s).

## Brand Commitments

The site name 披薩筆記 / PizzaNote and the author identity (Ewan, "Pizza") stay. The user explicitly stated that every existing visual element may be redesigned, including the pizza logo, the Pong-game hero banner on the home page, the rotating avatar and the draggable pizza icon. No visual identity is binding.

## Evidence on Hand

- Five published posts in each language (`content/zh-tw/`, `content/en/`), three categories, one topic with posts.
- An About page with three real experience entries (ezTravel front-end intern from 2024-07, SITCON volunteer developer 2025-01 to 2025-03, NTUT Computer Science 2021-2025) and links to GitHub, Instagram and email.
- Real search data from Search Console and a baseline SEO and Lighthouse audit in `C:\github repo\seo-audits\`.
- No testimonials, awards or client work exist; none may be invented. No project/portfolio pages exist yet (the portfolio side is currently only the About page).

## Product Principles

1. The article is the product: a visitor who arrives from search should be reading within one screen and should never fight the interface to finish a post.
2. Two languages are equals, not a translation afterthought; structure, quality and polish are identical.
3. What is shown to people must also be what machines read: no meaning that only exists in script, imagery or animation.
4. Personality belongs to the author's real voice and work, not to decoration; the employer audience should leave knowing who this person is and what they build.
5. Technical content is long-lived: legibility, code readability and stable structure outrank novelty.

## Accessibility & Inclusion

No product-specific standard was set. The baseline audit found icon-only controls without names, heading-order and colour-contrast problems that are being fixed; respect reduced-motion preferences and keep keyboard and screen-reader access to navigation, language switching, theme toggle and search.
