import React, { useState } from 'react';
import { useSCAData } from '../../context/SCADataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const BusinessesAdmin: React.FC = () => {
  const { businesses, approveBusinessApplication, rejectBusinessApplication } = useSCAData();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'REJECTED'>('PENDING');

  // Filter businesses strictly for Alliance Admin's own alliance
  const scopedBusinesses =
    currentUser.role === 'ALLIANCE_ADMIN' && currentUser.allianceId
      ? businesses.filter((b) => b.allianceId === currentUser.allianceId)
      : businesses;

  const filtered = scopedBusinesses.filter((b) => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return b.membershipStatus === 'PENDING_APPROVAL';
    if (filter === 'ACTIVE') return b.membershipStatus === 'ACTIVE';
    if (filter === 'REJECTED') return b.membershipStatus === 'REJECTED';
    return true;
  });

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-600/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[#e50914] text-xs font-black uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Alliance Membership Moderation</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">MEMBER APPLICATIONS</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {currentUser.role === 'ALLIANCE_ADMIN'
              ? `Review applicant businesses for ${currentUser.allianceName || 'your alliance'}.`
              : 'Review applicant businesses, verify category availability, and approve new alliance members.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#0b0b0b] border border-neutral-800 p-1.5 rounded-xl">
          {(['ALL', 'PENDING', 'ACTIVE', 'REJECTED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                filter === tab ? 'bg-[#e50914] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-[#0b0b0b] border border-neutral-800 p-12 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-bold uppercase text-white">Application Queue Clean</h3>
            <p className="text-xs text-neutral-400">There are no applications matching the selected status filter.</p>
          </div>
        ) : (
          filtered.map((biz) => (
            <div key={biz.id} className="bg-[#0b0b0b] border border-neutral-800 p-6 rounded-2xl space-y-4 hover:border-red-600/40 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img src={biz.logo} alt={biz.name} className="w-14 h-14 rounded-xl object-cover border border-neutral-700" />
                  <div>
                    <span className="text-[9px] bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded font-extrabold uppercase">
                      {biz.categoryName}
                    </span>
                    <h3 className="text-lg font-black uppercase text-white mt-1">{biz.name}</h3>
                    <div className="text-xs text-neutral-400 font-mono">Applicant: {biz.ownerName} ({biz.ownerEmail})</div>
                  </div>
                </div>

                {biz.membershipStatus === 'PENDING_APPROVAL' && (
                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={() => rejectBusinessApplication(biz.id, 'Category conflict')}
                      className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-red-400 text-xs font-extrabold uppercase flex items-center space-x-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => approveBusinessApplication(biz.id)}
                      className="adshare-red-btn px-5 py-2.5 rounded-xl text-xs font-black uppercase flex items-center space-x-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Member</span>
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-neutral-300 bg-[#050505] p-3 rounded-xl border border-neutral-900">{biz.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
