import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSCAData } from '../../context/SCADataContext';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Upload,
  Image,
  Video,
  FileText,
  Mail,
  Globe,
  Share2,
  MessageSquare,
  ShieldCheck,
  Eye,
  Send,
  Save,
  Clock
} from 'lucide-react';

export const CreatePromotionWizard: React.FC = () => {
  const navigate = useNavigate();
  const { createPromotion, categories } = useSCAData();
  const { currentUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [categoryName, setCategoryName] = useState('HVAC & Climate Services');
  const [offer, setOffer] = useState('');
  const [targetAudience, setTargetAudience] = useState('Local Homeowners');
  const [location, setLocation] = useState('Austin Metro Area');
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState('2026-10-31');
  const [cta, setCta] = useState('Claim Free Offer');
  const [destinationUrl, setDestinationUrl] = useState('https://abcheatingair.com/offer');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80');

  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [facebookPost, setFacebookPost] = useState('');
  const [instagramCaption, setInstagramCaption] = useState('');
  const [linkedInPost, setLinkedInPost] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [activeCopyTab, setActiveCopyTab] = useState<'email' | 'facebook' | 'instagram' | 'linkedin' | 'sms'>('email');

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (status: 'LIVE' | 'DRAFT' | 'PENDING') => {
    createPromotion({
      businessId: currentUser.businessId || 'biz_hvac',
      businessName: currentUser.businessName || 'ABC Heating & Air',
      businessLogo: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&auto=format&fit=crop&q=80',
      allianceId: currentUser.allianceId || 'all_blr',
      title: title || 'Seasonal Promotional Offer',
      shortDescription: shortDescription || 'Exclusive promotional savings for alliance member clients.',
      description: description || 'Special offer details.',
      categoryName,
      imageUrl,
      offer: offer || 'Special Alliance Discount',
      targetAudience,
      location,
      startDate,
      endDate,
      cta,
      destinationUrl,
      shareHeadline: title,
      shareMessage: shortDescription,
      status,
      estimatedReach: 24500,
      leadsCount: 0,
      referralsCount: 0,
      reportedSalesCount: 0,
      estimatedRevenue: 0,
      channelContent: {
        emailSubject,
        emailBody,
        facebookPost,
        instagramCaption,
        linkedInPost,
        smsMessage,
      },
      availableChannels: ['Email', 'Facebook', 'LinkedIn', 'SMS', 'Flyer', 'QR Code'],
    });

    navigate('/app/promotions');
  };

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/app/adshare')}
          className="flex items-center space-x-2 text-xs font-bold text-neutral-400 hover:text-white uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center space-x-2 text-xs font-extrabold uppercase text-[#e50914] bg-red-950/40 border border-red-800/40 px-3 py-1.5 rounded-full">
          <Sparkles className="w-4 h-4" />
          <span>Multi-Step Campaign Creator</span>
        </div>
      </div>

      <div className="bg-[#0b0b0b] border border-neutral-800 p-6 rounded-2xl mb-8 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <span className={currentStep >= 1 ? 'text-[#e50914]' : 'text-neutral-500'}>01 Basic Info</span>
          <span className={currentStep >= 2 ? 'text-[#e50914]' : 'text-neutral-500'}>02 Assets</span>
          <span className={currentStep >= 3 ? 'text-[#e50914]' : 'text-neutral-500'}>03 Channel Content</span>
          <span className={currentStep >= 4 ? 'text-[#e50914]' : 'text-neutral-500'}>04 Preview</span>
          <span className={currentStep >= 5 ? 'text-[#e50914]' : 'text-neutral-500'}>05 Publish</span>
        </div>
        <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#e50914] transition-all duration-500"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {currentStep === 1 && (
        <div className="bg-[#0b0b0b] border border-neutral-800 p-8 rounded-2xl space-y-6">
          <div>
            <h2 className="text-2xl font-black uppercase text-white">STEP 1: BASIC INFORMATION</h2>
            <p className="text-xs text-neutral-400 mt-1">Define your core promotional offer and campaign constraints.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-2">Campaign Title *</label>
              <input
                type="text"
                placeholder="e.g. Free Summer HVAC Inspection & Tune-Up"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#050505] border border-neutral-800 text-white text-sm px-4 py-3 rounded-xl focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-2">Business Category</label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full bg-[#050505] border border-neutral-800 text-white text-sm px-4 py-3 rounded-xl focus:border-red-600 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-2">Special Offer Headline *</label>
              <input
                type="text"
                placeholder="e.g. 100% Free Inspection ($149 Value)"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="w-full bg-[#050505] border border-neutral-800 text-white text-sm px-4 py-3 rounded-xl focus:border-red-600 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-2">Short Marketplace Summary</label>
              <input
                type="text"
                placeholder="Brief summary visible on campaign cards..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full bg-[#050505] border border-neutral-800 text-white text-sm px-4 py-3 rounded-xl focus:border-red-600 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-2">Full Offer Description</label>
              <textarea
                rows={4}
                placeholder="Detailed terms, what is included, who qualifies..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#050505] border border-neutral-800 text-white text-sm p-4 rounded-xl focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#050505] border border-neutral-800 text-white text-sm px-4 py-3 rounded-xl focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-2">Expiration Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#050505] border border-neutral-800 text-white text-sm px-4 py-3 rounded-xl focus:border-red-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="bg-[#0b0b0b] border border-neutral-800 p-8 rounded-2xl space-y-6">
          <div>
            <h2 className="text-2xl font-black uppercase text-white">STEP 2: CAMPAIGN ASSETS</h2>
            <p className="text-xs text-neutral-400 mt-1">Upload high-resolution graphics, video links, or promotional flyers.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-2">Banner Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#050505] border border-neutral-800 text-white text-sm px-4 py-3 rounded-xl focus:border-red-600 focus:outline-none"
              />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.type.startsWith('image/')) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    setImageUrl(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-800 rounded-2xl p-8 text-center hover:border-red-600/50 transition-colors bg-[#050505] cursor-pointer"
            >
              <Upload className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
              <div className="text-sm font-bold text-white uppercase">Click to upload image asset</div>
              <div className="text-xs text-neutral-500 mt-1">Supports PNG, JPG, WEBP (Max 25MB)</div>
            </div>

            {imageUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-neutral-800 max-h-48 aspect-video bg-black">
                <img src={imageUrl} alt="Asset Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="bg-[#0b0b0b] border border-neutral-800 p-8 rounded-2xl space-y-6">
          <div>
            <h2 className="text-2xl font-black uppercase text-white">STEP 3: CHANNEL CONTENT</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Provide pre-written copy so alliance partners can instantly share your offer across channels.
            </p>
          </div>

          <div className="flex items-center space-x-2 border-b border-neutral-800 pb-3">
            <button
              onClick={() => setActiveCopyTab('email')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center space-x-2 ${
                activeCopyTab === 'email' ? 'bg-[#e50914] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>
            <button
              onClick={() => setActiveCopyTab('facebook')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center space-x-2 ${
                activeCopyTab === 'facebook' ? 'bg-[#e50914] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Facebook</span>
            </button>
            <button
              onClick={() => setActiveCopyTab('linkedin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center space-x-2 ${
                activeCopyTab === 'linkedin' ? 'bg-[#e50914] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>LinkedIn</span>
            </button>
            <button
              onClick={() => setActiveCopyTab('sms')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center space-x-2 ${
                activeCopyTab === 'sms' ? 'bg-[#e50914] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>SMS</span>
            </button>
          </div>

          {activeCopyTab === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-2">Email Subject Line</label>
                <input
                  type="text"
                  placeholder="Subject line for alliance partners..."
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-[#050505] border border-neutral-800 text-white text-sm px-4 py-3 rounded-xl focus:border-red-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-2">Email Copy Body</label>
                <textarea
                  rows={6}
                  placeholder="Dear customer, we partnered with [Business] to bring you..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-[#050505] border border-neutral-800 text-white text-sm p-4 rounded-xl focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep === 4 && (
        <div className="bg-[#0b0b0b] border border-neutral-800 p-8 rounded-2xl space-y-6">
          <div>
            <h2 className="text-2xl font-black uppercase text-white">STEP 4: CAMPAIGN PREVIEW</h2>
            <p className="text-xs text-neutral-400 mt-1">Review your campaign card as it will appear in the Marketplace.</p>
          </div>

          <div className="bg-[#050505] border border-neutral-800 p-6 rounded-2xl max-w-md mx-auto space-y-4">
            <div className="h-44 bg-neutral-900 rounded-xl overflow-hidden">
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded uppercase font-bold">
                {categoryName}
              </span>
              <h3 className="text-lg font-bold text-white uppercase mt-2">{title || 'Campaign Title'}</h3>
              <p className="text-xs text-neutral-400 mt-1">{shortDescription || 'Short description summary...'}</p>
            </div>
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div className="bg-[#0b0b0b] border border-neutral-800 p-8 rounded-2xl text-center space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-red-950 border border-red-600 flex items-center justify-center mx-auto text-[#e50914]">
            <Send className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black uppercase text-white">READY TO PUBLISH</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Choose how you want to deploy <strong>{title || 'your campaign'}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-left">
            <button
              onClick={() => handleSubmit('DRAFT')}
              className="bg-[#050505] border border-neutral-800 hover:border-neutral-700 p-4 rounded-xl space-y-2 text-center"
            >
              <Save className="w-6 h-6 text-neutral-400 mx-auto" />
              <div className="text-xs font-bold text-white uppercase">Save Draft</div>
            </button>

            <button
              onClick={() => handleSubmit('PENDING')}
              className="bg-[#050505] border border-neutral-800 hover:border-neutral-700 p-4 rounded-xl space-y-2 text-center"
            >
              <Clock className="w-6 h-6 text-amber-500 mx-auto" />
              <div className="text-xs font-bold text-white uppercase">Schedule</div>
            </button>

            <button
              onClick={() => handleSubmit('LIVE')}
              className="bg-red-950 border border-red-600/60 p-4 rounded-xl space-y-2 text-center"
            >
              <Send className="w-6 h-6 text-[#e50914] mx-auto" />
              <div className="text-xs font-bold text-white uppercase">Publish Live</div>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-8">
        <button
          disabled={currentStep === 1}
          onClick={handlePrev}
          className={`px-6 py-3 rounded-xl text-xs font-bold uppercase ${
            currentStep === 1 ? 'opacity-30 cursor-not-allowed bg-neutral-900 text-neutral-600' : 'bg-neutral-900 text-white hover:bg-neutral-800'
          }`}
        >
          Previous Step
        </button>

        {currentStep < 5 && (
          <button
            onClick={handleNext}
            className="adshare-red-btn px-8 py-3 rounded-xl text-xs font-black flex items-center space-x-2"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
