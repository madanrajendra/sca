import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSCAData } from '../../context/SCADataContext';
import { StatsCard } from '../../components/common/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { AlertBanner } from '../../components/common/AlertBanner';
import { Building2, FileCheck, Grid, Sparkles, Handshake, CheckCircle2, ArrowRight } from 'lucide-react';

export const AllianceAdminDashboard: React.FC = () => {
  const { businesses, categories, promotions, referrals, approveBusinessApplication, rejectBusinessApplication } = useSCAData();
  const navigate = useNavigate();

  const blrAllianceId = 'all_blr';
  const blrBusinesses = businesses.filter((b) => b.allianceId === blrAllianceId);
  const pendingApps = blrBusinesses.filter((b) => b.membershipStatus === 'PENDING_APPROVAL');
  const activeMembers = blrBusinesses.filter((b) => b.membershipStatus === 'ACTIVE');

  return (
    <div className="space-y-6">
      {/* City Alliance Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-950 px-2.5 py-1 rounded border border-blue-800">
            Alliance Admin Scope
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-2">
            Bangalore Business Alliance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Managing members, applicant onboarding, category exclusivity, and promotions in Bangalore.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => navigate('/alliance/applications')} variant="secondary" leftIcon={<FileCheck className="w-4 h-4" />}>
            Applications ({pendingApps.length})
          </Button>
          <Button onClick={() => navigate('/alliance/categories')} variant="outline" className="bg-slate-800 text-white border-slate-700">
            Category Map
          </Button>
        </div>
      </div>

      {/* Pending Applications Alert */}
      {pendingApps.length > 0 && (
        <AlertBanner
          variant="warning"
          title={`${pendingApps.length} Application Pending Review`}
          message="Review company credentials and category exclusivity availability before approving membership."
          actionText="Review Applications"
          onAction={() => navigate('/alliance/applications')}
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Alliance Members"
          value={activeMembers.length}
          subtitle="Category Exclusive Owners"
          icon={<Building2 className="w-5 h-5 text-blue-600" />}
          iconBgColor="bg-blue-50"
        />
        <StatsCard
          title="Pending Applications"
          value={pendingApps.length}
          subtitle="Awaiting Verification"
          icon={<FileCheck className="w-5 h-5 text-amber-600" />}
          iconBgColor="bg-amber-50"
        />
        <StatsCard
          title="Occupied Categories"
          value={28}
          subtitle="Out of 35 total slots"
          icon={<Grid className="w-5 h-5 text-purple-600" />}
          iconBgColor="bg-purple-50"
        />
        <StatsCard
          title="Alliance Promotions"
          value={promotions.filter((p) => p.status === 'LIVE').length}
          subtitle="AdShare Marketplace"
          icon={<Sparkles className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
        />
      </div>

      {/* Pending Applicants Review Section */}
      <Card>
        <CardHeader>
          <CardTitle subtitle="Review membership requests">Pending Business Applicants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingApps.length > 0 ? (
            pendingApps.map((app) => (
              <div key={app.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={app.logo} alt={app.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{app.name}</h4>
                    <p className="text-[10px] text-slate-500">
                      Applied for: <span className="font-semibold text-blue-700">{app.categoryName}</span> • Owner: {app.ownerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => rejectBusinessApplication(app.id)}>
                    Reject
                  </Button>
                  <Button size="sm" variant="success" onClick={() => approveBusinessApplication(app.id)}>
                    Approve Member
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              No pending applications in Bangalore Alliance.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
