// lib/match-engine.ts
// Advanced AI matching algorithm for DubaiVille

import { Customer, Property, Match } from '@/types';

/**
 * MATCH ENGINE - Core AI Logic
 * 
 * Scores properties on multiple dimensions:
 * 1. Affordability (DTI-based)
 * 2. Preference matching (bedrooms, community, amenities)
 * 3. Market fit (price trends, days-to-sale)
 * 4. Lifestyle factors (schools, golf, gardens)
 */

// ============================================
// 1. AFFORDABILITY ENGINE
// ============================================

export interface AffordabilityResult {
  type: 'buy' | 'rent';
  maxPrice?: number;
  maxMonthly?: number;
  dtiRatio: number;
  safe: boolean;
  recommendation: string;
  disposableIncome: number;
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * Calculate affordability based on income and existing debt
 * Using standard DTI (Debt-to-Income) ratio
 * Safe threshold: DTI < 28% (Dubai conservative standard)
 */
export function calculateAffordability(
  monthlyIncome: number,
  existingDebt: number = 0, // Car loans, credit cards, etc.
  lookingFor: 'buy' | 'rent' | 'invest'
): AffordabilityResult {
  
  if (!monthlyIncome || monthlyIncome < 10000) {
    return {
      type: lookingFor === 'buy' ? 'buy' : 'rent',
      dtiRatio: 100,
      safe: false,
      recommendation: '❌ Your income is below minimum threshold. Minimum recommended: 10,000 AED/month.',
      disposableIncome: 0,
      riskLevel: 'high',
    };
  }

  if (lookingFor === 'buy') {
    return calculateBuyingAffordability(monthlyIncome, existingDebt);
  } else {
    return calculateRentalAffordability(monthlyIncome, existingDebt);
  }
}

function calculateBuyingAffordability(
  monthlyIncome: number,
  existingDebt: number
): AffordabilityResult {
  // Dubai home loan typically 80% LTV (Loan-To-Value)
  // Assume 4% annual interest rate
  // 30-year mortgage
  
  const maxMonthlyPayment = monthlyIncome * 0.28; // 28% DTI threshold
  const existingDebtPayment = existingDebt || 0;
  const availableForMortgage = maxMonthlyPayment - existingDebtPayment;

  // Calculate max home price from mortgage payment
  // Monthly = Principal * [r(1+r)^n] / [(1+r)^n-1]
  // Where r = 0.04/12 (monthly rate), n = 360 (months)
  const monthlyRate = 0.04 / 12;
  const numPayments = 360;
  const maxHomePrice = (availableForMortgage * (Math.pow(1 + monthlyRate, numPayments) - 1)) /
                       (monthlyRate * Math.pow(1 + monthlyRate, numPayments));

  const dtiRatio = (existingDebtPayment + availableForMortgage) / monthlyIncome;
  const safe = dtiRatio <= 0.28;
  const disposableIncome = monthlyIncome - (existingDebtPayment + availableForMortgage);

  return {
    type: 'buy',
    maxPrice: Math.floor(maxHomePrice),
    dtiRatio: Math.min(dtiRatio * 100, 100),
    safe,
    recommendation: safe
      ? `✅ You can afford up to ${(maxHomePrice / 1_000_000).toFixed(1)}M AED purchase (${(availableForMortgage).toLocaleString()} AED/month)`
      : `⚠️ Your debt-to-income ratio is ${(dtiRatio * 100).toFixed(1)}% (safe threshold: 28%). Max affordable: ${(maxHomePrice / 1_000_000).toFixed(1)}M AED`,
    disposableIncome: Math.max(disposableIncome, 0),
    riskLevel: dtiRatio > 0.35 ? 'high' : dtiRatio > 0.28 ? 'medium' : 'low',
  };
}

function calculateRentalAffordability(
  monthlyIncome: number,
  existingDebt: number
): AffordabilityResult {
  // Conservative: 30% of income for rent
  const maxMonthlyRent = monthlyIncome * 0.30;
  const existingDebtPayment = existingDebt || 0;
  const availableForRent = maxMonthlyRent - existingDebtPayment;

  const totalDebtPayment = existingDebtPayment + availableForRent;
  const dtiRatio = totalDebtPayment / monthlyIncome;
  const safe = dtiRatio <= 0.30;
  const disposableIncome = monthlyIncome - totalDebtPayment;

  return {
    type: 'rent',
    maxMonthly: Math.floor(Math.max(availableForRent, 0)),
    dtiRatio: dtiRatio * 100,
    safe,
    recommendation: safe
      ? `✅ You can afford up to ${availableForRent.toLocaleString()} AED/month rent`
      : `⚠️ Recommended max rent: ${(monthlyIncome * 0.30).toLocaleString()} AED/month (safe DTI: 30%)`,
    disposableIncome: Math.max(disposableIncome, 0),
    riskLevel: dtiRatio > 0.35 ? 'high' : dtiRatio > 0.30 ? 'medium' : 'low',
  };
}

// ============================================
// 2. PREFERENCE MATCHING ENGINE
// ============================================

interface PreferenceWeights {
  affordability: 0.35; // 35%
  bedrooms: 0.15;      // 15%
  community: 0.20;     // 20%
  amenities: 0.15;     // 15%
  marketFit: 0.15;     // 15%
}

export interface MatchScore {
  overallScore: number; // 0-100
  affordabilityScore: number;
  preferenceScore: number;
  marketScore: number;
  recommendation: string;
  reasoning: string[];
}

/**
 * Calculate comprehensive match score between customer and property
 */
export function calculateMatchScore(
  customer: Customer,
  property: Property,
  affordability: AffordabilityResult
): MatchScore {
  const weights: PreferenceWeights = {
    affordability: 0.35,
    bedrooms: 0.15,
    community: 0.20,
    amenities: 0.15,
    marketFit: 0.15,
  };

  const reasoning: string[] = [];

  // 1. AFFORDABILITY SCORE (35%)
  const affordabilityScore = calculateAffordabilityScore(
    customer,
    property,
    affordability,
    reasoning
  );

  // 2. PREFERENCE SCORE (50%)
  const bedrooomScore = calculateBedroomScore(customer, property, reasoning);
  const communityScore = calculateCommunityScore(customer, property, reasoning);
  const amenitiesScore = calculateAmenitiesScore(customer, property, reasoning);
  
  const preferenceScore = (
    (bedrooomScore * weights.bedrooms) +
    (communityScore * weights.community) +
    (amenitiesScore * weights.amenities)
  ) / (weights.bedrooms + weights.community + weights.amenities);

  // 3. MARKET SCORE (15%)
  const marketScore = calculateMarketScore(property, reasoning);

  // WEIGHTED OVERALL SCORE
  const overallScore = Math.round(
    (affordabilityScore * weights.affordability) +
    (preferenceScore * (weights.bedrooms + weights.community + weights.amenities)) +
    (marketScore * weights.marketFit)
  );

  const recommendation = generateRecommendation(
    overallScore,
    affordabilityScore,
    customer,
    property
  );

  return {
    overallScore: Math.min(overallScore, 100),
    affordabilityScore,
    preferenceScore: Math.round(preferenceScore),
    marketScore,
    recommendation,
    reasoning,
  };
}

function calculateAffordabilityScore(
  customer: Customer,
  property: Property,
  affordability: AffordabilityResult,
  reasoning: string[]
): number {
  let score = 0;

  if (affordability.type === 'buy' && property.price) {
    const maxPrice = affordability.maxPrice || 0;
    const price = property.price;

    if (price <= maxPrice) {
      score = 100;
      reasoning.push(`✅ Property price (${(price / 1_000_000).toFixed(1)}M) is within budget (${(maxPrice / 1_000_000).toFixed(1)}M)`);
    } else if (price <= maxPrice * 1.05) {
      score = 85;
      reasoning.push(`⚠️ Property is 5% above budget (${((price / maxPrice - 1) * 100).toFixed(0)}% over)`);
    } else if (price <= maxPrice * 1.15) {
      score = 60;
      reasoning.push(`⚠️ Property is ${((price / maxPrice - 1) * 100).toFixed(0)}% above budget (stretch possible)`);
    } else {
      score = 30;
      reasoning.push(`❌ Property is significantly above budget (${((price / maxPrice - 1) * 100).toFixed(0)}% over)`);
    }
  } else if (affordability.type === 'rent' && property.rent) {
    const maxMonthly = affordability.maxMonthly || 0;
    const rent = property.rent;

    if (rent <= maxMonthly) {
      score = 100;
      reasoning.push(`✅ Rent (${rent.toLocaleString()} AED) fits budget (${maxMonthly.toLocaleString()} AED)`);
    } else if (rent <= maxMonthly * 1.05) {
      score = 85;
      reasoning.push(`⚠️ Rent is 5% above budget`);
    } else if (rent <= maxMonthly * 1.15) {
      score = 60;
      reasoning.push(`⚠️ Rent is ${((rent / maxMonthly - 1) * 100).toFixed(0)}% above budget`);
    } else {
      score = 30;
      reasoning.push(`❌ Rent is significantly above budget`);
    }
  }

  return score;
}

function calculateBedroomScore(
  customer: Customer,
  property: Property,
  reasoning: string[]
): number {
  const desired = customer.bedroomsNeeded;
  const actual = property.bedrooms;
  const diff = Math.abs(desired - actual);

  if (diff === 0) {
    reasoning.push(`✅ Perfect bedroom match: ${actual} BR`);
    return 100;
  } else if (diff === 1) {
    reasoning.push(`👍 One bedroom difference (desired ${desired}, got ${actual})`);
    return 75;
  } else if (diff === 2) {
    reasoning.push(`📌 Two bedrooms difference`);
    return 50;
  } else {
    reasoning.push(`❌ Significant bedroom mismatch`);
    return 25;
  }
}

function calculateCommunityScore(
  customer: Customer,
  property: Property,
  reasoning: string[]
): number {
  if (!customer.communities || customer.communities.length === 0) {
    return 50; // Neutral if no preference
  }

  if (customer.communities.includes(property.community)) {
    reasoning.push(`✅ Property in preferred community: ${property.community}`);
    return 100;
  }

  // Check if in same general area
  const areaGroups = {
    'north': ['Arabian Ranches', 'Mudon'],
    'central': ['Al Furjan', 'Damac Hills'],
    'premium': ['Tilal Al Ghaf', 'Jumeirah Golf Estates'],
  };

  for (const [area, communities] of Object.entries(areaGroups)) {
    if (communities.includes(property.community) &&
        customer.communities.some(c => communities.includes(c))) {
      reasoning.push(`👍 Property in similar area: ${property.community}`);
      return 75;
    }
  }

  reasoning.push(`📌 Property outside preferred communities`);
  return 40;
}

function calculateAmenitiesScore(
  customer: Customer,
  property: Property,
  reasoning: string[]
): number {
  let score = 50; // Baseline
  const matches: string[] = [];

  if (customer.schoolsPriority && property.hasSchools) {
    score += 15;
    matches.push('schools');
  }

  if (customer.golfProximity && property.nearGolf) {
    score += 15;
    matches.push('golf');
  }

  if (customer.largeGarden && property.hasLargeGarden) {
    score += 15;
    matches.push('garden');
  }

  if (matches.length > 0) {
    reasoning.push(`✅ Amenities match: ${matches.join(', ')}`);
  } else {
    reasoning.push(`📌 Limited amenity matches`);
  }

  return Math.min(score, 100);
}

function calculateMarketScore(
  property: Property,
  reasoning: string[]
): number {
  let score = 50; // Baseline

  // Fresh listings score higher
  if (property.daysOnMarket < 7) {
    score += 30;
    reasoning.push(`🔥 Fresh listing (${property.daysOnMarket} days on market)`);
  } else if (property.daysOnMarket < 30) {
    score += 15;
    reasoning.push(`🌟 Recent listing (${property.daysOnMarket} days on market)`);
  } else if (property.daysOnMarket > 90) {
    score -= 20;
    reasoning.push(`⏰ Long on market (${property.daysOnMarket} days) - consider negotiating`);
  }

  // Popular properties (high view count)
  if (property.viewCount > 200) {
    score += 15;
    reasoning.push(`👀 Popular property (${property.viewCount} views)`);
  }

  return Math.min(Math.max(score, 0), 100);
}

function generateRecommendation(
  score: number,
  affordabilityScore: number,
  customer: Customer,
  property: Property
): string {
  if (affordabilityScore < 50) {
    return `⚠️ This property is outside your budget. Consider looking at different price ranges.`;
  }

  if (score >= 85) {
    return `✅ EXCELLENT MATCH! This property meets your key criteria. We strongly recommend contacting the agent.`;
  }

  if (score >= 70) {
    return `👍 GOOD MATCH. This property fits most of your requirements. Definitely worth viewing.`;
  }

  if (score >= 50) {
    return `📌 FAIR MATCH. This property has some positives. Consider viewing if other options are limited.`;
  }

  return `❌ POOR MATCH. This property doesn't align well with your preferences. Keep looking.`;
}

// ============================================
// 3. RANKING & FILTERING
// ============================================

/**
 * Rank multiple properties for a customer
 */
export interface RankedProperty extends Property {
  matchScore: MatchScore;
  rank: number;
  percentileTile: number; // 0-100 (where does this rank vs all properties)
}

export function rankPropertiesForCustomer(
  customer: Customer,
  properties: Property[],
  affordability: AffordabilityResult
): RankedProperty[] {
  // Calculate scores for all properties
  const scored = properties.map((property, index) => ({
    ...property,
    matchScore: calculateMatchScore(customer, property, affordability),
    originalIndex: index,
  }));

  // Sort by overall score (descending)
  const sorted = [...scored].sort((a, b) => 
    b.matchScore.overallScore - a.matchScore.overallScore
  );

  // Add rank and percentile
  const maxScore = sorted[0]?.matchScore.overallScore || 0;
  
  return sorted.map((property, index) => ({
    ...property,
    rank: index + 1,
    percentileTile: Math.round(((maxScore - property.matchScore.overallScore) / maxScore) * 100),
  }));
}

// ============================================
// 4. MARKET INTELLIGENCE
// ============================================

export interface MarketIntelligence {
  community: string;
  avgPricePerSqft: number;
  avgRentPerSqft: number;
  avgDaysToSale: number;
  avgDaysToRent: number;
  priceChange3m: number; // % change
  absorptionRate: number; // % of inventory sold per month
  hotProperties: number; // Properties with 100+ views
  trend: 'up' | 'stable' | 'down';
}

export function generateMarketIntelligence(
  properties: Property[]
): Map<string, MarketIntelligence> {
  const byCommunity = new Map<string, Property[]>();

  // Group by community
  properties.forEach(prop => {
    if (!byCollection.has(prop.community)) {
      byCollection.set(prop.community, []);
    }
    byCollection.get(prop.community)!.push(prop);
  });

  // Calculate metrics per community
  const intelligence = new Map<string, MarketIntelligence>();

  byCollection.forEach((communityProps, community) => {
    const avgPrice = communityProps
      .filter(p => p.price)
      .reduce((sum, p) => sum + p.price!, 0) / communityProps.filter(p => p.price).length;

    const avgSqft = communityProps.reduce((sum, p) => sum + p.sqft, 0) / communityProps.length;
    const avgPricePerSqft = avgPrice / avgSqft;

    const avgRent = communityProps
      .filter(p => p.rent)
      .reduce((sum, p) => sum + p.rent!, 0) / communityProps.filter(p => p.rent).length;

    const avgRentPerSqft = avgRent / avgSqft;

    const avgDaysToSale = communityProps
      .filter(p => p.soldDaysToSale)
      .reduce((sum, p) => sum + p.soldDaysToSale!, 0) /
      communityProps.filter(p => p.soldDaysToSale).length;

    const hotProps = communityProps.filter(p => p.viewCount > 100).length;

    intelligence.set(community, {
      community,
      avgPricePerSqft,
      avgRentPerSqft,
      avgDaysToSale: Math.round(avgDaysToSale),
      avgDaysToRent: 45, // Placeholder - would calculate from data
      priceChange3m: 2.5, // Placeholder - would calculate from historical data
      absorptionRate: 8.5, // Placeholder
      hotProperties: hotProps,
      trend: avgDaysToSale < 30 ? 'up' : avgDaysToSale > 50 ? 'down' : 'stable',
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
