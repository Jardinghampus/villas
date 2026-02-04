/**
 * DubaiVille Match Engine
 * AI-powered property matching algorithm
 *
 * Scores properties on multiple dimensions:
 * 1. Affordability (DTI-based)
 * 2. Preference matching (bedrooms, community, amenities)
 * 3. Market fit (price trends, days-to-sale)
 */

import type {
  Customer,
  Property,
  MatchScore,
  MatchExplanation,
  MatchResult,
  AffordabilityResult,
} from "@/types";

// ===========================================
// AFFORDABILITY ENGINE
// ===========================================

/**
 * Calculate affordability based on income and existing debt
 * Using standard DTI (Debt-to-Income) ratio
 * Safe threshold: DTI < 28% (Dubai conservative standard)
 */
export function calculateAffordability(
  monthlyIncome: number,
  customerType: "buyer" | "renter" | "investor",
  existingDebt: number = 0
): AffordabilityResult {
  if (!monthlyIncome || monthlyIncome < 10000) {
    return {
      monthlyIncome,
      maxMonthlyPayment: 0,
      maxBuyPrice: 0,
      maxRentPrice: 0,
      dtiRatio: 100,
      isAffordable: false,
      recommendation:
        "Your income is below minimum threshold. Minimum recommended: 10,000 AED/month.",
    };
  }

  if (customerType === "renter") {
    return calculateRentalAffordability(monthlyIncome, existingDebt);
  } else {
    return calculateBuyingAffordability(monthlyIncome, existingDebt);
  }
}

function calculateBuyingAffordability(
  monthlyIncome: number,
  existingDebt: number
): AffordabilityResult {
  // Dubai home loan: 80% LTV, 4% annual interest, 30-year mortgage
  const maxMonthlyPayment = monthlyIncome * 0.28; // 28% DTI threshold
  const availableForMortgage = maxMonthlyPayment - existingDebt;

  // Calculate max home price from mortgage payment
  // Monthly = Principal * [r(1+r)^n] / [(1+r)^n-1]
  const monthlyRate = 0.04 / 12;
  const numPayments = 360;
  const maxBuyPrice =
    (availableForMortgage * (Math.pow(1 + monthlyRate, numPayments) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments));

  const dtiRatio =
    ((existingDebt + availableForMortgage) / monthlyIncome) * 100;

  return {
    monthlyIncome,
    maxMonthlyPayment: Math.floor(availableForMortgage),
    maxBuyPrice: Math.floor(Math.max(maxBuyPrice, 0)),
    maxRentPrice: Math.floor(monthlyIncome * 0.3),
    dtiRatio: Math.min(dtiRatio, 100),
    isAffordable: dtiRatio <= 28,
    recommendation:
      dtiRatio <= 28
        ? `You can afford up to ${(maxBuyPrice / 1_000_000).toFixed(1)}M AED purchase (${availableForMortgage.toLocaleString()} AED/month)`
        : `Your DTI ratio is ${dtiRatio.toFixed(1)}% (safe threshold: 28%). Max affordable: ${(maxBuyPrice / 1_000_000).toFixed(1)}M AED`,
  };
}

function calculateRentalAffordability(
  monthlyIncome: number,
  existingDebt: number
): AffordabilityResult {
  // Conservative: 30% of income for rent
  const maxMonthlyRent = monthlyIncome * 0.3;
  const availableForRent = maxMonthlyRent - existingDebt;

  const dtiRatio =
    ((existingDebt + availableForRent) / monthlyIncome) * 100;

  return {
    monthlyIncome,
    maxMonthlyPayment: Math.floor(Math.max(availableForRent, 0)),
    maxBuyPrice: 0,
    maxRentPrice: Math.floor(Math.max(availableForRent, 0)),
    dtiRatio,
    isAffordable: dtiRatio <= 30,
    recommendation:
      dtiRatio <= 30
        ? `You can afford up to ${availableForRent.toLocaleString()} AED/month rent`
        : `Recommended max rent: ${(monthlyIncome * 0.3).toLocaleString()} AED/month (safe DTI: 30%)`,
  };
}

// ===========================================
// MATCH SCORING ENGINE
// ===========================================

interface MatchWeights {
  affordability: number;
  bedrooms: number;
  community: number;
  amenities: number;
  marketFit: number;
}

const DEFAULT_WEIGHTS: MatchWeights = {
  affordability: 0.35, // 35%
  bedrooms: 0.15, // 15%
  community: 0.2, // 20%
  amenities: 0.15, // 15%
  marketFit: 0.15, // 15%
};

/**
 * Calculate comprehensive match score between customer and property
 */
