import React from 'react';
import { useSCAData } from '../../context/SCADataContext';
import { Card } from '../../components/common/Card';
import { Table, type Column } from '../../components/common/Table';
import type { ActivityLog } from '../../types';
import { History, Shield, User } from 'lucide-react';
import { ROLE_LABELS } from '../../utils/rbac';

export const ActivityAuditLog: React.FC = () => {
  const { activityLogs } = useSCAData();

  const columns: Column<ActivityLog>[] = [
    {
      header: 'Timestamp',
      accessor: (row) => <span className="font-mono text-xs text-slate-500">{row.timestamp}</span>,
      sortable: true,
    },
    {
      header: 'User & Role',
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900 text-xs">{row.userName}</p>
          <span className="text-[10px] text-slate-500 font-semibold">{ROLE_LABELS[row.role]}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Action',
      accessor: (row) => <span className="font-bold text-xs text-blue-700">{row.action}</span>,
      sortable: true,
    },
    {
      header: 'Audit Details',
      accessor: (row) => <span className="text-xs text-slate-600">{row.details}</span>,
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
            row.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Activity Audit Log</h1>
        <p className="text-xs text-slate-500 mt-1">
          Chronological audit trail of all platform transactions, business approvals, referral updates, and promotions.
        </p>
      </div>

      <Card>
        <Table
          data={activityLogs}
          columns={columns}
          keyExtractor={(l) => l.id}
          searchPlaceholder="Search audit logs..."
        />
      </Card>
    </div>
  );
};
