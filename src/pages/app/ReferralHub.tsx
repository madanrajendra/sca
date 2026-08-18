import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import type { Referral, ReferralStatus } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';
import { Modal } from '../../components/common/Modal';
import { Table, type Column } from '../../components/common/Table';
import { Plus, DollarSign } from 'lucide-react';

export const ReferralHub: React.FC = () => {
  const { currentUser } = useAuth();
  const { referrals, businesses, sendReferral, updateReferralStatus } = useSCAData();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];

  const [activeTab, setActiveTab] = useState<'RECEIVED' | 'SENT'>('RECEIVED');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [recordValueInput, setRecordValueInput] = useState<number>(10000);

  // Send Referral form state
  const [refForm, setRefForm] = useState({
    receiverBusinessId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
    hasConsent: false,
    estimatedValue: 15000,
  });

  const receivedRefs = referrals.filter((r) => r.receiverBusinessId === activeBiz.id);
  const sentRefs = referrals.filter((r) => r.senderBusinessId === activeBiz.id);
  const displayRefs = activeTab === 'RECEIVED' ? receivedRefs : sentRefs;

  const handleCreateReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refForm.hasConsent) return;

    sendReferral(refForm);
    setShowCreateModal(false);
    setRefForm({
      receiverBusinessId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      notes: '',
      hasConsent: false,
      estimatedValue: 15000,
    });
  };

  const handleUpdateStatus = (id: string, status: ReferralStatus) => {
    if (status === 'WON') {
      updateReferralStatus(id, 'WON', recordValueInput);
    } else {
      updateReferralStatus(id, status);
    }
    setSelectedReferral(null);
  };

  const columns: Column<Referral>[] = [
    {
      header: 'Customer Contact',
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900 text-xs">{row.customerName}</p>
          <p className="text-[10px] text-slate-500">{row.customerEmail} • {row.customerPhone}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: activeTab === 'RECEIVED' ? 'Referred By' : 'Sent To',
      accessor: (row) => (
        <span className="font-semibold text-xs text-slate-800">
          {activeTab === 'RECEIVED' ? row.senderBusinessName : row.receiverBusinessName}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => <Badge status={row.status} size="sm" />,
    },
    {
      header: 'Value Recorded',
      accessor: (row) => (
        <span className="font-mono font-bold text-xs text-emerald-700">
          ${(row.recordedValue || row.estimatedValue || 0).toLocaleString()}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Date',
      accessor: (row) => <span className="text-xs text-slate-500">{row.dateSent}</span>,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <Button size="sm" variant="outline" onClick={() => setSelectedReferral(row)}>
          Manage Referral
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Alliance Referral Hub</h1>
          <p className="text-xs text-slate-500 mt-1">
            Send and receive qualified client referrals with mandatory customer consent tracking.
          </p>
        </div>

        <Button onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Send New Referral
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100">
          <Tabs
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as any)}
            tabs={[
              { id: 'RECEIVED', label: 'Referrals Received', count: receivedRefs.length },
              { id: 'SENT', label: 'Referrals Sent', count: sentRefs.length },
            ]}
          />
        </div>

        <Table
          data={displayRefs}
          columns={columns}
          keyExtractor={(r) => r.id}
          emptyText={`No ${activeTab.toLowerCase()} referrals recorded yet.`}
        />
      </Card>

      {/* Send Referral Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Send New Business Referral"
        subtitle={`Referring business from ${activeBiz.name}`}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateReferralSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Alliance Business</label>
            <select
              value={refForm.receiverBusinessId}
              onChange={(e) => setRefForm({ ...refForm, receiverBusinessId: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 bg-white"
              required
            >
              <option value="">Select an alliance member...</option>
              {businesses
                .filter((b) => b.id !== activeBiz.id && b.membershipStatus === 'ACTIVE')
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} — {b.categoryName} ({b.ownerName})
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Full Name</label>
              <input
                type="text"
                value={refForm.customerName}
                onChange={(e) => setRefForm({ ...refForm, customerName: e.target.value })}
                placeholder="e.g. Anish Kapoor (VP Operations)"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Deal Value ($)</label>
              <input
                type="number"
                value={refForm.estimatedValue}
                onChange={(e) => setRefForm({ ...refForm, estimatedValue: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Email</label>
              <input
                type="email"
                value={refForm.customerEmail}
                onChange={(e) => setRefForm({ ...refForm, customerEmail: e.target.value })}
                placeholder="anish@company.com"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Phone</label>
              <input
                type="text"
                value={refForm.customerPhone}
                onChange={(e) => setRefForm({ ...refForm, customerPhone: e.target.value })}
                placeholder="+91 98000 11223"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notes & Requirements</label>
            <textarea
              rows={3}
              value={refForm.notes}
              onChange={(e) => setRefForm({ ...refForm, notes: e.target.value })}
              placeholder="Explain the lead's exact context and what services they need..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Mandatory Consent Checkbox */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <input
              type="checkbox"
              id="consentCheck"
              checked={refForm.hasConsent}
              onChange={(e) => setRefForm({ ...refForm, hasConsent: e.target.checked })}
              className="mt-0.5 w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
              required
            />
            <label htmlFor="consentCheck" className="text-xs text-emerald-900 cursor-pointer">
              <span className="font-bold">Explicit Customer Consent Verified:</span> I confirm I have obtained permission from the customer to share their contact details with the receiving alliance business.
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!refForm.hasConsent || !refForm.receiverBusinessId} variant="success">
              Send Referral
            </Button>
          </div>
        </form>
      </Modal>

      {/* Referral Details & Status Updater Modal */}
      {selectedReferral && (
        <Modal
          isOpen={!!selectedReferral}
          onClose={() => setSelectedReferral(null)}
          title={`Referral: ${selectedReferral.customerName}`}
          subtitle={`Sent by ${selectedReferral.senderBusinessName} to ${selectedReferral.receiverBusinessName}`}
        >
          <div className="space-y-6">
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Current Status:</span>
                <Badge status={selectedReferral.status} />
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Contact Email:</span>
                <span className="font-mono text-blue-400">{selectedReferral.customerEmail}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Phone:</span>
                <span>{selectedReferral.customerPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Notes:</span>
                <p className="bg-slate-950 p-2.5 rounded text-slate-300 italic">{selectedReferral.notes}</p>
              </div>
            </div>

            {/* Status Update Options */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Update Referral Lifecycle
              </h4>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(selectedReferral.id, 'CONTACTED')}>
                    Mark as Contacted
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleUpdateStatus(selectedReferral.id, 'LOST')}>
                    Mark as Lost
                  </Button>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                  <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" /> Close Deal as WON & Record Value
                  </h5>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={recordValueInput}
                      onChange={(e) => setRecordValueInput(Number(e.target.value))}
                      className="px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg font-mono font-bold text-slate-900"
                    />
                    <Button size="sm" variant="success" onClick={() => handleUpdateStatus(selectedReferral.id, 'WON')}>
                      Confirm Won Deal
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
