import React, { useState } from 'react';
import { useSCAData } from '../../context/SCADataContext';
import { Alliance, Category } from '../../types';
import {
  Grid,
  MapPin,
  Building2,
  CheckCircle2,
  Circle,
  Trash2,
  Share2,
  ArrowLeft,
  Search,
  AlertTriangle,
  Copy,
  Check,
  X,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const COUNTRY_FLAGS: Record<string, string> = {
  India: '🇮🇳',
  USA: '🇺🇸',
  UAE: '🇦🇪',
  UK: '🇬🇧',
  Singapore: '🇸🇬',
};

import { useAuth } from '../../context/AuthContext';

export const CategoriesAdmin: React.FC = () => {
  const { alliances, categories, clearCategoryExclusivity } = useSCAData();
  const { currentUser } = useAuth();

  const isAllianceAdmin = currentUser.role === 'ALLIANCE_ADMIN';
  const userAlliance = alliances.find((a) => a.id === (currentUser.allianceId || 'all_blr')) || alliances[0];

  const [selectedAlliance, setSelectedAlliance] = useState<Alliance | null>(isAllianceAdmin ? userAlliance : null);
  const [search, setSearch] = useState('');

  const activeAlliance = isAllianceAdmin ? userAlliance : selectedAlliance;

  // Modals state
  const [clearModalData, setClearModalData] = useState<{
    allianceId: string;
    allianceName: string;
    categoryId: string;
    categoryName: string;
    businessName: string;
  } | null>(null);

  const [promoteModalData, setPromoteModalData] = useState<{
    allianceName: string;
    categoryName: string;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);

  // Filter categories when an alliance is selected
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirmClear = () => {
    if (!clearModalData) return;
    clearCategoryExclusivity(clearModalData.allianceId, clearModalData.categoryId);
    setClearModalData(null);
  };

  const handleCopyInviteLink = (catName: string, allName: string) => {
    const text = `Join the ${allName}! The exclusive category slot for "${catName}" is currently open. Apply today before it gets taken: https://spincityalliance.com/signup`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans space-y-8">
      {/* Page Header */}
      {activeAlliance ? (
        <div className="space-y-4 border-b border-red-600/20 pb-6">
          {!isAllianceAdmin && (
            <button
              onClick={() => {
                setSelectedAlliance(null);
                setSearch('');
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-400 bg-red-950/40 border border-red-800/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to All Alliances
            </button>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-[#e50914] text-xs font-black uppercase tracking-wider mb-1">
                <span>{COUNTRY_FLAGS[activeAlliance.country] || '🌐'}</span>
                <span>{activeAlliance.city}, {activeAlliance.country} Alliance</span>
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-white">
                {activeAlliance.name} - Category Exclusivity
              </h1>
              <p className="text-sm text-neutral-400 mt-1">
                Manage category exclusivity locks and available slots for {activeAlliance.name}. Clear occupied slots to revoke member login or promote open categories.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0b0b0b] border border-neutral-800 text-white text-xs pl-9 pr-4 py-2.5 rounded-xl focus:border-red-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-600/20 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-[#e50914] text-xs font-black uppercase tracking-wider mb-1">
              <Grid className="w-4 h-4" />
              <span>Exclusivity Governance</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">
              CATEGORY EXCLUSIVITY MATRIX
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Select a city alliance to manage its category exclusivity locks, clear member representation, or share open category invites.
            </p>
          </div>
        </div>
      )}

      {/* VIEW 1: Alliance Selector Grid (National Admin only) */}
      {!activeAlliance && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alliances.map((alliance) => (
            <div
              key={alliance.id}
              onClick={() => {
                setSelectedAlliance(alliance);
                setSearch('');
              }}
              className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl p-6 hover:border-red-600/60 transition-all cursor-pointer group flex flex-col justify-between space-y-6 shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{COUNTRY_FLAGS[alliance.country] || '🌐'}</span>
                    <div>
                      <span className="text-[9px] font-black uppercase text-neutral-500 tracking-wider">
                        {alliance.city}, {alliance.country}
                      </span>
                      <h3 className="text-xl font-black text-white group-hover:text-red-500 transition-colors uppercase">
                        {alliance.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-[#050505] p-3 rounded-xl border border-neutral-900">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block">Occupied Categories</span>
                    <span className="text-lg font-black text-emerald-400">{alliance.occupiedCategoriesCount}</span>
                    <span className="text-[10px] text-neutral-400 block font-semibold">Locked Slots</span>
                  </div>

                  <div className="bg-[#050505] p-3 rounded-xl border border-neutral-900">
                    <span className="text-[10px] text-neutral-500 font-bold uppercase block">Open Categories</span>
                    <span className="text-lg font-black text-blue-400">
                      {alliance.totalCategoriesCount - alliance.occupiedCategoriesCount}
                    </span>
                    <span className="text-[10px] text-neutral-400 block font-semibold">Available</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-neutral-400">Exclusivity Occupancy Rate</span>
                    <span className="text-white">
                      {Math.round((alliance.occupiedCategoriesCount / alliance.totalCategoriesCount) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-red-600 h-full rounded-full"
                      style={{
                        width: `${(alliance.occupiedCategoriesCount / alliance.totalCategoriesCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-900 flex items-center justify-between text-xs font-bold text-neutral-300 group-hover:text-white">
                <span>Manage Exclusivity</span>
                <span className="text-red-500 font-black">Select Alliance →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: Category Exclusivity Table for Selected Alliance */}
      {activeAlliance && (
        <div className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#050505] border-b border-neutral-800 text-neutral-400 font-black uppercase tracking-wider">
                  <th className="py-4 px-6">Category Name</th>
                  <th className="py-4 px-6">Exclusivity Status</th>
                  <th className="py-4 px-6">Occupying Member Business</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {filteredCategories.map((cat) => {
                  const statusObj = cat.allianceMap[activeAlliance.id];
                  const isOccupied = statusObj && statusObj.status === 'OCCUPIED';
                  const bizName = isOccupied && statusObj.businessName ? statusObj.businessName : null;

                  return (
                    <tr key={cat.id} className="hover:bg-neutral-900/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-white text-sm">{cat.name}</div>
                        <div className="text-[11px] text-neutral-400 line-clamp-1 max-w-md mt-0.5">
                          {cat.description}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        {isOccupied ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 text-emerald-400 font-extrabold rounded-full text-[10px] border border-emerald-800/40 uppercase">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Locked & Occupied
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-950/60 text-blue-400 font-extrabold rounded-full text-[10px] border border-blue-800/40 uppercase">
                            <Circle className="w-3 h-3 text-blue-400" /> Open Slot
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {isOccupied ? (
                          <div className="font-bold text-white text-xs flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-red-500" />
                            <span>{bizName}</span>
                          </div>
                        ) : (
                          <span className="text-neutral-500 italic text-xs">— Unoccupied —</span>
                        )}
                      </td>

                      {/* NEW ACTIONS COLUMN */}
                      <td className="py-4 px-6 text-right">
                        {isOccupied ? (
                          <button
                            onClick={() =>
                              setClearModalData({
                                allianceId: activeAlliance.id,
                                allianceName: activeAlliance.name,
                                categoryId: cat.id,
                                categoryName: cat.name,
                                businessName: bizName || 'Active Member',
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/50 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/60 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Clear Category
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setPromoteModalData({
                                allianceName: activeAlliance.name,
                                categoryName: cat.name,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-950/50 hover:bg-blue-900 text-blue-300 hover:text-white border border-blue-800/60 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" /> Promote Category
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONFIRM CLEAR CATEGORY MODAL */}
      {clearModalData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-rose-600/40 rounded-2xl max-w-md w-full p-6 space-y-5 relative text-neutral-100 shadow-2xl">
            <button
              onClick={() => setClearModalData(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-rose-500">
              <div className="w-10 h-10 rounded-full bg-rose-950/60 border border-rose-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-black uppercase text-white">Clear Category Exclusivity?</h3>
                <p className="text-[11px] text-rose-400 font-semibold">{clearModalData.categoryName} • {clearModalData.allianceName}</p>
              </div>
            </div>

            <div className="bg-[#050505] p-4 rounded-xl border border-neutral-900 text-xs text-neutral-300 leading-relaxed">
              This will revoke the business login and membership access for{' '}
              <strong className="text-white">{clearModalData.businessName}</strong> under the category{' '}
              <strong className="text-white">{clearModalData.categoryName}</strong>. Do you wish to continue?
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setClearModalData(null)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-rose-600/30"
              >
                Confirm & Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROMOTE CATEGORY MODAL */}
      {promoteModalData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-blue-600/40 rounded-2xl max-w-md w-full p-6 space-y-5 relative text-neutral-100 shadow-2xl">
            <button
              onClick={() => {
                setPromoteModalData(null);
                setCopiedLink(false);
              }}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-blue-400">
              <div className="w-10 h-10 rounded-full bg-blue-950/60 border border-blue-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-black uppercase text-white">Promote Category Slot</h3>
                <p className="text-[11px] text-blue-400 font-semibold">{promoteModalData.categoryName} • {promoteModalData.allianceName}</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Invite top-tier local business leaders to claim the category exclusivity slot for{' '}
              <strong className="text-white">{promoteModalData.categoryName}</strong> in{' '}
              <strong className="text-white">{promoteModalData.allianceName}</strong> before it gets locked.
            </p>

            <div className="bg-[#050505] p-3.5 rounded-xl border border-neutral-900 space-y-2">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">Shareable Application Link</span>
              <div className="flex items-center justify-between bg-[#0b0b0b] border border-neutral-800 p-2 rounded-lg text-xs font-mono text-neutral-300">
                <span className="truncate">https://spincityalliance.com/signup</span>
                <button
                  onClick={() => handleCopyInviteLink(promoteModalData.categoryName, promoteModalData.allianceName)}
                  className="ml-2 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold uppercase transition-colors shrink-0 flex items-center gap-1"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedLink ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setPromoteModalData(null);
                  setCopiedLink(false);
                }}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
