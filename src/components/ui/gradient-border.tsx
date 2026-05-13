import type { ReactNode } from "react";

interface GradientBorderProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps content in a container with a subtle gradient border effect.
 * Uses a pseudo-element technique for smooth gradient borders.
 */
export function GradientBorder({ children, className = "" }: GradientBorderProps) {
  return (
    <div className={["relative rounded-2xl p-[1px] bg-gradient-to-br from-accent-green/30 via-accent-cyan/20 to-accent-blue/30", className].join(" ")}>
      <div className="rounded-2xl bg-bg-card h-full">
        {children}
      </div>
    </div>
  );
}
