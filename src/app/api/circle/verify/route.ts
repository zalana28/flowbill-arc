import { NextResponse } from "next/server";

/**
 * GET /api/circle/verify
 *
 * Server-only route that verifies the Circle API key by calling:
 * GET https://api-sandbox.circle.com/v1/configuration
 *
 * This authenticated endpoint appears in Circle API Logs.
 *
 * Key format: TEST_API_KEY:ID:SECRET (standard Circle testnet API key).
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

  try {
    const response = await fetch(
      "https://api-sandbox.circle.com/v1/configuration",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
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
            "Circle returned 403. The key does not have access to this endpoint.",
        },
        { status: 200 }
      );
    }

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
