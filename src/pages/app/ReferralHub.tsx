import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import type { Referral, ReferralStatus } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { StatsCard } from '../../components/common/StatsCard';
import {
  Handshake,
  Plus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Building2,
} from 'lucide-react';

export const ReferralHub: React.FC = () => {
  const { currentUser } = useAuth();
  const { referrals, businesses, sendReferral, updateReferralStatus } = useSCAData();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];

  const [activeTab, setActiveTab] = useState<'RECEIVED' | 'SENT'>('RECEIVED');
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

  // Guided 6-Step Referral State
  const [step, setStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    receiverBusinessId: businesses.find((b) => b.id !== activeBiz.id)?.id || businesses[1]?.id || '',
    customerName: 'Aravind Swamy',
    customerEmail: 'aravind@enterprisecorp.com',
    customerPhone: '+91 98450 11223',
    notes: 'Looking for full structural engineering consultation for a 12-story commercial tower in Whitefield.',
    hasConsent: false,
    estimatedValue: 15000,
  });

  const [valueInput, setValueInput] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState('');

  // Filter Received vs Sent
  const receivedReferrals = referrals.filter((r) => r.receiverBusinessId === activeBiz.id);
  const sentReferrals = referrals.filter((r) => r.senderBusinessId === activeBiz.id);
  const currentList = activeTab === 'RECEIVED' ? receivedReferrals : sentReferrals;

  // Summary Metrics
  const totalCount = referrals.length;
  const pendingCount = referrals.filter((r) => r.status === 'SENT' || r.status === 'IN_REVIEW' || r.status === 'CONTACTED').length;
  const wonCount = referrals.filter((r) => r.status === 'WON').length;
  const lostCount = referrals.filter((r) => r.status === 'LOST').length;

  const targetBiz = businesses.find((b) => b.id === wizardData.receiverBusinessId) || businesses[1];

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizardData.hasConsent) return;

    sendReferral({
      senderBusinessId: activeBiz.id,
      senderBusinessName: activeBiz.name,
      senderUserId: currentUser.id,
      senderUserName: currentUser.name,
      receiverBusinessId: wizardData.receiverBusinessId,
      receiverBusinessName: targetBiz.name,
      allianceId: activeBiz.allianceId,
      customerName: wizardData.customerName,
      customerEmail: wizardData.customerEmail,
      customerPhone: wizardData.customerPhone,
      notes: wizardData.notes,
      hasConsent: wizardData.hasConsent,
      estimatedValue: wizardData.estimatedValue,
    });

    setShowSendModal(false);
    setStep(1);
    setWizardData({ ...wizardData, hasConsent: false });
  };

  const handleUpdateStatus = (id: string, newStatus: ReferralStatus, val?: number) => {
    updateReferralStatus(id, newStatus, val);
    if (selectedReferral) {
      setSelectedReferral({ ...selectedReferral, status: newStatus, recordedValue: val || selectedReferral.recordedValue });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Guided Referral Exchange
            </span>
            {/* Privacy Badge Header */}
            <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded border border-slate-700 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" /> Private Referral Protection Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Referral Exchange Hub</h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            Send and receive warm B2B customer leads with mandatory consent verification.
          </p>
        </div>

        <Button
          onClick={() => setShowSendModal(true)}
          variant="success"
          size="lg"
          leftIcon={<Plus className="w-5 h-5" />}
          className="shrink-0 relative z-10"
        >
          + Send Referral
        </Button>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard
          title="Total Referrals"
          value={totalCount.toString()}
          subtitle="All exchange volume"
          icon={<Handshake className="w-5 h-5 text-blue-600" />}
          iconBgColor="bg-blue-50"
        />
        <StatsCard
          title="Pending Follow-up"
          value={pendingCount.toString()}
          subtitle="In-progress leads"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          iconBgColor="bg-amber-50"
        />
        <StatsCard
          title="Won Deals"
          value={wonCount.toString()}
          subtitle="Successfully closed"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
        />
        <StatsCard
          title="Lost Deals"
          value={lostCount.toString()}
          subtitle="Unsuccessful inquiries"
          icon={<XCircle className="w-5 h-5 text-rose-600" />}
          iconBgColor="bg-rose-50"
        />
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('RECEIVED')}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${
            activeTab === 'RECEIVED'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Received Referrals ({receivedReferrals.length})
        </button>
        <button
          onClick={() => setActiveTab('SENT')}
          className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all ${
            activeTab === 'SENT'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Sent Referrals ({sentReferrals.length})
        </button>
      </div>

      {/* Referrals Cards Grid */}
      {currentList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentList.map((ref) => (
            <Card key={ref.id} hover className="p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{ref.id}</span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">{ref.customerName}</h3>
                    <p className="text-xs text-slate-500">
                      {activeTab === 'RECEIVED' ? `From: ${ref.senderBusinessName}` : `To: ${ref.receiverBusinessName}`}
                    </p>
                  </div>
                  <Badge status={ref.status} size="sm" />
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-3 italic line-clamp-2">
                  "{ref.notes}"
                </p>

                {/* Privacy Badge Indicator */}
                <div className="mt-3 p-2 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Lock className="w-3 h-3 text-emerald-600" /> Private Referral
                  </span>
                  <span className="text-slate-500 text-[10px]">Only involved businesses can view</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  {ref.recordedValue ? `$${ref.recordedValue.toLocaleString()} Value` : `$${ref.estimatedValue?.toLocaleString()} Est.`}
                </span>

                <Button size="sm" variant="outline" onClick={() => setSelectedReferral(ref)}>
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Handshake className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No referrals yet.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Start referring B2B clients to your alliance category partners.
          </p>
          <Button onClick={() => setShowSendModal(true)} variant="success" leftIcon={<Plus className="w-4 h-4" />}>
            Send First Referral
          </Button>
        </div>
      )}

      {/* GUIDED SEND REFERRAL MODAL (6-Step) */}
      {showSendModal && (
        <Modal
          isOpen={showSendModal}
          onClose={() => { setShowSendModal(false); setStep(1); }}
          title="Send B2B Referral"
          subtitle={`Step ${step} of 6 — ${['Target Partner', 'Customer Info', 'Consent Check', 'Notes', 'Review', 'Send'][step - 1]}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSendSubmit} className="space-y-4">
            {/* STEP 1: SELECT BUSINESS */}
            {step === 1 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase">1. Select Alliance Target Partner</h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Business</label>
                  <select
                    value={wizardData.receiverBusinessId}
                    onChange={(e) => setWizardData({ ...wizardData, receiverBusinessId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    {businesses.filter((b) => b.id !== activeBiz.id).map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.categoryName})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end pt-3">
                  <Button type="button" onClick={() => setStep(2)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Next: Customer Info
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: REFERRAL INFORMATION */}
            {step === 2 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase">2. Customer Contact Details</h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    value={wizardData.customerName}
                    onChange={(e) => setWizardData({ ...wizardData, customerName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Email</label>
                    <input
                      type="email"
                      value={wizardData.customerEmail}
                      onChange={(e) => setWizardData({ ...wizardData, customerEmail: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Phone</label>
                    <input
                      type="text"
                      value={wizardData.customerPhone}
                      onChange={(e) => setWizardData({ ...wizardData, customerPhone: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button type="button" onClick={() => setStep(3)} rightIcon={<ArrowRight className="w-4 h-4" />}>Next: Consent</Button>
                </div>
              </div>
            )}

            {/* STEP 3: MANDATORY CONSENT */}
            {step === 3 && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase">3. Customer Consent Verification</h4>

                {/* Explicit Consent Alert Box */}
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2 text-amber-900 text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <ShieldCheck className="w-5 h-5 text-amber-600" />
                    <span>Customer consent is required before submitting this referral.</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    By submitting, you confirm that you have informed the customer and received explicit permission to share their contact details with <span className="font-bold">{targetBiz.name}</span>.
                  </p>
                </div>

                <label className="flex items-start gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={wizardData.hasConsent}
                    onChange={(e) => setWizardData({ ...wizardData, hasConsent: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
                    required
                  />
                  <span className="text-xs font-bold text-slate-900">
                    I verify that I have received explicit customer consent to pass this lead.
                  </span>
                </label>

                <div className="flex justify-between pt-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(2)}>Back</Button>
                  <Button type="button" onClick={() => setStep(4)} disabled={!wizardData.hasConsent} rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Next: Notes
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: NOTES */}
            {step === 4 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase">4. Lead Context & Estimated Value</h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Deal Value ($)</label>
                  <input
                    type="number"
                    value={wizardData.estimatedValue}
                    onChange={(e) => setWizardData({ ...wizardData, estimatedValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Context & Requirement Notes</label>
                  <textarea
                    rows={3}
                    value={wizardData.notes}
                    onChange={(e) => setWizardData({ ...wizardData, notes: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div className="flex justify-between pt-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(3)}>Back</Button>
                  <Button type="button" onClick={() => setStep(5)} rightIcon={<ArrowRight className="w-4 h-4" />}>Next: Review</Button>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW */}
            {step === 5 && (
              <div className="space-y-3 text-xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase">5. Review Referral Summary</h4>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between text-slate-500">
                    <span>Receiving Partner:</span>
                    <span className="font-bold text-slate-900">{targetBiz.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Customer Name:</span>
                    <span className="font-bold text-slate-900">{wizardData.customerName}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Estimated Deal Value:</span>
                    <span className="font-bold text-emerald-700">${wizardData.estimatedValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Consent Verified:</span>
                    <span className="font-bold text-emerald-600">✓ Explicit Consent Confirmed</span>
                  </div>
                </div>
                <div className="flex justify-between pt-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(4)}>Back</Button>
                  <Button type="button" onClick={() => setStep(6)} variant="success">Proceed to Send</Button>
                </div>
              </div>
            )}

            {/* STEP 6: SEND */}
            {step === 6 && (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Handshake className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Ready to Submit Referral</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Clicking "Confirm & Send" will immediately dispatch this B2B referral to <span className="font-bold text-slate-900">{targetBiz.name}</span>.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setStep(5)}>Back</Button>
                  <Button type="submit" variant="success" size="lg">Confirm & Send Referral</Button>
                </div>
              </div>
            )}
          </form>
        </Modal>
      )}

      {/* REFERRAL DETAILS MODAL */}
      {selectedReferral && (
        <Modal
          isOpen={!!selectedReferral}
          onClose={() => setSelectedReferral(null)}
          title={`Referral Details: ${selectedReferral.id}`}
          subtitle={`${selectedReferral.senderBusinessName} ➔ ${selectedReferral.receiverBusinessName}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Privacy Header */}
            <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold">
                <Lock className="w-4 h-4 text-emerald-400" /> Private Referral
              </span>
              <span className="text-slate-300">Only the businesses involved can view this referral.</span>
            </div>

            {/* Referral Info Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Name:</span>
                <span className="font-bold text-slate-900">{selectedReferral.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Email:</span>
                <span className="font-semibold text-blue-600">{selectedReferral.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Phone:</span>
                <span className="font-semibold text-slate-900">{selectedReferral.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <Badge status={selectedReferral.status} />
              </div>
            </div>

            {/* Notes */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase mb-1">Requirement Notes</h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed italic">
                "{selectedReferral.notes}"
              </p>
            </div>

            {/* Status Update Actions & Deal Value Recording */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Update Outcome & Record Closed Deal Value</h4>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleUpdateStatus(selectedReferral.id, 'WON', valueInput || 15000)}
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Mark as WON
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleUpdateStatus(selectedReferral.id, 'LOST')}
                  leftIcon={<XCircle className="w-3.5 h-3.5" />}
                >
                  Mark as LOST
                </Button>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-emerald-200/60">
                <input
                  type="number"
                  placeholder="Record Closed Value ($)"
                  value={valueInput || ''}
                  onChange={(e) => setValueInput(Number(e.target.value))}
                  className="px-3 py-1.5 text-xs border border-emerald-300 rounded-lg bg-white font-mono"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStatus(selectedReferral.id, selectedReferral.status, valueInput)}
                >
                  Record Value
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
