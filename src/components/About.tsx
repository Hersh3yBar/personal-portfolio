"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { SectionIndex } from "./SectionIndex";

type Stat = { label: string; value: number; suffix?: string; decimals?: number };

const STATS: Stat[] = [
  { label: "GPA", value: 3.61, decimals: 2 },
  { label: "Research Programs", value: 2 },
  { label: "Internships", value: 4 },
  { label: "Hackathon Builds", value: 2 },
];

function StatCard({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView || done) return;
    const el = ref.current;
    if (!el) return;
    const obj = { v: 0 };
    animate(obj, {
      v: stat.value,
      duration: 1400,
      ease: "outExpo",
      onUpdate: () => {
        el.textContent =
          stat.decimals !== undefined
            ? obj.v.toFixed(stat.decimals)
            : String(Math.round(obj.v));
      },
      onComplete: () => setDone(true),
    });
  }, [inView, stat.value, stat.decimals, done]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6"
      data-cursor-hover
    >
      <div
        className="flex items-baseline gap-0.5"
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}
      >
        <span
          ref={ref}
          className="text-3xl font-semibold tabular-nums"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          0
        </span>
        {stat.suffix && <span className="text-2xl opacity-80">{stat.suffix}</span>}
      </div>
      <div
        className="mt-1 text-xs uppercase tracking-wider"
        style={{ color: "var(--text-secondary)" }}
      >
        {stat.label}
      </div>
    </motion.div>
  );
}

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-24 md:py-32 lg:px-12">
      <div className="grid items-center gap-12 md:grid-cols-[260px_1fr] lg:grid-cols-[320px_1fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative mx-auto h-56 w-56 md:h-64 md:w-64 lg:h-80 lg:w-80"
        >
          {/* outer glow — slow pulse, behind everything */}
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ background: "var(--accent)", filter: "blur(40px)", opacity: 0.25 }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.22, 0.35, 0.22] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* photo + ring breathe together as a single element */}
          <motion.div
            className="relative h-full w-full overflow-hidden rounded-full ring-2"
            style={{ borderColor: "var(--accent)", boxShadow: "0 0 0 4px rgba(99,102,241,0.15)" }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/profile-v3.png"
              alt="Hrishi Mucherla"
              fill
              priority
              sizes="(max-width: 768px) 224px, 320px"
              className="object-cover"
              style={{ transform: "scale(1.06)" }}
            />
          </motion.div>
        </motion.div>

        <div className="space-y-8">
          <div>
            <SectionIndex num="01" label="About" />
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 600, letterSpacing: "-0.03em" }}
            >
              About
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base leading-relaxed md:text-[17px]"
            style={{ color: "var(--text-secondary)", maxWidth: "62ch" }}
          >
            Computer Science at the{" "}
            <strong style={{ color: "var(--text-primary)" }}>University of Miami</strong>{" "}
            (B.S., December 2026), with minors in Mathematics and Finance. I&apos;m
            a President&apos;s Scholar carrying a 3.61 GPA. Dean&apos;s List every semester,
            and Provost&apos;s List (the distinction above Dean&apos;s) in Fall 2025. I spent
            2025 researching AI/ML with the faculty at the{" "}
            <strong style={{ color: "var(--text-primary)" }}>MIT IDSS</strong> program,
            and am currently researching mechanistic interpretability with Dr. Vanessa
            Aguiar-Pulido. I also shipped on-device threat-detection models as an AI/ML
            intern at <strong style={{ color: "var(--text-primary)" }}>3rd-i</strong>.
            Based in Dallas, I started Reciprocal in 2026, a reverse-hiring marketplace
            where companies apply to candidates and ghosting has a cost.
          </motion.p>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {STATS.map((s) => (
              <StatCard key={s.label} stat={s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
