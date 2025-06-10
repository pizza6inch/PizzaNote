"use client";

import { useEffect } from "react";

export default function ViewerWidgetClient({ postId }: { postId: string }) {
  useEffect(() => {
    async function incrementViews() {
      console.log("call Increment views");
      try {
        await fetch("/api/incrementViews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId }),
        });
      } catch (error) {
        console.error("Failed to increment views", error);
      }
    }
    incrementViews();
  }, [postId]);

  return null; // This component does not render anything visible
}
