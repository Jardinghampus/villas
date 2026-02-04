# DubaiVille - Notion Database Setup Guide

## 🗄️ Complete Database Configuration

This guide shows exactly how to set up your Notion backend for DubaiVille.

---

## 1. CUSTOMERS Database

**Database Name:** Customers  
**Icon:** 👤  
**Use Case:** Store all buyers, renters, investors

### Fields:

| Field Name | Type | Description |
|-----------|------|-------------|
| ID | Title | Unique customer identifier |
| Name | Text | Full name |
| Email | Email | Email address |
| Phone | Phone Number | WhatsApp number |
| Status | Select | Lead, Active, Converted, Inactive |
| Looking For | Select | Buy, Rent, Invest |
| Monthly Income | Number | In AED |
| Max Monthly Budget | Number | For rentals (AED) |
| Down Payment Budget | Number | For purchases (AED) |
| Bedrooms Needed | Number | Preferred bedrooms |
| Communities | Multi-select | Al Furjan, Tilal Al Ghaf, JGE, Arabian Ranches, Mudon, Damac Hills |
| School Priority | Checkbox | Must be near schools |
| Golf Proximity | Checkbox | Must be near golf course |
| Large Garden | Checkbox | Wants large private garden |
| Matched Properties | Relation | Link to Properties database |
| Affordability Score | Number | 0-100 |
| Last Activity | Date | When they last viewed property |
| Notes | Text | Agent notes |

### Relations:
- ✅ Properties (many-to-many)
- ✅ Matches (one-to-many)

---

## 2. PROPERTIES Database

**Database Name:** Properties  
**Icon:** 🏠  
**Use Case:** All listings (villas, townhouses)

### Fields:

| Field Name | Type | Description |
|-----------|------|-------------|
| Title | Title | Property name e.g., "4BR Villa in Al Furjan" |
| Community | Select | Al Furjan, Tilal Al Ghaf, JGE, Arabian Ranches, Mudon, Damac Hills |
| Type | Select | Villa, Townhouse, Apartment |
| Status | Select | Available, Sold, Rented, Pending |
| Bedrooms | Number | Number of bedrooms |
| Bathrooms | Number | Number of bathrooms |
| Sqft | Number | Total built-up area |
| Price | Number | Sale price (AED) |
| Rent | Number | Monthly rent (AED) |
| Service Charges | Number | Annual service charges (AED) |
| Down Payment Required | Number | % of price |
| Furnished | Select | Unfurnished, Fully Furnished, Semi-Furnished |
| Images | Files | Upload multiple property images |
| Video Link | URL | YouTube or virtual tour |
| Schools Nearby | Multi-select | List nearby schools |
| Amenities | Multi-select | Pool, Gym, Security, Garden, Balcony, etc. |
| View Count | Number | Total profile views |
| Inquiry Count | Number | Total inquiries |
| Days on Market | Number | How long listed |
| List Date | Date | When first listed |
| Sale/Rent Date | Date | When sold/rented |
| Agent | Relation | Link to Agents database |
| Featured | Checkbox | Show on homepage |
| Premium | Checkbox | Premium listing (paid) |

### Relations:
- ✅ Agent (many-to-one)
- ✅ Customers (many-to-many through Matches)

---

## 3. MATCHES Database

**Database Name:** Matches  
**Icon:** ✨  
**Use Case:** Track AI matches between customers and properties

### Fields:

| Field Name | Type | Description |
|-----------|------|-------------|
| Match ID | Title | Auto-generated |
| Customer | Relation | Customer who received match |
| Property | Relation | Property matched to |
| Match Score | Number | 0-100 (AI calculated) |
| Affordability Score | Number | 0-100 (DTI based) |
| Recommendation Text | Text | Why this match was recommended |
| Created Date | Date | When match generated |
| Status | Select | New, Viewed, Inquired, Converted, Rejected |
| View Count | Number | Times customer viewed this match |
| Last Viewed | Date | Last time viewed |
| Inquiry Sent | Checkbox | Customer inquired |
| Agent | Relation | Link to Agents database |
| Feedback | Select | Love It, Good, Pass, Not For Me |

