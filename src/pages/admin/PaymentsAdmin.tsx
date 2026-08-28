import React, { useState } from 'react';
import { useSCAData } from '../../context/SCADataContext';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Business } from '../../types';

export const PaymentsAdmin: React.FC = () => {
  const { businesses } = useSCAData();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'DUE' | 'UPCOMING'>('ALL');

  // Filter businesses for the current admin
  const visibleBusinesses =
    currentUser.role === 'NATIONAL_ADMIN'
      ? businesses
      : businesses.filter((b) => b.allianceId === currentUser.allianceId);

  // Group into payment statuses
  const categorized = visibleBusinesses.filter((b) => b.membershipStatus !== 'PENDING_APPROVAL' && b.membershipStatus !== 'REJECTED');

  const completed = categorized.filter((b) => b.membershipStatus === 'ACTIVE' && b.id !== 'biz_designcraft');
  const due = categorized.filter((b) => ['PAYMENT_FAILED_VIEW_ONLY', 'APPROVED_PAYMENT_REQUIRED', 'LAPSED'].includes(b.membershipStatus));
  const upcoming = categorized.filter((b) => b.membershipStatus === 'ACTIVE' && b.id === 'biz_designcraft'); // Mock upcoming

  let displayList: Business[] = categorized;
  if (filter === 'COMPLETED') displayList = completed;
  if (filter === 'DUE') displayList = due;
  if (filter === 'UPCOMING') displayList = upcoming;

  // Group by alliance
  const groupedByAlliance = displayList.reduce((acc, biz) => {
    if (!acc[biz.allianceName]) acc[biz.allianceName] = [];
    acc[biz.allianceName].push(biz);
    return acc;
  }, {} as Record<string, Business[]>);

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-600/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[#e50914] text-xs font-black uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" />
            <span>Financials & Memberships</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">PAYMENTS MANAGEMENT</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Track alliance membership payments, dues, and upcoming renewals.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#0b0b0b] border border-neutral-800 p-1.5 rounded-xl">
          {(['ALL', 'COMPLETED', 'DUE', 'UPCOMING'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
                filter === tab ? 'bg-[#e50914] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedByAlliance).length === 0 ? (
          <div className="text-center py-12 text-neutral-500 border border-neutral-800 rounded-2xl bg-[#0b0b0b]">
            <CreditCard className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p>No {filter.toLowerCase()} payments found.</p>
          </div>
        ) : (
          Object.entries(groupedByAlliance).map(([allianceName, bizList]) => (
            <div key={allianceName} className="space-y-4">
              {currentUser.role === 'NATIONAL_ADMIN' && (
                <h2 className="text-lg font-black uppercase text-white border-b border-neutral-800 pb-2">
                  {allianceName}
                </h2>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bizList.map((biz) => (
                  <div key={biz.id} className="bg-[#0b0b0b] border border-neutral-800 rounded-xl p-4 flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={biz.logo} alt={biz.name} className="w-10 h-10 rounded-lg object-cover border border-neutral-700" />
                        <div>
                          <div className="text-sm font-black text-white">{biz.name}</div>
                          <div className="text-[10px] text-neutral-500 uppercase">{biz.ownerName}</div>
                        </div>
                      </div>
                      {(() => {
                        const isDue = ['PAYMENT_FAILED_VIEW_ONLY', 'APPROVED_PAYMENT_REQUIRED', 'LAPSED'].includes(biz.membershipStatus);
                        const isUpcoming = biz.membershipStatus === 'ACTIVE' && biz.id === 'biz_designcraft';
                        const isCompleted = biz.membershipStatus === 'ACTIVE' && !isUpcoming;
                        if (isCompleted) return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
                        if (isDue) return <AlertCircle className="w-5 h-5 text-red-500" />;
                        if (isUpcoming) return <Clock className="w-5 h-5 text-blue-500" />;
                        return null;
                      })()}
                    </div>

                    <div className="bg-[#050505] p-3 rounded-lg border border-neutral-900 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Method:</span>
                        <span className="text-white font-mono">{biz.paymentMethod || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Last Payment:</span>
                        <span className="text-white font-mono">{biz.lastPaymentDate || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Status:</span>
                        <span className={`font-black ${filter === 'DUE' ? 'text-red-500' : 'text-white'}`}>
                          {biz.membershipStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
