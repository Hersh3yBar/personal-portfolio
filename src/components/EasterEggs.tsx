"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { animate } from "animejs";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

export function EasterEggs() {
  const [konamiOpen, setKonamiOpen] = useState(false);
  const [hmShown, setHmShown] = useState(false);

  // 1. Console message
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as unknown as { __hmConsole?: boolean }).__hmConsole) return;
    (window as unknown as { __hmConsole?: boolean }).__hmConsole = true;
    console.log(
      "%c HM ",
      "font-size: 48px; font-weight: bold; color: #6366f1; background: #0a0a0f; padding: 8px 16px; border-radius: 8px;"
    );
    console.log(
      "%c Hey. I see you're checking under the hood. I like you already.",
      "font-size: 14px; color: #6366f1;"
    );
    console.log(
      "%c Building things that matter. → mucherla.hrishi@gmail.com",
      "font-size: 12px; color: rgba(232,230,225,0.5);"
    );
  }, []);

  // 2. Konami code
  useEffect(() => {
    if (typeof window === "undefined") return;
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const expected = KONAMI[idx];
      const key = e.key === "B" ? "b" : e.key === "A" ? "a" : e.key;
      if (key === expected) {
        idx++;
        if (idx === KONAMI.length) {
          idx = 0;
          triggerKonami();
          setKonamiOpen(true);
        }
      } else {
        // Reset, but allow restart from current key
        idx = key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 6. Idle mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    let timeoutId: number | null = null;
    let isIdle = false;
    const originalTitle = document.title;

    const setIdle = (idle: boolean) => {
      if (idle === isIdle) return;
      isIdle = idle;
      document.title = idle ? "still here? 👀" : originalTitle;
      document.body.dataset.idle = idle ? "true" : "false";
      window.dispatchEvent(new CustomEvent("hm:idle", { detail: { idle } }));
    };
    const reset = () => {
      if (isIdle) setIdle(false);
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setIdle(true), 60_000);
    };
    const events = ["mousemove", "keydown", "scroll", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (timeoutId) window.clearTimeout(timeoutId);
      document.title = originalTitle;
      delete document.body.dataset.idle;
    };
  }, []);

  // 7. HM keyboard shortcut
  useEffect(() => {
    if (typeof window === "undefined") return;
    const pressed = new Set<string>();
    let lastShown = 0;
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k !== "h" && k !== "m") return;
      // ignore when typing in input/textarea
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      pressed.add(k);
      if (pressed.has("h") && pressed.has("m")) {
        const now = Date.now();
        if (now - lastShown > 1500) {
          lastShown = now;
          setHmShown(true);
          window.setTimeout(() => setHmShown(false), 850);
        }
      }
    };
    const onUp = (e: KeyboardEvent) => {
      pressed.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  return (
    <>
      <CursorTrail />
      <Dialog open={konamiOpen} onOpenChange={setKonamiOpen}>
        <DialogContent
          className="border-[color:var(--card-border)] bg-[color:var(--surface)] text-[color:var(--text-primary)]"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle
              style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
              className="text-2xl"
            >
              You found it. Not many do.
            </DialogTitle>
            <DialogDescription className="text-[color:var(--text-secondary)]">
              A small fact about me you can&apos;t find anywhere else.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
            <p>
              In 2017, I was a semifinalist in the Missouri National Geographic
              Bee, one of the top geography students in the entire state of
              Missouri. I was in middle school.
            </p>
            <div
              className="mt-4 flex flex-col gap-1 rounded-xl border p-4 text-sm"
              style={{ borderColor: "var(--card-border)", background: "rgba(255,255,255,0.02)" }}
            >
              <a
                href="mailto:mucherla.hrishi@gmail.com"
                className="font-medium hover:underline"
                style={{ color: "var(--accent)" }}
              >
                mucherla.hrishi@gmail.com
              </a>
              <a
                href="https://github.com/Hersh3yBar"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "var(--text-secondary)" }}
              >
                github.com/Hersh3yBar
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {hmShown && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.1, 1.05, 0.8] }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.85, times: [0, 0.3, 0.7, 1], ease: "easeInOut" }}
            className="pointer-events-none fixed inset-0 z-[60] grid place-items-center"
          >
            <span
              style={{
                color: "var(--accent)",
                fontSize: "20vw",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                letterSpacing: "-0.05em",
                lineHeight: 1,
                textShadow: "0 0 80px rgba(99,102,241,0.5)",
              }}
            >
              HM
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function triggerKonami() {
  const colors = ["#ff9933", "#6366f1"];
  const defaults: import("canvas-confetti").Options = {
    startVelocity: 32,
    spread: 360,
    ticks: 80,
    zIndex: 9999,
    colors,
  };
  function fire(particleRatio: number, opts: import("canvas-confetti").Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(220 * particleRatio),
    });
  }
  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

// 8. Cursor trail on fast movement
function CursorTrail() {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none) or (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer = layerRef.current;
    if (!layer) return;

    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastT = 0;
    const dots: HTMLDivElement[] = [];
    let toggle = false;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (lastX === null || lastY === null) {
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = now;
        return;
      }
      const dt = Math.max(1, now - lastT);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const v = (Math.hypot(dx, dy) / dt) * 1000; // px/s
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;

      if (v < 800) return;

      const dot = document.createElement("div");
      dot.style.position = "fixed";
      dot.style.left = `${e.clientX - 3}px`;
      dot.style.top = `${e.clientY - 3}px`;
      dot.style.width = "6px";
      dot.style.height = "6px";
      dot.style.borderRadius = "9999px";
      dot.style.pointerEvents = "none";
      dot.style.zIndex = "9998";
      dot.style.background = toggle ? "#ff9933" : "#6366f1";
      dot.style.boxShadow = `0 0 8px ${toggle ? "#ff993388" : "#6366f188"}`;
      toggle = !toggle;
      layer.appendChild(dot);
      dots.push(dot);
      if (dots.length > 20) {
        const old = dots.shift();
        old?.remove();
      }
      animate(dot, {
        opacity: [1, 0],
        scale: [1, 0.3],
        duration: 400,
        ease: "outExpo",
        onComplete: () => dot.remove(),
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      dots.forEach((d) => d.remove());
    };
  }, [mounted]);

  if (!mounted) return null;
  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9998]"
    />
  );
}
