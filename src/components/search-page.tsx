"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PropertyCard, PropertyCardCompact } from "./property-card";
import { FilterPanel, FilterState } from "./filter-panel";
import { AmenitiesSelector } from "./amenities-selector";
import { BottomNav, NavTab } from "./bottom-nav";

// Mock data for properties
const MOCK_PROPERTIES = [
  {
    id: "1",
    title: "Midnight Ocean Villa",
    location: "Dubai Hills Estate",
    description:
      "Escape to luxury in this modern architectural gem perched above the coastline. Midnight Ocean Villa offers panoramic ocean views with stunning sunsets.",
    images: ["/villa-1.jpg", "/villa-2.jpg"],
    bedrooms: 4,
    bathrooms: 3,
    sizeSqft: 1589,
    price: 4500,
    priceType: "month" as const,
  },
  {
    id: "2",
    title: "Willow Creek Manor",
    location: "Arabian Ranches",
    description:
      "A serene retreat nestled among rolling hills. This contemporary villa features floor-to-ceiling windows and a private infinity pool.",
    images: ["/villa-2.jpg", "/villa-1.jpg"],
    bedrooms: 3,
    bathrooms: 2,
    sizeSqft: 1940,
    price: 3690,
    priceType: "month" as const,
  },
  {
    id: "3",
    title: "Palm Residence",
    location: "Palm Jumeirah",
    description:
      "Iconic waterfront living with direct beach access. This stunning villa offers the ultimate Dubai lifestyle experience.",
    images: ["/villa-3.jpg", "/villa-1.jpg"],
    bedrooms: 5,
    bathrooms: 4,
    sizeSqft: 2850,
    price: 8500,
    priceType: "month" as const,
  },
  {
    id: "4",
    title: "Emirates Garden Villa",
    location: "Emirates Hills",
    description:
      "Prestigious address in Dubai's most exclusive community. Featuring manicured gardens and championship golf views.",
    images: ["/villa-4.jpg", "/villa-2.jpg"],
    bedrooms: 6,
    bathrooms: 5,
    sizeSqft: 4200,
    price: 15000,
    priceType: "month" as const,
  },
];

interface SearchPageProps {
  className?: string;
}

export function SearchPage({ className }: SearchPageProps) {
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [showFilters, setShowFilters] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "ocean-view",
    "shower",
  ]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleApplyFilters = (filters: FilterState) => {
    console.log("Applied filters:", filters);
    setShowFilters(false);
  };

  return (
    <div className={cn("min-h-screen bg-gray-100", className)}>
      {/* Main Content */}
      <div className="pb-24">
        {/* Hero Section - Mobile Style */}
        <div className="relative h-[70vh] min-h-[500px]">
          <Image
            src="/hero-villa.jpg"
            alt="Luxury Villa"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Status Bar (for mobile feel) */}
          <div className="absolute top-0 left-0 right-0 px-6 py-3 flex items-center justify-between text-white">
            <span className="text-sm font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                <div className="w-1 h-3 bg-white rounded-full" />
                <div className="w-1 h-3 bg-white rounded-full" />
                <div className="w-1 h-2 bg-white/60 rounded-full" />
                <div className="w-1 h-1.5 bg-white/60 rounded-full" />
              </div>
              <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.95 3 3 6.95 3 12s3.95 9 8.95 9c.55 0 1-.45 1-1s-.45-1-1-1c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7c0 1.1-.27 2.14-.74 3.07l1.46 1.46A8.93 8.93 0 0021 12c0-4.95-4.05-9-9-9z" />
              </svg>
              <div className="w-6 h-3 border border-white rounded-sm ml-1">
                <div className="w-4 h-full bg-white rounded-sm" />
              </div>
            </div>
          </div>

          {/* Location Badge */}
          <div className="absolute top-16 left-6">
            <div className="px-4 py-2 bg-blue-500 rounded-full">
              <span className="text-white text-sm font-medium">Dubai, UAE</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
              Explore beautiful
              <br />
              homes near you
            </h1>
            <p className="text-white/80 mb-6">
              Over 2,900 homes waiting for you
            </p>

            <div className="flex gap-3">
              <button className="flex-1 py-4 bg-white text-gray-900 font-semibold rounded-2xl hover:bg-gray-100 transition-colors">
                Get Started
              </button>
              <button className="py-4 px-6 text-white font-medium rounded-2xl border border-white/30 hover:bg-white/10 transition-colors">
                Login
              </button>
            </div>
          </div>
        </div>

        {/* Search Header */}
        <div className="bg-white px-6 py-6">
          <div className="flex items-center justify-between mb-2">
            {/* User Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
              <Image
                src="/avatar.jpg"
                alt="User"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Start your home
            <br />
            search now
          </h2>
        </div>

        {/* Property Cards */}
        <div className="px-4 space-y-4">
          {MOCK_PROPERTIES.map((property) => (
            <PropertyCardCompact
              key={property.id}
              {...property}
              isFavorite={favorites.includes(property.id)}
              onFavoriteToggle={toggleFavorite}
              onClick={(id) => console.log("Clicked property:", id)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />

          {/* Panel */}
          <div className="relative z-10 m-4 max-h-[90vh] overflow-y-auto">
            <FilterPanel
              onApply={handleApplyFilters}
              onCancel={() => setShowFilters(false)}
              resultCount={64}
            />
          </div>
        </div>
      )}

      {/* Amenities Modal */}
      {showAmenities && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAmenities(false)}
          />
          <div className="relative z-10 m-4">
            <button
              onClick={() => setShowAmenities(false)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg z-20"
            >
              <X className="w-5 h-5" />
            </button>
            <AmenitiesSelector
              selected={selectedAmenities}
              onChange={setSelectedAmenities}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
