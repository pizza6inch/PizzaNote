import "server-only";
import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { OG_SIZE } from "@/lib/og-size";

// The display subset only holds characters that headings can show: UI strings, taxonomy names and post titles.
// That is exactly what the card prints, so no glyph falls back.
const huninn = fs.readFileSync(path.join(process.cwd(), "src", "fonts", "huninn-subset.ttf"));

const CRUST = "#2a140c";
const CHEESE = "#ffc72c";
const PEPPERONI = "#c9241b";

/** Pepperoni on the big pizza in the corner, as [left, top, size] inside its 520px box. */
const TOPPINGS: [number, number, number][] = [
  [120, 110, 70],
  [300, 70, 56],
  [230, 230, 80],
  [90, 300, 52],
  [380, 220, 46],
];

const segmenter = new Intl.Segmenter("zh-Hant", { granularity: "word" });

/**
 * Words for line breaking: closing punctuation stays on the word before it (no line starts with "、" or "："),
 * and opening brackets stay on the word after it.
 */
const words = (text: string) => {
  const out: string[] = [];
  let opening = "";
  for (const { segment, isWordLike } of segmenter.segment(text)) {
    if (/^[(（「『[]+$/.test(segment)) opening += segment;
    else if (!isWordLike && segment.trim() !== "" && out.length && !opening) out[out.length - 1] += segment;
    else {
      out.push(opening + segment);
      opening = "";
    }
  }
  if (opening) out.push(opening);
  return out;
};

/**
 * The share card: the red masthead and the yellow field of the site, the title in the display face,
 * and a pizza sliding in from the corner.
 */
export function ogCard({ brand, eyebrow, title, footer }: { brand: string; eyebrow?: string; title: string; footer: string }) {
  const units = [...title].reduce((n, ch) => n + (/[⺀-鿿＀-￯]/.test(ch) ? 1 : 0.55), 0);
  const fontSize = units > 26 ? 56 : units > 16 ? 66 : 78;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: CHEESE, fontFamily: "Huninn", color: CRUST, position: "relative" }}>
        <div style={{ height: 104, background: PEPPERONI, display: "flex", alignItems: "center", padding: "0 64px", gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 999, background: "#d98c2b", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 999, background: CHEESE, display: "flex", position: "relative" }}>
              <div style={{ position: "absolute", left: 6, top: 8, width: 14, height: 14, borderRadius: 999, background: PEPPERONI }} />
              <div style={{ position: "absolute", left: 24, top: 22, width: 15, height: 15, borderRadius: 999, background: PEPPERONI }} />
            </div>
          </div>
          <div style={{ fontSize: 44, color: "#ffffff" }}>{brand}</div>
        </div>

        <div style={{ position: "absolute", right: -150, bottom: -190, width: 520, height: 520, borderRadius: 999, background: "#d98c2b", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 476, height: 476, borderRadius: 999, background: "#ffd54a", display: "flex", position: "relative" }}>
            {TOPPINGS.map(([left, top, size], i) => (
              <div key={i} style={{ position: "absolute", left, top, width: size, height: size, borderRadius: 999, background: PEPPERONI }} />
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 300px 40px 64px" }}>
          {eyebrow && <div style={{ fontSize: 30, color: PEPPERONI, marginBottom: 20, display: "flex" }}>{eyebrow}</div>}
          {/* One flex item per word, so a CJK word never splits across lines (the same rule as CjkText on the site). */}
          <div style={{ fontSize, lineHeight: 1.25, display: "flex", flexWrap: "wrap" }}>
            {words(title).map((w, i) => (
              <span key={i} style={{ whiteSpace: "pre" }}>
                {w}
              </span>
            ))}
          </div>
        </div>

        <div style={{ height: 88, display: "flex", alignItems: "center", padding: "0 64px", fontSize: 28, borderTop: `3px dashed ${CRUST}` }}>
          {footer}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Huninn", data: huninn, style: "normal", weight: 400 }] },
  );
}
