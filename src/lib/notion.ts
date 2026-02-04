import { Client } from "@notionhq/client";
import type {
  Customer,
  Property,
  Match,
  Agent,
  Analytics,
  CustomerType,
  CustomerStatus,
  PropertyType,
  PropertyStatus,
  ListingType,
  MatchStatus,
  MatchScore,
  MatchExplanation,
} from "@/types";

// ===========================================
// Initialize Notion Client
// ===========================================
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Database IDs from environment
const DATABASE_IDS = {
  customers: process.env.NOTION_DATABASE_CUSTOMERS!,
  properties: process.env.NOTION_DATABASE_PROPERTIES!,
  matches: process.env.NOTION_DATABASE_MATCHES!,
  agents: process.env.NOTION_DATABASE_AGENTS!,
  analytics: process.env.NOTION_DATABASE_ANALYTICS!,
};

// ===========================================
// Type Guards and Helpers
// ===========================================
type NotionPropertyValue =
  | { type: "title"; title: Array<{ plain_text: string }> }
  | { type: "rich_text"; rich_text: Array<{ plain_text: string }> }
  | { type: "number"; number: number | null }
  | { type: "select"; select: { name: string } | null }
  | { type: "multi_select"; multi_select: Array<{ name: string }> }
  | { type: "email"; email: string | null }
  | { type: "phone_number"; phone_number: string | null }
  | { type: "url"; url: string | null }
  | { type: "checkbox"; checkbox: boolean }
  | { type: "date"; date: { start: string } | null }
  | { type: "files"; files: Array<{ file?: { url: string }; external?: { url: string } }> }
  | { type: "relation"; relation: Array<{ id: string }> }
  | { type: "created_time"; created_time: string }
  | { type: "last_edited_time"; last_edited_time: string };

function getTextValue(prop: NotionPropertyValue | undefined): string {
  if (!prop) return "";
  if (prop.type === "title" && prop.title.length > 0) {
    return prop.title[0].plain_text;
  }
  if (prop.type === "rich_text" && prop.rich_text.length > 0) {
    return prop.rich_text[0].plain_text;
  }
  return "";
}

function getNumberValue(prop: NotionPropertyValue | undefined): number {
  if (!prop || prop.type !== "number") return 0;
  return prop.number ?? 0;
}

function getSelectValue(prop: NotionPropertyValue | undefined): string {
  if (!prop || prop.type !== "select" || !prop.select) return "";
  return prop.select.name;
}

function getMultiSelectValues(prop: NotionPropertyValue | undefined): string[] {
  if (!prop || prop.type !== "multi_select") return [];
  return prop.multi_select.map((item) => item.name);
}

function getEmailValue(prop: NotionPropertyValue | undefined): string {
  if (!prop || prop.type !== "email") return "";
  return prop.email ?? "";
}

function getPhoneValue(prop: NotionPropertyValue | undefined): string {
  if (!prop || prop.type !== "phone_number") return "";
  return prop.phone_number ?? "";
}

function getUrlValue(prop: NotionPropertyValue | undefined): string {
  if (!prop || prop.type !== "url") return "";
  return prop.url ?? "";
}

function _getCheckboxValue(prop: NotionPropertyValue | undefined): boolean {
  if (!prop || prop.type !== "checkbox") return false;
  return prop.checkbox;
}

function getDateValue(prop: NotionPropertyValue | undefined): string {
  if (!prop || prop.type !== "date" || !prop.date) return "";
  return prop.date.start;
}

function getFilesValue(prop: NotionPropertyValue | undefined): string[] {
  if (!prop || prop.type !== "files") return [];
  return prop.files.map((file) => file.file?.url ?? file.external?.url ?? "").filter(Boolean);
}

function getRelationIds(prop: NotionPropertyValue | undefined): string[] {
  if (!prop || prop.type !== "relation") return [];
  return prop.relation.map((r) => r.id);
}

function getCreatedTime(prop: NotionPropertyValue | undefined): string {
  if (!prop || prop.type !== "created_time") return new Date().toISOString();
  return prop.created_time;
}

function getLastEditedTime(prop: NotionPropertyValue | undefined): string {
  if (!prop || prop.type !== "last_edited_time") return new Date().toISOString();
  return prop.last_edited_time;
}

