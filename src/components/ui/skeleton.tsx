/**
 * Loading skeleton components for optimistic UI.
 * Used across dashboard, invoice detail, and payment pages.
 */

interface SkeletonProps {
  className?: string;
}

/** Base skeleton pulse block */
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={["rounded-lg bg-bg-surface animate-shimmer", className].join(" ")}
      aria-hidden="true"
    />
  );
}

/** Skeleton for a stat card */
export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border-default bg-bg-card/80 p-4 space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-28" />
    </div>
  );
}

/** Skeleton for an invoice list item */
export function InvoiceCardSkeleton() {
  return (
    <div className="rounded-xl border border-border-default bg-bg-card/60 p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="space-y-1.5 flex flex-col items-end">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton for dashboard stats row */
export function StatsRowSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
  );
}

/** Skeleton for invoice list */
export function InvoiceListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <InvoiceCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Skeleton for payment card */
export function PaymentCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border-default bg-bg-card/80 p-6 space-y-4">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="border-t border-border-default pt-4 space-y-3">
        <div className="flex justify-between"><Skeleton className="h-3 w-20" /><Skeleton className="h-3 w-32" /></div>
        <div className="flex justify-between"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-24" /></div>
        <div className="flex justify-between"><Skeleton className="h-3 w-12" /><Skeleton className="h-3 w-28" /></div>
      </div>
    </div>
  );
}

/** Full page loading state with centered spinner alternative */
export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
      <StatsRowSkeleton />
      <InvoiceListSkeleton />
    </div>
  );
}
