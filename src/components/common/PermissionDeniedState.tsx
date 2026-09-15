import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../utils/rbac';
import { useNavigate } from 'react-router-dom';

interface PermissionDeniedStateProps {
  requiredPermission?: string;
}

export const PermissionDeniedState: React.FC<PermissionDeniedStateProps> = ({ requiredPermission }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-inner">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <span className="px-3 py-1 bg-rose-50 text-rose-700 font-bold text-xs uppercase tracking-widest rounded-full border border-rose-200 mb-2">
        403 Unauthorized
      </span>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Access Restricted</h1>

      <p className="text-sm text-slate-600 max-w-md mt-2 leading-relaxed">
        You don't have permission to access this page.
      </p>

      {requiredPermission && (
        <div className="mt-3 text-xs bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Required Permission: <code className="font-mono text-slate-900">{requiredPermission}</code></span>
        </div>
      )}

      <div className="mt-6 p-4 bg-white border border-slate-200 rounded-xl max-w-sm w-full text-left shadow-xs">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Current Active Persona</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
            <p className="text-xs text-slate-500">{ROLE_LABELS[currentUser.role]}</p>
          </div>
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Restricted</span>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={() => window.history.back()} variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Go Back
        </Button>
        <Button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          variant="secondary"
        >
          Sign Out & Switch Account
        </Button>
      </div>
    </div>
  );
};
