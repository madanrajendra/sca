import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSCAData } from '../../context/SCADataContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { AlertBanner } from '../../components/common/AlertBanner';
import { Hexagon, Check, ArrowRight, ArrowLeft, Building2, Grid, MapPin, User } from 'lucide-react';

export const BusinessOnboarding: React.FC = () => {
  const { alliances, categories, applyForBusinessMembership, checkCategoryAvailability } = useSCAData();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerEmail: '',
    businessName: '',
    website: '',
    phone: '',
    serviceArea: 'Bangalore & Karnataka',
    description: '',
    allianceId: 'all_blr',
    categoryId: 'cat_photo',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Exclusivity evaluation
  const categoryCheck = checkCategoryAvailability(formData.allianceId, formData.categoryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = applyForBusinessMembership({
      ...formData,
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80',
    });

    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }

    setSubmittedId(res.businessId || null);
    setStep(5); // Success state
  };

  const selectedAlliance = alliances.find((a) => a.id === formData.allianceId);
  const selectedCategory = categories.find((c) => c.id === formData.categoryId);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6 relative">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg mb-2">
            <Hexagon className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Apply for Alliance Membership</h1>
          <p className="text-xs text-slate-400 mt-1">
            Category Exclusivity Model: Only one business per category per alliance.
          </p>
        </div>

        {/* Wizard Progress Bar */}
        {step < 5 && (
          <div className="flex items-center justify-between mb-8 px-4 max-w-lg mx-auto">
            {['Account', 'Business Details', 'Alliance', 'Category & Review'].map((label, idx) => {
              const num = idx + 1;
              const active = step >= num;
              return (
                <div key={label} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      active ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {step > num ? <Check className="w-4 h-4" /> : num}
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 mt-1">{label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Card Body */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {errorMsg && (
            <AlertBanner
              variant="danger"
              title="Application Blocked"
              message={errorMsg}
              className="mb-6"
            />
          )}

          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" /> Account Owner Information
              </h2>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="e.g. Dr. Ramesh Gupta"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Business Email</label>
                <input
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  placeholder="ramesh@company.com"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <Link to="/login" className="text-xs text-slate-400 hover:text-white">
                  Already a member? Sign in
                </Link>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.ownerName || !formData.ownerEmail}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Next: Business Info
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" /> Business Profile Details
              </h2>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Vanguard Logistics Solutions"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://vanguardlogistics.in"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98000 12345"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Short Description & Services</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a brief overview of your business capabilities..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <Button variant="ghost" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!formData.businessName}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Next: Select Alliance
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" /> Select City Business Alliance
              </h2>
              <p className="text-xs text-slate-400">
                Businesses can belong to only one city alliance. Select the primary operating region:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {alliances.map((all) => {
                  const isSelected = formData.allianceId === all.id;
                  return (
                    <div
                      key={all.id}
                      onClick={() => setFormData({ ...formData, allianceId: all.id })}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/20'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs text-white">{all.name}</h3>
                        {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {all.city}, {all.state}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2">
                        <span>{all.memberCount} Members</span>
                        <span>{all.occupiedCategoriesCount} Categories Occupied</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <Button variant="ghost" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button onClick={() => setStep(4)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Next: Select Category Exclusivity
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-150">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Grid className="w-4 h-4 text-blue-400" /> Category Exclusivity Check
              </h2>

              <p className="text-xs text-slate-400">
                Choose the category you wish to represent in{' '}
                <span className="text-blue-400 font-semibold">{selectedAlliance?.name}</span>:
              </p>

              {/* Category Selector Grid */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const check = checkCategoryAvailability(formData.allianceId, cat.id);
                  const isSelected = formData.categoryId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? check.isAvailable
                            ? 'bg-emerald-950/40 border-emerald-500'
                            : 'bg-rose-950/40 border-rose-500'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-white">{cat.name}</span>
                          {check.isAvailable ? (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                              ○ OPEN
                            </span>
                          ) : (
                            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold border border-rose-500/30">
                              ● OCCUPIED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{cat.description}</p>
                        {!check.isAvailable && (
                          <p className="text-[11px] text-rose-400 font-medium mt-1">
                            Occupied by: {check.occupyingBusinessName}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0">
                        <input
                          type="radio"
                          name="category"
                          checked={isSelected}
                          onChange={() => setFormData({ ...formData, categoryId: cat.id })}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Exclusivity Warning if Occupied */}
              {!categoryCheck.isAvailable && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-200 text-xs">
                  <p className="font-bold">Selection Unavailable</p>
                  <p className="mt-0.5 text-[11px]">
                    "{selectedCategory?.name}" is already occupied in {selectedAlliance?.name}. Please select an open category or choose a different alliance.
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <Button variant="ghost" onClick={() => setStep(3)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="success"
                  disabled={!categoryCheck.isAvailable}
                >
                  Submit Application
                </Button>
              </div>
            </form>
          )}

          {step === 5 && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Application Submitted Successfully!</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Your application for <span className="text-white font-semibold">{formData.businessName}</span> under category <span className="text-blue-400 font-semibold">{selectedCategory?.name}</span> has been routed to the Alliance Admin.
              </p>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl max-w-sm mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Application Reference:</span>
                  <span className="font-mono text-white">{submittedId}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Target Alliance:</span>
                  <span className="text-white">{selectedAlliance?.name}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Status:</span>
                  <span className="text-amber-400 font-semibold">PENDING_APPROVAL</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <Button onClick={() => navigate('/login')} variant="secondary">
                  Go to Login Screen
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
