#!/usr/bin/env node
/**
 * ============================================================
 * DUBAIVILLE - NOTION DATABASE SETUP SCRIPT
 * ============================================================
 *
 * This script creates all required Notion databases for DubaiVille.
 * Similar to SQL migrations, but for Notion.
 *
 * USAGE:
 *   1. Create a new page in Notion where databases will be created
 *   2. Copy the page ID from the URL (the 32-character string after the page name)
 *   3. Get your Notion Integration Token from https://www.notion.so/my-integrations
 *   4. Share the parent page with your integration
 *   5. Run: NOTION_API_KEY=your_token NOTION_PARENT_PAGE=page_id npx ts-node scripts/setup-notion-db.ts
 *
 * DATABASES CREATED:
 *   - Customers (leads & clients)
 *   - Properties (villa listings)
 *   - Matches (AI-generated matches)
 *   - Agents (real estate agents)
 *   - Analytics (dashboard metrics)
 */

import { Client } from "@notionhq/client";

// ============================================================
// CONFIGURATION
// ============================================================

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const PARENT_PAGE_ID = process.env.NOTION_PARENT_PAGE;

if (!NOTION_API_KEY) {
  console.error("❌ Missing NOTION_API_KEY environment variable");
  console.log("\nUsage:");
  console.log("  NOTION_API_KEY=secret_xxx NOTION_PARENT_PAGE=page_id npx ts-node scripts/setup-notion-db.ts");
  process.exit(1);
}

if (!PARENT_PAGE_ID) {
  console.error("❌ Missing NOTION_PARENT_PAGE environment variable");
  console.log("\nTo get your page ID:");
  console.log("  1. Open the Notion page where you want to create databases");
  console.log("  2. Copy the URL, e.g., https://notion.so/My-Page-abc123def456...");
  console.log("  3. The page ID is the 32-character string (with or without dashes)");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });

// ============================================================
// DATABASE SCHEMAS
// ============================================================

interface DatabaseSchema {
  name: string;
  icon: string;
  description: string;
  properties: Record<string, any>;
}

