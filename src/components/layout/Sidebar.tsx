import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { ROLE_LABELS } from '../../utils/rbac';
import {
  LayoutDashboard,
  Sparkles,
  Share2,
  ArrowUpRight,
  BarChart3,
  Handshake,
  Calendar,
  BookOpen,
  Trophy,
  Settings,
  ShieldCheck,
  LogOut,
  Bell,
  Building2,
  Grid,
  History,
  Activity,
  CreditCard
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { notifications, businesses } = useSCAData();
  const location = useLocation();

  const unreadCount = notifications.filter((n) => !n.read && n.userId === currentUser.id).length;
  const pendingAppsCount = businesses.filter((b) => b.membershipStatus === 'PENDING_APPROVAL').length;

  let navItems: { label: string; path: string; icon: React.ReactNode; badge?: number | string }[] = [];

  if (currentUser.role === 'NATIONAL_ADMIN' || currentUser.role === 'ALLIANCE_ADMIN') {
    navItems = [
      { label: 'Overview Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Campaign Moderation', path: '/admin/promotions', icon: <Sparkles className="w-4 h-4" /> },
      { label: 'Member Approvals', path: '/admin/businesses', icon: <Building2 className="w-4 h-4" />, badge: pendingAppsCount || undefined },
      { label: 'Category Exclusivity', path: '/admin/categories', icon: <Grid className="w-4 h-4" /> },
      { label: 'Payments', path: '/admin/payments', icon: <CreditCard className="w-4 h-4" /> },
      { label: 'Alliance Directory', path: '/app/directory', icon: <BookOpen className="w-4 h-4" /> },
      { label: 'Promote Alliance', path: '/app/promote-alliance', icon: <Share2 className="w-4 h-4" /> },
      { label: 'Network Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
      { label: 'Audit Log', path: '/admin/activity', icon: <History className="w-4 h-4" /> },
      { label: 'Notifications', path: '/app/notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount || undefined },
      { label: 'Settings', path: '/app/settings', icon: <Settings className="w-4 h-4" /> },
    ];
  } else {
    navItems = [
      { label: 'Dashboard', path: '/app/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Marketplace', path: '/app/adshare', icon: <Sparkles className="w-4 h-4" /> },
      { label: 'My Campaigns', path: '/app/promotions', icon: <Share2 className="w-4 h-4" /> },
      { label: 'Promoted Campaigns', path: '/app/promoted', icon: <ArrowUpRight className="w-4 h-4" /> },
      { label: 'Analytics', path: '/app/analytics', icon: <BarChart3 className="w-4 h-4" /> },
      { label: 'Referral Hub', path: '/app/referrals', icon: <Handshake className="w-4 h-4" /> },
      { label: 'Marketing Calendar', path: '/app/calendar', icon: <Calendar className="w-4 h-4" /> },
      { label: 'Ad Share Marketplace', path: '/app/feed', icon: <Activity className="w-4 h-4" /> },
      { label: 'Alliance Directory', path: '/app/directory', icon: <BookOpen className="w-4 h-4" /> },
      { label: 'Promote Alliance', path: '/app/promote-alliance', icon: <Share2 className="w-4 h-4" /> },
      { label: 'Leaderboard', path: '/app/leaderboard', icon: <Trophy className="w-4 h-4" /> },
      { label: 'Notifications', path: '/app/notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount || undefined },
      { label: 'Settings', path: '/app/settings', icon: <Settings className="w-4 h-4" /> },
    ];
  }
 
  return (
    <aside className="w-64 bg-[#0b0b0b] text-neutral-300 flex flex-col shrink-0 border-r border-red-600/20 hidden md:flex min-h-[calc(100vh-37px)]">
      <div className="p-5 border-b border-red-600/20 flex items-center gap-3">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-[#e50914] flex items-center justify-center font-black text-sm text-white shadow-lg shadow-red-600/30">
          SCA
        </div>
        <div>
          <h1 className="font-extrabold text-white tracking-wide text-sm uppercase leading-none">
            Spin City Alliance
          </h1>
        </div>
      </div>

      <div className="px-4 py-3 bg-[#050505] border-b border-red-600/20 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-neutral-500 uppercase font-semibold">Alliance Member</p>
          <p className="text-xs font-bold text-white truncate max-w-[140px]">{currentUser.name}</p>
        </div>
        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 uppercase">
          {ROLE_LABELS[currentUser.role]}
        </span>
      </div>

      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/admin' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                isActive
                  ? 'bg-[#e50914] text-white shadow-lg shadow-red-600/30 font-black'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-red-600/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-neutral-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                    isActive ? 'bg-white text-[#e50914]' : 'bg-[#e50914] text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-red-600/20 bg-[#050505] space-y-3">
        <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 p-2 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold leading-tight uppercase">Your audience. Your control. Data private.</span>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold uppercase text-neutral-400 hover:text-red-400 hover:bg-red-950/30 transition-colors border border-neutral-900"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out Session
        </button>
      </div>
    </aside>
  );
};
