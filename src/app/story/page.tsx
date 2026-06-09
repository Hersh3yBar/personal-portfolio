import type { Metadata } from "next";
import Link from "next/link";
import { CustomCursor } from "@/components/CustomCursor";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SideMeta } from "@/components/SideMeta";
import { SectionIndex } from "@/components/SectionIndex";
import { StoryFlow } from "@/components/StoryFlow";

export const metadata: Metadata = {
  title: "My Story · Hrishi Mucherla",
  description: "Five cities, five chapters. The places that shaped how I think.",
};

type Chapter = {
  num: string;
  city: string;
  region: string;
  range: string;
  accent: string;
  paragraphs: string[];
};

const CHAPTERS: Chapter[] = [
  {
    num: "01",
    city: "Markapur",
    region: "Andhra Pradesh, India",
    range: "The beginning",
    accent: "#ff9933",
    paragraphs: [
      "Where everything started. Markapur is a small town in Andhra Pradesh, about 75,000 people, set against the edge of the Nallamala Forest. The kind of place where the air is heavier and the days move slower.",
      "Most of my extended family is from here. It's where the family tree branches out, and where the line back to me starts.",
      "I was born here. I don't have memories of it, but the town anchors the rest of the map. Every chapter after this one is downstream.",
    ],
  },
  {
    num: "02",
    city: "Hyderabad",
    region: "Telangana, India",
    range: "Early years",
    accent: "#fb923c",
    paragraphs: [
      "Hyderabad is one of India's largest cities, a place where centuries of history sit next to glass office towers. I spent my early years here before my family moved to the United States.",
      "I don't remember most of it, but the food, the language, and the rhythm of those years still show up in how I move through the world.",
    ],
  },
  {
    num: "03",
    city: "Kansas City",
    region: "Kansas, USA",
    range: "2008 – 2009",
    accent: "#a78bfa",
    paragraphs: [
      "First year in the United States, in the Kansas City metro. Specifically Overland Park, a quiet Midwestern suburb that became my introduction to a new country, a new language, and a very different climate.",
      "I was too young to understand most of it. The reset was complete.",
    ],
  },
  {
    num: "04",
    city: "St. Louis",
    region: "Missouri, USA",
    range: "2009 – 2023",
    accent: "#818cf8",
    paragraphs: [
      "Fourteen years. Elementary in Maryland Heights, then Chesterfield for the entirety of middle and high school. This is the city that raised me.",
      "Middle school in the Parkway School District was when I figured out I liked taking things apart. In 8th grade I placed 4th in the 8th-grade Target Round at the Missouri MCTM-sponsored state championship at the Barstow School in Kansas City. Parkway West swept the top 4. In 2017, I also made it to the state semifinals of the Missouri National Geographic Bee. Geography and numbers stuck.",
      "High school was where I started building. Two internships in the summer of 2022: Software Application Developer at STEM METS (a Nigerian education company, remote from St. Louis), and AI Research Scholar at Lumiere Education, mentored by a researcher at University College London. That summer ended with a paper published in the International Journal of High School Research on the implications of AI for businesses slow to adapt.",
      "St. Louis isn't loud about itself. It taught me to pay attention.",
    ],
  },
  {
    num: "05",
    city: "Miami",
    region: "Florida, USA",
    range: "2023 – 2026",
    accent: "#f59e0b",
    paragraphs: [
      "Moved south for the University of Miami. Computer Science with minors in Mathematics and Finance.",
      "Miami is where the work compounded. President's Scholar, Dean's List, hackathons (RELaiTe.co at ShellHacks, IntelligentTrader at Horizon), the MIT IDSS research program, and ongoing Vision Transformer interpretability research with Dr. Vanessa Aguiar-Pulido. In the summer of 2025, I started as an AI/ML Engineering Intern at 3rd-i, shipping on-device threat detection and the Ambassador referral system.",
      "It's also where I started shipping real things, not for class but because the problem was worth solving.",
    ],
  },
  {
    num: "06",
    city: "Dallas",
    region: "Texas, USA",
    range: "2025 – Present",
    accent: "#6366f1",
    paragraphs: [
      "Currently based in the Dallas/Frisco area. I'm still enrolled at the University of Miami and will graduate with my B.S. in Computer Science in December 2026. Miami is still the home base for the degree.",
      "Between now and then: more research, more building, figuring out what comes after the cap-and-gown.",
      "Dallas is the chapter I'm still writing.",
    ],
  },
];

