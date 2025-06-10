import { NextRequest, NextResponse } from "next/server";
import { writeClient, readClient } from "@/sanity/lib/client";
import { VIEWS_BY_POST_ID } from "@/sanity/lib/queries";

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "Missing postId" }, { status: 400 });
    }

    console.log("call Increment views");

    // Increment views count
    await writeClient.patch(postId).inc({ views: 1 }).commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error incrementing views:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
