import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import type { AdSharePromotion } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';
import { Modal } from '../../components/common/Modal';
import { Table, type Column } from '../../components/common/Table';
import { Plus } from 'lucide-react';

export const MyPromotions: React.FC = () => {
  const { currentUser } = useAuth();
  const { promotions, updatePromotionStatus, businesses } = useSCAData();
  const navigate = useNavigate();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];

  const [activeTab, setActiveTab] = useState('ALL');
  const [analyticsPromo, setAnalyticsPromo] = useState<AdSharePromotion | null>(null);

  const myPromos = promotions.filter((p) => p.businessId === activeBiz.id);

  const filteredPromos = myPromos.filter((p) => {
    if (activeTab === 'ALL') return true;
    return p.status === activeTab;
  });

  const columns: Column<AdSharePromotion>[] = [
    {
      header: 'Campaign Title',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.imageUrl} alt={row.title} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
          <div>
            <p className="font-bold text-slate-900 text-xs">{row.title}</p>
            <p className="text-[10px] text-slate-500 line-clamp-1">{row.offer}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Status',
      accessor: (row) => <Badge status={row.status} size="sm" />,
    },
    {
      header: 'Views',
      accessor: (row) => <span className="font-mono text-xs font-semibold">{row.views}</span>,
      sortable: true,
    },
    {
      header: 'Clicks',
      accessor: (row) => <span className="font-mono text-xs font-semibold text-purple-700">{row.clicks}</span>,
      sortable: true,
    },
    {
      header: 'Promoting',
      accessor: (row) => <span className="font-semibold text-xs text-blue-700">{row.membersPromotingCount} members</span>,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setAnalyticsPromo(row)}>
            Analytics
          </Button>
          {row.status === 'LIVE' ? (
            <Button size="sm" variant="ghost" onClick={() => updatePromotionStatus(row.id, 'PAUSED')}>
              Pause
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => updatePromotionStatus(row.id, 'LIVE')}>
              Resume
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My AdShare Promotions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your campaigns, track member co-marketing analytics, and control visibility.
          </p>
        </div>

        <Button onClick={() => navigate('/app/promotions/create')} leftIcon={<Plus className="w-4 h-4" />}>
          Create Promotion
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100">
          <Tabs
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={[
              { id: 'ALL', label: 'All Campaigns', count: myPromos.length },
              { id: 'LIVE', label: 'Live', count: myPromos.filter((p) => p.status === 'LIVE').length },
              { id: 'PAUSED', label: 'Paused', count: myPromos.filter((p) => p.status === 'PAUSED').length },
              { id: 'DRAFT', label: 'Drafts', count: myPromos.filter((p) => p.status === 'DRAFT').length },
            ]}
          />
        </div>

        <Table
          data={filteredPromos}
          columns={columns}
          keyExtractor={(p) => p.id}
          emptyText="No promotions found in this filter."
        />
      </Card>

      {/* Analytics Modal */}
      {analyticsPromo && (
        <Modal
          isOpen={!!analyticsPromo}
          onClose={() => setAnalyticsPromo(null)}
          title={`Analytics: ${analyticsPromo.title}`}
          subtitle="Real-time campaign engagement & attribution breakdown"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Total Views</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{analyticsPromo.views}</p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-center">
                <p className="text-[10px] text-purple-700 uppercase font-semibold">Total Clicks</p>
                <p className="text-xl font-bold text-purple-800 mt-1">{analyticsPromo.clicks}</p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <p className="text-[10px] text-emerald-700 uppercase font-semibold">Members Promoting</p>
                <p className="text-xl font-bold text-emerald-800 mt-1">{analyticsPromo.membersPromotingCount}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Offer CTA:</span>
                <span className="font-semibold">{analyticsPromo.cta}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Destination URL:</span>
                <span className="font-mono text-blue-400">{analyticsPromo.destinationUrl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Campaign Created:</span>
                <span>{analyticsPromo.createdAt}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
