import React, { useState } from 'react';
import { useSCAData } from '../../context/SCADataContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { getOwnerAvatar } from '../../utils/avatars';
import { ShareModal } from '../../components/common/ShareModal';
import { AdSharePromotion } from '../../types';
import {
  Megaphone,
  Users,
  Eye,
  MousePointerClick,
  Share2,
  Check,
  Building2,
  Sparkles,
  Flame,
  ArrowUpRight,
  Plus,
  ChevronDown,
  Trash2,
} from 'lucide-react';

export const AllianceFeed: React.FC = () => {
  const { promotions, promotedOffers, businesses, promoteOffer, deletePromotion } = useSCAData();
  const { currentUser } = useAuth();
  
  // Share modal state
  const [sharingPost, setSharingPost] = useState<AdSharePromotion | null>(null);

  // Hovered post ID for tooltip
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null);

  // Expanded business in right sidebar
  const [expandedBizId, setExpandedBizId] = useState<string | null>(null);

  // Determine current user's business context
  const myBusinessId = currentUser.businessId || 'biz_apex'; // Fallback to Apex Tech for demo
  const myBusiness = businesses.find((b) => b.id === myBusinessId);
  const myAllianceId = myBusiness?.allianceId || currentUser.allianceId || 'all_blr';

  // Sort by newest first
  const activePosts = promotions
    .filter((p) => p.status === 'LIVE')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Filter other businesses in the same alliance
  const allianceMembers = businesses.filter(
    (b) => b.allianceId === myAllianceId && b.membershipStatus === 'ACTIVE' && b.id !== myBusinessId
  );

  // Helper to resolve lists of promoters and non-promoters for hover tooltip
  const getTooltipLists = (postId: string, expectedCount: number, ownerId: string) => {
    // Creator of the post doesn't promote their own post in co-marketing
    const allianceMembersExceptOwner = businesses.filter(
      (b) => b.allianceId === myAllianceId && b.membershipStatus === 'ACTIVE' && b.id !== ownerId
    );

    // Get who has actually promoted
    const promotedBizNames = promotedOffers
      .filter((po) => po.promotionId === postId)
      .map((po) => po.promoterBusinessName);

    // Keep it unique
    const uniquePromoters = Array.from(new Set(promotedBizNames));

    // Pad with other active members if actual list is smaller than expected count
    if (uniquePromoters.length < expectedCount) {
      const otherBizNames = allianceMembersExceptOwner
        .filter((b) => !uniquePromoters.includes(b.name))
        .map((b) => b.name);
      
      while (uniquePromoters.length < expectedCount && otherBizNames.length > 0) {
        const name = otherBizNames.pop();
        if (name) {
          uniquePromoters.push(name);
        }
      }
    }

    // Anyone else in the alliance who is not in uniquePromoters is a non-promoter
    const nonPromoters = allianceMembersExceptOwner
      .filter((b) => !uniquePromoters.includes(b.name))
      .map((b) => b.name);

    return {
      promoted: uniquePromoters,
      notPromoted: nonPromoters
    };
  };

  const handleQuickPromote = (postId: string) => {
    if (!myBusiness) return;
    promoteOffer(postId, myBusiness.id, myBusiness.name, currentUser.id);
  };

  const toggleExpandBiz = (bizId: string) => {
    setExpandedBizId((prev) => (prev === bizId ? null : bizId));
  };

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-red-600/20 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#e50914] text-xs font-black uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              <span>Alliance Network</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">Ad Share Marketplace</h1>
            <p className="text-sm text-neutral-400 mt-1">
              The latest marketing posts and active promotions from alliance members.
            </p>
          </div>
          {myBusiness && (
            <div className="flex flex-col items-stretch space-y-2 w-full max-w-[240px]">
              <div className="bg-[#0b0b0b] border border-neutral-800 rounded-xl p-3 flex items-center space-x-3">
                <img src={getOwnerAvatar(myBusiness.id)} alt={myBusiness.ownerName} className="w-10 h-10 rounded-lg object-cover border border-neutral-700" />
                <div>
                  <span className="text-[9px] bg-red-950 text-red-400 border border-red-800 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                    Promoting As
                  </span>
                  <div className="text-xs font-bold text-white mt-1 uppercase tracking-tight">{myBusiness.name}</div>
                </div>
              </div>
              <Link
                to="/app/feed/create"
                className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center space-x-1.5 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create Post</span>
              </Link>
            </div>
          )}
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left/Center: Feed Posts */}
          <div className="lg:col-span-2 space-y-6">
            {activePosts.map((post) => {
              const { promoted, notPromoted } = getTooltipLists(post.id, post.membersPromotingCount, post.businessId);
              
              return (
                <div key={post.id} className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:border-neutral-700 transition-colors">
                  <div className="p-4 flex items-center space-x-3">
                    <Link to={`/app/feed/${post.businessId}`}>
                      <img src={post.businessLogo} alt={post.businessName} className="w-12 h-12 rounded-xl object-cover border border-neutral-700 cursor-pointer hover:border-red-600 transition-colors" />
                    </Link>
                    <div>
                      <Link to={`/app/feed/${post.businessId}`} className="text-base font-black text-white hover:text-red-500 transition-colors">
                        {post.businessName}
                      </Link>
                      <div className="text-xs text-neutral-500 mt-0.5">{new Date(post.createdAt).toLocaleDateString()} • {post.categoryName}</div>
                    </div>
                  </div>

                  <div className="px-4 pb-2">
                    <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
                    <p className="text-sm text-neutral-300 mb-4">{post.description}</p>
                  </div>

                  {post.imageUrl && (
                    <div className="w-full">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-96 object-cover" />
                    </div>
                  )}

                  <div className="p-4 border-t border-neutral-900 bg-[#050505]">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1.5">
                          <Eye className="w-4 h-4 text-neutral-500" />
                          <span>{post.views.toLocaleString()} Views</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <MousePointerClick className="w-4 h-4 text-neutral-500" />
                          <span>{post.clicks.toLocaleString()} Clicks</span>
                        </div>
                        {/* Promoted by tooltip anchor */}
                        <div
                          className="relative flex items-center space-x-1.5 text-blue-400 cursor-pointer py-1 group"
                          onMouseEnter={() => setHoveredPostId(post.id)}
                          onMouseLeave={() => setHoveredPostId(null)}
                        >
                          <Users className="w-4 h-4" />
                          <span className="underline decoration-dotted decoration-blue-400 underline-offset-2">
                            Promoted by {post.membersPromotingCount || 0} users
                          </span>

                          {/* Hover Tooltip Bubble */}
                          {hoveredPostId === post.id && (promoted.length > 0 || notPromoted.length > 0) && (
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-neutral-900/95 backdrop-blur-md border border-neutral-800/80 p-3.5 rounded-xl shadow-2xl z-50 w-60 text-xs text-neutral-200 animate-in fade-in slide-in-from-bottom-1 duration-150 space-y-3">
                              {promoted.length > 0 && (
                                <div className="space-y-1.5">
                                  <div className="font-extrabold text-neutral-500 uppercase text-[9px] tracking-widest border-b border-neutral-900 pb-1.5 flex items-center space-x-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    <span>Promoting Members:</span>
                                  </div>
                                  <ul className="space-y-1">
                                    {promoted.map((name, idx) => (
                                      <li key={idx} className="flex items-center space-x-2 font-bold text-white truncate pl-1">
                                        <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                                        <span className="truncate">{name}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {notPromoted.length > 0 && (
                                <div className="space-y-1.5">
                                  <div className="font-extrabold text-neutral-500 uppercase text-[9px] tracking-widest border-b border-neutral-900 pb-1.5 flex items-center space-x-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
                                    <span>Not Promoted By:</span>
                                  </div>
                                  <ul className="space-y-1">
                                    {notPromoted.map((name, idx) => (
                                      <li key={idx} className="flex items-center space-x-2 font-bold text-neutral-400 truncate pl-1">
                                        <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                                        <span className="truncate">{name}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Tail arrow */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900/95" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSharingPost(post)}
                          className="flex items-center space-x-1.5 text-red-400 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 hover:border-red-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all shadow-sm active:scale-95"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share ({post.shares || 0})</span>
                        </button>

                        {(post.businessId === myBusinessId || currentUser.role === 'ALLIANCE_ADMIN' || currentUser.role === 'NATIONAL_ADMIN') && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete post "${post.title}"?`)) {
                                deletePromotion(post.id);
                              }
                            }}
                            className="flex items-center space-x-1 text-neutral-500 hover:text-red-400 bg-neutral-900 hover:bg-red-950/40 border border-neutral-800 hover:border-red-900/50 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all"
                            title="Delete Post"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {activePosts.length === 0 && (
              <div className="text-center py-12 text-neutral-500 border border-neutral-800 rounded-2xl bg-[#0b0b0b]">
                <Megaphone className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No active promotions right now.</p>
              </div>
            )}
          </div>

          {/* Right Column: Alliance Members Checklist */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-20">
            <div className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl p-5 space-y-4">
              <div className="border-b border-neutral-900 pb-3">
                <h2 className="text-base font-black uppercase text-white flex items-center space-x-2">
                  <Building2 className="w-4.5 h-4.5 text-[#e50914]" />
                  <span>Alliance Promoters</span>
                </h2>
                <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                  Help peer members scale their reach. Click rectangles below to view promotions.
                </p>
              </div>

              <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                {allianceMembers.map((biz) => {
                  const bizPromos = promotions.filter((p) => p.businessId === biz.id && p.status === 'LIVE');
                  const promotedByMe = bizPromos.filter((p) =>
                    promotedOffers.some((po) => po.promotionId === p.id && po.promoterBusinessId === myBusinessId)
                  );
                  const unpromotedByMe = bizPromos.filter(
                    (p) => !promotedOffers.some((po) => po.promotionId === p.id && po.promoterBusinessId === myBusinessId)
                  );
                  const isExpanded = expandedBizId === biz.id;

                  return (
                    <div key={biz.id} className="border border-neutral-855 hover:border-neutral-700/80 rounded-xl overflow-hidden bg-[#0c0c0c] transition-all">
                      {/* Clickable Header Rectangle */}
                      <div
                        onClick={() => toggleExpandBiz(biz.id)}
                        className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-900/60 transition-colors"
                      >
                        <div className="flex items-center space-x-3.5">
                          {/* Prominent Profile Picture with relative notification dot count */}
                          <div className="relative shrink-0">
                            <img src={getOwnerAvatar(biz.id)} alt={biz.ownerName} className="w-12 h-12 rounded-lg object-cover border border-neutral-800" />
                            {unpromotedByMe.length > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white ring-2 ring-[#0c0c0c] animate-pulse">
                                {unpromotedByMe.length}
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-white tracking-wide uppercase">{biz.ownerName}</h4>
                            <p className="text-[10px] text-neutral-500 font-bold uppercase mt-0.5 tracking-tight">{biz.name}</p>
                          </div>
                        </div>

                        {/* Dropdown status indicator */}
                        <div className="flex items-center space-x-2 text-neutral-500">
                          <span className="text-[9px] font-black bg-[#050505] px-2 py-0.5 rounded border border-neutral-900">
                            {promotedByMe.length}/{bizPromos.length}
                          </span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-white' : ''}`} />
                        </div>
                      </div>

                      {/* Expandable Panel */}
                      {isExpanded && (
                        <div className="border-t border-neutral-900 bg-[#050505] p-3.5 space-y-2.5 animate-in slide-in-from-top-1 duration-200">
                          {unpromotedByMe.length > 0 ? (
                            <div className="space-y-2">
                              <span className="inline-flex items-center space-x-1 text-[8px] bg-red-950 text-red-400 border border-red-900 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                                <Flame className="w-2.5 h-2.5 text-red-500 animate-pulse" />
                                <span>Needs Promotion</span>
                              </span>
                              <div className="space-y-2">
                                {unpromotedByMe.map((promo) => (
                                  <div key={promo.id} className="flex items-center justify-between gap-3 text-xs bg-[#0c0c0c] p-2.5 rounded-lg border border-neutral-850">
                                    <span className="text-neutral-200 font-bold truncate flex-1 leading-tight">{promo.title}</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation(); // Avoid collapsing card
                                        handleQuickPromote(promo.id);
                                      }}
                                      className="shrink-0 px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-black text-[9px] uppercase rounded-md transition-colors flex items-center space-x-0.5"
                                    >
                                      <span>Share</span>
                                      <ArrowUpRight className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : bizPromos.length > 0 ? (
                            <div className="text-[10px] text-emerald-400 font-extrabold uppercase flex items-center space-x-1.5 bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-2.5">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span>All campaigns promoted!</span>
                            </div>
                          ) : (
                            <div className="text-[10px] text-neutral-500 italic p-1">
                              No active campaigns to show.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        post={sharingPost}
        isOpen={!!sharingPost}
        onClose={() => setSharingPost(null)}
      />
    </div>
  );
};