const DATABASES: DatabaseSchema[] = [
  // --------------------------------------------------------
  // CUSTOMERS DATABASE
  // --------------------------------------------------------
  {
    name: "🏠 Customers",
    icon: "👤",
    description: "Leads and clients looking for properties in Dubai",
    properties: {
      // Title (required)
      "Name": {
        title: {},
      },
      // Contact Info
      "Email": {
        email: {},
      },
      "Phone": {
        phone_number: {},
      },
      "WhatsApp": {
        phone_number: {},
      },
      // Customer Type
      "Customer Type": {
        select: {
          options: [
            { name: "buyer", color: "green" },
            { name: "renter", color: "blue" },
            { name: "investor", color: "purple" },
          ],
        },
      },
      // Financials
      "Monthly Income": {
        number: {
          format: "number",
        },
      },
      "Budget Min": {
        number: {
          format: "number",
        },
      },
      "Budget Max": {
        number: {
          format: "number",
        },
      },
      // Preferences
      "Bedrooms Min": {
        number: {
          format: "number",
        },
      },
      "Bedrooms Max": {
        number: {
          format: "number",
        },
      },
      "Preferred Communities": {
        multi_select: {
          options: [
            { name: "Dubai Hills Estate", color: "green" },
            { name: "Arabian Ranches", color: "brown" },
            { name: "Palm Jumeirah", color: "blue" },
            { name: "Emirates Hills", color: "purple" },
            { name: "Jumeirah Golf Estates", color: "pink" },
            { name: "Tilal Al Ghaf", color: "orange" },
            { name: "Al Furjan", color: "yellow" },
            { name: "Mudon", color: "red" },
            { name: "Damac Hills", color: "gray" },
          ],
        },
      },
      "Must Have Amenities": {
        multi_select: {
          options: [
            { name: "Pool", color: "blue" },
            { name: "Garden", color: "green" },
            { name: "Gym", color: "red" },
            { name: "Parking", color: "gray" },
            { name: "Security", color: "purple" },
            { name: "Beach Access", color: "yellow" },
            { name: "Golf Course", color: "green" },
            { name: "Schools Nearby", color: "orange" },
          ],
        },
      },
      "Nice to Have Amenities": {
        multi_select: {
          options: [
            { name: "Smart Home", color: "blue" },
            { name: "Maid Room", color: "pink" },
            { name: "Private Pool", color: "blue" },
            { name: "Rooftop", color: "orange" },
            { name: "Home Office", color: "gray" },
          ],
        },
      },
      // Status
      "Status": {
        select: {
          options: [
            { name: "new", color: "blue" },
            { name: "contacted", color: "yellow" },
            { name: "qualified", color: "green" },
            { name: "matched", color: "purple" },
            { name: "touring", color: "orange" },
            { name: "negotiating", color: "pink" },
            { name: "closed", color: "green" },
            { name: "lost", color: "red" },
          ],
        },
      },
      // Notes
      "Notes": {
        rich_text: {},
      },
      // Timestamps (auto)
      "Created": {
        created_time: {},
      },
      "Updated": {
        last_edited_time: {},
      },
    },
  },

  // --------------------------------------------------------
  // PROPERTIES DATABASE
  // --------------------------------------------------------
  {
    name: "🏡 Properties",
    icon: "🏠",
    description: "Villa listings in Dubai communities",
    properties: {
      "Title": {
        title: {},
      },
      "Community": {
        select: {
          options: [
            { name: "Dubai Hills Estate", color: "green" },
            { name: "Arabian Ranches", color: "brown" },
            { name: "Palm Jumeirah", color: "blue" },
            { name: "Emirates Hills", color: "purple" },
            { name: "Jumeirah Golf Estates", color: "pink" },
            { name: "Tilal Al Ghaf", color: "orange" },
            { name: "Al Furjan", color: "yellow" },
            { name: "Mudon", color: "red" },
            { name: "Damac Hills", color: "gray" },
          ],
        },
      },
      "Sub-Community": {
        rich_text: {},
      },
      "Property Type": {
        select: {
          options: [
            { name: "villa", color: "green" },
            { name: "townhouse", color: "blue" },
            { name: "mansion", color: "purple" },
            { name: "penthouse", color: "pink" },
          ],
        },
      },
      "Listing Type": {
        select: {
          options: [
            { name: "sale", color: "green" },
            { name: "rent", color: "blue" },
          ],
        },
      },
      "Price": {
        number: {
          format: "number",
        },
      },
      "Price per Sqft": {
        number: {
          format: "number",
        },
      },
      "Bedrooms": {
        number: {
          format: "number",
        },
      },
      "Bathrooms": {
        number: {
          format: "number",
        },
      },
      "Size Sqft": {
        number: {
          format: "number",
        },
      },
      "Plot Size Sqft": {
        number: {
          format: "number",
        },
      },
      "Year Built": {
        number: {
          format: "number",
        },
      },
      "Amenities": {
        multi_select: {
          options: [
            { name: "Pool", color: "blue" },
            { name: "Private Pool", color: "blue" },
            { name: "Garden", color: "green" },
            { name: "Gym", color: "red" },
            { name: "Parking", color: "gray" },
            { name: "Security", color: "purple" },
            { name: "Beach Access", color: "yellow" },
            { name: "Golf View", color: "green" },
            { name: "Smart Home", color: "blue" },
            { name: "Maid Room", color: "pink" },
            { name: "Driver Room", color: "gray" },
            { name: "Rooftop", color: "orange" },
          ],
        },
      },
      "Description": {
        rich_text: {},
      },
      "Images": {
        files: {},
      },
      "Floor Plan": {
        url: {},
      },
      "Virtual Tour": {
        url: {},
      },
      "Status": {
        select: {
          options: [
            { name: "available", color: "green" },
            { name: "under_offer", color: "yellow" },
            { name: "sold", color: "red" },
            { name: "rented", color: "blue" },
            { name: "off_market", color: "gray" },
          ],
        },
      },
      "Days on Market": {
        number: {
          format: "number",
        },
      },
      "Views": {
        number: {
          format: "number",
        },
      },
      "Inquiries": {
        number: {
          format: "number",
        },
      },
      "Address": {
        rich_text: {},
      },
      "Latitude": {
        number: {
          format: "number",
        },
      },
      "Longitude": {
        number: {
          format: "number",
        },
      },
      "Created": {
        created_time: {},
      },
      "Updated": {
        last_edited_time: {},
      },
    },
  },

  // --------------------------------------------------------
  // MATCHES DATABASE
  // --------------------------------------------------------
  {
    name: "🎯 Matches",
    icon: "🎯",
    description: "AI-generated property matches for customers",
    properties: {
      "Match ID": {
        title: {},
      },
      "Overall Score": {
        number: {
          format: "number",
        },
      },
      "Affordability Score": {
        number: {
          format: "number",
        },
      },
      "Bedrooms Score": {
        number: {
          format: "number",
        },
      },
      "Community Score": {
        number: {
          format: "number",
        },
      },
      "Amenities Score": {
        number: {
          format: "number",
        },
      },
      "Market Fit Score": {
        number: {
          format: "number",
        },
      },
      "Summary": {
        rich_text: {},
      },
      "Rank": {
        number: {
          format: "number",
        },
      },
      "Status": {
        select: {
          options: [
            { name: "pending", color: "gray" },
            { name: "viewed", color: "blue" },
            { name: "interested", color: "green" },
            { name: "touring", color: "yellow" },
            { name: "rejected", color: "red" },
            { name: "accepted", color: "green" },
          ],
        },
      },
      "Customer Feedback": {
        rich_text: {},
      },
      "Agent Notes": {
        rich_text: {},
      },
      "Created": {
        created_time: {},
      },
      "Updated": {
        last_edited_time: {},
      },
    },
  },

  // --------------------------------------------------------
  // AGENTS DATABASE
  // --------------------------------------------------------
  {
    name: "👔 Agents",
    icon: "👔",
    description: "Real estate agents and their performance",
    properties: {
      "Name": {
        title: {},
      },
      "Email": {
        email: {},
      },
      "Phone": {
        phone_number: {},
      },
      "WhatsApp": {
        phone_number: {},
      },
      "Photo": {
        files: {},
      },
      "Bio": {
        rich_text: {},
      },
      "Specializations": {
        multi_select: {
          options: [
            { name: "Luxury Villas", color: "purple" },
            { name: "Off-Plan", color: "blue" },
            { name: "Rentals", color: "green" },
            { name: "Investment", color: "yellow" },
            { name: "Palm Jumeirah", color: "pink" },
            { name: "Emirates Hills", color: "orange" },
            { name: "Dubai Hills", color: "green" },
          ],
        },
      },
      "Languages": {
        multi_select: {
          options: [
            { name: "English", color: "blue" },
            { name: "Arabic", color: "green" },
            { name: "Russian", color: "red" },
            { name: "Chinese", color: "yellow" },
            { name: "French", color: "purple" },
            { name: "Hindi", color: "orange" },
          ],
        },
      },
      "Status": {
        select: {
          options: [
            { name: "active", color: "green" },
            { name: "inactive", color: "gray" },
            { name: "on_leave", color: "yellow" },
          ],
        },
      },
      "Total Deals": {
        number: {
          format: "number",
        },
      },
      "Total Volume": {
        number: {
          format: "number",
        },
      },
      "Active Listings": {
        number: {
          format: "number",
        },
      },
      "Average Rating": {
        number: {
          format: "number",
        },
      },
      "Review Count": {
        number: {
          format: "number",
        },
      },
      "Joined At": {
        date: {},
      },
      "Created": {
        created_time: {},
      },
      "Updated": {
        last_edited_time: {},
      },
    },
  },

  // --------------------------------------------------------
  // ANALYTICS DATABASE
  // --------------------------------------------------------
  {
    name: "📊 Analytics",
    icon: "📊",
    description: "Dashboard metrics and KPIs",
    properties: {
      "Report Name": {
        title: {},
      },
      "Period": {
        select: {
          options: [
            { name: "daily", color: "blue" },
            { name: "weekly", color: "green" },
            { name: "monthly", color: "purple" },
          ],
        },
      },
      "Date": {
        date: {},
      },
      "Total Leads": {
        number: {
          format: "number",
        },
      },
      "New Leads": {
        number: {
          format: "number",
        },
      },
      "Qualified Leads": {
        number: {
          format: "number",
        },
      },
      "Total Matches": {
        number: {
          format: "number",
        },
      },
      "Matches Generated": {
        number: {
          format: "number",
        },
      },
      "Conversion Rate": {
        number: {
          format: "percent",
        },
      },
      "Avg Match Score": {
        number: {
          format: "number",
        },
      },
      "Properties Viewed": {
        number: {
          format: "number",
        },
      },
      "Inquiries Sent": {
        number: {
          format: "number",
        },
      },
      "Tourings Scheduled": {
        number: {
          format: "number",
        },
      },
      "Deals Closed": {
        number: {
          format: "number",
        },
      },
      "Top Communities": {
        multi_select: {
          options: [
            { name: "Dubai Hills Estate", color: "green" },
            { name: "Arabian Ranches", color: "brown" },
            { name: "Palm Jumeirah", color: "blue" },
            { name: "Emirates Hills", color: "purple" },
            { name: "Jumeirah Golf Estates", color: "pink" },
          ],
        },
      },
      "Created": {
        created_time: {},
      },
      "Updated": {
        last_edited_time: {},
      },
    },
  },
];

