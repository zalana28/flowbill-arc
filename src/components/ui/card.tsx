import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: string;
  glow?: boolean;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ padding = "p-6", glow = false, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          "rounded-2xl border border-border-default bg-bg-card/80 backdrop-blur-sm",
          "shadow-lg shadow-black/20",
          glow ? "border-border-accent animate-pulse-glow" : "",
          padding,
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={["pb-4 border-b border-border-default", className].join(" ")}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = "CardHeader";

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={["pt-4 border-t border-border-default", className].join(" ")}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = "CardFooter";
