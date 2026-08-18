import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import type { AdSharePromotion, PromotionStatus } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table, type Column } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
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
  Sparkles,
  Plus,
  BarChart3,
  Eye,
  Edit,
  Pause,
  Copy,
  Users,
  MousePointerClick,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const MyPromotions: React.FC = () => {
  const { currentUser } = useAuth();
  const { promotions, businesses, togglePausePromotion } = useSCAData();
  const navigate = useNavigate();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [selectedPromoAnalytics, setSelectedPromoAnalytics] = useState<AdSharePromotion | null>(null);

  const myPromotionsList = promotions.filter((p) => p.businessId === activeBiz.id);

  const filteredPromotions = myPromotionsList.filter((p) => {
    if (activeTab === 'ALL') return true;
    return p.status === activeTab;
  });

  // Mock performance over time chart data
  const chartData = [
    { date: 'Aug 10', clicks: 12, results: 2 },
    { date: 'Aug 11', clicks: 24, results: 4 },
    { date: 'Aug 12', clicks: 18, results: 3 },
    { date: 'Aug 13', clicks: 36, results: 8 },
    { date: 'Aug 14', clicks: 45, results: 9 },
    { date: 'Aug 15', clicks: 52, results: 12 },
    { date: 'Aug 16', clicks: 68, results: 15 },
  ];

  const columns: Column<AdSharePromotion>[] = [
    {
      header: 'Promotion Title',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.imageUrl} alt={row.title} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
          <div>
            <p className="font-bold text-slate-900 text-xs line-clamp-1">{row.title}</p>
            <p className="text-[10px] text-slate-500">{row.categoryName}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => <Badge status={row.status} size="sm" />,
    },
    {
      header: 'Views',
      accessor: (row) => <span className="font-mono text-xs font-semibold text-slate-700">{row.views.toLocaleString()}</span>,
    },
    {
      header: 'Clicks',
      accessor: (row) => <span className="font-mono text-xs font-bold text-blue-600">{row.clicks.toLocaleString()}</span>,
    },
    {
      header: 'Results',
      accessor: (row) => <span className="font-mono text-xs font-bold text-emerald-600">{row.resultsCount.toLocaleString()}</span>,
    },
    {
      header: 'Members Promoting',
      accessor: (row) => (
        <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
          {row.membersPromotingCount} members
        </span>
      ),
    },
    {
      header: 'Expiry',
      accessor: (row) => <span className="text-xs text-slate-500 font-mono">{row.endDate}</span>,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedPromoAnalytics(row)}
            title="View Analytics"
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => togglePausePromotion(row.id)}
            title={row.status === 'PAUSED' ? 'Resume' : 'Pause'}
          >
            <Pause className="w-3.5 h-3.5 text-amber-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My AdShare Promotions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your alliance co-marketing campaigns and review performance metrics.
          </p>
        </div>

        <Button onClick={() => navigate('/app/promotions/create')} leftIcon={<Plus className="w-4 h-4" />}>
          + Create Promotion
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {['ALL', 'LIVE', 'DRAFT', 'PENDING', 'PAUSED', 'EXPIRED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl shrink-0 cursor-pointer transition-all ${
              activeTab === tab
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Promotions Table */}
      {filteredPromotions.length > 0 ? (
        <Card>
          <Table data={filteredPromotions} columns={columns} keyExtractor={(p) => p.id} />
        </Card>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">You haven't created any promotions yet.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Publish your first offer to let alliance category partners promote your business.
          </p>
          <Button onClick={() => navigate('/app/promotions/create')} leftIcon={<Plus className="w-4 h-4" />}>
            Create Promotion
          </Button>
        </div>
      )}

      {/* PROMOTION ANALYTICS MODAL */}
      {selectedPromoAnalytics && (
        <Modal
          isOpen={!!selectedPromoAnalytics}
          onClose={() => setSelectedPromoAnalytics(null)}
          title={`Analytics: ${selectedPromoAnalytics.title}`}
          subtitle="Privacy-safe aggregate campaign performance"
          maxWidth="xl"
        >
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Total Views</span>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{selectedPromoAnalytics.views.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="text-[10px] font-bold text-blue-700 uppercase">Total Clicks</span>
                <p className="text-xl font-bold text-blue-900 mt-0.5">{selectedPromoAnalytics.clicks.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Total Results</span>
                <p className="text-xl font-bold text-emerald-900 mt-0.5">{selectedPromoAnalytics.resultsCount.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                <span className="text-[10px] font-bold text-purple-700 uppercase">Members Promoting</span>
                <p className="text-xl font-bold text-purple-900 mt-0.5">{selectedPromoAnalytics.membersPromotingCount}</p>
              </div>
            </div>

            {/* Performance Over Time Chart */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" /> Performance Over Time
              </h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="clicks" stroke="#2563EB" strokeWidth={2.5} name="Clicks" />
                    <Line type="monotone" dataKey="results" stroke="#059669" strokeWidth={2.5} name="Results" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
