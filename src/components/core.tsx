"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useInView,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Preloader                                                           */
/* ------------------------------------------------------------------ */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("farhan-seen")) {
      setDone(true);
      return;
    }
    let p = 0;
    const id = window.setInterval(() => {
      p += 6 + Math.random() * 20;
      if (p >= 100) {
        p = 100;
        window.clearInterval(id);
        window.setTimeout(() => {
          sessionStorage.setItem("farhan-seen", "1");
          setDone(true);
        }, 500);
      }
      setPct(Math.floor(p));
    }, 70);
    return () => window.clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="pre"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-6 py-6 text-paper"
          exit={{ y: "-101%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-start justify-between">
            <span className="label">FARHAN — PORTFOLIO</span>
            <span className="label">LOADING</span>
          </div>

          <div className="flex items-end gap-4">
            <span className="display text-[clamp(4rem,22vw,18rem)] tabular-nums">
              {String(pct).padStart(3, "0")}
            </span>
            <span className="label mb-6">%</span>
          </div>

          <div>
            <div className="h-px w-full bg-line">
              <motion.div
                className="h-px bg-paper"
                style={{ width: `${pct}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            <div className="mt-3 flex justify-between">
              <span className="label">FULL-STACK / 3D / AI</span>
              <span className="label">FARHANGPT.BOND</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Custom cursor                                                       */
/* ------------------------------------------------------------------ */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 450, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 450, damping: 40, mass: 0.4 });
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest?.(
        "[data-cursor]",
      ) as HTMLElement | null;
      setLabel(t ? t.dataset.cursor ?? "" : null);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-paper/60"
        animate={{
          width: label ? 96 : 26,
          height: label ? 96 : 26,
          backgroundColor: label ? "rgba(244,242,237,0.92)" : "rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        <span
          className="font-mono text-[10px] uppercase tracking-[0.14em]"
          style={{ opacity: label ? 1 : 0, color: "#08080a" }}
        >
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll progress bar                                                 */
/* ------------------------------------------------------------------ */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const w = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  return (
    <motion.div
      className="fixed left-0 top-0 z-[80] h-[2px] w-full origin-left bg-paper"
      style={{ scaleX: w }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Theme toggle                                                        */
/* ------------------------------------------------------------------ */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const cur = document.documentElement.getAttribute("data-theme");
    setTheme(cur === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("farhan-theme", next);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle colour theme"
      data-cursor={theme === "dark" ? "Light" : "Dark"}
      className="group flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-paper"
    >
      <span className="relative block h-3.5 w-3.5 overflow-hidden">
        <motion.span
          className="absolute inset-0 rounded-full border border-paper"
          animate={{ scale: theme === "dark" ? 1 : 0, opacity: theme === "dark" ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="absolute inset-0 rounded-full bg-paper"
          animate={{ scale: theme === "light" ? 1 : 0, opacity: theme === "light" ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */
const NAV = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "AI", href: "#ai" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-all duration-500 ${
          solid
            ? "border-b border-line bg-ink/80 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 md:px-8">
          <Link
            href="/"
            data-cursor="Top"
            className="display text-2xl leading-none tracking-tight md:text-3xl"
          >
            FARHAN<span className="blink">.</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="group relative font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-paper"
              >
                {n.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-paper transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://farhangpt.bond"
              target="_blank"
              rel="noreferrer"
              data-cursor="Open"
              className="hidden rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-all hover:border-paper hover:bg-paper hover:text-ink sm:block"
            >
              FarhanGPT ↗
            </a>
            <ThemeToggle />
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full border border-line transition-colors hover:border-paper md:hidden"
            >
              <span className="h-px w-4 bg-paper" />
              <span className="h-px w-4 bg-paper" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[75] flex flex-col bg-ink px-6 py-6 text-paper md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="display text-2xl">FARHAN.</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-xl"
              >
                ×
              </button>
            </div>
            <nav className="mt-auto flex flex-col gap-1 pb-8">
              {NAV.map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  className="display border-b border-line py-3 text-[clamp(2.5rem,14vw,5rem)]"
                >
                  {n.label}
                </motion.a>
              ))}
              <a
                href="https://farhangpt.bond"
                target="_blank"
                rel="noreferrer"
                className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-muted"
              >
                farhangpt.bond ↗
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal                                                              */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  y = 44,
  className = "",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* Masked line-by-line text reveal */
export function MaskLines({
  lines,
  className = "",
  delay = 0,
}: {
  lines: string[];
  className?: string;
  delay?: number;
}) {
  return (
    <span className={`block ${className}`}>
      {lines.map((l, i) => (
        <span key={l + i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 0.95,
              delay: delay + i * 0.09,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Marquee                                                             */
/* ------------------------------------------------------------------ */
export function Marquee({
  items,
  reverse = false,
  big = false,
  bordered = true,
  className = "",
}: {
  items: string[];
  reverse?: boolean;
  big?: boolean;
  bordered?: boolean;
  className?: string;
}) {
  const row = [...items, ...items];
  return (
    <div
      className={`relative overflow-hidden py-4 ${
        bordered ? "border-y border-line" : ""
      } ${className}`}
    >
      <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
        {row.map((t, i) => (
          <span
            key={i}
            className={`flex shrink-0 items-center gap-6 pr-6 ${
              big ? "display text-[clamp(2.5rem,7vw,6rem)]" : "font-mono text-sm uppercase tracking-[0.2em] text-muted"
            }`}
          >
            {t}
            <span aria-hidden className={big ? "text-2xl" : "text-paper"}>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section heading                                                     */
/* ------------------------------------------------------------------ */
export function SectionHead({
  index,
  kicker,
  title,
  intro,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  intro?: string;
}) {
  return (
    <div className="border-t border-line pt-6">
      <div className="flex items-baseline justify-between">
        <span className="label">
          {index} / {kicker}
        </span>
        <span className="label">FARHAN</span>
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-12">
        <h2 className="display col-span-full text-[clamp(2.6rem,9vw,8rem)] md:col-span-8">
          {title}
        </h2>
        {intro && (
          <Reveal className="col-span-full md:col-span-4 md:pt-3">
            <p className="max-w-sm text-[15px] leading-relaxed text-muted md:text-base">
              {intro}
            </p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Counter                                                             */
/* ------------------------------------------------------------------ */
export function Counter({
  to,
  suffix = "",
  duration = 1800,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic wrapper                                                    */
/* ------------------------------------------------------------------ */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
