import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { Button } from '../../components/common/Button';
import { Card, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ArrowLeft, ArrowRight, Sparkles, Check, Tag } from 'lucide-react';

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

    navigate('/app/promotions');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" onClick={() => navigate('/app/promotions')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
        Back to My Promotions
      </Button>

      {/* Progress Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Create AdShare Promotion</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Step {step} of 4 — {['Offer Details', 'Creative Image', 'Sharing Copy', 'Live Preview & Publish'][step - 1]}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold">{activeBiz.categoryName}</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">1. Campaign Details</h2>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Campaign Headline Title</label>
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
                <label className="block text-xs font-medium text-slate-700 mb-1">Exclusive Member Offer</label>
                <input
                  type="text"
                  value={formData.offer}
                  onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                  placeholder="e.g. 100% Free Audit ($2,500 value waived for alliance members)"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Short Card Summary</label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief 1-liner summary..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Call to Action (CTA)</label>
                  <input
                    type="text"
                    value={formData.cta}
                    onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                    placeholder="e.g. Claim Free Audit"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Offer Description</label>
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
                  Next: Creative Image
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">2. Select Creative Image</h2>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">Or Choose From Presets</label>
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
                  Next: Sharing Copy
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">3. Social Sharing Copy</h2>
              <p className="text-xs text-slate-500">
                Provide copy that fellow alliance members can copy & paste when sharing your link:
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Share Headline</label>
                <input
                  type="text"
                  value={formData.shareHeadline}
                  onChange={(e) => setFormData({ ...formData, shareHeadline: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Share Body Message</label>
                <textarea
                  rows={3}
                  value={formData.shareMessage}
                  onChange={(e) => setFormData({ ...formData, shareMessage: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Destination Landing Page URL</label>
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
                  Next: Preview & Publish
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">4. Campaign Card Preview</h2>

              {/* Preview Card */}
              <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="relative h-48 w-full bg-slate-100">
                  <img src={formData.imageUrl} alt={formData.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="purple" size="sm">
                      {activeBiz.categoryName}
                    </Badge>
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
        </CardContent>
      </Card>
    </div>
  );
};
