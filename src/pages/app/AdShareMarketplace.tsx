import React, { useState } from 'react';
import { useSCAData } from '../../context/SCADataContext';
import { useAuth } from '../../context/AuthContext';
import { AdSharePromotion, PromotedOffer } from '../../types';
import {
  Search,
  Filter,
  Sparkles,
  Eye,
  Megaphone,
  Bookmark,
  Share2,
  Users,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Download,
  QrCode,
  ExternalLink,
  Plus,
  X,
  TrendingUp,
  Award,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdShareMarketplace: React.FC = () => {
  const { promotions, categories, promoteOffer, promotedOffers } = useSCAData();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  
  const [selectedPromoForDetail, setSelectedPromoForDetail] = useState<AdSharePromotion | null>(null);
  const [selectedPromoForPromote, setSelectedPromoForPromote] = useState<AdSharePromotion | null>(null);
  const [generatedPromotedOffer, setGeneratedPromotedOffer] = useState<PromotedOffer | null>(null);

  const [selectedChannels, setSelectedChannels] = useState<{ [key: string]: boolean }>({
    Email: true,
    Facebook: true,
    LinkedIn: true,
    Instagram: false,
    Flyer: false,
    QRCode: false,
  });

  const [copiedLink, setCopiedLink] = useState(false);

  const livePromotions = promotions.filter((p) => p.status === 'LIVE');

  const filteredPromotions = livePromotions.filter((promo) => {
    const matchesSearch =
      promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || promo.categoryName === selectedCategory;

    if (filterType === 'RECOMMENDED') return matchesSearch && matchesCategory && promo.recommended;
    if (filterType === 'SAVED') return matchesSearch && matchesCategory && savedIds.includes(promo.id);
    if (filterType === 'MOST_SHARED') return matchesSearch && matchesCategory && promo.shares > 20;

    return matchesSearch && matchesCategory;
  });

  const toggleSave = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleChannel = (channelKey: string) => {
    setSelectedChannels((prev) => ({ ...prev, [channelKey]: !prev[channelKey] }));
  };

  const activeChannelCount = Object.values(selectedChannels).filter(Boolean).length;
  const baseReach = selectedPromoForPromote?.estimatedReach || 15000;
  const calculatedReach = Math.round(baseReach * (0.4 + activeChannelCount * 0.15));

  const handleStartPromoting = () => {
    if (!selectedPromoForPromote) return;
    const promoterBizId = currentUser.businessId || 'biz_hvac';
    const promoterBizName = currentUser.businessName || 'My Business';

    const result = promoteOffer(
      selectedPromoForPromote.id,
      promoterBizId,
      promoterBizName,
      currentUser.id
    );

    setGeneratedPromotedOffer(result);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-[#050505] p-6 md:p-8 min-h-screen text-neutral-100 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-[#e50914] text-xs font-black uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Alliance Co-Op Marketplace</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">CAMPAIGN MARKETPLACE</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Discover verified promotions created by trusted alliance members. Choose campaigns to amplify to your audience.
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
        </div>
      </div>

      <div className="mb-8 p-4 bg-[#0b0b0b] border border-red-600/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-600/50 flex items-center justify-center text-[#e50914]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Zero-Knowledge Data Boundary</div>
            <div className="text-sm font-extrabold text-white uppercase">Content is Shareable. Customer Data is Not.</div>
          </div>
        </div>
        <div className="text-xs text-neutral-400 text-center md:text-right">
          Promoting a campaign generates unique tracking links. Participating members never share CRM database contacts.
        </div>
      </div>

      <div className="bg-[#0b0b0b] border border-neutral-800 p-4 rounded-2xl mb-8 space-y-4">
        <div className="grid md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-neutral-500 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search campaigns by business, offer title, category or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#050505] border border-neutral-800 text-white text-sm pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#050505] border border-neutral-800 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-red-600 transition-colors"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 flex items-center space-x-2">
            <button
              onClick={() => setFilterType('ALL')}
              className={`flex-1 py-3 px-3 rounded-xl text-xs font-black uppercase transition-all ${
                filterType === 'ALL'
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'bg-[#050505] text-neutral-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('RECOMMENDED')}
              className={`flex-1 py-3 px-3 rounded-xl text-xs font-black uppercase transition-all ${
                filterType === 'RECOMMENDED'
                  ? 'bg-red-950 text-red-400 border border-red-800'
                  : 'bg-[#050505] text-neutral-400 hover:text-white'
              }`}
            >
              Recommended
            </button>
            <button
              onClick={() => setFilterType('SAVED')}
              className={`flex-1 py-3 px-3 rounded-xl text-xs font-black uppercase transition-all ${
                filterType === 'SAVED'
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'bg-[#050505] text-neutral-400 hover:text-white'
              }`}
            >
              Saved ({savedIds.length})
            </button>
          </div>
        </div>
      </div>

      {filteredPromotions.length === 0 ? (
        <div className="adshare-dark-card p-12 rounded-2xl text-center space-y-4">
          <Megaphone className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-xl font-bold uppercase text-white">No campaigns found</h3>
          <p className="text-neutral-400 text-sm max-w-md mx-auto">
            Try adjusting your search criteria or category filter to discover live promotions.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromotions.map((promo) => {
            const isSaved = savedIds.includes(promo.id);
            const isPromoted = promotedOffers.some(
              (po) => po.promotionId === promo.id && po.promoterBusinessId === (currentUser.businessId || 'biz_hvac')
            );

            return (
              <div
                key={promo.id}
                className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl overflow-hidden hover:border-red-600/50 transition-all flex flex-col group card-hover shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-neutral-900">
                  <img
                    src={promo.imageUrl}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-black/40" />

                  <div className="absolute top-3 left-3 flex items-center space-x-2">
                    <span className="bg-black/80 backdrop-blur-md border border-neutral-700 text-xs font-bold text-white px-2.5 py-1 rounded-full uppercase">
                      {promo.categoryName}
                    </span>
                    {promo.recommended && (
                      <span className="bg-[#e50914] text-white text-xs font-black px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-md uppercase">
                        <Award className="w-3 h-3" />
                        <span>RECOMMENDED</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleSave(promo.id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700 flex items-center justify-center text-white hover:text-red-500 transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={promo.businessLogo}
                        alt={promo.businessName}
                        className="w-8 h-8 rounded-lg object-cover border border-neutral-700"
                      />
                      <div>
                        <div className="text-xs font-extrabold text-white uppercase">{promo.businessName}</div>
                        <div className="text-[10px] text-neutral-400">Trusted Alliance Member</div>
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1 mb-2">
                      {promo.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                      {promo.shortDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-[#050505] p-3 rounded-xl border border-neutral-900 text-xs">
                    <div>
                      <div className="text-[10px] text-neutral-500 uppercase font-semibold">Est. Reach</div>
                      <div className="font-extrabold text-white">{promo.estimatedReach.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-500 uppercase font-semibold">Participating</div>
                      <div className="font-extrabold text-red-500">{promo.membersPromotingCount} Members</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => setSelectedPromoForDetail(promo)}
                      className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-extrabold uppercase text-white flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-neutral-400" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPromoForPromote(promo);
                        setGeneratedPromotedOffer(null);
                      }}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-black uppercase flex items-center justify-center space-x-1.5 transition-all ${
                        isPromoted
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'adshare-red-btn'
                      }`}
                    >
                      {isPromoted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>PROMOTING</span>
                        </>
                      ) : (
                        <>
                          <Megaphone className="w-4 h-4" />
                          <span>PROMOTE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {selectedPromoForDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-red-600/40 rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto relative text-neutral-100">
            <button
              onClick={() => setSelectedPromoForDetail(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-3">
              <img
                src={selectedPromoForDetail.businessLogo}
                alt={selectedPromoForDetail.businessName}
                className="w-12 h-12 rounded-xl object-cover border border-neutral-700"
              />
              <div>
                <h2 className="text-xl font-black uppercase text-white">{selectedPromoForDetail.title}</h2>
                <p className="text-xs text-neutral-400">{selectedPromoForDetail.businessName} • {selectedPromoForDetail.categoryName}</p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden h-56 bg-neutral-900 border border-neutral-800">
              <img
                src={selectedPromoForDetail.imageUrl}
                alt={selectedPromoForDetail.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h4 className="text-xs font-black text-[#e50914] uppercase tracking-wider mb-1">Exclusive Offer Details</h4>
              <p className="text-sm text-neutral-200 leading-relaxed">{selectedPromoForDetail.description}</p>
            </div>

            <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-center space-x-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-xs text-emerald-300 font-semibold uppercase">
                Customer Data Privacy Guaranteed: Promoting this campaign will generate your personalized tracking link. You never upload customer contact files.
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setSelectedPromoForDetail(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedPromoForPromote(selectedPromoForDetail);
                  setSelectedPromoForDetail(null);
                  setGeneratedPromotedOffer(null);
                }}
                className="adshare-red-btn px-6 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2"
              >
                <Megaphone className="w-4 h-4" />
                <span>Promote This Offer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPromoForPromote && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border-2 border-[#e50914] rounded-2xl max-w-xl w-full p-6 space-y-6 relative text-neutral-100 shadow-2xl">
            <button
              onClick={() => setSelectedPromoForPromote(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {!generatedPromotedOffer ? (
              <>
                <div>
                  <span className="text-[#e50914] font-extrabold text-xs uppercase tracking-widest">Promotion Setup</span>
                  <h2 className="text-2xl font-black uppercase text-white mt-1">CHOOSE PROMOTION CHANNELS</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Select how you plan to distribute <strong>{selectedPromoForPromote.title}</strong> to your audience.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    onClick={() => toggleChannel('Email')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedChannels.Email
                        ? 'bg-red-950/40 border-red-600/60 text-white'
                        : 'bg-[#050505] border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${selectedChannels.Email ? 'bg-[#e50914] border-[#e50914]' : 'border-neutral-700'}`}>
                        {selectedChannels.Email && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-xs font-extrabold uppercase">Email My Customers</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">Reach: ~12,500</span>
                  </label>

                  <label
                    onClick={() => toggleChannel('Facebook')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedChannels.Facebook
                        ? 'bg-red-950/40 border-red-600/60 text-white'
                        : 'bg-[#050505] border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${selectedChannels.Facebook ? 'bg-[#e50914] border-[#e50914]' : 'border-neutral-700'}`}>
                        {selectedChannels.Facebook && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-xs font-extrabold uppercase">Share on Facebook Page</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">Reach: ~4,200</span>
                  </label>

                  <label
                    onClick={() => toggleChannel('LinkedIn')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedChannels.LinkedIn
                        ? 'bg-red-950/40 border-red-600/60 text-white'
                        : 'bg-[#050505] border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${selectedChannels.LinkedIn ? 'bg-[#e50914] border-[#e50914]' : 'border-neutral-700'}`}>
                        {selectedChannels.LinkedIn && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-xs font-extrabold uppercase">Share on LinkedIn</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">Reach: ~3,800</span>
                  </label>

                  <label
                    onClick={() => toggleChannel('Flyer')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedChannels.Flyer
                        ? 'bg-red-950/40 border-red-600/60 text-white'
                        : 'bg-[#050505] border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border ${selectedChannels.Flyer ? 'bg-[#e50914] border-[#e50914]' : 'border-neutral-700'}`}>
                        {selectedChannels.Flyer && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-xs font-extrabold uppercase">Print Storefront Flyer</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">In-Store Visitors</span>
                  </label>
                </div>

                <div className="bg-[#050505] p-4 rounded-xl border border-neutral-900 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase font-semibold">Estimated Combined Reach</div>
                    <div className="text-2xl font-black text-white">{calculatedReach.toLocaleString()} <span className="text-xs font-bold text-neutral-400">Customers</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-emerald-400 font-bold uppercase">Tracking Enabled</div>
                    <div className="text-[10px] text-neutral-500 font-mono">100% Privacy Preserved</div>
                  </div>
                </div>

                <button
                  onClick={handleStartPromoting}
                  className="adshare-red-btn w-full py-4 rounded-xl text-xs font-black uppercase flex items-center justify-center space-x-2 shadow-xl shadow-red-600/30"
                >
                  <Megaphone className="w-5 h-5" />
                  <span>START PROMOTING THIS CAMPAIGN</span>
                </button>
              </>
            ) : (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-2xl font-black uppercase text-white">PROMOTION ACTIVATED!</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Your unique tracking code has been generated. Use the link below to share this campaign.
                  </p>
                </div>

                <div className="bg-[#050505] border border-neutral-800 p-4 rounded-xl text-left space-y-3">
                  <div className="text-xs font-bold text-neutral-400 uppercase">Your Unique Tracked Link</div>
                  <div className="flex items-center space-x-2 bg-black border border-red-600/40 p-3 rounded-lg">
                    <span className="text-xs font-mono text-white truncate flex-1">{generatedPromotedOffer.fullTrackingUrl}</span>
                    <button
                      onClick={() => copyToClipboard(generatedPromotedOffer.fullTrackingUrl)}
                      className="adshare-red-btn px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'COPIED' : 'COPY'}</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPromoForPromote(null)}
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs uppercase"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