// ===========================================
// Customer Functions
// ===========================================
export async function getCustomers(filters?: {
  status?: CustomerStatus;
  type?: CustomerType;
}): Promise<Customer[]> {
  const filterConditions: Array<{
    property: string;
    select: { equals: string };
  }> = [];

  if (filters?.status) {
    filterConditions.push({
      property: "Status",
      select: { equals: filters.status },
    });
  }

  if (filters?.type) {
    filterConditions.push({
      property: "Customer Type",
      select: { equals: filters.type },
    });
  }

  const response = await notion.databases.query({
    database_id: DATABASE_IDS.customers,
    filter:
      filterConditions.length > 0
        ? { and: filterConditions }
        : undefined,
    sorts: [{ timestamp: "created_time", direction: "descending" }],
  });

  return response.results.map((page) => {
    const props = (page as { properties: Record<string, NotionPropertyValue> }).properties;
    return {
      id: page.id,
      name: getTextValue(props["Name"]),
      email: getEmailValue(props["Email"]),
      phone: getPhoneValue(props["Phone"]),
      whatsapp: getPhoneValue(props["WhatsApp"]),
      customerType: getSelectValue(props["Customer Type"]) as CustomerType,
      monthlyIncome: getNumberValue(props["Monthly Income"]),
      budget: {
        min: getNumberValue(props["Budget Min"]),
        max: getNumberValue(props["Budget Max"]),
      },
      bedrooms: {
        min: getNumberValue(props["Bedrooms Min"]),
        max: getNumberValue(props["Bedrooms Max"]),
      },
      preferredCommunities: getMultiSelectValues(props["Preferred Communities"]),
      mustHaveAmenities: getMultiSelectValues(props["Must Have Amenities"]),
      niceToHaveAmenities: getMultiSelectValues(props["Nice to Have Amenities"]),
      status: getSelectValue(props["Status"]) as CustomerStatus,
      assignedAgent: getRelationIds(props["Assigned Agent"])[0],
      createdAt: getCreatedTime(props["Created"]),
      updatedAt: getLastEditedTime(props["Updated"]),
      notes: getTextValue(props["Notes"]),
    };
  });
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    const props = (page as { properties: Record<string, NotionPropertyValue> }).properties;

    return {
      id: page.id,
      name: getTextValue(props["Name"]),
      email: getEmailValue(props["Email"]),
      phone: getPhoneValue(props["Phone"]),
      whatsapp: getPhoneValue(props["WhatsApp"]),
      customerType: getSelectValue(props["Customer Type"]) as CustomerType,
      monthlyIncome: getNumberValue(props["Monthly Income"]),
      budget: {
        min: getNumberValue(props["Budget Min"]),
        max: getNumberValue(props["Budget Max"]),
      },
      bedrooms: {
        min: getNumberValue(props["Bedrooms Min"]),
        max: getNumberValue(props["Bedrooms Max"]),
      },
      preferredCommunities: getMultiSelectValues(props["Preferred Communities"]),
      mustHaveAmenities: getMultiSelectValues(props["Must Have Amenities"]),
      niceToHaveAmenities: getMultiSelectValues(props["Nice to Have Amenities"]),
      status: getSelectValue(props["Status"]) as CustomerStatus,
      assignedAgent: getRelationIds(props["Assigned Agent"])[0],
      createdAt: getCreatedTime(props["Created"]),
      updatedAt: getLastEditedTime(props["Updated"]),
      notes: getTextValue(props["Notes"]),
    };
  } catch {
    return null;
  }
}

export async function createCustomer(
  data: Omit<Customer, "id" | "createdAt" | "updatedAt">
): Promise<Customer> {
  const response = await notion.pages.create({
    parent: { database_id: DATABASE_IDS.customers },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      Email: { email: data.email },
      Phone: { phone_number: data.phone ?? null },
      WhatsApp: { phone_number: data.whatsapp ?? null },
      "Customer Type": { select: { name: data.customerType } },
      "Monthly Income": { number: data.monthlyIncome },
      "Budget Min": { number: data.budget.min },
      "Budget Max": { number: data.budget.max },
      "Bedrooms Min": { number: data.bedrooms.min },
      "Bedrooms Max": { number: data.bedrooms.max },
      "Preferred Communities": {
        multi_select: data.preferredCommunities.map((c) => ({ name: c })),
      },
      "Must Have Amenities": {
        multi_select: data.mustHaveAmenities.map((a) => ({ name: a })),
      },
      "Nice to Have Amenities": {
        multi_select: data.niceToHaveAmenities.map((a) => ({ name: a })),
      },
      Status: { select: { name: data.status } },
      Notes: { rich_text: [{ text: { content: data.notes ?? "" } }] },
    },
  });

  const customer = await getCustomerById(response.id);
  if (!customer) throw new Error("Failed to create customer");
  return customer;
}

