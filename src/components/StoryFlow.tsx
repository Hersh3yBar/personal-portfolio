"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  INDIA_OUTLINE,
  US_OUTLINE,
  INDIA_BBOX,
  US_BBOX,
  geoToScene,
} from "@/lib/journeyPoints";

// Cities in chronological order — matches the chapters
const CITIES = [
  {
    id: "markapur",
    name: "Markapur",
    lat: 15.735,
    lng: 79.268,
    region: "india" as const,
    color: "#ff9933",
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    lat: 17.384,
    lng: 78.456,
    region: "india" as const,
    color: "#fb923c",
  },
  {
    id: "overlandPark",
    name: "Kansas City",
    lat: 38.982,
    lng: -94.671,
    region: "us" as const,
    color: "#a78bfa",
  },
  {
    id: "stLouis",
    name: "St. Louis",
    lat: 38.627,
    lng: -90.199,
    region: "us" as const,
    color: "#818cf8",
  },
  {
    id: "miami",
    name: "Miami",
    lat: 25.721,
    lng: -80.268,
    region: "us" as const,
    color: "#f59e0b",
  },
  {
    id: "dallas",
    name: "Dallas",
    lat: 33.158,
    lng: -96.824,
    region: "us" as const,
    color: "#6366f1",
  },
];

// SVG viewBox: 1100 x 380
// India panel: left third
// US panel: right two-thirds (US is wider geographically)
const VB_W = 1100;
const VB_H = 380;
const INDIA_PANEL = { x: 40, y: 60, w: 300, h: 280 };
const US_PANEL = { x: 420, y: 40, w: 640, h: 320 };

function sceneToPanel(
  p: readonly [number, number, number] | [number, number],
  panel: { x: number; y: number; w: number; h: number }
): { x: number; y: number } {
  // scene coords are in [-1, 1] x [-1, 1]; SVG Y is inverted
  const sx = (p[0] + 1) / 2;
  const sy = 1 - (p[1] + 1) / 2;
  return {
    x: panel.x + sx * panel.w,
    y: panel.y + sy * panel.h,
  };
}

function projectCity(c: (typeof CITIES)[number]) {
  const scenePt = geoToScene(
    c.lat,
    c.lng,
    c.region === "india" ? INDIA_BBOX : US_BBOX
  );
  return sceneToPanel(scenePt, c.region === "india" ? INDIA_PANEL : US_PANEL);
}

