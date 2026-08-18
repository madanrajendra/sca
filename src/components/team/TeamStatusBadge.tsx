import React from 'react';

export type TeamInviteStatus =
  | 'INVITATION_SENT'
  | 'INVITATION_PENDING'
  | 'INVITATION_ACCEPTED'
  | 'INVITATION_EXPIRED'
  | 'MEMBER_DEACTIVATED';

interface TeamStatusBadgeProps {
  status: TeamInviteStatus;
}

export const TeamStatusBadge: React.FC<TeamStatusBadgeProps> = ({ status }) => {
  const styles: Record<TeamInviteStatus, { bg: string; text: string; border: string; label: string }> = {
    INVITATION_SENT: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      label: 'Invitation Sent',
    },
    INVITATION_PENDING: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      label: 'Invitation Pending',
    },
    INVITATION_ACCEPTED: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      label: 'Invitation Accepted',
    },
    INVITATION_EXPIRED: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      label: 'Invitation Expired',
    },
    MEMBER_DEACTIVATED: {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      border: 'border-gray-200',
      label: 'Member Deactivated',
    },
  };

  const curr = styles[status] || styles.INVITATION_ACCEPTED;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${curr.bg} ${curr.text} ${curr.border}`}>
      {curr.label}
    </span>
  );
};
