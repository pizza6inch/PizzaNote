"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

/**
 * Counts one view per post per browser session and shows the total.
 * Renders nothing if the counter backend is not configured or unreachable, so the page never depends on it.
 */
export default function ViewCounter({ postKey, label }: { postKey: string; label: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const flag = `viewed:${postKey}`;
    let alreadyCounted = false;
    try {
      alreadyCounted = sessionStorage.getItem(flag) === "1";
    } catch {
      // sessionStorage can be unavailable (private mode); fall through and count.
    }

    const request = alreadyCounted
      ? fetch(`/api/views/?key=${encodeURIComponent(postKey)}`)
      : fetch("/api/views/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: postKey }),
        });

    request
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as { views?: number };
        if (typeof data.views === "number") setViews(data.views);
        try {
          sessionStorage.setItem(flag, "1");
        } catch {
          // ignore
        }
      })
      .catch(() => undefined);
  }, [postKey]);

  if (views === null) return null;

  return (
    <span className="inline-flex items-center gap-1.5" title={label}>
      <Eye className="w-4 h-4" aria-hidden="true" />
      <span data-numeric>
        <span className="sr-only">{label}: </span>
        {views}
      </span>
    </span>
  );
}
