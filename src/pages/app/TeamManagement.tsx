import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table, type Column } from '../../components/common/Table';
import { TeamStatusBadge, type TeamInviteStatus } from '../../components/team/TeamStatusBadge';
import { TeamInviteModal } from '../../components/team/TeamInviteModal';
import { UserPlus, Mail, RefreshCw, UserX, UserCheck } from 'lucide-react';

interface ExtendedTeamMember {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
  status: TeamInviteStatus;
  invitedDate: string;
}

export const TeamManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const { businesses } = useSCAData();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Initial team members showing all 5 Phase 3 states
  const [membersList, setMembersList] = useState<ExtendedTeamMember[]>([
    {
      id: 'tm_1',
      name: 'Sanjay Patel',
      email: 'sanjay@apextech.io',
      roleTitle: 'Senior Growth & Partnerships Manager',
      status: 'INVITATION_ACCEPTED',
      invitedDate: '2024-03-01',
    },
    {
      id: 'tm_2',
      name: 'Neha Verma',
      email: 'neha@apextech.io',
      roleTitle: 'Client Relations Associate',
      status: 'INVITATION_PENDING',
      invitedDate: '2026-08-10',
    },
    {
      id: 'tm_3',
      name: 'Vikram Joshi',
      email: 'vikram.j@apextech.io',
      roleTitle: 'Sales Development Representative',
      status: 'INVITATION_SENT',
      invitedDate: '2026-08-16',
    },
    {
      id: 'tm_4',
      name: 'Anish Kapoor',
      email: 'anish@apextech.io',
      roleTitle: 'Account Executive',
      status: 'INVITATION_EXPIRED',
      invitedDate: '2026-07-01',
    },
    {
      id: 'tm_5',
      name: 'Pooja Nair',
      email: 'pooja@apextech.io',
      roleTitle: 'Former Growth Associate',
      status: 'MEMBER_DEACTIVATED',
      invitedDate: '2024-01-15',
    },
  ]);

  const handleSendInvite = (email: string, roleTitle: string) => {
    const newMember: ExtendedTeamMember = {
      id: `tm_${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      roleTitle,
      status: 'INVITATION_SENT',
      invitedDate: new Date().toISOString().substring(0, 10),
    };
    setMembersList((prev) => [newMember, ...prev]);
  };

  const toggleStatus = (id: string, newStatus: TeamInviteStatus) => {
    setMembersList((prev) => prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m)));
  };

  const columns: Column<ExtendedTeamMember>[] = [
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
      header: 'Invitation Status',
      accessor: (row) => <TeamStatusBadge status={row.status} />,
    },
    {
      header: 'Invited Date',
      accessor: (row) => <span className="text-xs text-slate-500">{row.invitedDate}</span>,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'INVITATION_EXPIRED' && (
            <Button size="sm" variant="outline" onClick={() => toggleStatus(row.id, 'INVITATION_SENT')} leftIcon={<RefreshCw className="w-3 h-3 text-blue-600" />}>
              Resend Invite
            </Button>
          )}
          {row.status === 'INVITATION_ACCEPTED' && (
            <Button size="sm" variant="ghost" onClick={() => toggleStatus(row.id, 'MEMBER_DEACTIVATED')} leftIcon={<UserX className="w-3 h-3 text-rose-500" />}>
              Deactivate
            </Button>
          )}
          {row.status === 'MEMBER_DEACTIVATED' && (
            <Button size="sm" variant="ghost" onClick={() => toggleStatus(row.id, 'INVITATION_ACCEPTED')} leftIcon={<UserCheck className="w-3 h-3 text-emerald-600" />}>
              Reactivate
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Team Members Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Invite team members to represent {activeBiz.name} and track invitation states across the team lifecycle.
          </p>
        </div>

        <Button onClick={() => setShowInviteModal(true)} leftIcon={<UserPlus className="w-4 h-4" />}>
          Invite Team Member
        </Button>
      </div>

      <Card>
        <Table data={membersList} columns={columns} keyExtractor={(m) => m.id} emptyText="No team members found." />
      </Card>

      <TeamInviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSendInvite={handleSendInvite}
        businessName={activeBiz.name}
      />
    </div>
  );
};
