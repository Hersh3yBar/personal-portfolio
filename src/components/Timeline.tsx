"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { animate, scrambleText } from "animejs";
import { SectionIndex } from "./SectionIndex";

type Card = {
  title: string;
  year: string;
  description: string;
  emphasized?: boolean;
};

type Era = {
  id: string;
  emoji: string;
  title: string;
  range: string;
  accent: string;
  cards: Card[];
  isHome?: boolean;
  isCollege?: boolean;
  isCurrent?: boolean;
};

const ERAS: Era[] = [
  {
    id: "pre-college",
    emoji: "🏆",
    title: "Before college",
    range: "2017 – 2023",
    accent: "#818cf8",
    cards: [
      {
        title: "Missouri National Geographic Bee, State Semifinalist",
        year: "2017",
        description:
          "One of up to 100 students invited by the National Geographic Society to the Missouri state bee. Among the top geography students in the state, out of thousands competing statewide. (Geography has stuck with me since.)",
      },
      {
        title: "MCTM State Math Championship, 4th in 8th-Grade Target Round",
        year: "March 2019",
        description:
          "Placed 4th in the 8th-grade Target Round at the Missouri MCTM-sponsored state math championship at the Barstow School in Kansas City. Parkway West Middle swept the top 4 spots in 8th-grade Target. Result still archived publicly at mathleague.org (event 5064).",
        emphasized: true,
      },
      {
        title: "Harvard International Relations Scholars Program",
        year: "Summer 2021",
        description:
          "Three-week Harvard program on the intersection of business and politics. Case studies on Blackstone and the BBC, taught by former world leaders and U.S. Embassy ambassadors. Concluded with a student-procured policy memo on stimulating economic aspirations across the U.S. and Europe.",
        emphasized: true,
      },
      {
        title: "Software Application Developer at STEM METS (Lagos, Nigeria)",
        year: "Summer 2022",
        description:
          "Designed a new GUI and interface for STEM METS, a Nigerian educational company helping hundreds of thousands of West Africans and Nigerians get into STEM occupations. Stack: Java, Python, HTML/CSS, .NET Framework, Azure DevOps.",
      },
      {
        title: "Published AI Research in IJHSR (Lumiere Scholar)",
        year: "Summer 2022",
        description:
          "Through the Lumiere Education Research Scholar program, published a paper in the International Journal of High School Research on the implications of AI for businesses slow to adapt to technological interfaces. Mentored by Aardra Chandra Mouli at University College London.",
        emphasized: true,
      },
    ],
  },
  {
    id: "miami-academics",
    emoji: "🎓",
    title: "University of Miami",
    range: "2023 – 2026",
    accent: "#a78bfa",
    cards: [
      {
        title: "President's Scholar, Dean's List, Provost's List",
        year: "Aug 2023 to Present",
        description:
          "Awarded a 50% academic tuition scholarship at the University of Miami. Inducted into Alpha Lambda Delta (First-Year Honor Society). Named to the Dean's List every semester, and earned the Provost's List (the distinction above Dean's List) in Fall 2025.",
      },
      {
        title: "Calculus III and Differential Equations at Washington University in St. Louis",
        year: "Summer 2024",
        description:
          "Completed Calculus III and Differential Equations at WashU's College of Arts and Sciences Summer Session. 4.0 GPA.",
      },
      {
        title: "RELaiTe.co at ShellHacks 2024",
        year: "Sep 2024",
        description:
          "Built a mental-health app in 48 hours using Google Gemini API and Firebase/Firestore. Full-stack: React frontend, Node.js backend orchestrating a C++ storage module and Python refresh jobs. Shipped a stable demo with a motivational-quotes engine that drove engagement.",
      },
      {
        title: "IntelligentTrader at the Horizon AI Hackathon",
        year: "Feb 2025",
        description:
          "Built a Random Forest on fundamental financial data to surface patterns before a target existed. Designed the Earnings Report Score (ERS), which used MinMax-scaled features with sequential differentials to grade document quality over time. Added an LSTM with feature-weighting and sequence-length tuning to improve pattern detection over the baseline.",
      },
    ],
  },
  {
    id: "recent-work",
    emoji: "⚡",
    title: "Research & Industry",
    range: "Feb 2025 – Present",
    accent: "#f59e0b",
    isCollege: true,
    isCurrent: true,
    cards: [
      {
        title: "MIT IDSS Research Program",
        year: "Feb – Jun 2025",
        description:
          "Twelve-week research program with MIT's Institute for Data, Systems, and Society. Applied AI/ML to policy, health, and finance through case studies on J.P. Morgan credit-risk, Uber ride-share ETA/surge, Amazon recommendations, and Shinkansen passenger-satisfaction, with fairness and interpretability checks throughout. Partnered with researchers and policymakers to translate findings into deployable, data-driven deliverables.",
        emphasized: true,
      },
      {
        title: "Vision Transformer Interpretability Research at UMiami",
        year: "Feb 2025 – Present",
        description:
          "Designing an interpretability framework for Vision Transformers using Sparse Autoencoders (SAEs) and spectral decomposition. Applied SVD to query–key interaction matrices (W_qᵀ W_k) to analyze dominant attention modes and representation geometry. Built a layer-wise pipeline studying how transformer representations evolve from low-level perceptual grouping to higher-level contextual reasoning. PyTorch tooling for extracting and analyzing intermediate Q/K/V/attention outputs. Researching under Dr. Vanessa Aguiar-Pulido; current report: \"Interpreting Self-Attention in Vision Transformers Using Sparse Autoencoders and Spectral Feature Decomposition.\"",
        emphasized: true,
      },
      {
        title: "AI/ML Engineering Intern at 3rd-i",
        year: "May to Nov 2025",
        description:
          "Shipped SwiftUI Lock-Screen widgets with GPS and Low-Power optimizations that boosted engagement and retention up to 60%. Built on-device audio/video threat detection (~1.2M parameters, ~95% accuracy, sub-3-second alerts) pipelined to automated 911 dispatch, which improved real-time safety by 70%. Delivered Ambassador referral analytics with React/TypeScript, Python on AWS, and Branch SDK live dashboards. The analytics cut admin overhead by 40% and raised marketing ROI to 35%.",
        emphasized: true,
      },
      {
        title: "Building Reciprocal",
        year: "2026",
        description:
          "A reverse-hiring marketplace where companies apply to candidates, every offer carries a publicly-enforced timeline, and ghosting has a cost.",
        emphasized: true,
      },
      {
        title: "Doop, at Pointy",
        year: "2026, just started",
        description:
          "A friend put me on Pointy a couple of days ago. Pointy is a startup building an all-in-one app of offline AI tools for the broader marketplace. My piece is Doop, a Granola clone for AI meeting notes that runs entirely offline. No internet calls. Models are preloaded locally and fine-tuned on the fly. Not an internship; it's a project we're building together.",
        emphasized: true,
      },
    ],
  },
];

