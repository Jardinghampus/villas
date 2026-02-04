import { NextRequest, NextResponse } from "next/server";
import { getCustomers, createCustomer } from "@/lib/notion";
import type { Customer, ApiError } from "@/types";

/**
 * GET /api/customers
 * List all customers with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as Customer["status"] | null;
    const type = searchParams.get("type") as Customer["customerType"] | null;

    const customers = await getCustomers({
      status: status ?? undefined,
      type: type ?? undefined,
    });

    return NextResponse.json({
      success: true,
      customers,
      total: customers.length,
    });
  } catch (error) {
    console.error("Customers API error:", error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "Failed to fetch customers",
        code: "INTERNAL_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/customers
 * Create a new customer (lead capture)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone, status = "new" } = body;

    if (!email) {
      return NextResponse.json<ApiError>(
        { success: false, error: "Email is required", code: "INVALID_REQUEST" },
        { status: 400 }
      );
    }

    // Create minimal customer record for lead capture
    const customer = await createCustomer({
      name: name || "Lead",
      email,
      phone,
      customerType: "buyer",
      monthlyIncome: 0,
      budget: { min: 0, max: 0 },
      bedrooms: { min: 3, max: 5 },
      preferredCommunities: [],
      mustHaveAmenities: [],
      niceToHaveAmenities: [],
      status,
    });

    return NextResponse.json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error("Create customer error:", error);

    return NextResponse.json<ApiError>(
      {
        success: false,
        error: "Failed to create customer",
        code: "INTERNAL_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
