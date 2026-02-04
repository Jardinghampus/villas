// api/match/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { NotionClient } from '@/lib/notion';

const notion = new NotionClient();

export async function POST(req: NextRequest) {
  try {
    const { profile, affordability } = await req.json();

    // 1. Get all properties matching community & bedroom criteria
    const allProperties = await notion.database.query({
      database_id: process.env.NOTION_PROPERTIES_DB,
      filter: {
        and: [
          {
            property: 'Status',
            select: { equals: 'Available' },
          },
          {
            property: 'Bedrooms',
            number: {
              greater_than_or_equal_to: parseInt(profile.bedrooms) - 1,
            },
          },
          {
            or: profile.communities.map(community => ({
              property: 'Community',
              rich_text: { contains: community },
            })),
          },
        ],
      },
    });

    // 2. Score and rank properties
    const scored = allProperties.results.map(property => {
      const price = property.properties.Price?.number || 0;
      const rent = property.properties.Rent?.number || 0;
      const community = property.properties.Community?.rich_text[0]?.plain_text || '';
      const bedrooms = property.properties.Bedrooms?.number || 0;
      const sqft = property.properties.Sqft?.number || 0;

      let score = 0;
      let affordabilityScore = 100;

      // Affordability check
      if (affordability.type === 'buy') {
        if (price <= affordability.maxPrice) {
          affordabilityScore = 100;
          score += 50;
        } else if (price <= affordability.maxPrice * 1.1) {
          affordabilityScore = 80;
          score += 40;
        } else {
          affordabilityScore = 40;
          score += 10; // Still show but low score
        }
      } else if (affordability.type === 'rent') {
        if (rent <= affordability.maxMonthly) {
          affordabilityScore = 100;
          score += 50;
        } else if (rent <= affordability.maxMonthly * 1.1) {
          affordabilityScore = 80;
          score += 40;
        } else {
          affordabilityScore = 40;
          score += 10;
        }
      }

      // Bedroom preference match
      if (bedrooms === parseInt(profile.bedrooms)) {
        score += 25;
      } else if (Math.abs(bedrooms - parseInt(profile.bedrooms)) === 1) {
        score += 15;
      } else {
        score += 5;
      }

      // Community preference match
      if (profile.communities.includes(community)) {
        score += 25;
      }

      // Amenities match
      if (profile.schools && property.properties.Schools?.checkbox) score += 10;
      if (profile.golfCourse && property.properties.GolfProximity?.checkbox) score += 10;
      if (profile.smallGarden && property.properties.LargeGarden?.checkbox) score += 10;

      // Market freshness (new listings score higher)
      const daysOnMarket = property.properties.DaysOnMarket?.number || 30;
      if (daysOnMarket < 7) score += 10;
      if (daysOnMarket < 30) score += 5;

      return {
        id: property.id,
        title: property.properties.Title?.title[0]?.plain_text || 'Untitled',
        community,
        bedrooms,
        bathrooms: property.properties.Bathrooms?.number || 0,
        sqft,
        price: affordability.type === 'buy' ? price : null,
        rent: affordability.type === 'rent' ? rent : null,
        serviceCharges: property.properties.ServiceCharges?.number || 0,
        images: property.properties.Images?.files || [],
        daysOnMarket,
        viewCount: property.properties.ViewCount?.number || 0,
        agent: property.properties.Agent?.relation?.[0] || null,
        score: Math.min(score, 100),
        affordabilityScore,
        recommendation: getRecommendation(score, affordabilityScore, profile, { price, rent }),
      };
    });

    // 3. Sort by match score (descending) and take top 20
    const topMatches = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    // 4. Save matches to Notion for agent dashboard
    await notion.database.create({
      parent: { database_id: process.env.NOTION_MATCHES_DB },
      properties: {
        Customer: { relation: [{ id: profile.customerId }] },
        Properties: { relation: topMatches.map(m => ({ id: m.id })) },
        CreatedAt: { date: { start: new Date().toISOString() } },
        Status: { status: { name: 'New' } },
      },
    });

    return NextResponse.json({
      matches: topMatches,
      affordability,
      summaryText: generateSummary(topMatches, affordability, profile),
    });
  } catch (error) {
    console.error('Match error:', error);
    return NextResponse.json(
      { error: 'Failed to generate matches' },
      { status: 500 }
    );
  }
}

function getRecommendation(score: number, affordScore: number, profile: any, property: any) {
  const scoreLevel = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Fair';

  if (affordScore < 50) {
    return `⚠ Din ekonomi räcker inte riktigt till denna property. Vi rekommenderar att titta på något billigare.`;
  }

  if (scoreLevel === 'Excellent') {
    const community = property.community || '';
    return `✅ Perfekt match! ${community} passar dina kriterier, priset matchar din budget, och belägenheten är ideal.`;
  }

  if (scoreLevel === 'Good') {
    return `👍 Bra match. Denna property uppfyller dina huvudkriterier. Vi rekommenderar att kontakta agenten för detaljer.`;
  }

  return `📌 Värd att titta på. Denna property matchar någon av dina prioriteringar. Se detaljer för mer information.`;
}

function generateSummary(matches: any[], affordability: any, profile: any) {
  const topMatch = matches[0];
  const avgScore = (matches.reduce((sum, m) => sum + m.score, 0) / matches.length).toFixed(0);

  return `
Vi hittade ${matches.length} perfekta matchningar för dig i ${profile.communities.join(', ')}.

Din ekonomi: ${affordability.recommendation}

🏆 Top Match: ${topMatch.title} i ${topMatch.community}
   • ${topMatch.bedrooms} rum, ${topMatch.sqft} sqft
   • ${topMatch.price ? `${(topMatch.price / 1000000).toFixed(1)}M AED` : `${topMatch.rent.toLocaleString()} AED/månad`}
   • Match score: ${topMatch.score}/100

Genomsnittligt match-score för dina matchningar: ${avgScore}/100

Nästa steg: Kontakta en av våra agenter för att schemalägga inspektioner!
  `;
}
