import { NextResponse } from "next/server";

/**
 * GET /api/circle/verify
 *
 * Server-only route that verifies the Circle API key by testing multiple
 * authenticated Circle endpoints and reporting which one responds.
 *
 * Supports TEST_API_KEY and LIVE_API_KEY prefixes only.
 * KIT_KEY is rejected with a clear message.
 *
 * Endpoints tried in order:
 * 1. GET https://api-sandbox.circle.com/v1/configuration
 * 2. GET https://api.circle.com/v1/w3s/wallets
 * 3. GET https://api-sandbox.circle.com/ping
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

  // Endpoint list with success messages
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

  for (const { url, successMessage } of endpoints) {
    try {
      const response = await fetch(url, { method: "GET", headers });
      const circleStatus = response.status;

      if (circleStatus === 200) {
        return NextResponse.json(
          {
            ok: true,
            configured: true,
            circleStatus,
            endpoint: url,
            message: successMessage,
          },
          { status: 200 }
        );
      }

      // 401 means key is definitively invalid — stop trying
      if (circleStatus === 401) {
        return NextResponse.json(
          {
            ok: false,
            configured: true,
            circleStatus,
            endpoint: url,
            message:
              "Circle returned 401. The API key may be invalid or expired.",
          },
          { status: 200 }
        );
      }

      // 403 or 404 — try next endpoint
      if (circleStatus === 403 || circleStatus === 404) {
        continue;
      }

      // Other unexpected status — report and stop
      return NextResponse.json(
        {
          ok: false,
          configured: true,
          circleStatus,
          endpoint: url,
          message: `Circle returned status ${circleStatus}. Please verify your API key.`,
        },
        { status: 200 }
      );
    } catch {
      // Network error on this endpoint — try next
      continue;
    }
  }

  // All endpoints failed with 403/404 or network errors
  return NextResponse.json(
    {
      ok: false,
      configured: true,
      circleStatus: 403,
      endpoint: "",
      message:
        "All Circle endpoints returned 403/404. The key is configured but may lack product access.",
    },
    { status: 200 }
  );
}
