import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { Role } from '../../types';
import { ROLE_LABELS } from '../../utils/rbac';
import { Shield, Users, Briefcase, UserCheck, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentUser, switchUserRole, switchUserAccount, allDemoUsers } = useAuth();
  const { businesses, simulatePaymentStatusChange } = useSCAData();

  const [isOpen, setIsOpen] = useState(false);

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];

  const roleIcons: Record<Role, React.ReactNode> = {
    NATIONAL_ADMIN: <Shield className="w-3.5 h-3.5 text-purple-400" />,
    ALLIANCE_ADMIN: <Users className="w-3.5 h-3.5 text-blue-400" />,
    BUSINESS_OWNER: <Briefcase className="w-3.5 h-3.5 text-emerald-400" />,
    TEAM_MEMBER: <UserCheck className="w-3.5 h-3.5 text-amber-400" />,
  };

  return (
    <div className="bg-slate-950 text-white text-xs py-1.5 px-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-50 sticky top-0 shadow-md">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
          Interactive Demo Switcher
        </span>
        <span className="text-slate-400 hidden sm:inline">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-300 font-medium">Active Role:</span>
          <span className="inline-flex items-center gap-1 bg-slate-800 px-2.5 py-0.5 rounded-full font-semibold text-slate-200 border border-slate-700">
            {roleIcons[currentUser.role]}
            {ROLE_LABELS[currentUser.role]}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Role Switcher Buttons */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => switchUserAccount('usr_nat_admin')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              currentUser.role === 'NATIONAL_ADMIN' ? 'bg-purple-900/80 text-purple-200 font-bold border border-purple-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            National Admin
          </button>
          <button
            onClick={() => switchUserAccount('usr_all_admin_blr')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              currentUser.role === 'ALLIANCE_ADMIN' ? 'bg-blue-900/80 text-blue-200 font-bold border border-blue-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            Alliance Admin
          </button>
          <button
            onClick={() => switchUserAccount('usr_owner_apex')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              currentUser.role === 'BUSINESS_OWNER' ? 'bg-emerald-900/80 text-emerald-200 font-bold border border-emerald-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            Business Owner
          </button>
          <button
            onClick={() => switchUserAccount('usr_team_apex')}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              currentUser.role === 'TEAM_MEMBER' ? 'bg-amber-900/80 text-amber-200 font-bold border border-amber-700' : 'text-slate-400 hover:text-white'
            }`}
          >
            Team Member
          </button>
        </div>

        {/* Payment Loop Simulator for Business Owner */}
        {currentUser.role === 'BUSINESS_OWNER' && activeBiz && (
          <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400">Payment Loop:</span>
            {activeBiz.membershipStatus === 'ACTIVE' ? (
              <button
                onClick={() => simulatePaymentStatusChange(activeBiz.id, 'PAYMENT_FAILED_VIEW_ONLY')}
                className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-medium underline cursor-pointer"
                title="Simulate card decline to trigger View-Only Mode"
              >
                <AlertTriangle className="w-3 h-3" /> Simulate Payment Failure
              </button>
            ) : (
              <button
                onClick={() => simulatePaymentStatusChange(activeBiz.id, 'ACTIVE')}
                className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium underline cursor-pointer"
                title="Resolve payment issue to restore Active Membership"
              >
                <CheckCircle2 className="w-3 h-3" /> Resolve & Activate
              </button>
            )}
          </div>
        )}

        {/* Dropdown Menu for Mobile */}
        <div className="relative md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-slate-300 hover:text-white"
          >
            Switch Persona <ChevronDown className="w-3 h-3" />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
              {allDemoUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUserAccount(u.id);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-white">{u.name}</div>
                    <div className="text-[10px] text-slate-400">{ROLE_LABELS[u.role]}</div>
                  </div>
                  {currentUser.id === u.id && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
