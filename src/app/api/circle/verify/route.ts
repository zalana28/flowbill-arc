import { NextResponse } from "next/server";

/**
 * GET /api/circle/verify
 *
 * Server-only route that verifies the Circle API key by making a real
 * request to the Circle sandbox API.
 *
 * Uses https://api-sandbox.circle.com for testnet/sandbox keys.
 * Calls GET /ping — a lightweight endpoint accessible by all API key types.
 *
 * - Reads CIRCLE_API_KEY from server environment.
 * - Sends the full key as Bearer token (format: PREFIX:ID:SECRET).
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

  try {
    // Use sandbox base URL for testnet keys
    // GET /ping is accessible by all Circle API key types
    const response = await fetch(
      "https://api-sandbox.circle.com/ping",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      }
    );

    const circleStatus = response.status;

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

    if (circleStatus === 403) {
      return NextResponse.json(
        {
          ok: false,
          configured: true,
          circleStatus,
          message:
            "Circle returned 403. The key may not have access to this environment.",
        },
        { status: 200 }
      );
    }

    // Other error status
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
    // Network or unexpected error — never leak details
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        circleStatus: 0,
        message:
          "Unable to reach Circle sandbox API. Please check network connectivity.",
      },
      { status: 200 }
    );
  }
}
