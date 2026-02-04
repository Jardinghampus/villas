"use client";

import React, { useState } from "react";
import {
  FilterPanel,
  PropertyCard,
  PropertyCardCompact,
  AmenitiesSelector,
  FloorplanModal,
  type FilterState,
} from "@/components";

export default function ShowcasePage() {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "ocean-view",
    "shower",
    "washer",
    "hot-tub",
  ]);
  const [favorites, setFavorites] = useState<string[]>(["1"]);
  const [showFloorplan, setShowFloorplan] = useState(false);

  const handleApplyFilters = (filters: FilterState) => {
    console.log("Filters applied:", filters);
    alert("Filters applied! Check console for details.");
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-200 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
          DubaiVille Design System
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Minimalist real estate UI components
        </p>

        {/* Component Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Filter Panel */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Filter Panel
            </h2>
            <FilterPanel
              onApply={handleApplyFilters}
              onCancel={() => console.log("Cancelled")}
              resultCount={64}
            />
          </div>

          {/* Amenities Selector */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Amenities Selector
            </h2>
            <AmenitiesSelector
              selected={selectedAmenities}
              onChange={setSelectedAmenities}
            />
          </div>
        </div>

        {/* Property Cards */}
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Property Cards
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Default Card */}
          <PropertyCard
            id="1"
            title="Midnight Ocean Villa"
            location="Dubai Hills Estate"
            description="Escape to luxury in this modern architectural gem perched above the coastline. Midnight Ocean Villa offers panoramic ocean views with stunning sunsets."
            images={[
              "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
            ]}
            bedrooms={4}
            bathrooms={3}
            sizeSqft={1589}
            price={4500}
            priceType="month"
            isFavorite={favorites.includes("1")}
            onFavoriteToggle={toggleFavorite}
            onClick={() => setShowFloorplan(true)}
          />

          {/* Default Card 2 */}
          <PropertyCard
            id="2"
            title="Palm Residence"
            location="Palm Jumeirah"
            description="Iconic waterfront living with direct beach access. This stunning villa offers the ultimate Dubai lifestyle experience."
            images={[
              "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
            ]}
            bedrooms={5}
            bathrooms={4}
            sizeSqft={2850}
            price={8500}
            priceType="month"
            isFavorite={favorites.includes("2")}
            onFavoriteToggle={toggleFavorite}
            onClick={(id) => console.log("Clicked:", id)}
          />

          {/* Overlay Card */}
          <PropertyCard
            id="3"
            title="Emirates Garden"
            location="Emirates Hills"
            description="Prestigious address in Dubai's most exclusive community. Featuring manicured gardens and championship golf views."
            images={[
              "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
            ]}
            bedrooms={6}
            bathrooms={5}
            sizeSqft={4200}
            price={15000}
            priceType="month"
            variant="overlay"
            isFavorite={favorites.includes("3")}
            onFavoriteToggle={toggleFavorite}
            onClick={(id) => console.log("Clicked:", id)}
          />
        </div>

        {/* Compact Cards */}
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Compact Cards (for listings)
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <PropertyCardCompact
            id="4"
            title="Lake Show Blvr West"
            location="Arabian Ranches"
            images={[
              "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
            ]}
            bedrooms={4}
            bathrooms={3}
            sizeSqft={1589}
            price={1690}
            priceType="month"
            isFavorite={favorites.includes("4")}
            onFavoriteToggle={toggleFavorite}
            onClick={(id) => console.log("Clicked:", id)}
          />

          <PropertyCardCompact
            id="5"
            title="Willow Creek Manor"
            location="Jumeirah Golf Estates"
            images={[
              "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
            ]}
            bedrooms={3}
            bathrooms={2}
            sizeSqft={1940}
            price={3690}
            priceType="month"
            isFavorite={favorites.includes("5")}
            onFavoriteToggle={toggleFavorite}
            onClick={(id) => console.log("Clicked:", id)}
          />
        </div>

        {/* Design Tokens */}
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Design Tokens
        </h2>

        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Colors */}
            <div>
              <h3 className="font-semibold mb-3">Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-900" />
                  <span className="text-sm">Primary: Gray 900</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 border" />
                  <span className="text-sm">Background: Gray 100</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border" />
                  <span className="text-sm">Card: White</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <span className="text-sm">Muted: Gray 200</span>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="font-semibold mb-3">Typography</h3>
              <div className="space-y-2">
                <p className="text-3xl font-bold">Heading 1</p>
                <p className="text-2xl font-semibold">Heading 2</p>
                <p className="text-lg font-medium">Heading 3</p>
                <p className="text-sm">Body text</p>
                <p className="text-xs text-gray-500">Caption</p>
              </div>
            </div>

            {/* Spacing */}
            <div>
              <h3 className="font-semibold mb-3">Border Radius</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gray-200 rounded-full" />
                  <span className="text-sm">Pill: rounded-full</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gray-200 rounded-3xl" />
                  <span className="text-sm">Card: rounded-3xl</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gray-200 rounded-2xl" />
                  <span className="text-sm">Button: rounded-2xl</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floorplan Modal */}
      <FloorplanModal
        isOpen={showFloorplan}
        onClose={() => setShowFloorplan(false)}
        propertyName="Midnight Ocean Villa"
        bedrooms={3}
        bathrooms={4}
        sizeSqft={1589}
        price={4500}
      />
    </div>
  );
}
