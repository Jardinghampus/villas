"use client";

import React from "react";
import {
  Home,
  Bed,
  Bath,
  Maximize,
  MapPin,
  TrendingUp,
  Eye,
  Calendar,
  ArrowLeft,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { MatchResponse, MatchResult, AffordabilityResult } from "@/types";
import { formatCurrency, formatSqft, getScoreColor, getScoreBgColor } from "@/lib/utils";

interface MatchResultsProps {
  response: MatchResponse;
  onBack: () => void;
}

export function MatchResults({ response, onBack }: MatchResultsProps) {
  const { matches, affordability, totalProperties } = response;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Your Matches
                </h1>
                <p className="text-sm text-slate-500">
                  {matches.length} properties matched from {totalProperties}{" "}
                  available
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Home className="w-6 h-6 text-emerald-600" />
              <span className="font-bold text-slate-900">DubaiVille</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Affordability Summary */}
        <AffordabilitySummary affordability={affordability} />

        {/* Match Results */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Top Matches for You
          </h2>

          {matches.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-slate-500">
                No properties matched your criteria. Try adjusting your
                preferences.
              </p>
              <Button onClick={onBack} className="mt-4">
                Adjust Preferences
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6">
              {matches.map((match, index) => (
                <PropertyCard key={match.property.id} match={match} rank={index + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AffordabilitySummary({
  affordability,
}: {
  affordability: AffordabilityResult;
}) {
  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Your Affordability
        </CardTitle>
        <CardDescription>{affordability.recommendation}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-slate-500">Monthly Income</p>
            <p className="text-lg font-bold text-slate-900">
              {formatCurrency(affordability.monthlyIncome)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Max Monthly Payment</p>
            <p className="text-lg font-bold text-slate-900">
              {formatCurrency(affordability.maxMonthlyPayment)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Max Purchase Price</p>
            <p className="text-lg font-bold text-emerald-600">
              {formatCurrency(affordability.maxBuyPrice, { compact: true })}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">DTI Ratio</p>
            <p
              className={`text-lg font-bold ${
                affordability.dtiRatio <= 28
                  ? "text-emerald-600"
                  : "text-yellow-600"
              }`}
            >
              {affordability.dtiRatio.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PropertyCard({ match, rank }: { match: MatchResult; rank: number }) {
  const { property, score, explanation } = match;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Image Placeholder */}
        <div className="md:w-80 h-48 md:h-auto bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center relative">
          {property.images[0] ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Home className="w-16 h-16 text-slate-400" />
          )}
          <div className="absolute top-3 left-3">
            <Badge
              className={`${getScoreBgColor(score.overall)} ${getScoreColor(
                score.overall
              )} font-bold`}
            >
              #{rank} Match - {score.overall}%
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {property.title}
              </h3>
              <p className="text-slate-500 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {property.community}
                {property.subCommunity && ` - ${property.subCommunity}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-600">
                {formatCurrency(property.price, { compact: true })}
              </p>
              {property.pricePerSqft && (
                <p className="text-sm text-slate-500">
                  {formatCurrency(property.pricePerSqft)}/sqft
                </p>
              )}
            </div>
          </div>

          {/* Property Details */}
          <div className="flex flex-wrap gap-4 mb-4 text-slate-600">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              <span>{formatSqft(property.sizeSqft)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{property.views} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{property.daysOnMarket} days on market</span>
            </div>
          </div>

          {/* Match Explanation */}
          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-slate-700">{explanation.summary}</p>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              <ScoreBar label="Affordability" value={score.affordability} />
              <ScoreBar label="Bedrooms" value={score.bedrooms} />
              <ScoreBar label="Community" value={score.community} />
              <ScoreBar label="Amenities" value={score.amenities} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              <Phone className="w-4 h-4 mr-2" />
              Contact Agent
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500">{label}</span>
        <span className={getScoreColor(value)}>{value}%</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

export default MatchResults;
