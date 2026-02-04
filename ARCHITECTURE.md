# DubaiVille - Architecture & Data Flow Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Frontend)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Landing Page          Profile Builder        Match Results         │
│  (components_landing)  (components_profile)   (Auto-generated)       │
│  ├─ Hero section       ├─ Step 1: Type        ├─ Top 20 properties  │
│  ├─ Features           ├─ Step 2: Income      ├─ Match scores       │
│  ├─ Communities        ├─ Step 3: Budget      ├─ Recommendations    │
│  ├─ CTA Form           ├─ Step 4: Bedrooms    └─ Agent contact      │
│  └─ Trust signals      ├─ Step 5: Prefs       
│                        └─ Affordability calc   Admin Dashboard
│  React 18 + TypeScript                        (components_admin)
│  Tailwind CSS + ShadCN/UI                     ├─ KPI cards
│  Vercel hosting (Auto-deploy from GitHub)    ├─ Leads table
│                                                ├─ Properties grid
└─────────────────────────────────────────────────────────────────────┘
                               ↓↑ (API calls)
┌─────────────────────────────────────────────────────────────────────┐
│                        API LAYER (Backend)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Next.js 14 Serverless API Routes                                   │
│  ├─ POST /api/match                                                 │
│  │  └─ Calls lib/match_engine.ts (AI logic)                        │
│  │     ├─ Affordability calculation                                 │
│  │     ├─ Property scoring (5-factor)                              │
│  │     ├─ Ranking algorithm                                         │
│  │     └─ Generates top 20 matches                                 │
│  │                                                                  │
│  ├─ GET /api/admin/leads (filtered by agent)                       │
│  ├─ GET /api/admin/properties (agent listings)                     │
│  ├─ GET /api/admin/analytics (performance metrics)                 │
│  └─ POST /api/notion/customers (email capture)                     │
│                                                                      │
│  TypeScript • Validation • Error handling                           │
│  Rate limiting • Caching (5-min TTL)                               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                               ↓↑ (REST/JSON)
┌─────────────────────────────────────────────────────────────────────┐
│                    DATA LAYER (Backend)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  NOTION (Headless Database)                                        │
│  ├─ Customers Table       (1,000s of customers)                    │
│  ├─ Properties Table      (1,000+ listings)                        │
│  ├─ Matches Table         (Match history)                          │
│  ├─ Agents Table          (Agent profiles)                         │
│  └─ Leads Analytics Table (Dashboard metrics)                      │
│                                                                      │
│  Relations:                                                         │
│  ├─ Customer → Matched Properties (many-to-many via Matches)      │
│  ├─ Agent → Properties (one-to-many)                              │
│  └─ Agent → Customers (one-to-many)                               │
│                                                                      │
│  Accessed via: @notionhq/client SDK                                │
│  Auth: NOTION_API_KEY (Notion integration token)                   │
│  Caching: 5 min for properties, 30 min for analytics              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
         ↓↑ (Git push)              ↓↑ (Image uploads)
  ┌──────────────────┐          ┌──────────────────┐
  │  GitHub Repo     │          │  Vercel Blob     │
  │                  │          │  (Image storage) │
  │  Auto-triggers   │          │                  │
  │  Vercel deploy   │          │  Property photos │
  └──────────────────┘          │  Agent headshots │
                                └──────────────────┘