export default function StoryPage() {
  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <ScrollProgress />
      <CustomCursor />
      <SideMeta />
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Hero */}
        <section className="relative mx-auto max-w-4xl px-6 text-center lg:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(99,102,241,0.18), transparent 70%)",
              filter: "blur(30px)",
            }}
          />
          <SectionIndex num="00" label="My Story" className="justify-center" />
          <h1
            className="mt-2"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: "clamp(56px, 11vw, 140px)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              color: "var(--text-primary)",
            }}
          >
            Six Cities,
            <br />
            <em className="italic" style={{ color: "var(--accent)" }}>
              six chapters.
            </em>
          </h1>
          <p
            className="mx-auto mt-8 max-w-xl text-base leading-relaxed md:text-lg"
            style={{
              color: "var(--text-secondary)",
              fontFamily: "var(--font-heading)",
              fontStyle: "italic",
            }}
          >
            The places that shaped how I think. Skim the chapters or read the
            whole thing. They&apos;re short.
          </p>
        </section>

        {/* Chapters */}
        <section className="relative mx-auto mt-24 max-w-6xl px-6 lg:px-12">
          {/* sticky flow map — pinned to viewport top; navbar (z-50) floats over the
              first 64px of the map, the map's internal padding pushes content below it */}
          <div className="sticky top-0 z-30 mb-20">
            <StoryFlow />
          </div>

          {/* chapters — narrower readable column inside the wider parent */}
          <div className="relative mx-auto max-w-3xl">
            {/* spine — scoped to the chapter column */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-8 top-2 bottom-8 w-px md:left-10"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--text-primary) 28%, transparent) 6%, color-mix(in srgb, var(--text-primary) 28%, transparent) 94%, transparent 100%)",
              }}
            />

            <div className="space-y-24">
            {CHAPTERS.map((c, idx) => (
              <article
                key={c.num}
                data-chapter-idx={idx}
                className="relative pl-20 md:pl-24"
              >
                {/* dot on spine */}
                <span
                  aria-hidden
                  className="absolute left-8 top-1.5 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full md:left-10"
                  style={{
                    background: "var(--bg)",
                    border: `2px solid ${c.accent}`,
                    boxShadow: `0 0 16px ${c.accent}66`,
                  }}
                >
                  <span
                    aria-hidden
                    className="block h-1.5 w-1.5 rounded-full"
                    style={{ background: c.accent }}
                  />
                </span>

                {/* eyebrow */}
                <div
                  className="font-mono text-[10px] uppercase"
                  style={{
                    color: c.accent,
                    letterSpacing: "0.28em",
                  }}
                >
                  Chapter {c.num} · {c.range}
                </div>

                {/* city */}
                <h2
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: "clamp(36px, 6vw, 64px)",
                    lineHeight: 1.0,
                    letterSpacing: "-0.03em",
                    color: "var(--text-primary)",
                  }}
                >
                  {c.city}
                </h2>
                <div
                  className="mt-1 text-sm italic"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {c.region}
                </div>

                {/* paragraphs */}
                <div
                  className="mt-6 space-y-4 text-[16px] leading-relaxed md:text-[17px]"
                  style={{
                    color: "var(--text-secondary)",
                    maxWidth: "62ch",
                  }}
                >
                  {c.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </article>
            ))}
            </div>
          </div>
        </section>

        {/* closing */}
        <section className="mx-auto mt-32 max-w-3xl px-6 text-center lg:px-12">
          <div
            aria-hidden
            className="mx-auto mb-10 h-px w-20"
            style={{ background: "var(--text-muted)" }}
          />
          <p
            className="mx-auto max-w-lg text-lg italic md:text-xl"
            style={{
              color: "var(--text-secondary)",
              fontFamily: "var(--font-heading)",
            }}
          >
            More chapters to come.
            <br />
            Reach out if you want to be part of the next one.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-lg transition-shadow hover:shadow-[0_8px_40px_rgba(99,102,241,0.45)]"
              style={{ background: "var(--accent)" }}
              data-cursor-hover
            >
              Get in touch
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm transition-colors hover:text-[color:var(--text-primary)]"
              style={{ color: "var(--text-secondary)" }}
              data-cursor-hover
            >
              ← Back to portfolio
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
