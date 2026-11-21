import { asc } from "drizzle-orm";
import { db } from "@/db";
import { projects as projectsTable } from "@/db/schema";
import { ensureSeed } from "@/db/seed";
import { Cursor, Marquee, Nav, Preloader, ScrollProgress } from "@/components/core";
import { Hero } from "@/components/hero";
import { About, Projects, Skills } from "@/components/work";
import {
  AISection,
  Contact,
  Footer,
  Process,
  Services,
  Testimonials,
  Timeline,
} from "@/components/extra";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSeed();

  const list = await db
    .select()
    .from(projectsTable)
    .orderBy(asc(projectsTable.order), asc(projectsTable.id));

  return (
    <>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Nav />

      <main className="relative">
        <Hero />

        <Marquee
          big
          items={[
            "Full-stack developer",
            "WebGL & 3D",
            "Motion design",
            "AI products",
            "FarhanGPT",
          ]}
        />

        <About />
        <Skills />
        <Projects projects={list} />
        <Services />
        <Process />
        <Timeline />
        <AISection />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