---

## 4. AGENTS Database

**Database Name:** Agents  
**Icon:** 👨‍💼  
**Use Case:** Agent profiles & performance tracking

### Fields:

| Field Name | Type | Description |
|-----------|------|-------------|
| Name | Title | Agent full name |
| Email | Email | Agent email |
| Phone | Phone Number | Agent WhatsApp |
| Profile Image | Files | Agent photo |
| Status | Select | Active, Inactive, New |
| Communities Covered | Multi-select | Which areas they specialize in |
| Specialization | Multi-select | Villas, Townhouses, Rentals, Sales, Investment |
| Total Clients | Number | Number of active clients |
| Properties Listed | Number | Total active listings |
| Conversions YTD | Number | Successful deals this year |
| Conversion Rate | Number | % of leads converted |
| Avg Days to Sale | Number | Average days-to-sale |
| Avg Days to Rent | Number | Average days-to-rent |
| Total Revenue Generated | Number | Est. revenue (AED) |
| Customer Reviews | Rollup | Aggregate rating |
| Last Activity | Date | Last action in system |
| Bio | Text | Agent bio |
| Languages | Multi-select | Languages spoken |

### Relations:
- ✅ Properties (one-to-many)
- ✅ Customers (one-to-many)
- ✅ Matches (one-to-many)

---

## 5. LEADS_ANALYTICS Database

**Database Name:** Leads Analytics  
**Icon:** 📊  
**Use Case:** Aggregate metrics for dashboard

### Fields:

| Field Name | Type | Description |
|-----------|------|-------------|
| Date | Date | Daily aggregation |
| New Leads | Number | Leads created |
| Matches Generated | Number | Total matches created |
| Inquiries | Number | Total inquiries |
| Conversions | Number | Closed deals |
| Avg Match Score | Number | Average match quality |
| Avg Days to Sale | Number | Market metric |
| Top Community | Text | Best performing area |

---

## 🔧 Setup Instructions

### Step 1: Create Databases in Notion

1. Go to your Notion workspace
2. Click "+ Add a page"
3. Create 5 new databases:
   - Customers
   - Properties
   - Matches
   - Agents
   - Leads Analytics

### Step 2: Add Fields

For each database, click "+ Add a property" and add the fields shown above.

### Step 3: Create Relations

1. In **Customers** → Add "Matched Properties" field → Link to Properties
2. In **Properties** → Add "Agent" field → Link to Agents
3. In **Matches** → Add "Customer" (→ Customers), "Property" (→ Properties), "Agent" (→ Agents)

### Step 4: Get API Key

1. Go to https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Name it "DubaiVille"
4. Copy the "Internal Integration Token"
5. Add to `.env.local`:
   ```
   NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
   ```

### Step 5: Add Connections

1. For each database, click "..." → "Connections"
2. Search for "DubaiVille"
3. Click "Connect"

### Step 6: Get Database IDs

1. For each database, open it
2. Copy the URL: `https://notion.so/workspace/DATABASE_ID?v=xxx`
3. The ID is the first part: `DATABASE_ID`
4. Add to `.env.local`:
   ```
   NOTION_CUSTOMERS_DB=abc123...
   NOTION_PROPERTIES_DB=def456...
   NOTION_MATCHES_DB=ghi789...
   NOTION_AGENTS_DB=jkl012...
   NOTION_ANALYTICS_DB=mno345...
   ```

---

## 🎯 Database Views to Create

### Customers Database Views:

1. **Active Leads**
   - Filter: Status = "Active"
   - Sort: Last Activity (Newest first)

2. **Hot Prospects** (High affordability + match score)
   - Filter: Status = "Active" & Affordability Score > 80
   - Sort: Affordability Score (Highest first)

