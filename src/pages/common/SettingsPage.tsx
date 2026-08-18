import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { AlertBanner } from '../../components/common/AlertBanner';
import { Save } from 'lucide-react';
import { ROLE_LABELS } from '../../utils/rbac';

export const SettingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Account Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal account profile, role preferences, and notifications.
        </p>
      </div>

      {saved && <AlertBanner variant="success" title="Settings Saved" message="Your account settings have been updated successfully." />}

      <Card>
        <CardHeader>
          <CardTitle subtitle="Your identity across Spin City Alliance">Personal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned RBAC Role</label>
              <input
                type="text"
                disabled
                value={ROLE_LABELS[currentUser.role]}
                className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-bold cursor-not-allowed"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" leftIcon={<Save className="w-4 h-4" />}>
                Save Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