```

---

## 🔄 Complete User Flow

### Customer Journey

```
┌─────────────────────────────────────────────────────────────────┐
│  LANDING PAGE (components_landing.tsx)                          │
│  ├─ Hero: "Find your perfect villa in Dubai"                   │
│  ├─ Email input field                                          │
│  ├─ Features overview                                          │
│  ├─ Community showcase                                         │
│  └─ CTA: "Börja nu" (Start now)                                │
└─────────────────────────────────────────────────────────────────┘
                           ↓
      Email saved to Notion (Customers table)
      Status = "Lead"
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  PROFILE BUILDER (components_profile_builder.tsx)               │
│  Step 1: "Vad letar du efter?"                                  │
│  └─ Radio buttons: Köpa / Hyra / Investera                     │
│                                                                  │
│  Step 2: "Din ekonomi"                                          │
│  ├─ Monthly income input                                        │
│  ├─ Budget input (rent or down payment)                         │
│  └─ → Affordability calculated                                 │
│                                                                  │
│  Step 3: "Vilken storlek?"                                      │
│  └─ Bedrooms: 3 / 4 / 5+                                        │
│                                                                  │
│  Step 4: "Vilka områden?"                                       │
│  └─ Multi-select: Al Furjan, Tilal Al Ghaf, JGE, etc.         │
│                                                                  │
│  Step 5: "Vad är viktigt för dig?"                              │
│  └─ Checkboxes: Schools / Golf / Gardens                        │
│                                                                  │
│  Progress bar: 0% → 100%                                        │
└─────────────────────────────────────────────────────────────────┘
                           ↓
      Profile saved to Notion (Customers table updated)
      Status = "Active"
      Affordability score calculated
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  MATCH ENGINE API (api_match_route.ts + lib_match_engine.ts)   │
│                                                                  │
│  Input:                                                         │
│  ├─ Customer profile (bedrooms, communities, preferences)       │
│  ├─ Affordability result (max price/rent, DTI ratio)            │
│  └─ All available properties from Notion                        │
│                                                                  │
│  Processing:                                                    │
│  1. Filter: Properties matching bedroom/community criteria      │
│  2. Score: Each property on 5 dimensions (35% affordability)   │
│  3. Rank: Sort by match score (highest first)                  │
│  4. Return: Top 20 with explanations                            │
│  5. Save: All matches to Notion (Matches table)                 │
│                                                                  │
│  Algorithm detail:                                              │
│  ├─ Affordability Score (35%)                                  │
│  │  └─ 100 = fits budget, 30 = way over budget                │
│  ├─ Bedroom Score (15%)                                        │
│  │  └─ 100 = exact match, 75 = ±1BR, 50 = ±2BR               │
│  ├─ Community Score (20%)                                      │
│  │  └─ 100 = preferred, 75 = nearby, 40 = outside             │
│  ├─ Amenities Score (15%)                                      │
│  │  └─ +15 pts per matching amenity (schools, golf, etc.)     │
│  └─ Market Score (15%)                                         │
│     └─ Fresh listings score higher, stale listings lower       │
│                                                                  │
│  Output:                                                        │
│  ├─ Top 20 properties                                          │
│  ├─ Match score (0-100) for each                               │
│  ├─ Affordability assessment                                   │
│  └─ Personalized recommendation per property                   │
└─────────────────────────────────────────────────────────────────┘
                           ↓
      All matches saved to Notion
      Agent notified via WhatsApp (future)
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  MATCH RESULTS PAGE (Auto-generated frontend component)         │
│                                                                  │
│  For each property:                                             │
│  ├─ Title & location                                           │
│  ├─ Price/rent                                                  │
│  ├─ Match score visualization (progress bar)                   │
│  ├─ Affordability status (✅ Safe / ⚠️ Stretch / ❌ Over)      │
│  ├─ Why this match (AI explanation)                            │
│  ├─ Agent contact info                                         │
│  └─ "I'm interested" button                                    │
│                                                                  │
│  Lead Status updated in Notion:                                │
│  ├─ Clicked "I'm interested" → Status = "Inquired"            │
│  └─ Viewed property details → Track engagement                 │
└─────────────────────────────────────────────────────────────────┘
                           ↓
      Customer contacts agent (WhatsApp/call)
      Agent follows up via admin dashboard
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  CLOSED DEAL                                                     │
│  Notion status: "Converted"                                      │
│  Agent commission: Tracked in performance metrics               │
│  Lead added to agent's client base                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👨‍💼 Agent Admin Dashboard Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  AGENT LOGIN (Dashboard page)                                   │
│  Access: dashboard/page.tsx (with NextAuth)                     │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  DASHBOARD OVERVIEW (components_admin_dashboard.tsx)             │
│                                                                  │
│  Top KPI Cards:                                                 │
│  ├─ Active Leads: 47                                            │
│  │  └─ Filter: Status = "Active" (from Notion)                 │
│  ├─ My Listings: 12                                            │
│  │  └─ Filter: Status = "Available" & Agent = Me               │
│  ├─ Conversion Rate: 18%                                       │
│  │  └─ Calculated: Converted / Total Inquiries                 │
│  └─ Avg Days-to-Sale: 23d                                      │
│     └─ From Notion Properties table                             │
│                                                                  │
│  4 Tabs:                                                        │
│  ├─ Overview (KPIs + recent leads + quick actions)             │
│  ├─ My Leads (searchable/filterable table)                     │
│  ├─ My Properties (grid with performance metrics)              │
│  └─ Analytics (charts + top communities)                       │
└─────────────────────────────────────────────────────────────────┘
                           ↓
        GET /api/admin/leads (filtered by agent)
        GET /api/admin/properties (agent's listings)
        GET /api/admin/analytics (performance data)
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  MY LEADS TAB                                                    │
│                                                                  │
│  Searchable table showing:                                      │
│  ├─ Name                                                        │
│  ├─ Type (Buy/Rent/Invest)                                      │
│  ├─ Budget                                                      │
│  ├─ Communities interested                                      │
│  ├─ Match Score (0-100) with visual bar                        │
│  ├─ Status badge (Hot/Warm/Cold)                                │
│  │  └─ Hot = High match score + high engagement               │
│  └─ Action: View full profile                                  │
│                                                                  │
│  Sorting: By match score, last activity, budget                 │
│  Filtering: By status, community, income range                 │
└─────────────────────────────────────────────────────────────────┘
                           ↓
        Agent clicks "View" → See full customer profile
        Agent sends WhatsApp message (future integration)
        Agent schedules property viewing
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  MY PROPERTIES TAB                                               │
│                                                                  │
│  Grid view showing:                                             │
│  ├─ Property image (from Notion)                                │
│  ├─ Title & community                                           │
│  ├─ Price/rent                                                  │
│  ├─ 👁️ View count                                              │
│  ├─ ⏱️ Days on market                                           │
│  ├─ 🛏️ Bedrooms & sqft                                          │
│  ├─ Status badge (Available/Sold/Rented)                       │
│  └─ Action: Edit listing                                       │
│                                                                  │
│  Analytics overlay:                                             │
│  ├─ High views (>100) = 🔥 (Fresh property badge)             │
│  ├─ Long on market (>60d) = ⏰ (Price reduction hint)          │
│  └─ Recently updated = ⭐ (Promoted position)                   │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  ANALYTICS TAB                                                   │
│                                                                  │
│  KPI Performance (30-day rolling):                              │
│  ├─ Conversions over time (line chart)                          │
│  ├─ Days-to-sale trend                                         │
│  ├─ Lead quality score                                         │
│  └─ Comparison vs. other agents                                 │
│                                                                  │
│  Top Performing Communities:                                    │
│  └─ Table: Community | Listings | Sold/Rented | Avg Days      │
│                                                                  │
│  Market Intelligence:                                           │
│  ├─ Price trends (up/stable/down)                              │
│  ├─ Absorption rate (% sold per month)                         │
│  └─ Recommendations for listing strategy                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧠 AI Matching Algorithm Detail

### Affordability Calculation

```
BUYING:
  Step 1: Calculate max monthly payment
  Max Payment = (Monthly Income × 0.28) - Existing Debt
  Example: 50,000 AED × 0.28 = 14,000 AED/month (if no debt)

  Step 2: Convert to home price
  Home Price = Monthly Payment × Mortgage Factor
  Where Mortgage Factor = (1 + r)^n / [r × ((1 + r)^n - 1)]
  (30-year mortgage, 4% annual = 0.04/12 monthly)
  
  Example: 14,000 AED/month × ~190 = 2,660,000 AED max price

RENTING:
  Max Rent = Monthly Income × 0.30
  Example: 50,000 AED × 0.30 = 15,000 AED/month max
```

### Property Scoring Algorithm

```
For each property:

1. AFFORDABILITY SCORE (35% weight)
   ├─ If price ≤ budget: 100 points
   ├─ If price ≤ budget × 1.05: 85 points
   ├─ If price ≤ budget × 1.15: 60 points
   └─ If price > budget × 1.15: 30 points

2. BEDROOM SCORE (15% weight)
   ├─ If bedrooms == desired: 100 points
   ├─ If bedrooms ±1 from desired: 75 points
   ├─ If bedrooms ±2 from desired: 50 points
   └─ If bedrooms ±3+ from desired: 25 points

3. COMMUNITY SCORE (20% weight)
   ├─ If in preferred communities: 100 points
   ├─ If in same area (e.g., north): 75 points
   └─ Otherwise: 40 points

4. AMENITIES SCORE (15% weight)
   ├─ Baseline: 50 points
   ├─ If has schools + customer wants: +15 points
   ├─ If near golf + customer wants: +15 points
   ├─ If large garden + customer wants: +15 points
   └─ Max: 100 points

5. MARKET SCORE (15% weight)
   ├─ If 0-7 days old: +30 points (🔥 hot)
   ├─ If 7-30 days old: +15 points (⭐ fresh)
   ├─ If 30-90 days: baseline (📌 normal)
   ├─ If 90+ days: -20 points (⏰ stale, negotiate)
   ├─ If 100+ views: +15 points (👀 popular)
   └─ Max: 100 points

FINAL SCORE = Weighted sum of all 5 scores
Example: (95×0.35) + (100×0.15) + (100×0.20) + (65×0.15) + (90×0.15) = 93/100
```

---

## 📊 Notion Data Relationships

```
CUSTOMERS TABLE
│
├─ relation: MatchedProperties (via Matches table)
│  └─ Multiple properties can be matched to one customer
│
└─ properties: Monthly Income, Budget, Bedrooms, Communities, etc.

         ↓ (relation via Matches)

MATCHES TABLE (Junction table)
├─ relation: Customer → Customers
├─ relation: Property → Properties  
├─ relation: Agent → Agents
├─ Match Score (AI calculated)
└─ Status: New → Viewed → Inquired → Converted

         ↓ (relation via Matches)

PROPERTIES TABLE
│
├─ relation: Agent (one-to-many)
│
└─ properties: Price, Rent, Bedrooms, Community, Images, etc.

         ↓ (relation)

AGENTS TABLE
│
├─ relation: Properties (one-to-many)
├─ relation: Customers (via Matches, one-to-many)
│
└─ properties: Commission Rate, Communities, Performance Metrics

         ↓ (aggregates)

LEADS ANALYTICS TABLE
├─ Aggregated metrics
├─ Daily snapshots
└─ Used for dashboard charts
```

---

## 🔄 Data Sync Flow

```
Customer submits profile
         ↓
POST /api/match
         ↓
Match engine calculates scores
         ↓
Save to Notion:
├─ Update Customer status → "Active"
├─ Create Matches records (one per matching property)
└─ Increment Property view count
         ↓
Return JSON to frontend:
├─ Top 20 matches
├─ Match explanations
└─ Affordability assessment
         ↓
Frontend displays matches
         ↓
Customer clicks "I'm interested"
         ↓
Update Match status in Notion → "Inquired"
         ↓
Agent sees lead in dashboard (GET /api/admin/leads)
         ↓
Agent contacts customer
         ↓
Deal closes (manual update in Notion)
         ↓
Lead status → "Converted"
├─ Agent commission tracked
├─ Property marked as "Sold" or "Rented"
└─ Analytics updated for next quarter
```

---

## ⚡ Performance Characteristics

### API Response Times (Target)

```
POST /api/match
├─ Input validation: 10ms
├─ Fetch properties from Notion: 200-300ms
├─ Score all properties: 50ms (for 1000 properties)
├─ Rank and format: 10ms
├─ Save matches to Notion: 100-200ms
└─ Total: 400-500ms (acceptable, cached after 5 min)

GET /api/admin/leads
├─ Query Notion: 200ms
├─ Format + filter: 10ms
└─ Total: 200-300ms (cached 5 min)

GET /api/admin/analytics
├─ Multiple database queries: 300-400ms
├─ Aggregation: 50ms
└─ Total: 400-500ms (cached 30 min)
```

### Scalability

```
With Notion backend:
├─ 100,000 customers: Manageable ✓
├─ 10,000 properties: Manageable ✓
├─ 1,000,000 matches: Archive old ones
└─ Hit limits? Migrate to PostgreSQL + Prisma

With proper indexing:
├─ Query by community: <100ms
├─ Query by price range: <150ms
└─ Sort by match score: <200ms
```

---

## 🚀 Deployment Architecture

```
GitHub (Source)
   ↓ (git push)
   ├─ Triggers webhook
   └─ Auto-deploys to Vercel

Vercel (Hosting)
   ├─ Build: Next.js compiler
   ├─ CDN: Global edge network
   ├─ Serverless Functions: API routes
   ├─ Static Generation: Landing page
   └─ Blob Storage: Property images

   ↓ (API calls)

Notion (Database)
   ├─ Customers data
   ├─ Properties data
   ├─ Matches history
   └─ Agent profiles

   ↓ (Future integrations)

WhatsApp Business API
   └─ Lead notifications

Stripe (Future)
   └─ Payment processing
```

---

This architecture is:
- ✅ **Scalable:** Can handle 100k+ customers
- ✅ **Maintainable:** Clear separation of concerns
- ✅ **Cost-effective:** Vercel + Notion (no expensive servers)
- ✅ **Fast:** Caching + CDN + serverless
- ✅ **Secure:** API key protection + validation

