import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  Share2,
  Lock,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  BarChart3,
  Flame,
  Zap,
  Building,
  Target,
  Megaphone,
  Eye,
  Check
} from 'lucide-react';
import { NetworkVisualizer } from '../../components/landing/NetworkVisualizer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#ffffff] selection:bg-[#e50914] selection:text-white font-sans">
      {/* 1. TOP HEADER NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#0b0b0b]/90 backdrop-blur-md border-b border-red-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#e50914] rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-red-600/30">
              A
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-wider text-white uppercase">ADSHARE</span>
              <span className="text-[#e50914] font-bold text-xs block -mt-1 tracking-widest uppercase">MARKETPLACE</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-extrabold uppercase tracking-wider text-neutral-300">
            <a href="#how-it-works" className="hover:text-[#e50914] transition-colors">How It Works</a>
            <a href="#marketplace" className="hover:text-[#e50914] transition-colors">Marketplace</a>
            <a href="#privacy" className="hover:text-[#e50914] transition-colors">Privacy First</a>
            <a href="#benefits" className="hover:text-[#e50914] transition-colors">Benefits</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-xs font-extrabold uppercase text-neutral-300 hover:text-white transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="adshare-red-btn px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2"
            >
              <span>Join Alliance</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[140px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-600/40 text-red-400 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#e50914]" />
                <span>Cooperative Audience Amplification</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-none">
                YOUR AUDIENCE.<br />
                <span className="text-[#e50914]">YOUR CONTROL.</span>
              </h1>

              <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl font-normal leading-relaxed">
                Multiply your marketing reach without giving up ownership of your customers.
                Join trusted local business partners to share promotional campaigns while keeping customer data 100% private.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/signup"
                  className="adshare-red-btn w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-black flex items-center justify-center space-x-3 shadow-xl shadow-red-600/30"
                >
                  <span>Join the Alliance</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold uppercase bg-[#0b0b0b] border border-neutral-800 text-neutral-200 hover:border-red-600/50 hover:text-white transition-all text-center"
                >
                  Explore How It Works
                </a>
              </div>

              <div className="pt-4 flex items-center justify-center lg:justify-start space-x-3 text-xs text-neutral-400">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold text-neutral-300">
                  Strict Data Boundary: <strong className="text-white uppercase">Content is Shareable. Customer Data is Not.</strong>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <NetworkVisualizer />
            </div>
          </div>
        </div>
      </section>

      {/* 3. HERO METRICS COUNTERS */}
      <section className="py-12 bg-[#0b0b0b] border-y border-red-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="p-4 border-r border-neutral-800 last:border-r-0">
              <div className="text-4xl sm:text-5xl font-black text-[#e50914] mb-1">40+</div>
              <div className="text-xs uppercase font-extrabold text-neutral-400 tracking-wider">Trusted Businesses</div>
            </div>

            <div className="p-4 border-r border-neutral-800 last:border-r-0">
              <div className="text-4xl sm:text-5xl font-black text-white mb-1">100K+</div>
              <div className="text-xs uppercase font-extrabold text-neutral-400 tracking-wider">Combined Audience Reach</div>
            </div>

            <div className="p-4 border-r border-neutral-800 last:border-r-0">
              <div className="text-4xl sm:text-5xl font-black text-[#e50914] mb-1">250+</div>
              <div className="text-xs uppercase font-extrabold text-neutral-400 tracking-wider">Campaigns Shared</div>
            </div>

            <div className="p-4">
              <div className="text-4xl sm:text-5xl font-black text-white mb-1">$145K+</div>
              <div className="text-xs uppercase font-extrabold text-neutral-400 tracking-wider">Network Revenue</div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. WORKFLOW */}
      <section id="how-it-works" className="py-24 bg-[#050505] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#e50914] font-extrabold text-xs uppercase tracking-widest">Cooperative Framework</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2">
              CREATE • CHOOSE • SHARE • TRACK
            </h2>
            <p className="text-neutral-400 text-sm mt-4">
              A four-step workflow designed to multiply your local business reach instantly while respecting customer privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            
            <div className="adshare-dark-card p-6 rounded-2xl relative border border-red-600/30 hover:border-red-600 transition-all group">
              <div className="text-4xl font-black text-[#e50914] mb-4">01</div>
              <h3 className="text-xl font-black uppercase mb-2">CREATE</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Business creates a promotion and uploads multi-channel marketing content.
              </p>
            </div>

            <div className="adshare-dark-card p-6 rounded-2xl relative border border-red-600/30 hover:border-red-600 transition-all group">
              <div className="text-4xl font-black text-[#e50914] mb-4">02</div>
              <h3 className="text-xl font-black uppercase mb-2">CHOOSE</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Approved alliance members browse the marketplace and select complementary offers.
              </p>
            </div>

            <div className="adshare-dark-card p-6 rounded-2xl relative border border-red-600/30 hover:border-red-600 transition-all group">
              <div className="text-4xl font-black text-[#e50914] mb-4">03</div>
              <h3 className="text-xl font-black uppercase mb-2">SHARE</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Members distribute selected campaigns to their own subscribers via email, social, SMS, or flyers.
              </p>
            </div>

            <div className="adshare-dark-card p-6 rounded-2xl relative border border-red-600/30 hover:border-red-600 transition-all group">
              <div className="text-4xl font-black text-[#e50914] mb-4">04</div>
              <h3 className="text-xl font-black uppercase mb-2">TRACK</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                The system tracks impressions, clicks, leads, referrals, and sales—all with 100% data privacy.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PRIVACY HIGHLIGHT */}
      <section id="privacy" className="py-20 bg-[#0b0b0b] border-y border-red-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#050505] via-[#1a0203] to-[#050505] border-2 border-[#e50914] p-10 rounded-3xl text-center max-w-4xl mx-auto shadow-2xl space-y-4">
            <ShieldCheck className="w-16 h-16 text-[#e50914] mx-auto animate-bounce" />
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              CAMPAIGN PERFORMANCE IS SHARED.<br />
              <span className="text-[#e50914]">CUSTOMER INFORMATION IS NOT.</span>
            </h2>
            <p className="text-neutral-300 text-sm max-w-2xl mx-auto leading-relaxed">
              We engineered a zero-knowledge data barrier. Campaign creators see aggregate metrics (impressions, clicks, conversions), but can NEVER view or export subscriber lists of participating members.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-[#0b0b0b] border-t border-neutral-900 py-8 text-neutral-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-[#e50914] rounded-lg flex items-center justify-center font-bold text-sm text-white">
              A
            </div>
            <span className="font-extrabold text-white text-sm uppercase">ADSHARE MARKETPLACE</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} AdShare Marketplace. All rights reserved. Private Business Alliance Network.
          </div>
        </div>
      </footer>
    </div>
  );
};