export function calculateMatchScore(
  customer: Customer,
  property: Property,
  affordability: AffordabilityResult,
  weights: MatchWeights = DEFAULT_WEIGHTS
): { score: MatchScore; explanation: MatchExplanation } {
  const notes: string[] = [];

  // 1. AFFORDABILITY SCORE (35%)
  const affordabilityScore = calculateAffordabilityScore(
    customer,
    property,
    affordability,
    notes
  );

  // 2. BEDROOMS SCORE (15%)
  const bedroomsScore = calculateBedroomsScore(customer, property, notes);

  // 3. COMMUNITY SCORE (20%)
  const communityScore = calculateCommunityScore(customer, property, notes);

  // 4. AMENITIES SCORE (15%)
  const amenitiesScore = calculateAmenitiesScore(customer, property, notes);

  // 5. MARKET FIT SCORE (15%)
  const marketFitScore = calculateMarketFitScore(property, notes);

  // WEIGHTED OVERALL SCORE
  const overall = Math.round(
    affordabilityScore * weights.affordability +
      bedroomsScore * weights.bedrooms +
      communityScore * weights.community +
      amenitiesScore * weights.amenities +
      marketFitScore * weights.marketFit
  );

  const score: MatchScore = {
    overall: Math.min(overall, 100),
    affordability: affordabilityScore,
    bedrooms: bedroomsScore,
    community: communityScore,
    amenities: amenitiesScore,
    marketFit: marketFitScore,
  };

  const explanation = generateExplanation(score, customer, property, notes);

  return { score, explanation };
}

function calculateAffordabilityScore(
  customer: Customer,
  property: Property,
  affordability: AffordabilityResult,
  notes: string[]
): number {
  const price = property.price;
  const maxPrice =
    customer.customerType === "renter"
      ? affordability.maxRentPrice * 12 // Annual rent
      : affordability.maxBuyPrice;

  if (!maxPrice || maxPrice <= 0) {
    notes.push("Unable to calculate affordability");
    return 0;
  }

  const ratio = price / maxPrice;

  if (ratio <= 1) {
    notes.push(
      `Property price is within budget (${((1 - ratio) * 100).toFixed(0)}% under)`
    );
    return 100;
  } else if (ratio <= 1.05) {
    notes.push("Property is 5% above budget (stretch possible)");
    return 85;
  } else if (ratio <= 1.15) {
    notes.push(
      `Property is ${((ratio - 1) * 100).toFixed(0)}% above budget`
    );
    return 60;
  } else if (ratio <= 1.3) {
    notes.push("Property is significantly above budget");
    return 30;
  } else {
    notes.push("Property is well outside budget");
    return 10;
  }
}

function calculateBedroomsScore(
  customer: Customer,
  property: Property,
  notes: string[]
): number {
  const desired = customer.bedrooms;
  const actual = property.bedrooms;

  if (actual >= desired.min && actual <= desired.max) {
    notes.push(`Perfect bedroom match: ${actual} BR`);
    return 100;
  }

  const diff = Math.min(
    Math.abs(actual - desired.min),
    Math.abs(actual - desired.max)
  );

  if (diff === 1) {
    notes.push(
      `One bedroom difference (wanted ${desired.min}-${desired.max}, got ${actual})`
    );
    return 75;
  } else if (diff === 2) {
    notes.push("Two bedrooms difference");
    return 50;
  } else {
    notes.push("Significant bedroom mismatch");
    return 25;
  }
}

function calculateCommunityScore(
  customer: Customer,
  property: Property,
  notes: string[]
): number {
  if (
    !customer.preferredCommunities ||
    customer.preferredCommunities.length === 0
  ) {
    return 50; // Neutral if no preference
  }

  if (customer.preferredCommunities.includes(property.community)) {
    notes.push(`Property in preferred community: ${property.community}`);
    return 100;
  }

  // Check if in same general area
  const areaGroups: Record<string, string[]> = {
    north: ["Arabian Ranches", "Arabian Ranches 2", "Mudon"],
    central: ["Al Furjan", "Damac Hills", "Damac Hills 2"],
    premium: [
      "Tilal Al Ghaf",
      "Jumeirah Golf Estates",
      "Emirates Hills",
      "Palm Jumeirah",
    ],
    new: ["Dubai Hills Estate", "MBR City", "Sobha Hartland"],
  };

  for (const communities of Object.values(areaGroups)) {
    if (
      communities.includes(property.community) &&
      customer.preferredCommunities.some((c) => communities.includes(c))
    ) {
      notes.push(`Property in similar area: ${property.community}`);
      return 75;
    }
  }

  notes.push("Property outside preferred communities");
  return 40;
}

function calculateAmenitiesScore(
  customer: Customer,
  property: Property,
  notes: string[]
): number {
  let score = 50; // Baseline
  const matches: string[] = [];
  const misses: string[] = [];

  // Check must-have amenities
  for (const amenity of customer.mustHaveAmenities) {
    if (property.amenities.includes(amenity)) {
      score += 15;
      matches.push(amenity);
    } else {
      score -= 10;
      misses.push(amenity);
    }
  }

  // Check nice-to-have amenities
  for (const amenity of customer.niceToHaveAmenities) {
    if (property.amenities.includes(amenity)) {
      score += 5;
      matches.push(amenity);
    }
  }

  if (matches.length > 0) {
    notes.push(`Amenities match: ${matches.slice(0, 3).join(", ")}`);
  }

  if (misses.length > 0) {
    notes.push(`Missing must-haves: ${misses.join(", ")}`);
  }

  return Math.max(0, Math.min(100, score));
}

