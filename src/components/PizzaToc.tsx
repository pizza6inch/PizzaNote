import Link from "next/link";
import type { CSSProperties } from "react";

export interface PizzaSlice {
  slug: string;
  title: string;
  count: number;
  href: string;
}

const C = 200; // centre of the 400x400 drawing
const FACE_R = 158;
const CRUST_R = 172;
const PLATE_R = 196;

const polar = (r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) };
};

/** Display width of a label in em: CJK counts one em per character, Latin about 0.58. */
const labelUnits = (text: string) => [...text].reduce((n, ch) => n + (/[⺀-鿿＀-￯]/.test(ch) ? 1 : 0.58), 0);

/** Fixed offsets so the pepperoni land in the same place on every render (the page is static). */
// Toppings stay in the outer ring (r >= 122) so they never sit under a label, which is set at r = 70.
const PEPPERONI = [
  { a: 0.2, r: 134, s: 14 },
  { a: 0.78, r: 130, s: 12 },
  { a: 0.5, r: 142, s: 10 },
  { a: 0.36, r: 124, s: 7 },
];

/**
 * The table of contents drawn as a pizza: one slice per category, its angle proportional to the number of posts.
 * Every slice is a real link; the same links also appear as a plain list under the drawing.
 */
export default function PizzaToc({ slices, label }: { slices: PizzaSlice[]; label: string }) {
  const total = slices.reduce((n, s) => n + s.count, 0) || 1;
  // Start at 12 o'clock and go clockwise; each slice starts where the previous one ended.
  const starts = slices.map((_, i) => -90 + (slices.slice(0, i).reduce((n, s) => n + s.count, 0) / total) * 360);

  return (
    <svg
      viewBox="0 0 400 400"
      role="group"
      aria-label={label}
      className="w-full h-auto"
      style={{ filter: "drop-shadow(0 16px 18px rgba(42, 20, 12, 0.22))" }}
    >
      <circle cx={C} cy={C} r={PLATE_R} fill="#ffffff" />
      <circle cx={C} cy={C} r={CRUST_R} fill="#d98c2b" />
      <circle cx={C} cy={C} r={FACE_R + 6} fill="#e9a23c" />

      {slices.map((slice, i) => {
        const sweep = (slice.count / total) * 360;
        const start = starts[i];
        const end = start + sweep;
        const mid = (start + end) / 2;

        const a = polar(FACE_R, start);
        const b = polar(FACE_R, end - 0.0001);
        const wedge =
          slices.length === 1
            ? `M ${C} ${C - FACE_R} A ${FACE_R} ${FACE_R} 0 1 1 ${C - 0.01} ${C - FACE_R} Z`
            : `M ${C} ${C} L ${a.x} ${a.y} A ${FACE_R} ${FACE_R} 0 ${sweep > 180 ? 1 : 0} 1 ${b.x} ${b.y} Z`;

        const labelR = slices.length === 1 ? 0 : sweep < 100 ? 92 : 70;
        const labelPos = polar(labelR, mid);
        const chord = 2 * Math.max(labelR, 1) * Math.sin((Math.min(sweep, 180) * Math.PI) / 360) * 0.85;
        const fontSize = Math.max(13, Math.min(22, (chord * 0.92) / labelUnits(slice.title)));
        const showLabel = sweep >= 40 || slices.length === 1;
        const lift = polar(11, mid);

        const style = { "--dx": `${lift.x - C}px`, "--dy": `${lift.y - C}px` } as CSSProperties;

        return (
          <Link
            key={slice.slug}
            href={slice.href}
            className="pizza-link"
            aria-label={`${slice.title} ${slice.count}`}
          >
            <g className="pizza-slice" style={style}>
              <path className="pizza-wedge" d={wedge} fill="#ffd54a" stroke="#b8651b" strokeWidth={3} strokeLinejoin="round" />
              {PEPPERONI.map((p, k) => {
                // In a narrow slice the label sits at r=92, so toppings move out to the crust edge.
                const narrow = sweep < 100;
                const pos = polar(narrow ? 146 : p.r, start + sweep * p.a + (k % 2 ? 2 : -2));
                const size = narrow ? Math.min(p.s, 9) : p.s;
                return sweep < 40 && k > 1 ? null : (
                  <g key={k}>
                    <circle cx={pos.x} cy={pos.y} r={size} fill="#c9241b" />
                    <circle cx={pos.x - size * 0.28} cy={pos.y - size * 0.3} r={size * 0.22} fill="#e5483b" />
                  </g>
                );
              })}
              {showLabel && (
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  fill="#2a140c"
                  style={{ fontFamily: "var(--font-display)", fontSize }}
                >
                  <tspan x={labelPos.x} dy="-0.1em">
                    {slice.title}
                  </tspan>
                  <tspan x={labelPos.x} dy="1.25em" style={{ fontFamily: "var(--font-mono)", fontSize: fontSize * 0.7 }}>
                    {slice.count}
                  </tspan>
                </text>
              )}
            </g>
          </Link>
        );
      })}
    </svg>
  );
}
