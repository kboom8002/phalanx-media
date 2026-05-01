/**
 * DS-4: Motion Orchestration Library
 * Canonical transitions, variants, and helpers for consistent animation across pages.
 * Usage: import { fadeInUp, staggerContainer } from "@/lib/motion";
 */
import type { Variants, Transition } from "framer-motion";

// ── Canonical Transitions ──────────────────────────────────

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

export const transitionSmooth: Transition = {
  ease: EASE_OUT_EXPO,
  duration: 0.6,
};

export const transitionQuick: Transition = {
  ease: EASE_OUT_QUINT,
  duration: 0.35,
};

export const transitionSpring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 25,
};

// ── Reusable Variants ──────────────────────────────────────

/** Most common: list items, cards, sections */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: EASE_OUT_EXPO, duration: 0.6 },
  },
};

/** Subtle version for secondary content */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { ease: EASE_OUT_QUINT, duration: 0.5 },
  },
};

/** Scale-in for modals, popovers */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ease: EASE_OUT_EXPO, duration: 0.5 },
  },
};

/** Slide from right for drawers, sidebars */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ease: EASE_OUT_EXPO, duration: 0.5 },
  },
};

/** Slide from left */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ease: EASE_OUT_EXPO, duration: 0.5 },
  },
};

/** Container that staggers children */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

/** Wider stagger for hero sections */
export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

// ── Page Transition ────────────────────────────────────────

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT_QUINT },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.15 },
  },
};

// ── Helper ─────────────────────────────────────────────────

/** Calculate staggered delay for index-based items */
export function staggerDelay(index: number, base = 0.06): number {
  return index * base;
}