export async function updateCustomer(
  id: string,
  data: Partial<Customer>
): Promise<Customer> {
  const properties: Record<string, unknown> = {};

  if (data.name) properties["Name"] = { title: [{ text: { content: data.name } }] };
  if (data.email) properties["Email"] = { email: data.email };
  if (data.phone !== undefined) properties["Phone"] = { phone_number: data.phone };
  if (data.customerType) properties["Customer Type"] = { select: { name: data.customerType } };
  if (data.monthlyIncome) properties["Monthly Income"] = { number: data.monthlyIncome };
  if (data.budget) {
    properties["Budget Min"] = { number: data.budget.min };
    properties["Budget Max"] = { number: data.budget.max };
  }
  if (data.bedrooms) {
    properties["Bedrooms Min"] = { number: data.bedrooms.min };
    properties["Bedrooms Max"] = { number: data.bedrooms.max };
  }
  if (data.preferredCommunities) {
    properties["Preferred Communities"] = {
      multi_select: data.preferredCommunities.map((c) => ({ name: c })),
    };
  }
  if (data.status) properties["Status"] = { select: { name: data.status } };
  if (data.notes !== undefined) properties["Notes"] = { rich_text: [{ text: { content: data.notes } }] };

  await notion.pages.update({ page_id: id, properties });

  const customer = await getCustomerById(id);
  if (!customer) throw new Error("Failed to update customer");
  return customer;
}

