import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ArrowLeft, ArrowRight, Sparkles, Check, Tag, Upload, Eye } from 'lucide-react';

export const CreatePromotionWizard: React.FC = () => {
  const { currentUser } = useAuth();
  const { businesses, createPromotion } = useSCAData();
  const navigate = useNavigate();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    offer: '',
    startDate: new Date().toISOString().substring(0, 10),
    endDate: '2026-10-31',
    cta: 'Claim Member Discount',
    destinationUrl: 'https://apextech.io/sca-special',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    shareHeadline: '🚀 Exclusive Alliance Member Offer',
    shareMessage: 'Check out this exclusive discount from our alliance partner Apex Tech Solutions:',
  });

  const presetImages = [
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fakeUrl = URL.createObjectURL(e.target.files[0]);
      setFormData((prev) => ({ ...prev, imageUrl: fakeUrl }));
    }
  };

  const handlePublish = () => {
    createPromotion({
      businessId: activeBiz.id,
      businessName: activeBiz.name,
      businessLogo: activeBiz.logo,
      allianceId: activeBiz.allianceId,
      title: formData.title,
      shortDescription: formData.shortDescription,
      description: formData.description,
      categoryName: activeBiz.categoryName,
      imageUrl: formData.imageUrl,
      offer: formData.offer,
      startDate: formData.startDate,
      endDate: formData.endDate,
      cta: formData.cta,
      destinationUrl: formData.destinationUrl,
      shareHeadline: formData.shareHeadline,
      shareMessage: formData.shareMessage,
      status: 'LIVE',
    });

    setStep(5); // Published success state
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {step < 5 && (
        <Button variant="ghost" size="sm" onClick={() => navigate('/app/promotions')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to My Promotions
        </Button>
      )}

      {/* Progress Header */}
      {step < 5 && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Create AdShare Promotion</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Step {step} of 4 — {['Details', 'Creative Image', 'Share Content', 'Live Card Preview'][step - 1]}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold">{activeBiz.categoryName}</span>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          {/* STEP 1: DETAILS */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">1. Campaign Details</h2>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Free 2-Week AI Process Automation Audit"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exclusive Member Offer</label>
                <input
                  type="text"
                  value={formData.offer}
                  onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                  placeholder="e.g. 100% Free Audit ($2,500 value waived for alliance members)"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description (Card Summary)</label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief 1-liner summary..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Call to Action (CTA)</label>
                  <input
                    type="text"
                    value={formData.cta}
                    onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                    placeholder="e.g. Claim Free Audit"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date / Expiry</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide comprehensive details about what alliance members get..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.title || !formData.offer}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Next: Upload Creative
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: CREATIVE */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">2. Upload Creative Image</h2>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={formData.imageUrl} alt="Creative Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-300 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Upload Custom Image</h4>
                    <p className="text-[11px] text-slate-500">1200 x 630 px recommended</p>
                  </div>
                </div>
                <label className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Choose File</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Or Image URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Preset Images</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {presetImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setFormData({ ...formData, imageUrl: imgUrl })}
                      className={`relative h-24 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        formData.imageUrl === imgUrl ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img src={imgUrl} alt="Preset" className="w-full h-full object-cover" />
                      {formData.imageUrl === imgUrl && (
                        <div className="absolute top-1.5 right-1.5 bg-blue-600 text-white p-1 rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Next: Share Content
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: SHARE CONTENT */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">3. Social Share Content</h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Share Headline</label>
                <input
                  type="text"
                  value={formData.shareHeadline}
                  onChange={(e) => setFormData({ ...formData, shareHeadline: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Share Message</label>
                <textarea
                  rows={3}
                  value={formData.shareMessage}
                  onChange={(e) => setFormData({ ...formData, shareMessage: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Destination URL</label>
                <input
                  type="text"
                  value={formData.destinationUrl}
                  onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 font-mono"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button onClick={() => setStep(4)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Next: Live Card Preview
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: PREVIEW */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">4. Campaign Card Preview</h2>

              <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="relative h-48 w-full bg-slate-100">
                  <img src={formData.imageUrl} alt={formData.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="purple">{activeBiz.categoryName}</Badge>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={activeBiz.logo} alt={activeBiz.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs font-bold text-slate-900">{activeBiz.name}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{formData.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{formData.shortDescription}</p>

                  <div className="mt-4 p-2.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{formData.offer}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setStep(3)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button onClick={handlePublish} variant="success">
                  Publish to AdShare Marketplace
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: PUBLISHED CONFIRMATION */}
          {step === 5 && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-300 shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Your promotion is live! 🎉</h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Alliance members can now discover and promote your offer across the private business alliance network.
              </p>

              <div className="pt-4 flex justify-center gap-3">
                <Button onClick={() => navigate('/app/adshare')} variant="primary" size="lg">
                  View in Marketplace
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
