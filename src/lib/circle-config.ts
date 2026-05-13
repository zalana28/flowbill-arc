/**
 * Circle API Configuration — SERVER-SIDE ONLY
 *
 * This module reads the CIRCLE_API_KEY from environment variables.
 * It must NEVER be imported into client components ("use client" files).
 *
 * Import guard: Next.js will throw a build error if a server-only module
 * is accidentally imported into a client component when using the
 * "server-only" package. We use a runtime check as an additional safeguard.
 */

// ─── Runtime Environment Guard ──────────────────────────────────────────────

function assertServerEnvironment(): void {
  if (typeof window !== "undefined") {
    throw new Error(
      "[FlowBill] circle-config.ts must only be used in server-side code. " +
        "Never import this module into client components."
    );
  }
}

// ─── Configuration ──────────────────────────────────────────────────────────

/**
 * Check whether the Circle API key is configured.
 * Does NOT return or leak the key itself.
 */
export function isCircleConfigured(): boolean {
  assertServerEnvironment();
  const key = process.env.CIRCLE_API_KEY;
  return typeof key === "string" && key.length > 0;
}

/**
 * Get the Circle API key for server-side API calls.
 * Throws a descriptive error if the key is not set.
 *
 * Usage: Only call this from Next.js API routes or server actions.
 */
export function getCircleApiKey(): string {
  assertServerEnvironment();
  const key = process.env.CIRCLE_API_KEY;

  if (!key || key.trim() === "") {
    throw new Error(
      "[FlowBill] CIRCLE_API_KEY is not configured. " +
        "Set it in your .env.local file. " +
        "Get a key from https://console.circle.com"
    );
  }

  return key;
}

/**
 * Get Circle configuration status for health checks.
 * Returns a safe object that never leaks the actual key.
 */
export function getCircleStatus(): {
  configured: boolean;
  message: string;
  phase: string;
} {
  assertServerEnvironment();
  const configured = isCircleConfigured();

  return {
    configured,
    message: configured
      ? "Circle API key is configured. Server-side integrations are ready."
      : "Circle API key is not configured. Phase 1 wallet-native payments are active.",
    phase: "circle-integration-prep",
  };
}
