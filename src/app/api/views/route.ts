import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { createHash } from "node:crypto";
import { getAllPostParams } from "@/lib/content";
import seed from "../../../../content/views-seed.json";

export const dynamic = "force-dynamic";

/** Keys are `topic/slug`; only keys that exist in the content tree are accepted. */
const validKeys = new Set(getAllPostParams().map((p) => `${p.topic}/${p.post}`));

// The Vercel Marketplace integration injects KV_REST_API_*; a manually created database uses UPSTASH_REDIS_REST_*.
const redisUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

const counterKey = (key: string) => `views:${key}`;
const seedFor = (key: string) => (seed as Record<string, number>)[key] ?? 0;

/** First write initialises the counter from the migrated Sanity value. */
async function readViews(r: Redis, key: string) {
  await r.set(counterKey(key), seedFor(key), { nx: true });
  return Number((await r.get<number>(counterKey(key))) ?? 0);
}

const unavailable = () => new NextResponse(null, { status: 204 });

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key") ?? "";
  if (!redis || !validKeys.has(key)) return unavailable();
  try {
    return NextResponse.json({ views: await readViews(redis, key) });
  } catch {
    return unavailable();
  }
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { key?: string } | null;
  const key = body?.key ?? "";
  if (!redis || !validKeys.has(key)) return unavailable();

  try {
    await readViews(redis, key);
    // One count per visitor per post per hour (visitor = hashed IP + user agent; nothing personal is stored).
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const visitor = createHash("sha256")
      .update(`${ip}|${request.headers.get("user-agent") ?? ""}|${key}`)
      .digest("hex")
      .slice(0, 32);
    const firstVisit = await redis.set(`seen:${visitor}`, 1, { nx: true, ex: 3600 });
    const views = firstVisit ? await redis.incr(counterKey(key)) : Number((await redis.get<number>(counterKey(key))) ?? 0);
    return NextResponse.json({ views });
  } catch {
    return unavailable();
  }
}
