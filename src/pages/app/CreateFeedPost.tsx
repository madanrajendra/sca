import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSCAData } from '../../context/SCADataContext';
import { useAuth } from '../../context/AuthContext';
import { ShareModal } from '../../components/common/ShareModal';
import {
  ArrowLeft,
  UploadCloud,
  Copy,
  ExternalLink,
  Sparkles,
  Check,
  Image as ImageIcon,
  Flame,
  Globe,
  CheckCircle2,
  FileCode,
} from 'lucide-react';

interface GalleryImage {
  url: string;
  clicks: number;
}

export const CreateFeedPost: React.FC = () => {
  const navigate = useNavigate();
  const { businesses, createPromotion } = useSCAData();
  const { currentUser } = useAuth();

  // Find business of active user
  const myBusinessId = currentUser.businessId || 'biz_apex';
  const myBusiness = businesses.find((b) => b.id === myBusinessId);

  // Seed standard gallery images with click counts
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80', clicks: 245 },
    { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop&q=80', clicks: 184 },
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80', clicks: 92 },
    { url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80', clicks: 43 }
  ]);

  // UI state
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(galleryImages[0].url);
  const [postTitle, setPostTitle] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [bizName, setBizName] = useState(myBusiness?.name || '');
  const [bizField, setBizField] = useState(myBusiness?.categoryName || '');
  const [bizOffer, setBizOffer] = useState(myBusiness?.currentOffer || '');
  const [isCopied, setIsCopied] = useState(false);
  const [isPromptGenerated, setIsPromptGenerated] = useState(false);

  const scaLogoUrl = 'https://thumbs.dreamstime.com/b/letter-sca-simple-monogram-logo-icon-design-letter-sca-simple-monogram-logo-icon-design-initial-logo-vector-illustration-251468157.jpg';
  const logoUrl = myBusiness?.logo || 'https://static.wixstatic.com/media/fd8c12_f8c0c711939348c6adc89cb082e8d0e5~mv2.jpg/v1/fit/w_2500,h_1330,al_c/fd8c12_f8c0c711939348c6adc89cb082e8d0e5~mv2.jpg';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageStringInfo, setImageStringInfo] = useState<string | null>(null);
  const [createdPostForModal, setCreatedPostForModal] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setSelectedImageUrl(base64String);
      setGalleryImages((prev) => [{ url: base64String, clicks: 0 }, ...prev]);
      const sizeKb = (base64String.length / 1024).toFixed(1);
      setImageStringInfo(`Asset uploaded successfully (${sizeKb} KB)`);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handlePostCampaign = () => {
    if (!postTitle || !postDesc) {
      alert('Please enter a draft title and description first.');
      return;
    }

    const newId = createPromotion({
      businessId: myBusiness?.id || 'biz_apex',
      businessName: myBusiness?.name || bizName,
      businessLogo: myBusiness?.logo || logoUrl,
      allianceId: myBusiness?.allianceId || 'all_blr',
      title: postTitle,
      shortDescription: postDesc.substring(0, 80) + (postDesc.length > 80 ? '...' : ''),
      description: postDesc,
      categoryName: bizField || myBusiness?.categoryName || 'General Services',
      // Base64 string or gallery URL stored directly in MongoDB
      imageUrl: selectedImageUrl,
      offer: bizOffer,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      cta: 'Claim Offer',
      destinationUrl: myBusiness?.website || 'https://spincityalliance.com',
      shareHeadline: postTitle,
      shareMessage: postDesc,
      status: 'LIVE',
      estimatedReach: myBusiness?.estimatedAudience || 15000,
      leadsCount: 0,
      referralsCount: 0,
      reportedSalesCount: 0,
      estimatedRevenue: 0,
    });

    // Display Sharable Link Modal immediately for this post
    setCreatedPostForModal({
      id: newId,
      title: postTitle,
      description: postDesc,
      imageUrl: selectedImageUrl,
      businessName: myBusiness?.name || bizName,
      offer: bizOffer,
      clicks: 0,
      views: 1,
      estimatedReach: myBusiness?.estimatedAudience || 15000,
    });
  };

  // Generate the prompt text
  const promptText = `Please perform BOTH of the following actions in a single response:

1. Directly generate/draw a high-quality ad banner image (16:9 ratio) for my business. Incorporate the following logos neatly on the image (e.g., business logo in one top corner, Spin City Alliance logo in the other top corner):
  - Business Logo: ${logoUrl}
  - Spin City Alliance Logo: ${scaLogoUrl}

Here are the details for the ad banner:
  - Business Name: ${bizName}
  - Industry/Field: ${bizField}
  - Special Offer: ${bizOffer}
  - Focus Title Suggestion: ${postTitle || 'None specified'}
  - Focus Description Suggestion: ${postDesc || 'None specified'}

2. Write an optimized marketing campaign title and a description including relevant hashtags.

Important: Do not stop after generating the image! Make sure you output both the image and the written copy (title and description) together.`;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleOpenChatGPT = () => {
    const url = `https://chatgpt.com/?q=${encodeURIComponent(promptText)}`;
    window.open(url, '_blank');
  };

  const handleOpenGemini = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
    window.open('https://gemini.google.com/app', '_blank');
  };

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans space-y-8">
      {/* Header */}
      <div className="border-b border-red-600/20 pb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">Create Alliance Ad</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Design marketing posts, select media, and compile AI prompts for creation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Media and Inputs */}
        <div className="space-y-6">
          {/* Media Upload Card */}
          <div className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center space-x-1.5">
              <ImageIcon className="w-4 h-4 text-[#e50914]" />
              <span>Selected Banner Image</span>
            </h2>

            {/* Selected Image Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-neutral-800 bg-[#050505]">
              <img src={selectedImageUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md border border-neutral-800 text-[10px] font-bold text-neutral-300 px-2 py-1 rounded-lg">
                Preview Mode
              </div>
            </div>

            {/* Real File Upload & Drag-and-Drop (Converts Image to Base64 String for MongoDB) */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-red-500 bg-red-950/30 scale-[1.01]'
                  : 'border-neutral-800 hover:border-red-600/50 bg-[#050505]'
              }`}
            >
              <UploadCloud className={`w-8 h-8 mx-auto mb-2 transition-colors ${isDragging ? 'text-red-500' : 'text-neutral-500'}`} />
              <div className="text-xs font-bold text-white">Upload New Asset</div>
              <p className="text-[10px] text-neutral-500 mt-1">
                Drag and drop your ad design image (PNG, JPG, WebP), or click to browse.
              </p>
              {imageStringInfo && (
                <div className="mt-2.5 inline-flex items-center space-x-1.5 bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-1 rounded-md text-[10px] font-bold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{imageStringInfo}</span>
                </div>
              )}
            </div>
          </div>

          {/* Media Gallery with Metrics */}
          <div className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400">
              Your Media Gallery & Clicks Performance
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImageUrl(img.url)}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImageUrl === img.url ? 'border-red-600' : 'border-transparent hover:border-neutral-700'
                  }`}
                >
                  <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 bg-black/80 backdrop-blur-xs text-[8px] font-black text-emerald-400 border border-neutral-800 px-1 rounded">
                    {img.clicks} CLKS
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Title & Description */}
          <div className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400">
              Draft Post Info
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">
                  Draft Title / Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Indiranagar Prime Office Space Lease"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full bg-[#050505] border border-neutral-800 text-xs text-white p-3 rounded-xl focus:border-red-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">
                  Draft Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell alliance partners about your campaign..."
                  value={postDesc}
                  onChange={(e) => setPostDesc(e.target.value)}
                  className="w-full bg-[#050505] border border-neutral-800 text-xs text-white p-3 rounded-xl focus:border-red-600 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Post Campaign Action Button */}
          <button
            onClick={handlePostCampaign}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase rounded-xl transition-all shadow-lg shadow-red-600/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-1.5"
          >
            <span>Publish Ad Post</span>
          </button>
        </div>

        {/* Right Side: Form and Prompt Generator */}
        <div className="space-y-6">
          {/* Business Context Form */}
          <div className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400 flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-[#e50914]" />
              <span>Business Context & Offer</span>
            </h2>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  className="w-full bg-[#050505] border border-neutral-800 text-xs text-white p-3 rounded-xl focus:border-red-600 focus:outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">
                  Business Field / Industry
                </label>
                <input
                  type="text"
                  value={bizField}
                  onChange={(e) => setBizField(e.target.value)}
                  className="w-full bg-[#050505] border border-neutral-800 text-xs text-white p-3 rounded-xl focus:border-red-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">
                  Offer details
                </label>
                <textarea
                  rows={2}
                  value={bizOffer}
                  onChange={(e) => setBizOffer(e.target.value)}
                  className="w-full bg-[#050505] border border-neutral-800 text-xs text-white p-3 rounded-xl focus:border-red-600 focus:outline-none resize-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* AI Prompt Generator */}
          <div className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-white flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>AI Copy & Image Prompt Generator</span>
                </h2>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  Generate professional prompts to create titles, descriptions, and designs.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setIsPromptGenerated(true)}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs uppercase rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-lg shadow-purple-600/10"
              >
                <Flame className="w-4 h-4 text-amber-300" />
                <span>Compile AI Prompt</span>
              </button>

              {isPromptGenerated && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="relative bg-[#050505] border border-neutral-800 rounded-xl p-4 text-xs font-mono text-neutral-300 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap select-all">
                    {promptText}
                    <button
                      onClick={handleCopyPrompt}
                      className="absolute top-2 right-2 p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
                      title="Copy Prompt"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyPrompt}
                      className="flex-1 py-2.5 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-800/40 text-purple-400 font-extrabold text-xs uppercase rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Prompt Copied!' : 'Copy AI Prompt'}</span>
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(selectedImageUrl);
                          alert('Image URL copied to clipboard! You can paste it into the AI chat to reference this style.');
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white font-extrabold text-xs uppercase rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Copy Image Link</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleOpenChatGPT}
                      className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <span>Send to ChatGPT</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleOpenGemini}
                      className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <span>Send to Gemini</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[10px] text-neutral-500 leading-normal bg-[#050505] p-2.5 rounded-lg border border-neutral-900">
                    <span className="font-bold text-[#e50914] uppercase block mb-0.5">ℹ️ Direct Generation Info:</span>
                    • <strong className="text-white">ChatGPT</strong> auto-fills the prompt. DALL-E will draw the ad image directly.<br/>
                    • <strong className="text-white">Gemini</strong> does not support query auto-fill. Clicking will copy the prompt to your clipboard—just paste (<kbd className="px-1 bg-neutral-900 rounded border border-neutral-800 font-mono">Ctrl+V</kbd>) it in Gemini to draw the image directly.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal displayed right after post is created */}
      <ShareModal
        post={createdPostForModal}
        isOpen={!!createdPostForModal}
        onClose={() => {
          setCreatedPostForModal(null);
          navigate('/app/feed');
        }}
      />
    </div>
  );
};
