import { NextRequest, NextResponse } from "next/server";
import { getAnalytics, getCustomers, getProperties } from "@/lib/notion";
import { generateMarketIntelligence } from "@/lib/match-engine";
import type { ApiError } from "@/types";

/**
 * GET /api/analytics
 * Get dashboard analytics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") as "daily" | "weekly" | "monthly") || "daily";

    // Fetch data in parallel
    const [analytics, customers, properties] = await Promise.all([
      getAnalytics(period),
      getCustomers(),
      getProperties({ status: "available" }),
    ]);

    // Generate market intelligence
    const marketIntelligence = generateMarketIntelligence(properties);

    // Calculate summary stats
    const summary = {
      totalCustomers: customers.length,
      newLeads: customers.filter((c) => c.status === "new").length,
      qualifiedLeads: customers.filter((c) => c.status === "qualified").length,
      matchedCustomers: customers.filter((c) => c.status === "matched").length,
      closedDeals: customers.filter((c) => c.status === "closed").length,
      totalProperties: properties.length,
      avgPropertyPrice:
        properties.reduce((sum, p) => sum + p.price, 0) / properties.length || 0,
      topCommunities: Array.from(marketIntelligence.entries())
        .sort((a, b) => b[1].totalListings - a[1].totalListings)
        .slice(0, 5)
        .map(([name, data]) => ({
          name,
          listings: data.totalListings,
          avgPricePerSqft: data.avgPricePerSqft,
          trend: data.trend,
        })),
    };

    return NextResponse.json({
      success: true,
      summary,
      analytics,
      marketIntelligence: Object.fromEntries(marketIntelligence),
    });
  } catch (error) {
    console.error("Analytics API error:", error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "Failed to fetch analytics",
        code: "INTERNAL_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
