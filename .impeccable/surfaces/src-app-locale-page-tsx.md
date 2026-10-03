---
version: 1
slug: "src-app-locale-page-tsx"
primary_target: "src/app/[locale]/page.tsx"
related_targets: []
---

# Home and site frame (zh-TW / en)

Visitor mode: Read. The home is the index of a reading product; the frame is the menu board, the reading column stays calm.

Audience, job, proof: developer arriving from search or an AI assistant, plus employers glancing at who runs the site. They need the newest note and the full list within one screen, and one line on who Ewan is. Proof is the real posts (5 per language), real read times and the real category counts; nothing is invented.

Constraints: one visible H1 per page, server-rendered HTML with every link present, no content hidden until JS runs, animations start from the visible state and respect reduced motion, no kicker labels, no emoji as icons, fonts self-hosted through next/font.

## Direction contract

THESIS: The notes are a pizzeria's menu board and order tickets. The pizza itself is the table of contents: each slice is a category, sized by its post count. The page refuses the card-grid developer blog and the cream notebook.

OWN-WORLD: Pepperoni red #C9241B for the masthead band and actions, cheese yellow #FFC72C for the field behind titles, crust ink #2A140C for text, white reading ground; at night a burnt-crust ground #1C0F0A with warm text #FFF4D6 and the same yellow and red. Display type Huninn (round, Taiwanese), self-hosted as a ~75 KB subset of the characters headings use; body is a Latin-only Noto Sans webfont with the visitor's system CJK face (PingFang TC / Noto Sans TC / Microsoft JhengHei); JetBrains Mono for numerals and code. Adaptation, 2026-10-03: full Noto Sans TC + Huninn webfonts produced 310 KB of render-blocking CSS and a 12 s mobile LCP; the subset and system CJK body brought it back to 2.7 s. Flat colour fields, thin ink rules, dotted leader lines, ticket perforations. A thin red-and-white gingham band appears once, above the footer. No gradients, no hard offset shadows.

STORY: The visitor sees one newest note and a numbered menu of every note with read times, understands this is a bilingual notebook kept by one person, and clicks a title within seconds. Slices let them browse by topic. The post page keeps the same vocabulary around a calm column.

FIRST VIEWPORT: Desktop 1440x900: a 64px red masthead band (pizza mark and site name left, topics, all posts, about, search, theme and a 中 / EN switch right). Below it a cheese-yellow field: left 7 columns hold the H1 (the site's one-line identity), then the newest post as the big title with its description and a red read button with the minutes; right 5 columns hold the pizza table of contents, about 420px wide, slices labelled with category and count. Directly beneath, the white menu: numbered rows, title, dotted leader, minutes, category. On a phone the field stacks (identity, newest post, a 280px pizza) and rows keep the number in the left margin.

FORM: Timetable Booklet (position 3 on my ordered list, seed f97ef7ab), translated by the user's pinned brief (pizza, red and yellow) into a pizzeria menu and order ticket; the tabular numbered list and series-as-route structure are kept.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
