import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSCAData } from '../../context/SCADataContext';
import { useAuth } from '../../context/AuthContext';
import { StatsCard } from '../../components/common/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Building2, FileCheck, Grid, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AllianceAdminDashboard: React.FC = () => {
  const { alliances, businesses, categories, promotions, approveBusinessApplication, rejectBusinessApplication } = useSCAData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const userAllianceId = currentUser.allianceId || 'all_blr';
  const allianceObj = alliances.find((a) => a.id === userAllianceId) || alliances[0];

  const allianceBusinesses = businesses.filter((b) => b.allianceId === userAllianceId);
  const pendingApps = allianceBusinesses.filter((b) => b.membershipStatus === 'PENDING_APPROVAL');
  const activeMembers = allianceBusinesses.filter((b) => b.membershipStatus === 'ACTIVE');
  const alliancePromotions = promotions.filter((p) => p.allianceId === userAllianceId && p.status === 'LIVE');

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans space-y-6">
      {/* City Alliance Header */}
      <div className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#e50914] bg-red-950/60 px-2.5 py-1 rounded border border-red-800/40">
            Alliance Admin Scope • {allianceObj.city}, {allianceObj.country}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-2">
            {allianceObj.name}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Managing members, applicant onboarding, category exclusivity, and promotions in {allianceObj.city}.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => navigate('/admin/businesses')} variant="secondary" leftIcon={<FileCheck className="w-4 h-4" />}>
            Applications ({pendingApps.length})
          </Button>
          <Button onClick={() => navigate('/admin/categories')} variant="outline" className="bg-[#050505] text-white border-neutral-800">
            Category Map
          </Button>
        </div>
      </div>

      {/* Pending Applications Alert Banner */}
      {pendingApps.length > 0 && (
        <div className="p-4 bg-amber-950/40 border border-amber-800/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>{pendingApps.length} Application(s) Pending Review</strong> in {allianceObj.name}. Review credentials before approving membership.
            </span>
          </div>
          <button
            onClick={() => navigate('/admin/businesses')}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs uppercase transition-colors shrink-0"
          >
            Review Applications
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Alliance Members"
          value={activeMembers.length}
          subtitle="Category Exclusive Owners"
          icon={<Building2 className="w-5 h-5 text-blue-400" />}
          iconBgColor="bg-blue-950/50"
        />
        <StatsCard
          title="Pending Applications"
          value={pendingApps.length}
          subtitle="Awaiting Verification"
          icon={<FileCheck className="w-5 h-5 text-amber-400" />}
          iconBgColor="bg-amber-950/50"
        />
        <StatsCard
          title="Occupied Categories"
          value={allianceObj.occupiedCategoriesCount}
          subtitle={`Out of ${allianceObj.totalCategoriesCount} total slots`}
          icon={<Grid className="w-5 h-5 text-purple-400" />}
          iconBgColor="bg-purple-950/50"
        />
        <StatsCard
          title="Alliance Promotions"
          value={alliancePromotions.length}
          subtitle="AdShare Marketplace"
          icon={<Sparkles className="w-5 h-5 text-emerald-400" />}
          iconBgColor="bg-emerald-950/50"
        />
      </div>

      {/* Pending Applicants Review Section */}
      <Card>
        <CardHeader>
          <CardTitle subtitle={`Review membership requests for ${allianceObj.name}`}>Pending Business Applicants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingApps.length > 0 ? (
            pendingApps.map((app) => (
              <div key={app.id} className="p-4 bg-[#050505] border border-neutral-800 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={app.logo} alt={app.name} className="w-10 h-10 rounded-lg object-cover border border-neutral-800" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">{app.name}</h4>
                    <p className="text-[10px] text-neutral-400">
                      Applied for: <span className="font-bold text-red-500">{app.categoryName}</span> • Owner: {app.ownerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => rejectBusinessApplication(app.id)} className="text-rose-400 hover:text-white">
                    Reject
                  </Button>
                  <Button size="sm" variant="success" onClick={() => approveBusinessApplication(app.id)}>
                    Approve Member
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-neutral-500 bg-[#050505] rounded-xl border border-dashed border-neutral-800">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              No pending applications in {allianceObj.name}.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
