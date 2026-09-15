import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSCAData } from '../../context/SCADataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Share2,
  Plus,
  Eye,
  MousePointerClick,
  Users,
  Flame,
  Pause,
  Play,
  TrendingUp,
  Award,
  DollarSign,
  MoreVertical
} from 'lucide-react';

export const MyPromotions: React.FC = () => {
  const { promotions, businesses, togglePausePromotion } = useSCAData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'ALL' | 'LIVE' | 'DRAFT' | 'PAUSED'>('ALL');

  const userAllianceId = currentUser.allianceId || 'all_blr';
  const allianceBizIds = businesses.filter((b) => b.allianceId === userAllianceId).map((b) => b.id);

  const myCampaigns = promotions.filter((p) => {
    if (currentUser.role === 'ALLIANCE_ADMIN') {
      return allianceBizIds.includes(p.businessId) || p.allianceId === userAllianceId;
    }
    return p.businessId === (currentUser.businessId || 'biz_apex');
  });

  const filteredCampaigns = myCampaigns.filter((p) => {
    if (activeTab === 'ALL') return true;
    return p.status === activeTab;
  });

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-600/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[#e50914] text-xs font-black uppercase tracking-wider mb-1">
            <Share2 className="w-4 h-4" />
            <span>Campaign Management</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">MY CAMPAIGNS</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Track performance and manage promotions published into the alliance marketplace.
          </p>
        </div>

        <Link
          to="/app/promotions/create"
          className="adshare-red-btn px-5 py-3 rounded-xl text-xs font-black flex items-center space-x-2 shadow-lg shadow-red-600/30"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Campaign</span>
        </Link>
      </div>

      <div className="flex items-center space-x-2 border-b border-neutral-900 pb-3">
        {(['ALL', 'LIVE', 'DRAFT', 'PAUSED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
              activeTab === tab ? 'bg-[#e50914] text-white' : 'bg-[#0b0b0b] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <div className="bg-[#0b0b0b] border border-neutral-800 p-12 rounded-2xl text-center space-y-4">
            <Share2 className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-xl font-bold uppercase text-white">No campaigns in this view</h3>
            <p className="text-xs text-neutral-400">Click "Create New Campaign" to launch a campaign into the alliance.</p>
          </div>
        ) : (
          filteredCampaigns.map((promo) => (
            <div key={promo.id} className="bg-[#0b0b0b] border border-neutral-800 p-6 rounded-2xl space-y-4 hover:border-red-600/40 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img src={promo.imageUrl} alt={promo.title} className="w-16 h-16 rounded-xl object-cover border border-neutral-800" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                        promo.status === 'LIVE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {promo.status}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">Created {promo.createdAt}</span>
                    </div>
                    <h3 className="text-lg font-black uppercase text-white mt-1">{promo.title}</h3>
                    <p className="text-xs text-neutral-400 line-clamp-1">{promo.offer}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => togglePausePromotion(promo.id)}
                    className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-bold uppercase flex items-center space-x-1"
                  >
                    {promo.status === 'PAUSED' ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
                    <span>{promo.status === 'PAUSED' ? 'Resume' : 'Pause'}</span>
                  </button>

                  <Link
                    to="/app/analytics"
                    className="adshare-red-btn px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase"
                  >
                    View Analytics
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 bg-[#050505] p-3 rounded-xl border border-neutral-900 text-xs">
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold">Promoters</div>
                  <div className="font-extrabold text-[#e50914]">{promo.membersPromotingCount} Members</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold">Est. Reach</div>
                  <div className="font-extrabold text-white">{(promo.estimatedReach || 0).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold">Clicks</div>
                  <div className="font-extrabold text-emerald-400">{promo.clicks}</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold">Leads</div>
                  <div className="font-extrabold text-white">{promo.leadsCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold">Sales Reported</div>
                  <div className="font-extrabold text-amber-400">{promo.reportedSalesCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold">Est. Revenue</div>
                  <div className="font-extrabold text-white">${(promo.estimatedRevenue || 0).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
