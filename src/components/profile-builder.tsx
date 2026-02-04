"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Wallet,
  MapPin,
  Sparkles,
  Building2,
} from "lucide-react";
import type { CustomerFormData, MatchResponse } from "@/types";
import { DUBAI_COMMUNITIES, PROPERTY_AMENITIES } from "@/types";

interface ProfileBuilderProps {
  onComplete: (response: MatchResponse) => void;
  onBack?: () => void;
}

const INITIAL_PROFILE: CustomerFormData = {
  name: "",
  email: "",
  phone: "",
  customerType: "buyer",
  monthlyIncome: 0,
  budgetMin: 0,
  budgetMax: 0,
  bedroomsMin: 3,
  bedroomsMax: 5,
  preferredCommunities: [],
  mustHaveAmenities: [],
  niceToHaveAmenities: [],
};

export function ProfileBuilder({ onComplete, onBack }: ProfileBuilderProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<CustomerFormData>(INITIAL_PROFILE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = <K extends keyof CustomerFormData>(
    field: K,
    value: CustomerFormData[K]
  ) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = <K extends keyof CustomerFormData>(
    field: K,
    item: string
  ) => {
    const current = profile[field] as string[];
    const updated = current.includes(item)
      ? current.filter((c) => c !== item)
      : [...current, item];
    updateProfile(field, updated as CustomerFormData[K]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerData: profile }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate matches");
      }

      onComplete(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: "What are you looking for?",
      icon: <Home className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          {(["buyer", "renter", "investor"] as const).map((type) => (
            <Card
              key={type}
              onClick={() => updateProfile("customerType", type)}
              className={`p-4 cursor-pointer transition-all border-2 ${
                profile.customerType === type
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-slate-200 hover:border-emerald-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2
                  className={`w-5 h-5 ${
                    profile.customerType === type
                      ? "text-emerald-600"
                      : "text-slate-400"
                  }`}
                />
                <div>
                  <p className="font-semibold text-lg capitalize">{type}</p>
                  <p className="text-sm text-slate-500">
                    {type === "buyer" && "Looking to purchase a property"}
                    {type === "renter" && "Looking to rent a property"}
                    {type === "investor" && "Looking for investment opportunities"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      title: "Your details",
      icon: <Sparkles className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => updateProfile("name", e.target.value)}
              placeholder="John Doe"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => updateProfile("email", e.target.value)}
              placeholder="john@example.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => updateProfile("phone", e.target.value)}
              placeholder="+971 50 123 4567"
              className="mt-1"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Your finances",
      icon: <Wallet className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="income">Monthly Income (AED)</Label>
            <Input
              id="income"
              type="number"
              value={profile.monthlyIncome || ""}
              onChange={(e) =>
                updateProfile("monthlyIncome", parseInt(e.target.value) || 0)
              }
              placeholder="50000"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budgetMin">Min Budget (AED)</Label>
              <Input
                id="budgetMin"
                type="number"
                value={profile.budgetMin || ""}
                onChange={(e) =>
                  updateProfile("budgetMin", parseInt(e.target.value) || 0)
                }
                placeholder="1000000"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="budgetMax">Max Budget (AED)</Label>
              <Input
                id="budgetMax"
                type="number"
                value={profile.budgetMax || ""}
                onChange={(e) =>
                  updateProfile("budgetMax", parseInt(e.target.value) || 0)
                }
                placeholder="3000000"
                className="mt-1"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            We use your income to calculate affordability. As a rule of thumb,
            you can afford a home priced at 4-5x your annual income.
          </div>
        </div>
      ),
    },
    {
      title: "Property size",
      icon: <Home className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div>
            <Label className="mb-3 block">Bedrooms</Label>
            <div className="grid grid-cols-4 gap-3">
              {[2, 3, 4, 5, 6, 7].map((br) => {
                const isInRange =
                  br >= profile.bedroomsMin && br <= profile.bedroomsMax;
                return (
                  <Card
                    key={br}
                    onClick={() => {
                      if (br < profile.bedroomsMin) {
                        updateProfile("bedroomsMin", br);
                      } else if (br > profile.bedroomsMax) {
                        updateProfile("bedroomsMax", br);
                      } else if (br === profile.bedroomsMin) {
                        updateProfile("bedroomsMin", Math.min(br + 1, profile.bedroomsMax));
                      } else if (br === profile.bedroomsMax) {
                        updateProfile("bedroomsMax", Math.max(br - 1, profile.bedroomsMin));
                      }
                    }}
                    className={`p-3 text-center cursor-pointer transition-all border-2 ${
                      isInRange
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <p className="font-bold text-xl">{br}</p>
                    <p className="text-xs text-slate-500">BR</p>
                  </Card>
                );
              })}
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Selected: {profile.bedroomsMin}-{profile.bedroomsMax} bedrooms
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Preferred communities",
      icon: <MapPin className="w-6 h-6" />,
      content: (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {DUBAI_COMMUNITIES.map((community) => (
            <label
              key={community}
              className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition"
            >
              <Checkbox
                checked={profile.preferredCommunities.includes(community)}
                onCheckedChange={() =>
                  toggleArrayItem("preferredCommunities", community)
                }
              />
              <span className="font-medium">{community}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      title: "Must-have amenities",
      icon: <Sparkles className="w-6 h-6" />,
      content: (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          <p className="text-sm text-slate-500 mb-4">
            Select amenities that are essential for you
          </p>
          {PROPERTY_AMENITIES.slice(0, 12).map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition"
            >
              <Checkbox
                checked={profile.mustHaveAmenities.includes(amenity)}
                onCheckedChange={() =>
                  toggleArrayItem("mustHaveAmenities", amenity)
                }
              />
              <span className="font-medium">{amenity}</span>
            </label>
          ))}
        </div>
      ),
    },
  ];

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const canProceed = () => {
    switch (step) {
      case 0:
        return !!profile.customerType;
      case 1:
        return !!profile.name && !!profile.email;
      case 2:
        return profile.monthlyIncome > 0;
      case 3:
        return profile.bedroomsMin > 0;
      case 4:
        return profile.preferredCommunities.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-slate-600">
              Step {step + 1} of {steps.length}
            </span>
            <span className="text-sm text-slate-500">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                {currentStep.icon}
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {currentStep.title}
              </h2>
            </div>
            {currentStep.content}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            onClick={() => (step === 0 && onBack ? onBack() : setStep(Math.max(0, step - 1)))}
            variant="outline"
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {step === 0 ? "Back" : "Previous"}
          </Button>

          {step === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !canProceed()}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                "Finding matches..."
              ) : (
                <>
                  See my matches
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileBuilder;
