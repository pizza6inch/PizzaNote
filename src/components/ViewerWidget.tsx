import { Eye } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { liveClient, readClient } from "@/sanity/lib/client";
import { VIEWS_BY_POST_ID } from "@/sanity/lib/queries";
import ViewerWidgetClient from "./ViewerWidgetClient";
export default async function ViewerWidget({ postId }: { postId: string }) {
  const data = await liveClient.fetch(VIEWS_BY_POST_ID, { id: postId });

  if (!data) return null;

  return (
    <>
      <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-900 shadow-md dark:shadow-gray-700 rounded-full border border-gray-200">
        <div className="relative">
          <Eye className="w-4 h-4 " />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        </div>
        <span className="text-sm font-medium ">{data.views}</span>
        <ViewerWidgetClient postId={postId} />
      </div>
    </>
  );
}
