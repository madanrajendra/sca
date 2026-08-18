import React, { useState } from 'react';
import { useSCAData } from '../../context/SCADataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table, type Column } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmActionModal } from '../../components/admin/ConfirmActionModal';
import type { Business, User, MembershipStatus } from '../../types';
import { Search, ShieldAlert, UserCheck, UserX, RefreshCw, Trash2, Eye, Building2, User as UserIcon } from 'lucide-react';

export const BusinessesAdmin: React.FC = () => {
  const { businesses, alliances, simulatePaymentStatusChange, approveBusinessApplication, rejectBusinessApplication } = useSCAData();

  const [activeTab, setActiveTab] = useState<'BUSINESSES' | 'USERS'>('BUSINESSES');
  const [search, setSearch] = useState('');
  const [allianceFilter, setAllianceFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & Confirm Dialog state
  const [selectedBizDetail, setSelectedBizDetail] = useState<Business | null>(null);
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // Filter Businesses
  const filteredBusinesses = businesses.filter((b) => {
    if (allianceFilter !== 'ALL' && b.allianceId !== allianceFilter) return false;
    if (statusFilter !== 'ALL' && b.membershipStatus !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.ownerName.toLowerCase().includes(q) ||
        b.categoryName.toLowerCase().includes(q) ||
        b.allianceName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handlers for Destructive Admin Actions
  const handleSuspendBiz = (biz: Business) => {
    setConfirmModalState({
      isOpen: true,
      title: `Suspend Business: ${biz.name}`,
      description: `Are you sure you want to suspend "${biz.name}"? This will place their membership in payment-failed view-only mode and hide their directory profile.`,
      onConfirm: () => simulatePaymentStatusChange(biz.id, 'PAYMENT_FAILED_VIEW_ONLY'),
    });
  };

  const handleActivateBiz = (biz: Business) => {
    simulatePaymentStatusChange(biz.id, 'ACTIVE');
  };

  const bizColumns: Column<Business>[] = [
    {
      header: 'Business Name',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.logo} alt={row.name} className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0" />
          <div>
            <p className="font-bold text-slate-900 text-xs">{row.name}</p>
            <p className="text-[10px] text-slate-500">{row.website}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Alliance',
      accessor: (row) => <span className="font-semibold text-xs text-slate-800">{row.allianceName}</span>,
    },
    {
      header: 'Category',
      accessor: (row) => <span className="font-semibold text-xs text-blue-700">{row.categoryName}</span>,
    },
    {
      header: 'Owner',
      accessor: (row) => (
        <div>
          <p className="font-bold text-xs text-slate-900">{row.ownerName}</p>
          <p className="text-[10px] text-slate-500">{row.ownerEmail}</p>
        </div>
      ),
    },
    {
      header: 'Membership Status',
      accessor: (row) => <Badge status={row.membershipStatus} size="sm" />,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={() => setSelectedBizDetail(row)} title="View Details">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
          </Button>

          {row.membershipStatus === 'PENDING_APPROVAL' && (
            <Button size="sm" variant="outline" onClick={() => approveBusinessApplication(row.id)}>
              Approve
            </Button>
          )}

          {row.membershipStatus === 'ACTIVE' ? (
            <Button size="sm" variant="ghost" onClick={() => handleSuspendBiz(row)} title="Suspend Business">
              <UserX className="w-3.5 h-3.5 text-rose-600" />
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => handleActivateBiz(row)} title="Activate Business">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Businesses & Users</h1>
          <p className="text-xs text-slate-500 mt-1">
            Global management of registered member companies, applications, and account statuses.
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
            placeholder="Search businesses or owners..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={allianceFilter}
            onChange={(e) => setAllianceFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-800 focus:ring-2 focus:ring-slate-900"
          >
            <option value="ALL">All Alliances</option>
            {alliances.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <Table data={filteredBusinesses} columns={bizColumns} keyExtractor={(b) => b.id} />
      </Card>

      {/* BUSINESS DETAILS MODAL */}
      {selectedBizDetail && (
        <Modal
          isOpen={!!selectedBizDetail}
          onClose={() => setSelectedBizDetail(null)}
          title={selectedBizDetail.name}
          subtitle={`Category: ${selectedBizDetail.categoryName} • ${selectedBizDetail.allianceName}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-4 bg-slate-900 text-white rounded-xl">
              <img src={selectedBizDetail.logo} alt={selectedBizDetail.name} className="w-14 h-14 rounded-xl object-cover" />
              <div>
                <h3 className="text-base font-bold text-white">{selectedBizDetail.name}</h3>
                <p className="text-xs text-blue-400 font-semibold">{selectedBizDetail.ownerName} ({selectedBizDetail.ownerEmail})</p>
                <div className="mt-1">
                  <Badge status={selectedBizDetail.membershipStatus} size="sm" />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <p>Website: <strong className="text-blue-600">{selectedBizDetail.website}</strong></p>
              <p>Phone: <strong>{selectedBizDetail.phone}</strong></p>
              <p>Service Area: <strong>{selectedBizDetail.serviceArea}</strong></p>
              <p>Joined Date: <strong>{selectedBizDetail.joinedDate}</strong></p>
            </div>
          </div>
        </Modal>
      )}

      {/* CONFIRMATION DIALOG FOR DESTRUCTIVE ACTIONS */}
      <ConfirmActionModal
        isOpen={confirmModalState.isOpen}
        onClose={() => setConfirmModalState({ ...confirmModalState, isOpen: false })}
        onConfirm={confirmModalState.onConfirm}
        title={confirmModalState.title}
        description={confirmModalState.description}
      />
    </div>
  );
};
