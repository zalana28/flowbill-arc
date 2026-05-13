import { NextResponse } from "next/server";

/**
 * GET /api/circle/verify
 *
 * Server-only route that verifies the Circle API key by making a real
 * request to the Circle API.
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
    const response = await fetch("https://api.circle.com/v1/w3s/wallets", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const circleStatus = response.status;

    if (circleStatus === 200) {
      return NextResponse.json(
        {
          ok: true,
          configured: true,
          circleStatus,
          message: "Circle API key verified with Circle API.",
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
            "Circle returned 401. The key is present, but this endpoint/base URL may not match the key type or product access.",
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
            "Circle returned 403. The key is valid but may not have access to this product.",
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
        message: `Circle API returned status ${circleStatus}. Please verify your API key is valid.`,
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
          "Unable to reach Circle API. Please check network connectivity.",
      },
      { status: 200 }
    );
  }
}
