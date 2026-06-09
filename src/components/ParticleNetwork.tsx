"use client";

/* eslint-disable react-hooks/refs */

import { memo, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import {
  INDIA_OUTLINE,
  US_OUTLINE,
  INDIA_HIGHLIGHTS,
  STOP_POS,
} from "@/lib/journeyPoints";
import { hexToRgb01, lerp, easeInOutCubic, range01 } from "@/lib/colorLerp";
import { onLenisScroll } from "@/hooks/useLenis";

// --- module-level scroll progress, written by Lenis, read by useFrame ---
const progressRef: { current: number } = { current: 0 };

if (typeof window !== "undefined") {
  // also keep in sync with native scroll for non-lenis devices (reduced motion)
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressRef.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
}

const TOTAL_PARTICLES = 200;
const OUTLINE_N = INDIA_OUTLINE.length; // 80

// pre-jitter offsets so the "outline" looks like a fuzzy swarm, not a polygon
type Particle = {
  outlineIdx: number;
  offsetX: number;
  offsetY: number;
  driftPhase: number;
  driftSpeed: number;
  highlightIdx: number; // -1 if not a brighter pulse particle
};

function makeParticles(): Particle[] {
  const ps: Particle[] = [];
  // mulberry32 with fixed seed for stable jitter on reload
  let s = 1337;
  const rand = () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = 0; i < TOTAL_PARTICLES; i++) {
    const outlineIdx = i % OUTLINE_N;
    ps.push({
      outlineIdx,
      offsetX: (rand() - 0.5) * 0.07,
      offsetY: (rand() - 0.5) * 0.07,
      driftPhase: rand() * Math.PI * 2,
      driftSpeed: 0.4 + rand() * 0.6,
      highlightIdx: -1,
    });
  }
  // promote a handful of particles to highlights matching nearest outline index
  for (let h = 0; h < INDIA_HIGHLIGHTS.length; h++) {
    const [hx, hy] = INDIA_HIGHLIGHTS[h];
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < OUTLINE_N; i++) {
      const [ox, oy] = INDIA_OUTLINE[i];
      const d = (ox - hx) * (ox - hx) + (oy - hy) * (oy - hy);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    // map all particles with this outlineIdx to highlights
    ps.forEach((p) => {
      if (p.outlineIdx === best && p.highlightIdx === -1) p.highlightIdx = h;
    });
  }
  return ps;
}

const ROUTE: { id: keyof typeof STOP_POS; region: "india" | "us"; color: string; size: number; label: string; sub: string }[] = [
  { id: "hyderabad", region: "india", color: "#fb923c", size: 0.034, label: "Hyderabad, Telangana", sub: "Early years" },
  { id: "overlandPark", region: "us", color: "#a78bfa", size: 0.024, label: "Overland Park, KS", sub: "2008–2009" },
  { id: "stLouis", region: "us", color: "#818cf8", size: 0.038, label: "St. Louis, MO", sub: "2009–2023" },
  { id: "miami", region: "us", color: "#f59e0b", size: 0.048, label: "🎓 University of Miami", sub: "2023–2026" },
  { id: "dallas", region: "us", color: "#6366f1", size: 0.034, label: "Dallas, TX", sub: "2025–Present" },
];

// progress windows — now 5 stops, so Hyderabad gets the opening slot.
const PHASE = {
  hyderabad: [0.0, 0.22] as [number, number],
  morph: [0.22, 0.35] as [number, number],
  toStLouis: [0.45, 0.62] as [number, number],
  toMiami: [0.62, 0.78] as [number, number],
  toDallas: [0.78, 1.0] as [number, number],
};

type RouteStop = (typeof ROUTE)[number];

