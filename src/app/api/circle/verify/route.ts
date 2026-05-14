import { NextResponse } from "next/server";

/**
 * GET /api/circle/verify
 *
 * Server-only route that verifies the Circle API key by testing multiple
 * authenticated Circle endpoints and reporting which one responds successfully.
 *
 * Does NOT stop on the first 401 — tries all endpoints before concluding.
 * A 401 on one endpoint may mean that endpoint is incompatible with the key/product.
 *
 * Supports TEST_API_KEY and LIVE_API_KEY prefixes only.
 * KIT_KEY is rejected with a clear message.
 *
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
        endpoint: "",
        message: "CIRCLE_API_KEY is not configured.",
      },
      { status: 200 }
    );
  }

  // Reject KIT_KEY
  if (apiKey.startsWith("KIT_KEY:")) {
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        circleStatus: 0,
        endpoint: "",
        message:
          "Kit Key is not valid for Circle REST API verification. Use an API Key instead.",
      },
      { status: 200 }
    );
  }

  // Validate key prefix
  if (!apiKey.startsWith("TEST_API_KEY:") && !apiKey.startsWith("LIVE_API_KEY:")) {
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        circleStatus: 0,
        endpoint: "",
        message:
          "Unrecognized key format. Expected TEST_API_KEY:... or LIVE_API_KEY:... prefix.",
      },
      { status: 200 }
    );
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // Endpoints to try — order matters (most useful for API Logs first)
  const endpoints = [
    {
      url: "https://api-sandbox.circle.com/v1/configuration",
      successMessage: "Circle API key verified with sandbox configuration endpoint.",
    },
    {
      url: "https://api.circle.com/v1/w3s/wallets",
      successMessage: "Circle API key verified with Circle Wallets endpoint.",
    },
    {
      url: "https://api-sandbox.circle.com/ping",
      successMessage:
        "Circle connectivity verified, but this endpoint may not appear in API Logs.",
    },
  ];

  // Try all endpoints — do NOT stop on 401
  for (const { url, successMessage } of endpoints) {
    try {
      const response = await fetch(url, { method: "GET", headers });

      if (response.status === 200) {
        return NextResponse.json(
          {
            ok: true,
            configured: true,
            circleStatus: 200,
            endpoint: url,
            message: successMessage,
          },
          { status: 200 }
        );
      }

      // Any non-200 — continue to next endpoint
    } catch {
      // Network error — continue to next endpoint
    }
  }

  // All endpoints failed
  return NextResponse.json(
    {
      ok: false,
      configured: true,
      circleStatus: 0,
      endpoint: "",
      message:
        "Circle API key is present, but no verification endpoint succeeded.",
    },
    { status: 200 }
  );
}
