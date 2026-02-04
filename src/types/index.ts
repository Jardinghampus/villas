// ===========================================
// DubaiVille TypeScript Types
// ===========================================

// ===========================================
// Customer Types
// ===========================================
export type CustomerType = "buyer" | "renter" | "investor";
export type CustomerStatus = "new" | "qualified" | "matched" | "closed" | "inactive";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  customerType: CustomerType;
  monthlyIncome: number;
  budget: {
    min: number;
    max: number;
  };
  bedrooms: {
    min: number;
    max: number;
  };
  preferredCommunities: string[];
  mustHaveAmenities: string[];
  niceToHaveAmenities: string[];
  status: CustomerStatus;
  assignedAgent?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone?: string;
  customerType: CustomerType;
  monthlyIncome: number;
  budgetMin: number;
  budgetMax: number;
  bedroomsMin: number;
  bedroomsMax: number;
  preferredCommunities: string[];
  mustHaveAmenities: string[];
  niceToHaveAmenities: string[];
}

// ===========================================
// Property Types
// ===========================================
export type PropertyType = "villa" | "townhouse" | "apartment" | "penthouse";
export type PropertyStatus = "available" | "under_offer" | "sold" | "rented" | "off_market";
export type ListingType = "sale" | "rent";

export interface Property {
  id: string;
  title: string;
  community: string;
  subCommunity?: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number;
  pricePerSqft?: number;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  plotSizeSqft?: number;
  yearBuilt?: number;
  amenities: string[];
  description?: string;
  images: string[];
  floorPlan?: string;
  virtualTour?: string;
  status: PropertyStatus;
  daysOnMarket: number;
  views: number;
  inquiries: number;
  agentId?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// Match Types
// ===========================================
export type MatchStatus = "pending" | "viewed" | "interested" | "rejected" | "contacted" | "touring" | "negotiating" | "closed";

export interface MatchScore {
  overall: number;
  affordability: number;
  bedrooms: number;
  community: number;
  amenities: number;
  marketFit: number;
}

export interface MatchExplanation {
  summary: string;
  affordabilityNote: string;
  communityNote: string;
  amenitiesNote: string;
  marketNote: string;
}

export interface Match {
  id: string;
  customerId: string;
  propertyId: string;
  score: MatchScore;
  explanation: MatchExplanation;
  status: MatchStatus;
  rank: number;
  customerFeedback?: string;
  agentNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchResult {
  property: Property;
  score: MatchScore;
  explanation: MatchExplanation;
  rank: number;
}

// ===========================================
// Agent Types
// ===========================================
export type AgentStatus = "active" | "inactive" | "on_leave";

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  photo?: string;
  bio?: string;
  specializations: string[];
  languages: string[];
  status: AgentStatus;
  totalDeals: number;
  totalVolume: number;
  activeListings: number;
  averageRating: number;
  reviewCount: number;
  joinedAt: string;
}

// ===========================================
// Analytics Types
// ===========================================
export interface DailyMetrics {
  date: string;
  newLeads: number;
  matchesGenerated: number;
  propertiesViewed: number;
  inquiriesSent: number;
  touringsScheduled: number;
  dealsClosed: number;
}

export interface CommunityMetrics {
  community: string;
  avgPricePerSqft: number;
  avgDaysOnMarket: number;
  totalListings: number;
  soldLast30Days: number;
  priceChangePercent: number;
}

export interface Analytics {
  id: string;
  period: "daily" | "weekly" | "monthly";
  date: string;
  totalLeads: number;
  qualifiedLeads: number;
  totalMatches: number;
  conversionRate: number;
  avgMatchScore: number;
  topCommunities: string[];
  metrics: DailyMetrics;
  communityMetrics: CommunityMetrics[];
}

// ===========================================
// API Types
// ===========================================
export interface MatchRequest {
  customerId?: string;
  customerData?: CustomerFormData;
}

export interface MatchResponse {
  success: boolean;
  customerId: string;
  matches: MatchResult[];
  totalProperties: number;
  affordability: AffordabilityResult;
  generatedAt: string;
}

export interface AffordabilityResult {
  monthlyIncome: number;
  maxMonthlyPayment: number;
  maxBuyPrice: number;
  maxRentPrice: number;
  dtiRatio: number;
  isAffordable: boolean;
  recommendation: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

// ===========================================
// UI Types
// ===========================================
export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string | number;
}

export interface FilterOptions {
  communities: string[];
  propertyTypes: PropertyType[];
  listingTypes: ListingType[];
  priceRange: { min: number; max: number };
  bedroomsRange: { min: number; max: number };
  amenities: string[];
}

export interface SortOption {
  field: keyof Property | "matchScore";
  direction: "asc" | "desc";
  label: string;
}

// ===========================================
// Blog Types
// ===========================================
export type BlogCategory = "market-insight" | "agent-tips" | "community-guide" | "investment" | "lifestyle";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: BlogCategory;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  featured: boolean;
}

// ===========================================
// Constants
// ===========================================
export const DUBAI_COMMUNITIES = [
  "Arabian Ranches",
  "Arabian Ranches 2",
  "Arabian Ranches 3",
  "Dubai Hills Estate",
  "Emirates Hills",
  "Jumeirah Golf Estates",
  "Jumeirah Islands",
  "Jumeirah Park",
  "Meadows",
  "Palm Jumeirah",
  "Springs",
  "The Lakes",
  "The Villa",
  "Victory Heights",
  "Damac Hills",
  "Damac Hills 2",
  "MBR City",
  "Tilal Al Ghaf",
  "Sobha Hartland",
  "District One",
] as const;

export const PROPERTY_AMENITIES = [
  "Private Pool",
  "Private Garden",
  "Maid's Room",
  "Driver's Room",
  "Study Room",
  "Gym",
  "Smart Home",
  "Solar Panels",
  "EV Charger",
  "Basement",
  "Rooftop Terrace",
  "BBQ Area",
  "Children's Play Area",
  "Home Cinema",
  "Wine Cellar",
  "Golf Course View",
  "Lake View",
  "Park View",
  "Skyline View",
  "Beach Access",
] as const;

export type DubaiCommunity = (typeof DUBAI_COMMUNITIES)[number];
export type PropertyAmenity = (typeof PROPERTY_AMENITIES)[number];
