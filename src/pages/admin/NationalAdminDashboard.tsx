import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSCAData } from '../../context/SCADataContext';
import { StatsCard } from '../../components/common/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Table, type Column } from '../../components/common/Table';
import { GlobalAllianceSelector } from '../../components/admin/GlobalAllianceSelector';
import { AllianceDetailsModal } from '../../components/admin/AllianceDetailsModal';
import type { Alliance } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  Globe,
  Building2,
  Users,
  Grid,
  Sparkles,
  Handshake,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const NationalAdminDashboard: React.FC = () => {
  const { alliances, businesses, categories, promotions, referrals, createAlliance } = useSCAData();
  const navigate = useNavigate();

  // Reactive Global Alliance Context State
  const [selectedAllianceId, setSelectedAllianceId] = useState<string>('ALL');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAllianceForDetail, setSelectedAllianceForDetail] = useState<Alliance | null>(null);

  // Form state for New Alliance
  const [newAllianceForm, setNewAllianceForm] = useState({
    name: '',
    city: '',
    state: '',
    country: 'India',
  });

  // Filter entities reactively by selected alliance context
  const filteredAlliances = alliances.filter((a) => selectedAllianceId === 'ALL' || a.id === selectedAllianceId);
  const filteredBusinesses = businesses.filter((b) => selectedAllianceId === 'ALL' || b.allianceId === selectedAllianceId);
  const filteredPromotions = promotions.filter((p) => selectedAllianceId === 'ALL' || p.allianceId === selectedAllianceId);
  const filteredReferrals = referrals.filter((r) => selectedAllianceId === 'ALL' || r.allianceId === selectedAllianceId);

  // 8 Global Metric Computations
  const totalAlliancesCount = selectedAllianceId === 'ALL' ? alliances.length : 1;
  const totalBusinessesCount = filteredBusinesses.length;
  const activeMembersCount = filteredBusinesses.filter((b) => b.membershipStatus === 'ACTIVE').length;
  const pendingAppsCount = filteredBusinesses.filter((b) => b.membershipStatus === 'PENDING_APPROVAL').length;
  const activePromotionsCount = filteredPromotions.filter((p) => p.status === 'LIVE').length;
  const totalReferralsCount = filteredReferrals.length;
  const referralResultsCount = filteredReferrals.filter((r) => r.status === 'WON').length;
  const openCategoriesCount = categories.reduce((acc, cat) => {
    if (selectedAllianceId === 'ALL') {
      const occupiedInSome = Object.values(cat.allianceMap).filter((st) => st.status === 'OCCUPIED').length;
      return acc + (alliances.length - occupiedInSome);
    } else {
      const st = cat.allianceMap[selectedAllianceId];
      return acc + (st && st.status === 'OCCUPIED' ? 0 : 1);
    }
  }, 0);

  // System Alerts Box Data
  const pendingPromosCount = filteredPromotions.filter((p) => p.status === 'PENDING').length;
  const paymentIssuesCount = filteredBusinesses.filter((b) => b.membershipStatus === 'PAYMENT_FAILED_VIEW_ONLY' || b.membershipStatus === 'LAPSED').length;

  // Recharts Activity Chart Mock Data
  const growthChartData = [
    { month: 'Jan', members: 45, alliances: 3, promotions: 12, referrals: 18 },
    { month: 'Feb', members: 68, alliances: 4, promotions: 24, referrals: 32 },
    { month: 'Mar', members: 92, alliances: 4, promotions: 38, referrals: 45 },
    { month: 'Apr', members: 115, alliances: 5, promotions: 54, referrals: 68 },
    { month: 'May', members: 141, alliances: 5, promotions: 72, referrals: 95 },
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllianceForm.name || !newAllianceForm.city) return;
    createAlliance(newAllianceForm.name, newAllianceForm.city, newAllianceForm.state, newAllianceForm.country);
    setShowCreateModal(false);
    setNewAllianceForm({ name: '', city: '', state: '', country: 'India' });
  };

  const allianceColumns: Column<Alliance>[] = [
    {
      header: 'Alliance Name',
      accessor: (row) => (
        <div>
          <p className="font-bold text-white text-xs uppercase">{row.name}</p>
          <p className="text-[10px] text-neutral-400">{row.city}, {row.country}</p>
        </div>
      ),
    },
    {
      header: 'Active Members',
      accessor: (row) => <span className="font-bold text-xs text-white">{row.memberCount}</span>,
    },
    {
      header: 'Occupied Categories',
      accessor: (row) => (
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
          {row.occupiedCategoriesCount} / {row.totalCategoriesCount}
        </span>
      ),
    },
    {
      header: 'Open Categories',
      accessor: (row) => (
        <span className="text-xs font-semibold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
          {row.totalCategoriesCount - row.occupiedCategoriesCount} open
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
          ● {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <Button size="sm" variant="outline" onClick={() => setSelectedAllianceForDetail(row)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* National Overview Header with Reactive Global Selector */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
            Platform Master Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">National Overview</h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            Monitor and manage the Spin City Alliance platform. Filter statistics reactively by city alliance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
          <GlobalAllianceSelector
            selectedAllianceId={selectedAllianceId}
            onSelectAlliance={setSelectedAllianceId}
          />
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="secondary"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            + Create Alliance
          </Button>
        </div>
      </div>

      {/* SYSTEM ALERTS BOX */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-3.5 bg-amber-950/40 border border-amber-800/40 rounded-xl flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Pending Applications: <strong className="text-white">{pendingAppsCount}</strong></span>
          </div>
          <Button size="sm" variant="ghost" className="text-amber-400 hover:text-white" onClick={() => navigate('/admin/businesses')}>View</Button>
        </div>

        <div className="p-3.5 bg-purple-950/40 border border-purple-800/40 rounded-xl flex items-center justify-between text-xs text-purple-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Pending Promotions: <strong className="text-white">{pendingPromosCount}</strong></span>
          </div>
          <Button size="sm" variant="ghost" className="text-purple-400 hover:text-white" onClick={() => navigate('/admin/promotions')}>Review</Button>
        </div>

        <div className="p-3.5 bg-rose-950/40 border border-rose-800/40 rounded-xl flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Payment Issues: <strong className="text-white">{paymentIssuesCount}</strong></span>
          </div>
          <Button size="sm" variant="ghost" className="text-rose-400 hover:text-white" onClick={() => navigate('/admin/businesses')}>Manage</Button>
        </div>

        <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <Handshake className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Total Referrals Won: <strong className="text-white">{referralResultsCount}</strong></span>
          </div>
          <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-white" onClick={() => navigate('/admin/referrals')}>View</Button>
        </div>
      </div>

      {/* 8 GLOBAL METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3.5 bg-[#0b0b0b] border border-neutral-800 rounded-xl">
          <span className="text-[10px] font-extrabold text-neutral-400 uppercase">Total Alliances</span>
          <p className="text-xl font-black text-white mt-1">{totalAlliancesCount}</p>
        </div>
        <div className="p-3.5 bg-[#0b0b0b] border border-neutral-800 rounded-xl">
          <span className="text-[10px] font-extrabold text-neutral-400 uppercase">Total Businesses</span>
          <p className="text-xl font-black text-white mt-1">{totalBusinessesCount}</p>
        </div>
        <div className="p-3.5 bg-[#0b0b0b] border border-emerald-800/40 rounded-xl">
          <span className="text-[10px] font-extrabold text-emerald-400 uppercase">Active Members</span>
          <p className="text-xl font-black text-emerald-400 mt-1">{activeMembersCount}</p>
        </div>
        <div className="p-3.5 bg-[#0b0b0b] border border-blue-800/40 rounded-xl">
          <span className="text-[10px] font-extrabold text-blue-400 uppercase">Open Categories</span>
          <p className="text-xl font-black text-blue-400 mt-1">{openCategoriesCount}</p>
        </div>
        <div className="p-3.5 bg-[#0b0b0b] border border-purple-800/40 rounded-xl">
          <span className="text-[10px] font-extrabold text-purple-400 uppercase">Active Promos</span>
          <p className="text-xl font-black text-purple-400 mt-1">{activePromotionsCount}</p>
        </div>
        <div className="p-3.5 bg-[#0b0b0b] border border-neutral-800 rounded-xl">
          <span className="text-[10px] font-extrabold text-neutral-400 uppercase">Total Referrals</span>
          <p className="text-xl font-black text-white mt-1">{totalReferralsCount}</p>
        </div>
        <div className="p-3.5 bg-[#0b0b0b] border border-emerald-800/40 rounded-xl">
          <span className="text-[10px] font-extrabold text-emerald-400 uppercase">Referral Won</span>
          <p className="text-xl font-black text-emerald-400 mt-1">{referralResultsCount}</p>
        </div>
        <div className="p-3.5 bg-[#0b0b0b] border border-amber-800/40 rounded-xl">
          <span className="text-[10px] font-extrabold text-amber-400 uppercase">Pending Apps</span>
          <p className="text-xl font-black text-amber-400 mt-1">{pendingAppsCount}</p>
        </div>
      </div>

      {/* RECHARTS ACTIVITY GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle subtitle="Platform-wide registration trend">Member & Alliance Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="members" stroke="#2563EB" strokeWidth={2.5} name="Active Members" />
                  <Line type="monotone" dataKey="alliances" stroke="#059669" strokeWidth={2.5} name="City Alliances" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle subtitle="AdShare and Referral exchange velocity">Promotions & Referral Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growthChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="promotions" fill="#9333EA" radius={[4, 4, 0, 0]} name="Promotions" />
                  <Bar dataKey="referrals" fill="#059669" radius={[4, 4, 0, 0]} name="Referrals" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ALLIANCES TABLE */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle subtitle="Managed city alliances">All City Alliances</CardTitle>
          <Button size="sm" onClick={() => setShowCreateModal(true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Create Alliance
          </Button>
        </CardHeader>
        <CardContent>
          <Table data={filteredAlliances} columns={allianceColumns} keyExtractor={(a) => a.id} />
        </CardContent>
      </Card>

      {/* CREATE ALLIANCE MODAL */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New City Alliance"
          subtitle="Establish a new category-exclusive business alliance"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alliance Name</label>
              <input
                type="text"
                value={newAllianceForm.name}
                onChange={(e) => setNewAllianceForm({ ...newAllianceForm, name: e.target.value })}
                placeholder="e.g. Hyderabad Executive Alliance"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={newAllianceForm.city}
                  onChange={(e) => setNewAllianceForm({ ...newAllianceForm, city: e.target.value })}
                  placeholder="e.g. Hyderabad"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
                <input
                  type="text"
                  value={newAllianceForm.state}
                  onChange={(e) => setNewAllianceForm({ ...newAllianceForm, state: e.target.value })}
                  placeholder="e.g. Telangana"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
              <input
                type="text"
                value={newAllianceForm.country}
                onChange={(e) => setNewAllianceForm({ ...newAllianceForm, country: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Establish Alliance
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ALLIANCE DETAILS MODAL */}
      <AllianceDetailsModal
        alliance={selectedAllianceForDetail}
        onClose={() => setSelectedAllianceForDetail(null)}
      />
    </div>
  );
};