// ============================================================
// SAMPLE DATA (Optional)
// ============================================================

const SAMPLE_CUSTOMERS = [
  {
    "Name": { title: [{ text: { content: "Ahmed Al-Rashid" } }] },
    "Email": { email: "ahmed@example.com" },
    "Phone": { phone_number: "+971501234567" },
    "Customer Type": { select: { name: "buyer" } },
    "Monthly Income": { number: 85000 },
    "Budget Min": { number: 3000000 },
    "Budget Max": { number: 5000000 },
    "Bedrooms Min": { number: 4 },
    "Bedrooms Max": { number: 5 },
    "Preferred Communities": { multi_select: [{ name: "Dubai Hills Estate" }, { name: "Arabian Ranches" }] },
    "Must Have Amenities": { multi_select: [{ name: "Pool" }, { name: "Garden" }] },
    "Status": { select: { name: "qualified" } },
  },
  {
    "Name": { title: [{ text: { content: "Sarah Johnson" } }] },
    "Email": { email: "sarah.j@example.com" },
    "Phone": { phone_number: "+971507654321" },
    "Customer Type": { select: { name: "renter" } },
    "Monthly Income": { number: 45000 },
    "Budget Min": { number: 15000 },
    "Budget Max": { number: 25000 },
    "Bedrooms Min": { number: 3 },
    "Bedrooms Max": { number: 4 },
    "Preferred Communities": { multi_select: [{ name: "Jumeirah Golf Estates" }] },
    "Must Have Amenities": { multi_select: [{ name: "Schools Nearby" }, { name: "Security" }] },
    "Status": { select: { name: "new" } },
  },
];

