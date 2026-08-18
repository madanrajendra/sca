import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Hexagon, Lock, Mail, Shield, Users, Briefcase, UserCheck } from 'lucide-react';
import { ROLE_DEFAULT_ROUTES } from '../../utils/rbac';

export const Login: React.FC = () => {
  const { loginAs, switchUserAccount } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('rajesh@apextech.io');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAs(email)) {
      navigate('/app/dashboard');
    }
  };

  const handleQuickRoleSelect = (userId: string, roleRouteKey: keyof typeof ROLE_DEFAULT_ROUTES) => {
    switchUserAccount(userId);
    navigate(ROLE_DEFAULT_ROUTES[roleRouteKey]);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-xl shadow-blue-500/30 mb-3">
            <Hexagon className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Spin City Alliance</h1>
          <p className="text-xs text-slate-400 mt-1">Private Business Alliance Network Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white mb-1">Sign In to Your Account</h2>
          <p className="text-xs text-slate-400 mb-6">Enter credentials or choose a quick demo persona below.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Business Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="secondary" className="w-full mt-2">
              Sign In to Dashboard
            </Button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
              Quick Role Test Logins
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickRoleSelect('usr_nat_admin', 'NATIONAL_ADMIN')}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all text-xs group"
              >
                <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-0.5">
                  <Shield className="w-3.5 h-3.5" /> National Admin
                </div>
                <div className="text-[10px] text-slate-400">Sarah Jenkins</div>
              </button>

              <button
                onClick={() => handleQuickRoleSelect('usr_all_admin_blr', 'ALLIANCE_ADMIN')}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all text-xs group"
              >
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-0.5">
                  <Users className="w-3.5 h-3.5" /> Alliance Admin
                </div>
                <div className="text-[10px] text-slate-400">Rohan Deshmukh</div>
              </button>

              <button
                onClick={() => handleQuickRoleSelect('usr_owner_apex', 'BUSINESS_OWNER')}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all text-xs group"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-0.5">
                  <Briefcase className="w-3.5 h-3.5" /> Business Owner
                </div>
                <div className="text-[10px] text-slate-400">Rajesh Kumar</div>
              </button>

              <button
                onClick={() => handleQuickRoleSelect('usr_team_apex', 'TEAM_MEMBER')}
                className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all text-xs group"
              >
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-0.5">
                  <UserCheck className="w-3.5 h-3.5" /> Team Member
                </div>
                <div className="text-[10px] text-slate-400">Sanjay Patel</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6 text-xs text-slate-400">
          Want to register your business in an alliance?{' '}
          <Link to="/signup" className="text-blue-400 font-semibold hover:underline">
            Apply For Alliance Membership
          </Link>
        </div>
      </div>
    </div>
  );
};
