import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 · Hrishi Mucherla",
  description: "Page not found.",
};

export default function NotFound() {
  return (
    <main className="relative grid min-h-[80vh] place-items-center px-6">
      <div className="relative flex flex-col items-center text-center">
        {/* ambient orb */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,153,51,0.18), transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        <span
          className="font-mono text-[10px] uppercase"
          style={{
            color: "var(--text-muted)",
            letterSpacing: "0.32em",
          }}
        >
          Error · 404
        </span>

        <h1
          className="mt-4 leading-none"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: "clamp(120px, 22vw, 280px)",
            letterSpacing: "-0.05em",
            color: "var(--text-primary)",
          }}
        >
          404
        </h1>

        <p
          className="mt-6 max-w-md text-base italic"
          style={{
            color: "var(--text-secondary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          The page you&apos;re looking for slipped past me. The map only
          covers what I&apos;ve built so far.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium text-white transition-shadow hover:shadow-[0_8px_40px_rgba(99,102,241,0.45)]"
          style={{ background: "var(--accent)" }}
          data-cursor-hover
        >
          ← Take me home
        </Link>

        <span
          className="mt-8 font-mono text-[10px] uppercase"
          style={{
            color: "var(--text-muted)",
            letterSpacing: "0.22em",
          }}
        >
          hrishi mucherla · portfolio
        </span>
      </div>
    </main>
  );
}