// ===========================================
// Property Functions
// ===========================================
export async function getProperties(filters?: {
  status?: PropertyStatus;
  listingType?: ListingType;
  community?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
}): Promise<Property[]> {
  const filterConditions: Array<{
    property: string;
    select?: { equals: string };
    number?: { greater_than_or_equal_to?: number; less_than_or_equal_to?: number };
  }> = [];

  if (filters?.status) {
    filterConditions.push({ property: "Status", select: { equals: filters.status } });
  }
  if (filters?.listingType) {
    filterConditions.push({ property: "Listing Type", select: { equals: filters.listingType } });
  }
  if (filters?.community) {
    filterConditions.push({ property: "Community", select: { equals: filters.community } });
  }
  if (filters?.minPrice) {
    filterConditions.push({
      property: "Price",
      number: { greater_than_or_equal_to: filters.minPrice },
    });
  }
  if (filters?.maxPrice) {
    filterConditions.push({
      property: "Price",
      number: { less_than_or_equal_to: filters.maxPrice },
    });
  }

  const response = await notion.databases.query({
    database_id: DATABASE_IDS.properties,
    filter: filterConditions.length > 0 ? { and: filterConditions } : undefined,
    sorts: [{ property: "Price", direction: "ascending" }],
  });

  return response.results.map((page) => {
    const props = (page as { properties: Record<string, NotionPropertyValue> }).properties;
    return {
      id: page.id,
      title: getTextValue(props["Title"]),
      community: getSelectValue(props["Community"]),
      subCommunity: getTextValue(props["Sub-Community"]),
      propertyType: getSelectValue(props["Property Type"]) as PropertyType,
      listingType: getSelectValue(props["Listing Type"]) as ListingType,
      price: getNumberValue(props["Price"]),
      pricePerSqft: getNumberValue(props["Price per Sqft"]),
      bedrooms: getNumberValue(props["Bedrooms"]),
      bathrooms: getNumberValue(props["Bathrooms"]),
      sizeSqft: getNumberValue(props["Size Sqft"]),
      plotSizeSqft: getNumberValue(props["Plot Size Sqft"]),
      yearBuilt: getNumberValue(props["Year Built"]),
      amenities: getMultiSelectValues(props["Amenities"]),
      description: getTextValue(props["Description"]),
      images: getFilesValue(props["Images"]),
      floorPlan: getUrlValue(props["Floor Plan"]),
      virtualTour: getUrlValue(props["Virtual Tour"]),
      status: getSelectValue(props["Status"]) as PropertyStatus,
      daysOnMarket: getNumberValue(props["Days on Market"]),
      views: getNumberValue(props["Views"]),
      inquiries: getNumberValue(props["Inquiries"]),
      agentId: getRelationIds(props["Agent"])[0],
      address: getTextValue(props["Address"]),
      latitude: getNumberValue(props["Latitude"]),
      longitude: getNumberValue(props["Longitude"]),
      createdAt: getCreatedTime(props["Created"]),
      updatedAt: getLastEditedTime(props["Updated"]),
    };
  });
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    const props = (page as { properties: Record<string, NotionPropertyValue> }).properties;

    return {
      id: page.id,
      title: getTextValue(props["Title"]),
      community: getSelectValue(props["Community"]),
      subCommunity: getTextValue(props["Sub-Community"]),
      propertyType: getSelectValue(props["Property Type"]) as PropertyType,
      listingType: getSelectValue(props["Listing Type"]) as ListingType,
      price: getNumberValue(props["Price"]),
      pricePerSqft: getNumberValue(props["Price per Sqft"]),
      bedrooms: getNumberValue(props["Bedrooms"]),
      bathrooms: getNumberValue(props["Bathrooms"]),
      sizeSqft: getNumberValue(props["Size Sqft"]),
      plotSizeSqft: getNumberValue(props["Plot Size Sqft"]),
      yearBuilt: getNumberValue(props["Year Built"]),
      amenities: getMultiSelectValues(props["Amenities"]),
      description: getTextValue(props["Description"]),
      images: getFilesValue(props["Images"]),
      floorPlan: getUrlValue(props["Floor Plan"]),
      virtualTour: getUrlValue(props["Virtual Tour"]),
      status: getSelectValue(props["Status"]) as PropertyStatus,
      daysOnMarket: getNumberValue(props["Days on Market"]),
      views: getNumberValue(props["Views"]),
      inquiries: getNumberValue(props["Inquiries"]),
      agentId: getRelationIds(props["Agent"])[0],
      address: getTextValue(props["Address"]),
      latitude: getNumberValue(props["Latitude"]),
      longitude: getNumberValue(props["Longitude"]),
      createdAt: getCreatedTime(props["Created"]),
      updatedAt: getLastEditedTime(props["Updated"]),
    };
  } catch {
    return null;
  }
}

