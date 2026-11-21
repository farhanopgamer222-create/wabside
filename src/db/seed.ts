import { db } from "@/db";
import { projects, settings } from "@/db/schema";
import { eq } from "drizzle-orm";

export const DEFAULT_PROJECTS: (typeof projects.$inferInsert)[] = [
  {
    title: "FarhanGPT",
    slug: "farhangpt",
    category: "AI Product",
    year: "2026",
    description:
      "My own AI assistant platform — streaming chat, retrieval over private documents, and a reasoning playground. Built to feel instant on a slow connection.",
    stack: "Next.js, RAG, Vector DB, Postgres",
    image: "/images/ai.jpg",
    url: "https://farhangpt.bond",
    featured: true,
    order: 1,
  },
  {
    title: "Nova Commerce",
    slug: "nova-commerce",
    category: "E-Commerce",
    year: "2025",
    description:
      "A headless storefront doing 40k orders a month. Server-driven cart, edge-cached catalogue, zero layout shift on any device.",
    stack: "Next.js, Drizzle, Postgres, Stripe",
    image: "/images/p1.jpg",
    url: null,
    featured: true,
    order: 2,
  },
  {
    title: "Pulse Analytics",
    slug: "pulse-analytics",
    category: "Realtime Dashboard",
    year: "2025",
    description:
      "Live product analytics with sub-second charts, custom funnels and a query builder that normal users actually understand.",
    stack: "React, WebSocket, ClickHouse, Node",
    image: "/images/p2.jpg",
    url: null,
    featured: true,
    order: 3,
  },
  {
    title: "Kine Studio",
    slug: "kine-studio",
    category: "WebGL Experience",
    year: "2024",
    description:
      "Award-nominated portfolio for a motion studio: shader-driven type, scroll-scrubbed timelines and a 60fps budget on mid-range phones.",
    stack: "Three.js, GLSL, GSAP, Vite",
    image: "/images/p3.jpg",
    url: null,
    featured: false,
    order: 4,
  },
  {
    title: "Atlas CMS",
    slug: "atlas-cms",
    category: "Headless CMS",
    year: "2024",
    description:
      "Editorial content platform with structured blocks, live preview, roles and audit trails for a 60-person newsroom.",
    stack: "Node, Drizzle, Postgres, Redis",
    image: "/images/p4.jpg",
    url: null,
    featured: false,
    order: 5,
  },
  {
    title: "MediTrack",
    slug: "meditrack",
    category: "Healthcare Platform",
    year: "2023",
    description:
      "Hospital scheduling and records system used across nine clinics — offline-first, keyboard-driven, and accessible end to end.",
    stack: "TypeScript, Postgres, Redis, Docker",
    image: "/images/hero.jpg",
    url: null,
    featured: false,
    order: 6,
  },
];

export async function ensureSeed() {
  try {
    const marker = await db
      .select()
      .from(settings)
      .where(eq(settings.key, "seeded"))
      .limit(1);

    if (marker.length > 0) return;

    const existing = await db.select({ id: projects.id }).from(projects).limit(1);
    if (existing.length === 0) {
      await db.insert(projects).values(DEFAULT_PROJECTS);
    }

    await db
      .insert(settings)
      .values({ key: "seeded", value: "true" })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: "true" },
      });
  } catch (error) {
    console.warn("[seed] skipped:", error);
  }
}
