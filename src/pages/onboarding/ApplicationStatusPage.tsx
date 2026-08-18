import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { AlertBanner } from '../../components/common/AlertBanner';
import { Clock, CheckCircle2, XCircle, ArrowRight, RefreshCw, FileText, ShieldAlert, CreditCard } from 'lucide-react';
import { MembershipStatus } from '../../types';

export const ApplicationStatusPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { businesses, approveBusinessApplication, rejectBusinessApplication } = useSCAData();
  const navigate = useNavigate();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];
  const [overrideStatus, setOverrideStatus] = useState<MembershipStatus | null>(null);

  const currentStatus = overrideStatus || activeBiz.membershipStatus;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
            Application Status Center
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-1">{activeBiz.name}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Category: <span className="text-white font-semibold">{activeBiz.categoryName}</span> ({activeBiz.allianceName})
          </p>
        </div>

        {/* Demo State Switcher for Phase 2 verification */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
          <span className="text-[10px] text-slate-400 font-medium px-1">Test Status:</span>
          <button
            onClick={() => setOverrideStatus('PENDING_APPROVAL')}
            className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
              currentStatus === 'PENDING_APPROVAL' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setOverrideStatus('APPROVED_PAYMENT_REQUIRED')}
            className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
              currentStatus === 'APPROVED_PAYMENT_REQUIRED' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setOverrideStatus('REJECTED')}
            className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
              currentStatus === 'REJECTED' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* STATE 1: PENDING */}
      {currentStatus === 'PENDING_APPROVAL' && (
        <Card className="p-8 text-center space-y-4 animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <Badge status="PENDING_APPROVAL" size="md" />
            <h2 className="text-xl font-bold text-slate-900 mt-2">Your application is under review.</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              The Alliance Admin in <span className="font-semibold text-slate-800">{activeBiz.allianceName}</span> is currently reviewing your company registration and category exclusivity slot.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-sm mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between text-slate-500">
              <span>Submitted Date:</span>
              <span className="text-slate-900 font-medium">{activeBiz.joinedDate}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Category Requested:</span>
              <span className="text-blue-700 font-semibold">{activeBiz.categoryName}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Expected Response:</span>
              <span className="text-slate-900 font-medium">Within 24 Hours</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Button variant="outline" onClick={() => setOverrideStatus('APPROVED_PAYMENT_REQUIRED')} leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}>
              Simulate Approval
            </Button>
          </div>
        </Card>
      )}

      {/* STATE 2: APPROVED / PAYMENT REQUIRED */}
      {(currentStatus === 'APPROVED_PAYMENT_REQUIRED' || currentStatus === 'ACTIVE') && (
        <Card className="p-8 text-center space-y-4 border-emerald-200 bg-emerald-50/30 animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <div>
            <Badge status="APPROVED_PAYMENT_REQUIRED" size="md" />
            <h2 className="text-xl font-bold text-slate-900 mt-2">Your business has been approved! 🎉</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
              Congratulations! Your category slot for <span className="font-bold text-slate-900">{activeBiz.categoryName}</span> in {activeBiz.allianceName} has been approved and locked. Complete your membership payment to activate your active membership.
            </p>
          </div>

          <div className="p-4 bg-white border border-emerald-200 rounded-2xl max-w-sm mx-auto shadow-xs text-left text-xs space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Monthly Membership:</span>
              <span className="font-bold text-slate-900">$199 / month</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Category Status:</span>
              <span className="font-bold text-emerald-700">● Occupied (Locked)</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <Button
              onClick={() => navigate('/app/payment')}
              variant="success"
              size="lg"
              leftIcon={<CreditCard className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Membership Payment
            </Button>
          </div>
        </Card>
      )}

      {/* STATE 3: REJECTED */}
      {currentStatus === 'REJECTED' && (
        <Card className="p-8 text-center space-y-4 border-rose-200 bg-rose-50/30 animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto border border-rose-200">
            <XCircle className="w-9 h-9 stroke-[2.5]" />
          </div>

          <div>
            <Badge status="REJECTED" size="md" />
            <h2 className="text-xl font-bold text-slate-900 mt-2">Your application was not approved.</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
              The Alliance Admin was unable to approve your application at this time based on the provided credentials.
            </p>
          </div>

          {/* Rejection Reason Display */}
          <div className="p-4 bg-white border border-rose-200 rounded-xl max-w-md mx-auto text-left text-xs space-y-1 shadow-xs">
            <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" /> Rejection Reason:
            </h4>
            <p className="text-slate-700 italic bg-rose-50 p-2.5 rounded border border-rose-100 mt-1">
              "{activeBiz.rejectionReason || 'Business license verification check incomplete or service area outside alliance boundary.'}"
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Button onClick={() => navigate('/signup')} variant="primary" leftIcon={<RefreshCw className="w-4 h-4" />}>
              Review & Resubmit Application
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
