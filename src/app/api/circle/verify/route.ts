import { NextResponse } from "next/server";

/**
 * GET /api/circle/verify
 *
 * Server-only route that verifies the Circle API key by making an
 * authenticated request to the Circle sandbox REST API.
 *
 * Uses GET https://api-sandbox.circle.com/v1/configuration which is an
 * authenticated endpoint that appears in Circle API Logs.
 *
 * Key format: TEST_API_KEY:ID:SECRET (standard Circle testnet API key).
 * Does NOT support KIT_KEY — this endpoint is for API Key verification only.
 *
 * - Reads CIRCLE_API_KEY from server environment.
 * - Sends the full key as Bearer token.
 * - Never returns the API key, prefix, or Circle response body.
 * - Does not affect the payment flow.
 */
export async function GET() {
  const apiKey = process.env.CIRCLE_API_KEY?.trim();

  // Key not configured
  if (!apiKey || apiKey === "") {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        circleStatus: 0,
        message: "CIRCLE_API_KEY is not configured.",
      },
      { status: 200 }
    );
  }

  // Primary endpoint: GET /v1/configuration
  // This is an authenticated endpoint that logs to Circle API Logs.
  // Fallback: GET /v1/businessAccount/balances
  const endpoints = [
    "https://api-sandbox.circle.com/v1/configuration",
    "https://api-sandbox.circle.com/v1/businessAccount/balances",
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const circleStatus = response.status;

      // Success — key is valid and endpoint responded
      if (circleStatus === 200) {
        return NextResponse.json(
          {
            ok: true,
            configured: true,
            circleStatus,
            message: "Circle API key verified with sandbox API.",
          },
          { status: 200 }
        );
      }

      // 401 — key is invalid or expired
      if (circleStatus === 401) {
        return NextResponse.json(
          {
            ok: false,
            configured: true,
            circleStatus,
            message:
              "Circle returned 401. The API key may be invalid or expired.",
          },
          { status: 200 }
        );
      }

      // 404 — endpoint not available for this key type, try next
      if (circleStatus === 404) {
        continue;
      }

      // 403 — key valid but no access to this specific resource, try next
      if (circleStatus === 403) {
        continue;
      }

      // Other status — return it
      return NextResponse.json(
        {
          ok: false,
          configured: true,
          circleStatus,
          message: `Circle sandbox API returned status ${circleStatus}. Please verify your API key.`,
        },
        { status: 200 }
      );
    } catch {
      // Network error on this endpoint — try next
      continue;
    }
  }

  // All endpoints returned 403/404 — key is present but no accessible endpoint found
  return NextResponse.json(
    {
      ok: false,
      configured: true,
      circleStatus: 403,
      message:
        "Circle API key is configured but no accessible endpoint responded. Verify the key is a TEST_API_KEY (not a KIT_KEY).",
    },
    { status: 200 }
  );
}