const SAMPLE_PROPERTIES = [
  {
    "Title": { title: [{ text: { content: "Modern Villa in Dubai Hills" } }] },
    "Community": { select: { name: "Dubai Hills Estate" } },
    "Property Type": { select: { name: "villa" } },
    "Listing Type": { select: { name: "sale" } },
    "Price": { number: 4200000 },
    "Price per Sqft": { number: 1200 },
    "Bedrooms": { number: 4 },
    "Bathrooms": { number: 5 },
    "Size Sqft": { number: 3500 },
    "Plot Size Sqft": { number: 5000 },
    "Year Built": { number: 2022 },
    "Amenities": { multi_select: [{ name: "Pool" }, { name: "Garden" }, { name: "Smart Home" }] },
    "Status": { select: { name: "available" } },
    "Days on Market": { number: 14 },
  },
  {
    "Title": { title: [{ text: { content: "Luxury Palm Villa with Beach Access" } }] },
    "Community": { select: { name: "Palm Jumeirah" } },
    "Property Type": { select: { name: "villa" } },
    "Listing Type": { select: { name: "sale" } },
    "Price": { number: 12500000 },
    "Price per Sqft": { number: 2800 },
    "Bedrooms": { number: 5 },
    "Bathrooms": { number: 6 },
    "Size Sqft": { number: 4500 },
    "Plot Size Sqft": { number: 8000 },
    "Year Built": { number: 2020 },
    "Amenities": { multi_select: [{ name: "Private Pool" }, { name: "Beach Access" }, { name: "Smart Home" }] },
    "Status": { select: { name: "available" } },
    "Days on Market": { number: 7 },
  },
  {
    "Title": { title: [{ text: { content: "Golf Course Villa - Arabian Ranches" } }] },
    "Community": { select: { name: "Arabian Ranches" } },
    "Property Type": { select: { name: "villa" } },
    "Listing Type": { select: { name: "rent" } },
    "Price": { number: 22000 },
    "Price per Sqft": { number: 0 },
    "Bedrooms": { number: 4 },
    "Bathrooms": { number: 4 },
    "Size Sqft": { number: 3200 },
    "Plot Size Sqft": { number: 6000 },
    "Year Built": { number: 2019 },
    "Amenities": { multi_select: [{ name: "Golf View" }, { name: "Garden" }, { name: "Maid Room" }] },
    "Status": { select: { name: "available" } },
    "Days on Market": { number: 3 },
  },
];

