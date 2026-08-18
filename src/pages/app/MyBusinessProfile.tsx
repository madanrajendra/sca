import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { AlertBanner } from '../../components/common/AlertBanner';
import { Save } from 'lucide-react';

export const MyBusinessProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const { businesses, simulatePaymentStatusChange } = useSCAData();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];

  const [formData, setFormData] = useState({
    name: activeBiz.name,
    website: activeBiz.website,
    phone: activeBiz.phone,
    serviceArea: activeBiz.serviceArea,
    description: activeBiz.description,
    currentOffer: activeBiz.currentOffer || '',
  });

  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Business Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your alliance membership, category assignment, and company details.
        </p>
      </div>

      {savedMsg && (
        <AlertBanner
          variant="success"
          title="Profile Saved"
          message="Your business profile and current offer have been updated across the alliance directory."
        />
      )}

      {/* Membership & Payment State Machine Box */}
      <Card className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 text-white p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge status={activeBiz.membershipStatus} />
              <span className="text-xs text-slate-400 font-mono">ID: {activeBiz.id}</span>
            </div>
            <h2 className="text-xl font-bold">{activeBiz.name}</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Category: <span className="text-emerald-400 font-semibold">{activeBiz.categoryName}</span> ({activeBiz.allianceName})
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-1 text-xs">
            <div className="flex justify-between text-slate-400 gap-4">
              <span>Payment Method:</span>
              <span className="text-white font-medium">{activeBiz.paymentMethod || 'Visa ending 4242'}</span>
            </div>
            <div className="flex justify-between text-slate-400 gap-4">
              <span>Last Payment:</span>
              <span className="text-white font-medium">{activeBiz.lastPaymentDate || '2026-08-01'}</span>
            </div>
            {activeBiz.membershipStatus === 'PAYMENT_FAILED_VIEW_ONLY' ? (
              <Button
                size="sm"
                variant="success"
                onClick={() => simulatePaymentStatusChange(activeBiz.id, 'ACTIVE')}
                className="w-full mt-2"
              >
                Resolve Payment ($199)
              </Button>
            ) : (
              <button
                onClick={() => simulatePaymentStatusChange(activeBiz.id, 'PAYMENT_FAILED_VIEW_ONLY')}
                className="text-[10px] text-rose-400 hover:underline block mt-1"
              >
                Simulate Payment Failure
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle subtitle="Company profile visible to alliance members">Business Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Exclusivity Slot</label>
                <input
                  type="text"
                  disabled
                  value={activeBiz.categoryName}
                  className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Website URL</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service Operating Area</label>
              <input
                type="text"
                value={formData.serviceArea}
                onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Member Offer / Promotion Highlight</label>
              <input
                type="text"
                value={formData.currentOffer}
                onChange={(e) => setFormData({ ...formData, currentOffer: e.target.value })}
                placeholder="e.g. Complimentary 2-Week AI Readiness Audit ($2,500 value)"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Business Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
