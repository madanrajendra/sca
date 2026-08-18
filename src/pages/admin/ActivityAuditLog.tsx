import React, { useState } from 'react';
import { useSCAData } from '../../context/SCADataContext';
import type { ActivityLog } from '../../types';
import { Card } from '../../components/common/Card';
import { Table, type Column } from '../../components/common/Table';
import { Search, Shield, Clock, FileText } from 'lucide-react';

export const ActivityAuditLog: React.FC = () => {
  const { activityLogs } = useSCAData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = activityLogs.filter((log) => {
    if (statusFilter !== 'ALL' && log.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        log.userName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.entityType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns: Column<ActivityLog>[] = [
    {
      header: 'Timestamp',
      accessor: (row) => <span className="font-mono text-xs text-slate-500">{row.timestamp}</span>,
    },
    {
      header: 'User & Persona Role',
      accessor: (row) => (
        <div>
          <p className="font-bold text-xs text-slate-900">{row.userName}</p>
          <p className="text-[10px] text-blue-600 font-semibold">{row.role}</p>
        </div>
      ),
    },
    {
      header: 'Action',
      accessor: (row) => <span className="font-bold text-xs text-slate-900">{row.action}</span>,
    },
    {
      header: 'Target Entity',
      accessor: (row) => (
        <span className="font-mono text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
          {row.entityType} ({row.entityId})
        </span>
      ),
    },
    {
      header: 'Audit Details',
      accessor: (row) => <span className="text-xs text-slate-600 line-clamp-1">{row.details}</span>,
    },
    {
      header: 'Result Status',
      accessor: (row) =>
        row.status === 'SUCCESS' ? (
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
            SUCCESS
          </span>
        ) : (
          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded-full text-[10px]">
            {row.status}
          </span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Activity Audit Log</h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable system activity log recording platform events, admin approvals, and status transitions.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit logs by user, action, or details..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-800 focus:ring-2 focus:ring-slate-900"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="WARNING">Warning</option>
            <option value="ERROR">Error</option>
          </select>
        </div>
      </div>

      <Card>
        <Table data={filteredLogs} columns={columns} keyExtractor={(log) => log.id} />
      </Card>
    </div>
  );
};
