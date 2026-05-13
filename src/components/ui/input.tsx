"use client";

import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = "", ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            "w-full h-11 rounded-xl border bg-bg-surface px-4 text-sm text-text-primary",
            "placeholder:text-text-muted",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan/50",
            "hover:border-border-accent",
            error
              ? "border-accent-red/50 focus:ring-accent-red/30 focus:border-accent-red/50"
              : "border-border-default",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            className,
          ].join(" ")}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-accent-red flex items-center gap-1" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3"><path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm.75-10.25a.75.75 0 00-1.5 0v4a.75.75 0 001.5 0v-4zM8 11a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
