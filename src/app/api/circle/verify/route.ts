import { NextResponse } from "next/server";

/**
 * GET /api/circle/verify
 *
 * Server-only route that verifies the Circle API key by making a real
 * request to the Circle sandbox API configuration endpoint.
 *
 * - Reads CIRCLE_API_KEY from server environment.
 * - Never returns the API key or any prefix.
 * - Does not affect the payment flow.
 */
export async function GET() {
  const apiKey = process.env.CIRCLE_API_KEY;

  // Key not configured
  if (!apiKey || apiKey.trim() === "") {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
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
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      return NextResponse.json(
        {
          ok: true,
          configured: true,
          circleStatus: response.status,
          message: "Circle API key verified with sandbox API.",
        },
        { status: 200 }
      );
    }

    // Circle returned an error status
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        circleStatus: response.status,
        message: `Circle API returned status ${response.status}. Please verify your API key is valid.`,
      },
      { status: 200 }
    );
  } catch (error) {
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