function outlinePath(
  outline: readonly [number, number, number][],
  panel: { x: number; y: number; w: number; h: number }
): string {
  return (
    outline
      .map((p, i) => {
        const pt = sceneToPanel([p[0], p[1]], panel);
        return `${i === 0 ? "M" : "L"} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
      })
      .join(" ") + " Z"
  );
}

// Build a smooth quadratic-curve "via" path between two points to feel like a route, not a straight line.
function curveBetween(
  a: { x: number; y: number },
  b: { x: number; y: number },
  bow = 0.18
): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  // perpendicular offset to bow the curve upward
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * len * bow;
  const cy = my + ny * len * bow - 8; // slight upward lift
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

export function StoryFlow() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Track which chapter heading the user is currently reading. The map highlights
  // a city the moment that chapter's bold heading scrolls past the reading zone
  // (just below the sticky map). Using a scroll-driven check is more accurate than
  // IntersectionObserver here because long articles can overlap, and the sticky map
  // covers the top of the viewport (which IO can't account for).
  useEffect(() => {
    if (typeof window === "undefined") return;

    const getHeadings = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>("article[data-chapter-idx] h2")
      );

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const headings = getHeadings();
        if (headings.length === 0) return;
        // The reading zone is just below the sticky map (~45% of viewport).
        const triggerY = window.innerHeight * 0.45;
        let activeIdx = 0;
        for (const h of headings) {
          const rect = h.getBoundingClientRect();
          if (rect.top <= triggerY) {
            const article = h.closest(
              "article[data-chapter-idx]"
            ) as HTMLElement | null;
            if (article) activeIdx = Number(article.dataset.chapterIdx);
          } else {
            break;
          }
        }
        setCurrentIdx(activeIdx);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // also trigger once on mount so the initial state matches scroll position
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // memoised geometry
  const indiaPath = useMemo(
    () => outlinePath(INDIA_OUTLINE, INDIA_PANEL),
    []
  );
  const usPath = useMemo(() => outlinePath(US_OUTLINE, US_PANEL), []);
  const cityPositions = useMemo(() => CITIES.map(projectCity), []);

  // build segment paths — used for incremental drawing
  const segments = useMemo(() => {
    const segs: string[] = [];
    for (let i = 0; i < cityPositions.length - 1; i++) {
      const a = cityPositions[i];
      const b = cityPositions[i + 1];
      // the India → US jump (idx 1 → 2: Hyderabad → Overland Park) gets a special dashed arc
      const isOcean = i === 1; // Hyderabad → Overland Park
      segs.push(curveBetween(a, b, isOcean ? 0.32 : 0.16));
      // store metadata via parallel arrays elsewhere if needed
      void isOcean;
    }
    return segs;
  }, [cityPositions]);

  const active = CITIES[currentIdx];
  const activePos = cityPositions[currentIdx];

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-b-2xl border border-t-0 shadow-2xl shadow-black/40"
      style={{
        // Solid background. The top 64px is hidden behind the navbar (z-50) when sticky.
        background: "rgba(var(--bg-rgb), 0.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: "var(--card-border)",
        // pull the box up under the navbar so background extends to viewport top
        paddingTop: 64,
      }}
    >
      {/* eyebrow */}
      <div
        className="flex items-center justify-between px-5 pt-4 pb-2"
        style={{
          color: "var(--text-muted)",
          fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}
      >
        <span>The Route</span>
        <span className="tabular-nums">
          {String(currentIdx + 1).padStart(2, "0")} / {String(CITIES.length).padStart(2, "0")}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="block w-full"
        style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
        aria-label="Journey flow map"
      >
        <defs>
          <linearGradient id="indiaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,153,51,0.08)" />
            <stop offset="100%" stopColor="rgba(255,153,51,0.02)" />
          </linearGradient>
          <linearGradient id="usFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(99,102,241,0.08)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0.02)" />
          </linearGradient>
          <filter id="cityGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* country labels */}
        <text
          x={INDIA_PANEL.x + INDIA_PANEL.w / 2}
          y={20}
          textAnchor="middle"
          style={{
            fill: "rgba(255,153,51,0.6)",
            fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
            fontSize: 10,
            letterSpacing: "0.32em",
          }}
        >
          INDIA
        </text>
        <text
          x={US_PANEL.x + US_PANEL.w / 2}
          y={20}
          textAnchor="middle"
          style={{
            fill: "rgba(99,102,241,0.6)",
            fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
            fontSize: 10,
            letterSpacing: "0.32em",
          }}
        >
          UNITED STATES
        </text>

        {/* India outline */}
        <path
          d={indiaPath}
          fill="url(#indiaFill)"
          stroke="color-mix(in srgb, var(--text-primary) 22%, transparent)"
          strokeWidth={0.8}
        />
        {/* US outline */}
        <path
          d={usPath}
          fill="url(#usFill)"
          stroke="color-mix(in srgb, var(--text-primary) 22%, transparent)"
          strokeWidth={0.8}
        />

        {/* journey segments — two layers per segment:
            (a) muted guide always visible, (b) accent path that draws in via stroke-dashoffset */}
        {segments.map((d, i) => {
          const isOcean = i === 1; // Hyderabad → Overland Park
          const drawn = i < currentIdx;
          const accent = CITIES[i + 1].color;
          return (
            <g key={i}>
              {/* guide */}
              <path
                d={d}
                fill="none"
                stroke="rgba(232,230,225,0.12)"
                strokeWidth={0.8}
                strokeDasharray={isOcean ? "4 5" : "2 4"}
                strokeLinecap="round"
              />
              {/* accent — animates via stroke-dashoffset (non-ocean) or opacity (ocean) */}
              {!isOcean ? (
                <path
                  d={d}
                  fill="none"
                  stroke={accent}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray={100}
                  strokeDashoffset={drawn ? 0 : 100}
                  style={{
                    transition:
                      "stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.4s ease",
                    filter: drawn ? `drop-shadow(0 0 4px ${accent}77)` : undefined,
                  }}
                />
              ) : (
                <path
                  d={d}
                  fill="none"
                  stroke={accent}
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeDasharray="6 5"
                  opacity={drawn ? 1 : 0}
                  style={{
                    transition:
                      "opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
                    filter: drawn ? `drop-shadow(0 0 4px ${accent}77)` : undefined,
                  }}
                />
              )}
            </g>
          );
        })}

        {/* travel burst — re-mounts on every currentIdx change and replays its SMIL animation */}
        <g key={`burst-${currentIdx}`}>
          <circle
            cx={activePos.x}
            cy={activePos.y}
            r={4}
            fill="none"
            stroke={active.color}
            strokeWidth={1.5}
            opacity={0.9}
          >
            <animate
              attributeName="r"
              from={4}
              to={42}
              dur="1.1s"
              fill="freeze"
              calcMode="spline"
              keySplines="0.22 1 0.36 1"
              keyTimes="0;1"
            />
            <animate
              attributeName="opacity"
              from={0.9}
              to={0}
              dur="1.1s"
              fill="freeze"
              calcMode="spline"
              keySplines="0.22 1 0.36 1"
              keyTimes="0;1"
            />
            <animate
              attributeName="stroke-width"
              from={1.8}
              to={0.4}
              dur="1.1s"
              fill="freeze"
            />
          </circle>
        </g>

        {/* city dots + labels */}
        {cityPositions.map((pos, i) => {
          const c = CITIES[i];
          const isPast = i < currentIdx;
          const isCurrent = i === currentIdx;

          // Per-city label offsets so close pairs (Markapur/Hyderabad, Overland Park/St. Louis) don't overlap.
          let labelOffsetY = 16;
          let labelOffsetX = 0;
          if (c.id === "markapur") {
            labelOffsetY = 16; // below
          } else if (c.id === "hyderabad") {
            labelOffsetY = -10; // above
          } else if (c.id === "overlandPark") {
            labelOffsetY = -10; // above
            labelOffsetX = -8; // nudge left
          } else if (c.id === "stLouis") {
            labelOffsetY = 16; // below
            labelOffsetX = 6; // nudge right
          } else if (c.id === "miami") {
            labelOffsetY = -10;
          } else if (c.id === "dallas") {
            labelOffsetY = 16;
          }

          return (
            <g key={c.id}>
              {/* current city — continuous outward pulse */}
              {isCurrent && (
                <>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={6}
                    fill="none"
                    stroke={c.color}
                    strokeWidth={1}
                    opacity={0.6}
                  >
                    <animate
                      attributeName="r"
                      from={6}
                      to={18}
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from={0.55}
                      to={0}
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={12}
                    fill={c.color}
                    opacity={0.22}
                    filter="url(#cityGlow)"
                  />
                </>
              )}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isCurrent ? 5 : isPast ? 4 : 3.5}
                fill={isCurrent || isPast ? c.color : "var(--bg)"}
                stroke={c.color}
                strokeWidth={isCurrent ? 2 : 1.4}
                style={{
                  transition:
                    "r 0.5s cubic-bezier(0.22, 1, 0.36, 1), fill 0.4s ease",
                }}
              />
              <text
                x={pos.x + labelOffsetX}
                y={pos.y + labelOffsetY}
                textAnchor="middle"
                style={{
                  fill: isCurrent
                    ? c.color
                    : isPast
                      ? "rgba(232,230,225,0.78)"
                      : "rgba(232,230,225,0.4)",
                  fontFamily: "var(--font-body), Inter, sans-serif",
                  fontSize: isCurrent ? 12 : 10.5,
                  fontWeight: isCurrent ? 600 : 500,
                  transition: "fill 0.4s ease, font-size 0.4s ease",
                }}
              >
                {c.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* legend */}
      <div
        className="flex items-center justify-between gap-4 border-t px-5 py-3 text-[10px]"
        style={{
          borderColor: "var(--card-border)",
          color: "var(--text-muted)",
          fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
          letterSpacing: "0.18em",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: CITIES[currentIdx].color }}
          />
          <span style={{ color: "var(--text-secondary)" }}>
            {CITIES[currentIdx].name.toUpperCase()}
          </span>
        </div>
        <span className="hidden md:inline">SCROLL TO TRAVEL</span>
      </div>
    </div>
  );
}