3. **By Community**
   - Group by: Communities
   - Filter: Status = "Active"

### Properties Database Views:

1. **Available for Sale**
   - Filter: Status = "Available" & Type = "Villa"
   - Sort: List Date (Newest first)

2. **Available for Rent**
   - Filter: Status = "Available" & Rent != Empty
   - Sort: Rent (Lowest first)

3. **By Community**
   - Group by: Community
   - Sort: Price (Lowest first)

4. **Hot Properties** (High views, fresh)
   - Filter: Days on Market < 14
   - Sort: View Count (Highest first)

### Matches Database Views:

1. **New Matches**
   - Filter: Status = "New"
   - Sort: Created Date (Newest first)

2. **Converted Matches**
   - Filter: Status = "Converted"
   - Group by: Agent

3. **Lead Funnel**
   - Group by: Status
   - Shows New → Viewed → Inquired → Converted flow

---

## 📋 Sample Data to Add

### Add 3-5 test properties:

```
Property 1:
- Title: Stunning 4BR Villa with Golf View
- Community: Jumeirah Golf Estates
- Type: Villa
- Status: Available
- Bedrooms: 4
- Bathrooms: 5
- Sqft: 4,800
- Price: 4,200,000 AED
- View Count: 145
- Days on Market: 8
- Agent: [Your name]

Property 2:
- Title: Luxe 3BR Townhouse Al Furjan
- Community: Al Furjan
- Type: Townhouse
- Status: Available
- Bedrooms: 3
- Bathrooms: 3.5
- Sqft: 2,200
- Rent: 12,000 AED/month
- View Count: 87
- Days on Market: 22
- Agent: [Your name]
```

### Add test customer:

```
Customer 1:
- Name: Ahmed Al Mansoori
- Email: ahmed@example.com
- Phone: +971501234567
- Status: Active
- Looking For: Buy
- Monthly Income: 50,000 AED
- Down Payment Budget: 500,000 AED
- Bedrooms Needed: 4
- Communities: [Al Furjan, JGE]
- School Priority: ✓
- Golf Proximity: ✓
```

---

## 🔌 API Integration (TypeScript)

### Basic Notion Client Setup

```typescript
// lib/notion.ts
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getCustomers() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_CUSTOMERS_DB!,
    filter: {
      property: 'Status',
      select: {
        equals: 'Active',
      },
    },
  });
  return response.results;
}

export async function getProperties(community?: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_PROPERTIES_DB!,
    filter: community ? {
      property: 'Community',
      select: {
        equals: community,
      },
    } : undefined,
  });
  return response.results;
}

export async function createMatch(customerId: string, propertyId: string, score: number) {
  const response = await notion.pages.create({
    parent: { database_id: process.env.NOTION_MATCHES_DB! },
    properties: {
      'Customer': {
        relation: [{ id: customerId }],
      },
      'Property': {
        relation: [{ id: propertyId }],
      },
      'Match Score': {
        number: score,
      },
      'Created Date': {
        date: {
          start: new Date().toISOString().split('T')[0],
        },
      },
      'Status': {
        select: {
          name: 'New',
        },
      },
    },
  });
  return response;
}
```

---

## ✅ Checklist

- [ ] Create all 5 databases
- [ ] Add all fields to each database
- [ ] Create relations between databases
- [ ] Create API integration in Notion
- [ ] Add API key to .env.local
- [ ] Add all database IDs to .env.local
- [ ] Create views for each database
- [ ] Add 3-5 test properties
- [ ] Add 2-3 test customers
- [ ] Test API connection
- [ ] Create sample matches

---

## 🚀 Next: API Routes

Once Notion is set up, you'll build these API routes:
- `/api/notion/customers` - GET/POST customers
- `/api/notion/properties` - GET properties, filter by community
- `/api/match` - POST to generate matches
- `/api/admin/leads` - GET agent's leads
- `/api/admin/analytics` - GET dashboard metrics

