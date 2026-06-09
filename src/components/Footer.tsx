"use client";

import { useEffect, useState } from "react";

function useLocalTime() {
  const [t, setT] = useState<string>("");
  useEffect(() => {
    const tick = () => {
      const now = new Date().toLocaleTimeString("en-US", {
        timeZone: "America/Chicago",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setT(`${now} CT`);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return t;
}

export function Footer() {
  const time = useLocalTime();
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative mt-12 border-t"
      style={{ borderColor: "var(--card-border)" }}
    >
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-12">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* signature column */}
          <div>
            <div
              className="text-3xl"
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
              }}
            >
              Let&apos;s build something.
            </div>
            <a
              href="mailto:mucherla.hrishi@gmail.com"
              data-cursor-hover
              className="mt-3 inline-flex items-center gap-2 text-sm transition-colors hover:text-[color:var(--text-primary)]"
              style={{
                color: "var(--accent)",
                fontFamily: "var(--font-body)",
              }}
            >
              mucherla.hrishi@gmail.com
              <span aria-hidden>↗</span>
            </a>
          </div>

          {/* nav column */}
          <div className="flex flex-col gap-2">
            <FooterLabel>Sitemap</FooterLabel>
            <FooterLink href="/#about">About</FooterLink>
            <FooterLink href="/#journey">Highlights</FooterLink>
            <FooterLink href="/#skills">Skills</FooterLink>
            <FooterLink href="/#projects">Work</FooterLink>
            <FooterLink href="/uses">Uses</FooterLink>
            <FooterLink href="/#contact">Contact</FooterLink>
          </div>

          {/* social column */}
          <div className="flex flex-col gap-2">
            <FooterLabel>Find me</FooterLabel>
            <FooterLink href="https://github.com/Hersh3yBar" external>
              GitHub
            </FooterLink>
            <FooterLink
              href="https://www.linkedin.com/in/hrishi-mucherla/"
              external
            >
              LinkedIn
            </FooterLink>
            <FooterLink href="mailto:mucherla.hrishi@gmail.com">
              Email
            </FooterLink>
          </div>

          {/* meta column */}
          <div className="flex flex-col gap-2">
            <FooterLabel>Status</FooterLabel>
            <MetaRow k="Location" v="Dallas, TX" />
            <MetaRow k="Local time" v={time || "Loading"} />
            <MetaRow k="Available" v="Summer 2026" accent="#22c55e" />
            <MetaRow k="Version" v="v1.7.3" />
          </div>
        </div>

        {/* bottom rule */}
        <div
          className="mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 text-[11px] md:flex-row md:items-center"
          style={{
            borderColor: "var(--card-border)",
            color: "var(--text-muted)",
            fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
            letterSpacing: "0.06em",
          }}
        >
          <span>
            {`© ${year} Hrishi Mucherla · Designed & built with care in Dallas`}
          </span>
          <span>Next.js · React Three Fiber · Framer Motion · animejs v4</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-1 font-mono text-[10px] uppercase"
      style={{
        color: "var(--text-muted)",
        letterSpacing: "0.22em",
      }}
    >
      {children}
    </div>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-cursor-hover
      className="group inline-flex w-fit items-center gap-1.5 text-sm transition-colors hover:text-[color:var(--text-primary)]"
      style={{ color: "var(--text-secondary)" }}
    >
      {children}
      {external && (
        <span
          aria-hidden
          className="text-[11px] opacity-50 transition-opacity group-hover:opacity-100"
        >
          ↗
        </span>
      )}
    </a>
  );
}

function MetaRow({
  k,
  v,
  accent,
}: {
  k: string;
  v: string;
  accent?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[12px] tabular-nums">
      <span
        className="font-mono uppercase"
        style={{
          color: "var(--text-muted)",
          letterSpacing: "0.1em",
          fontSize: "10px",
        }}
      >
        {k}
      </span>
      <span
        style={{ color: accent ?? "var(--text-secondary)" }}
        className="flex items-center gap-1.5"
      >
        {accent && (
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
          />
        )}
        {v}
      </span>
    </div>
  );
}