function currentJourney(progress: number): {
  pos: [number, number, number];
  color: string;
  size: number;
  active: RouteStop;
  morphT: number; // 0..1 for India-only at <0.22, US-only at >0.35
} {
  const morphT = easeInOutCubic(range01(progress, PHASE.morph[0], PHASE.morph[1]));

  // 5 stops: 0=Hyderabad, 1=Overland Park, 2=St. Louis, 3=Miami, 4=Dallas
  if (progress < PHASE.morph[0]) {
    const a = ROUTE[0]; // Hyderabad
    return { pos: STOP_POS[a.id], color: a.color, size: a.size, active: a, morphT };
  }
  if (progress < PHASE.morph[1]) {
    // Hyderabad → Overland Park, mid-morph (the immigration moment)
    const t = range01(progress, PHASE.morph[0], PHASE.morph[1]);
    const a = ROUTE[0];
    const b = ROUTE[1];
    return { pos: lerp3(STOP_POS[a.id], STOP_POS[b.id], easeInOutCubic(t)), color: a.color, size: lerp(a.size, b.size, t), active: t < 0.5 ? a : b, morphT };
  }
  if (progress < PHASE.toStLouis[0]) {
    const a = ROUTE[1];
    return { pos: STOP_POS[a.id], color: a.color, size: a.size, active: a, morphT };
  }
  if (progress < PHASE.toStLouis[1]) {
    const t = range01(progress, PHASE.toStLouis[0], PHASE.toStLouis[1]);
    const a = ROUTE[1];
    const b = ROUTE[2];
    return { pos: lerp3(STOP_POS[a.id], STOP_POS[b.id], t), color: a.color, size: lerp(a.size, b.size, t), active: t < 0.5 ? a : b, morphT };
  }
  if (progress < PHASE.toMiami[1]) {
    const t = range01(progress, PHASE.toMiami[0], PHASE.toMiami[1]);
    const a = ROUTE[2];
    const b = ROUTE[3];
    return { pos: lerp3(STOP_POS[a.id], STOP_POS[b.id], t), color: a.color, size: lerp(a.size, b.size, t), active: t < 0.5 ? a : b, morphT };
  }
  // toDallas
  const t = range01(progress, PHASE.toDallas[0], PHASE.toDallas[1]);
  const a = ROUTE[3];
  const b = ROUTE[4];
  return { pos: lerp3(STOP_POS[a.id], STOP_POS[b.id], t), color: a.color, size: lerp(a.size, b.size, t), active: t < 0.5 ? a : b, morphT };
}

function lerp3(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number
): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

// India palette (saffron) and US palette (indigo) for particles
const COLOR_INDIA = hexToRgb01("#ff9933");
const COLOR_INDIA_BRIGHT = hexToRgb01("#ffd28a");
const COLOR_US = hexToRgb01("#6366f1");
const COLOR_US_BRIGHT = hexToRgb01("#a5b4fc");

