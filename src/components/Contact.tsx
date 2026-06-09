"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { animate, scrambleText } from "animejs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionIndex } from "./SectionIndex";

const Schema = z.object({
  name: z.string().min(2, "Tell me your name (2+ chars)").max(80),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Just a few more characters").max(2000),
});

type FormValues = z.infer<typeof Schema>;

export function Contact() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (!inView) return;
    const el = headingRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    animate(el, {
      text: scrambleText({ chars: ".:*/<>[]@" }),
      duration: 1200,
      ease: "outQuad",
    });
  }, [inView]);

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { success: boolean; message: string };
      if (!res.ok || !data.success) {
        toast.error(data.message || "Something went wrong. Please try again.");
        return;
      }
      toast.success(data.message || "Message sent. I'll be in touch.");
      reset();
    } catch {
      toast.error("Network error. Please try again in a moment.");
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative mx-auto max-w-3xl px-6 py-24 md:py-32 lg:px-12"
    >
      <SectionIndex num="05" label="Contact" />
      <motion.h2
        ref={headingRef}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-5xl"
        style={{ fontFamily: "var(--font-heading)", fontWeight: 600, letterSpacing: "-0.03em" }}
      >
        Get in touch
      </motion.h2>
      <p className="mt-3 text-base" style={{ color: "var(--text-secondary)" }}>
        Have an idea, an opportunity, or just want to say hi? Send a note. I read everything.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-10 space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-xs font-medium uppercase tracking-widest"
            style={{ color: "var(--text-secondary)" }}
          >
            Name
          </label>
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register("name")}
            className="border-[color:var(--card-border)] bg-[color:var(--card-bg)] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] focus-visible:ring-[color:var(--accent)]"
            placeholder="Your name"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs" style={{ color: "#fda4af" }}>
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-medium uppercase tracking-widest"
            style={{ color: "var(--text-secondary)" }}
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
            className="border-[color:var(--card-border)] bg-[color:var(--card-bg)] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] focus-visible:ring-[color:var(--accent)]"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1.5 text-xs" style={{ color: "#fda4af" }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-xs font-medium uppercase tracking-widest"
            style={{ color: "var(--text-secondary)" }}
          >
            Message
          </label>
          <Textarea
            id="message"
            rows={6}
            aria-invalid={!!errors.message}
            {...register("message")}
            className="border-[color:var(--card-border)] bg-[color:var(--card-bg)] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)] focus-visible:ring-[color:var(--accent)]"
            placeholder="What's on your mind?"
          />
          {errors.message && (
            <p className="mt-1.5 text-xs" style={{ color: "#fda4af" }}>
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          <SocialIcons />
          <button
            type="submit"
            disabled={isSubmitting}
            data-cursor-hover
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-lg transition-shadow hover:shadow-[0_8px_40px_rgba(99,102,241,0.45)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]"
            style={{ background: "var(--accent)" }}
          >
            {isSubmitting ? "Sending…" : "Send Message"}
          </button>
        </div>
      </form>
    </section>
  );
}

function SocialIcons() {
  const links = [
    {
      href: "https://github.com/Hersh3yBar",
      label: "GitHub",
      svg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55 0-.27-.01-1.18-.02-2.14-3.2.69-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.27-5.24-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.39.97.01 1.95.14 2.86.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.39-2.69 5.36-5.25 5.64.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
        </svg>
      ),
    },
    {
      href: "https://www.linkedin.com/in/hrishi-mucherla/",
      label: "LinkedIn",
      svg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.86 3.38-1.86 3.62 0 4.29 2.38 4.29 5.49v6.26zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46C23.21 24 24 23.23 24 22.27V1.73C24 .77 23.21 0 22.23 0z" />
        </svg>
      ),
    },
    {
      href: "mailto:mucherla.hrishi@gmail.com",
      label: "Email",
      svg: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-1">
      {links.map((l) => (
        <motion.a
          key={l.label}
          href={l.href}
          target={l.href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          aria-label={l.label}
          whileHover={{ scale: 1.1 }}
          className="grid h-10 w-10 place-items-center rounded-full text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)]"
          data-cursor-hover
        >
          {l.svg}
        </motion.a>
      ))}
    </div>
  );
}
