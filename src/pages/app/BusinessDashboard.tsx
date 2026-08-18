import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { StatsCard } from '../../components/common/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { AlertBanner } from '../../components/common/AlertBanner';
import {
  Sparkles,
  Share2,
  Handshake,
  BookOpen,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  Grid,
} from 'lucide-react';

export const BusinessDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { businesses, promotions, promotedOffers, referrals, simulatePaymentStatusChange } = useSCAData();
  const navigate = useNavigate();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];

  const myPromos = promotions.filter((p) => p.businessId === activeBiz.id);
  const myPromotedShared = promotedOffers.filter((po) => po.promoterBusinessId === activeBiz.id);
  const referralsReceived = referrals.filter((r) => r.receiverBusinessId === activeBiz.id);
  const pendingReferralsCount = referralsReceived.filter((r) => r.status === 'SENT' || r.status === 'IN_REVIEW').length;

  const totalWonValue = referrals
    .filter((r) => (r.receiverBusinessId === activeBiz.id || r.senderBusinessId === activeBiz.id) && r.status === 'WON')
    .reduce((sum, r) => sum + (r.recordedValue || 0), 0);

  return (
    <div className="space-y-6">
      {/* Good Morning Greeting Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge status={activeBiz.membershipStatus} />
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-400" /> {activeBiz.allianceName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Good morning, {activeBiz.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>Owner: {activeBiz.ownerName}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Grid className="w-3 h-3 text-emerald-400" /> Category: {activeBiz.categoryName}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => navigate('/app/promotions/create')}
              variant="secondary"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Promotion
            </Button>
            <Button
              onClick={() => navigate('/app/referrals/create')}
              variant="outline"
              className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
              leftIcon={<Handshake className="w-4 h-4 text-emerald-400" />}
            >
              Send Referral
            </Button>
          </div>
        </div>
      </div>

      {/* MEMBERSHIP LOOP Alert Banner if Payment Problem */}
      {activeBiz.membershipStatus === 'PAYMENT_FAILED_VIEW_ONLY' && (
        <AlertBanner
          variant="danger"
          title="Payment Problem — View-Only Mode Active"
          message="Your monthly membership payment failed. Your business profile is currently hidden from other members in the directory and AdShare marketplace. Resolve payment to restore full active membership."
          actionText="Resolve Payment ($199)"
          onAction={() => simulatePaymentStatusChange(activeBiz.id, 'ACTIVE')}
        />
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="My Active Promotions"
          value={myPromos.length}
          subtitle={`${myPromos.reduce((s, p) => s + p.views, 0)} total views`}
          icon={<Share2 className="w-5 h-5 text-blue-600" />}
          iconBgColor="bg-blue-50"
        />
        <StatsCard
          title="Promotions Shared"
          value={myPromotedShared.length}
          subtitle={`${myPromotedShared.reduce((s, po) => s + po.clicks, 0)} clicks generated`}
          icon={<Sparkles className="w-5 h-5 text-purple-600" />}
          iconBgColor="bg-purple-50"
        />
        <StatsCard
          title="Referrals Received"
          value={referralsReceived.length}
          subtitle={`${pendingReferralsCount} waiting follow-up`}
          icon={<Handshake className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
        />
        <StatsCard
          title="Closed Referral Value"
          value={`$${totalWonValue.toLocaleString()}`}
          subtitle="Recorded value from alliance"
          icon={<Building2 className="w-5 h-5 text-amber-600" />}
          iconBgColor="bg-amber-50"
        />
      </div>

      {/* Content Grid: Needs Attention & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Needs Attention Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle subtitle="Tasks requiring immediate action">Needs Attention</CardTitle>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              {pendingReferralsCount > 0 ? `${pendingReferralsCount} Items` : 'All Clear'}
            </span>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingReferralsCount > 0 ? (
              referralsReceived
                .filter((r) => r.status === 'SENT' || r.status === 'IN_REVIEW')
                .map((r) => (
                  <div
                    key={r.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          Referral Received: {r.customerName}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Sent by <span className="font-semibold text-slate-700">{r.senderBusinessName}</span> • Estimated Value: ${r.estimatedValue?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/app/referrals/${r.id}`)}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Follow Up
                    </Button>
                  </div>
                ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                No pending referrals requiring attention. Great job!
              </div>
            )}

            {/* Expiring Offer Notification */}
            <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">AdShare Marketplace Active</h4>
                  <p className="text-[11px] text-slate-600">
                    Your AI Audit promotion has 8 members actively sharing tracking links.
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate('/app/promotions')}>
                View Performance
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Directory Shortcut */}
        <Card>
          <CardHeader>
            <CardTitle subtitle="Alliance shortcuts">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <button
              onClick={() => navigate('/app/adshare')}
              className="w-full p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-200 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    Explore AdShare Marketplace
                  </h4>
                  <p className="text-[10px] text-slate-500">Promote other member offers</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </button>

            <button
              onClick={() => navigate('/app/directory')}
              className="w-full p-3 bg-slate-50 hover:bg-purple-50/60 border border-slate-200 hover:border-purple-200 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                    Private Business Directory
                  </h4>
                  <p className="text-[10px] text-slate-500">Find category leaders in alliance</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
            </button>

            <button
              onClick={() => navigate('/app/business')}
              className="w-full p-3 bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-200 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                    Edit Business Profile
                  </h4>
                  <p className="text-[10px] text-slate-500">Update logo, description & offer</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
