import React, { useState } from 'react';
import { useSCAData } from '../../context/SCADataContext';
import { Business } from '../../types';
import { getOwnerAvatar } from '../../utils/avatars';
import {
  BookOpen,
  Search,
  Building2,
  Users,
  Globe,
  Phone,
  ShieldCheck,
  Megaphone,
  Handshake,
  X,
  ExternalLink,
  Mail
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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

import { useAuth } from '../../context/AuthContext';

export const BusinessDirectory: React.FC = () => {
  const { businesses, promotions } = useSCAData();
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null);
  const navigate = useNavigate();

  const userAllianceId = currentUser.allianceId || 'all_blr';

  let activeMembers = businesses.filter((b) => b.membershipStatus === 'ACTIVE');

  // Strict scoping for Alliance Admin & alliance-scoped members
  if (currentUser.role === 'ALLIANCE_ADMIN' || currentUser.allianceId) {
    activeMembers = activeMembers.filter((b) => b.allianceId === userAllianceId);
  }

  const filteredMembers = activeMembers.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.categoryName.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-600/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[#e50914] text-xs font-black uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Trusted Business Network • {currentUser.allianceName || 'Bangalore Alliance'}</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            {currentUser.role === 'ALLIANCE_ADMIN'
              ? `${currentUser.allianceName || 'BANGALORE BUSINESS ALLIANCE'} DIRECTORY`
              : 'ALLIANCE DIRECTORY'}
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Discover trusted peer businesses in {currentUser.allianceName || 'the alliance'}. Collaborate, co-market, and send warm referrals.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search owners or businesses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0b0b0b] border border-neutral-800 text-white text-xs pl-9 pr-4 py-2.5 rounded-xl focus:border-red-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((biz) => {
          const activeCampaigns = promotions.filter((p) => p.businessId === biz.id && p.status === 'LIVE');

          return (
            <div
              key={biz.id}
              className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl overflow-hidden hover:border-[#e50914]/50 transition-all card-hover flex flex-col justify-between"
            >
              {/* Top Portion: Big Owner Portrait */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#050505] border-b border-neutral-900">
                <img
                  src={getOwnerAvatar(biz.id)}
                  alt={biz.ownerName}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Accent Bar */}
              <div className="h-1 bg-[#e50914] w-full" />

              {/* Text Area */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
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

                {/* Main Action Buttons */}
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
          );
        })}
      </div>

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
              <img src={getOwnerAvatar(selectedBiz.id)} alt={selectedBiz.ownerName} className="w-20 h-20 rounded-full object-cover border-2 border-red-600/40 shrink-0" />
              <div>
                <span className="text-[9px] bg-[#e50914]/10 text-[#e50914] border border-[#e50914]/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  {selectedBiz.categoryName}
                </span>
                <h2 className="text-xl font-black uppercase text-white mt-1.5 leading-none">{selectedBiz.ownerName}</h2>
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
                <a href={selectedBiz.website} target="_blank" rel="noreferrer" className="text-red-400 font-bold hover:underline flex items-center space-x-1">
                  <span>{selectedBiz.website}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Phone:</span>
                <span className="font-mono text-white">{selectedBiz.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Service Area:</span>
                <span className="text-white font-bold">{selectedBiz.serviceArea}</span>
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
