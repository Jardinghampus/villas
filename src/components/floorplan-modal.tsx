"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FloorplanModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  price: number;
  floorplanImage?: string;
  className?: string;
}

export function FloorplanModal({
  isOpen,
  onClose,
  bedrooms,
  bathrooms,
  sizeSqft,
  price,
  floorplanImage,
  className,
}: FloorplanModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div
        className={cn(
          "relative bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden",
          className
        )}
      >
        {/* Status Bar */}
        <div className="px-6 py-3 flex items-center justify-between text-gray-900">
          <span className="text-sm font-medium">9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              <div className="w-1 h-3 bg-gray-900 rounded-full" />
              <div className="w-1 h-3 bg-gray-900 rounded-full" />
              <div className="w-1 h-2 bg-gray-400 rounded-full" />
              <div className="w-1 h-1.5 bg-gray-400 rounded-full" />
            </div>
            <svg
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3C6.95 3 3 6.95 3 12s3.95 9 8.95 9c.55 0 1-.45 1-1s-.45-1-1-1c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7c0 1.1-.27 2.14-.74 3.07l1.46 1.46A8.93 8.93 0 0021 12c0-4.95-4.05-9-9-9z" />
            </svg>
            <div className="w-6 h-3 border border-gray-900 rounded-sm ml-1">
              <div className="w-4 h-full bg-gray-900 rounded-sm" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Floorplan</h2>

          <div className="flex gap-8">
            {/* Stats */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Beds</p>
                <p className="text-4xl font-light text-gray-900">{bedrooms}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Baths</p>
                <p className="text-4xl font-light text-gray-900">{bathrooms}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Size sqft</p>
                <p className="text-4xl font-light text-gray-900">
                  {sizeSqft.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Price</p>
                <p className="text-4xl font-light text-gray-900">
                  {price.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Floorplan SVG */}
            <div className="flex-1">
              {floorplanImage ? (
                <img
                  src={floorplanImage}
                  alt="Floorplan"
                  className="w-full h-auto"
                />
              ) : (
                <FloorplanSVG />
              )}
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center gap-2 mt-8 mb-4">
            <div className="w-8 h-1.5 bg-gray-900 rounded-full" />
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-4 border border-gray-200 rounded-2xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple floorplan SVG component
function FloorplanSVG() {
  return (
    <svg
      viewBox="0 0 200 300"
      className="w-full h-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {/* Outer walls */}
      <rect x="10" y="10" width="180" height="280" className="stroke-gray-900" />

      {/* Living room */}
      <rect x="10" y="10" width="120" height="100" className="stroke-gray-900" />
      <text x="60" y="65" className="text-xs fill-gray-400" textAnchor="middle">
        Living
      </text>

      {/* Kitchen */}
      <rect x="130" y="10" width="60" height="100" className="stroke-gray-900" />
      <text x="160" y="65" className="text-xs fill-gray-400" textAnchor="middle">
        Kitchen
      </text>

      {/* Bedroom 1 */}
      <rect x="10" y="110" width="90" height="90" className="stroke-gray-900" />
      <text x="55" y="160" className="text-xs fill-gray-400" textAnchor="middle">
        Bedroom 1
      </text>

      {/* Bedroom 2 */}
      <rect x="100" y="110" width="90" height="90" className="stroke-gray-900" />
      <text x="145" y="160" className="text-xs fill-gray-400" textAnchor="middle">
        Bedroom 2
      </text>

      {/* Bathroom */}
      <rect x="10" y="200" width="60" height="50" className="stroke-gray-900" />
      <text x="40" y="230" className="text-xs fill-gray-400" textAnchor="middle">
        Bath
      </text>

      {/* Bedroom 3 */}
      <rect x="70" y="200" width="120" height="90" className="stroke-gray-900" />
      <text x="130" y="250" className="text-xs fill-gray-400" textAnchor="middle">
        Master
      </text>

      {/* En-suite */}
      <rect x="140" y="230" width="50" height="60" className="stroke-gray-900" />

      {/* Door indicators */}
      <line x1="50" y1="110" x2="70" y2="110" className="stroke-gray-400" />
      <line x1="130" y1="150" x2="130" y2="170" className="stroke-gray-400" />
      <line x1="50" y1="200" x2="70" y2="200" className="stroke-gray-400" />
    </svg>
  );
}

export default FloorplanModal;
