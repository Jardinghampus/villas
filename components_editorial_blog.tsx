import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Search, Filter, TrendingUp, Home, DollarSign } from 'lucide-react';

// Types
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    title: string;
  };
  publishedAt: Date;
  updatedAt: Date;
  category: 'market-insight' | 'agent-tips' | 'community-spotlight' | 'investment' | 'lifestyle';
  tags: string[];
  readTime: number; // minutes
  image: string;
  featured: boolean;
  relatedPosts: string[]; // post IDs
}

interface BlogPostFormData {
  title: string;
  excerpt: string;
  content: string;
  category: BlogPost['category'];
  tags: string[];
  image: string;
  featured: boolean;
}

// Sample Editorial Posts
const SAMPLE_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Al Furjan Market Insights: February 2025 Report',
    slug: 'al-furjan-february-2025-market-report',
    excerpt: 'Analyzing market trends in Al Furjan: price appreciation, days-to-sale, and investment opportunities in Dubai\'s fastest-growing community.',
    content: `
# Al Furjan Market Insights: February 2025 Report

Al Furjan continues to be one of Dubai's most attractive investment destinations. Our latest market analysis reveals compelling trends for both end-users and investors.

## Key Metrics (February 2025)

**Price Trends:**
- Average villa price: AED 2.8M (↑3.2% vs January)
- Price per sqft: AED 4,850 (↑2.8% vs Q4 2024)
- Apartment rentals: AED 8,500/month average

**Sales Velocity:**
- Average days-to-sale: 18 days (↓4 days vs average)
- Market absorption: 12.5% of inventory sells monthly
- 340+ active listings

## Why Al Furjan Stands Out

### 1. Strategic Location
- 15 min to Downtown Dubai
- 25 min to DIFC
- Direct access to Sheikh Zayed Road

### 2. Family-Friendly Community
- 8 schools within 2 km radius
- Alfresco gardens in every villa
- Community parks and recreational areas

### 3. Strong ROI Potential
- Annual appreciation: 4-6% (historical)
- Rental yield: 4.2% net (buy to rent)
- Strong tenant demand (expat families)

## Investment Strategy Recommendation

**For End-Users (Primary Residence):**
- Sweet spot: 3-4 BR villas, AED 2.5M-3.2M
- Expect 4% annual appreciation
- Family amenities justify premium pricing

**For Investors (Rental Focus):**
- Target: 2-3 BR apartments/villas
- Rental yield: 4-5%
- High tenant retention (families, executives)

**For First-Time Buyers:**
- Entry price: AED 1.8M (2BR townhouse)
- Excellent for stepping into real estate ladder
- Strong demand from young professionals

## Market Headwinds to Watch

1. **Supply Increase:** 200+ new villas coming 2025-2026
2. **Interest Rates:** Higher mortgage rates = reduced affordability
3. **Competition:** Increasing developer marketing

## Headwinds to Monitor

- New supply entering market Q2-Q3 2025
- Increased competition from Mudon
- Mortgage rate pressures

## Agent Tip

Post luxury property images on TikTok. Al Furjan attracts younger expat buyers (age 28-38) who use social media heavily for property research.

## Next Steps for Buyers

1. Get pre-approved for mortgage (check affordability)
2. Identify 5-6 properties for viewing
3. Negotiate 2-3% below asking price (market allows)
4. Close within 30 days average

---

**Report Updated:** February 4, 2025  
**Data Source:** DubaiVille Market Intelligence, RERA, Agent Network  
**Next Report:** March 4, 2025
    `,
    author: {
      name: 'Hampus',
      avatar: '/avatars/hampus.jpg',
      title: 'Founder, Elysian Real Estate',
    },
    publishedAt: new Date('2025-02-04'),
    updatedAt: new Date('2025-02-04'),
    category: 'market-insight',
    tags: ['Al Furjan', 'Market Analysis', 'Investment', 'Price Trends'],
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=800&h=400&fit=crop',
    featured: true,
    relatedPosts: ['2', '5'],
  },
  {
    id: '2',
    title: '5 Agent Strategies to Close More Deals in 2025',
    slug: '5-agent-strategies-close-deals-2025',
    excerpt: 'Proven tactics used by top-performing Elysian agents to increase lead conversion and close more deals. Featuring: AI-driven follow-up, community specialization, and affordability-first marketing.',
    content: `
# 5 Agent Strategies to Close More Deals in 2025

Based on analyzing 2024 performance data from Elysian\'s top agents, here are the strategies that consistently drive conversions.

## Strategy 1: Lead Qualification (Affordability-First)

**The Problem:** Agents waste time on unqualified leads

**The Solution:** DubaiVille\'s affordability scores tell you immediately if a customer can afford the property

**Action Items:**
1. Check affordability score before scheduling viewing
2. Focus on leads with score >70
3. For score <50, educate first, show properties later

**Impact:** 40% reduction in wasted viewings

## Strategy 2: Community Specialization

**The Expert Approach:**
- Become the #1 expert in 1-2 communities
- Know average prices, school ratings, commute times
- Publish weekly market updates (via Editorial)

**Why It Works:**
- Customers trust specialists
- You can negotiate better (know market values)
- Higher closing rates in your community

**Your Community:** Al Furjan, Arabian Ranches, Tilal Al Ghaf, etc.

## Strategy 3: Leverage DubaiVille Dashboard

**Daily Ritual (15 min):**
1. Login to admin dashboard
2. Check "Hot Leads" (match score >80)
3. Send WhatsApp message within 2 hours
4. Schedule viewing within 24 hours

**Why This Works:**
- Hot leads are 3x more likely to convert
- Fast response = higher conversion
- Creates sense of urgency

## Strategy 4: AI-Powered Follow-Up

**Automated Sequence (Ready in Phase 2):**
1. Initial WhatsApp: "We found 5 properties matching your needs"
2. 24h follow-up: "Have you viewed the properties?"
3. 48h follow-up: "Let\'s schedule a viewing"
4. 72h follow-up: "Special offer: negotiate 2-3% discount"

**Conversion Lift:** +25% for automated sequences

## Strategy 5: Video Marketing (Your Secret Weapon)

**You have After Effects skills - Use them!**

Weekly Content:
- 30-sec villa tours (trending on TikTok, Instagram)
- 60-sec market insight videos
- Customer testimonials

**Content Calendar:**
- Monday: Market insight (Al Furjan prices)
- Wednesday: Lifestyle (schools, golf, amenities)
- Friday: Investment analysis

**Platform Priority:**
1. Instagram Reels (50% of viewers)
2. TikTok (27% of viewers)
3. YouTube Shorts (23% of viewers)

**ROI:** 1 viral video = 10-15 qualified leads

## Bonus: DubaiVille Editorial Strategy

**Why This Works:**
- Positions you as thought leader
- Drives organic traffic to your profile
- Builds email list for future sales

**Posting Schedule:**
- Weekly market update (Mondays)
- Agent tip (Wednesdays)
- Community spotlight (Fridays)

**Topics That Convert:**
1. "5 Hidden Fees in Dubai Real Estate" (educational)
2. "Best Communities for Families" (helpful)
3. "Investment ROI by Community" (data-driven)
4. "Mortgage Tips for Expats" (practical)

## Implementation Timeline

**Week 1:**
- [ ] Identify your 2 specialist communities
- [ ] Set up content calendar
- [ ] Create 3 video templates in After Effects

**Week 2:**
- [ ] Publish first market insight article
- [ ] Post 2 video pieces
- [ ] Engage with comments (20 min daily)

**Week 3:**
- [ ] Measure engagement metrics
- [ ] Adjust content based on data
- [ ] Reach out to top 10 leads from videos

**Week 4:**
- [ ] Launch automated WhatsApp sequence
- [ ] Schedule 5 property viewings
- [ ] Close first deal from content marketing

## Expected Results (30 Days)

✅ 50 profile views (from content)  
✅ 15 qualified leads  
✅ 3-5 property viewings  
✅ 1-2 deals closed  

---

**Author:** Hampus, Founder Elysian Real Estate  
**Data Source:** Analysis of 50+ agents, 2024 performance  
**Next Update:** February 18, 2025
    `,
    author: {
      name: 'Hampus',
      avatar: '/avatars/hampus.jpg',
      title: 'Founder, Elysian Real Estate',
    },
    publishedAt: new Date('2025-02-03'),
    updatedAt: new Date('2025-02-03'),
    category: 'agent-tips',
    tags: ['Sales', 'Strategy', 'Lead Generation', 'Conversion'],
    readTime: 10,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    featured: true,
    relatedPosts: ['1', '3'],
  },
  {
    id: '3',
    title: 'Tilal Al Ghaf: The Hidden Gem for Luxury Investors',
    slug: 'tilal-al-ghaf-luxury-investors-guide',
    excerpt: 'Why Tilal Al Ghaf commands premium prices: location, sustainability features, and ROI potential for high-net-worth individuals.',
    content: `
# Tilal Al Ghaf: The Hidden Gem for Luxury Investors

Tilal Al Ghaf represents the pinnacle of sustainable luxury in Dubai. For investors seeking premium returns and lifestyle, this community delivers on both fronts.

## The Numbers

**Price Range:** AED 3.2M - 6.5M (villas)  
**Average Price per Sqft:** AED 5,200  
**Average Days-to-Sale:** 22 days  
**Rental Yield:** 3.8% (lower price, but premium positioning)  
**Annual Appreciation:** 5-7% (above market average)

## Why Premium Pricing?

### 1. Sustainability & Innovation
- Green building standards (LEED equivalent)
- Solar panels on every villa
- Smart home technology included
- Water conservation systems (save AED 3-4K/year)

### 2. Exclusive Community
- Only 210+ villas total
- Limited supply = strong price appreciation
- Attracts high-net-worth residents (CEOs, investors, entrepreneurs)

### 3. Unmatched Amenities
- 18-hole championship golf course
- 5-star resort facilities
- Private retail village
- Equestrian center

### 4. Location Premium
- 20 min to Downtown Dubai
- 15 min to DIFC
- Direct Sheikh Zayed Road access
- Proximity to Arabian Ranches (established luxury community)

## Investment Thesis

**For Value Investors:**
- Entry price: AED 3.2M (3BR)
- 5-7% annual appreciation
- Sustainable community = long-term desirability
- Rental yield: 3.8% net

**For Luxury Investors:**
- Prestige property class
- Strong capital appreciation
- Attract high-value tenants (executives)
- Tax-efficient through offshore structures

## Market Positioning vs Competitors

| Community | Price/Sqft | Yield | Appreciation | Luxury Factor |
|-----------|-----------|-------|--------------|---------------|
| **Tilal Al Ghaf** | AED 5,200 | 3.8% | 5-7% | ⭐⭐⭐⭐⭐ |
| Jumeirah Golf Estates | AED 4,950 | 4.2% | 4-5% | ⭐⭐⭐⭐ |
| Palm Jumeirah | AED 6,800 | 3.5% | 6-8% | ⭐⭐⭐⭐⭐ |
| Arabian Ranches | AED 3,800 | 4.5% | 3-4% | ⭐⭐⭐⭐ |

**Key Insight:** Tilal Al Ghaf offers luxury + sustainability at 20% premium over other golf communities.

## Agent Marketing Angle

"Own a villa that appreciates like an investment and feels like a luxury resort."

**Ideal Customer Profile:**
- Age: 40-60
- Annual income: AED 500K+
- Primary motivation: Lifestyle + wealth preservation
- Secondary: Rental income
- Geographic origin: Europe, North America, Middle East

## Closing Strategy

1. **Affordability Check:** Must pass DTI for AED 4M+ purchase
2. **Lifestyle Tour:** Show golf course, resort amenities first
3. **Investment Case:** Present 5-year appreciation model
4. **Scarcity Play:** "Only 5 villas left in Phase 2, prices rising Q2"
5. **Financing:** Offer 80% LTV mortgage over 20 years

## Next Quarter Forecast

**Q1 2025 (Current):**
- Stabilizing prices
- 22-day average sales cycle
- Moderate demand from investors

**Q2 2025 (Predicted):**
- Price appreciation +2-3%
- Days-to-sale may compress to 15-18 days
- Increased Russian/Middle Eastern buyer interest

---

**Report:** Tilal Al Ghaf Investment Guide  
**Last Updated:** February 4, 2025  
**Next Update:** March 4, 2025
    `,
    author: {
      name: 'Hampus',
      avatar: '/avatars/hampus.jpg',
      title: 'Founder, Elysian Real Estate',
    },
    publishedAt: new Date('2025-02-02'),
    updatedAt: new Date('2025-02-02'),
    category: 'investment',
    tags: ['Tilal Al Ghaf', 'Luxury', 'Investment', 'ROI'],
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1512917774080-9b274b3e4e5a?w=800&h=400&fit=crop',
    featured: false,
    relatedPosts: ['1', '5'],
  },
  {
    id: '4',
    title: 'Jumeirah Golf Estates: Where Golf Meets Real Estate',
    slug: 'jge-golf-meets-real-estate',
    excerpt: 'Discover why Jumeirah Golf Estates is the ultimate destination for golf enthusiasts and investors alike. Featuring world-class courses, lifestyle amenities, and strong ROI potential.',
    content: `
# Jumeirah Golf Estates: Where Golf Meets Real Estate

For golf enthusiasts in Dubai, Jumeirah Golf Estates (JGE) is more than just a residential community—it's a lifestyle destination.

## Community Overview

**Total Villas:** 180+  
**Average Price:** AED 4.2M  
**Price Range:** AED 3.2M - 6.5M  
**Average Days-to-Sale:** 20 days  
**Market Absorption:** 11% monthly

## What Makes JGE Special

### 1. Championship Golf Course
- 18-hole championship course
- Designed by world-famous architect Greg Norman
- Hosting tournaments and events
- Practice facilities included with villa

### 2. Exclusive Clubhouse
- 5-star dining facilities
- Wine cellar and bar
- Private events space
- Member-only access

### 3. Lifestyle Amenities
- Swimming pools (Olympic-sized)
- Tennis courts (8 courts)
- Equestrian center
- Children's play areas

### 4. Strategic Location
- 25 min to Downtown Dubai
- 20 min to DIFC
- 15 min to Dubai International Airport
- Direct access to Sheikh Zayed Road

## Investment Angle

**For Golf Enthusiasts:**
- Play premium course daily
- Network with high-net-worth individuals
- Host business meetings on the course
- Membership value: AED 500K+ annually

**For Real Estate Investors:**
- Strong appreciation: 4-5% annually
- Rental yield: 4.2% (higher than Tilal Al Ghaf)
- Tenant demand: High (expat families, golf enthusiasts)
- Exit strategy: Always liquid market

## Affordability Analysis

**Entry Level (3BR, 2,500 sqft):**
- Price: AED 3.2M
- Monthly mortgage: AED 13,500 (AED 50K income = safe)

**Sweet Spot (4BR, 3,500 sqft):**
- Price: AED 4.2M
- Monthly mortgage: AED 17,800 (AED 65K income = safe)

**Premium (5BR, 5,000 sqft):**
- Price: AED 6.5M
- Monthly mortgage: AED 27,600 (AED 100K+ income = target)

## Marketing Positioning

"Own your perfect golf estate in Dubai's most exclusive community."

**Ideal Customer:**
- Golfers with handicap <10
- Age: 45-70
- Annual income: AED 300K+
- Primary motivation: Lifestyle + investment
- Likely nationality: European, North American, Middle Eastern

## Competitive Analysis

| Factor | JGE | Arabian Ranches | Tilal Al Ghaf | Al Furjan |
|--------|-----|-----------------|---------------|-----------|
| Course Quality | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | - |
| Affordability | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| ROI | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Lifestyle | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## Closing Strategy

1. **Golf Tournament Visit:** Invite prospect to play the course
2. **Lifestyle Positioning:** Show clubhouse + dining + events
3. **Investment Case:** Present 4-5% appreciation potential
4. **Affordability Confirmation:** Use DubaiVille calculator
5. **Financing:** 20-year mortgage, 80% LTV
6. **Timeline:** "Prices increasing Q2, 3 villas left in Phase 1"

## Agent Tips

**Social Media Angle:**
- Post golf swing videos (Instagram Reels)
- Feature hole-by-hole course tour
- Showcase clubhouse events
- Interview celebrity residents

**Content Ideas:**
- "Golf Course + Villa Tour" (video)
- "Best Par 5 Holes in Dubai" (blog)
- "How to Choose a Golf Estate Villa" (guide)
- "Networking on the Course" (lifestyle article)

---

**Published:** February 2, 2025  
**Category:** Community Spotlight + Investment  
**Next Update:** March 1, 2025
    `,
    author: {
      name: 'Hampus',
      avatar: '/avatars/hampus.jpg',
      title: 'Founder, Elysian Real Estate',
    },
    publishedAt: new Date('2025-01-31'),
    updatedAt: new Date('2025-01-31'),
    category: 'community-spotlight',
    tags: ['Jumeirah Golf Estates', 'Golf', 'Lifestyle', 'Investment'],
    readTime: 9,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop',
    featured: true,
    relatedPosts: ['1', '2'],
  },
  {
    id: '5',
    title: 'Arabian Ranches: Best Community for Families',
    slug: 'arabian-ranches-families-community-guide',
    excerpt: 'Why Arabian Ranches attracts families from around the world. Schools, safety, lifestyle, and ROI potential for the family-focused buyer.',
    content: `
# Arabian Ranches: Best Community for Families

Arabian Ranches has established itself as Dubai's premier family-focused community. With 520+ villas, strong schools, and family-centric amenities, it's the go-to destination for expat families.

## Quick Facts

**Total Villas:** 520+  
**Average Price:** AED 2.1M  
**Price Range:** AED 1.4M - 4.0M  
**Average Days-to-Sale:** 19 days  
**Rental Yield:** 4.5% (highest among premium communities)

## Why Families Choose Arabian Ranches

### 1. School Options (8 within 2 km)
- Arabian Ranches School (Grades 1-12)
- JESS - The English School Dubai
- Dubai High School
- Other international options nearby

**Why It Matters:** Expat families prioritize education above all

### 2. Safety & Security
- 24/7 security gates
- Gated community layout
- Low crime rate
- Family-oriented residents

### 3. Family Amenities
- Large private gardens (prime feature)
- Community parks
- Sports facilities (tennis, basketball)
- Playgrounds for children
- Beach clubs nearby (30 min)

### 4. Affordability for Premium Living
- Entry: AED 1.4M (2BR)
- Family-sized: AED 2.5M (4BR)
- Premium: AED 3.5M (5BR)
- Rental income: 4.5% average

## Ideal Family Profile

**Age:** 35-55  
**Children:** 2-4 kids (ages 5-18)  
**Annual Income:** AED 200K+  
**Nationality:** 60% European, 20% Middle Eastern, 20% Other  
**Budget:** AED 2M-3.5M  
**Stay Duration:** 4-10 years  

## Selling Points by Family Type

**For Young Families (Kids age 0-5):**
- Large gardens (safe outdoor play)
- Family-friendly amenities
- Excellent schools for future
- Price: Start at AED 1.8M

**For Growing Families (Kids age 6-12):**
- School quality (top priority)
- Community events and activities
- Sports facilities
- Price: AED 2.2M-3M (4BR)

**For Teenagers (Kids age 13-18):**
- Independent transportation (walkable community)
- Nightlife proximity (Dubai Marina)
- School reputation for university preparation
- Price: AED 3.0M-3.8M (5BR)

## Investment Case

**Why Investors Love AR:**
- Highest rental yield (4.5%)
- Fastest turnover (families rotate every 3-5 years)
- Consistent tenant demand
- Lower vacancy rates

**Buy-to-Rent Strategy:**
- Purchase: AED 2.2M
- Monthly rent: AED 8,200
- Annual yield: 4.5%
- Annual income: AED 98,400

## Market Comparison

| Community | Avg Price | Yield | Family Rating | Affordability |
|-----------|-----------|-------|---------------|---------------|
| **Arabian Ranches** | AED 2.1M | 4.5% | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Al Furjan | AED 2.8M | 4.0% | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Mudon | AED 1.8M | 4.2% | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| JGE | AED 4.2M | 4.2% | ⭐⭐⭐⭐ | ⭐⭐⭐ |

## Sales Strategy

**The Family Discovery Process:**

1. **Affordability Confirmation**
   - Run DTI calculation: AED 2.1M avg
   - Show financing options
   - Monthly payment: AED 9,000 (safe for AED 35K+ income)

2. **School Visit**
   - Arrange campus tour
   - Speak with admissions director
   - Review curriculum (IB, Cambridge, American)

3. **Community Tour**
   - Walk the neighborhood (evenings - see families)
   - Visit parks and playgrounds
   - Show school proximity (5-10 min walk)

4. **Property Viewing**
   - Highlight garden space
   - Show playroom potential
   - Discuss security features

5. **Close the Deal**
   - "Schools are secured, community is safe, investment is solid"
   - Offer school placement assistance
   - Fast-track visa paperwork

## Content Ideas for Editorial

**Blog Posts:**
- "8 Best International Schools in Arabian Ranches"
- "Family Budget Guide: Living in AR"
- "Safety & Security: Everything You Need to Know"
- "Community Events Calendar"
- "Best Family Restaurants in AR"

**Videos:**
- "Tour of Arabian Ranches" (5 min)
- "Back to School: Moving to AR" (3 min)
- "Family Q&A: Life in Arabian Ranches" (7 min)
- "School Comparison Guide" (8 min)

---

**Published:** January 28, 2025  
**Last Updated:** February 4, 2025  
**Next Update:** March 1, 2025
    `,
    author: {
      name: 'Hampus',
      avatar: '/avatars/hampus.jpg',
      title: 'Founder, Elysian Real Estate',
    },
    publishedAt: new Date('2025-01-28'),
    updatedAt: new Date('2025-02-04'),
    category: 'community-spotlight',
    tags: ['Arabian Ranches', 'Families', 'Schools', 'Community'],
    readTime: 11,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop',
    featured: true,
    relatedPosts: ['2', '3'],
  },
];