// ===========================================
// Match Functions
// ===========================================
export async function createMatch(data: {
  customerId: string;
  propertyId: string;
  score: MatchScore;
  explanation: MatchExplanation;
  rank: number;
}): Promise<Match> {
  const response = await notion.pages.create({
    parent: { database_id: DATABASE_IDS.matches },
    properties: {
      Customer: { relation: [{ id: data.customerId }] },
      Property: { relation: [{ id: data.propertyId }] },
      "Overall Score": { number: data.score.overall },
      "Affordability Score": { number: data.score.affordability },
      "Bedrooms Score": { number: data.score.bedrooms },
      "Community Score": { number: data.score.community },
      "Amenities Score": { number: data.score.amenities },
      "Market Fit Score": { number: data.score.marketFit },
      Summary: { rich_text: [{ text: { content: data.explanation.summary } }] },
      Rank: { number: data.rank },
      Status: { select: { name: "pending" } },
    },
  });

  return {
    id: response.id,
    customerId: data.customerId,
    propertyId: data.propertyId,
    score: data.score,
    explanation: data.explanation,
    status: "pending",
    rank: data.rank,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function getMatchesByCustomer(customerId: string): Promise<Match[]> {
  const response = await notion.databases.query({
    database_id: DATABASE_IDS.matches,
    filter: {
      property: "Customer",
      relation: { contains: customerId },
    },
    sorts: [{ property: "Rank", direction: "ascending" }],
  });

  return response.results.map((page) => {
    const props = (page as { properties: Record<string, NotionPropertyValue> }).properties;
    return {
      id: page.id,
      customerId: getRelationIds(props["Customer"])[0],
      propertyId: getRelationIds(props["Property"])[0],
      score: {
        overall: getNumberValue(props["Overall Score"]),
        affordability: getNumberValue(props["Affordability Score"]),
        bedrooms: getNumberValue(props["Bedrooms Score"]),
        community: getNumberValue(props["Community Score"]),
        amenities: getNumberValue(props["Amenities Score"]),
        marketFit: getNumberValue(props["Market Fit Score"]),
      },
      explanation: {
        summary: getTextValue(props["Summary"]),
        affordabilityNote: "",
        communityNote: "",
        amenitiesNote: "",
        marketNote: "",
      },
      status: getSelectValue(props["Status"]) as MatchStatus,
      rank: getNumberValue(props["Rank"]),
      customerFeedback: getTextValue(props["Customer Feedback"]),
      agentNotes: getTextValue(props["Agent Notes"]),
      createdAt: getCreatedTime(props["Created"]),
      updatedAt: getLastEditedTime(props["Updated"]),
    };
  });
}

export async function updateMatchStatus(
  id: string,
  status: MatchStatus,
  feedback?: string
): Promise<void> {
  const properties: Record<string, unknown> = {
    Status: { select: { name: status } },
  };

  if (feedback) {
    properties["Customer Feedback"] = {
      rich_text: [{ text: { content: feedback } }],
    };
  }

  await notion.pages.update({ page_id: id, properties });
}

// ===========================================
// Agent Functions
// ===========================================
export async function getAgents(): Promise<Agent[]> {
  const response = await notion.databases.query({
    database_id: DATABASE_IDS.agents,
    filter: {
      property: "Status",
      select: { equals: "active" },
    },
  });

  return response.results.map((page) => {
    const props = (page as { properties: Record<string, NotionPropertyValue> }).properties;
    return {
      id: page.id,
      name: getTextValue(props["Name"]),
      email: getEmailValue(props["Email"]),
      phone: getPhoneValue(props["Phone"]),
      whatsapp: getPhoneValue(props["WhatsApp"]),
      photo: getFilesValue(props["Photo"])[0],
      bio: getTextValue(props["Bio"]),
      specializations: getMultiSelectValues(props["Specializations"]),
      languages: getMultiSelectValues(props["Languages"]),
      status: getSelectValue(props["Status"]) as "active" | "inactive" | "on_leave",
      totalDeals: getNumberValue(props["Total Deals"]),
      totalVolume: getNumberValue(props["Total Volume"]),
      activeListings: getNumberValue(props["Active Listings"]),
      averageRating: getNumberValue(props["Average Rating"]),
      reviewCount: getNumberValue(props["Review Count"]),
      joinedAt: getDateValue(props["Joined At"]),
    };
  });
}

// ===========================================
// Analytics Functions
// ===========================================
export async function getAnalytics(period: "daily" | "weekly" | "monthly" = "daily"): Promise<Analytics[]> {
  const response = await notion.databases.query({
    database_id: DATABASE_IDS.analytics,
    filter: {
      property: "Period",
      select: { equals: period },
    },
    sorts: [{ property: "Date", direction: "descending" }],
    page_size: 30,
  });

  return response.results.map((page) => {
    const props = (page as { properties: Record<string, NotionPropertyValue> }).properties;
    return {
      id: page.id,
      period: getSelectValue(props["Period"]) as "daily" | "weekly" | "monthly",
      date: getDateValue(props["Date"]),
      totalLeads: getNumberValue(props["Total Leads"]),
      qualifiedLeads: getNumberValue(props["Qualified Leads"]),
      totalMatches: getNumberValue(props["Total Matches"]),
      conversionRate: getNumberValue(props["Conversion Rate"]),
      avgMatchScore: getNumberValue(props["Avg Match Score"]),
      topCommunities: getMultiSelectValues(props["Top Communities"]),
      metrics: {
        date: getDateValue(props["Date"]),
        newLeads: getNumberValue(props["New Leads"]),
        matchesGenerated: getNumberValue(props["Matches Generated"]),
        propertiesViewed: getNumberValue(props["Properties Viewed"]),
        inquiriesSent: getNumberValue(props["Inquiries Sent"]),
        touringsScheduled: getNumberValue(props["Tourings Scheduled"]),
        dealsClosed: getNumberValue(props["Deals Closed"]),
      },
      communityMetrics: [],
    };
  });
}

// ===========================================
// Export Client for Direct Access
// ===========================================
export { notion, DATABASE_IDS };
