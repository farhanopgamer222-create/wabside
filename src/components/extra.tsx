"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Magnetic, MaskLines, Marquee, Reveal, SectionHead } from "./core";

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */
const SERVICES = [
  {
    t: "Product engineering",
    d: "Full-stack builds from schema to ship — Next.js, Node, Postgres, auth, payments, the lot.",
  },
  {
    t: "3D & WebGL",
    d: "Three.js scenes, shader work and scroll-driven storytelling that stay at 60fps on a phone.",
  },
  {
    t: "Motion design",
    d: "Interface choreography: reveals, timelines, page transitions and micro-interactions with intent.",
  },
  {
    t: "AI integration",
    d: "RAG pipelines, streaming chat, tool-calling agents — powered by my own platform, FarhanGPT.",
  },
  {
    t: "Design systems",
    d: "Tokenised, accessible component libraries that keep a growing product visually coherent.",
  },
  {
    t: "Performance rescue",
    d: "Core Web Vitals surgery: bundle diets, edge caching, render profiling and budget enforcement.",
  },
];

export function Services() {
  return (
    <section className="px-5 py-24 md:px-8 md:py-32">
      <SectionHead
        index="04"
        kicker="What I do"
        title={
          <>
            Six ways
            <br />
            <span className="font-serif italic lowercase">I can help</span>
          </>
        }
        intro="Hire the whole loop — strategy, design sensibility and the engineering that makes it real."
      />
      <div className="mt-14 grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.t}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.08 }}
            className="group relative overflow-hidden bg-ink p-7 md:p-9"
          >
            <span className="label">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="display mt-6 text-[clamp(1.4rem,2.6vw,2.1rem)]">
              {s.t}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">{s.d}</p>
            <span
              aria-hidden
              className="absolute -right-6 -top-6 text-[7rem] leading-none text-transparent transition-all duration-500 group-hover:text-paper/10"
              style={{ WebkitTextStroke: "1px var(--line)" }}
            >
              {i + 1}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Process — sticky stacking cards                                     */
/* ------------------------------------------------------------------ */
const STEPS = [
  {
    t: "Discover",
    d: "We map the real problem, the audience and the constraints. I come back with a scope, a stack and a timeline — not a guess.",
    m: ["Workshop", "Audit", "Scope doc"],
  },
  {
    t: "Design",
    d: "Wireframes, type scale, palette and motion direction. You see the feel of the thing before a line of production code exists.",
    m: ["Figma", "Motion spec", "Design tokens"],
  },
  {
    t: "Build",
    d: "Typed, tested, reviewed. Continuous previews so you watch it grow instead of waiting for a big reveal at the end.",
    m: ["CI previews", "Type safety", "Weekly demos"],
  },
  {
    t: "Launch & lift",
    d: "Performance budgets, analytics, SEO, handover docs — then 30 days of support while the real world stress-tests it.",
    m: ["Core Web Vitals", "Handover", "30-day support"],
  },
];

export function Process() {
  return (
    <section id="process" className="px-5 py-24 md:px-8 md:py-32">
      <SectionHead
        index="05"
        kicker="Process"
        title={
          <>
            How a project
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: "1.5px var(--fg)" }}>
              actually runs
            </span>
          </>
        }
        intro="Four stages, zero mystery. Scroll — the cards stack the way the work does."
      />

      <div className="mt-14">
        {STEPS.map((s, i) => (
          <div
            key={s.t}
            className="sticky top-[14vh] pb-6 md:top-[12vh]"
            style={{ zIndex: i + 1 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="border border-line bg-panel p-6 shadow-[0_-20px_60px_rgba(0,0,0,0.35)] md:min-h-[46vh] md:p-12"
            >
              <div className="flex items-start justify-between">
                <span className="label">Stage {String(i + 1).padStart(2, "0")}</span>
                <span className="display text-[clamp(2rem,6vw,5rem)] text-transparent" style={{ WebkitTextStroke: "1.5px var(--line)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-6 grid gap-6 md:mt-10 md:grid-cols-12 md:items-end">
                <h3 className="display col-span-full text-[clamp(2.2rem,8vw,6rem)] md:col-span-6">
                  {s.t}
                </h3>
                <p className="col-span-full max-w-md text-[15px] leading-relaxed text-muted md:col-span-6 md:text-lg">
                  {s.d}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {s.m.map((m) => (
                  <span
                    key={m}
                    className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */
const TIMELINE = [
  {
    y: "2026",
    r: "Independent — building FarhanGPT",
    d: "Shipping my own AI platform while taking on select freelance builds.",
  },
  {
    y: "2024 — 25",
    r: "Senior Frontend Engineer · Pixelforge",
    d: "Led the design-system rewrite and the WebGL marketing platform for three client brands.",
  },
  {
    y: "2022 — 24",
    r: "Full-stack Developer · Bright Labs",
    d: "Owned a realtime analytics product end to end — React, Node, ClickHouse, on-call included.",
  },
  {
    y: "2021",
    r: "Started freelancing",
    d: "First client, first invoice, first all-nighter. Still going.",
  },
];

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="px-5 py-24 md:px-8 md:py-32">
      <SectionHead
        index="06"
        kicker="Trajectory"
        title={
          <>
            Five years,
            <br />
            <span className="font-serif italic lowercase">one obsession</span>
          </>
        }
      />
      <div ref={ref} className="relative mt-14 pl-8 md:pl-0">
        <div className="absolute bottom-0 left-[3px] top-0 w-px bg-line md:left-1/2" />
        <motion.div
          className="absolute bottom-0 left-[3px] top-0 w-px origin-top bg-paper md:left-1/2"
          style={{ scaleY }}
        />
        {TIMELINE.map((t, i) => (
          <Reveal
            key={t.y}
            delay={i * 0.05}
            className={`relative mb-14 md:mb-20 md:w-1/2 ${
              i % 2 === 0 ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14"
            }`}
          >
            <span
              className={`absolute top-2 h-2 w-2 rounded-full bg-paper ${
                i % 2 === 0 ? "-right-1 md:-right-1.5" : "-left-1 md:-left-1.5"
              }`}
            />
            <span className="label">{t.y}</span>
            <h3 className="mt-3 text-xl font-medium md:text-2xl">{t.r}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t.d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FarhanGPT                                                           */
/* ------------------------------------------------------------------ */
export function AISection() {
  return (
    <section id="ai" className="relative overflow-hidden border-y border-line">
      <div className="grid md:grid-cols-2">
        <div className="relative min-h-[320px] md:min-h-[70vh]">
          <img
            src="/images/ai.jpg"
            alt="FarhanGPT"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-ink" />
        </div>

        <div className="flex flex-col justify-center px-5 py-16 md:px-12 md:py-20">
          <span className="label">07 / My own AI</span>
          <MaskLines
            className="display mt-6 text-[clamp(2.4rem,7vw,5.5rem)]"
            lines={["FarhanGPT", "is live"]}
          />
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted md:text-lg">
            My own assistant for help, research and building — grounded in my
            notes, my code and my standards. Ask it anything about a build,
            get an answer that already knows the context.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="https://farhangpt.bond"
                target="_blank"
                rel="noreferrer"
                data-cursor="Launch"
                className="group inline-flex items-center gap-3 rounded-full bg-paper px-7 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-transform"
              >
                farhangpt.bond
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </a>
            </Magnetic>
            <span className="label">Free to try</span>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-px border border-line bg-line">
            {[
              ["24/7", "Always on"],
              ["∞", "Context aware"],
              ["0", "Ads, ever"],
            ].map(([a, b]) => (
              <div key={b} className="bg-ink px-3 py-4">
                <div className="display text-2xl md:text-4xl">{a}</div>
                <div className="label mt-1">{b}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */
const QUOTES = [
  {
    q: "Farhan rebuilt our storefront in six weeks and cut load time by 70%. He argues about pixels and he's usually right.",
    n: "Sara Whitfield",
    r: "Head of Product, Nova",
  },
  {
    q: "The only contractor who shipped documentation we actually read. Handover was painless.",
    n: "Imran Malik",
    r: "CTO, Bright Labs",
  },
  {
    q: "Our dashboard went from 'fine' to 'demo-worthy'. Clients now ask who built it.",
    n: "Elena Ruiz",
    r: "Founder, Pulse",
  },
  {
    q: "Fast, opinionated, and genuinely fun to work with. The motion layer alone doubled our demo conversions.",
    n: "Tom Okafor",
    r: "Creative Director, Kine",
  },
];

export function Testimonials() {
  const rowA = QUOTES.slice(0, 2);
  const rowB = QUOTES.slice(2);

  const Card = ({ q, n, r }: { q: string; n: string; r: string }) => (
    <figure className="mx-3 flex w-[min(85vw,420px)] shrink-0 flex-col justify-between border border-line bg-panel p-7">
      <blockquote className="font-serif text-lg italic leading-snug md:text-xl">
        “{q}”
      </blockquote>
      <figcaption className="mt-6">
        <div className="text-sm font-medium">{n}</div>
        <div className="label mt-1">{r}</div>
      </figcaption>
    </figure>
  );

  return (
    <section className="py-24 md:py-32">
      <div className="px-5 md:px-8">
        <SectionHead
          index="08"
          kicker="Kind words"
          title={
            <>
              What clients
              <br />
              <span className="font-serif italic lowercase">say after launch</span>
            </>
          }
        />
      </div>

      <div className="mt-14 overflow-hidden">
        <div className="flex w-max animate-[marquee_46s_linear_infinite] gap-0 hover:[animation-play-state:paused]">
          {[...rowA, ...rowA, ...rowA].map((t, i) => (
            <Card key={`a${i}`} {...t} />
          ))}
        </div>
        <div className="mt-6 flex w-max animate-[marquee_54s_linear_infinite_reverse] gap-0">
          {[...rowB, ...rowB, ...rowB].map((t, i) => (
            <Card key={`b${i}`} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */
export function Contact() {
  const [state, setState] = useState<
    "idle" | "sending" | "ok" | "error"
  >("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong");
      setState("ok");
      setMsg("Message landed. I reply within a day.");
      form.reset();
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const field =
    "w-full border-b border-line bg-transparent px-0 py-4 text-lg outline-none transition-colors placeholder:text-muted/70 focus:border-paper";

  return (
    <section id="contact" className="px-5 py-24 md:px-8 md:py-32">
      <SectionHead
        index="09"
        kicker="Contact"
        title={
          <>
            Got something
            <br />
            <span className="font-serif italic lowercase">worth building?</span>
          </>
        }
        intro="Tell me about the project. No forms into a void — every message lands in my inbox."
      />

      <div className="mt-14 grid gap-12 md:grid-cols-12">
        <form onSubmit={onSubmit} className="md:col-span-7">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="label">Your name</span>
              <input name="name" required placeholder="Jane Doe" className={field} />
            </label>
            <label className="block">
              <span className="label">Email</span>
              <input
                name="email"
                type="email"
                required
                placeholder="jane@studio.com"
                className={field}
              />
            </label>
          </div>
          <label className="mt-6 block">
            <span className="label">Subject</span>
            <input name="subject" placeholder="New web app" className={field} />
          </label>
          <label className="mt-6 block">
            <span className="label">Message</span>
            <textarea
              name="body"
              required
              rows={4}
              placeholder="What are we building?"
              className={`${field} resize-none`}
            />
          </label>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Magnetic>
              <button
                type="submit"
                disabled={state === "sending"}
                data-cursor="Send"
                className="inline-flex items-center gap-3 rounded-full bg-paper px-8 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink disabled:opacity-60"
              >
                {state === "sending" ? "Sending…" : "Send message"}
                <span>→</span>
              </button>
            </Magnetic>
            {msg && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`font-mono text-[11px] uppercase tracking-[0.14em] ${
                  state === "error" ? "text-red-500" : "text-muted"
                }`}
              >
                {msg}
              </motion.span>
            )}
          </div>
        </form>

        <div className="md:col-span-5 md:pl-8">
          <div className="border-t border-line pt-5">
            <span className="label">Direct</span>
            <a
              href="mailto:hello@farhan.dev"
              data-cursor="Mail"
              className="mt-3 block text-xl underline decoration-line underline-offset-4 md:text-2xl"
            >
              hello@farhan.dev
            </a>
          </div>
          <div className="mt-8 border-t border-line pt-5">
            <span className="label">AI assistant</span>
            <a
              href="https://farhangpt.bond"
              target="_blank"
              rel="noreferrer"
              data-cursor="Visit"
              className="mt-3 block text-xl underline decoration-line underline-offset-4 md:text-2xl"
            >
              farhangpt.bond
            </a>
          </div>
          <div className="mt-8 border-t border-line pt-5">
            <span className="label">Elsewhere</span>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {["GitHub", "LinkedIn", "X / Twitter", "Dribbble"].map((s) => (
                <a
                  key={s}
                  href="#contact"
                  className="text-sm text-muted transition-colors hover:text-paper"
                >
                  {s} ↗
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 border-t border-line pt-5">
            <span className="label">Availability</span>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Booking projects for <span className="text-paper">Q2 2026</span>.
              Typical engagement: 4–12 weeks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */
export function Footer() {
  return (
    <footer className="border-t border-line px-5 pb-8 pt-20 md:px-8">
      <Marquee
        bordered={false}
        items={["Full-stack", "WebGL", "Motion", "AI products", "Design systems", "Performance"]}
        className="mb-16"
      />

      <div className="overflow-hidden">
        <motion.a
          href="https://farhangpt.bond"
          target="_blank"
          rel="noreferrer"
          data-cursor="FarhanGPT"
          initial={{ y: "22%", opacity: 0 }}
          whileInView={{ y: "0%", opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="display block text-center text-[clamp(4rem,26vw,22rem)] leading-[0.8] hover:text-transparent"
          style={{ WebkitTextStroke: "1.5px var(--fg)" }}
        >
          FARHAN
        </motion.a>
      </div>

      <div className="mt-10 flex flex-col gap-6 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {[
            { l: "Work", h: "#work" },
            { l: "About", h: "#about" },
            { l: "Process", h: "#process" },
            { l: "Contact", h: "#contact" },
            { l: "farhangpt.bond", h: "https://farhangpt.bond" },
          ].map((x) => (
            <a
              key={x.l}
              href={x.h}
              target={x.h.startsWith("http") ? "_blank" : undefined}
              rel={x.h.startsWith("http") ? "noreferrer" : undefined}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-paper"
            >
              {x.l}
            </a>
          ))}
        </div>
        <span className="label">
          © {new Date().getFullYear()} Farhan — built from scratch
        </span>
      </div>
    </footer>
  );
}
