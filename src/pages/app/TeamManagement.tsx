import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Table, type Column } from '../../components/common/Table';
import type { TeamMemberItem } from '../../types';
import { UserPlus, Shield } from 'lucide-react';

export const TeamManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const { teamMembers, inviteTeamMember, businesses } = useSCAData();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    roleTitle: 'Growth & Marketing Associate',
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inviteTeamMember(inviteForm.email, inviteForm.name, inviteForm.roleTitle);
    setShowInviteModal(false);
    setInviteForm({ name: '', email: '', roleTitle: 'Growth & Marketing Associate' });
  };

  const columns: Column<TeamMemberItem>[] = [
    {
      header: 'Team Member',
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900 text-xs">{row.name}</p>
          <p className="text-[10px] text-slate-500">{row.email}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Role Title',
      accessor: (row) => <span className="font-semibold text-xs text-slate-700">{row.roleTitle}</span>,
    },
    {
      header: 'Assigned RBAC Level',
      accessor: () => <Badge variant="info" size="sm">TEAM_MEMBER (Restricted)</Badge>,
    },
    {
      header: 'Status',
      accessor: (row) => <Badge status={row.status} size="sm" />,
    },
    {
      header: 'Invited Date',
      accessor: (row) => <span className="text-xs text-slate-500">{row.invitedDate}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Team Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Invite team members to participate in AdShare promotions and send referrals on behalf of {activeBiz.name}.
          </p>
        </div>

        <Button onClick={() => setShowInviteModal(true)} leftIcon={<UserPlus className="w-4 h-4" />}>
          Invite Team Member
        </Button>
      </div>

      <Card>
        <Table
          data={teamMembers}
          columns={columns}
          keyExtractor={(tm) => tm.id}
          emptyText="No team members invited yet."
        />
      </Card>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite New Team Member"
        subtitle={`Grant restricted Team Member access for ${activeBiz.name}`}
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={inviteForm.name}
              onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
              placeholder="e.g. Neha Sharma"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Business Email</label>
            <input
              type="email"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              placeholder="neha@company.com"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
            <input
              type="text"
              value={inviteForm.roleTitle}
              onChange={(e) => setInviteForm({ ...inviteForm, roleTitle: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-600">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-600" /> Automatic Restricted Role Permissions:
            </p>
            <ul className="list-disc list-inside text-[11px] space-y-0.5 pl-1">
              <li>Can browse AdShare Marketplace & share member tracking links</li>
              <li>Can create & send referrals with customer consent</li>
              <li>Cannot access business payment settings or membership billing</li>
              <li>Cannot invite/remove other team members</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary">
              Send Email Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
