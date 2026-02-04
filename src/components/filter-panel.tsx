"use client";

import React, { useState, useMemo } from "react";
import { Home, Building2, Castle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  onApply: (filters: FilterState) => void;
  onCancel: () => void;
  resultCount?: number;
  priceData?: number[];
  className?: string;
}

export interface FilterState {
  propertyType: "house" | "condo" | "other" | null;
  bedrooms: number | null;
  bathrooms: number | null;
  priceRange: [number, number];
  mustHavePool: boolean;
  singleStory: boolean;
}

const PRICE_MIN = 300;
const PRICE_MAX = 12000;

export function FilterPanel({
  onApply,
  onCancel,
  resultCount = 64,
  priceData,
  className,
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    propertyType: "house",
    bedrooms: null,
    bathrooms: 2,
    priceRange: [850, 7400],
    mustHavePool: true,
    singleStory: false,
  });

  // Generate mock histogram data if not provided
  const histogramData = useMemo(() => {
    if (priceData) return priceData;
    return Array.from({ length: 40 }, () => Math.random() * 100 + 10);
  }, [priceData]);

  const avgPrice = useMemo(() => {
    const [min, max] = filters.priceRange;
    return Math.round((min + max) / 2);
  }, [filters.priceRange]);

  const resetFilters = () => {
    setFilters({
      propertyType: null,
      bedrooms: null,
      bathrooms: null,
      priceRange: [PRICE_MIN, PRICE_MAX],
      mustHavePool: false,
      singleStory: false,
    });
  };

  return (
    <div
      className={cn(
        "bg-white rounded-3xl shadow-xl p-6 w-full max-w-md",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Filter</h2>
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
        >
          Reset filters
        </button>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <div className="inline-flex bg-gray-100 rounded-full p-1">
          {[
            { value: "house", label: "House", icon: Home },
            { value: "condo", label: "Condo", icon: Building2 },
            { value: "other", label: "Other", icon: Castle },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  propertyType: value as FilterState["propertyType"],
                }))
              }
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                filters.propertyType === value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Bedrooms
        </label>
        <div className="flex gap-2">
          {[
            { value: null, label: "Any" },
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" },
          ].map(({ value, label }) => (
            <button
              key={label}
              onClick={() => setFilters((f) => ({ ...f, bedrooms: value }))}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all min-w-[48px]",
                filters.bedrooms === value
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Bathrooms
        </label>
        <div className="flex gap-2">
          {[
            { value: null, label: "Any" },
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" },
          ].map(({ value, label }) => (
            <button
              key={label}
              onClick={() => setFilters((f) => ({ ...f, bathrooms: value }))}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all min-w-[48px]",
                filters.bathrooms === value
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">
            Price range
          </label>
          <span className="text-sm text-gray-500">
            Avg. price is ${avgPrice.toLocaleString()}
          </span>
        </div>

        {/* Histogram */}
        <div className="h-16 flex items-end gap-0.5 mb-2">
          {histogramData.map((height, i) => {
            const barPrice =
              PRICE_MIN + (i / histogramData.length) * (PRICE_MAX - PRICE_MIN);
            const isInRange =
              barPrice >= filters.priceRange[0] &&
              barPrice <= filters.priceRange[1];
            return (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-t transition-colors",
                  isInRange ? "bg-gray-300" : "bg-gray-100"
                )}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>

        {/* Range Slider */}
        <div className="relative h-1 bg-gray-200 rounded-full mb-4">
          <div
            className="absolute h-full bg-gray-400 rounded-full"
            style={{
              left: `${((filters.priceRange[0] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
              right: `${100 - ((filters.priceRange[1] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
            }}
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            value={filters.priceRange[0]}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                priceRange: [
                  Math.min(Number(e.target.value), f.priceRange[1] - 100),
                  f.priceRange[1],
                ],
              }))
            }
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            value={filters.priceRange[1]}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                priceRange: [
                  f.priceRange[0],
                  Math.max(Number(e.target.value), f.priceRange[0] + 100),
                ],
              }))
            }
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
          {/* Handles */}
          <div
            className="absolute w-4 h-4 bg-white border-2 border-gray-300 rounded-full -top-1.5 -translate-x-1/2 cursor-grab"
            style={{
              left: `${((filters.priceRange[0] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
            }}
          />
          <div
            className="absolute w-4 h-4 bg-white border-2 border-gray-300 rounded-full -top-1.5 -translate-x-1/2 cursor-grab"
            style={{
              left: `${((filters.priceRange[1] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
            }}
          />
        </div>

        {/* Price Labels */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">${PRICE_MIN}</span>
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-xs font-medium">
              ${filters.priceRange[0].toLocaleString()}
            </span>
            <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-xs font-medium">
              ${filters.priceRange[1].toLocaleString()}
            </span>
          </div>
          <span className="text-gray-400">${PRICE_MAX.toLocaleString()}</span>
        </div>
      </div>

      {/* More Options */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-4">More options</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Pool required</span>
            <button
              onClick={() =>
                setFilters((f) => ({ ...f, mustHavePool: !f.mustHavePool }))
              }
              className={cn(
                "w-12 h-7 rounded-full transition-colors relative",
                filters.mustHavePool ? "bg-gray-900" : "bg-gray-200"
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm",
                  filters.mustHavePool ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Single story only</span>
            <button
              onClick={() =>
                setFilters((f) => ({ ...f, singleStory: !f.singleStory }))
              }
              className={cn(
                "w-12 h-7 rounded-full transition-colors relative",
                filters.singleStory ? "bg-gray-900" : "bg-gray-200"
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm",
                  filters.singleStory ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-4 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onApply(filters)}
          className="flex-1 px-6 py-4 text-sm font-medium text-white bg-gray-900 rounded-2xl hover:bg-gray-800 transition-colors"
        >
          Show {resultCount} results
        </button>
      </div>
    </div>
  );
}

export default FilterPanel;
