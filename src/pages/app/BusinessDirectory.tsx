import React, { useState } from 'react';
import { useSCAData } from '../../context/SCADataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import type { Business } from '../../types';
import { Search, MapPin, Grid, Phone, Globe, Tag } from 'lucide-react';

export const BusinessDirectory: React.FC = () => {
  const { businesses } = useSCAData();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null);

  // Active alliance members only
  const activeMembers = businesses.filter((b) => b.membershipStatus === 'ACTIVE');

  const filteredMembers = activeMembers.filter((b) => {
    if (selectedCategory !== 'ALL' && b.categoryName !== selectedCategory) return false;
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Private Business Directory</h1>
        <p className="text-xs text-slate-500 mt-1">
          Exclusive catalog of verified, category-exclusive business leaders in Bangalore Alliance.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by business name, category, or owner..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 cursor-pointer ${
              selectedCategory === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 cursor-pointer ${
                selectedCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Member Business Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((biz) => (
          <Card key={biz.id} hover className="flex flex-col justify-between p-5 space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={biz.logo} alt={biz.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{biz.name}</h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Grid className="w-3 h-3 text-blue-600" /> {biz.categoryName}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">{biz.description}</p>

              {biz.currentOffer && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{biz.currentOffer}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Owner: {biz.ownerName}</span>
              <Button size="sm" variant="outline" onClick={() => setSelectedBiz(biz)}>
                View Profile
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Business Details Modal */}
      {selectedBiz && (
        <Modal
          isOpen={!!selectedBiz}
          onClose={() => setSelectedBiz(null)}
          title={selectedBiz.name}
          subtitle={`Category Leader: ${selectedBiz.categoryName}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-900 text-white rounded-xl">
              <img src={selectedBiz.logo} alt={selectedBiz.name} className="w-16 h-16 rounded-xl object-cover border border-slate-700" />
              <div>
                <h3 className="text-base font-bold text-white">{selectedBiz.name}</h3>
                <p className="text-xs text-blue-400">{selectedBiz.categoryName} • {selectedBiz.allianceName}</p>
                <p className="text-xs text-slate-400 mt-1">Owner: {selectedBiz.ownerName} ({selectedBiz.ownerEmail})</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <a href={selectedBiz.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  {selectedBiz.website}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{selectedBiz.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Service Area: {selectedBiz.serviceArea}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">About Company</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {selectedBiz.description}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
