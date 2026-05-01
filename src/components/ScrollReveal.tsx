/**
 * DS-8: ScrollReveal — Scroll-triggered fade-in-up animation.
 * Wrap any section to reveal on scroll into viewport.
 */
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { fadeInUp, fadeIn, scaleIn, EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealVariant = "fadeInUp" | "fadeIn" | "scaleIn";

const VARIANT_MAP: Record<RevealVariant, any> = {
  fadeInUp,
  fadeIn,
  scaleIn,
};

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  margin?: string;
}

export function ScrollReveal({
  children,
  className,
  variant = "fadeInUp",
  delay = 0,
  margin = "-60px",
}: ScrollRevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: margin as any });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={VARIANT_MAP[variant]}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
