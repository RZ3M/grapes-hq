import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq, asc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const tags = searchParams.get("tags");
  const dueDate = searchParams.get("due_date");

  let results = await db.select().from(schema.tasks).orderBy(asc(schema.tasks.createdAt));

  if (status) results = results.filter((t) => t.status === status);
  if (dueDate) results = results.filter((t) => t.dueDate === dueDate);
  if (tags) {
    const tagList = tags.split(",");
    results = results.filter((t) => {
      const itemTags = JSON.parse(t.tags || "[]") as string[];
      return tagList.some((tag) => itemTags.includes(tag));
    });
  }

  return NextResponse.json({ tasks: results });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const [task] = await db.insert(schema.tasks).values({
    id,
    title: body.title,
    description: body.description || "",
    status: body.status || "todo",
    tags: JSON.stringify(body.tags || []),
    dueDate: body.dueDate || null,
    source: body.source || "manual",
    createdAt: now,
    updatedAt: now,
  }).returning();

  return NextResponse.json({ task });
}