// Editorial Component
export default function Editorial() {
  const [selectedCategory, setSelectedCategory] = useState<BlogPost['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Filter posts
  const filteredPosts = SAMPLE_POSTS.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIdx = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIdx, startIdx + postsPerPage);

  // Get featured posts for hero
  const featuredPosts = SAMPLE_POSTS.filter(p => p.featured).slice(0, 3);

  const categories: { value: BlogPost['category'] | 'all'; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All Posts', icon: <Home className="w-4 h-4" /> },
    { value: 'market-insight', label: 'Market Insights', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'agent-tips', label: 'Agent Tips', icon: <User className="w-4 h-4" /> },
    { value: 'community-spotlight', label: 'Communities', icon: <Home className="w-4 h-4" /> },
    { value: 'investment', label: 'Investment', icon: <DollarSign className="w-4 h-4" /> },
    { value: 'lifestyle', label: 'Lifestyle', icon: <Home className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4">Editorial</h1>
            <p className="text-xl text-slate-300 max-w-2xl">
              Daily insights and weekly analysis on Dubai's real estate market. Expert commentary from Elysian Real Estate.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:border-white/50"
            />
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      {currentPage === 1 && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-8">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map(post => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition cursor-pointer group">
                <div className="relative overflow-hidden h-48 bg-slate-200">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span>•</span>
                    <span>{post.readTime} min read</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-200 rounded-full" />
                    <div className="text-sm">
                      <p className="font-semibold text-slate-900">{post.author.name}</p>
                      <p className="text-slate-500">{post.author.title}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-200">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {categories.map(cat => (
            <Button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                setCurrentPage(1);
              }}
              className={`whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === cat.value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.icon}
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {paginatedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedPosts.map(post => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition cursor-pointer group">
                  <div className="relative overflow-hidden h-40 bg-slate-200">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-6">
                    <div className="inline-block mb-3">
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        {post.category.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <div className="flex gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <span>{post.readTime} min</span>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                      <div className="w-6 h-6 bg-slate-200 rounded-full" />
                      <div className="text-xs">
                        <p className="font-semibold text-slate-900">{post.author.name}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-emerald-600 transition" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={currentPage === i + 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100'}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No articles found. Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16 mt-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg text-emerald-100 mb-8">
            Get weekly market insights, agent tips, and community spotlights delivered to your inbox.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-emerald-100 focus:outline-none focus:border-white/50"
            />
            <Button className="bg-white text-emerald-600 hover:bg-emerald-50">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-emerald-100 mt-4">
            ✓ No spam • ✓ Cancel anytime • ✓ Weekly newsletter
          </p>
        </div>
      </div>
    </div>
  );
}
