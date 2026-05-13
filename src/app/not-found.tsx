import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center bg-grid bg-glow">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-surface border border-border-default">
        <span className="text-2xl font-bold text-text-muted">404</span>
      </div>
      <h1 className="text-2xl font-bold text-text-primary">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-text-secondary leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold bg-gradient-to-r from-accent-green via-accent-cyan to-accent-blue text-white shadow-lg shadow-accent-green/10 hover:brightness-110 transition-all duration-200"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
