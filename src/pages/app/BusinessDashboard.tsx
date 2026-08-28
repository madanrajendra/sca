import React from 'react';
import { Link } from 'react-router-dom';
import { useSCAData } from '../../context/SCADataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Award,
  TrendingUp,
  Megaphone,
  Share2,
  Users,
  Eye,
  Handshake,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Plus,
  BarChart3,
  CheckCircle2,
  Flame,
  Clock
} from 'lucide-react';

export const BusinessDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { promotions, promotedOffers, referrals } = useSCAData();

  const activePromotionsCount = promotions.filter((p) => p.status === 'LIVE').length;
  const myPromotedCount = promotedOffers.filter((po) => po.promoterBusinessId === (currentUser.businessId || 'biz_hvac')).length;
  const totalNetworkReach = promotions.reduce((sum, p) => sum + (p.estimatedReach || 0), 0);
  const totalClicks = promotions.reduce((sum, p) => sum + (p.clicks || 0), 0);
  const totalLeads = promotions.reduce((sum, p) => sum + (p.leadsCount || 0), 0);
  const totalSales = promotions.reduce((sum, p) => sum + (p.reportedSalesCount || 0), 0);

  const newPromotions = promotions.filter((p) => p.status === 'LIVE').slice(0, 3);
  const recommendedPromotions = promotions.filter((p) => p.recommended).slice(0, 3);

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-600/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-black uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Alliance Member • Data Private</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            WELCOME BACK, {currentUser.businessName || 'MY BUSINESS'}
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Spin City Alliance • 42 Trusted Member Businesses
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/app/promotions/create"
            className="adshare-red-btn px-5 py-3 rounded-xl text-xs font-black flex items-center space-x-2 shadow-lg shadow-red-600/30"
          >
            <Plus className="w-5 h-5" />
            <span>Create Campaign</span>
          </Link>
          <Link
            to="/app/adshare"
            className="bg-[#0b0b0b] hover:bg-neutral-900 border border-neutral-800 hover:border-red-600/50 text-white px-5 py-3 rounded-xl text-xs font-bold uppercase transition-all"
          >
            Explore Marketplace
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="adshare-dark-card p-5 rounded-2xl border border-red-600/30 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-extrabold uppercase">
            <span>Audience Reach</span>
            <Users className="w-4 h-4 text-[#e50914]" />
          </div>
          <div className="text-3xl font-black text-white">{totalNetworkReach.toLocaleString()}</div>
          <div className="text-[10px] text-neutral-500 font-mono">Member Combined Audience</div>
        </div>

        <div className="adshare-dark-card p-5 rounded-2xl border border-red-600/30 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-extrabold uppercase">
            <span>Tracked Clicks</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalClicks.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-bold uppercase">Measured Traffic</div>
        </div>

        <div className="adshare-dark-card p-5 rounded-2xl border border-red-600/30 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-extrabold uppercase">
            <span>Leads Generated</span>
            <Flame className="w-4 h-4 text-[#e50914]" />
          </div>
          <div className="text-3xl font-black text-[#e50914]">{totalLeads}</div>
          <div className="text-[10px] text-neutral-500 font-mono">Reported Inquiries</div>
        </div>

        <div className="adshare-dark-card p-5 rounded-2xl border border-red-600/30 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-extrabold uppercase">
            <span>Conversions</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalSales}</div>
          <div className="text-[10px] text-amber-400 font-bold uppercase">Closed Deals</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#e50914]" />
            <h2 className="text-xl font-black uppercase text-white">WHAT CAN I PROMOTE? (NEW PROMOTIONS)</h2>
          </div>
          <Link to="/app/adshare" className="text-xs font-bold uppercase text-red-500 hover:text-white flex items-center space-x-1">
            <span>View All Marketplace Campaigns</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {newPromotions.map((promo) => (
            <div key={promo.id} className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl overflow-hidden hover:border-red-600/40 transition-all flex flex-col justify-between p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded font-extrabold uppercase">
                    {promo.categoryName}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">{promo.membersPromotingCount} Members Promoting</span>
                </div>
                <h3 className="text-base font-black text-white uppercase line-clamp-1">{promo.title}</h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{promo.shortDescription}</p>
              </div>

              <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
                <div className="text-xs font-extrabold text-white uppercase">{promo.businessName}</div>
                <Link
                  to="/app/adshare"
                  className="adshare-red-btn px-3 py-1.5 rounded-lg text-xs font-black flex items-center space-x-1"
                >
                  <Megaphone className="w-3 h-3" />
                  <span>Promote</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-black uppercase text-white">WHAT SHOULD I PROMOTE? (RECOMMENDED FOR YOU)</h2>
          </div>

          <div className="space-y-4">
            {recommendedPromotions.map((promo) => (
              <div key={promo.id} className="bg-[#0b0b0b] border border-neutral-800 p-4 rounded-2xl flex items-center justify-between gap-4 hover:border-red-600/50 transition-all">
                <div className="flex items-center space-x-4">
                  <img src={promo.imageUrl} alt={promo.title} className="w-16 h-16 rounded-xl object-cover border border-neutral-800" />
                  <div>
                    <div className="text-xs font-bold text-red-500 uppercase">{promo.businessName}</div>
                    <h4 className="text-sm font-black text-white uppercase">{promo.title}</h4>
                    <div className="text-[10px] text-neutral-400 mt-0.5">Est. Reach: {(promo.estimatedReach || 0).toLocaleString()} • Expiration: {promo.endDate}</div>
                  </div>
                </div>

                <Link
                  to="/app/adshare"
                  className="adshare-red-btn px-4 py-2 rounded-xl text-xs font-black shrink-0 uppercase"
                >
                  Promote Now
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0b0b0b] border border-neutral-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-black uppercase text-white">Marketing Calendar</h3>
              </div>
              <Link to="/app/calendar" className="text-xs text-neutral-400 hover:text-white font-bold uppercase">View Calendar</Link>
            </div>

            <div className="space-y-3">
              <div className="bg-[#050505] p-3 rounded-xl border border-neutral-900 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white uppercase">Free Summer HVAC Blitz</div>
                  <div className="text-[10px] text-neutral-400">ABC Heating & Air • Ends Sep 30</div>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded uppercase font-extrabold">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
