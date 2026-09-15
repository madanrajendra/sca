import React, { useState } from 'react';
import { useSCAData } from '../../context/SCADataContext';
import { Alliance, Business } from '../../types';
import { getOwnerAvatar } from '../../utils/avatars';
import {
  Globe,
  Search,
  Building2,
  Users,
  Grid,
  MapPin,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Mail,
  Phone,
  ExternalLink,
  X,
  BookOpen,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const COUNTRY_FLAGS: Record<string, string> = {
  India: '🇮🇳',
  USA: '🇺🇸',
  UAE: '🇦🇪',
  UK: '🇬🇧',
  Singapore: '🇸🇬',
};

export const NationalDirectoryPage: React.FC = () => {
  const { alliances, businesses } = useSCAData();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedAlliance, setSelectedAlliance] = useState<Alliance | null>(null);
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null);

  // Filter alliances for main directory view
  const filteredAlliances = alliances.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase()) ||
      a.country.toLowerCase().includes(search.toLowerCase());
    
    if (selectedRegion === 'ALL') return matchesSearch;
    if (selectedRegion === 'ASIA') return matchesSearch && a.country === 'India';
    if (selectedRegion === 'AMERICAS') return matchesSearch && a.country === 'USA';
    if (selectedRegion === 'MEA') return matchesSearch && a.country === 'UAE';
    return matchesSearch;
  });

  // Filter businesses inside selected alliance
  const allianceBusinesses = selectedAlliance
    ? businesses.filter((b) => b.allianceId === selectedAlliance.id && b.membershipStatus === 'ACTIVE')
    : [];

  const filteredAllianceBusinesses = allianceBusinesses.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.categoryName.toLowerCase().includes(search.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans space-y-8">
      {/* Dynamic Header */}
      {selectedAlliance ? (
        <div className="space-y-4 border-b border-red-600/20 pb-6">
          <button
            onClick={() => {
              setSelectedAlliance(null);
              setSearch('');
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-400 bg-red-950/40 border border-red-800/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to International Directory
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-[#e50914] text-xs font-black uppercase tracking-wider mb-1">
                <span>{COUNTRY_FLAGS[selectedAlliance.country] || '🌐'}</span>
                <span>{selectedAlliance.city}, {selectedAlliance.country} Alliance</span>
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-white">
                {selectedAlliance.name}
              </h1>
              <p className="text-sm text-neutral-400 mt-1">
                Member Directory & Category Exclusivity Map for {selectedAlliance.city}. Click on any member business for profile and feed access.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search businesses in ${selectedAlliance.city}...`}
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
              <Globe className="w-4 h-4" />
              <span>Global Master Directory</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">
              NATIONAL & INTERNATIONAL DIRECTORY
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              National Admin view: Browse Spin City Alliances worldwide. Select an alliance to drill into its member businesses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex bg-[#0b0b0b] p-1 rounded-xl border border-neutral-800 text-xs font-bold">
              <button
                onClick={() => setSelectedRegion('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedRegion === 'ALL' ? 'bg-[#e50914] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Regions
              </button>
              <button
                onClick={() => setSelectedRegion('ASIA')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedRegion === 'ASIA' ? 'bg-[#e50914] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                🇮🇳 Asia
              </button>
              <button
                onClick={() => setSelectedRegion('AMERICAS')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedRegion === 'AMERICAS' ? 'bg-[#e50914] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                🇺🇸 Americas
              </button>
              <button
                onClick={() => setSelectedRegion('MEA')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedRegion === 'MEA' ? 'bg-[#e50914] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                🇦🇪 Middle East
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search alliances or cities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0b0b0b] border border-neutral-800 text-white text-xs pl-9 pr-4 py-2.5 rounded-xl focus:border-red-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main View 1: List of Alliances */}
      {!selectedAlliance && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlliances.map((alliance) => {
            const allianceBizList = businesses.filter((b) => b.allianceId === alliance.id);
            const activeCount = allianceBizList.filter((b) => b.membershipStatus === 'ACTIVE').length;

            return (
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
                    <div className="flex items-center gap-2">
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

                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800 uppercase">
                      ● ACTIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-[#050505] p-3 rounded-xl border border-neutral-900">
                      <span className="text-[10px] text-neutral-500 font-bold uppercase block">Active Members</span>
                      <span className="text-lg font-black text-white">{activeCount}</span>
                      <span className="text-[10px] text-neutral-400 block font-semibold">Businesses</span>
                    </div>

                    <div className="bg-[#050505] p-3 rounded-xl border border-neutral-900">
                      <span className="text-[10px] text-neutral-500 font-bold uppercase block">Categories</span>
                      <span className="text-lg font-black text-emerald-400">{alliance.occupiedCategoriesCount}</span>
                      <span className="text-[10px] text-neutral-400 block font-semibold">/ {alliance.totalCategoriesCount} Slots</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-neutral-400">Category Occupancy Rate</span>
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
                  <span>Explore Alliance Businesses</span>
                  <div className="w-8 h-8 rounded-full bg-neutral-900 group-hover:bg-[#e50914] text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main View 2: Businesses inside Selected Alliance */}
      {selectedAlliance && (
        <div className="space-y-6">
          <div className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-xl">
                {COUNTRY_FLAGS[selectedAlliance.country] || '🌐'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white uppercase">{selectedAlliance.name} Directory</h2>
                <p className="text-xs text-neutral-400">
                  Showing {filteredAllianceBusinesses.length} active business members in {selectedAlliance.city}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-3 py-1 bg-neutral-900 rounded-lg text-neutral-300 border border-neutral-800">
                Total Members: {allianceBusinesses.length}
              </span>
              <span className="px-3 py-1 bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 rounded-lg">
                Exclusive Slots Occupied: {selectedAlliance.occupiedCategoriesCount}
              </span>
            </div>
          </div>

          {filteredAllianceBusinesses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAllianceBusinesses.map((biz) => (
                <div
                  key={biz.id}
                  className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl overflow-hidden hover:border-[#e50914]/50 transition-all flex flex-col justify-between"
                >
                  {/* Top Owner Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#050505] border-b border-neutral-900">
                    <img
                      src={getOwnerAvatar(biz.id)}
                      alt={biz.ownerName}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  <div className="h-1 bg-[#e50914] w-full" />

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">
                          {biz.ownerName}
                        </h3>
                        <span className="text-[8px] bg-[#e50914]/10 text-[#e50914] border border-[#e50914]/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                          {biz.categoryName}
                        </span>
                      </div>

                      <div className="text-xs text-red-500 font-bold uppercase tracking-tight flex items-center space-x-1.5 mt-1.5">
                        <img src={biz.logo} alt={biz.name} className="w-3.5 h-3.5 rounded object-cover border border-neutral-800" />
                        <span>{biz.name}</span>
                      </div>

                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3 pt-1">
                        {biz.description}
                      </p>
                    </div>

                    {/* Contact Buttons */}
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
                        title="LinkedIn"
                      >
                        <LinkedinIcon className="w-4 h-4 text-red-500" />
                      </a>
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded bg-[#e50914]/10 hover:bg-[#e50914]/20 border border-[#e50914]/30 text-white flex items-center justify-center transition-colors"
                        title="Facebook"
                      >
                        <FacebookIcon className="w-4 h-4 text-red-500" />
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-900">
                      <button
                        onClick={() => setSelectedBiz(biz)}
                        className="py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-bold rounded-xl text-[10px] uppercase transition-colors"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => navigate(`/app/feed/${biz.id}`)}
                        className="py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-[10px] uppercase transition-colors"
                      >
                        Feed
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-neutral-500 bg-[#0b0b0b] rounded-2xl border border-dashed border-neutral-800">
              <CheckCircle2 className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
              No active business members found matching your search in {selectedAlliance.name}.
            </div>
          )}
        </div>
      )}

      {/* Business Details Modal */}
      {selectedBiz && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-red-600/40 rounded-2xl max-w-xl w-full p-6 space-y-6 relative text-neutral-100">
            <button
              onClick={() => setSelectedBiz(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4">
              <img
                src={getOwnerAvatar(selectedBiz.id)}
                alt={selectedBiz.ownerName}
                className="w-20 h-20 rounded-full object-cover border-2 border-red-600/40 shrink-0"
              />
              <div>
                <span className="text-[9px] bg-[#e50914]/10 text-[#e50914] border border-[#e50914]/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  {selectedBiz.categoryName}
                </span>
                <h2 className="text-xl font-black uppercase text-white mt-1.5 leading-none">
                  {selectedBiz.ownerName}
                </h2>
                <div className="flex items-center space-x-2 mt-2">
                  <img src={selectedBiz.logo} alt={selectedBiz.name} className="w-5 h-5 rounded object-cover border border-neutral-700" />
                  <span className="text-xs text-neutral-300 font-semibold">{selectedBiz.name}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">{selectedBiz.description}</p>

            <div className="bg-[#050505] p-4 rounded-xl border border-neutral-900 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Website:</span>
                <a
                  href={selectedBiz.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-400 font-bold hover:underline flex items-center space-x-1"
                >
                  <span>{selectedBiz.website}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Phone:</span>
                <span className="font-mono text-white">{selectedBiz.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Alliance:</span>
                <span className="text-white font-bold">{selectedBiz.allianceName}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-center space-x-2 text-xs text-emerald-400 font-semibold uppercase">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Customer Data Privacy Boundary Active. Member client lists are strictly confidential.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
