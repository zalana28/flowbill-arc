import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  /** Show subtle grid background */
  grid?: boolean;
  /** Show top radial glow */
  glow?: boolean;
}

export function PageContainer({
  children,
  className = "",
  grid = false,
  glow = false,
}: PageContainerProps) {
  return (
    <div className={["relative", grid ? "bg-grid" : "", glow ? "bg-glow" : ""].join(" ")}>
      <div
        className={[
          "mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8",
          className,
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
