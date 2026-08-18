import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Mail, UserPlus, Shield } from 'lucide-react';

interface TeamInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendInvite: (email: string, roleTitle: string) => void;
  businessName: string;
}

export const TeamInviteModal: React.FC<TeamInviteModalProps> = ({
  isOpen,
  onClose,
  onSendInvite,
  businessName,
}) => {
  const [email, setEmail] = useState('');
  const [roleTitle, setRoleTitle] = useState('Growth & Marketing Associate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onSendInvite(email, roleTitle);
    setEmail('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Team Member"
      subtitle={`Grant team access for ${businessName}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Team Member Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@company.com"
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Role & Job Title</label>
          <select
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 bg-white"
          >
            <option value="Growth & Marketing Associate">Growth & Marketing Associate</option>
            <option value="Sales & Business Development Exec">Sales & Business Development Exec</option>
            <option value="Client Success Manager">Client Success Manager</option>
            <option value="Account Manager">Account Manager</option>
          </select>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs text-slate-600">
          <p className="font-bold text-slate-900 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-600" /> Restricted Role Permissions:
          </p>
          <p className="text-[11px] text-slate-500">
            Team members receive restricted dashboard permissions. Ownership transfer and membership billing admin are automatically restricted.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="secondary" leftIcon={<UserPlus className="w-4 h-4" />}>
            Send Invitation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
