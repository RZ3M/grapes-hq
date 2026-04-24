import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, asc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const tags = searchParams.get("tags");

  let results = await db.select().from(schema.ideas).orderBy(asc(schema.ideas.createdAt));

  if (status) {
    results = results.filter((i) => i.status === status);
  }
  if (tags) {
    const tagList = tags.split(",");
    results = results.filter((i) => {
      const itemTags = JSON.parse(i.tags || "[]") as string[];
      return tagList.some((t) => itemTags.includes(t));
    });
  }

  return NextResponse.json({ ideas: results });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const [idea] = await db.insert(schema.ideas).values({
    id,
    title: body.title,
    description: body.description || "",
    status: body.status || "new",
    tags: JSON.stringify(body.tags || []),
    createdAt: now,
    updatedAt: now,
  }).returning();

  return NextResponse.json({ idea });
}
