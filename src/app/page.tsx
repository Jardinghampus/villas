"use client";

import React, { useState } from "react";
import LandingPage from "@/components/landing-page";
import ProfileBuilder from "@/components/profile-builder";
import MatchResults from "@/components/match-results";
import type { MatchResponse } from "@/types";

type AppState = "landing" | "profile" | "results";

export default function HomePage() {
  const [state, setState] = useState<AppState>("landing");
  const [matchResponse, setMatchResponse] = useState<MatchResponse | null>(null);

  const handleGetStarted = () => {
    setState("profile");
  };

  const handleProfileComplete = (response: MatchResponse) => {
    setMatchResponse(response);
    setState("results");
  };

  const handleBackToLanding = () => {
    setState("landing");
    setMatchResponse(null);
  };

  const handleBackToProfile = () => {
    setState("profile");
  };

  switch (state) {
    case "landing":
      return <LandingPage onGetStarted={handleGetStarted} />;
    case "profile":
      return (
        <ProfileBuilder
          onComplete={handleProfileComplete}
          onBack={handleBackToLanding}
        />
      );
    case "results":
      return matchResponse ? (
        <MatchResults response={matchResponse} onBack={handleBackToProfile} />
      ) : (
        <LandingPage onGetStarted={handleGetStarted} />
      );
    default:
      return <LandingPage onGetStarted={handleGetStarted} />;
  }
}
