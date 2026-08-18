import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { ROLE_LABELS } from '../../utils/rbac';
import {
  LayoutDashboard,
  Globe,
  Building2,
  Users,
  Grid,
  Sparkles,
  Share2,
  Handshake,
  BookOpen,
  UserPlus,
  BarChart3,
  History,
  Bell,
  Settings,
  FileCheck,
  ShieldAlert,
  ArrowUpRight,
  LogOut,
  Hexagon,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { notifications, businesses } = useSCAData();
  const location = useLocation();

  const unreadCount = notifications.filter((n) => !n.read && n.userId === currentUser.id).length;
  const pendingAppsCount = businesses.filter((b) => b.membershipStatus === 'PENDING_APPROVAL').length;

  // Define nav groups based on role
  let navItems: { label: string; path: string; icon: React.ReactNode; badge?: number | string }[] = [];

  if (currentUser.role === 'NATIONAL_ADMIN') {
    navItems = [
      { label: 'Overview Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'All Alliances', path: '/admin/alliances', icon: <Globe className="w-4 h-4" /> },
      { label: 'Businesses', path: '/admin/businesses', icon: <Building2 className="w-4 h-4" /> },
      { label: 'Users & RBAC', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
      { label: 'Categories Exclusivity', path: '/admin/categories', icon: <Grid className="w-4 h-4" /> },
      { label: 'AdShare Promotions', path: '/admin/promotions', icon: <Sparkles className="w-4 h-4" /> },
      { label: 'Referrals Network', path: '/admin/referrals', icon: <Handshake className="w-4 h-4" /> },
      { label: 'Platform Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
      { label: 'Activity Audit Log', path: '/admin/activity', icon: <History className="w-4 h-4" /> },
      { label: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount || undefined },
      { label: 'Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
    ];
  } else if (currentUser.role === 'ALLIANCE_ADMIN') {
    navItems = [
      { label: 'Alliance Dashboard', path: '/alliance', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Applications', path: '/alliance/applications', icon: <FileCheck className="w-4 h-4" />, badge: pendingAppsCount || undefined },
      { label: 'Members', path: '/alliance/members', icon: <Building2 className="w-4 h-4" /> },
      { label: 'Category Exclusivity', path: '/alliance/categories', icon: <Grid className="w-4 h-4" /> },
      { label: 'AdShare Marketplace', path: '/alliance/promotions', icon: <Sparkles className="w-4 h-4" /> },
      { label: 'Alliance Referrals', path: '/alliance/referrals', icon: <Handshake className="w-4 h-4" /> },
      { label: 'Alliance Analytics', path: '/alliance/analytics', icon: <BarChart3 className="w-4 h-4" /> },
      { label: 'Activity Logs', path: '/alliance/activity', icon: <History className="w-4 h-4" /> },
      { label: 'Notifications', path: '/alliance/notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount || undefined },
      { label: 'Settings', path: '/alliance/settings', icon: <Settings className="w-4 h-4" /> },
    ];
  } else if (currentUser.role === 'BUSINESS_OWNER') {
    navItems = [
      { label: 'Dashboard', path: '/app/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'AdShare Marketplace', path: '/app/adshare', icon: <Sparkles className="w-4 h-4" /> },
      { label: 'My Promotions', path: '/app/promotions', icon: <Share2 className="w-4 h-4" /> },
      { label: 'Promoted by Me', path: '/app/promoted', icon: <ArrowUpRight className="w-4 h-4" /> },
      { label: 'Referral Hub', path: '/app/referrals', icon: <Handshake className="w-4 h-4" /> },
      { label: 'Business Directory', path: '/app/directory', icon: <BookOpen className="w-4 h-4" /> },
      { label: 'My Business Profile', path: '/app/business', icon: <Building2 className="w-4 h-4" /> },
      { label: 'Team Management', path: '/app/team', icon: <UserPlus className="w-4 h-4" /> },
      { label: 'Notifications', path: '/app/notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount || undefined },
      { label: 'Settings', path: '/app/settings', icon: <Settings className="w-4 h-4" /> },
    ];
  } else {
    // TEAM_MEMBER
    navItems = [
      { label: 'Dashboard', path: '/team/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'AdShare Marketplace', path: '/team/adshare', icon: <Sparkles className="w-4 h-4" /> },
      { label: 'Promoted by Me', path: '/team/promoted', icon: <ArrowUpRight className="w-4 h-4" /> },
      { label: 'Referral Hub', path: '/team/referrals', icon: <Handshake className="w-4 h-4" /> },
      { label: 'Business Directory', path: '/team/directory', icon: <BookOpen className="w-4 h-4" /> },
      { label: 'Business Info', path: '/team/business', icon: <Building2 className="w-4 h-4" /> },
      { label: 'Notifications', path: '/team/notifications', icon: <Bell className="w-4 h-4" />, badge: unreadCount || undefined },
      { label: 'Settings', path: '/team/settings', icon: <Settings className="w-4 h-4" /> },
    ];
  }

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 hidden md:flex min-h-[calc(100vh-37px)]">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Hexagon className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="font-bold text-white tracking-tight leading-none text-base">Spin City</h1>
          <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest mt-0.5">
            Alliance Network
          </p>
        </div>
      </div>

      {/* Role Badge Indicator */}
      <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-semibold">Logged in as</p>
          <p className="text-xs font-bold text-white truncate max-w-[140px]">{currentUser.name}</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
          {ROLE_LABELS[currentUser.role]}
        </span>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/admin' && item.path !== '/alliance' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Alliance Context Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="text-slate-500 text-[11px]">Alliance Scope</span>
          <span className="text-blue-400 font-semibold text-[11px]">Bangalore (Active)</span>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out Session
        </button>
      </div>
    </aside>
  );
};
