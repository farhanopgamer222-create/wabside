"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const PASSWORD = "Farhan213";

type Project = {
  id: number;
  title: string;
  slug: string;
  category: string;
  year: string;
  description: string;
  stack: string;
  image: string;
  url: string | null;
  featured: boolean;
  order: number;
};

type Message = {
  id: number;
  name: string;
  email: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
};

type Draft = {
  title: string;
  category: string;
  year: string;
  description: string;
  stack: string;
  image: string;
  url: string;
  featured: boolean;
  order: number;
};

const EMPTY: Draft = {
  title: "",
  category: "",
  year: String(new Date().getFullYear()),
  description: "",
  stack: "",
  image: "/images/p1.jpg",
  url: "",
  featured: false,
  order: 0,
};

const inputCls =
  "w-full border border-line bg-panel px-3 py-2.5 text-sm text-paper outline-none transition-colors placeholder:text-muted focus:border-paper";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<"projects" | "messages">("projects");

  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<typeof EMPTY>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  const say = useCallback((t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(""), 2600);
  }, []);

  const load = useCallback(async (password: string) => {
    const headers = { "x-admin-password": password };
    const [p, m] = await Promise.all([
      fetch("/api/projects", { headers }).then((r) => r.json()),
      fetch("/api/contact", { headers }).then((r) => r.json()),
    ]);
    if (Array.isArray(p)) setProjects(p);
    if (Array.isArray(m)) setMessages(m);
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("farhan-admin-pass");
      if (saved === PASSWORD) {
        setAuthed(true);
        void load(saved);
      }
    } catch {
      /* ignore */
    }
  }, [load]);

  function submitPass(e: React.FormEvent) {
    e.preventDefault();
    if (pass === PASSWORD) {
      setAuthed(true);
      setErr("");
      sessionStorage.setItem("farhan-admin-pass", PASSWORD);
      void load(PASSWORD);
    } else {
      setErr("Incorrect password.");
    }
  }

  function logout() {
    sessionStorage.removeItem("farhan-admin-pass");
    setAuthed(false);
    setPass("");
  }

  async function call(url: string, method: string, body?: unknown) {
    setBusy(true);
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": PASSWORD,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      await load(PASSWORD);
      return true;
    } catch (e) {
      say(e instanceof Error ? e.message : "Request failed");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function saveProject(e: React.FormEvent) {
    e.preventDefault();
    const ok = await call(
      editing ? "/api/projects" : "/api/projects",
      editing ? "PATCH" : "POST",
      editing ? { id: editing, project: draft } : { project: draft },
    );
    if (ok) {
      say(editing ? "Project updated" : "Project created");
      setEditing(null);
      setDraft(EMPTY);
    }
  }

  const unread = messages.filter((m) => !m.read).length;

  /* -------------------------------------------------- login ------ */
  if (!authed) {
    return (
      <div className="grain flex min-h-screen items-center justify-center bg-ink px-5 text-paper">
        <motion.form
          onSubmit={submitPass}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md border border-line bg-panel p-8"
        >
          <div className="flex items-baseline justify-between">
            <span className="display text-3xl">
              FARHAN<span className="blink">.</span>
            </span>
            <span className="label">Admin</span>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted">
            Restricted console. Enter the administrator password to manage
            projects and inbound messages.
          </p>

          <label className="mt-7 block">
            <span className="label">Password</span>
            <input
              autoFocus
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              className={`${inputCls} mt-2 font-mono tracking-[0.3em]`}
            />
          </label>

          {err && (
            <motion.p
              initial={{ x: -8 }}
              animate={{ x: [0, -8, 8, -5, 0] }}
              className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-red-500"
            >
              {err}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-7 w-full bg-paper py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-opacity disabled:opacity-60"
          >
            {busy ? "Checking…" : "Enter console"}
          </button>

          <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
            <Link
              href="/"
              className="label transition-colors hover:!text-paper"
            >
              ← Back to site
            </Link>
            <span className="label">v1.0</span>
          </div>
        </motion.form>
      </div>
    );
  }

  /* -------------------------------------------------- console ---- */
  return (
    <div className="grain min-h-screen bg-ink text-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-baseline gap-3">
            <Link href="/" className="display text-2xl">
              FARHAN
            </Link>
            <span className="label">/ admin console</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-full border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-paper"
            >
              View site
            </Link>
            <button
              onClick={logout}
              className="rounded-full border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-paper"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="display text-[clamp(2.5rem,9vw,6rem)]">Console</h1>

        <div className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-3">
          {[
            { n: projects.length, l: "Projects" },
            { n: messages.length, l: "Messages" },
            { n: unread, l: "Unread" },
          ].map((s) => (
            <div key={s.l} className="bg-ink px-5 py-6">
              <div className="display text-[clamp(2rem,5vw,3.5rem)] tabular-nums">
                {String(s.n).padStart(2, "0")}
              </div>
              <div className="label mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-6 border-b border-line">
          {(["projects", "messages"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative pb-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                tab === t ? "text-paper" : "text-muted hover:text-paper"
              }`}
            >
              {t}
              {t === "messages" && unread > 0 && (
                <span className="ml-2 rounded-full bg-paper px-1.5 py-0.5 text-[9px] text-ink">
                  {unread}
                </span>
              )}
              {tab === t && (
                <motion.span
                  layoutId="tab"
                  className="absolute inset-x-0 -bottom-px h-px bg-paper"
                />
              )}
            </button>
          ))}
        </div>

        {/* ------------------------------------------------ projects */}
        {tab === "projects" && (
          <section className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="label">
                {editing !== null ? "Editing project" : "All projects"}
              </span>
              {!editing && (
                <button
                  onClick={() => {
                    setDraft(EMPTY);
                    setEditing(0);
                  }}
                  className="bg-paper px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink"
                >
                  + New project
                </button>
              )}
            </div>

            <AnimatePresence>
              {editing !== null && (
                <motion.form
                  onSubmit={saveProject}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-5 overflow-hidden border border-line bg-panel"
                >
                  <div className="grid gap-4 p-5 md:grid-cols-2">
                    <label className="block">
                      <span className="label">Title *</span>
                      <input
                        required
                        className={`${inputCls} mt-2`}
                        value={draft.title}
                        onChange={(e) =>
                          setDraft({ ...draft, title: e.target.value })
                        }
                      />
                    </label>
                    <label className="block">
                      <span className="label">Category *</span>
                      <input
                        required
                        className={`${inputCls} mt-2`}
                        value={draft.category}
                        onChange={(e) =>
                          setDraft({ ...draft, category: e.target.value })
                        }
                      />
                    </label>
                    <label className="block">
                      <span className="label">Year</span>
                      <input
                        className={`${inputCls} mt-2`}
                        value={draft.year}
                        onChange={(e) =>
                          setDraft({ ...draft, year: e.target.value })
                        }
                      />
                    </label>
                    <label className="block">
                      <span className="label">Order</span>
                      <input
                        type="number"
                        className={`${inputCls} mt-2`}
                        value={draft.order}
                        onChange={(e) =>
                          setDraft({ ...draft, order: Number(e.target.value) })
                        }
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="label">Stack</span>
                      <input
                        className={`${inputCls} mt-2`}
                        placeholder="Next.js, Postgres, Stripe"
                        value={draft.stack}
                        onChange={(e) =>
                          setDraft({ ...draft, stack: e.target.value })
                        }
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="label">Description</span>
                      <textarea
                        rows={3}
                        className={`${inputCls} mt-2 resize-none`}
                        value={draft.description}
                        onChange={(e) =>
                          setDraft({ ...draft, description: e.target.value })
                        }
                      />
                    </label>
                    <label className="block">
                      <span className="label">Image path</span>
                      <input
                        className={`${inputCls} mt-2`}
                        placeholder="/images/p1.jpg"
                        value={draft.image}
                        onChange={(e) =>
                          setDraft({ ...draft, image: e.target.value })
                        }
                      />
                    </label>
                    <label className="block">
                      <span className="label">External URL</span>
                      <input
                        className={`${inputCls} mt-2`}
                        placeholder="https://…"
                        value={draft.url}
                        onChange={(e) =>
                          setDraft({ ...draft, url: e.target.value })
                        }
                      />
                    </label>
                    <label className="flex items-center gap-3 md:col-span-2">
                      <input
                        type="checkbox"
                        checked={draft.featured}
                        onChange={(e) =>
                          setDraft({ ...draft, featured: e.target.checked })
                        }
                        className="h-4 w-4 accent-[var(--fg)]"
                      />
                      <span className="label">Featured project</span>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-3 border-t border-line p-5">
                    <button
                      type="submit"
                      disabled={busy}
                      className="bg-paper px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink disabled:opacity-60"
                    >
                      {busy ? "Saving…" : editing ? "Update" : "Create"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(null);
                        setDraft(EMPTY);
                      }}
                      className="border border-line px-6 py-3 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors hover:border-paper"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-6 border-t border-line">
              {projects.length === 0 && (
                <p className="py-10 text-center text-sm text-muted">
                  No projects yet.
                </p>
              )}
              {projects.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex flex-col gap-4 border-b border-line py-5 md:flex-row md:items-center"
                >
                  <img
                    src={p.image}
                    alt=""
                    className="h-16 w-24 shrink-0 border border-line object-cover grayscale"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="display text-2xl">{p.title}</h3>
                      {p.featured && (
                        <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em]">
                          featured
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-sm text-muted">
                      {p.category} · {p.year} · {p.stack}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(p.id);
                        setDraft({
                          title: p.title,
                          category: p.category,
                          year: p.year,
                          description: p.description,
                          stack: p.stack,
                          image: p.image,
                          url: p.url ?? "",
                          featured: p.featured,
                          order: p.order,
                        });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-paper"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Delete “${p.title}”?`)) {
                          const ok = await call(
                            `/api/projects?id=${p.id}`,
                            "DELETE",
                          );
                          if (ok) say("Project deleted");
                        }
                      }}
                      className="border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-red-500 transition-colors hover:border-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ------------------------------------------------ messages */}
        {tab === "messages" && (
          <section className="mt-8">
            <span className="label">Inbox</span>
            <div className="mt-5 border-t border-line">
              {messages.length === 0 && (
                <p className="py-10 text-center text-sm text-muted">
                  No messages yet.
                </p>
              )}
              {messages.map((m) => (
                <motion.article
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border-b border-line py-5 ${m.read ? "opacity-60" : ""}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div className="flex flex-wrap items-baseline gap-3">
                      {!m.read && (
                        <span className="h-2 w-2 rounded-full bg-paper" />
                      )}
                      <h3 className="text-lg font-medium">{m.name}</h3>
                      <a
                        href={`mailto:${m.email}`}
                        className="font-mono text-[11px] text-muted underline decoration-line underline-offset-4"
                      >
                        {m.email}
                      </a>
                    </div>
                    <span className="label">
                      {new Date(m.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {m.subject && (
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                      {m.subject}
                    </p>
                  )}
                  <p className="mt-3 max-w-3xl whitespace-pre-wrap text-[15px] leading-relaxed">
                    {m.body}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() =>
                        call("/api/contact", "PATCH", {
                          id: m.id,
                          read: !m.read,
                        })
                      }
                      className="border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-paper"
                    >
                      Mark {m.read ? "unread" : "read"}
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm("Delete this message?")) {
                          const ok = await call(
                            `/api/contact?id=${m.id}`,
                            "DELETE",
                          );
                          if (ok) say("Message deleted");
                        }
                      }}
                      className="border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-red-500 transition-colors hover:border-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-line bg-panel px-6 py-3 font-mono text-[11px] uppercase tracking-[0.14em]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
