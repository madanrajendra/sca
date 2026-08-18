import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table, type Column } from '../../components/common/Table';
import type { PromotedOffer } from '../../types';
import { Copy, Check } from 'lucide-react';

export const PromotedByMe: React.FC = () => {
  const { currentUser } = useAuth();
  const { promotedOffers, businesses, simulateAdClick } = useSCAData();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const myPromoted = promotedOffers.filter((po) => po.promoterBusinessId === activeBiz.id);

  const copyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns: Column<PromotedOffer>[] = [
    {
      header: 'Alliance Partner & Offer',
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900 text-xs">{row.targetBusinessName}</p>
          <p className="text-[11px] text-slate-500">{row.promotionTitle}</p>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Unique Tracking Link',
      accessor: (row) => (
        <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
          {row.trackingCode}
        </span>
      ),
    },
    {
      header: 'Clicks Generated',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs text-purple-700">{row.clicks}</span>
          <button
            onClick={() => simulateAdClick(row.trackingCode)}
            className="text-[10px] text-purple-600 hover:underline bg-purple-50 px-1.5 py-0.5 rounded cursor-pointer"
            title="Simulate click"
          >
            +1 Click
          </button>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Date Promoted',
      accessor: (row) => <span className="text-xs text-slate-500">{row.datePromoted}</span>,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => copyLink(row.fullTrackingUrl, row.id)}
          leftIcon={copiedId === row.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        >
          {copiedId === row.id ? 'Copied' : 'Copy Link'}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Promotions Shared by Me</h1>
        <p className="text-xs text-slate-500 mt-1">
          Promotions you have agreed to share for fellow alliance members, along with your trackable referral links.
        </p>
      </div>

      <Card>
        <Table
          data={myPromoted}
          columns={columns}
          keyExtractor={(po) => po.id}
          emptyText="You haven't promoted any member offers yet. Visit the AdShare Marketplace to start promoting!"
        />
      </Card>
    </div>
  );
};
