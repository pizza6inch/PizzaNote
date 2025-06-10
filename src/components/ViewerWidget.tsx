import { Eye } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { writeClient } from "@/sanity/lib/client";
// import { }

export default function ViewerWidget({ totalViews }: { totalViews: number }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-900 shadow-md dark:shadow-gray-700 rounded-full border border-gray-200">
      <div className="relative">
        <Eye className="w-4 h-4 " />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
      </div>
      <span className="text-sm font-medium ">{totalViews}</span>
    </div>
  );
}