function calculateMarketFitScore(property: Property, notes: string[]): number {
  let score = 50; // Baseline

  // Fresh listings score higher
  if (property.daysOnMarket < 7) {
    score += 30;
    notes.push(`Fresh listing (${property.daysOnMarket} days on market)`);
  } else if (property.daysOnMarket < 30) {
    score += 15;
    notes.push(`Recent listing (${property.daysOnMarket} days on market)`);
  } else if (property.daysOnMarket > 90) {
    score -= 10;
    notes.push(
      `Long on market (${property.daysOnMarket} days) - consider negotiating`
    );
  }

  // Popular properties (high view count)
  if (property.views > 200) {
    score += 15;
    notes.push(`Popular property (${property.views} views)`);
  } else if (property.views > 100) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

function generateExplanation(
  score: MatchScore,
  _customer: Customer,
  property: Property,
  _notes: string[]
): MatchExplanation {
  let summary: string;

  if (score.overall >= 85) {
    summary = `Excellent match! This ${property.bedrooms}BR ${property.propertyType} in ${property.community} meets your key criteria. We strongly recommend viewing.`;
  } else if (score.overall >= 70) {
    summary = `Good match. This property fits most of your requirements. Worth considering for viewing.`;
  } else if (score.overall >= 50) {
    summary = `Fair match. This property has some positives but may require compromises.`;
  } else {
    summary = `This property doesn't align well with your preferences. Keep looking for better options.`;
  }

  return {
    summary,
    affordabilityNote:
      score.affordability >= 85
        ? "Within your budget"
        : score.affordability >= 60
          ? "Slightly above budget"
          : "Above budget",
    communityNote:
      score.community >= 85
        ? "In preferred community"
        : score.community >= 60
          ? "In similar area"
          : "Outside preferred areas",
    amenitiesNote:
      score.amenities >= 85
        ? "Has most desired amenities"
        : score.amenities >= 60
          ? "Has some desired amenities"
          : "Limited amenity matches",
    marketNote:
      score.marketFit >= 80
        ? "Fresh listing, act fast"
        : score.marketFit >= 60
          ? "Good market timing"
          : "Consider negotiating",
  };
}

// ===========================================
// RANKING ENGINE
// ===========================================

/**
 * Rank and filter properties for a customer, returning top matches
 */
export function rankPropertiesForCustomer(
  customer: Customer,
  properties: Property[],
  options: {
    limit?: number;
    minScore?: number;
  } = {}
): MatchResult[] {
  const { limit = 20, minScore = 30 } = options;

  // Calculate affordability once
  const affordability = calculateAffordability(
    customer.monthlyIncome,
    customer.customerType
  );

  // Score all properties
  const scored = properties.map((property) => {
    const { score, explanation } = calculateMatchScore(
      customer,
      property,
      affordability
    );

    return {
      property,
      score,
      explanation,
      rank: 0,
    };
  });

  // Filter by minimum score and sort
  const filtered = scored
    .filter((match) => match.score.overall >= minScore)
    .sort((a, b) => b.score.overall - a.score.overall);

  // Add ranks and return top results
  return filtered.slice(0, limit).map((match, index) => ({
    ...match,
    rank: index + 1,
  }));
}

// ===========================================
// MARKET INTELLIGENCE
// ===========================================

export interface CommunityIntelligence {
  community: string;
  avgPricePerSqft: number;
  avgDaysOnMarket: number;
  totalListings: number;
  hotProperties: number;
  trend: "up" | "stable" | "down";
}

/**
 * Generate market intelligence by community
 */
export function generateMarketIntelligence(
  properties: Property[]
): Map<string, CommunityIntelligence> {
  const byCommunity = new Map<string, Property[]>();

  // Group by community
  properties.forEach((prop) => {
    const existing = byCommunity.get(prop.community) ?? [];
    existing.push(prop);
    byCommunity.set(prop.community, existing);
  });

  // Calculate metrics per community
  const intelligence = new Map<string, CommunityIntelligence>();

  byCommunity.forEach((communityProps, community) => {
    const pricesPerSqft = communityProps
      .filter((p) => p.pricePerSqft && p.pricePerSqft > 0)
      .map((p) => p.pricePerSqft!);

    const avgPricePerSqft =
      pricesPerSqft.length > 0
        ? pricesPerSqft.reduce((a, b) => a + b, 0) / pricesPerSqft.length
        : 0;

    const avgDaysOnMarket =
      communityProps.reduce((sum, p) => sum + p.daysOnMarket, 0) /
      communityProps.length;

    const hotProperties = communityProps.filter((p) => p.views > 100).length;

    intelligence.set(community, {
      community,
      avgPricePerSqft: Math.round(avgPricePerSqft),
      avgDaysOnMarket: Math.round(avgDaysOnMarket),
      totalListings: communityProps.length,
      hotProperties,
      trend: avgDaysOnMarket < 30 ? "up" : avgDaysOnMarket > 60 ? "down" : "stable",
    });
  });

  return intelligence;
}

export default {
  calculateAffordability,
  calculateMatchScore,
  rankPropertiesForCustomer,
  generateMarketIntelligence,
};
