import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Uses · Hrishi Mucherla",
  description:
    "The editor, languages, frameworks, tools, and services I rely on day to day.",
  robots: { index: false, follow: false },
};

type Item = { name: string; note?: string };
type Section = { heading: string; items: Item[] };

const SECTIONS: Section[] = [
  {
    heading: "Languages I write in",
    items: [
      { name: "Python", note: "AI/ML, research, data work, scripting" },
      { name: "TypeScript", note: "Anything I ship to the web" },
      { name: "JavaScript", note: "When I just need to prototype quickly" },
      { name: "Java", note: "Coursework + early projects" },
      { name: "C++", note: "Systems coursework, performance-critical bits" },
      { name: "R", note: "Stats, MIT IDSS case studies" },
      { name: "SQL", note: "Postgres mostly, via Supabase" },
      { name: "HTML / CSS", note: "Always" },
      { name: "PHP", note: "Older projects, won't pick it for new ones" },
    ],
  },
  {
    heading: "Frameworks & libraries",
    items: [
      { name: "Next.js", note: "Default for any new web app (this site too)" },
      { name: "React", note: "The piece I think in" },
      { name: "Node.js" },
      { name: "Tailwind CSS", note: "Every project, no exceptions" },
      { name: "Framer Motion", note: "Whenever the motion needs to feel deliberate" },
      { name: "anime.js v4", note: "Used heavily in the Reciprocal prototype" },
      { name: "Three.js / React Three Fiber", note: "The particle map in the hero" },
      { name: "PyTorch", note: "Vision Transformer interpretability research" },
      { name: "scikit-learn", note: "Random Forest, LSTM baselines" },
      { name: "Pandas / NumPy", note: "Foundational" },
      { name: "SwiftUI", note: "Shipped Lock-Screen widgets at 3rd-i" },
      { name: "Firebase / Firestore", note: "RELaiTe.co at ShellHacks" },
    ],
  },
  {
    heading: "Tools & services",
    items: [
      { name: "Git + GitHub", note: "Version control, code review, hosting" },
      { name: "Vercel", note: "Hosts this site, auto-deploys on push" },
      { name: "Supabase", note: "Postgres + auth for new projects" },
      { name: "AWS", note: "S3, Lambda for production AI/ML deployments at 3rd-i" },
      { name: "Branch SDK", note: "Referral / attribution work at 3rd-i" },
      { name: "Stripe", note: "Payments for the 3rd-i Ambassador system" },
      { name: "Google Gemini API", note: "RELaiTe.co motivational-quotes engine" },
      { name: "Figma", note: "Wireframes, design tokens, light prototyping" },
      { name: "Adobe Photoshop", note: "Asset cleanup, image work" },
    ],
  },
  {
    heading: "Currently exploring",
    items: [
      { name: "Vision Transformers (ViTs)" },
      { name: "Sparse Autoencoders (SAEs)" },
      { name: "Mechanistic Interpretability", note: "With Dr. Vanessa Aguiar-Pulido at UMiami" },
      { name: "Offline-first AI", note: "Doop at Pointy — preloaded local models" },
      { name: "Causal inference, MLOps, WebGL shaders" },
    ],
  },
  {
    heading: "This portfolio",
    items: [
      { name: "Next.js 16 (App Router)" },
      { name: "React 19 + TypeScript" },
      { name: "Tailwind v4 + shadcn/ui" },
      { name: "Framer Motion + anime.js v4" },
      { name: "Three.js via R3F", note: "The hero life-journey particle map" },
      { name: "Lenis", note: "Smooth scroll" },
      { name: "Supabase", note: "Contact form" },
      { name: "Vercel", note: "Auto-deploys on push to GitHub" },
    ],
  },
  {
    heading: "Editor / OS / Setup",
    items: [
      { name: "macOS", note: "Daily driver" },
      { name: "Cursor", note: "Main editor — AI-native, fast" },
      { name: "VS Code", note: "Still around for non-AI work" },
      { name: "Claude Code", note: "Pair programmer in the terminal" },
      { name: "iTerm + zsh", note: "Primary terminal — what I open by default" },
      { name: "Warp", note: "When I want blocks and AI in the terminal" },
      { name: "Chrome + DevTools", note: "Default browser, dev work" },
      { name: "Notion", note: "Notes, project planning" },
      {
        name: "Hardware",
        note: "MacBook Pro M2 Max, 14-inch, 1TB",
      },
    ],
  },
];

export default function UsesPage() {
  return (
    <>
      {/* You found /uses. Nice. */}
      <main className="mx-auto max-w-3xl px-6 py-32 lg:px-12">
        <h1
          className="text-5xl md:text-7xl"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}
        >
          Uses
        </h1>
        <p
          className="mt-4 text-base leading-relaxed md:text-lg"
          style={{ color: "var(--text-secondary)", maxWidth: "60ch" }}
        >
          The editor, languages, frameworks, tools, and services I rely on day to day.
          Inspired by{" "}
          <a
            href="https://uses.tech"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)" }}
            className="underline"
          >
            uses.tech
          </a>
          . This list changes; what&apos;s here is the honest current snapshot.
        </p>

        <div className="mt-16 space-y-14">
          {SECTIONS.map((sec) => (
            <section key={sec.heading}>
              <h2
                className="mb-5 text-sm font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-secondary)" }}
              >
                {sec.heading}
              </h2>
              <ul
                className="divide-y rounded-2xl"
                style={{
                  borderColor: "var(--card-border)",
                  background: "var(--card-bg)",
                  border: "1px solid var(--card-border)",
                }}
              >
                {sec.items.map((it, i) => (
                  <li
                    key={i}
                    className="flex flex-col gap-1 px-5 py-4 text-sm md:flex-row md:items-baseline md:justify-between md:gap-6"
                    style={{ borderColor: "var(--card-border)" }}
                  >
                    <span
                      className="font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {it.name}
                    </span>
                    {it.note ? (
                      <span
                        className="md:text-right"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {it.note}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p
          className="mt-20 text-xs uppercase"
          style={{
            color: "var(--text-muted)",
            letterSpacing: "0.22em",
            fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
          }}
        >
          ←{" "}
          <Link
            href="/"
            className="underline"
            style={{ color: "var(--text-secondary)" }}
          >
            back home
          </Link>
        </p>
      </main>
    </>
  );
}
