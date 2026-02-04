# DubaiVille - Project Setup & Deployment

---

## 📁 Folder Structure

```
dubaiville/
├── .env.local (gitignored)
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── vercel.json
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx (landing page)
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx (admin dashboard)
│   ├── api/
│   │   ├── notion/
│   │   │   ├── customers/route.ts (GET, POST)
│   │   │   ├── properties/route.ts (GET, POST)
│   │   │   └── matches/route.ts (POST)
│   │   ├── match/route.ts (POST - main engine)
│   │   ├── admin/
│   │   │   ├── leads/route.ts (GET)
│   │   │   ├── properties/route.ts (GET)
│   │   │   └── analytics/route.ts (GET)
│   │   └── webhooks/
│   │       └── notion/route.ts (Notion sync)
│   │
│   └── auth/
│       ├── login/page.tsx
│       └── callback/route.ts
│
├── components/
│   ├── ui/ (ShadCN components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   ├── checkbox.tsx
│   │   └── [more ShadCN components]
│   │
│   ├── landing.tsx
│   ├── profile-builder.tsx
│   ├── match-results.tsx
│   ├── admin-dashboard.tsx
│   └── property-card.tsx
│
├── lib/
│   ├── notion.ts (Notion client)
│   ├── match-engine.ts (AI matching logic)
│   ├── affordability.ts (DTI calculations)
│   ├── utils.ts (helpers)
│   └── auth.ts (NextAuth config)
│
├── hooks/
│   ├── useMatches.ts
│   ├── useCustomer.ts
│   └── useAnalytics.ts
│
├── types/
│   ├── customer.ts
│   ├── property.ts
│   ├── match.ts
│   └── agent.ts
│
├── styles/
│   └── globals.css
│
├── public/
│   ├── images/
│   ├── fonts/
│   └── icons/
│
└── docs/
    ├── BLUEPRINT.md
    ├── NOTION_SETUP.md
    └── API_DOCS.md
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Clone repo (assuming git initialized)
git clone <your-repo-url>
cd dubaiville

# Install dependencies
npm install

# Required packages:
npm install next react react-dom
npm install @notionhq/client
npm install next-auth@beta
npm install zustand react-query
npm install recharts
npm install lucide-react
npm install @headlessui/react
npm install @radix-ui/react-*  # For ShadCN

# Dev dependencies
npm install -D typescript @types/node @types/react @types/react-dom
npm install -D tailwindcss postcss autoprefixer
npm install -D shadcn-ui  # For component generation
```

### 2. Environment Setup

Create `.env.local`:

```env
# Notion Configuration
NOTION_API_KEY=secret_xxxxxxxxxxxx
NOTION_CUSTOMERS_DB=abc123def456
NOTION_PROPERTIES_DB=ghi789jkl012
NOTION_MATCHES_DB=mno345pqr678
NOTION_AGENTS_DB=stu901vwx234
NOTION_ANALYTICS_DB=yz5678abc901

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# OAuth (Optional - for future)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=yyy

# Stripe (Future)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_yyy

# Vercel Blob (Image storage)
BLOB_READ_WRITE_TOKEN=xxx
```

### 3. Initialize Tailwind & ShadCN

```bash
# Initialize Tailwind
npx tailwindcss init -p

# Install ShadCN components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add checkbox
```

### 4. Run Dev Server

```bash
npm run dev
# Visit http://localhost:3000
```

---

## 📝 Key Files to Create

### 1. `app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DubaiVille - Intelligent Real Estate Matching',
  description: 'Find your perfect villa in Dubai with AI-driven affordability analysis.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body className="bg-slate-50">{children}</body>
    </html>
  );
}
```

### 2. `app/page.tsx`

```typescript
import DubaivilleLanding from '@/components/landing';

export default function Home() {
  return <DubaivilleLanding />;
}
```

### 3. `app/api/match/route.ts`

(Use the match engine file created earlier)

### 4. `lib/notion.ts`

```typescript
import { Client } from '@notionhq/client';

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const DATABASES = {
  CUSTOMERS: process.env.NOTION_CUSTOMERS_DB!,
  PROPERTIES: process.env.NOTION_PROPERTIES_DB!,
  MATCHES: process.env.NOTION_MATCHES_DB!,
  AGENTS: process.env.NOTION_AGENTS_DB!,
  ANALYTICS: process.env.NOTION_ANALYTICS_DB!,
};

// Helper functions
export async function queryDatabase(
  databaseId: string,
  filter?: any,
  sorts?: any
) {
  return notion.databases.query({
    database_id: databaseId,
    filter,
    sorts,
  });
}

