"use client";

import { motion } from "framer-motion";
import { SectionIndex } from "./SectionIndex";

type Status = "Building" | "Research" | "Internship" | "Hackathon" | "Live" | "Paused";

type ProjectLink = {
  label: string;
  href: string;
};

type Project = {
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  status: Status;
  links: ProjectLink[];
  highlight?: boolean; // gets extra glow + larger card on desktop
};

const STATUS_STYLE: Record<Status, { fg: string; bg: string; dot: string }> = {
  Building: { fg: "#fcd34d", bg: "rgba(245, 158, 11, 0.12)", dot: "#f59e0b" },
  Research: { fg: "#a5b4fc", bg: "rgba(99, 102, 241, 0.12)", dot: "#6366f1" },
  Internship: { fg: "#ddd6fe", bg: "rgba(167, 139, 250, 0.12)", dot: "#a78bfa" },
  Hackathon: { fg: "#fdba74", bg: "rgba(251, 146, 60, 0.12)", dot: "#fb923c" },
  Live: { fg: "#86efac", bg: "rgba(34, 197, 94, 0.12)", dot: "#22c55e" },
  Paused: { fg: "rgba(232,230,225,0.7)", bg: "rgba(255,255,255,0.04)", dot: "rgba(232,230,225,0.5)" },
};

const FEATURED: Project[] = [
  {
    title: "Doop (at Pointy)",
    tagline: "Offline-AI meeting notes · 2026, just started",
    description:
      "Working with Pointy, a startup building an all-in-one app of offline AI tools for the broader marketplace. My piece is Doop, a Granola clone for AI meeting notes that runs entirely offline. No internet calls. Models are preloaded locally and fine-tuned on the fly. A friend put me onto the project a few days ago and we're still scoping the first build.",
    stack: ["Local LLMs", "Fine-tuning", "Offline-first"],
    status: "Building",
    links: [],
    highlight: true,
  },
  {
    title: "Vision Transformer Interpretability",
    tagline: "Mechanistic interpretability research · UMiami",
    description:
      "Designing an interpretability framework for Vision Transformers using Sparse Autoencoders and spectral decomposition. SVD on query–key interaction matrices (W_qᵀ W_k) to analyze dominant attention modes and representation geometry. Layer-wise pipeline studying how transformer representations evolve from low-level perceptual grouping to higher-level reasoning. Researching under Dr. Vanessa Aguiar-Pulido.",
    stack: ["PyTorch", "Sparse Autoencoders", "SVD", "Python"],
    status: "Research",
    links: [],
    highlight: true,
  },
  {
    title: "3rd-i: AI/ML Engineering",
    tagline: "Internship · May to Nov 2025",
    description:
      "Three shipped products at 3rd-i. First, on-device audio/video threat detection (~1.2M parameters, ~95% accuracy on weapons/harassment, sub-3-second alerts pipelined to automated 911 dispatch). Real-time safety improved by 70%. Second, a full Ambassador referral system with Branch SDK and Stripe payments. Python backend, React/TypeScript live dashboards, which cut admin overhead by 40% and raised marketing ROI to 35%. Third, SwiftUI Lock-Screen widgets with GPS and Low-Power optimizations that boosted engagement by 60%.",
    stack: ["SwiftUI", "Python", "AWS", "React/TS", "Branch SDK", "Stripe"],
    status: "Internship",
    links: [{ label: "3rd-i.com", href: "https://3rd-i.com" }],
    highlight: true,
  },
  {
    title: "Reciprocal",
    tagline: "Reverse-hiring marketplace · 2026, prototype paused",
    description:
      "Started Reciprocal in early 2026 and prototyped a reverse-hiring marketplace where companies apply to candidates and every offer carries a binding timeline. Shipped a Next.js 15 build in five weeks: animated editorial landing, fake-auth flow, 5-step onboarding, candidate dashboard, employer dashboard with ranked pipeline, 5-tier pricing ladder, and Electron scaffolding for Mac App Store distribution. Brutalist design system, and a custom anime.js v4 scroll-reveal hook. I paused after the prototype because the unit economics didn't pencil out. Glad I built it, glad I paused. The design and architecture work carries over.",
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "anime.js v4", "Electron"],
    status: "Paused",
    links: [],
  },
  {
    title: "IntelligentTrader",
    tagline: "Horizon AI Hackathon · Feb 2025",
    description:
      "Random Forest on fundamental financial data with a custom Earnings Report Score (ERS) target: MinMax-scaled features plus aggregated and sequential differentials to grade document quality over time. Added an LSTM with feature-weighting and sequence-length tuning to improve pattern detection and reduce overfitting over the baseline.",
    stack: ["TypeScript", "Python", "Random Forest", "LSTM"],
    status: "Hackathon",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Hersh3yBar/FrontEndStockPrediction",
      },
    ],
  },
  {
    title: "RELaiTe.co",
    tagline: "ShellHacks Hackathon · Sep 2024",
    description:
      "Mental-health app built in 48 hours. React frontend; Node.js backend orchestrating a C++ storage module and Python refresh jobs; Google Gemini API powering the motivational-quotes engine; Firebase/Firestore for state. Stable demo, real engagement.",
    stack: ["React", "Node.js", "C++", "Python", "Firebase", "Gemini API"],
    status: "Hackathon",
    links: [],
  },
  {
    title: "This Site",
    tagline: "Portfolio · 2026",
    description:
      "Hand-built with Next.js 16, React Three Fiber, Framer Motion, and animejs v4. Custom cursor, scroll-driven particle journey map across six cities, eight hidden easter eggs. Try the Konami code.",
    stack: ["Next.js", "Three.js", "Framer Motion", "animejs", "Tailwind"],
    status: "Live",
    links: [],
  },
];

