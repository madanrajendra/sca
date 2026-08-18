import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import type { AdSharePromotion, PromotedOffer } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Sparkles,
  Search,
  Share2,
  Copy,
  Check,
  Users,
  MousePointerClick,
  Tag,
} from 'lucide-react';

export const AdShareMarketplace: React.FC = () => {
  const { currentUser } = useAuth();
  const { promotions, businesses, promoteOffer, simulateAdClick } = useSCAData();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Promotion details / Promote modal state
  const [selectedPromo, setSelectedPromo] = useState<AdSharePromotion | null>(null);
  const [activePromotedObj, setActivePromotedObj] = useState<PromotedOffer | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [clickSimulatedCount, setClickSimulatedCount] = useState(0);

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];

  // Filter live promotions
  const livePromotions = promotions.filter((p) => {
    if (p.status !== 'LIVE') return false;
    if (selectedCategory !== 'ALL' && p.categoryName !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.businessName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.offer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categoriesList = Array.from(new Set(promotions.map((p) => p.categoryName)));

  const handlePromoteClick = (promo: AdSharePromotion) => {
    setSelectedPromo(promo);
    const promoted = promoteOffer(promo.id, activeBiz.id, activeBiz.name, currentUser.id);
    setActivePromotedObj(promoted);
    setClickSimulatedCount(promoted.clicks);
  };

  const copyToClipboard = (text: string, type: 'link' | 'msg') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  const handleSimulateClick = () => {
    if (activePromotedObj) {
      simulateAdClick(activePromotedObj.trackingCode);
      setClickSimulatedCount((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AdShare Marketplace Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Alliance Co-Marketing Hub
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Promote complementary member offers to your clients and network. Generate unique tracking links, track engagement, and build cross-alliance goodwill.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 shrink-0">
          <div className="text-center px-3 border-r border-white/20">
            <p className="text-[10px] text-slate-300 uppercase font-semibold">Active Offers</p>
            <p className="text-xl font-bold text-white">{livePromotions.length}</p>
          </div>
          <div className="text-center px-3">
            <p className="text-[10px] text-slate-300 uppercase font-semibold">Members Sharing</p>
            <p className="text-xl font-bold text-emerald-400">18</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, business, or offer details..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 cursor-pointer transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {livePromotions.map((promo) => {
          const isOwnPromo = promo.businessId === activeBiz.id;

          return (
            <Card key={promo.id} hover className="flex flex-col justify-between">
              {/* Image & Header */}
              <div>
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={promo.imageUrl}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="purple" size="sm">
                      {promo.categoryName}
                    </Badge>
                  </div>
                  {isOwnPromo && (
                    <div className="absolute top-3 right-3 bg-slate-900/90 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                      Your Promotion
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {/* Business Badge */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <img
                      src={promo.businessLogo}
                      alt={promo.businessName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{promo.businessName}</h4>
                      <p className="text-[10px] text-slate-500">Bangalore Alliance Member</p>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                    {promo.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {promo.shortDescription}
                  </p>

                  {/* Offer Pill */}
                  <div className="mt-4 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs font-semibold flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{promo.offer}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" /> {promo.membersPromotingCount} promoting
                  </span>
                </div>

                <Button
                  size="sm"
                  variant={isOwnPromo ? 'outline' : 'primary'}
                  onClick={() => handlePromoteClick(promo)}
                  leftIcon={<Share2 className="w-3.5 h-3.5" />}
                >
                  {isOwnPromo ? 'View Share Hub' : 'Promote This'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Promote Modal & Unique Link Generator */}
      {selectedPromo && activePromotedObj && (
        <Modal
          isOpen={!!selectedPromo}
          onClose={() => setSelectedPromo(null)}
          title={`Promote: ${selectedPromo.title}`}
          subtitle={`Promoted by ${activeBiz.name} for ${selectedPromo.businessName}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            {/* Promo Overview Banner */}
            <div className="p-4 bg-slate-900 text-white rounded-xl flex items-start gap-4">
              <img
                src={selectedPromo.imageUrl}
                alt={selectedPromo.title}
                className="w-20 h-20 rounded-lg object-cover border border-slate-700 shrink-0"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                  {selectedPromo.categoryName}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">{selectedPromo.title}</h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{selectedPromo.description}</p>
                <div className="mt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> {selectedPromo.offer}
                </div>
              </div>
            </div>

            {/* Generated Unique Tracking Link Section */}
            <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Your Unique Alliance Tracking Link
                </span>
                <span className="text-[11px] text-blue-700 font-medium">Attributed to {activeBiz.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={activePromotedObj.fullTrackingUrl}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-blue-300 rounded-lg text-slate-900 font-bold"
                />
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(activePromotedObj.fullTrackingUrl, 'link')}
                  leftIcon={copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                >
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </Button>
              </div>

              {/* Pre-written Copy Message */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Ready-to-Share Headline & Message
                </label>
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 space-y-1">
                  <p className="font-bold text-slate-900">{selectedPromo.shareHeadline}</p>
                  <p className="text-slate-600">{selectedPromo.shareMessage}</p>
                  <p className="font-mono text-blue-600 text-[11px] mt-1">{activePromotedObj.fullTrackingUrl}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(
                        `${selectedPromo.shareHeadline}\n\n${selectedPromo.shareMessage}\n\n${activePromotedObj.fullTrackingUrl}`,
                        'msg'
                      )
                    }
                    leftIcon={copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {copiedMessage ? 'Message Copied!' : 'Copy Share Message'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Interactive Live Click Simulator */}
            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <MousePointerClick className="w-4 h-4 text-purple-600" /> Live Click Simulation Test
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Test the real-time link tracking system right now.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Simulated Clicks</span>
                  <p className="text-lg font-bold text-purple-700">{clickSimulatedCount}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={handleSimulateClick}>
                  Simulate Click (+1)
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
