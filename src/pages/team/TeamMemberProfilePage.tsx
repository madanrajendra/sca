import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { AlertBanner } from '../../components/common/AlertBanner';
import { User, Lock, Bell, Save, ShieldAlert, Building2 } from 'lucide-react';

export const TeamMemberProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { businesses } = useSCAData();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];

  // Personal Profile Form State
  const [personalForm, setPersonalForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
  });

  // Password Change Form State
  const [passForm, setPassForm] = useState({
    currentPass: '',
    newPass: '',
    confirmPass: '',
  });

  // Notification Preferences State
  const [notifPrefs, setNotifPrefs] = useState({
    emailReferrals: true,
    emailPromotions: true,
    inAppAlerts: true,
  });

  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Personal Profile & Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, password security, and notification preferences.
        </p>
      </div>

      {savedMsg && (
        <AlertBanner
          variant="success"
          title="Profile Settings Saved"
          message="Your personal settings and notification preferences have been updated."
        />
      )}

      {/* Profile Overview Banner */}
      <Card className="p-5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center border border-amber-400/30 text-lg">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-base font-bold">{currentUser.name}</h2>
            <p className="text-xs text-slate-400">{currentUser.email}</p>
            <p className="text-[11px] text-amber-400 font-semibold mt-0.5">
              Role: Senior Growth & Partnerships Manager @ {activeBiz.name}
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-800 text-slate-300 rounded border border-slate-700">
          TEAM_MEMBER
        </span>
      </Card>

      {/* SECTION 1: Personal Profile */}
      <Card>
        <CardHeader>
          <CardTitle subtitle="Edit your personal details">1. Personal Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={personalForm.name}
                  onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={personalForm.email}
                  onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
            </div>

            {/* Locked Business Ownership Banner */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Associated Business: <strong className="text-slate-900">{activeBiz.name}</strong></span>
              </div>
              <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500" /> Business Ownership Locked
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* SECTION 2: Change Password */}
      <Card>
        <CardHeader>
          <CardTitle subtitle="Update security credentials">2. Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={passForm.currentPass}
                onChange={(e) => setPassForm({ ...passForm, currentPass: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={passForm.newPass}
                  onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={passForm.confirmPass}
                  onChange={(e) => setPassForm({ ...passForm, confirmPass: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="outline" leftIcon={<Lock className="w-4 h-4" />}>
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* SECTION 3: Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle subtitle="Choose when to receive notifications">3. Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <p className="font-bold text-slate-900">Referral Activity Emails</p>
              <p className="text-[11px] text-slate-500">Receive email alerts when new referrals are assigned to you</p>
            </div>
            <input
              type="checkbox"
              checked={notifPrefs.emailReferrals}
              onChange={(e) => setNotifPrefs({ ...notifPrefs, emailReferrals: e.target.checked })}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <p className="font-bold text-slate-900">AdShare Co-Marketing Updates</p>
              <p className="text-[11px] text-slate-500">Notifications when members promote your shared links</p>
            </div>
            <input
              type="checkbox"
              checked={notifPrefs.emailPromotions}
              onChange={(e) => setNotifPrefs({ ...notifPrefs, emailPromotions: e.target.checked })}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
