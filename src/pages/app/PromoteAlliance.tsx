import React, { useState } from 'react';
import { useSCAData } from '../../context/SCADataContext';
import { useAuth } from '../../context/AuthContext';
import { getOwnerAvatar } from '../../utils/avatars';
import {
  Users,
  Building2,
  Sparkles,
  Share2,
  Handshake,
  ArrowUpRight,
  ExternalLink,
  Check,
  Mail,
  Phone,
  Globe,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const PromoteAlliance: React.FC = () => {
  const { businesses, promotions, promotedOffers, promoteOffer } = useSCAData();
  const { currentUser } = useAuth();

  // Expanded business card for campaign co-promotion
  const [expandedBizId, setExpandedBizId] = useState<string | null>(null);

  // Find business of active user
  const myBusinessId = currentUser.businessId || 'biz_apex';
  const myBusiness = businesses.find((b) => b.id === myBusinessId);
  const myAllianceId = myBusiness?.allianceId || currentUser.allianceId || 'all_blr';

  // Filter members of the same alliance (include all active ones)
  const allianceMembers = businesses.filter(
    (b) => b.allianceId === myAllianceId && b.membershipStatus === 'ACTIVE'
  );

  const handleQuickPromote = (postId: string) => {
    if (!myBusiness) return;
    promoteOffer(postId, myBusiness.id, myBusiness.name, currentUser.id);
  };

  const toggleExpandBiz = (bizId: string) => {
    setExpandedBizId((prev) => (prev === bizId ? null : bizId));
  };

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans space-y-8">
      {/* Header */}
      <div className="border-b border-red-600/20 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#e50914] text-xs font-black uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Co-Marketing Platform</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">Promote Alliance Partners</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Browse alliance members, view their marketing campaigns, and co-promote their offers to earn cross-referrals.
          </p>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allianceMembers.map((biz) => {
          const bizPromos = promotions.filter((p) => p.businessId === biz.id && p.status === 'LIVE');
          const promotedByMe = bizPromos.filter((p) =>
            promotedOffers.some((po) => po.promotionId === p.id && po.promoterBusinessId === myBusinessId)
          );
          const unpromotedByMe = bizPromos.filter(
            (p) => !promotedOffers.some((po) => po.promotionId === p.id && po.promoterBusinessId === myBusinessId)
          );
          const isExpanded = expandedBizId === biz.id;

          // Calculate total contributions
          const sharedByThem = promotedOffers.filter((po) => po.promoterBusinessId === biz.id).length;

          return (
            <div
              key={biz.id}
              className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl overflow-hidden hover:border-[#e50914]/50 transition-all card-hover flex flex-col justify-between"
            >
              <div>
                {/* Top Portion: Big Owner Portrait */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050505] border-b border-neutral-900">
                  <img
                    src={getOwnerAvatar(biz.id)}
                    alt={biz.ownerName}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Accent Bar */}
                <div className="h-1 bg-[#e50914] w-full" />

                {/* Text Area */}
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">{biz.ownerName}</h3>
                      <span className="text-[8px] bg-[#e50914]/10 text-[#e50914] border border-[#e50914]/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                        {biz.categoryName}
                      </span>
                    </div>
                    
                    {/* Business detail subtitle */}
                    <div className="text-xs text-red-500 font-bold uppercase tracking-tight flex items-center space-x-1.5 mt-1.5">
                      <img src={biz.logo} alt={biz.name} className="w-3.5 h-3.5 rounded object-cover border border-neutral-800" />
                      <span>{biz.name}</span>
                    </div>

                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3 pt-1">
                      {biz.description}
                    </p>
                  </div>

                  {/* Stats summary */}
                  <div className="grid grid-cols-2 gap-3 bg-[#050505] p-3 rounded-xl border border-neutral-900 text-xs">
                    <div>
                      <span className="text-neutral-500 block uppercase text-[8px] font-bold">Campaigns Available</span>
                      <span className="text-white font-extrabold text-sm">{bizPromos.length} Live</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block uppercase text-[8px] font-bold">Shared By Them</span>
                      <span className="text-red-500 font-extrabold text-sm">{sharedByThem} Campaigns</span>
                    </div>
                  </div>

                  {/* Bottom Row: Square Contact Buttons */}
                  <div className="flex items-center space-x-2 pt-2">
                    <a
                      href={`mailto:${biz.ownerEmail}`}
                      className="w-8 h-8 rounded bg-[#e50914]/10 hover:bg-[#e50914]/20 border border-[#e50914]/30 text-white flex items-center justify-center transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-4 h-4 text-red-500" />
                    </a>
                    <a
                      href={`tel:${biz.phone}`}
                      className="w-8 h-8 rounded bg-[#e50914]/10 hover:bg-[#e50914]/20 border border-[#e50914]/30 text-white flex items-center justify-center transition-colors"
                      title="Call Phone"
                    >
                      <Phone className="w-4 h-4 text-red-500" />
                    </a>
                    <a
                      href={biz.website}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded bg-[#e50914]/10 hover:bg-[#e50914]/20 border border-[#e50914]/30 text-white flex items-center justify-center transition-colors"
                      title="View Website"
                    >
                      <Globe className="w-4 h-4 text-red-500" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded bg-[#e50914]/10 hover:bg-[#e50914]/20 border border-[#e50914]/30 text-white flex items-center justify-center transition-colors"
                      title="LinkedIn Profile"
                    >
                      <LinkedinIcon className="w-4 h-4 text-red-500" />
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded bg-[#e50914]/10 hover:bg-[#e50914]/20 border border-[#e50914]/30 text-white flex items-center justify-center transition-colors"
                      title="Facebook Page"
                    >
                      <FacebookIcon className="w-4 h-4 text-red-500" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Collapsible Campaign List / Co-Promotion Section */}
              <div className="border-t border-neutral-900 bg-[#050505] overflow-hidden">
                <button
                  onClick={() => toggleExpandBiz(biz.id)}
                  className="w-full p-4 flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-400 hover:text-white transition-colors bg-[#080808]"
                >
                  <span className="flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-[#e50914]" />
                    <span>Co-Promote Campaigns ({bizPromos.length})</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-white' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="p-4 bg-[#050505] space-y-2 border-t border-neutral-900 animate-in slide-in-from-top-1 duration-200">
                    {bizPromos.length === 0 ? (
                      <div className="text-xs text-neutral-500 italic py-1 pl-1">
                        No active marketing campaigns right now.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {bizPromos.map((promo) => {
                          const isShared = promotedOffers.some(
                            (po) => po.promotionId === promo.id && po.promoterBusinessId === myBusinessId
                          );

                          return (
                            <div
                              key={promo.id}
                              className="flex items-center justify-between gap-3 text-xs bg-[#0b0b0b] p-3 rounded-xl border border-neutral-850"
                            >
                              <div className="flex-1 min-w-0">
                                <span className="text-white font-bold block truncate leading-tight">{promo.title}</span>
                                <span className="text-[10px] text-neutral-500 mt-0.5 block truncate">{promo.shortDescription}</span>
                              </div>
                              {isShared ? (
                                <span className="shrink-0 inline-flex items-center space-x-1 text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-1 rounded font-black uppercase tracking-wider">
                                  <Check className="w-3 h-3 text-emerald-500" />
                                  <span>Shared</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleQuickPromote(promo.id)}
                                  className="shrink-0 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase rounded-lg transition-colors flex items-center space-x-1"
                                >
                                  <span>Share Ad</span>
                                  <ArrowUpRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
