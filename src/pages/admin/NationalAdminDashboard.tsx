import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSCAData } from '../../context/SCADataContext';
import { StatsCard } from '../../components/common/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { AlertBanner } from '../../components/common/AlertBanner';
import { Globe, Building2, Users, Grid, Sparkles, Handshake, TrendingUp, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const NationalAdminDashboard: React.FC = () => {
  const { alliances, businesses, categories, promotions, referrals } = useSCAData();
  const navigate = useNavigate();

  const activeMembersCount = businesses.filter((b) => b.membershipStatus === 'ACTIVE').length;
  const pendingAppsCount = businesses.filter((b) => b.membershipStatus === 'PENDING_APPROVAL').length;
  const paymentProblemCount = businesses.filter((b) => b.membershipStatus === 'PAYMENT_FAILED_VIEW_ONLY').length;

  const totalReferralValue = referrals
    .filter((r) => r.status === 'WON')
    .reduce((sum, r) => sum + (r.recordedValue || 0), 0);

  const growthData = [
    { month: 'Mar', members: 60, referrals: 15 },
    { month: 'Apr', members: 78, referrals: 28 },
    { month: 'May', members: 92, referrals: 45 },
    { month: 'Jun', members: 110, referrals: 62 },
    { month: 'Jul', members: 118, referrals: 89 },
    { month: 'Aug', members: 127, referrals: 112 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-950 px-2.5 py-1 rounded border border-purple-800">
            Global Governance Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-2">
            National Admin Control Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global platform visibility across all city alliances, members, categories, and referral value.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => navigate('/admin/alliances')} variant="secondary" leftIcon={<Globe className="w-4 h-4" />}>
            Manage Alliances
          </Button>
          <Button onClick={() => navigate('/admin/categories')} variant="outline" className="bg-slate-800 text-white border-slate-700">
            Categories Exclusivity
          </Button>
        </div>
      </div>

      {/* Action Alerts */}
      {(pendingAppsCount > 0 || paymentProblemCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingAppsCount > 0 && (
            <AlertBanner
              variant="warning"
              title={`${pendingAppsCount} Business Applications Pending Approval`}
              message="New business applicants are awaiting Alliance Admin review and category exclusivity checks."
              actionText="Review Applications"
              onAction={() => navigate('/alliance/applications')}
            />
          )}

          {paymentProblemCount > 0 && (
            <AlertBanner
              variant="danger"
              title={`${paymentProblemCount} Member Payment Issues`}
              message="Businesses currently in View-Only mode due to payment failure."
              actionText="View Businesses"
              onAction={() => navigate('/admin/businesses')}
            />
          )}
        </div>
      )}

      {/* Global Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total City Alliances"
          value={alliances.length}
          subtitle="Bangalore, Austin, NYC, London"
          icon={<Globe className="w-5 h-5 text-purple-600" />}
          iconBgColor="bg-purple-50"
        />
        <StatsCard
          title="Active Member Businesses"
          value={activeMembersCount}
          subtitle={`${businesses.length} total on platform`}
          icon={<Building2 className="w-5 h-5 text-blue-600" />}
          iconBgColor="bg-blue-50"
        />
        <StatsCard
          title="Live AdShare Promotions"
          value={promotions.filter((p) => p.status === 'LIVE').length}
          subtitle="Active co-marketing offers"
          icon={<Sparkles className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
        />
        <StatsCard
          title="Total Closed Referral Value"
          value={`$${totalReferralValue.toLocaleString()}`}
          subtitle="Tracked B2B deal volume"
          icon={<Handshake className="w-5 h-5 text-amber-600" />}
          iconBgColor="bg-amber-50"
        />
      </div>

      {/* Growth Chart & Quick Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle subtitle="Platform growth over the last 6 months">Member & Referral Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="members" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMembers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle subtitle="Alliance network breakdown">Active City Alliances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alliances.map((all) => (
              <div key={all.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{all.name}</h4>
                  <p className="text-[10px] text-slate-500">{all.city}, {all.country}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-blue-700">{all.memberCount} Members</span>
                  <p className="text-[10px] text-emerald-600 font-semibold">{all.occupiedCategoriesCount} Occupied</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
