interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        aria-label="Loading"
        role="status"
      >
        <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path
          className="text-accent-cyan"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          d="M12 2a10 10 0 019.5 6.8"
        />
      </svg>
    </div>
  );
}
