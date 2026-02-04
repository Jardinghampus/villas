"use client";

import React from "react";
import { Home, Map, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavTab = "home" | "map" | "favorites" | "profile";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  className?: string;
}

const TABS: { id: NavTab; icon: React.ReactNode; label: string }[] = [
  { id: "home", icon: <Home className="w-5 h-5" />, label: "Home" },
  { id: "map", icon: <Map className="w-5 h-5" />, label: "Map" },
  { id: "favorites", icon: <Heart className="w-5 h-5" />, label: "Saved" },
  { id: "profile", icon: <User className="w-5 h-5" />, label: "Profile" },
];

export function BottomNav({ activeTab, onTabChange, className }: BottomNavProps) {
  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        className
      )}
    >
      <div className="bg-gray-900 rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all",
              activeTab === tab.id
                ? "bg-white text-gray-900"
                : "text-gray-400 hover:text-white"
            )}
          >
            {tab.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BottomNav;
