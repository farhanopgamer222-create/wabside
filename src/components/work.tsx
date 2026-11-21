"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";
import type { Project } from "@/db/schema";
import { Counter, MaskLines, Reveal, SectionHead } from "./core";

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */
const FACTS = [
  { n: 60, s: "+", l: "Projects shipped" },
  { n: 5, s: "", l: "Years building" },
  { n: 32, s: "+", l: "Happy clients" },
  { n: 14, s: "", l: "Awards & mentions" },
];

export function About() {
  return (
    <section id="about" className="px-5 py-24 md:px-8 md:py-32">
      <SectionHead
        index="01"
        kicker="About"
        title={
          <>
            I build things that
            <br />
            <span className="font-serif italic lowercase tracking-tight">
              feel alive
            </span>{" "}
            on screen
          </>
        }
        intro="Five years of turning briefs into interfaces that load fast, move beautifully and hold up under real traffic. Design-minded engineering, not decoration."
      />

      <div className="mt-16 grid gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <div className="relative overflow-hidden">
            <img
              src="/images/portrait.jpg"
              alt="Farhan at work"
              className="aspect-[4/5] w-full object-cover grayscale contrast-125"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <span className="label absolute bottom-4 left-4 !text-paper">
              Studio — 02:14 AM
            </span>
          </div>
        </Reveal>

        <div className="md:col-span-7">
          <MaskLines
            className="display text-[clamp(1.7rem,3.4vw,3.2rem)]"
            lines={[
              "Hey — I'm Farhan, a full-stack",
              "developer who treats the browser",
              "like a rendering engine, not a",
              "document viewer.",
            ]}
          />

          <Reveal delay={0.15} className="mt-8 space-y-5">
            <p className="max-w-xl text-[15px] leading-relaxed text-muted md:text-lg">
              I design and engineer end to end: product architecture, database
              schemas, API surfaces, and the motion layer that makes an
              interface feel physical. My favourite work sits exactly on the
              seam between <span className="text-paper">design</span> and{" "}
              <span className="text-paper">engineering</span>.
            </p>
            <p className="max-w-xl text-[15px] leading-relaxed text-muted md:text-lg">
              Currently building{" "}
              <a
                href="https://farhangpt.bond"
                target="_blank"
                rel="noreferrer"
                className="text-paper underline decoration-line underline-offset-4"
              >
                FarhanGPT
              </a>{" "}
              — my own AI assistant — and taking on a small number of
              freelance builds each quarter.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.l} className="bg-ink px-4 py-6">
                <div className="display text-[clamp(2rem,4vw,3.4rem)]">
                  <Counter to={f.n} suffix={f.s} />
                </div>
                <div className="label mt-2">{f.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Capabilities                                                        */
/* ------------------------------------------------------------------ */
const SKILLS = [
  { k: "React / Next.js", v: 97 },
  { k: "TypeScript", v: 95 },
  { k: "Node & APIs", v: 92 },
  { k: "PostgreSQL / Drizzle", v: 90 },
  { k: "Three.js / WebGL", v: 88 },
  { k: "Motion & interaction", v: 94 },
  { k: "AI / LLM integration", v: 86 },
  { k: "DevOps & performance", v: 83 },
];

export function Skills() {
  return (
    <section className="px-5 py-24 md:px-8 md:py-32">
      <SectionHead
        index="02"
        kicker="Capabilities"
        title={
          <>
            The stack
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: "1.5px var(--fg)" }}>
              behind the work
            </span>
          </>
        }
        intro="No buzzword bingo — these are the tools I reach for daily and can defend in a code review."
      />

      <div className="mt-14 border-t border-line">
        {SKILLS.map((s, i) => (
          <motion.div
            key={s.k}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="group grid grid-cols-12 items-center gap-4 border-b border-line py-5"
          >
            <span className="label col-span-2 md:col-span-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="col-span-10 text-lg font-medium md:col-span-4 md:text-2xl">
              {s.k}
            </span>
            <div className="col-span-12 md:col-span-6">
              <div className="h-[3px] w-full bg-line">
                <motion.div
                  className="h-[3px] origin-left bg-paper"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: s.v / 100 }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 1.2, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
            <span className="col-span-12 text-right font-mono text-xs tabular-nums text-muted md:col-span-1">
              {s.v}%
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Projects — editorial index with floating preview                    */
/* ------------------------------------------------------------------ */
export function Projects({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<Project | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 170, damping: 22, mass: 0.55 });
  const sy = useSpring(my, { stiffness: 170, damping: 22, mass: 0.55 });

  return (
    <section
      id="work"
      className="px-5 py-24 md:px-8 md:py-32"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set(e.clientX);
        my.set(e.clientY);
      }}
    >
      <SectionHead
        index="03"
        kicker="Selected work"
        title={
          <>
            Projects,
            <br />
            <span className="font-serif italic lowercase">2023 — 2026</span>
          </>
        }
        intro="A slice of recent builds. Hover a row for a look; every one shipped and still running."
      />

      <div className="mt-14 border-t border-line">
        {projects.map((p, i) => (
          <motion.a
            key={p.id}
            href={p.url ?? "#work"}
            target={p.url ? "_blank" : undefined}
            rel={p.url ? "noreferrer" : undefined}
            data-cursor={p.url ? "Open" : "View"}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.75, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setHovered(p)}
            onMouseLeave={() => setHovered((h) => (h?.id === p.id ? null : h))}
            className="group relative block border-b border-line"
          >
            <div className="flex flex-col gap-3 py-6 md:flex-row md:items-center md:gap-6 md:py-8">
              <span className="label md:w-12 md:shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="display text-[clamp(2rem,7vw,5.5rem)] transition-transform duration-500 ease-out md:group-hover:translate-x-3">
                  {p.title}
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted md:hidden">
                  {p.description}
                </p>
              </div>

              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted md:w-40 md:shrink-0 md:text-right">
                {p.category}
              </span>
              <span className="font-mono text-[11px] tabular-nums tracking-[0.14em] text-muted md:w-14 md:shrink-0 md:text-right">
                {p.year}
              </span>
              <span
                aria-hidden
                className="hidden text-2xl transition-transform duration-500 md:block md:group-hover:translate-x-2"
              >
                ↗
              </span>
            </div>

            {/* inline thumbnail on small screens */}
            <div className="mb-6 overflow-hidden md:hidden">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover grayscale"
              />
            </div>
          </motion.a>
        ))}
      </div>

      <Reveal className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <span className="label">
          {String(projects.length).padStart(2, "0")} projects indexed
        </span>
        <a
          href="https://farhangpt.bond"
          target="_blank"
          rel="noreferrer"
          data-cursor="Visit"
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted underline decoration-line underline-offset-4 hover:text-paper"
        >
          More inside FarhanGPT ↗
        </a>
      </Reveal>

      {/* floating preview */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 hidden lg:block"
        style={{ x: sx, y: sy }}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              key={hovered.id}
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 3 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[240px] w-[340px] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-line shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
            >
              <img
                src={hovered.image}
                alt=""
                className="h-full w-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white">
                {hovered.stack}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
