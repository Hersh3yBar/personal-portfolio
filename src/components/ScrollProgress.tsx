"use client";

import { useEffect, useRef } from "react";
import { onLenisScroll } from "@/hooks/useLenis";

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const apply = (p: number) => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = `scaleX(${p})`;
    };

    // sync with lenis
    const unsub = onLenisScroll((p) => apply(p));

    // fallback for non-lenis (reduced-motion etc.)
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      apply(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      unsub();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <div ref={ref} aria-hidden className="scroll-progress w-full" />;
}
