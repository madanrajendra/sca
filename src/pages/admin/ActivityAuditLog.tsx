import React, { useState } from 'react';
import { useSCAData } from '../../context/SCADataContext';
import type { ActivityLog } from '../../types';
import { Card } from '../../components/common/Card';
import { Table, type Column } from '../../components/common/Table';
import { Search, Shield, Clock, FileText, UserX, AlertTriangle, Mail, RefreshCw, CheckCircle2 } from 'lucide-react';

interface InactiveAccountPlaceholder {
  id: string;
  businessName: string;
  ownerName: string;
  ownerEmail: string;
  role: string;
  allianceName: string;
  lastLoginDate: string;
  daysInactive: number;
}

export const ActivityAuditLog: React.FC = () => {
  const { activityLogs } = useSCAData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [notifiedUserIds, setNotifiedUserIds] = useState<string[]>([]);

  // Placeholder accounts that haven't logged in recently
  const inactiveAccounts: InactiveAccountPlaceholder[] = [
    {
      id: 'usr_zenith_owner',
      businessName: 'Zenith Media & PR',
      ownerName: 'Karan Malhotra',
      ownerEmail: 'karan@zenithpr.com',
      role: 'Business Owner',
      allianceName: 'Bangalore Business Alliance',
      lastLoginDate: '2026-07-01',
      daysInactive: 70,
    },
    {
      id: 'usr_tx_realty_owner',
      businessName: 'Texas Prime Estates',
      ownerName: 'Sarah Conner',
      ownerEmail: 'sarah@texasprime.com',
      role: 'Business Owner',
      allianceName: 'Spin City Alliance (Austin)',
      lastLoginDate: '2026-07-15',
      daysInactive: 56,
    },
    {
      id: 'usr_nova_owner',
      businessName: 'Nova Biotech Labs',
      ownerName: 'Dr. Suresh Reddy',
      ownerEmail: 'suresh@novabiotech.in',
      role: 'Applicant / Business Owner',
      allianceName: 'Bangalore Business Alliance',
      lastLoginDate: '2026-07-28',
      daysInactive: 43,
    },
    {
      id: 'usr_austin_owner',
      businessName: 'Austin CyberCloud',
      ownerName: 'James Holden',
      ownerEmail: 'james@austincybercloud.com',
      role: 'Business Owner',
      allianceName: 'Spin City Alliance (Austin)',
      lastLoginDate: '2026-08-05',
      daysInactive: 35,
    },
  ];

  const handleSendReminder = (id: string) => {
    setNotifiedUserIds((prev) => [...prev, id]);
  };

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
      accessor: (row) => <span className="font-mono text-xs text-neutral-400">{row.timestamp}</span>,
    },
    {
      header: 'User & Persona Role',
      accessor: (row) => (
        <div>
          <p className="font-bold text-xs text-white">{row.userName}</p>
          <p className="text-[10px] text-red-400 font-bold uppercase">{row.role}</p>
        </div>
      ),
    },
    {
      header: 'Action',
      accessor: (row) => <span className="font-bold text-xs text-white uppercase">{row.action}</span>,
    },
    {
      header: 'Target Entity',
      accessor: (row) => (
        <span className="font-mono text-[10px] text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40 uppercase">
          {row.entityType} ({row.entityId})
        </span>
      ),
    },
    {
      header: 'Audit Details',
      accessor: (row) => <span className="text-xs text-neutral-300 line-clamp-1">{row.details}</span>,
    },
    {
      header: 'Result Status',
      accessor: (row) =>
        row.status === 'SUCCESS' ? (
          <span className="px-2.5 py-0.5 bg-emerald-950/60 text-emerald-400 font-extrabold rounded-full text-[9px] border border-emerald-800/40 uppercase">
            SUCCESS
          </span>
        ) : (
          <span className="px-2.5 py-0.5 bg-rose-950/60 text-rose-400 font-extrabold rounded-full text-[9px] border border-rose-800/40 uppercase">
            {row.status}
          </span>
        ),
    },
  ];

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-600/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[#e50914] text-xs font-black uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Platform Compliance</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">PLATFORM ACTIVITY AUDIT LOG</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Audit system activities, monitor user actions, and manage inactive member account engagement.
          </p>
        </div>
      </div>

      {/* TOP SECTION: ACCOUNTS NOT LOGGED IN RECENTLY */}
      <div className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/50 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                Governance Alert
              </span>
              <h2 className="text-lg font-black uppercase text-white mt-1">Accounts Not Logged In Recently</h2>
            </div>
          </div>
          <span className="text-xs text-neutral-400 font-semibold">
            {inactiveAccounts.length} inactive member accounts detected (30+ days offline)
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {inactiveAccounts.map((acc) => {
            const isNotified = notifiedUserIds.includes(acc.id);

            return (
              <div
                key={acc.id}
                className="bg-[#050505] border border-neutral-900 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-neutral-800 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[9px] bg-red-950/60 text-red-400 border border-red-800/40 px-2 py-0.5 rounded font-black uppercase">
                      {acc.allianceName}
                    </span>
                    <h3 className="text-sm font-black text-white uppercase mt-1.5">{acc.businessName}</h3>
                    <p className="text-xs text-neutral-400">
                      Owner: <strong className="text-neutral-200">{acc.ownerName}</strong> ({acc.ownerEmail})
                    </p>
                  </div>

                  <span className="px-2.5 py-1 bg-amber-950/60 text-amber-400 font-black rounded-lg text-[10px] border border-amber-800/40 uppercase shrink-0">
                    {acc.daysInactive} Days Inactive
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-900">
                  <span className="text-[11px] text-neutral-500 font-mono">Last active: {acc.lastLoginDate}</span>

                  <button
                    onClick={() => handleSendReminder(acc.id)}
                    disabled={isNotified}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                      isNotified
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-default'
                        : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-md'
                    }`}
                  >
                    {isNotified ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Reminder Sent
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5" /> Re-engage Account
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FILTER BAR & AUDIT LOG TABLE */}
      <div className="space-y-4">
        <div className="bg-[#0b0b0b] p-4 rounded-2xl border border-neutral-800 shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit logs by user, action, or details..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#050505] border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-neutral-800 rounded-xl bg-[#050505] font-semibold text-white focus:border-red-600"
            >
              <option value="ALL">All Log Statuses</option>
              <option value="SUCCESS">Success Only</option>
              <option value="WARNING">Warnings</option>
              <option value="ERROR">Errors</option>
            </select>
          </div>
        </div>

        <Card>
          <Table data={filteredLogs} columns={columns} keyExtractor={(log) => log.id} />
        </Card>
      </div>
    </div>
  );
};
