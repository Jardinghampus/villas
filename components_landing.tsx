import React, { useState } from 'react';
import { ChevronRight, Home, TrendingUp, Zap, MapPin, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DubaivilleLanding() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('newsletter'); // newsletter | profile
  const [profile, setProfile] = useState({
    lookingFor: '',
    income: '',
    budget: '',
    bedrooms: '',
    communities: [],
  });

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    // Save to Notion
    try {
      const response = await fetch('/api/notion/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, status: 'Lead' }),
      });
      if (response.ok) {
        setStep('profile');
        setEmail('');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    // This would trigger the match engine
    console.log('Profile submitted:', profile);
  };

  if (step === 'profile') {
    return <ProfileBuilder profile={profile} setProfile={setProfile} onSubmit={handleProfileSubmit} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Home className="w-8 h-8 text-emerald-500" />
            <span className="text-2xl font-bold text-white">DubaiVille</span>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="text-slate-300 hover:text-white transition">Features</a>
            <a href="#communities" className="text-slate-300 hover:text-white transition">Communities</a>
            <a href="#how-it-works" className="text-slate-300 hover:text-white transition">How it Works</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Hitta din perfekta villa i Dubai
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              AI-driven matchmaking för Dubais främsta residensområden. Vi rekommenderar fastigheter 
              du faktiskt kan råda med baserat på din ekonomi.
            </p>
            <div className="flex items-center gap-4 text-emerald-400 mb-12">
              <CheckCircle2 className="w-5 h-5" />
              <span>Gratis affordability-analys</span>
            </div>
            <div className="flex items-center gap-4 text-emerald-400 mb-12">
              <CheckCircle2 className="w-5 h-5" />
              <span>Personlig agent-matchning</span>
            </div>
            <div className="flex items-center gap-4 text-emerald-400 mb-12">
              <CheckCircle2 className="w-5 h-5" />
              <span>Market intelligence i realtid</span>
            </div>

            {/* Newsletter CTA */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="din@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  required
                />
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold whitespace-nowrap"
                >
                  Börja nu <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <p className="text-sm text-slate-400">
                ✓ Ingen kreditkort krävs • Få AI-matchning på 2 min
              </p>
            </form>
          </div>

          {/* Hero Image / Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-950/30 border-emerald-800/50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-emerald-400 mb-2">1,200+</div>
              <p className="text-slate-300">Luxury Listings</p>
            </Card>
            <Card className="bg-gradient-to-br from-blue-900/30 to-blue-950/30 border-blue-800/50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-blue-400 mb-2">4.8★</div>
              <p className="text-slate-300">Agent Verified</p>
            </Card>
            <Card className="bg-gradient-to-br from-purple-900/30 to-purple-950/30 border-purple-800/50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-purple-400 mb-2">24h</div>
              <p className="text-slate-300">Avg Response Time</p>
            </Card>
            <Card className="bg-gradient-to-br from-orange-900/30 to-orange-950/30 border-orange-800/50 p-6 rounded-xl">
              <div className="text-4xl font-bold text-orange-400 mb-2">98%</div>
              <p className="text-slate-300">Match Accuracy</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-700/50">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Varför DubaiVille?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: "AI Affordability",
              desc: "Vi beräknar vad du kan råda med baserat på din inkomst. Ingen gissning.",
            },
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: "Market Intelligence",
              desc: "Se vilka areas som apprecieras snabbast, days-to-sale, price trends.",
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Expert Agents",
              desc: "Matchad med Dubai-erfaren agent som specialiserar sig på din area.",
            },
            {
              icon: <MapPin className="w-8 h-8" />,
              title: "6 Premium Communities",
              desc: "Al Furjan, Tilal Al Ghaf, JGE, Arabian Ranches, Mudon, Damac Hills.",
            },
            {
              icon: <Home className="w-8 h-8" />,
              title: "Smart Filters",
              desc: "Schools, golf courses, commute time, amenities. Dina prioriteter först.",
            },
            {
              icon: <CheckCircle2 className="w-8 h-8" />,
              title: "Verified Listings",
              desc: "Alla properties verifierade av Dubai RERA och våra agents.",
            },
          ].map((feature, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700/50 p-6 hover:border-emerald-600/50 transition">
              <div className="text-emerald-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Communities Section */}
      <section id="communities" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-700/50">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Vi täcker Dubais bästa områden</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Al Furjan', villas: '340+', avgPrice: '2.8M' },
            { name: 'Tilal Al Ghaf', villas: '210+', avgPrice: '3.9M' },
            { name: 'Jumeirah Golf Estates', villas: '180+', avgPrice: '4.2M' },
            { name: 'Arabian Ranches', villas: '520+', avgPrice: '2.1M' },
            { name: 'Mudon', villas: '430+', avgPrice: '1.8M' },
            { name: 'Damac Hills', villas: '280+', avgPrice: '2.5M' },
          ].map((community, i) => (
            <Card key={i} className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 border-slate-600/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-3">{community.name}</h3>
              <div className="space-y-2 text-slate-300">
                <p><span className="text-emerald-400 font-semibold">{community.villas}</span> listings</p>
                <p>Avg: <span className="text-orange-400 font-semibold">{community.avgPrice} AED</span></p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-700/50">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Hur det funkar</h2>
        
        <div className="max-w-3xl mx-auto">
          {[
            { num: '1', title: 'Sign Up', desc: 'Email → profil på 5 minuter' },
            { num: '2', title: 'Affordability Check', desc: 'Vi analyserar vad du kan råda med' },
            { num: '3', title: 'Get Matched', desc: '10-20 perfekta matchningar baserat på AI' },
            { num: '4', title: 'Connect with Agent', desc: 'Expert agent tar över inspektioner & negotation' },
          ].map((step, i) => (
            <div key={i} className="flex gap-6 mb-8 items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {step.num}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-700/50">
        <div className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-600/50 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Redo att hitta din drömvilla?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Börja din AI-driven property journey på 2 minuter. Ingen listas blir bortkastade.
          </p>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6">
            Börja Gratis <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-8 text-center text-slate-400">
        <p>DubaiVille © 2025 • By Hampus @ Elysian Real Estate</p>
      </footer>
    </div>
  );
}
