import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, Home, Wallet, MapPin } from 'lucide-react';

const COMMUNITIES = [
  'Al Furjan',
  'Tilal Al Ghaf',
  'Jumeirah Golf Estates',
  'Arabian Ranches',
  'Mudon',
  'Damac Hills',
];

export function ProfileBuilder({ onComplete }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    lookingFor: '',
    monthlyIncome: '',
    maxMonthlyBudget: '',
    downPaymentBudget: '',
    bedrooms: '',
    communities: [],
    schools: false,
    golfCourse: false,
    smallGarden: false,
  });

  const updateProfile = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const toggleCommunity = (community) => {
    setProfile(prev => ({
      ...prev,
      communities: prev.communities.includes(community)
        ? prev.communities.filter(c => c !== community)
        : [...prev.communities, community],
    }));
  };

  const handleSubmit = async () => {
    // Validate
    if (!profile.lookingFor || !profile.monthlyIncome || !profile.bedrooms || profile.communities.length === 0) {
      alert('Please fill in all fields');
      return;
    }

    // Calculate affordability
    const affordability = calculateAffordability(profile);

    // Call match engine
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, affordability }),
      });
      const matches = await response.json();
      onComplete(matches);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const steps = [
    {
      title: 'Vad letar du efter?',
      icon: <Home className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          {['Köpa', 'Hyra', 'Investera'].map(option => (
            <Card
              key={option}
              onClick={() => updateProfile('lookingFor', option)}
              className={`p-4 cursor-pointer transition border-2 ${
                profile.lookingFor === option
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-slate-300 hover:border-emerald-300'
              }`}
            >
              <p className="font-semibold text-lg">{option}</p>
            </Card>
          ))}
        </div>
      ),
    },
    {
      title: 'Din ekonomi',
      icon: <Wallet className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Månatlig inkomst (AED)</label>
            <input
              type="number"
              value={profile.monthlyIncome}
              onChange={(e) => updateProfile('monthlyIncome', e.target.value)}
              placeholder="30,000"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
            />
          </div>

          {profile.lookingFor === 'Hyra' && (
            <div>
              <label className="block text-sm font-semibold mb-2">Max månatlig hyra (AED)</label>
              <input
                type="number"
                value={profile.maxMonthlyBudget}
                onChange={(e) => updateProfile('maxMonthlyBudget', e.target.value)}
                placeholder="15,000"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>
          )}

          {profile.lookingFor === 'Köpa' && (
            <div>
              <label className="block text-sm font-semibold mb-2">Ner-betalning tillgänglig (AED)</label>
              <input
                type="number"
                value={profile.downPaymentBudget}
                onChange={(e) => updateProfile('downPaymentBudget', e.target.value)}
                placeholder="500,000"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            💡 Vi behöver detta för att beräkna affordability. Du kan köpa ett hem på max ~4-5x din årsintäkt.
          </div>
        </div>
      ),
    },
    {
      title: 'Vilken storlek?',
      icon: <Home className="w-8 h-8" />,
      content: (
        <div className="space-y-4">
          <label className="block text-sm font-semibold mb-2">Sovrum</label>
          <div className="grid grid-cols-3 gap-3">
            {['3', '4', '5+'].map(br => (
              <Card
                key={br}
                onClick={() => updateProfile('bedrooms', br)}
                className={`p-4 text-center cursor-pointer transition border-2 ${
                  profile.bedrooms === br
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-slate-300 hover:border-emerald-300'
                }`}
              >
                <p className="font-bold text-2xl">{br}</p>
                <p className="text-xs text-slate-600">bedrooms</p>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Vilka områden?',
      icon: <MapPin className="w-8 h-8" />,
      content: (
        <div className="space-y-3">
          {COMMUNITIES.map(community => (
            <label key={community} className="flex items-center gap-3 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition">
              <Checkbox
                checked={profile.communities.includes(community)}
                onChange={() => toggleCommunity(community)}
              />
              <span className="font-medium">{community}</span>
            </label>
          ))}
        </div>
      ),
    },
    {
      title: 'Vad är viktigt för dig?',
      icon: <Home className="w-8 h-8" />,
      content: (
        <div className="space-y-3">
          {[
            { field: 'schools', label: '🏫 Nära bra skolor' },
            { field: 'golfCourse', label: '⛳ Golf course proximity' },
            { field: 'smallGarden', label: '🌳 Stor privat trädgård' },
          ].map(({ field, label }) => (
            <label key={field} className="flex items-center gap-3 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition">
              <Checkbox
                checked={profile[field]}
                onChange={(e) => updateProfile(field, e.target.checked)}
              />
              <span className="font-medium">{label}</span>
            </label>
          ))}
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-slate-600">
              Steg {step + 1} av {steps.length}
            </span>
            <span className="text-sm text-slate-500">{Math.round(((step + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <Card className="p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-emerald-600">{currentStep.icon}</div>
            <h2 className="text-3xl font-bold text-slate-900">{currentStep.title}</h2>
          </div>
          <div>{currentStep.content}</div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            variant="outline"
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Tillbaka
          </Button>
          {step === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Se min matchningar <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setStep(step + 1)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Nästa <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function calculateAffordability(profile) {
  const income = parseFloat(profile.monthlyIncome) || 0;
  const downPayment = parseFloat(profile.downPaymentBudget) || 0;

  if (profile.lookingFor === 'Hyra') {
    const maxMonthly = parseFloat(profile.maxMonthlyBudget) || income * 0.3; // 30% rule
    const dtiRatio = maxMonthly / income; // DTI ratio
    const safe = dtiRatio <= 0.28;

    return {
      type: 'rent',
      maxMonthly,
      dtiRatio: (dtiRatio * 100).toFixed(1),
      safe,
      recommendation: safe
        ? `✓ Du kan hyra för upp till ${maxMonthly.toLocaleString()} AED/månad`
        : `⚠ Rekommenderad max är ${(income * 0.28).toLocaleString()} AED/månad`,
    };
  } else {
    const maxPrice = Math.min(income * 4 * 12, downPayment * 4); // 4x annual income OR 4x down payment
    const dtiOnMortgage = (maxPrice * 0.08) / income; // Assume 8% annual on mortgage

    return {
      type: 'buy',
      maxPrice,
      maxPricePretty: maxPrice.toLocaleString('sv-SE', { style: 'currency', currency: 'AED' }),
      dtiRatio: (dtiOnMortgage * 100).toFixed(1),
      safe: dtiOnMortgage <= 0.28,
      recommendation: `Du bör titta på priser upp till ${(maxPrice / 1000000).toFixed(1)}M AED`,
    };
  }
}
