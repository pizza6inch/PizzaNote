---
name: PizzaNote 披薩筆記
description: A bilingual front-end notebook set as a pizzeria menu board, with a calm reading column inside it.
colors:
  pepperoni: "#c9241b"
  pepperoni-deep: "#8e1b12"
  masthead: "#c9241b"
  cheese: "#ffc72c"
  cheese-soft: "#fff1bd"
  crust: "#2a140c"
  paper: "hsl(0 0% 100%)"
  crust-ink: "hsl(16 62% 11%)"
  crust-muted: "hsl(16 30% 32%)"
  flour-rule: "hsl(38 38% 80%)"
  night-ground: "hsl(16 52% 7%)"
  night-card: "hsl(16 42% 11%)"
  night-text: "hsl(43 100% 92%)"
  night-muted: "hsl(38 30% 72%)"
  night-rule: "hsl(16 30% 22%)"
  night-cheese-soft: "#2e1a10"
  night-pepperoni: "#e5483b"
  night-pepperoni-deep: "#ff8a7d"
  night-link-hover: "#ffe08a"
  footer-text: "#fff4d6"
  oven-black: "#231510"
  oven-edge: "#4a2c20"
  pizza-crust: "#d98c2b"
  pizza-crust-inner: "#e9a23c"
  pizza-face: "#ffd54a"
  pizza-cut: "#b8651b"
  pizza-glow: "#ffe07a"
typography:
  display:
    fontFamily: "Huninn (subset), PingFang TC, Noto Sans TC, Microsoft JhengHei, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 1.5rem + 2.8vw, 4.25rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Huninn (subset), PingFang TC, Noto Sans TC, Microsoft JhengHei, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.5rem + 2vw, 3.25rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Huninn (subset), PingFang TC, Noto Sans TC, Microsoft JhengHei, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.05rem + 0.8vw, 1.65rem)"
    fontWeight: 400
    lineHeight: 1.3
  prose-heading:
    fontFamily: "Huninn (subset), PingFang TC, Noto Sans TC, Microsoft JhengHei, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1.25
  body:
    fontFamily: "Noto Sans (Latin), PingFang TC, Noto Sans TC, Microsoft JhengHei, Heiti TC, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.95
  body-ui:
    fontFamily: "Noto Sans (Latin), PingFang TC, Noto Sans TC, Microsoft JhengHei, Heiti TC, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Noto Sans (Latin), PingFang TC, Noto Sans TC, Microsoft JhengHei, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    lineHeight: 1.5
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.65
    fontFeature: "\"tnum\""
rounded:
  inline: "0.3rem"
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
  pill: "999px"
spacing:
  gutter-mobile: "1rem"
  gutter: "2rem"
  row-y: "1.1rem"
  prose-rhythm: "1.25rem"
  section-y: "3.5rem"
components:
  button-read:
    backgroundColor: "{colors.pepperoni}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.4rem"
  button-read-hover:
    backgroundColor: "{colors.pepperoni-deep}"
  masthead-band:
    backgroundColor: "{colors.masthead}"
    textColor: "{colors.paper}"
    height: "64px"
  masthead-link:
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0.4rem 0.75rem"
  masthead-link-active:
    backgroundColor: "{colors.cheese}"
    textColor: "{colors.crust}"
  field:
    backgroundColor: "{colors.cheese}"
    textColor: "{colors.crust}"
  menu-row:
    textColor: "{colors.crust-ink}"
    typography: "{typography.title}"
    padding: "1.1rem 0.75rem"
  menu-row-hover:
    backgroundColor: "{colors.cheese-soft}"
    textColor: "{colors.pepperoni}"
  order-ticket:
    backgroundColor: "{colors.cheese-soft}"
    textColor: "{colors.crust-ink}"
    rounded: "{rounded.md}"
    padding: "1.25rem 1.25rem 1.5rem"
  ticket-line-current:
    backgroundColor: "{colors.pepperoni}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "0.4rem 0.5rem"
  category-chip:
    textColor: "{colors.crust}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.75rem"
  category-chip-hover:
    backgroundColor: "{colors.crust}"
    textColor: "{colors.cheese}"
  post-number:
    backgroundColor: "{colors.crust}"
    textColor: "{colors.cheese}"
    typography: "{typography.mono}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.75rem"
  code-block:
    backgroundColor: "{colors.oven-black}"
    typography: "{typography.mono}"
    rounded: "{rounded.lg}"
    padding: "1.1rem 1.25rem"
  inline-code:
    backgroundColor: "{colors.cheese-soft}"
    textColor: "{colors.crust-ink}"
    rounded: "{rounded.inline}"
    padding: "0.12em 0.4em"
  step-card:
    rounded: "{rounded.lg}"
    padding: "1.25rem"
  step-card-hover:
    backgroundColor: "{colors.cheese-soft}"
  footer:
    backgroundColor: "{colors.crust}"
    textColor: "{colors.footer-text}"
