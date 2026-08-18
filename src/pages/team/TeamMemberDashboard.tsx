import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { StatsCard } from '../../components/common/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Sparkles, Handshake, BookOpen, ShieldCheck, MapPin, Grid, Building2, Lock, ArrowRight } from 'lucide-react';

export const TeamMemberDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { businesses } = useSCAData();
  const navigate = useNavigate();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];

  return (
    <div className="space-y-6">
      {/* Team Member Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                TEAM_MEMBER (Restricted Role)
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> {activeBiz.allianceName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>Business: <strong className="text-white">{activeBiz.name}</strong></span>
              <span>•</span>
              <span>Role: <strong className="text-blue-400">Senior Growth & Partnerships Manager</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 p-3 rounded-xl border border-slate-700 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Permitted Actions Only</span>
          </div>
        </div>
      </div>

      {/* Permitted Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Shared Member Promotions"
          value="2"
          subtitle="Active tracking links"
          icon={<Sparkles className="w-5 h-5 text-purple-600" />}
          iconBgColor="bg-purple-50"
        />
        <StatsCard
          title="Referrals Handled"
          value="1"
          subtitle="In-progress lead"
          icon={<Handshake className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
        />
        <StatsCard
          title="Alliance Directory"
          value="28"
          subtitle="Category leaders available"
          icon={<BookOpen className="w-5 h-5 text-blue-600" />}
          iconBgColor="bg-blue-50"
        />
      </div>

      {/* Shortcuts & Restricted Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle subtitle="Your permitted team tools">Permitted Workspace Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => navigate('/team/adshare')}
              className="w-full p-4 bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-200 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                    AdShare Marketplace (Preview)
                  </h4>
                  <p className="text-[11px] text-slate-500">Promote alliance partner offers with trackable links</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
            </button>

            <button
              onClick={() => navigate('/team/referrals')}
              className="w-full p-4 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                    Referral Exchange (Preview)
                  </h4>
                  <p className="text-[11px] text-slate-500">Send and receive customer leads with consent</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </button>
          </CardContent>
        </Card>

        {/* Restricted Capabilities Box */}
        <Card className="bg-slate-900 text-white">
          <CardHeader className="border-slate-800">
            <CardTitle className="text-white" subtitle="Role boundaries">Owner-Only Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-300">
            <p className="text-[11px] text-slate-400">
              The following features require Business Owner role permissions:
            </p>

            <div className="space-y-2">
              <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-2 text-rose-300">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Membership & Billing Administration</span>
              </div>
              <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-2 text-rose-300">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Team Member Management & Invites</span>
              </div>
              <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-2 text-rose-300">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Business Ownership Transfer</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
