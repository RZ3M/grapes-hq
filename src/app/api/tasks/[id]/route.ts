import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  updates.updatedAt = new Date().toISOString();
  if (updates.tags) updates.tags = JSON.stringify(updates.tags);

  const [updated] = await db.update(schema.tasks).set(updates).where(eq(schema.tasks.id, id)).returning();
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ task: updated });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await db.delete(schema.tasks).where(eq(schema.tasks.id, id));
  return NextResponse.json({ success: true });
}
