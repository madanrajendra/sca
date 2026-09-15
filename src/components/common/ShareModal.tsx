import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Share2,
  MousePointerClick,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { AdSharePromotion } from '../../types';

interface ShareModalProps {
  post: AdSharePromotion | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ post, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !post) return null;

  const origin = window.location.origin;
  const shareUrl = `${origin}/share/${post.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Check out "${post.title}" on Spin City Alliance: ${shareUrl}`
  )}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Exclusive offer: ${post.title}`
  )}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#0b0b0b] border border-neutral-800 rounded-2xl shadow-2xl p-6 text-neutral-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-850 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-500">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Share Campaign Link
              </h3>
              <p className="text-[11px] text-neutral-400">
                URL context preview with image & title ready for all platforms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live URL Context Preview Card */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">
            URL Context Preview (How it appears when shared)
          </label>
          <div className="border border-neutral-800 rounded-xl overflow-hidden bg-[#050505]">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-[9px] font-bold text-red-400 border border-red-900/50 px-2 py-0.5 rounded-md uppercase">
                OpenGraph Preview
              </div>
            </div>
            <div className="p-3.5 space-y-1">
              <div className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
                {origin.replace(/^https?:\/\//, '')} • {post.businessName}
              </div>
              <h4 className="text-xs font-black text-white line-clamp-1">{post.title}</h4>
              <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                {post.shortDescription || post.description || post.offer}
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Click Metrics Bar */}
        <div className="flex items-center justify-between bg-[#070707] border border-neutral-850 p-3 rounded-xl text-xs">
          <div className="flex items-center space-x-2">
            <MousePointerClick className="w-4 h-4 text-emerald-400" />
            <span className="text-neutral-400">Registered Clicks:</span>
            <span className="font-black text-white">{post.clicks || 0}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-blue-400" />
            <span className="text-neutral-400">Total Views:</span>
            <span className="font-black text-white">{post.views || 1}</span>
          </div>
        </div>

        {/* Sharable Link Input with One-Click Copy */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">
            Direct Sharable Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-[#050505] border border-neutral-800 text-neutral-200 text-xs px-3 py-2.5 rounded-xl font-mono focus:outline-none select-all"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase flex items-center space-x-1.5 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Social Share Buttons */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-wider text-neutral-400">
            Quick Share Platforms
          </label>
          <div className="grid grid-cols-4 gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/40 text-emerald-400 rounded-xl text-center text-[10px] font-black uppercase transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white rounded-xl text-center text-[10px] font-black uppercase transition-colors"
            >
              X / Twitter
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-800/40 text-blue-400 rounded-xl text-center text-[10px] font-black uppercase transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-800/40 text-indigo-400 rounded-xl text-center text-[10px] font-black uppercase transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>

        {/* Visit Preview Link */}
        <div className="pt-2 border-t border-neutral-850 flex items-center justify-between">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-neutral-400 hover:text-red-400 transition-colors flex items-center space-x-1"
          >
            <span>Open Link in New Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
