"use client";

import { motion } from "framer-motion";

export function SectionIndex({
  num,
  label,
  className = "",
}: {
  num: string;
  label: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
      className={`section-index mb-4 ${className}`}
    >
      <span style={{ color: "var(--text-secondary)" }}>{num}</span>
      <span>/</span>
      <span>{label}</span>
    </motion.div>
  );
}
