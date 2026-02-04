"use client";

import React, { useState, useMemo } from "react";
import {
  Wifi,
  Waves,
  UmbrellaIcon,
  Briefcase,
  Dumbbell,
  ShowerHead,
  WashingMachine,
  Snowflake,
  Flame,
  Tv,
  TreePine,
  UtensilsCrossed,
  Search,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Amenity {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: "favorites" | "features" | "outdoor" | "other";
}

const AMENITIES: Amenity[] = [
  { id: "wifi", label: "Wifi", icon: <Wifi className="w-4 h-4" />, category: "favorites" },
  { id: "ocean-view", label: "Ocean View", icon: <Waves className="w-4 h-4" />, category: "favorites" },
  { id: "beach-access", label: "Beach Access", icon: <UmbrellaIcon className="w-4 h-4" />, category: "favorites" },
  { id: "workspace", label: "Workspace", icon: <Briefcase className="w-4 h-4" />, category: "favorites" },
  { id: "fitness", label: "Fitness", icon: <Dumbbell className="w-4 h-4" />, category: "favorites" },
  { id: "shower", label: "Shower", icon: <ShowerHead className="w-4 h-4" />, category: "favorites" },
  { id: "washer", label: "Washer", icon: <WashingMachine className="w-4 h-4" />, category: "features" },
  { id: "ac", label: "AC Unit", icon: <Snowflake className="w-4 h-4" />, category: "features" },
  { id: "bbq", label: "BBQ Grill", icon: <Flame className="w-4 h-4" />, category: "features" },
  { id: "tv", label: "TV", icon: <Tv className="w-4 h-4" />, category: "features" },
  { id: "pool", label: "Pool", icon: <Waves className="w-4 h-4" />, category: "features" },
  { id: "oven", label: "Oven", icon: <UtensilsCrossed className="w-4 h-4" />, category: "features" },
  { id: "hot-tub", label: "Hot Tub", icon: <Waves className="w-4 h-4" />, category: "features" },
  { id: "garden", label: "Garden", icon: <TreePine className="w-4 h-4" />, category: "outdoor" },
  { id: "parking", label: "Parking", icon: <Briefcase className="w-4 h-4" />, category: "other" },
  { id: "outdoor-dining", label: "Outdoor dining", icon: <UtensilsCrossed className="w-4 h-4" />, category: "outdoor" },
  { id: "fireplace", label: "Fireplace", icon: <Flame className="w-4 h-4" />, category: "other" },
  { id: "smoke-alarm", label: "Smoke Alarm", icon: <Check className="w-4 h-4" />, category: "other" },
];

interface AmenitiesSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function AmenitiesSelector({
  selected,
  onChange,
  className,
}: AmenitiesSelectorProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAmenity = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const favorites = AMENITIES.filter((a) => a.category === "favorites");
  const features = AMENITIES.filter((a) => a.category === "features");

  const searchResults = useMemo(() => {
    if (!searchQuery) return AMENITIES;
    return AMENITIES.filter((a) =>
      a.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const totalAvailable = AMENITIES.length;

  return (
    <div className={cn("bg-white rounded-3xl shadow-xl p-6 w-full max-w-md", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Amenities</h2>
        <span className="text-sm text-gray-500">{totalAvailable} available</span>
      </div>

      {/* Favorites Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Favorites</h3>
        <div className="flex flex-wrap gap-2">
          {favorites.map((amenity) => (
            <AmenityChip
              key={amenity.id}
              amenity={amenity}
              isSelected={selected.includes(amenity.id)}
              onClick={() => toggleAmenity(amenity.id)}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Features</h3>
        <div className="flex flex-wrap gap-2">
          {features.map((amenity) => (
            <AmenityChip
              key={amenity.id}
              amenity={amenity}
              isSelected={selected.includes(amenity.id)}
              onClick={() => toggleAmenity(amenity.id)}
            />
          ))}
        </div>
      </div>

      {/* Search Link */}
      <button
        onClick={() => setSearchOpen(!searchOpen)}
        className="flex items-center gap-2 text-gray-900 hover:text-gray-700 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm font-medium underline underline-offset-4">
          Search for {totalAvailable} amenities
        </span>
      </button>

      {/* Search Dropdown */}
      {searchOpen && (
        <div className="mt-4">
          <SearchDropdown
            query={searchQuery}
            onQueryChange={setSearchQuery}
            results={searchResults}
            selected={selected}
            onToggle={toggleAmenity}
            onClose={() => setSearchOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

interface AmenityChipProps {
  amenity: Amenity;
  isSelected: boolean;
  onClick: () => void;
}

function AmenityChip({ amenity, isSelected, onClick }: AmenityChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all",
        isSelected
          ? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
      )}
    >
      {isSelected ? <Check className="w-4 h-4" /> : amenity.icon}
      {amenity.label}
    </button>
  );
}

interface SearchDropdownProps {
  query: string;
  onQueryChange: (query: string) => void;
  results: Amenity[];
  selected: string[];
  onToggle: (id: string) => void;
  onClose: () => void;
}

function SearchDropdown({
  query,
  onQueryChange,
  results,
  selected,
  onToggle,
  onClose,
}: SearchDropdownProps) {
  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search"
          className="w-full px-4 py-3 bg-gray-800 text-white placeholder:text-gray-500 border-none focus:outline-none focus:ring-0"
          autoFocus
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results */}
      <div className="max-h-64 overflow-y-auto">
        {results.slice(0, 8).map((amenity) => {
          const isSelected = selected.includes(amenity.id);
          return (
            <button
              key={amenity.id}
              onClick={() => onToggle(amenity.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                isSelected
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              )}
            >
              {amenity.icon}
              <span className="text-sm">{amenity.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AmenitiesSelector;