// idle-mode shared flag, written by EasterEggs custom event listener
const idleState = { current: false };
if (typeof window !== "undefined") {
  window.addEventListener("hm:idle", (e: Event) => {
    const ev = e as CustomEvent<{ idle: boolean }>;
    idleState.current = !!ev.detail?.idle;
  });
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const colorsRef = useRef<Float32Array | null>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const sizesRef = useRef<Float32Array | null>(null);
  const dotRef = useRef<THREE.Mesh>(null);
  const dotGlowRef = useRef<THREE.Mesh>(null);
  const homeRingRef = useRef<THREE.Mesh>(null);
  const dallasGlowRef = useRef<THREE.Mesh>(null);

  // mouse parallax
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * -2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // particle data (created once on first render, never recreated)
  const particlesStoreRef = useRef<Particle[] | null>(null);
  if (particlesStoreRef.current === null) particlesStoreRef.current = makeParticles();
  const particles = particlesStoreRef.current;

  // initial buffer arrays (lazy refs — built once)
  const bufferStoreRef = useRef<{
    positions: Float32Array;
    colors: Float32Array;
    sizes: Float32Array;
  } | null>(null);
  if (bufferStoreRef.current === null) {
    const positions = new Float32Array(TOTAL_PARTICLES * 3);
    const colors = new Float32Array(TOTAL_PARTICLES * 3);
    const sizes = new Float32Array(TOTAL_PARTICLES);
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const p = particles[i];
      const [ix, iy] = INDIA_OUTLINE[p.outlineIdx];
      positions[i * 3] = ix + p.offsetX;
      positions[i * 3 + 1] = iy + p.offsetY;
      positions[i * 3 + 2] = 0;
      const c = p.highlightIdx >= 0 ? COLOR_INDIA_BRIGHT : COLOR_INDIA;
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
      sizes[i] = p.highlightIdx >= 0 ? 0.06 : 0.035;
    }
    bufferStoreRef.current = { positions, colors, sizes };
  }
  const positions = bufferStoreRef.current.positions;
  const colors = bufferStoreRef.current.colors;
  const sizes = bufferStoreRef.current.sizes;

  useEffect(() => {
    positionsRef.current = positions;
    colorsRef.current = colors;
    sizesRef.current = sizes;
  }, [positions, colors, sizes]);

  // path line geometry stored in a ref so useFrame can mutate freely
  const pathStoreRef = useRef<{
    line: THREE.Line;
    positions: Float32Array;
    colors: Float32Array;
  } | null>(null);
  if (pathStoreRef.current === null) {
    const pp = new Float32Array(ROUTE.length * 3);
    const pc = new Float32Array(ROUTE.length * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pp, 3));
    g.setAttribute("color", new THREE.BufferAttribute(pc, 3));
    g.setDrawRange(0, 0);
    const m = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
    });
    pathStoreRef.current = { line: new THREE.Line(g, m), positions: pp, colors: pc };
  }
  const pathLine = pathStoreRef.current.line;
  const pathPositions = pathStoreRef.current.positions;
  const pathColors = pathStoreRef.current.colors;

  // miami dashed line — also a ref so useFrame can update opacity
  const miamiStoreRef = useRef<THREE.Line | null>(null);
  if (miamiStoreRef.current === null) {
    const g = new THREE.BufferGeometry();
    g.setFromPoints([
      new THREE.Vector3(...STOP_POS.stLouis),
      new THREE.Vector3(...STOP_POS.miami),
    ]);
    const m = new THREE.LineDashedMaterial({
      color: 0xf59e0b,
      dashSize: 0.06,
      gapSize: 0.04,
      transparent: true,
      opacity: 0,
      linewidth: 2,
    });
    const line = new THREE.Line(g, m);
    line.computeLineDistances();
    miamiStoreRef.current = line;
  }
  const miamiLine = miamiStoreRef.current;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const p = progressRef.current;
    const idle = idleState.current;
    const speedMul = idle ? 2 : 1;

    if (!positionsRef.current || !colorsRef.current) return;

    const morphT = easeInOutCubic(range01(p, PHASE.morph[0], PHASE.morph[1]));
    const positions = positionsRef.current;
    const colors = colorsRef.current;

    // warm gold idle palette
    const GOLD: [number, number, number] = [0.96, 0.62, 0.15];
    const GOLD_BRIGHT: [number, number, number] = [1.0, 0.78, 0.35];

    // particle update
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const part = particles[i];
      const [ix, iy] = INDIA_OUTLINE[part.outlineIdx];
      const [ux, uy] = US_OUTLINE[part.outlineIdx];
      // breathing drift (faster in idle mode)
      const driftX = Math.sin(t * part.driftSpeed * speedMul + part.driftPhase) * 0.015;
      const driftY = Math.cos(t * part.driftSpeed * speedMul * 0.8 + part.driftPhase) * 0.015;
      // mouse parallax
      const mx = mouse.current.x * 0.04;
      const my = mouse.current.y * 0.04;

      positions[i * 3] = lerp(ix, ux, morphT) + part.offsetX + driftX + mx;
      positions[i * 3 + 1] = lerp(iy, uy, morphT) + part.offsetY + driftY + my;
      positions[i * 3 + 2] = 0;

      const baseA = part.highlightIdx >= 0 ? COLOR_INDIA_BRIGHT : COLOR_INDIA;
      const baseB = part.highlightIdx >= 0 ? COLOR_US_BRIGHT : COLOR_US;
      let r = lerp(baseA[0], baseB[0], morphT);
      let g = lerp(baseA[1], baseB[1], morphT);
      let b = lerp(baseA[2], baseB[2], morphT);
      if (idle) {
        const gold = part.highlightIdx >= 0 ? GOLD_BRIGHT : GOLD;
        r = lerp(r, gold[0], 0.8);
        g = lerp(g, gold[1], 0.8);
        b = lerp(b, gold[2], 0.8);
      }
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    if (pointsRef.current) {
      const geom = pointsRef.current.geometry as THREE.BufferGeometry;
      const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
      const colAttr = geom.getAttribute("color") as THREE.BufferAttribute;
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      // dim when journey dot is between cities (always there) — soft 0.35..0.7
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.35 + 0.35 * (1 - Math.abs(morphT - 0.5) * 2);
    }

    // journey dot
    const j = currentJourney(p);
    if (dotRef.current) {
      dotRef.current.position.set(j.pos[0], j.pos[1], 0.01);
      const pulse = 1 + Math.sin(t * 4) * 0.12;
      dotRef.current.scale.setScalar(j.size * 12 * pulse);
      const m = dotRef.current.material as THREE.MeshBasicMaterial;
      m.color.setStyle(j.color);
    }
    if (dotGlowRef.current) {
      dotGlowRef.current.position.set(j.pos[0], j.pos[1], 0.005);
      const pulse = 1 + Math.sin(t * 2) * 0.25;
      dotGlowRef.current.scale.setScalar(j.size * 28 * pulse);
      const m = dotGlowRef.current.material as THREE.MeshBasicMaterial;
      m.color.setStyle(j.color);
      m.opacity = 0.18;
    }
    // home ring around St Louis (visible only when journey is in/near St Louis)
    if (homeRingRef.current) {
      const stShown = p > 0.42 && p < 0.65 ? 1 : 0;
      const opacity = stShown * (0.4 + Math.sin(t * 1.5) * 0.15);
      homeRingRef.current.position.set(STOP_POS.stLouis[0], STOP_POS.stLouis[1], 0);
      const m = homeRingRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = opacity;
    }
    // miami dashed line
    {
      const mat = miamiLine.material as THREE.LineDashedMaterial;
      mat.opacity = p > 0.55 && p < 0.85 ? 0.7 : 0;
    }
    // dallas glow (permanent after arrival)
    if (dallasGlowRef.current) {
      const opacity = p > 0.85 ? 0.35 : 0;
      dallasGlowRef.current.position.set(STOP_POS.dallas[0], STOP_POS.dallas[1], 0);
      const m = dallasGlowRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = opacity * (0.7 + Math.sin(t * 1.5) * 0.3);
    }

    // path line draw range
    {
      // assemble visited stops up to current — 5 stops total
      let visited = 1; // Hyderabad
      if (p > PHASE.morph[1]) visited = 2; // arrived in US (Overland Park)
      if (p > PHASE.toStLouis[1]) visited = 3; // St. Louis reached
      if (p > PHASE.toMiami[1]) visited = 4; // Miami reached
      if (p > PHASE.toDallas[1] - 0.05) visited = 5; // Dallas reached

      const stopsXYZ: [number, number, number][] = ROUTE.map((r) => STOP_POS[r.id]);
      for (let i = 0; i < visited; i++) {
        pathPositions[i * 3] = stopsXYZ[i][0];
        pathPositions[i * 3 + 1] = stopsXYZ[i][1];
        pathPositions[i * 3 + 2] = -0.005;
        const isIndia = ROUTE[i].region === "india";
        const c = isIndia ? COLOR_INDIA : COLOR_US;
        pathColors[i * 3] = c[0];
        pathColors[i * 3 + 1] = c[1];
        pathColors[i * 3 + 2] = c[2];
      }
      const geom = pathLine.geometry;
      geom.setDrawRange(0, visited);
      (geom.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
      (geom.getAttribute("color") as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* particle field */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={TOTAL_PARTICLES}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
            count={TOTAL_PARTICLES}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.04}
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* path line — already-traveled */}
      <primitive object={pathLine} />

      {/* dashed gold St. Louis → Miami */}
      <primitive object={miamiLine} />

      {/* home ring at St. Louis */}
      <mesh ref={homeRingRef}>
        <ringGeometry args={[0.085, 0.105, 64]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0} />
      </mesh>

      {/* dallas permanent glow */}
      <mesh ref={dallasGlowRef}>
        <circleGeometry args={[0.08, 32]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0} />
      </mesh>

      {/* journey dot glow */}
      <mesh ref={dotGlowRef}>
        <circleGeometry args={[0.04, 24]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.2} />
      </mesh>

      {/* journey dot */}
      <mesh ref={dotRef}>
        <circleGeometry args={[0.014, 24]} />
        <meshBasicMaterial color="#ff9933" />
      </mesh>
    </group>
  );
}

function ResponsiveCamera() {
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const aspect = size.width / size.height;
      /* eslint-disable react-hooks/immutability */
      camera.position.z = aspect < 1 ? 3.6 : 2.6;
      camera.fov = 50;
      camera.updateProjectionMatrix();
      /* eslint-enable react-hooks/immutability */
    }
  }, [camera, size]);
  return null;
}

export type ActiveLabel = {
  id: string;
  label: string;
  sub: string;
  color: string;
  treatment: string;
};

export const ParticleNetwork = memo(function ParticleNetwork() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const unsub = onLenisScroll((p) => {
      progressRef.current = p;
    });
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      unsub();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        frameloop={paused ? "never" : "always"}
        style={{ background: "transparent" }}
      >
        <ResponsiveCamera />
        <Scene />
      </Canvas>
    </div>
  );
});
