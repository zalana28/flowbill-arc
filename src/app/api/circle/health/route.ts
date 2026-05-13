import { NextResponse } from "next/server";
import { getCircleStatus } from "@/lib/circle-config";

/**
 * GET /api/circle/health
 *
 * Server-only health check for Circle integration status.
 * Returns whether CIRCLE_API_KEY is configured without leaking the key.
 * Does NOT call any external Circle APIs.
 */
export async function GET() {
  try {
    const status = getCircleStatus();

    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        configured: false,
        message: "Unable to check Circle configuration.",
        phase: "circle-integration-prep",
      },
      { status: 500 }
    );
  }
}
