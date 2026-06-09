"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { animate } from "animejs";
import { ThemeToggle } from "./ThemeToggle";
import { getLenis } from "@/hooks/useLenis";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "journey", label: "Highlights" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("about");
  const [mobileOpen, setMobileOpen] = useState(false);
  const clickTimes = useRef<number[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    // when on a sub-route like /story, route home with a hash and let the page scroll
    if (!isHome) {
      router.push(`/#${id}`);
      setMobileOpen(false);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el, { offset: -64 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  };

  const handleLogoClick = () => {
    // 7-rapid-click glitch easter egg
    const now = Date.now();
    clickTimes.current = [...clickTimes.current.filter((t) => now - t < 1500), now];
    if (clickTimes.current.length >= 7) {
      triggerGlitch();
      clickTimes.current = [];
    }
    // Scroll to top
    if (!isHome) {
      router.push("/");
      return;
    }
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        background: scrolled ? "rgba(var(--bg-rgb), 0.92)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--card-border)" : "1px solid transparent",
      }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
        <button
          type="button"
          onClick={handleLogoClick}
          aria-label="Home · Hrishi.M"
          className="group relative inline-flex flex-col items-start justify-center px-1 transition-transform hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:#22d3ee] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)] rounded-md"
          data-cursor-hover
        >
          <span
            className="neon-signature"
            style={{
              fontFamily: "var(--font-signature), 'Mrs Saint Delafield', 'Brush Script MT', cursive",
              fontSize: "40px",
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: "0.015em",
              display: "block",
            }}
          >
            Hrishi.M
          </span>
          {/* hand-drawn zigzag flourish under the signature, glowing neon */}
          <svg
            aria-hidden
            className="neon-stroke"
            viewBox="0 0 130 20"
            width="124"
            height="19"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginTop: "-7px" }}
          >
            <path d="M 3 3 Q 64 1 124 3 L 38 17 Q 68 15 100 17" />
          </svg>
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((s) => {
            const isActive = isHome && active === s.id;
            return (
              <li key={s.id} className="relative">
                <button
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  className="relative px-3 py-2 text-sm transition-colors"
                  style={{
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                  data-cursor-hover
                >
                  {s.label}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-2 right-2 -bottom-0.5 h-0.5 rounded-full"
                      style={{ background: "var(--accent)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                </button>
              </li>
            );
          })}
          {/* Story — separate route */}
          <li className="relative">
            <Link
              href="/story"
              className="relative px-3 py-2 text-sm transition-colors"
              style={{
                color:
                  pathname === "/story"
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
              }}
              data-cursor-hover
            >
              Story
              {pathname === "/story" && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-2 right-2 -bottom-0.5 h-0.5 rounded-full"
                  style={{ background: "var(--accent)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-md text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] md:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            data-cursor-hover
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed top-16 right-0 bottom-0 z-40 w-72 border-l p-6 md:hidden"
            style={{
              background: "rgba(var(--bg-rgb), 0.92)",
              borderColor: "var(--card-border)",
              backdropFilter: "blur(20px)",
            }}
            role="dialog"
            aria-modal="true"
          >
            <ul className="flex flex-col gap-1">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(s.id)}
                    className="w-full rounded-md px-4 py-3 text-left text-base transition-colors"
                    style={{
                      color: isHome && active === s.id ? "var(--text-primary)" : "var(--text-secondary)",
                      background: isHome && active === s.id ? "rgba(99,102,241,0.12)" : "transparent",
                    }}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
              <li>
                <Link
                  href="/story"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-4 py-3 text-left text-base transition-colors"
                  style={{
                    color: pathname === "/story" ? "var(--text-primary)" : "var(--text-secondary)",
                    background: pathname === "/story" ? "rgba(99,102,241,0.12)" : "transparent",
                  }}
                >
                  Story
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function triggerGlitch() {
  if (typeof document === "undefined") return;
  document.body.classList.add("glitch-invert");
  animate(document.body, {
    translateX: [
      { to: -10, duration: 60 },
      { to: 8, duration: 60 },
      { to: -6, duration: 60 },
      { to: 4, duration: 60 },
      { to: 0, duration: 60 },
    ],
    skewX: [
      { to: 3, duration: 80 },
      { to: -2, duration: 80 },
      { to: 0, duration: 80 },
    ],
    duration: 500,
    ease: "outExpo",
  });
  window.setTimeout(() => {
    document.body.classList.remove("glitch-invert");
  }, 500);
}
