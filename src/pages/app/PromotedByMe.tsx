import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import type { PromotedOffer } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table, type Column } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { Sparkles, Copy, Check, Share2, MousePointerClick, TrendingUp } from 'lucide-react';

export const PromotedByMe: React.FC = () => {
  const { currentUser } = useAuth();
  const { promotedOffers, businesses, simulateAdClick } = useSCAData();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];
  const myPromotedList = promotedOffers.filter((p) => p.promoterBusinessId === activeBiz.id);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [analyticsOffer, setAnalyticsOffer] = useState<PromotedOffer | null>(null);

  const copyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns: Column<PromotedOffer>[] = [
    {
      header: 'Partner Business & Promotion',
      accessor: (row) => (
        <div>
          <p className="font-bold text-slate-900 text-xs">{row.promotionTitle}</p>
          <p className="text-[10px] text-slate-500 font-medium">Partner: {row.targetBusinessName}</p>
        </div>
      ),
    },
    {
      header: 'Unique Tracking Link',
      accessor: (row) => (
        <span className="font-mono text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded border border-blue-200">
          {row.trackingCode}
        </span>
      ),
    },
    {
      header: 'Clicks',
      accessor: (row) => <span className="font-mono text-xs font-bold text-slate-900">{row.clicks}</span>,
    },
    {
      header: 'Results',
      accessor: (row) => <span className="font-mono text-xs font-bold text-emerald-600">{row.results}</span>,
    },
    {
      header: 'Date Promoted',
      accessor: (row) => <span className="text-xs text-slate-500">{row.datePromoted}</span>,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyLink(row.fullTrackingUrl, row.id)}
            leftIcon={copiedId === row.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copiedId === row.id ? 'Copied' : 'Copy Link'}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => simulateAdClick(row.trackingCode)}
            title="Simulate Click (Demo)"
            leftIcon={<MousePointerClick className="w-3.5 h-3.5 text-purple-600" />}
          >
            Simulate Click
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Promoted by Me</h1>
        <p className="text-xs text-slate-500 mt-1">
          Partner alliance promotions you have shared with your network and trackable link performance.
        </p>
      </div>

      {myPromotedList.length > 0 ? (
        <Card>
          <Table data={myPromotedList} columns={columns} keyExtractor={(p) => p.id} />
        </Card>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">You haven't promoted any partner offers yet.</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Explore the AdShare Marketplace and generate unique tracking links for alliance partner offers.
          </p>
        </div>
      )}
    </div>
  );
};
