import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { AlertBanner } from '../../components/common/AlertBanner';
import { Sparkles, CheckCircle2, Circle, Save, Building2, Phone, Globe, MapPin, Tag, Upload } from 'lucide-react';

export const ProfileCompletionPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { businesses } = useSCAData();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];

  const [formData, setFormData] = useState({
    name: activeBiz.name,
    description: activeBiz.description,
    logo: activeBiz.logo,
    phone: activeBiz.phone,
    website: activeBiz.website,
    serviceArea: activeBiz.serviceArea,
    currentOffer: activeBiz.currentOffer || '',
  });

  const [savedMsg, setSavedMsg] = useState(false);

  // Field completion tracker
  const fields = [
    { label: 'Business Information', key: 'name', value: formData.name, completed: !!formData.name && !!formData.description },
    { label: 'Company Logo', key: 'logo', value: formData.logo, completed: !!formData.logo },
    { label: 'Contact Details', key: 'phone', value: formData.phone, completed: !!formData.phone },
    { label: 'Website URL', key: 'website', value: formData.website, completed: !!formData.website },
    { label: 'Service Area', key: 'serviceArea', value: formData.serviceArea, completed: !!formData.serviceArea },
    { label: 'Current Member Offer', key: 'currentOffer', value: formData.currentOffer, completed: !!formData.currentOffer },
  ];

  const completedCount = fields.filter((f) => f.completed).length;
  const completionPercentage = Math.round((completedCount / fields.length) * 100);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner with Visual Progress Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            Profile Completion Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">My Business Profile</h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete all profile sections to maximize visibility in the private alliance directory.
          </p>
        </div>

        {/* Completion Gauge Widget */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center shrink-0 min-w-[200px]">
          <p className="text-xs font-bold text-slate-300">Profile Completion</p>
          <p className="text-3xl font-extrabold text-emerald-400 mt-1">{completionPercentage}%</p>
          <div className="w-full h-2.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
            {completedCount} of {fields.length} Sections Completed
          </p>
        </div>
      </div>

      {savedMsg && (
        <AlertBanner
          variant="success"
          title="Profile Updated"
          message="Your business profile details have been saved successfully."
        />
      )}

      {/* Completion Checklist Card */}
      <Card>
        <CardHeader>
          <CardTitle subtitle="Required items for 100% directory readiness">Completion Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {fields.map((f) => (
              <div
                key={f.label}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  f.completed ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span className="font-semibold">{f.label}</span>
                {f.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Form Sections */}
      <Card>
        <CardHeader>
          <CardTitle subtitle="Update your public alliance listing">Business Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-5">
            {/* Section 1: Business Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" /> Business Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Category</label>
                  <input
                    type="text"
                    disabled
                    value={activeBiz.categoryName}
                    className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Section 2: Contact & Web */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-blue-600" /> Contact & Website
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 font-mono"
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
            </div>

            {/* Section 3: Current Offer */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-blue-600" /> Current Member Offer
              </h4>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alliance Exclusive Promotion</label>
                <input
                  type="text"
                  value={formData.currentOffer}
                  onChange={(e) => setFormData({ ...formData, currentOffer: e.target.value })}
                  placeholder="e.g. Free 3D Architectural Space Planning Render"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button type="submit" variant="success" size="lg" leftIcon={<Save className="w-4 h-4" />}>
                Complete Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