function StatusPill({ status }: { status: Status }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase"
      style={{
        color: s.fg,
        background: s.bg,
        letterSpacing: "0.12em",
        border: `1px solid ${s.dot}33`,
      }}
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{
          background: s.dot,
          boxShadow:
            status === "Building" || status === "Live"
              ? `0 0 8px ${s.dot}`
              : undefined,
        }}
      />
      {status}
    </span>
  );
}

function ProjectCard({ project, idx }: { project: Project; idx: number }) {
  const accent = STATUS_STYLE[project.status].dot;
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
      onMouseMove={handleMouseMove}
      className={`glass-card spotlight group relative flex h-full flex-col rounded-2xl p-6 transition-shadow md:p-7 ${
        project.highlight ? "lg:col-span-2" : ""
      }`}
      style={{
        borderColor: project.highlight ? `${accent}44` : "var(--card-border)",
        boxShadow: project.highlight ? `0 0 32px ${accent}1f` : undefined,
      }}
      data-cursor-hover
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3
            className="text-lg font-semibold md:text-xl"
            style={{
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.015em",
              color: "var(--text-primary)",
            }}
          >
            {project.title}
          </h3>
          <p
            className="mt-0.5 text-[13px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {project.tagline}
          </p>
        </div>
        <StatusPill status={project.status} />
      </div>

      <p
        className="mt-4 text-sm leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span
            key={s}
            className="rounded-md px-2 py-0.5 text-[11px] font-medium"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              color: "var(--text-secondary)",
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {project.links.length > 0 && (
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 pt-5">
          {project.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: accent }}
              data-cursor-hover
            >
              {l.label}
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover/link:translate-x-0.5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </motion.article>
  );
}

export function Projects() {
  return (
    <section
      id="projects"
      className="relative mx-auto max-w-6xl px-6 py-24 md:py-32 lg:px-12"
    >
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <SectionIndex num="04" label="Selected Work" />
          <h2
            className="text-3xl md:text-5xl"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
            Featured Work
          </h2>
          <p
            className="mt-3 max-w-2xl text-sm leading-relaxed md:text-[15px]"
            style={{ color: "var(--text-secondary)" }}
          >
            A mix of research, shipped product, and hackathon experiments. A lot
            of what I work on lives in private repos right now (research code,
            client work, and Reciprocal in stealth), so the public GitHub is
            only a slice. The featured items below have links where they exist;
            anything else, happy to walk through over a call.
          </p>
        </motion.div>

        <motion.a
          href="https://github.com/Hersh3yBar"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="inline-flex shrink-0 items-center gap-2 self-start text-sm transition-colors hover:text-[color:var(--text-primary)]"
          style={{ color: "var(--text-secondary)" }}
          data-cursor-hover
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55 0-.27-.01-1.18-.02-2.14-3.2.69-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.27-5.24-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.39.97.01 1.95.14 2.86.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.39-2.69 5.36-5.25 5.64.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
          </svg>
          github.com/Hersh3yBar →
        </motion.a>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-2">
        {FEATURED.map((p, i) => (
          <ProjectCard key={p.title} project={p} idx={i} />
        ))}
      </div>
    </section>
  );
}
