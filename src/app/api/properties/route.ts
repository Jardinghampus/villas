import { NextRequest, NextResponse } from "next/server";
import { getProperties, getPropertyById } from "@/lib/notion";
import type { ApiError, PropertyStatus, ListingType } from "@/types";

/**
 * GET /api/properties
 * List properties with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as PropertyStatus | null;
    const listingType = searchParams.get("listingType") as ListingType | null;
    const community = searchParams.get("community");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minBedrooms = searchParams.get("minBedrooms");
    const maxBedrooms = searchParams.get("maxBedrooms");
    const propertyId = searchParams.get("id");

    // If specific ID requested
    if (propertyId) {
      const property = await getPropertyById(propertyId);
      if (!property) {
        return NextResponse.json<ApiError>(
          { success: false, error: "Property not found", code: "NOT_FOUND" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, property });
    }

    // List with filters
    const properties = await getProperties({
      status: status ?? undefined,
      listingType: listingType ?? undefined,
      community: community ?? undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      minBedrooms: minBedrooms ? parseInt(minBedrooms) : undefined,
      maxBedrooms: maxBedrooms ? parseInt(maxBedrooms) : undefined,
    });

    return NextResponse.json({
      success: true,
      properties,
      total: properties.length,
    });
  } catch (error) {
    console.error("Properties API error:", error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "Failed to fetch properties",
        code: "INTERNAL_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
