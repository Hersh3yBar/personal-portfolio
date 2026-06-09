"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { animate, createTimeline } from "animejs";
import { ParticleNetwork } from "./ParticleNetwork";
import { getLenis } from "@/hooks/useLenis";

const ROLES = [
  "Computer Science Student",
  "AI/ML Researcher",
  "Software Engineer",
  "Building",
];

const NAME_WORDS = ["Hrishi", "Mucherla"];

export function Hero() {
  const typewriterRef = useRef<HTMLSpanElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const chevronRef = useRef<HTMLDivElement | null>(null);

  // typewriter
  useEffect(() => {
    const el = typewriterRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = ROLES[0];
      return;
    }
    const tl = createTimeline({ loop: true });
    ROLES.forEach((role) => {
      // type in
      for (let i = 1; i <= role.length; i++) {
        tl.add(
          el,
          {
            duration: 55,
            opacity: 1,
            onBegin: () => {
              el.textContent = role.slice(0, i);
            },
          }
        );
      }
      // hold
      tl.add(el, { duration: 1400, opacity: 1 });
      // type out
      for (let i = role.length - 1; i >= 0; i--) {
        tl.add(
          el,
          {
            duration: 30,
            opacity: 1,
            onBegin: () => {
              el.textContent = role.slice(0, i);
            },
          }
        );
      }
      tl.add(el, { duration: 320, opacity: 1 });
    });
    return () => {
      tl.pause();
    };
  }, []);

  // magnetic CTA
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const RADIUS = 140;
      if (dist < RADIUS) {
        animate(el, {
          translateX: dx * 0.25,
          translateY: dy * 0.25,
          duration: 380,
          ease: "outElastic(1, .6)",
        });
      } else {
        animate(el, {
          translateX: 0,
          translateY: 0,
          duration: 480,
          ease: "outElastic(1, .5)",
        });
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // chevron bounce
  useEffect(() => {
    const el = chevronRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = animate(el, {
      translateY: [
        { to: 0, duration: 600 },
        { to: 10, duration: 600 },
      ],
      opacity: [
        { to: 0.4, duration: 600 },
        { to: 1, duration: 600 },
      ],
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });
    return () => {
      a.pause();
    };
  }, []);

  const scrollToAbout = () => {
    const el = document.getElementById("about");
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -64 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden"
    >
      <ParticleNetwork />

      {/* ambient orb behind the type — adds depth, not distracting */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(99,102,241,0.18), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 text-center">
        {/* eyebrow — small italic editorial stamp */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-5 flex items-center gap-3"
        >
          <span
            aria-hidden
            className="h-px w-10"
            style={{ background: "var(--text-muted)" }}
          />
          <span
            className="font-mono text-[10px] uppercase"
            style={{
              color: "var(--text-secondary)",
              letterSpacing: "0.32em",
            }}
          >
            Portfolio · MMXXVI
          </span>
          <span
            aria-hidden
            className="h-px w-10"
            style={{ background: "var(--text-muted)" }}
          />
        </motion.div>

        {/* massive name — single-line on wide screens, stacks on narrow */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
          }}
          className="flex flex-wrap items-baseline justify-center gap-x-[0.16em] gap-y-1"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: "clamp(64px, 14vw, 200px)",
            lineHeight: 0.95,
            letterSpacing: "-0.045em",
          }}
        >
          {NAME_WORDS.map((w) => (
            <motion.span
              key={w}
              variants={{
                hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.9, ease: [0.2, 0.7, 0.2, 1] },
                },
              }}
              className="shimmer-text inline-block"
            >
              {w}
            </motion.span>
          ))}
        </motion.h1>

        {/* italic tagline directly under the name */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
          className="mt-6 italic"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(18px, 2.4vw, 26px)",
            color: "var(--text-secondary)",
            letterSpacing: "-0.01em",
          }}
        >
          Computer Science &amp; AI/ML at the University of Miami.
        </motion.p>

        {/* typewriter — demoted to a thin row beneath, with a leading dot */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.5 }}
          className="mt-3 flex items-center gap-2 font-mono text-[12px] uppercase"
          style={{
            color: "var(--text-muted)",
            letterSpacing: "0.18em",
          }}
        >
          <motion.span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--accent)" }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <span>Currently</span>
          <span
            ref={typewriterRef}
            style={{ color: "var(--text-secondary)" }}
          >
            &nbsp;
          </span>
        </motion.div>

        {/* CTA cluster */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.6 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            ref={ctaRef}
            type="button"
            onClick={scrollToAbout}
            data-cursor-hover
            className="group relative inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium text-white shadow-lg transition-shadow hover:shadow-[0_8px_40px_rgba(99,102,241,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
            style={{ background: "var(--accent)", willChange: "transform" }}
          >
            View My Work
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("contact");
              const lenis = getLenis();
              if (lenis && el) lenis.scrollTo(el, { offset: -64 });
              else el?.scrollIntoView({ behavior: "smooth" });
            }}
            data-cursor-hover
            className="text-sm transition-colors hover:text-[color:var(--text-primary)]"
            style={{
              color: "var(--text-secondary)",
              fontFamily: "var(--font-body)",
            }}
          >
            or get in touch →
          </a>
        </motion.div>
      </div>

      <div
        ref={chevronRef}
        aria-hidden
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[color:var(--text-muted)]"
      >
        <span
          className="font-mono text-[10px] uppercase"
          style={{ letterSpacing: "0.32em" }}
        >
          Scroll
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