const SAMPLE_AGENTS = [
  {
    "Name": { title: [{ text: { content: "Mohammed Al-Fahim" } }] },
    "Email": { email: "mohammed@dubaiville.ae" },
    "Phone": { phone_number: "+971509999888" },
    "Bio": { rich_text: [{ text: { content: "10+ years experience in Dubai luxury real estate. Specialized in Palm Jumeirah and Emirates Hills." } }] },
    "Specializations": { multi_select: [{ name: "Luxury Villas" }, { name: "Palm Jumeirah" }] },
    "Languages": { multi_select: [{ name: "English" }, { name: "Arabic" }] },
    "Status": { select: { name: "active" } },
    "Total Deals": { number: 87 },
    "Total Volume": { number: 450000000 },
    "Active Listings": { number: 12 },
    "Average Rating": { number: 4.9 },
    "Review Count": { number: 156 },
  },
];

// ============================================================
// MAIN SCRIPT
// ============================================================

async function createDatabase(schema: DatabaseSchema, parentPageId: string): Promise<string> {
  console.log(`\n📦 Creating database: ${schema.name}`);

  const response = await notion.databases.create({
    parent: { page_id: parentPageId },
    icon: { emoji: schema.icon as any },
    title: [{ type: "text", text: { content: schema.name } }],
    description: [{ type: "text", text: { content: schema.description } }],
    properties: schema.properties,
  });

  console.log(`   ✅ Created: ${response.id}`);
  return response.id;
}

