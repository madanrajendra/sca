import React, { useState } from 'react';
import { useSCAData } from '../../context/SCADataContext';
import { useAuth } from '../../context/AuthContext';
import { ReferralStatus } from '../../types';
import {
  Handshake,
  Plus,
  Send,
  CheckCircle2,
  DollarSign,
  UserCheck,
  Building2,
  X,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export const ReferralHub: React.FC = () => {
  const { referrals, businesses, sendReferral, updateReferralStatus } = useSCAData();
  const { currentUser } = useAuth();

  const [showSendModal, setShowSendModal] = useState(false);
  const [receiverBizId, setReceiverBizId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [estimatedValue, setEstimatedValue] = useState<number>(5000);
  const [hasConsent, setHasConsent] = useState(true);

  const [editingRefId, setEditingRefId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<ReferralStatus>('CONTACTED');
  const [recordedVal, setRecordedVal] = useState<number>(0);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverBizId || !customerName) return;

    sendReferral({
      receiverBusinessId: receiverBizId,
      customerName,
      customerEmail,
      customerPhone,
      notes,
      hasConsent,
      estimatedValue,
    });

    setShowSendModal(false);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setNotes('');
  };

  const handleUpdate = () => {
    if (!editingRefId) return;
    updateReferralStatus(editingRefId, newStatus, recordedVal || undefined);
    setEditingRefId(null);
  };

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-600/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-black uppercase tracking-wider mb-1">
            <Handshake className="w-4 h-4" />
            <span>B2B Member Introductions</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">REFERRAL HUB</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Recommend trusted alliance peers, send warm introductions, and track closed contract revenue.
          </p>
        </div>

        <button
          onClick={() => setShowSendModal(true)}
          className="adshare-red-btn px-5 py-3 rounded-xl text-xs font-black flex items-center space-x-2 shadow-lg shadow-red-600/30 uppercase"
        >
          <Plus className="w-5 h-5" />
          <span>Send New Referral</span>
        </button>
      </div>

      <div className="space-y-4">
        {referrals.map((ref) => (
          <div key={ref.id} className="bg-[#0b0b0b] border border-neutral-800 p-6 rounded-2xl space-y-4 hover:border-red-600/40 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                    ref.status === 'WON' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {ref.status}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">Sent {ref.dateSent}</span>
                </div>
                <h3 className="text-lg font-black uppercase text-white mt-1">
                  Referral: {ref.customerName}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  From: <strong className="text-white uppercase">{ref.senderBusinessName}</strong> → To: <strong className="text-red-500 uppercase">{ref.receiverBusinessName}</strong>
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingRefId(ref.id);
                  setNewStatus(ref.status);
                  setRecordedVal(ref.recordedValue || ref.estimatedValue || 0);
                }}
                className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-4 py-2 rounded-xl text-xs font-bold uppercase text-white shrink-0"
              >
                Update Status
              </button>
            </div>

            <div className="bg-[#050505] p-3 rounded-xl border border-neutral-900 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="text-[10px] text-neutral-500 uppercase font-semibold">Contact Email</div>
                <div className="font-mono text-neutral-300">{ref.customerEmail}</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-500 uppercase font-semibold">Contact Phone</div>
                <div className="font-mono text-neutral-300">{ref.customerPhone}</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-500 uppercase font-semibold">Est. Deal Value</div>
                <div className="font-extrabold text-white">${(ref.estimatedValue || 0).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] text-neutral-500 uppercase font-semibold">Recorded Won Revenue</div>
                <div className="font-extrabold text-emerald-400">${(ref.recordedValue || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showSendModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSend} className="bg-[#0b0b0b] border border-red-600/40 rounded-2xl max-w-lg w-full p-6 space-y-4 relative text-neutral-100">
            <button
              type="button"
              onClick={() => setShowSendModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black uppercase text-white">Send Client Referral</h3>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Select Receiving Business *</label>
              <select
                value={receiverBizId}
                onChange={(e) => setReceiverBizId(e.target.value)}
                className="w-full bg-[#050505] border border-neutral-800 text-white text-sm px-4 py-3 rounded-xl focus:border-red-600 focus:outline-none"
                required
              >
                <option value="">Choose Alliance Partner...</option>
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>{b.name} ({b.categoryName})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Client Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Michael Smith (CEO)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#050505] border border-neutral-800 text-white text-sm px-4 py-3 rounded-xl focus:border-red-600 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Client Email</label>
                <input
                  type="email"
                  placeholder="client@company.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#050505] border border-neutral-800 text-white text-sm px-4 py-3 rounded-xl focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Client Phone</label>
                <input
                  type="text"
                  placeholder="(512) 555-0100"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#050505] border border-neutral-800 text-white text-sm px-4 py-3 rounded-xl focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="adshare-red-btn w-full py-3 rounded-xl text-xs font-black uppercase flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>SEND REFERRAL INTRODUCTION</span>
            </button>
          </form>
        </div>
      )}

      {editingRefId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl max-w-sm w-full p-6 space-y-4 relative text-neutral-100">
            <button
              onClick={() => setEditingRefId(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black uppercase text-white">UPDATE REFERRAL STATUS</h3>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ReferralStatus)}
                className="w-full bg-[#050505] border border-neutral-800 text-white text-sm px-4 py-3 rounded-xl focus:border-red-600 focus:outline-none"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="WON">Won (Closed Deal)</option>
                <option value="LOST">Lost</option>
              </select>
            </div>

            {newStatus === 'WON' && (
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Recorded Deal Value ($)</label>
                <input
                  type="number"
                  value={recordedVal}
                  onChange={(e) => setRecordedVal(Number(e.target.value))}
                  className="w-full bg-[#050505] border border-neutral-800 text-white text-sm px-4 py-3 rounded-xl focus:border-red-600 focus:outline-none"
                />
              </div>
            )}

            <button
              onClick={handleUpdate}
              className="adshare-red-btn w-full py-3 rounded-xl text-xs font-black uppercase"
            >
              Confirm Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