---

# Design System: PizzaNote 披薩筆記

## Overview

**Creative North Star: "The Pizzeria Menu Board"**

The notes are a pizzeria's menu board and its order tickets. The frame is loud and flat: a pepperoni-red masthead band, a cheese-yellow field behind every page title, crust-brown ink, a red-and-white gingham strip above the footer. Inside that frame the reading column stays calm. It is white by day and burnt crust at night, set in the visitor's own CJK system face at a long-form measure. The pizza is the table of contents. Each slice is a category, its angle proportional to its post count, and every slice is a real link.

The vocabulary comes from a menu, not from a developer-blog card grid. Posts are numbered menu lines, and a dotted leader runs from each title to its read time, which plays the part of the price. A series is an order ticket with perforated rules and notched sides. Depth comes from flat colour fields and thin ink rules. Shadows are soft and appear only where a physical object lifts off the board (the pizza on its plate, a dropdown, the search dialog).

Density is generous on the field and tabular in the menu. Both languages share the same structure and polish. A Chinese title keeps its words whole when it wraps, and Latin and CJK sit in the same line without a seam.

**Key Characteristics:**
- Flat ingredient colours: pepperoni red, cheese yellow, crust ink, white or burnt-crust ground.
- Round Taiwanese display face (Huninn) for headings only. Body text uses Latin Noto Sans plus the visitor's system CJK face.
- Numbered menu rows with a dotted leader into the minutes.
- An order ticket for series navigation and a pizza drawing for the category index.
- One signature motion: the slice lifts out along its own axis.
- Gingham appears once per page, directly above the footer.

## Colors

The palette is a pizzeria's ingredients. Red and yellow are reserved for the frame and its actions, and brown ink carries the text.

### Primary
- **Pepperoni Red** (pepperoni): the masthead band, the "read" button, the current line on an order ticket, link colour in the light reading column, list markers, the menu-row hover leader, the scrollbar thumb and the caret. Its deep variant (pepperoni-deep) is the hover state of red actions and links.
- **Masthead Red** (masthead): the 64px band at the top of every page. It holds the same value in both themes.

### Secondary
- **Cheese Yellow** (cheese): the field behind every page H1 (home, listings, posts, 404), the active masthead link, the selection highlight, the current language pill, and the highlighter band under prose H2s. At night it becomes the link colour, the list-marker colour and the focus ring.
- **Cheese Soft** (cheese-soft): the order ticket, menu-row and table-row hover, blockquotes, inline code. At night it becomes **Night Cheese Soft** (night-cheese-soft), a dark crust tone, so these surfaces recede instead of glowing.

### Tertiary
- **Pizza drawing tones** (pizza-crust, pizza-crust-inner, pizza-face, pizza-cut, plus pepperoni and night-pepperoni for toppings): used only inside the PizzaMark logo and the pizza table of contents. **Pizza Glow** (pizza-glow) is the reduced-motion hover fill for a slice.

### Neutral
- **Paper** (paper): the light reading ground and card surface.
- **Crust Ink** (crust-ink, close to crust): all light-theme text, the 2px rule over the first menu row and table headers.
- **Crust Muted** (crust-muted): menu numbers, summaries, categories, secondary labels.
- **Flour Rule** (flour-rule): 1px dividers between menu rows and table rows, image borders, dashed `hr`.
- **Crust** (crust): text on the yellow field in both themes, the footer ground in both themes, and the post-number pill.
- **Night Ground / Night Card / Night Text / Night Muted / Night Rule**: the dark theme's burnt-crust ground (about #1C0F0A), raised surface, warm cream text (about #FFF4D6), secondary text and dividers.
- **Footer Text** (footer-text): the cream type on the crust footer. It holds the same value in both themes.
- **Oven Black** (oven-black) with **Oven Edge** (oven-edge): the ground and 1px border of every shiki code block in both themes.

### Named Rules
**The Same Yellow Rule.** The cheese field and the red read button on it are identical in light and dark themes, and so is the masthead band. On the field, the button is pinned to light-theme pepperoni with white text (5.6:1), and its hover is pepperoni-deep. Dark mode never repaints the frame. It only changes the reading ground, the column text and the links inside the column.

