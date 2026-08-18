import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSCAData } from '../../context/SCADataContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AlertBanner } from '../common/AlertBanner';
import {
  Hexagon,
  Check,
  ArrowRight,
  ArrowLeft,
  User,
  Building2,
  MapPin,
  Grid,
  Sparkles,
  Edit3,
  Upload,
  CheckCircle2,
  Clock,
  Globe,
  Phone,
  Mail,
  Tag,
  ShieldAlert,
} from 'lucide-react';

export const BusinessApplicationWizard: React.FC = () => {
  const { alliances, categories, applyForBusinessMembership, checkCategoryAvailability } = useSCAData();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Form State across 7 steps
  const [formData, setFormData] = useState({
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh@apextech.io',
    password: 'password123',
    businessName: 'Apex Tech Solutions',
    description: 'Enterprise software development agency specializing in AI agent automation and custom web platforms.',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    phone: '+91 98860 12345',
    businessEmail: 'contact@apextech.io',
    website: 'https://apextech.io',
    serviceArea: 'Pan-India & Global Remote',
    allianceId: 'all_blr',
    categoryId: 'cat_photo', // Default available category for Bangalore
    currentOffer: 'Complimentary 2-Week AI Readiness Audit for SCA Members ($2,500 value)',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  const selectedAlliance = alliances.find((a) => a.id === formData.allianceId) || alliances[0];
  const selectedCategory = categories.find((c) => c.id === formData.categoryId) || categories[0];

  const categoryCheck = checkCategoryAvailability(formData.allianceId, formData.categoryId);

  // Profile completion calculation helper
  const calculateProfileCompletion = () => {
    let score = 0;
    if (formData.businessName) score += 20;
    if (formData.description) score += 20;
    if (formData.logo) score += 15;
    if (formData.website && formData.phone) score += 15;
    if (formData.serviceArea) score += 15;
    if (formData.currentOffer) score += 15;
    return score;
  };

  const profileCompletion = calculateProfileCompletion();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fakeUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, logo: fakeUrl }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = applyForBusinessMembership({
      businessName: formData.businessName,
      description: formData.description,
      ownerName: `${formData.firstName} ${formData.lastName}`.trim(),
      ownerEmail: formData.email,
      allianceId: formData.allianceId,
      categoryId: formData.categoryId,
      logo: formData.logo,
      website: formData.website,
      phone: formData.phone,
      serviceArea: formData.serviceArea,
    });

    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }

    setSubmittedAppId(res.businessId || 'biz_new');
    setStep(7); // Jump to Step 7 Submitted
  };

  const stepsList = [
    { num: 1, label: 'Account' },
    { num: 2, label: 'Business' },
    { num: 3, label: 'Alliance' },
    { num: 4, label: 'Category' },
    { num: 5, label: 'Profile' },
    { num: 6, label: 'Review' },
    { num: 7, label: 'Submit' },
  ];

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-6 px-4 sm:px-6">
      <div className="w-full max-w-3xl">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg mb-2">
            <Hexagon className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Spin City Alliance Membership Application
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Category Exclusivity Networking: Only one business per category per city alliance.
          </p>
        </div>

        {/* Responsive 7-Step Progress Indicator */}
        {step < 7 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs overflow-x-auto">
            <div className="flex items-center justify-between min-w-[550px] px-2">
              {stepsList.slice(0, 6).map((st) => {
                const isActive = step === st.num;
                const isCompleted = step > st.num;

                return (
                  <div key={st.num} className="flex items-center gap-2">
                    <button
                      onClick={() => isCompleted && setStep(st.num)}
                      disabled={!isCompleted}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md'
                          : isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : st.num}
                    </button>
                    <span
                      className={`text-xs font-semibold ${
                        isActive ? 'text-slate-900 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {st.label}
                    </span>
                    {st.num < 6 && <div className="w-6 sm:w-10 h-0.5 bg-slate-200 mx-1" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wizard Card Body */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl">
          {errorMsg && (
            <AlertBanner
              variant="danger"
              title="Selection Unavailable"
              message={errorMsg}
              className="mb-6"
            />
          )}

          {/* STEP 1: ACCOUNT */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" /> Step 1 — Account Setup
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter primary business owner account credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Rajesh"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Kumar"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rajesh@company.com"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Link to="/login" className="text-xs font-medium text-slate-500 hover:text-slate-900">
                  Already have an account? Sign In
                </Link>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.firstName || !formData.email}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Business Details
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: BUSINESS DETAILS */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" /> Step 2 — Business Details
                  </h2>
                  <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                    Complete your business profile
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Provide company info, description, logo, and operating region.
                </p>
              </div>

              {/* Logo Upload with Preview */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
                <img
                  src={formData.logo}
                  alt="Logo Preview"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-300 shadow-xs shrink-0"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Company Logo Upload</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">PNG, JPG or SVG up to 5MB</p>
                  <label className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload Logo File</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Apex Tech Solutions"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98860 12345"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business Website</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://apextech.io"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Service Area</label>
                <input
                  type="text"
                  value={formData.serviceArea}
                  onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                  placeholder="e.g. Bangalore Metro & South India"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your agency or company capabilities..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!formData.businessName} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Select Alliance
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT ALLIANCE */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" /> Step 3 — Select City Alliance
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose your primary operating city alliance. A business belongs to exactly one city alliance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {alliances.map((all) => {
                  const isSelected = formData.allianceId === all.id;
                  return (
                    <div
                      key={all.id}
                      onClick={() => setFormData({ ...formData, allianceId: all.id })}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-sm text-slate-900">{all.name}</h3>
                          {isSelected && (
                            <span className="p-1 bg-blue-600 text-white rounded-full">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-slate-400" /> {all.city}, {all.country}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-semibold">{all.memberCount} Members</span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {all.totalCategoriesCount - all.occupiedCategoriesCount} Available Categories
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button onClick={() => setStep(4)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Select Category
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: SELECT CATEGORY */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Grid className="w-5 h-5 text-blue-600" /> Step 4 — Select Category Exclusivity
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Category Exclusivity Engine: Select an open category in <span className="font-semibold text-blue-600">{selectedAlliance.name}</span>.
                </p>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const check = checkCategoryAvailability(formData.allianceId, cat.id);
                  const isSelected = formData.categoryId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => check.isAvailable && setFormData({ ...formData, categoryId: cat.id })}
                      className={`p-4 rounded-xl border transition-all ${
                        !check.isAvailable
                          ? 'bg-slate-50 border-slate-200 opacity-75 cursor-not-allowed'
                          : isSelected
                          ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-500/20 cursor-pointer shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-xs">{cat.name}</h3>
                            {check.isAvailable ? (
                              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                                ○ Available
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-full border border-rose-200">
                                ● Already occupied
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{cat.description}</p>
                          {!check.isAvailable && (
                            <p className="text-[11px] text-rose-600 font-semibold mt-1">
                              Another business ({check.occupyingBusinessName}) already occupies this category in this alliance.
                            </p>
                          )}
                        </div>

                        <input
                          type="radio"
                          name="categorySelect"
                          disabled={!check.isAvailable}
                          checked={isSelected}
                          onChange={() => setFormData({ ...formData, categoryId: cat.id })}
                          className="mt-1 w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setStep(3)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button onClick={() => setStep(5)} disabled={!categoryCheck.isAvailable} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Profile Setup
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: BUSINESS PROFILE */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" /> Step 5 — Profile Completion
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Configure your initial member directory profile.</p>
                </div>

                {/* Profile Completion Bar */}
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">{profileCompletion}% Complete</span>
                  <div className="w-32 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden border border-slate-200">
                    <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${profileCompletion}%` }} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exclusive Member Promotion / Offer</label>
                <input
                  type="text"
                  value={formData.currentOffer}
                  onChange={(e) => setFormData({ ...formData, currentOffer: e.target.value })}
                  placeholder="e.g. Complimentary 2-Week AI Readiness Audit ($2,500 value)"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 font-medium"
                />
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Profile Completion Checklist
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">✓ Business Name</div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">✓ Logo Uploaded</div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">✓ Website & Phone</div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">✓ Service Area</div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">✓ Description</div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">✓ Member Offer</div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setStep(4)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button onClick={() => setStep(6)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Application Review
                </Button>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW */}
          {step === 6 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" /> Step 6 — Review Application Summary
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review all sections before submitting to the Alliance Admin.
                </p>
              </div>

              <div className="space-y-4">
                {/* Account Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Owner</h4>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p className="text-xs text-slate-600">{formData.email}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setStep(1)} leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                    Edit Section
                  </Button>
                </div>

                {/* Business Details Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={formData.logo} alt="Logo" className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Info</h4>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{formData.businessName}</p>
                      <p className="text-xs text-slate-600">{formData.website} • {formData.phone}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setStep(2)} leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                    Edit Section
                  </Button>
                </div>

                {/* Alliance Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selected Alliance</h4>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedAlliance.name}</p>
                    <p className="text-xs text-slate-600">{selectedAlliance.city}, {selectedAlliance.country}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setStep(3)} leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                    Edit Section
                  </Button>
                </div>

                {/* Category Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selected Category Exclusivity</h4>
                    <p className="text-sm font-bold text-emerald-700 mt-0.5">{selectedCategory.name}</p>
                    <p className="text-xs text-emerald-800 font-semibold">○ Exclusivity Slot Validated & Available</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setStep(4)} leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                    Edit Section
                  </Button>
                </div>

                {/* Profile Setup Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Setup & Offer</h4>
                    <p className="text-xs font-semibold text-slate-900 mt-0.5">{formData.currentOffer}</p>
                    <p className="text-xs text-emerald-600 font-bold mt-0.5">{profileCompletion}% Profile Completed</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setStep(5)} leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                    Edit Section
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setStep(5)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button onClick={handleSubmit} variant="success" size="lg">
                  Submit Application
                </Button>
              </div>
            </div>
          )}

          {/* STEP 7: SUBMITTED SUCCESS */}
          {step === 7 && (
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">Application Submitted!</h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  Your business application is now being reviewed by the <span className="font-semibold text-slate-800">{selectedAlliance.name}</span> Alliance Admin.
                </p>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto text-left text-xs space-y-2.5">
                <div className="flex justify-between text-slate-500 border-b border-slate-200 pb-2">
                  <span>Application Reference:</span>
                  <span className="font-mono text-slate-900 font-bold">{submittedAppId}</span>
                </div>
                <div className="flex justify-between text-slate-500 border-b border-slate-200 pb-2">
                  <span>Selected Alliance:</span>
                  <span className="font-semibold text-slate-900">{selectedAlliance.name}</span>
                </div>
                <div className="flex justify-between text-slate-500 border-b border-slate-200 pb-2">
                  <span>Selected Category:</span>
                  <span className="font-semibold text-blue-700">{selectedCategory.name}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Current Status:</span>
                  <Badge status="PENDING_APPROVAL" />
                </div>
              </div>

              <div className="pt-3 flex justify-center gap-3">
                <Button onClick={() => navigate('/onboarding/status')} variant="primary">
                  View Application Status
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
