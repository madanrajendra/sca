import React from 'react';
import { useSCAData } from '../../context/SCADataContext';
import { Card } from '../../components/common/Card';
import { Table, type Column } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import type { Business } from '../../types';

export const BusinessesAdmin: React.FC = () => {
  const { businesses, simulatePaymentStatusChange, approveBusinessApplication } = useSCAData();

  const columns: Column<Business>[] = [
    {
      header: 'Business Name',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.logo} alt={row.name} className="w-9 h-9 rounded-lg object-cover border border-slate-200" />
          <div>
            <p className="font-bold text-slate-900 text-xs">{row.name}</p>
            <p className="text-[10px] text-slate-500">Owner: {row.ownerName} ({row.ownerEmail})</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Alliance',
      accessor: (row) => <span className="text-xs font-semibold text-slate-700">{row.allianceName}</span>,
    },
    {
      header: 'Category Slot',
      accessor: (row) => <span className="text-xs font-bold text-blue-700">{row.categoryName}</span>,
    },
    {
      header: 'Membership Status',
      accessor: (row) => <Badge status={row.membershipStatus} size="sm" />,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {row.membershipStatus === 'PENDING_APPROVAL' && (
            <Button size="sm" variant="success" onClick={() => approveBusinessApplication(row.id)}>
              Approve
            </Button>
          )}
          {row.membershipStatus === 'ACTIVE' && (
            <Button size="sm" variant="danger" onClick={() => simulatePaymentStatusChange(row.id, 'PAYMENT_FAILED_VIEW_ONLY')}>
              Suspend (View-Only)
            </Button>
          )}
          {row.membershipStatus === 'PAYMENT_FAILED_VIEW_ONLY' && (
            <Button size="sm" variant="outline" onClick={() => simulatePaymentStatusChange(row.id, 'ACTIVE')}>
              Reactivate
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Businesses Directory & Oversight</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage member status, view category assignments, and handle payment status state transitions.
        </p>
      </div>

      <Card>
        <Table data={businesses} columns={columns} keyExtractor={(b) => b.id} searchPlaceholder="Search businesses..." />
      </Card>
    </div>
  );
};
