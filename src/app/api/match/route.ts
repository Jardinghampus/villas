import { NextRequest, NextResponse } from "next/server";
import {
  calculateAffordability,
  rankPropertiesForCustomer,
} from "@/lib/match-engine";
import { getCustomerById, getProperties, createCustomer } from "@/lib/notion";
import type {
  Customer,
  CustomerFormData,
  MatchResponse,
  ApiError,
} from "@/types";

/**
 * POST /api/match
 * Generate property matches for a customer
 *
 * Body can contain either:
 * - customerId: string (existing customer)
 * - customerData: CustomerFormData (new customer)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, customerData } = body;

    let customer: Customer | null = null;

    // Get or create customer
    if (customerId) {
      customer = await getCustomerById(customerId);
      if (!customer) {
        return NextResponse.json<ApiError>(
          { success: false, error: "Customer not found", code: "CUSTOMER_NOT_FOUND" },
          { status: 404 }
        );
      }
    } else if (customerData) {
      // Create new customer from form data
      const formData = customerData as CustomerFormData;

      customer = await createCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        customerType: formData.customerType,
        monthlyIncome: formData.monthlyIncome,
        budget: {
          min: formData.budgetMin,
          max: formData.budgetMax,
        },
        bedrooms: {
          min: formData.bedroomsMin,
          max: formData.bedroomsMax,
        },
        preferredCommunities: formData.preferredCommunities,
        mustHaveAmenities: formData.mustHaveAmenities,
        niceToHaveAmenities: formData.niceToHaveAmenities,
        status: "new",
      });
    } else {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "Either customerId or customerData is required",
          code: "INVALID_REQUEST",
        },
        { status: 400 }
      );
    }

    // Fetch available properties
    const properties = await getProperties({
      status: "available",
      listingType: customer.customerType === "renter" ? "rent" : "sale",
    });

    if (properties.length === 0) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          error: "No properties available matching your criteria",
          code: "NO_PROPERTIES",
        },
        { status: 404 }
      );
    }

    // Calculate affordability
    const affordability = calculateAffordability(
      customer.monthlyIncome,
      customer.customerType
    );

    // Rank properties and get top matches
    const matches = rankPropertiesForCustomer(customer, properties, {
      limit: 20,
      minScore: 30,
    });

    const response: MatchResponse = {
      success: true,
      customerId: customer.id,
      matches,
      totalProperties: properties.length,
      affordability,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Match API error:", error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "Failed to generate matches",
        code: "INTERNAL_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/match?customerId=xxx
 * Retrieve existing matches for a customer
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json<ApiError>(
        { success: false, error: "customerId is required", code: "INVALID_REQUEST" },
        { status: 400 }
      );
    }

    const customer = await getCustomerById(customerId);
    if (!customer) {
      return NextResponse.json<ApiError>(
        { success: false, error: "Customer not found", code: "CUSTOMER_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Fetch fresh matches
    const properties = await getProperties({
      status: "available",
      listingType: customer.customerType === "renter" ? "rent" : "sale",
    });

    const affordability = calculateAffordability(
      customer.monthlyIncome,
      customer.customerType
    );

    const matches = rankPropertiesForCustomer(customer, properties, {
      limit: 20,
      minScore: 30,
    });

    const response: MatchResponse = {
      success: true,
      customerId: customer.id,
      matches,
      totalProperties: properties.length,
      affordability,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Match API error:", error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "Failed to retrieve matches",
        code: "INTERNAL_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
