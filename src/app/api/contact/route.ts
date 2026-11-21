import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = "Farhan213";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const subject = String(body?.subject ?? "").trim();
  const text = String(body?.body ?? body?.message ?? "").trim();

  if (!name || !email || !text) {
    return NextResponse.json(
      { error: "Name, email and message are required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That email looks off." }, { status: 400 });
  }

  const row = await db
    .insert(messages)
    .values({ name, email, subject, body: text })
    .returning();

  return NextResponse.json({ ok: true, id: row[0].id }, { status: 201 });
}

export async function GET(req: Request) {
  const pass = req.headers.get("x-admin-password");
  if (pass !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db
    .select()
    .from(messages)
    .orderBy(desc(messages.createdAt));
  return NextResponse.json(rows);
}

export async function PATCH(req: Request) {
  const pass = req.headers.get("x-admin-password");
  if (pass !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const id = Number(body?.id);
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const updated = await db
    .update(messages)
    .set({ read: Boolean(body?.read) })
    .where(eq(messages.id, id))
    .returning();
  return NextResponse.json(updated[0] ?? null);
}

export async function DELETE(req: Request) {
  const pass = req.headers.get("x-admin-password");
  if (pass !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.delete(messages).where(eq(messages.id, id));
  return NextResponse.json({ ok: true });
}
