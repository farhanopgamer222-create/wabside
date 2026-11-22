"use client";

import { motion, useScroll, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─────────────────────────── data ─────────────────────────── */

type Project = {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  stack: string;
  image: string;
  url: string | null;
};

const REAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: "FarhanGPT",
    category: "AI Platform",
    year: "2026",
    description:
      "My own AI assistant — streaming chat, multiple models, voice mode, agent mode and a full website builder inside it.",
    stack: "Next.js · OpenRouter · Neon · Cloudflare",
    image: "/images/ai.jpg",
    url: "https://farhangpt.bond",
  },
  {
    id: 2,
    title: "Website Studio",
    category: "AI Tool",
    year: "2026",
    description:
      "Type an idea — FarhanGPT designs a complete website and publishes it live in seconds. This very site was born from it.",
    stack: "AI generation · Instant publish",
    image: "/images/p1.jpg",
    url: "https://farhangpt.bond",
  },
  {
    id: 3,
    title: "FarhanGPT ASTRA",
    category: "AI Model",
    year: "2026",
    description:
      "The premium FarhanGPT mind — 8192 tokens, heavy reasoning and big builds, unlocked with promo codes.",
    stack: "OpenRouter · Promo engine",
    image: "/images/p2.jpg",
    url: "https://farhangpt.bond",
  },
  {
    id: 4,
    title: "Status Engine",
    category: "DevOps",
    year: "2026",
    description:
      "Live health dashboard — app, database, models and services monitored 24/7 with edge-cached checks.",
    stack: "Health checks · Edge cache",
    image: "/images/p3.jpg",
    url: "https://farhangpt.bond/status",
  },
  {
    id: 5,
    title: "Promo Engine",
    category: "System",
    year: "2026",
    description:
      "Atomic promo-code redemption with audit log, rate limiting and server-side model authorization.",
    stack: "Postgres · Transactions",
    image: "/images/p4.jpg",
    url: "https://farhangpt.bond",
  },
  {
    id: 6,
    title: "Wabside",
    category: "Web",
    year: "2026",
    description:
      "This portfolio — glass design, aurora orbs, scroll choreography and DB-driven projects on the edge.",
    stack: "Next.js · Framer Motion · Cloudflare",
    image: "/images/hero.jpg",
    url: null,
  },
];

const MARQUEE_ITEMS = [
  "FarhanGPT",
  "AI Platform",
  "Website Studio",
  "ASTRA",
  "Voice Mode",
  "Agent Mode",
  "Instant Publish",
  "Status 24/7",
  "Promo Engine",
  "Built by Farhan",
];

/* ─────────────────────────── helpers ─────────────────────────── */

const fadeUp = {
  initial: { opacity: 0, y: 42 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.7, ease: EASE },
};

function Logo({ size = 34 }: { size?: number }) {
  return (
    <span className="logo-mark inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0" stopColor="#7c5cff" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="44" height="44" rx="14" stroke="url(#lg)" strokeWidth="2.5" fill="rgba(124,92,255,0.08)" />
        <path d="M16 34V14h16M16 24h12" stroke="url(#lg)" strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="33" cy="33" r="3" fill="#8ff0c0" />
      </svg>
      <span className="display text-xl tracking-tight">
        Farhan<span style={{ color: "#7c5cff" }}>.</span>dev
      </span>
    </span>
  );
}