**The Frame Holds the Colour Rule.** Red and yellow belong to the frame (masthead, field, ticket, actions, markers). The reading column stays paper and crust ink, and colour inside the prose is limited to links, list markers, the H2 highlighter and soft-cheese panels.

**The Ink Flips on the Field Rule.** The focus ring is 3px pepperoni (cheese at night) with a 3px offset. Inside the masthead it turns white, and on the yellow field it turns crust.

## Typography

**Display Font:** Huninn, self-hosted as a subset through next/font/local (with PingFang TC, Noto Sans TC, Microsoft JhengHei, system-ui)
**Body Font:** Noto Sans, Latin subset only, weights 400 and 700 (CJK falls through to the visitor's PingFang TC, Noto Sans TC, Microsoft JhengHei or Heiti TC)
**Label/Mono Font:** JetBrains Mono, Latin (with ui-monospace, SF Mono, Menlo, Consolas)

**Character:** A round, friendly Taiwanese display face sets the menu-board titles in regular weight. The body is plain and native to each visitor's system so that long technical reading stays fast and familiar. Mono marks numbers and code, so it reads as the menu's prices and ticket numbers.

### Hierarchy
- **Display** (400, clamp(2.1rem…4.25rem), 1.1 to 1.12): the single H1 on the yellow field. Listing pages use clamp(2.25rem, 1.6rem + 3vw, 4.5rem), and the home's newest-post title uses clamp(2rem, 1.4rem + 2.8vw, 4rem) as an H2. The home H1, the site's one-line identity, is set smaller at clamp(1.5rem…2.25rem).
- **Headline** (400, clamp(2rem…3.25rem), 1): section heads on the white ground, such as the home's "文章菜單" menu.
- **Title** (400, clamp(1.25rem…1.65rem), 1.3, balanced): menu-row titles and the order-ticket title (1.5rem).
- **Prose headings** (400, 1.75rem H2 / 1.35rem H3 / 1.15rem H4, 1.25): article headings. An H2 carries a cheese highlighter band under its lower 0.45em (28% cheese at night) and shrinks to 1.5rem below 720px.
- **Body** (400, 1.0625rem, 1.95): article prose, capped at 44rem. It drops to 1rem on phones. UI body text uses 1.7 line-height.
- **Label** (700, 0.95rem): read times, ticket group names, table headers, breadcrumbs (600, 0.875rem), masthead links (600).
- **Mono** (400, 0.8 to 0.9rem, tabular): menu numbers, post-number pill, slice counts, chip counts, the minute digits, code.

### Named Rules
**The Subset Rule.** Huninn ships as one subset woff2 (75 KB as shipped) containing printable ASCII plus every character in the UI dictionary, the taxonomy titles, the post titles and series, and the Markdown headings. `scripts/build-display-font.mjs` regenerates it in `prebuild` whenever that character set changes. A glyph outside the subset falls back to the body face, silently. Any new source of display text (a new component heading, a new content field) must be added to that script, or it will render in the body face. Adaptation, 2026-10-03: full Noto Sans TC plus full Huninn webfonts produced 310 KB of render-blocking CSS and a 12 s mobile LCP. The subset plus a system CJK body brought LCP back to 2.7 s. Do not reintroduce a full CJK webfont.

**The Numerals-Only Mono Rule.** JetBrains Mono sets digits and code only. In "6 分鐘" the digit is mono and the CJK unit stays in the body face. Mono is never applied to a CJK string.

**The Whole Word Rule.** Display titles wrap on Chinese word boundaries, so "物件" never splits across lines. Each segmented word is an unbreakable inline block, and the text content is unchanged. Tables in zh-TW use `word-break: keep-all`.

## Layout

The page container is 90rem wide with 1rem gutters, widening to 2rem from 768px. Every page opens with the 64px sticky masthead, then the yellow field holding breadcrumbs and the single H1. On the home page the field is a 12-column grid from 1024px. The left 7 columns hold the identity line, a 2px crust rule and the newest post with its read button. The right 5 columns hold the pizza (at most 24rem; 22rem and 18rem at smaller widths) with a row of category chips beneath it. On phones the field stacks in that order.

Below the field sits the white menu: an ordered list of rows with a 2px crust-ink rule over the first row and 1px flour rules between rows. From 720px a row is a grid of number (2.75rem), title, dotted leader, minutes on the first line, then summary (clamped to two lines) and category on the second. Below 720px the leader is dropped, the number keeps the left margin, and minutes and category move under the summary.

Post pages use a two-column grid from 1024px: the article (`minmax(0, 1fr)`) and a 20rem order ticket that is sticky at 6rem from the top and scrolls within the viewport height. On smaller screens the ticket follows the article. There is exactly one ticket per post.

**The Calm Column Rule.** Paragraphs, lists, headings, blockquotes and rules inside the article are capped at 44rem with a 1.25rem block rhythm. Tables and code blocks may run the full article width. A table always sits in a focusable, labelled scroll region (`tabindex=0`, `role=region`) with a thin pepperoni-on-cheese-soft scrollbar, so a wide table scrolls sideways instead of widening the page. Code blocks scroll horizontally inside their own frame.

Section rhythm is 3.5rem vertical padding (py-14), 4 to 5rem at the bottom of the home menu, and a 4rem gap before the previous/next step cards.

## Elevation & Depth

The board is flat. Depth comes from flat colour fields meeting at hard edges (red band, yellow field, white column, crust footer), from 2px ink rules and dashed perforations, and from the ticket's notches cut in the ground colour. Shadows are soft, warm-tinted (crust at alpha) and limited to objects that physically sit above the board.

### Shadow Vocabulary
- **Plate lift** (`filter: drop-shadow(0 16px 18px rgba(42, 20, 12, 0.22))`): the pizza table of contents on its white plate.
- **Dropdown** (`box-shadow: 0 18px 30px rgba(42, 20, 12, 0.35)`): the mobile masthead menu panel.
- **Dialog** (`box-shadow: 0 24px 48px rgba(42, 20, 12, 0.35)`, backdrop `rgba(42, 20, 12, 0.55)`): the search dialog.

The H2 highlighter (`box-shadow: inset 0 -0.45em 0` cheese) uses shadow syntax, but it is a flat marker band, not elevation.

### Named Rules
**The Ambient-Only Rule.** Shadows are blurred, warm and offset downward only. No hard offset shadow (zero blur, solid-colour block) appears anywhere, and no surface gets a shadow just for being a card.

## Shapes

The board's own edges are square: the masthead, the field, the footer and the gingham strip run edge to edge with no radius. Anything a hand touches is round. Actions, masthead links, the language switch, category chips and the post-number pill are full pills (999px). Ticket lines use a 0.375rem radius, the ticket and blockquotes 0.5rem, images, code blocks and step cards 0.75rem, and the search dialog 1rem.

Rules carry the menu metaphor. Solid 2px crust rules open a list (the first menu row, table headers, the home field's divider). 1px flour rules separate rows. A 2px dotted leader is the price line. 2px dashes are perforations (the ticket title, `hr`, the top of the comments section). The ticket has two semicircular notches (1.1rem) cut in the page ground at the height of its title rule.

**The One Gingham Rule.** The red-and-white check (1.25rem squares at 55% pepperoni over white, or 50% night pepperoni over crust at night) appears once per page, as a 1.25rem strip directly above the footer. It never becomes a background, a border elsewhere, or a section divider.

## Components

### Buttons
Red, round and confident. There is one action style.
- **Shape:** full pill (999px).
- **Read button:** pepperoni with white bold text, 0.75rem by 1.4rem padding, label then a lighter "· N 分鐘" and an arrow line icon. On the yellow field it is pinned to light red in both themes.
- **Hover / Focus:** background darkens to pepperoni-deep and the button rises 1px (160ms, expo-out). Focus is the global 3px ring, crust on the field.
- **Secondary text action:** a bold link in the link colour with a trailing arrow ("所有文章 →"), underlined on hover.

### Chips
- **Category chip:** 2px crust outline, crust bold text and a mono count, transparent on the field. Hover fills crust and turns the text cheese. Chips repeat the pizza's links as a plain list under the drawing.
- **Post number:** a crust pill with cheese mono text ("No.05") in the post field's meta row.

### Cards / Containers
- **Order ticket (series navigation):** cheese-soft panel, 0.5rem radius, 1.25rem padding. The title is set in display type above a 2px dashed perforation, with notches at the perforation. Lines are a 2rem mono number column plus the title. Hover fills cheese. The current line fills pepperoni with white semibold text. The first line, marked with a list line icon, links to the category overview.
- **Step cards (previous / next):** 2px flour outline, 0.75rem radius, 1.25rem padding, a bold muted label with an arrow and the title in display type. On hover the outline turns pepperoni (cheese at night) and the fill becomes cheese-soft.
- **Blockquote:** cheese-soft panel, 0.5rem radius, no side stripe.

### Inputs / Fields
- **Search input:** in the search dialog under a yellow field header. 2px border at 25% crust ink, 0.75rem radius, large text. Focus swaps the border to pepperoni (cheese at night). The caret is pepperoni (cheese at night). Results are rows with a display-face title, highlighted cheese-soft on hover.

### Navigation
- **Masthead:** a 64px sticky pepperoni band with white type. The PizzaMark and site name sit on the left. On the right are topics, all posts and about as pill links (600 weight, cheese fill with crust text on hover and for the current page), a thin white divider, then search and theme toggles as line icons. Last is the 中 / EN switch, a 15%-black pill track with the current language in a cheese pill. On phones the links collapse into a `details` menu, a red rounded panel with the dropdown shadow.
- **Breadcrumbs:** 0.875rem semibold crust on the field, separated by chevron line icons at 60% opacity.
- **Footer:** gingham strip, then a crust ground with cream text, the logo, the tagline, a cheese "days open" line, and round 44px social buttons (10% white, cheese icon, cheese fill on hover).

### Menu Row (signature)
A numbered line on the menu: the mono number in the margin, the display title, a 2px dotted leader at 45% ink running into the bold read time (mono digits, body-face unit), then a two-line clamped summary and the category on the right. Hover fills cheese-soft, turns the title into an underlined link (2px), and colours the leader pepperoni (cheese at night), at 180ms. The whole row is one link.

**The Price Line Rule.** A post listing is a menu row with a dotted leader into the minutes. Posts are never shown as a grid of cards.

### Pizza Table of Contents (signature)
An SVG pizza on a white plate: crust rings, a face cut into one wedge per category with its angle proportional to post count starting at 12 o'clock, pepperoni toppings at fixed offsets in the outer ring, and a display-face label with a mono count at the slice's centre. Labels hide on slices narrower than 40°. Every slice is a real link with an accessible name, and the same links repeat as chips below.

**The Slice Lift Rule.** The system's one signature motion is a slice sliding 11px outward along its own bisector on hover or focus (320ms, cubic-bezier(0.16, 1, 0.3, 1)). Keyboard focus also strokes the wedge 4px crust. Under `prefers-reduced-motion` the slice does not move: its fill changes to pizza-glow with the crust stroke instead, and all frame transitions are removed.

### Reading Column
- **Links:** pepperoni underlined 1px at 0.2em offset. Hover is pepperoni-deep with a 2px underline. At night, cheese and night-link-hover.
- **Code blocks:** shiki dark-plus tokens on oven-black with a 1px oven-edge border, 0.75rem radius, 0.9rem JetBrains Mono at 1.65, tab size 2, horizontal scroll inside the block. They are oven-black in both themes.
- **Inline code:** mono at 0.875em on cheese-soft, 0.3rem radius.
- **Tables:** full width, 0.95rem, 2px crust-ink header rule, 1px flour row rules, cheese-soft row hover, inline code kept on one line.
- **Images:** centred, 0.75rem radius, 1px flour border, with intrinsic dimensions so the layout does not shift.

## Do's and Don'ts

### Do:
- **Do** open every page with the 64px masthead band and a cheese field holding the page's single H1.
- **Do** keep the field, its red read button and the masthead identical in light and dark themes. Only the reading ground, column text and links change at night.
- **Do** list posts as numbered menu rows with a dotted leader into the read time.
- **Do** cap prose at 44rem and put every table in a focusable, labelled scroll region.
- **Do** set code in shiki on oven-black (#231510) in both themes.
- **Do** set digits in JetBrains Mono and keep CJK units ("分鐘") in the body face.
- **Do** add any new source of display text to `scripts/build-display-font.mjs` so its glyphs are in the Huninn subset.
- **Do** give interactive drawings real links and repeat them as plain links nearby.
- **Do** start every animation from the visible state and give reduced-motion users a colour change instead of movement.

### Don't:
- **Don't** put an eyebrow or kicker label above a heading. The heading carries its own meaning.
- **Don't** use emoji or Unicode glyphs as icons. Interface icons are SVG line icons or drawn SVG (PizzaMark, brand icons).
- **Don't** use colour gradients. The gingham check uses hard-stop `linear-gradient` syntax to draw a pattern, and that is its only sanctioned use.
- **Don't** use hard offset shadows (zero-blur solid blocks) or shadows on ordinary cards.
- **Don't** hide content until JavaScript runs, or start an animation from opacity 0 or an offset position.
- **Don't** load a full CJK webfont for display or body text.
- **Don't** repeat the gingham strip anywhere except once above the footer.
- **Don't** lay posts out as a card grid, or turn the reading column cream or yellow.