export async function createPage(
  databaseId: string,
  properties: any
) {
  return notion.pages.create({
    parent: { database_id: databaseId },
    properties,
  });
}
```

### 5. `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "nodeVersion": "20.x"
}
```

---

## 🌐 Deployment to Vercel

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: DubaiVille MVP"
git branch -M main

# Add your GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/dubaiville.git
git push -u origin main
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to Git repo: YES
# - Which project: Create new
# - Project name: dubaiville
# - Framework preset: Next.js
# - Root directory: ./

# Add environment variables
vercel env add NOTION_API_KEY
vercel env add NOTION_CUSTOMERS_DB
# ... add all .env.local variables

# Deploy to production
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Configure project settings:
   - Framework: Next.js
   - Root Directory: ./
5. Add Environment Variables (from .env.local)
6. Click "Deploy"

### Step 3: Configure Domain

1. Go to Project Settings → Domains
2. Add your domain (or use Vercel's default)
3. DNS configuration instructions will appear

### Step 4: Set Up Continuous Deployment

Once deployed, every push to `main` branch automatically deploys:

```bash
# Any future changes:
git add .
git commit -m "Update: [description]"
git push origin main
# Vercel automatically builds & deploys!
```

---

## 📊 Build Configuration

### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*.vercel.app'],
    },
  },
};

module.exports = nextConfig;
```

---

## 📈 Performance Tips

### 1. Image Optimization

```typescript
import Image from 'next/image';

// Instead of:
<img src="/image.jpg" alt="..." />

// Use:
<Image src="/image.jpg" alt="..." width={400} height={300} priority />
```

### 2. API Route Caching

```typescript
// api/match/route.ts
export const revalidate = 60; // Cache for 60 seconds

// api/admin/analytics/route.ts
export const revalidate = 300; // Cache for 5 minutes
```

### 3. Database Query Optimization

```typescript
// lib/notion.ts
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const queryCache = new Map();

export async function getCachedProperties() {
  const cacheKey = 'properties_list';
  const now = Date.now();
  
  if (queryCache.has(cacheKey)) {
    const { data, timestamp } = queryCache.get(cacheKey);
    if (now - timestamp < CACHE_DURATION) {
      return data; // Return cached data
    }
  }
  
  const data = await notion.databases.query({...});
  queryCache.set(cacheKey, { data, timestamp: now });
  return data;
}
```

---

## 🔐 Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] API keys are Vercel environment variables, not in code
- [ ] NextAuth.NEXTAUTH_SECRET is random 32+ char string
- [ ] Rate limiting on API routes
- [ ] CORS configured properly
- [ ] Input validation on all forms
- [ ] HTTPS enforced in production

### Add rate limiting:

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
});

// Use in API routes:
export async function POST(req: Request) {
  const { success } = await ratelimit.limit(req.ip || 'anonymous');
  if (!success) {
    return new Response('Rate limited', { status: 429 });
  }
  // ... handle request
}
```

---

## 📱 Responsive Design Checklist

- [ ] Mobile-first design (start small, scale up)
- [ ] Max-width containers (max-w-7xl)
- [ ] Proper spacing (use Tailwind spacing)
- [ ] Touch-friendly buttons (min 44px height)
- [ ] Readable font sizes (min 16px on mobile)
- [ ] Proper line-height (1.5+)
- [ ] Hamburger menu for mobile nav

---

## 🧪 Testing

### Install Testing Libraries

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @types/jest
```

### Example Test

```typescript
// __tests__/components/landing.test.tsx
import { render, screen } from '@testing-library/react';
import DubaivilleLanding from '@/components/landing';

describe('Landing Page', () => {
  it('renders heading', () => {
    render(<DubaivilleLanding />);
    expect(screen.getByText(/Hitta din perfekta villa/i)).toBeInTheDocument();
  });

  it('has email input field', () => {
    render(<DubaivilleLanding />);
    expect(screen.getByPlaceholderText(/din@email.com/i)).toBeInTheDocument();
  });
});
```

### Run Tests

```bash
npm test
```

---

## 📞 Monitoring & Analytics

### Add Vercel Analytics

```bash
npm install @vercel/analytics @vercel/web-vitals
```

### `app/layout.tsx`

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🚨 Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

### Environment Variable Issues

```bash
# Check environment variables loaded
vercel env ls

# Pull production environment
vercel env pull
```

### Notion Connection Issues

```bash
# Test Notion API
curl -X POST https://api.notion.com/v1/databases/YOUR_DB_ID/query \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json"
```

---

## 📚 Next Steps After Deployment

1. ✅ Deploy landing page to Vercel
2. ✅ Set up Notion databases
3. ✅ Test match engine with sample data
4. ✅ Create admin dashboard view
5. ⏳ Add WhatsApp Business API integration
6. ⏳ Build email notification system
7. ⏳ Create payment processing (Stripe)
8. ⏳ Launch closed beta with Elysian agents

---

## 🎯 Launch Checklist

- [ ] All components built & tested
- [ ] Notion databases configured
- [ ] API routes tested
- [ ] Environment variables set
- [ ] Deployed to Vercel
- [ ] Custom domain configured
- [ ] Analytics set up
- [ ] Error monitoring configured
- [ ] WhatsApp notifications ready
- [ ] Agent onboarding docs created
- [ ] Landing page copy reviewed
- [ ] Mobile responsiveness tested
- [ ] Security audit completed
- [ ] Performance optimized

---

Good luck with the launch, Hampus! 🚀