function TimelineCard({
  card,
  index,
  era,
  side,
}: {
  card: Card;
  index: number;
  era: Era;
  side: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const fired = useRef(false);

  useEffect(() => {
    if (!inView || fired.current) return;
    fired.current = true;
    const el = ref.current;
    const t = titleRef.current;
    if (!el || !t) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    animate(el, {
      translateX: [side === "left" ? -60 : 60, 0],
      opacity: [0, 1],
      duration: 700,
      delay: index * 100,
      ease: "outExpo",
    });

    // scramble title text on intro
    animate(t, {
      text: scrambleText({ chars: ".:*/<>[]" }),
      duration: 900,
      delay: index * 100 + 250,
      ease: "outQuad",
    });
  }, [inView, index, side]);

  const isTodoTitle = card.title.includes("{/* TODO");

  return (
    <div
      ref={ref}
      className="glass-card rounded-2xl p-5 md:p-6"
      style={{
        opacity: 0,
        borderColor: era.accent + "22",
        boxShadow: card.emphasized ? `0 0 28px ${era.accent}1f` : undefined,
      }}
      data-cursor-hover
    >
      <div className="flex items-center justify-between gap-3">
        <div
          ref={titleRef}
          className={`text-base font-semibold md:text-lg ${isTodoTitle ? "opacity-50 italic" : ""}`}
          style={{
            color: card.emphasized ? era.accent : "var(--text-primary)",
            fontFamily: "var(--font-heading)",
            letterSpacing: "-0.01em",
          }}
        >
          {card.title}
        </div>
      </div>
      <div
        className="mt-1 text-xs font-medium uppercase tracking-wider"
        style={{ color: era.accent }}
      >
        {card.year}
      </div>
      <p
        className="mt-3 text-sm leading-relaxed"
        style={{ color: "var(--text-secondary)", maxWidth: "60ch" }}
      >
        {card.description}
      </p>
    </div>
  );
}

function EraBlock({ era }: { era: Era }) {
  return (
    <div className="relative">
      {/* badge on the spine */}
      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative grid h-12 w-12 place-items-center rounded-full"
          style={{
            background: "var(--bg)",
            border: `2px solid ${era.accent}`,
            boxShadow: era.isCollege
              ? `0 0 28px ${era.accent}aa, inset 0 0 12px ${era.accent}22`
              : `0 0 14px ${era.accent}55`,
          }}
        >
          <span className="text-lg leading-none">{era.emoji}</span>
          {era.isCurrent && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${era.accent}` }}
              animate={{ scale: [1, 1.7], opacity: [0.55, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </motion.div>
      </div>

      {/* era header */}
      <div className="pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="inline-flex flex-col items-center gap-1.5"
        >
          <span
            className="text-[10px] font-semibold uppercase"
            style={{
              color: era.accent,
              letterSpacing: "0.22em",
              fontFamily: "var(--font-body)",
            }}
          >
            {era.range}
          </span>
          <h3
            className={era.isCollege ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              color: era.isCollege || era.isCurrent ? era.accent : "var(--text-primary)",
              letterSpacing: "-0.02em",
              textShadow: era.isCollege ? `0 0 32px ${era.accent}66` : undefined,
            }}
          >
            {era.title}
          </h3>
        </motion.div>
      </div>

      {/* cards — alternate L/R within each era, starting fresh */}
      <div className="mt-12 space-y-6 md:space-y-8">
        {era.cards.map((card, i) => {
          const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
          return (
            <div
              key={`${era.id}-${i}`}
              className="grid md:grid-cols-2 md:gap-12"
            >
              {side === "left" ? (
                <>
                  <TimelineCard card={card} index={i} era={era} side="left" />
                  <div className="hidden md:block" />
                </>
              ) : (
                <>
                  <div className="hidden md:block" />
                  <TimelineCard card={card} index={i} era={era} side="right" />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Timeline() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const beamRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  useEffect(() => {
    if (!inView) return;
    const el = beamRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "scaleY(1)";
      return;
    }
    animate(el, {
      scaleY: [0, 1],
      duration: 2200,
      ease: "outExpo",
    });
  }, [inView]);

  return (
    <section
      id="journey"
      className="relative mx-auto max-w-5xl px-6 py-24 md:py-32 lg:px-12"
      ref={sectionRef}
    >
      <div className="mb-20 flex flex-col items-center">
        <SectionIndex num="02" label="Highlights" />
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl"
          style={{ fontFamily: "var(--font-heading)", fontWeight: 600, letterSpacing: "-0.03em" }}
        >
          Highlights
        </motion.h2>
      </div>

      {/* tracing beam */}
      <div
        ref={beamRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-32 bottom-0 hidden w-px origin-top md:block"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--text-primary) 28%, transparent) 8%, color-mix(in srgb, var(--text-primary) 28%, transparent) 92%, transparent 100%)",
          transform: "scaleY(0)",
        }}
      />

      <div className="space-y-28 md:space-y-32">
        {ERAS.map((era) => (
          <EraBlock key={era.id} era={era} />
        ))}
      </div>
    </section>
  );
}
