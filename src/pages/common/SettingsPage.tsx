import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { AlertBanner } from '../../components/common/AlertBanner';
import { Save, Users, TrendingUp, Sparkles, Shield } from 'lucide-react';
import { ROLE_LABELS } from '../../utils/rbac';

export const SettingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { businesses, updateBusinessReach } = useSCAData();

  const myBusinessId = currentUser.businessId || 'biz_apex';
  const myBusiness = businesses.find((b) => b.id === myBusinessId);

  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('Your account settings have been updated successfully.');

  // Personal details
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);

  // Social Reach & Follower Settings
  const [instagramFollowers, setInstagramFollowers] = useState<number>(
    myBusiness?.instagramFollowers ?? 12500
  );
  const [facebookFollowers, setFacebookFollowers] = useState<number>(
    myBusiness?.facebookFollowers ?? 8200
  );
  const [miscellaneousFollowers, setMiscellaneousFollowers] = useState<number>(
    myBusiness?.miscellaneousFollowers ?? 4300
  );

  // Load saved settings from MongoDB sca database on mount
  useEffect(() => {
    fetch(`/api/settings/${myBusinessId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          const s = data.settings;
          setInstagramFollowers(s.instagramFollowers ?? 12500);
          setFacebookFollowers(s.facebookFollowers ?? 8200);
          setMiscellaneousFollowers(s.miscellaneousFollowers ?? 4300);
        }
      })
      .catch((err) => console.warn('Could not load settings from MongoDB:', err));
  }, [myBusinessId]);

  // Real-time calculation of Estimated Reach
  const calculatedEstimatedReach =
    (Number(instagramFollowers) || 0) +
    (Number(facebookFollowers) || 0) +
    (Number(miscellaneousFollowers) || 0);

  const igPercent = calculatedEstimatedReach > 0
    ? Math.round(((Number(instagramFollowers) || 0) / calculatedEstimatedReach) * 100)
    : 33;
  const fbPercent = calculatedEstimatedReach > 0
    ? Math.round(((Number(facebookFollowers) || 0) / calculatedEstimatedReach) * 100)
    : 33;
  const miscPercent = Math.max(0, 100 - igPercent - fbPercent);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      businessId: myBusinessId,
      instagramFollowers: Number(instagramFollowers) || 0,
      facebookFollowers: Number(facebookFollowers) || 0,
      miscellaneousFollowers: Number(miscellaneousFollowers) || 0,
      estimatedReach: calculatedEstimatedReach,
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        updateBusinessReach(myBusinessId, payload);
        setSaveMessage(
          `Settings saved to MongoDB! Estimated reach of ${calculatedEstimatedReach.toLocaleString()} members is now active for ${myBusiness?.name || 'your business'}.`
        );
      } else {
        updateBusinessReach(myBusinessId, payload);
        setSaveMessage('Settings updated locally.');
      }
    } catch (err) {
      console.error('Failed to save to backend:', err);
      updateBusinessReach(myBusinessId, payload);
      setSaveMessage('Settings saved locally.');
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12 text-neutral-100 font-sans">
      {/* Page Title */}
      <div>
        <div className="flex items-center space-x-2 text-red-500 text-xs font-black uppercase tracking-wider mb-1">
          <Shield className="w-4 h-4" />
          <span>Profile & Audience Configuration</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white uppercase">Account & Reach Settings</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Configure personal credentials and social follower channels used to calculate your estimated marketing reach across Spin City Alliance.
        </p>
      </div>

      {saved && (
        <AlertBanner
          variant="success"
          title="Settings Saved to Database"
          message={saveMessage}
        />
      )}

      {/* 1. Social Follower & Estimated Reach Configuration Card */}
      <Card className="border-red-600/30 bg-[#0b0b0b] shadow-2xl">
        <CardHeader className="border-b border-neutral-900 bg-gradient-to-r from-red-950/20 via-neutral-900/10 to-transparent">
          <div className="flex items-center justify-between w-full">
            <CardTitle subtitle="Followers on each channel are used to calculate the estimated reach for your promotional posts">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-red-500" />
                <span className="text-white">Audience Reach & Social Channels</span>
              </div>
            </CardTitle>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Current Business</span>
              <span className="text-xs font-black text-red-400 uppercase tracking-tight">{myBusiness?.name || 'Apex Tech Solutions'}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Estimated Reach Live Summary Metric */}
          <div className="bg-[#050505] text-white p-6 rounded-2xl shadow-xl border border-neutral-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  <span>Calculated Estimated Reach</span>
                </div>
                <div className="text-4xl font-black tracking-tight text-white flex items-baseline space-x-2">
                  <span>{calculatedEstimatedReach.toLocaleString()}</span>
                  <span className="text-sm font-semibold text-neutral-400">Total Audience</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1.5 max-w-md">
                  This reach is automatically assigned to your newly created ad share campaigns and marketing promotions across alliance members.
                </p>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 min-w-[220px] space-y-2">
                <div className="text-[10px] uppercase font-black tracking-wider text-neutral-400 border-b border-neutral-800 pb-1">
                  Audience Breakdown
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300">Instagram:</span>
                  <span className="font-bold text-pink-400">{igPercent}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300">Facebook:</span>
                  <span className="font-bold text-blue-400">{fbPercent}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300">Miscellaneous:</span>
                  <span className="font-bold text-amber-400">{miscPercent}%</span>
                </div>
              </div>
            </div>

            {/* Segmented Distribution Bar */}
            <div className="mt-5 space-y-1.5">
              <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden flex border border-neutral-800">
                <div
                  style={{ width: `${igPercent}%` }}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300"
                  title={`Instagram: ${igPercent}%`}
                />
                <div
                  style={{ width: `${fbPercent}%` }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                  title={`Facebook: ${fbPercent}%`}
                />
                <div
                  style={{ width: `${miscPercent}%` }}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                  title={`Miscellaneous: ${miscPercent}%`}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Instagram Followers */}
              <div className="bg-[#0c0c0c] border border-neutral-800 hover:border-pink-600/60 rounded-xl p-4 space-y-2.5 transition-all">
                <div className="flex items-center space-x-2 text-pink-400 font-bold text-xs uppercase">
                  {/* Instagram SVG Icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wide">
                  Instagram Followers
                </label>
                <input
                  type="number"
                  min="0"
                  value={instagramFollowers}
                  onChange={(e) => setInstagramFollowers(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="e.g. 12500"
                  className="w-full px-3 py-2.5 text-sm font-bold border border-neutral-800 rounded-lg focus:ring-1 focus:ring-pink-500 focus:border-pink-500 bg-[#050505] text-white"
                />
                <span className="text-[10px] text-neutral-500 block">Audience on @profile</span>
              </div>

              {/* Facebook Followers */}
              <div className="bg-[#0c0c0c] border border-neutral-800 hover:border-blue-600/60 rounded-xl p-4 space-y-2.5 transition-all">
                <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase">
                  {/* Facebook SVG Icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wide">
                  Facebook Followers / Likes
                </label>
                <input
                  type="number"
                  min="0"
                  value={facebookFollowers}
                  onChange={(e) => setFacebookFollowers(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="e.g. 8200"
                  className="w-full px-3 py-2.5 text-sm font-bold border border-neutral-800 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-[#050505] text-white"
                />
                <span className="text-[10px] text-neutral-500 block">Page followers & group members</span>
              </div>

              {/* Miscellaneous Followers */}
              <div className="bg-[#0c0c0c] border border-neutral-800 hover:border-amber-600/60 rounded-xl p-4 space-y-2.5 transition-all">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase">
                  <Users className="w-4 h-4" />
                  <span>Miscellaneous</span>
                </div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wide">
                  Miscellaneous Followers
                </label>
                <input
                  type="number"
                  min="0"
                  value={miscellaneousFollowers}
                  onChange={(e) => setMiscellaneousFollowers(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="e.g. 4300"
                  className="w-full px-3 py-2.5 text-sm font-bold border border-neutral-800 rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-[#050505] text-white"
                />
                <span className="text-[10px] text-neutral-500 block">TikTok, LinkedIn, YouTube, Email list</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
                Save Reach & Followers to MongoDB
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2. Personal Details Card */}
      <Card className="bg-[#0b0b0b] border-neutral-800">
        <CardHeader className="border-b border-neutral-900">
          <CardTitle subtitle="Your login credentials and identification across Spin City Alliance">
            <span className="text-white">Personal Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#050505] border border-neutral-800 text-white rounded-lg focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#050505] border border-neutral-800 text-white rounded-lg focus:border-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Assigned RBAC Role</label>
              <input
                type="text"
                disabled
                value={ROLE_LABELS[currentUser.role]}
                className="w-full px-3 py-2 text-xs bg-[#141414] border border-neutral-850 rounded-lg text-neutral-400 font-bold cursor-not-allowed"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
