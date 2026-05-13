import type { ReactNode } from "react";

// ─── Props ──────────────────────────────────────────────────────────────────

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

/**
 * Consistent page wrapper with max-width and responsive padding.
 */
export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div
      className={[
        "mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
