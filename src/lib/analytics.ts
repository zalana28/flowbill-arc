/**
 * FlowBill Arc — Analytics Event System
 *
 * Lightweight client-side analytics for tracking key user actions.
 * Events are stored in localStorage for MVP and can be forwarded
 * to external providers (Mixpanel, Amplitude, etc.) in future phases.
 *
 * No PII is collected. Only action metadata is tracked.
 */

// ─── Event Types ────────────────────────────────────────────────────────────

export type AnalyticsEvent =
  | "invoice_created"
  | "payment_link_opened"
  | "payment_success"
  | "payment_failed"
  | "wallet_connected"
  | "network_switched";

export interface AnalyticsEntry {
  event: AnalyticsEvent;
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

// ─── Storage ────────────────────────────────────────────────────────────────

const ANALYTICS_KEY = "flowbill_analytics";
const MAX_EVENTS = 200;

function getStoredEvents(): AnalyticsEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function storeEvents(events: AnalyticsEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    // Keep only the most recent events
    const trimmed = events.slice(-MAX_EVENTS);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Track an analytics event.
 */
export function trackEvent(
  event: AnalyticsEvent,
  metadata?: Record<string, string | number | boolean>
): void {
  const entry: AnalyticsEntry = {
    event,
    timestamp: new Date().toISOString(),
    metadata,
  };

  const events = getStoredEvents();
  events.push(entry);
  storeEvents(events);

  // Log in development for debugging
  if (process.env.NODE_ENV === "development") {
    console.log(`[analytics] ${event}`, metadata || "");
  }
}

/**
 * Get all stored analytics events.
 */
export function getEvents(): AnalyticsEntry[] {
  return getStoredEvents();
}

/**
 * Get events filtered by type.
 */
export function getEventsByType(event: AnalyticsEvent): AnalyticsEntry[] {
  return getStoredEvents().filter((e) => e.event === event);
}

/**
 * Get event counts grouped by type.
 */
export function getEventCounts(): Record<string, number> {
  const events = getStoredEvents();
  const counts: Record<string, number> = {};
  for (const e of events) {
    counts[e.event] = (counts[e.event] || 0) + 1;
  }
  return counts;
}

/**
 * Clear all stored analytics events.
 */
export function clearEvents(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ANALYTICS_KEY);
  } catch {
    // noop
  }
}
