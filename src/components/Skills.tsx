"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { animate } from "animejs";
import { Badge } from "@/components/ui/badge";
import { SectionIndex } from "./SectionIndex";

const CATEGORIES: { title: string; items: string[] }[] = [
  {
    title: "Languages",
    items: [
      "Python",
      "TypeScript",
      "JavaScript",
      "Java",
      "C++",
      "R",
      "SQL",
      "HTML",
      "CSS",
      "PHP",
    ],
  },
  {
    title: "Frameworks & Libraries",
    items: [
      "React",
      "Next.js",
      "Node.js",
      "SwiftUI",
      "PyTorch",
      "scikit-learn",
      "Pandas",
      "NumPy",
      "Tailwind CSS",
      "Framer Motion",
      "Three.js",
    ],
  },
  {
    title: "Tools & Platforms",
    items: [
      "Git",
      "GitHub",
      "AWS",
      "Firebase",
      "Supabase",
      "Vercel",
      "Google Gemini API",
      "Branch SDK",
      "Figma",
      "Adobe Photoshop",
    ],
  },
  {
    title: "Currently Exploring",
    items: [
      "Vision Transformers",
      "Sparse Autoencoders",
      "Mechanistic Interpretability",
      "Causal Inference",
      "MLOps",
      "WebGL Shaders",
    ],
  },
];

function Pill({ label, idx }: { label: string; idx: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  useEffect(() => {
    if (!inView) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      el.style.transform = "scale(1)";
      return;
    }
    animate(el, {
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 420,
      delay: idx * 40,
      ease: "outBack(1.5)",
    });
  }, [inView, idx]);

  return (
    <div ref={ref} style={{ opacity: 0 }} className="inline-block" data-cursor-hover>
      <Badge
        variant="secondary"
        className="cursor-none border-[color:var(--card-border)] bg-[color:var(--card-bg)] px-3 py-1 text-[13px] font-medium text-[color:var(--text-primary)] transition-shadow hover:shadow-[0_0_18px_rgba(99,102,241,0.35)]"
      >
        {label}
      </Badge>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-5xl px-6 py-24 md:py-32 lg:px-12">
      <div className="mb-12">
        <SectionIndex num="03" label="Skills" />
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl"
          style={{ fontFamily: "var(--font-heading)", fontWeight: 600, letterSpacing: "-0.03em" }}
        >
          Skills
        </motion.h2>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        {CATEGORIES.map((cat, ci) => {
          let offset = 0;
          for (let i = 0; i < ci; i++) offset += CATEGORIES[i].items.length;
          return (
            <div key={cat.title}>
              <h3
                className="mb-4 text-sm font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-secondary)" }}
              >
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((it, i) => (
                  <Pill key={it} label={it} idx={offset + i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