async function addRelations(databaseIds: Record<string, string>) {
  console.log("\n🔗 Adding relations between databases...");

  // Add Customer relation to Matches
  await notion.databases.update({
    database_id: databaseIds.matches,
    properties: {
      "Customer": {
        relation: {
          database_id: databaseIds.customers,
          single_property: {},
        },
      },
      "Property": {
        relation: {
          database_id: databaseIds.properties,
          single_property: {},
        },
      },
    },
  });
  console.log("   ✅ Matches -> Customers, Properties");

  // Add Agent relation to Customers
  await notion.databases.update({
    database_id: databaseIds.customers,
    properties: {
      "Assigned Agent": {
        relation: {
          database_id: databaseIds.agents,
          single_property: {},
        },
      },
    },
  });
  console.log("   ✅ Customers -> Agents");

  // Add Agent relation to Properties
  await notion.databases.update({
    database_id: databaseIds.properties,
    properties: {
      "Agent": {
        relation: {
          database_id: databaseIds.agents,
          single_property: {},
        },
      },
    },
  });
  console.log("   ✅ Properties -> Agents");
}

async function seedSampleData(databaseIds: Record<string, string>) {
  console.log("\n🌱 Seeding sample data...");

  // Seed Customers
  for (const customer of SAMPLE_CUSTOMERS) {
    await notion.pages.create({
      parent: { database_id: databaseIds.customers },
      properties: customer,
    });
  }
  console.log(`   ✅ Added ${SAMPLE_CUSTOMERS.length} sample customers`);

  // Seed Properties
  for (const property of SAMPLE_PROPERTIES) {
    await notion.pages.create({
      parent: { database_id: databaseIds.properties },
      properties: property,
    });
  }
  console.log(`   ✅ Added ${SAMPLE_PROPERTIES.length} sample properties`);

  // Seed Agents
  for (const agent of SAMPLE_AGENTS) {
    await notion.pages.create({
      parent: { database_id: databaseIds.agents },
      properties: agent,
    });
  }
  console.log(`   ✅ Added ${SAMPLE_AGENTS.length} sample agents`);
}

async function main() {
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║     DUBAIVILLE - NOTION DATABASE SETUP                 ║");
  console.log("╚════════════════════════════════════════════════════════╝");
  console.log(`\nParent Page ID: ${PARENT_PAGE_ID}`);

  const databaseIds: Record<string, string> = {};

  try {
    // Create all databases
    for (const schema of DATABASES) {
      const dbName = schema.name.replace(/[^\w]/g, "").toLowerCase();
      databaseIds[dbName] = await createDatabase(schema, PARENT_PAGE_ID!);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Normalize database IDs
    const normalizedIds = {
      customers: databaseIds["customers"],
      properties: databaseIds["properties"],
      matches: databaseIds["matches"],
      agents: databaseIds["agents"],
      analytics: databaseIds["analytics"],
    };

    // Add relations
    await addRelations(normalizedIds);

    // Ask about sample data
    const seedData = process.argv.includes("--seed");
    if (seedData) {
      await seedSampleData(normalizedIds);
    }

    // Output .env format
    console.log("\n" + "═".repeat(60));
    console.log("✅ SETUP COMPLETE!");
    console.log("═".repeat(60));
    console.log("\n📋 Add these to your .env.local file:\n");
    console.log(`NOTION_API_KEY=${NOTION_API_KEY}`);
    console.log(`NOTION_DATABASE_CUSTOMERS=${normalizedIds.customers}`);
    console.log(`NOTION_DATABASE_PROPERTIES=${normalizedIds.properties}`);
    console.log(`NOTION_DATABASE_MATCHES=${normalizedIds.matches}`);
    console.log(`NOTION_DATABASE_AGENTS=${normalizedIds.agents}`);
    console.log(`NOTION_DATABASE_ANALYTICS=${normalizedIds.analytics}`);
    console.log("\n" + "═".repeat(60));

    if (!seedData) {
      console.log("\n💡 TIP: Run with --seed flag to add sample data:");
      console.log("   npx ts-node scripts/setup-notion-db.ts --seed");
    }

  } catch (error: any) {
    console.error("\n❌ Error:", error.message);
    if (error.code === "object_not_found") {
      console.log("\n🔍 Make sure you've shared the parent page with your Notion integration!");
    }
    process.exit(1);
  }
}

main();
