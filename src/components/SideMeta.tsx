"use client";

import { useEffect, useState } from "react";
import { onLenisScroll } from "@/hooks/useLenis";

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function formatStamp(d: Date): string {
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function SideMeta() {
  const [progress, setProgress] = useState(0);
  const [stamp] = useState(() => formatStamp(new Date()));

  useEffect(() => {
    const unsub = onLenisScroll((p) => setProgress(p));
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      unsub();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* Left rail — vertical wordmark */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
      >
        <span
          className="vertical-text"
          style={{ color: "var(--text-muted)" }}
        >
          PORTFOLIO · MMXXVI · DAL
        </span>
      </div>

      {/* Right rail — scroll percentage + status */}
      <div
        aria-hidden
        className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 lg:flex flex-col items-end gap-3"
      >
        <span
          className="font-mono text-[10px] tabular-nums uppercase"
          style={{
            color: "var(--text-muted)",
            letterSpacing: "0.18em",
          }}
        >
          {String(Math.round(progress * 100)).padStart(3, "0")} %
        </span>
        <div
          className="h-32 w-px"
          style={{ background: "rgba(232,230,225,0.12)" }}
        >
          <div
            className="w-px"
            style={{
              height: `${progress * 100}%`,
              background: "var(--accent)",
              boxShadow: "0 0 8px rgba(99,102,241,0.6)",
            }}
          />
        </div>
        <span
          className="font-mono text-[10px] tabular-nums uppercase"
          style={{
            color: "var(--text-muted)",
            letterSpacing: "0.18em",
          }}
        >
          {stamp}
        </span>
      </div>
    </>
  );
}
