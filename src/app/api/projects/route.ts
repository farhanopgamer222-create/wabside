import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { ensureSeed } from "@/db/seed";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = "Farhan213";

function authorized(req: Request, supplied?: string | null) {
  const header = req.headers.get("x-admin-password");
  return (header ?? supplied) === ADMIN_PASSWORD;
}

export async function GET() {
  await ensureSeed();
  const rows = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.order), asc(projects.id));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const p = body?.project ?? body;
  if (!p?.title || !p?.category) {
    return NextResponse.json({ error: "Title and category required" }, { status: 400 });
  }
  const slug =
    p.slug ||
    String(p.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const inserted = await db
    .insert(projects)
    .values({
      title: String(p.title),
      slug,
      category: String(p.category),
      year: String(p.year ?? new Date().getFullYear()),
      description: String(p.description ?? ""),
      stack: String(p.stack ?? ""),
      image: String(p.image ?? "/images/p1.jpg"),
      url: p.url ? String(p.url) : null,
      featured: Boolean(p.featured),
      order: Number(p.order ?? 0),
    })
    .returning();

  return NextResponse.json(inserted[0], { status: 201 });
}

export async function PATCH(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const id = Number(body?.id);
  const p = body?.project ?? body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const updated = await db
    .update(projects)
    .set({
      ...(p.title !== undefined && { title: String(p.title) }),
      ...(p.category !== undefined && { category: String(p.category) }),
      ...(p.year !== undefined && { year: String(p.year) }),
      ...(p.description !== undefined && { description: String(p.description) }),
      ...(p.stack !== undefined && { stack: String(p.stack) }),
      ...(p.image !== undefined && { image: String(p.image) }),
      ...(p.url !== undefined && { url: p.url ? String(p.url) : null }),
      ...(p.featured !== undefined && { featured: Boolean(p.featured) }),
      ...(p.order !== undefined && { order: Number(p.order) }),
    })
    .where(eq(projects.id, id))
    .returning();

  if (!updated[0]) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated[0]);
}

export async function DELETE(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.delete(projects).where(eq(projects.id, id));
  return NextResponse.json({ ok: true });
}
