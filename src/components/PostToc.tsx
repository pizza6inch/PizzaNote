"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/headings";

// A heading reached from the TOC stops below the page's scroll-padding plus its own scroll-margin; anything at or
// above that line (with a little slack) counts as the section being read.
const activeLine = (el: HTMLElement) =>
  (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) +
  (parseFloat(getComputedStyle(el).scrollMarginTop) || 0) +
  16;

/** The post's own sections, highlighting the h2 you are reading. Sits above the category list on desktop. */
export default function PostToc({ heading, headings }: { heading: string; headings: Heading[] }) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) {
        setActive(elements[elements.length - 1].id);
        return;
      }
      const line = activeLine(elements[0]);
      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [headings]);

  return (
    <nav aria-label={heading} className="ticket">
      <h2 className="ticket-title">{heading}</h2>
      <ul>
        {headings.map((h, i) => (
          <li key={h.id}>
            <a href={`#${h.id}`} aria-current={h.id === active ? "location" : undefined} className="ticket-link">
              <span className="ticket-no" data-numeric>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{h.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
