import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSCAData } from '../../context/SCADataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import type { Business } from '../../types';
import { Search, MapPin, Grid, Phone, Globe, Tag, ExternalLink, Sparkles, Mail, Building2 } from 'lucide-react';

export const BusinessDirectory: React.FC = () => {
  const { businesses, promotions } = useSCAData();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedServiceArea, setSelectedServiceArea] = useState('ALL');
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null);

  // Active alliance members only
  const activeMembers = businesses.filter((b) => b.membershipStatus === 'ACTIVE');

  const filteredMembers = activeMembers.filter((b) => {
    if (selectedCategory !== 'ALL' && b.categoryName !== selectedCategory) return false;
    if (selectedServiceArea !== 'ALL' && b.serviceArea !== selectedServiceArea) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.ownerName.toLowerCase().includes(q) ||
        b.categoryName.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categoryOptions = Array.from(new Set(activeMembers.map((b) => b.categoryName)));
  const serviceAreaOptions = Array.from(new Set(activeMembers.map((b) => b.serviceArea)));

  // Get active promotions for a business
  const getBizPromotions = (bizId: string) => {
    return promotions.filter((p) => p.businessId === bizId && p.status === 'LIVE');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
            Alliance Network Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">Business Directory</h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            Connect with verified, category-exclusive business leaders in your alliance.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search businesses..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          {/* Service Area Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500">Service Area:</span>
            <select
              value={selectedServiceArea}
              onChange={(e) => setSelectedServiceArea(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-800 focus:ring-2 focus:ring-slate-900"
            >
              <option value="ALL">All Service Areas</option>
              {serviceAreaOptions.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
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
          {categoryOptions.map((cat) => (
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

      {/* Member Business Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((biz) => {
            const bizPromos = getBizPromotions(biz.id);

            return (
              <Card key={biz.id} hover className="flex flex-col justify-between p-5 space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img src={biz.logo} alt={biz.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{biz.name}</h3>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Grid className="w-3.5 h-3.5 text-blue-600" /> {biz.categoryName}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">{biz.description}</p>

                  {/* Current Offer Pill */}
                  {biz.currentOffer ? (
                    <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs font-medium flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{biz.currentOffer}</span>
                    </div>
                  ) : (
                    <div className="mt-3 p-2 text-slate-400 text-xs italic">No current offers</div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">Owner: {biz.ownerName}</span>
                  <Button size="sm" variant="outline" onClick={() => setSelectedBiz(biz)}>
                    View Profile
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty Directory State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No businesses found.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Try adjusting your category or service area search filters.
          </p>
          <Button onClick={() => { setSearch(''); setSelectedCategory('ALL'); setSelectedServiceArea('ALL'); }} variant="outline">
            Reset Search Filters
          </Button>
        </div>
      )}

      {/* BUSINESS PROFILE MODAL */}
      {selectedBiz && (
        <Modal
          isOpen={!!selectedBiz}
          onClose={() => setSelectedBiz(null)}
          title={selectedBiz.name}
          subtitle={`Category Leader: ${selectedBiz.categoryName}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Header Banner */}
            <div className="flex items-center gap-4 p-4 bg-slate-900 text-white rounded-xl">
              <img src={selectedBiz.logo} alt={selectedBiz.name} className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white">{selectedBiz.name}</h3>
                <p className="text-xs text-blue-400 font-semibold">{selectedBiz.categoryName} • {selectedBiz.allianceName}</p>
                <p className="text-xs text-slate-300 mt-1">Owner: {selectedBiz.ownerName} ({selectedBiz.ownerEmail})</p>
              </div>
            </div>

            {/* Contact & Web Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                <a href={selectedBiz.website} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline truncate">
                  {selectedBiz.website}
                </a>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{selectedBiz.phone}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Service Area: <strong>{selectedBiz.serviceArea}</strong></span>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">About Business</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {selectedBiz.description}
              </p>
            </div>

            {/* Current Offer */}
            {selectedBiz.currentOffer && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900 text-xs font-semibold">
                <Tag className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block text-[11px]">Current Alliance Offer:</span>
                  <span>{selectedBiz.currentOffer}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => window.open(`mailto:${selectedBiz.ownerEmail}`)}
                leftIcon={<Mail className="w-4 h-4" />}
              >
                Contact Owner
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedBiz(null);
                    navigate('/app/adshare');
                  }}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  View Promotions
                </Button>
                <Button
                  variant="primary"
                  onClick={() => window.open(selectedBiz.website, '_blank')}
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                >
                  Visit Website
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
