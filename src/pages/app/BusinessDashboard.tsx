import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { StatsCard } from '../../components/common/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Sparkles, Handshake, BookOpen, Building2, Grid, MapPin, AlertTriangle, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const BusinessDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { businesses, promotions, promotedOffers, referrals } = useSCAData();
  const navigate = useNavigate();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];

  // Calculate live statistics
  const myPromosCount = promotions.filter((p) => p.businessId === activeBiz.id).length;
  const promosSharedCount = promotedOffers.filter((p) => p.promoterBusinessId === activeBiz.id).length;
  const referralsReceivedCount = referrals.filter((r) => r.receiverBusinessId === activeBiz.id).length;
  const activeOffersCount = activeBiz.currentOffer ? 1 : 0;

  // Pending Referral requiring follow-up
  const pendingReferral = referrals.find(
    (r) => r.receiverBusinessId === activeBiz.id && (r.status === 'SENT' || r.status === 'IN_REVIEW')
  );

  return (
    <div className="space-y-6">
      {/* Business Owner Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge status={activeBiz.membershipStatus} size="md" />
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> {activeBiz.allianceName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Good morning, {activeBiz.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>Category Leader: <strong className="text-white">{activeBiz.categoryName}</strong></span>
              <span>•</span>
              <span>Owner: <strong className="text-slate-300">{activeBiz.ownerName}</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('/app/business')} variant="outline" size="sm" className="bg-slate-800 text-white border-slate-700">
              My Business Profile
            </Button>
            <Button onClick={() => navigate('/app/promotions/create')} variant="primary" size="sm">
              + Create Promotion
            </Button>
          </div>
        </div>
      </div>

      {/* REFERRAL REMINDER CARD */}
      {pendingReferral && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl shrink-0">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                Referral Needs Follow-Up
              </span>
              <h4 className="text-xs font-bold text-slate-900 mt-1">
                Customer: {pendingReferral.customerName} (From {pendingReferral.senderBusinessName})
              </h4>
              <p className="text-[11px] text-slate-600">
                Received: {pendingReferral.dateSent} • Status: <strong className="text-amber-800">{pendingReferral.status}</strong>
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/app/referrals')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View Referral
          </Button>
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="My Promotions"
          value={myPromosCount.toString()}
          subtitle="Published co-marketing offers"
          icon={<Sparkles className="w-5 h-5 text-purple-600" />}
          iconBgColor="bg-purple-50"
        />
        <StatsCard
          title="Promotions Shared"
          value={promosSharedCount.toString()}
          subtitle="Partner offers shared"
          icon={<Handshake className="w-5 h-5 text-blue-600" />}
          iconBgColor="bg-blue-50"
        />
        <StatsCard
          title="Referrals Received"
          value={referralsReceivedCount.toString()}
          subtitle="Customer leads in exchange"
          icon={<BookOpen className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50"
        />
        <StatsCard
          title="Active Offers"
          value={activeOffersCount.toString()}
          subtitle="Alliance directory offer"
          icon={<Tag className="w-5 h-5 text-amber-600" />}
          iconBgColor="bg-amber-50"
        />
      </div>

      {/* Dashboard Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle subtitle="Alliance workspace hubs">Primary Workflows</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/app/adshare')}
              className="p-4 bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-200 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-purple-700">AdShare Marketplace</h4>
              </div>
              <p className="text-[11px] text-slate-500">Discover and promote partner offers with trackable links</p>
            </button>

            <button
              onClick={() => navigate('/app/referrals')}
              className="p-4 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <Handshake className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700">Referral Exchange</h4>
              </div>
              <p className="text-[11px] text-slate-500">Send and receive warm B2B leads with consent</p>
            </button>

            <button
              onClick={() => navigate('/app/directory')}
              className="p-4 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-700">Business Directory</h4>
              </div>
              <p className="text-[11px] text-slate-500">Connect with category leaders in your city alliance</p>
            </button>

            <button
              onClick={() => navigate('/app/team')}
              className="p-4 bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-200 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-700">Team Management</h4>
              </div>
              <p className="text-[11px] text-slate-500">Invite team members and track invitation states</p>
            </button>
          </CardContent>
        </Card>

        {/* Business Category Card */}
        <Card className="bg-slate-900 text-white">
          <CardHeader className="border-slate-800">
            <CardTitle className="text-white" subtitle="Locked Category Exclusivity">My Alliance Slot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">Category Representation</span>
              <p className="text-sm font-bold text-white mt-0.5">{activeBiz.categoryName}</p>
              <p className="text-[11px] text-slate-400 mt-1">Alliance: {activeBiz.allianceName}</p>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              You are the exclusive {activeBiz.categoryName} representative in {activeBiz.allianceName}. No other business in this category can join this alliance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
