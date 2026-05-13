"use client";

import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

// ─── Shared Transition Presets ──────────────────────────────────────────────

export const springTransition = { type: "spring", stiffness: 300, damping: 30 };
export const smoothTransition = { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const };
export const slowTransition = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const };

// ─── Variant Presets ────────────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

// ─── Page Transition Wrapper ────────────────────────────────────────────────

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={smoothTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Staggered List Container ───────────────────────────────────────────────

interface StaggerListProps {
  children: ReactNode;
  className?: string;
}

export function StaggerList({ children, className = "" }: StaggerListProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Staggered Item ─────────────────────────────────────────────────────────

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return (
    <motion.div variants={staggerItem} transition={smoothTransition} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Hover Lift Card ────────────────────────────────────────────────────────

interface HoverLiftProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  lift?: number;
}

export const HoverLift = forwardRef<HTMLDivElement, HoverLiftProps>(
  ({ children, className = "", lift = -2, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ y: lift, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.985 }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

HoverLift.displayName = "HoverLift";

// ─── Count Up Animation ─────────────────────────────────────────────────────

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 2,
  duration = 1,
  className = "",
}: CountUpProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration * 0.3, ease: "easeOut" }}
      >
        {prefix}{value.toFixed(decimals)}{suffix}
      </motion.span>
    </motion.span>
  );
}

// ─── Pulse Glow (for confirming states) ─────────────────────────────────────

interface PulseGlowProps {
  children: ReactNode;
  active?: boolean;
  className?: string;
}

export function PulseGlow({ children, active = true, className = "" }: PulseGlowProps) {
  return (
    <motion.div
      animate={
        active
          ? {
              boxShadow: [
                "0 0 0 0 rgba(16, 185, 129, 0.3)",
                "0 0 20px 4px rgba(16, 185, 129, 0.15)",
                "0 0 0 0 rgba(16, 185, 129, 0.3)",
              ],
            }
          : {}
      }
      transition={active ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
      className={["rounded-2xl", className].join(" ")}
    >
      {children}
    </motion.div>
  );
}

// ─── Animated Checkmark ─────────────────────────────────────────────────────

interface AnimatedCheckmarkProps {
  size?: number;
  className?: string;
}

export function AnimatedCheckmark({ size = 64, className = "" }: AnimatedCheckmarkProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Circle */}
      <motion.svg
        viewBox="0 0 64 64"
        fill="none"
        className="absolute inset-0"
        width={size}
        height={size}
      >
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="3"
          className="text-accent-green"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </motion.svg>
      {/* Check */}
      <motion.svg
        viewBox="0 0 64 64"
        fill="none"
        className="absolute inset-0"
        width={size}
        height={size}
      >
        <motion.path
          d="M20 34 L28 42 L44 24"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent-green"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
        />
      </motion.svg>
      {/* Glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-accent-green/20"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.3, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
    </div>
  );
}

// ─── Reduced Motion Hook ────────────────────────────────────────────────────

export function useReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
