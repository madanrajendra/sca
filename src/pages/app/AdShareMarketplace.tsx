import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Plus,
  Filter,
  Calendar,
  Building2,
  MapPin,
  Bookmark,
  ExternalLink,
  Eye,
} from 'lucide-react';

export const AdShareMarketplace: React.FC = () => {
  const { currentUser } = useAuth();
  const { promotions, businesses, promoteOffer, simulateAdClick } = useSCAData();
  const navigate = useNavigate();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];

  // Search, Filter & Sort states
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedBusiness, setSelectedBusiness] = useState<string>('ALL');
  const [selectedServiceArea, setSelectedServiceArea] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'POPULAR' | 'EXPIRING'>('NEWEST');

  // Modals state
  const [selectedPromoForDetail, setSelectedPromoForDetail] = useState<AdSharePromotion | null>(null);
  const [selectedPromoForShare, setSelectedPromoForShare] = useState<AdSharePromotion | null>(null);
  const [activePromotedObj, setActivePromotedObj] = useState<PromotedOffer | null>(null);
  const [savedPromos, setSavedPromos] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Extract unique filter options
  const categoriesList = Array.from(new Set(promotions.map((p) => p.categoryName)));
  const businessList = Array.from(new Set(promotions.map((p) => p.businessName)));

  // Filter & Sort promotions
  const livePromotions = promotions
    .filter((p) => {
      if (p.status !== 'LIVE') return false;
      if (selectedCategory !== 'ALL' && p.categoryName !== selectedCategory) return false;
      if (selectedBusiness !== 'ALL' && p.businessName !== selectedBusiness) return false;
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
    })
    .sort((a, b) => {
      if (sortBy === 'POPULAR') return b.membersPromotingCount - a.membersPromotingCount;
      if (sortBy === 'EXPIRING') return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // NEWEST
    });

  const handlePromoteClick = (promo: AdSharePromotion) => {
    setSelectedPromoForDetail(null);
    setSelectedPromoForShare(promo);
    const promoted = promoteOffer(promo.id, activeBiz.id, activeBiz.name, currentUser.id);
    setActivePromotedObj(promoted);
  };

  const toggleSavePromo = (id: string) => {
    setSavedPromos((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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

  // Native Web Share API trigger with fallback
  const handleNativeShare = async (promo: AdSharePromotion, trackingUrl: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: promo.shareHeadline,
          text: promo.shareMessage,
          url: trackingUrl,
        });
      } catch (err) {
        copyToClipboard(`${promo.shareHeadline}\n${promo.shareMessage}\n${trackingUrl}`, 'msg');
      }
    } else {
      copyToClipboard(`${promo.shareHeadline}\n${promo.shareMessage}\n${trackingUrl}`, 'msg');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-950 px-2.5 py-1 rounded border border-purple-800">
            AdShare Marketplace
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-2">
            Alliance Co-Marketing Engine
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            Discover promotions from businesses in your alliance and share them with your audience.
          </p>
        </div>

        <Button
          onClick={() => navigate('/app/promotions/create')}
          variant="secondary"
          size="lg"
          leftIcon={<Plus className="w-5 h-5" />}
          className="shrink-0 relative z-10"
        >
          + Create Promotion
        </Button>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search promotions..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-800 focus:ring-2 focus:ring-slate-900"
            >
              <option value="NEWEST">Newest First</option>
              <option value="POPULAR">Most Popular</option>
              <option value="EXPIRING">Expiring Soon</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 cursor-pointer transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
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
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Promotion Cards Grid */}
      {livePromotions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {livePromotions.map((promo) => {
            const isSaved = savedPromos.includes(promo.id);

            return (
              <Card key={promo.id} hover className="flex flex-col justify-between overflow-hidden">
                <div>
                  {/* Creative Image */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
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

                    <button
                      onClick={() => toggleSavePromo(promo.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                        isSaved ? 'bg-amber-500 text-white' : 'bg-slate-900/60 text-white hover:bg-slate-900'
                      }`}
                      title={isSaved ? 'Saved' : 'Save Promotion'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-5">
                    {/* Business Info Header */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <img
                        src={promo.businessLogo}
                        alt={promo.businessName}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{promo.businessName}</h4>
                        <p className="text-[10px] text-slate-500 truncate">Bangalore Alliance Member</p>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug line-clamp-2">
                      {promo.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {promo.shortDescription}
                    </p>

                    {/* Offer Pill */}
                    <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs font-semibold flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{promo.offer}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>{promo.membersPromotingCount} members promoting</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedPromoForDetail(promo)}
                    >
                      View Promotion
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handlePromoteClick(promo)}
                      leftIcon={<Share2 className="w-3.5 h-3.5" />}
                    >
                      Promote
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No promotions available yet.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Be the first business owner to publish a co-marketing campaign for your alliance.
          </p>
          <Button onClick={() => navigate('/app/promotions/create')} leftIcon={<Plus className="w-4 h-4" />}>
            Create First Promotion
          </Button>
        </div>
      )}

      {/* PROMOTION DETAILS MODAL */}
      {selectedPromoForDetail && (
        <Modal
          isOpen={!!selectedPromoForDetail}
          onClose={() => setSelectedPromoForDetail(null)}
          title={selectedPromoForDetail.title}
          subtitle={`By ${selectedPromoForDetail.businessName} • ${selectedPromoForDetail.categoryName}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Large Creative Image */}
            <div className="relative h-60 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={selectedPromoForDetail.imageUrl}
                alt={selectedPromoForDetail.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge variant="purple">{selectedPromoForDetail.categoryName}</Badge>
              </div>
            </div>

            {/* Business Info Header */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPromoForDetail.businessLogo}
                  alt={selectedPromoForDetail.businessName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-300"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedPromoForDetail.businessName}</h4>
                  <p className="text-xs text-slate-500">Verified Alliance Category Leader</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Valid until {selectedPromoForDetail.endDate}
              </span>
            </div>

            {/* Full Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Promotion Description</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                {selectedPromoForDetail.description}
              </p>
            </div>

            {/* Exclusive Offer Pill */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900 text-xs font-semibold">
              <Tag className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block text-[11px]">Exclusive Member Benefit:</span>
                <span>{selectedPromoForDetail.offer}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => toggleSavePromo(selectedPromoForDetail.id)}
                leftIcon={<Bookmark className="w-4 h-4" />}
              >
                {savedPromos.includes(selectedPromoForDetail.id) ? 'Saved' : 'Save'}
              </Button>

              <Button
                variant="primary"
                size="lg"
                onClick={() => handlePromoteClick(selectedPromoForDetail)}
                leftIcon={<Share2 className="w-4 h-4" />}
              >
                Promote This
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* SHARE PANEL MODAL */}
      {selectedPromoForShare && activePromotedObj && (
        <Modal
          isOpen={!!selectedPromoForShare}
          onClose={() => setSelectedPromoForShare(null)}
          title={`Promote: ${selectedPromoForShare.title}`}
          subtitle={`Promoting on behalf of ${selectedPromoForShare.businessName}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Promo Preview Banner */}
            <div className="p-4 bg-slate-900 text-white rounded-xl flex items-start gap-4">
              <img
                src={selectedPromoForShare.imageUrl}
                alt={selectedPromoForShare.title}
                className="w-16 h-16 rounded-lg object-cover border border-slate-700 shrink-0"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400">{selectedPromoForShare.categoryName}</span>
                <h4 className="text-xs font-bold text-white mt-0.5">{selectedPromoForShare.title}</h4>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">{selectedPromoForShare.offer}</p>
              </div>
            </div>

            {/* Generated Unique Link */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" /> Your Unique Tracking Link
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={activePromotedObj.fullTrackingUrl}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-blue-300 rounded-lg font-bold text-slate-900"
                />
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(activePromotedObj.fullTrackingUrl, 'link')}
                  leftIcon={copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                >
                  {copiedLink ? 'Copied' : 'Copy Link'}
                </Button>
              </div>
            </div>

            {/* Ready Share Message */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Ready-to-Share Message</label>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <p className="font-bold text-slate-900">{selectedPromoForShare.shareHeadline}</p>
                <p className="text-slate-600">{selectedPromoForShare.shareMessage}</p>
                <p className="font-mono text-blue-600 font-bold text-[11px] mt-1">{activePromotedObj.fullTrackingUrl}</p>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(
                      `${selectedPromoForShare.shareHeadline}\n\n${selectedPromoForShare.shareMessage}\n\n${activePromotedObj.fullTrackingUrl}`,
                      'msg'
                    )
                  }
                  leftIcon={copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {copiedMessage ? 'Message Copied!' : 'Copy Message'}
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleNativeShare(selectedPromoForShare, activePromotedObj.fullTrackingUrl)}
                  leftIcon={<Share2 className="w-3.5 h-3.5" />}
                >
                  Share Post
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
