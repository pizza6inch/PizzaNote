const CJK = /[㐀-鿿豈-﫿]/;

const segmenter = new Intl.Segmenter("zh-Hant", { granularity: "word" });

/**
 * Keeps Chinese words whole when a display title wraps (so "物件" never splits into "物 / 件").
 * Each word becomes an unbreakable inline-block; spaces and the gaps between blocks stay break opportunities,
 * and the text content (what search engines and screen readers read) is unchanged.
 */
export default function CjkText({ children }: { children: string }) {
  if (!CJK.test(children)) return <>{children}</>;
  return (
    <>
      {Array.from(segmenter.segment(children), ({ segment }, i) =>
        /^\s+$/.test(segment) ? (
          segment
        ) : (
          <span key={i} className="inline-block whitespace-nowrap">
            {segment}
          </span>
        ),
      )}
    </>
  );
}
