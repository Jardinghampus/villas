"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Bath,
  BedDouble,
  Maximize,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  description?: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  price: number;
  priceType?: "month" | "total";
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onClick?: (id: string) => void;
  variant?: "default" | "compact" | "overlay";
  className?: string;
}

export function PropertyCard({
  id,
  title,
  location,
  description,
  images,
  bedrooms,
  bathrooms,
  sizeSqft,
  price,
  priceType = "month",
  isFavorite = false,
  onFavoriteToggle,
  onClick,
  variant = "default",
  className,
}: PropertyCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite(!favorite);
    onFavoriteToggle?.(id);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${price.toLocaleString()}`;
  };

  // Overlay variant - full image with text overlay
  if (variant === "overlay") {
    return (
      <div
        onClick={() => onClick?.(id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative rounded-3xl overflow-hidden cursor-pointer group aspect-[3/4]",
          className
        )}
      >
        {/* Image */}
        <div className="absolute inset-0">
          <Image
            src={images[currentImage] || "/placeholder-villa.jpg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
            <span className="text-white font-semibold">
              {formatPrice(price)}
            </span>
            {priceType === "month" && (
              <span className="text-white/70 text-sm"> / month</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
          <div className="flex items-center gap-2 text-white/80 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location}</span>
          </div>
          {description && (
            <p className="text-white/70 text-sm line-clamp-2 mb-3">
              {description}
            </p>
          )}
          <button className="text-white text-sm font-medium underline underline-offset-4">
            Read more
          </button>
        </div>

        {/* Decorative border */}
        <div className="absolute inset-4 border border-white/30 rounded-2xl pointer-events-none" />
      </div>
    );
  }

  // Default and Compact variants
  return (
    <div
      onClick={() => onClick?.(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "bg-white rounded-3xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-shadow",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={images[currentImage] || "/placeholder-villa.jpg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className={cn(
            "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all",
            favorite
              ? "bg-red-500 text-white"
              : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white"
          )}
        >
          <Heart className={cn("w-5 h-5", favorite && "fill-current")} />
        </button>

        {/* Location Badge */}
        <div className="absolute bottom-4 right-4">
          <div className="px-4 py-2 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center gap-2">
            <MapPin className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">{location}</span>
          </div>
        </div>

        {/* Image Navigation */}
        {images.length > 1 && isHovered && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 flex gap-1">
            {images.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors",
                  i === currentImage ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

        {description && variant === "default" && (
          <>
            <p className="text-gray-500 text-sm line-clamp-2 mb-2">
              {description}
            </p>
            <button className="text-gray-900 text-sm font-medium underline underline-offset-4 mb-4">
              Read more
            </button>
          </>
        )}

        {/* Stats */}
        <div className="flex gap-2 mb-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-full border border-gray-100">
            <Bath className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {bathrooms} bath{bathrooms !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-full border border-gray-100">
            <BedDouble className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {bedrooms} bed{bedrooms !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-full border border-gray-100">
            <Maximize className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {sizeSqft.toLocaleString()} sq
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(price)}
          </span>
          {priceType === "month" && (
            <span className="text-gray-500">/ per month</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact version for listings
export function PropertyCardCompact({
  id,
  title,
  location,
  images,
  bedrooms,
  bathrooms,
  sizeSqft,
  price,
  priceType = "month",
  isFavorite = false,
  onFavoriteToggle,
  onClick,
  className,
}: PropertyCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite(!favorite);
    onFavoriteToggle?.(id);
  };

  return (
    <div
      onClick={() => onClick?.(id)}
      className={cn(
        "relative rounded-3xl overflow-hidden cursor-pointer group",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/10]">
        <Image
          src={images[0] || "/placeholder-villa.jpg"}
          alt={title}
          fill
          className="object-cover"
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Favorite */}
        <button
          onClick={handleFavorite}
          className={cn(
            "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all",
            favorite
              ? "bg-red-500 text-white"
              : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/40"
          )}
        >
          <Heart className={cn("w-5 h-5", favorite && "fill-current")} />
        </button>

        {/* Content Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <h3 className="text-white font-semibold">{title}</h3>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span className="text-blue-400">{bedrooms}</span>
              <span>beds</span>
              <span className="text-blue-400">{bathrooms}</span>
              <span>baths</span>
              <span className="text-blue-400">
                {sizeSqft.toLocaleString()}
              </span>
              <span>sqft</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white font-semibold">
              ${price.toLocaleString()}
            </div>
            {priceType === "month" && (
              <div className="text-white/60 text-sm">per month</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