/* ─────────────────────────── page ─────────────────────────── */

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [projects, setProjects] = useState<Project[]>(REAL_PROJECTS);
  const { scrollYProgress } = useScroll();
  const progress = useMotionValue(0);

  useEffect(() => {
    progress.set(0);
    const unsub = scrollYProgress.on("change", (v) => progress.set(v));
    return unsub;
  }, [progress, scrollYProgress]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("api"))))
      .then((rows: Project[]) => {
        if (Array.isArray(rows) && rows.length > 0) setProjects(rows);
      })
      .catch(() => {
        /* fallback list already set */
      });
  }, []);

  return (
    <div className="grain relative min-h-screen">
      {/* scroll progress */}
      <motion.div className="prog" style={{ scaleX: progress }} />

      {/* nav */}
      <header className={`navbar fixed inset-x-0 top-0 z-50 ${scrolled ? "scrolled" : ""}`}>
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <a href="#top" aria-label="Home">
            <Logo />
          </a>
          <div className="hidden items-center gap-7 md:flex">
            <a href="#work" className="text-sm text-muted transition hover:text-white">Projects</a>
            <a href="#why" className="text-sm text-muted transition hover:text-white">Why me</a>
            <a href="#contact" className="text-sm text-muted transition hover:text-white">Contact</a>
          </div>
          <motion.a
            whileTap={{ scale: 0.95 }}
            href="https://farhangpt.bond"
            className="btn btn-main btn-shine !px-5 !py-2.5 !text-[13px]"
          >
            Try FarhanGPT ⚡
          </motion.a>
        </nav>
      </header>

      {/* hero */}
      <section id="top" className="relative overflow-hidden pt-40 pb-28">
        <div className="orb orb-a" style={{ top: "-120px", left: "-100px" }} />
        <div className="orb orb-b" style={{ top: "60px", right: "-140px" }} />
        <div className="orb orb-c" style={{ bottom: "-160px", left: "35%" }} />

        <div className="relative mx-auto max-w-6xl px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <span className="pill">✦ Available for new projects — 2026</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.12, ease: EASE }}
            className="display mt-8 text-[clamp(3rem,10vw,7rem)]"
          >
            I build <span className="grad-text">cool things</span>
            <br />
            for the web.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.25 }}
            className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted"
          >
            Full-stack developer &amp; maker of <b style={{ color: "#c4b5fd" }}>FarhanGPT</b> — my own
            AI platform. Sites, tools and bots that load fast, move smooth and feel alive.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.38 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <motion.a whileTap={{ scale: 0.96 }} href="#work" className="btn btn-main btn-shine">
              🚀 Explore projects
            </motion.a>
            <motion.a whileTap={{ scale: 0.96 }} href="#contact" className="btn btn-ghost btn-shine">
              Let&apos;s talk →
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4"
          >
            {[
              { n: "1", l: "AI platform live" },
              { n: "6+", l: "Tools shipped" },
              { n: "24/7", l: "Always on" },
              { n: "∞", l: "Ideas loading" },
            ].map((s) => (
              <div key={s.l} className="bg-panel px-4 py-6">
                <div className="display text-3xl grad-text">{s.n}</div>
                <div className="label mt-1.5">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* marquee */}
      <div className="marquee-wrap py-4">
        <div className="marquee gap-10 pr-10">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
            <span key={i} className="display whitespace-nowrap text-2xl text-muted/70">
              {t} <span style={{ color: "#7c5cff" }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* projects */}
      <section id="work" className="relative mx-auto max-w-6xl px-5 py-28">
        <motion.div {...fadeUp}>
          <span className="pill">01 — Selected work</span>
          <h2 className="display mt-5 text-[clamp(2.2rem,6vw,4rem)]">
            Real projects, <span className="grad-text">live right now</span>
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            No mockups, no fake case studies — everything here is shipped and running.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {projects.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 46 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: (i % 2) * 0.12, ease: EASE }}
            >
              <a
                href={p.url ?? "#work"}
                target={p.url ? "_blank" : undefined}
                rel={p.url ? "noreferrer" : undefined}
                className="card block"
              >
                <div className="relative h-52 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.title}
                    className="card-img h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
                  <span className="pill absolute left-4 top-4 !bg-ink/70">{p.category}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="display text-2xl">{p.title}</h3>
                    <span className="label">{p.year}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{p.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-[11px] tracking-wide text-muted/80">{p.stack}</span>
                    <span className="display text-lg" style={{ color: "#22d3ee" }}>↗</span>
                  </div>
                </div>
              </a>
            </motion.article>
          ))}
        </div>
      </section>

      {/* why */}
      <section id="why" className="relative overflow-hidden py-28">
        <div className="orb orb-b" style={{ top: "-100px", left: "-120px", opacity: 0.3 }} />
        <div className="relative mx-auto max-w-6xl px-5">
          <motion.div {...fadeUp}>
            <span className="pill">02 — Why me</span>
            <h2 className="display mt-5 text-[clamp(2.2rem,6vw,4rem)]">
              Fast. Smart. <span className="grad-text">Alive.</span>
            </h2>
          </motion.div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "⚡",
                t: "Speed obsessed",
                d: "Edge caching, tiny bundles and buttery 60fps motion. Slow sites are a choice — I refuse it.",
              },
              {
                icon: "🤖",
                t: "AI inside",
                d: "My own platform, FarhanGPT, powers chat, agents and website building — AI that actually ships.",
              },
              {
                icon: "🛡️",
                t: "Built to last",
                d: "Typed end to end, health-checked 24/7, resilient when things break. Real engineering, not vibes.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
                className="card p-8"
              >
                <div className="text-4xl">{f.icon}</div>
                <h3 className="display mt-5 text-2xl">{f.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-6xl px-5 pb-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="cta-banner relative overflow-hidden p-10 text-center md:p-16"
        >
          <div className="orb orb-a" style={{ top: "-140px", right: "-80px", opacity: 0.35 }} />
          <h2 className="display relative text-[clamp(2.2rem,7vw,4.5rem)]">
            Meet <span className="grad-text">FarhanGPT</span>
            <br />
            my own AI
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-muted">
            Chat, voice, agents, website building — free to try, always on. Ask it anything.
          </p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-4">
            <motion.a
              whileTap={{ scale: 0.96 }}
              href="https://farhangpt.bond"
              className="btn btn-main btn-shine !px-8 !py-4 !text-base"
            >
              ⚡ Open farhangpt.bond
            </motion.a>
            <motion.a
              whileTap={{ scale: 0.96 }}
              href="https://farhangpt.bond/status"
              className="btn btn-ghost btn-shine !px-8 !py-4 !text-base"
            >
              🟢 Live status
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* footer */}
      <footer id="contact" className="border-t border-line py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 text-center">
          <Logo />
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Building the fast, strange, animated corners of the web — one project at a time.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            <a href="https://farhangpt.bond" className="text-sm text-muted transition hover:text-white">
              farhangpt.bond
            </a>
            <a href="https://farhangpt.bond/status" className="text-sm text-muted transition hover:text-white">
              Status
            </a>
            <a href="/farhanadmin" className="text-sm text-muted transition hover:text-white">
              Admin
            </a>
          </div>
          <div className="label">© 2026 Farhan — built with FarhanGPT energy ⚡</div>
        </div>
      </footer>
    </div>
  );
}
