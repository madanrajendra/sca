import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { ROLE_LABELS } from '../../utils/rbac';

interface TeamRestrictedAccessProps {
  message?: string;
  requiredRole?: string;
}

export const TeamRestrictedAccess: React.FC<TeamRestrictedAccessProps> = ({
  message = "You don't have permission to manage membership.",
  requiredRole = 'BUSINESS_OWNER',
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-inner">
        <ShieldAlert className="w-8 h-8 stroke-[2.5]" />
      </div>

      <span className="px-3 py-1 bg-rose-50 text-rose-700 font-bold text-xs uppercase tracking-widest rounded-full border border-rose-200 mb-2">
        Restricted Team Permission
      </span>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Access Restricted</h1>

      <p className="text-sm text-slate-600 max-w-md mt-2 leading-relaxed font-medium">
        {message}
      </p>

      <div className="mt-4 text-xs bg-slate-100 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl flex items-center gap-2">
        <Lock className="w-4 h-4 text-slate-400" />
        <span>Required Role: <strong className="text-slate-900">{requiredRole}</strong></span>
      </div>

      <div className="mt-6 p-4 bg-white border border-slate-200 rounded-2xl max-w-sm w-full text-left shadow-xs space-y-1">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Current Active Persona</p>
        <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
        <p className="text-xs text-amber-600 font-semibold">{ROLE_LABELS[currentUser.role]}</p>
      </div>

      <div className="mt-6">
        <Button onClick={() => navigate('/team/dashboard')} variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};
