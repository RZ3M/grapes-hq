import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { asc } from "drizzle-orm";

export async function GET() {
  const results = await db.select().from(schema.emails).orderBy(asc(schema.emails.capturedAt));
  return NextResponse.json({ emails: results });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const [email] = await db.insert(schema.emails).values({
    id,
    subject: body.subject,
    fromAddress: body.fromAddress || "",
    snippet: body.snippet || "",
    bodyPreview: body.bodyPreview || "",
    actionable: body.actionable ? 1 : 0,
    actionType: body.actionType || null,
    linkedTaskId: body.linkedTaskId || null,
    gmailThreadId: body.gmailThreadId || null,
    capturedAt: now,
  }).returning();

  return NextResponse.json({ email });
}
