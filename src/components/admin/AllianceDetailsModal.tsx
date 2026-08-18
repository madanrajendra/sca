import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useSCAData } from '../../context/SCADataContext';
import type { Alliance } from '../../types';
import { MapPin, Users, Grid, Sparkles, Handshake, Globe, Calendar, CheckCircle2 } from 'lucide-react';

interface AllianceDetailsModalProps {
  alliance: Alliance | null;
  onClose: () => void;
}

export const AllianceDetailsModal: React.FC<AllianceDetailsModalProps> = ({
  alliance,
  onClose,
}) => {
  if (!alliance) return null;

  const { businesses, categories, promotions, referrals } = useSCAData();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MEMBERS' | 'CATEGORIES' | 'PROMOTIONS' | 'REFERRALS'>('OVERVIEW');

  const allianceMembers = businesses.filter((b) => b.allianceId === alliance.id);
  const alliancePromos = promotions.filter((p) => p.allianceId === alliance.id);
  const allianceReferrals = referrals.filter((r) => r.allianceId === alliance.id);

  return (
    <Modal
      isOpen={!!alliance}
      onClose={onClose}
      title={alliance.name}
      subtitle={`${alliance.city}, ${alliance.country} • Created: ${alliance.createdDate}`}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {['OVERVIEW', 'MEMBERS', 'CATEGORIES', 'PROMOTIONS', 'REFERRALS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 cursor-pointer transition-all ${
                activeTab === tab ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Active Members</span>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{allianceMembers.length}</p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] text-emerald-700 font-bold uppercase">Occupied Categories</span>
                <p className="text-xl font-bold text-emerald-900 mt-0.5">{alliance.occupiedCategoriesCount}</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="text-[10px] text-blue-700 font-bold uppercase">Available Categories</span>
                <p className="text-xl font-bold text-blue-900 mt-0.5">
                  {alliance.totalCategoriesCount - alliance.occupiedCategoriesCount}
                </p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                <span className="text-[10px] text-purple-700 font-bold uppercase">Live Promotions</span>
                <p className="text-xl font-bold text-purple-900 mt-0.5">{alliancePromos.length}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <h4 className="font-bold text-slate-900">Alliance Information</h4>
              <p className="text-slate-600">Operating City: {alliance.city}, {alliance.state}</p>
              <p className="text-slate-600">Country: {alliance.country}</p>
              <p className="text-slate-600">Exclusivity Capacity: {alliance.totalCategoriesCount} Categories Max</p>
            </div>
          </div>
        )}

        {/* MEMBERS TAB */}
        {activeTab === 'MEMBERS' && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allianceMembers.map((m) => (
              <div key={m.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={m.logo} alt={m.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <p className="font-bold text-slate-900">{m.name}</p>
                    <p className="text-[10px] text-slate-500">{m.categoryName} • Owner: {m.ownerName}</p>
                  </div>
                </div>
                <Badge status={m.membershipStatus} size="sm" />
              </div>
            ))}
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'CATEGORIES' && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categories.map((c) => {
              const statusObj = c.allianceMap[alliance.id];
              const isOccupied = statusObj && statusObj.status === 'OCCUPIED';

              return (
                <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{c.name}</p>
                    <p className="text-[10px] text-slate-500">{c.description}</p>
                  </div>
                  {isOccupied ? (
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                      ● Occupied ({statusObj.businessName})
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-full text-[10px]">
                      ○ Open
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* PROMOTIONS TAB */}
        {activeTab === 'PROMOTIONS' && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alliancePromos.map((p) => (
              <div key={p.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{p.title}</p>
                  <p className="text-[10px] text-slate-500">{p.businessName} • {p.categoryName}</p>
                </div>
                <Badge status={p.status} size="sm" />
              </div>
            ))}
          </div>
        )}

        {/* REFERRALS TAB */}
        {activeTab === 'REFERRALS' && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allianceReferrals.map((r) => (
              <div key={r.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{r.customerName}</p>
                  <p className="text-[10px] text-slate-500">{r.senderBusinessName} ➔ {r.receiverBusinessName}</p>
                </div>
                <Badge status={r.status} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
