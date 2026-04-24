import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { asc } from "drizzle-orm";

export async function GET() {
  const results = await db.select().from(schema.sends).orderBy(asc(schema.sends.createdAt));
  return NextResponse.json({ sends: results });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const [send] = await db.insert(schema.sends).values({
    id,
    url: body.url,
    title: body.title || "",
    description: body.description || "",
    tags: JSON.stringify(body.tags || []),
    createdAt: now,
  }).returning();

  return NextResponse.json({ send });
}
