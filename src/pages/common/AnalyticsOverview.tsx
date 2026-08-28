import React from 'react';
import {
  Users,
  Eye,
  MousePointerClick,
  Flame,
  Handshake,
  Award,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

export const AnalyticsOverview: React.FC = () => {
  const performanceTrendData = [
    { date: 'Aug 01', clicks: 240, leads: 28, sales: 8 },
    { date: 'Aug 05', clicks: 380, leads: 42, sales: 12 },
    { date: 'Aug 10', clicks: 520, leads: 68, sales: 19 },
    { date: 'Aug 15', clicks: 710, leads: 95, sales: 26 },
    { date: 'Aug 20', clicks: 890, leads: 114, sales: 34 },
    { date: 'Aug 24', clicks: 1120, leads: 148, sales: 42 },
  ];

  const channelData = [
    { channel: 'Email', reach: 45000, clicks: 2400, leads: 310 },
    { channel: 'Facebook', reach: 22000, clicks: 1100, leads: 140 },
    { channel: 'LinkedIn', reach: 18000, clicks: 850, leads: 98 },
    { channel: 'SMS', reach: 8000, clicks: 420, leads: 44 },
    { channel: 'Flyers / QR', reach: 6400, clicks: 102, leads: 20 },
  ];

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-600/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[#e50914] text-xs font-black uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Campaign Analytics & Network Performance</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">ANALYTICS DASHBOARD</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Track campaign reach, measured clickthroughs, reported leads, and closed referral deals.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 bg-[#0b0b0b] border border-red-600/40 px-4 py-2 rounded-xl text-xs font-bold text-emerald-400 uppercase">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strict Data Separation: Individual Customer Identities Hidden</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-[#0b0b0b] border border-neutral-800 p-4 rounded-xl space-y-1">
          <div className="text-[10px] text-neutral-500 font-bold uppercase">Businesses</div>
          <div className="text-2xl font-black text-white">32</div>
          <span className="text-[9px] bg-neutral-900 text-neutral-400 px-1.5 py-0.5 rounded font-mono uppercase">Participating</span>
        </div>

        <div className="bg-[#0b0b0b] border border-red-600/30 p-4 rounded-xl space-y-1">
          <div className="text-[10px] text-neutral-500 font-bold uppercase">Audience Reach</div>
          <div className="text-2xl font-black text-white">86,400</div>
          <span className="text-[9px] bg-blue-950 text-blue-400 border border-blue-800 px-1.5 py-0.5 rounded font-mono uppercase">Estimated</span>
        </div>

        <div className="bg-[#0b0b0b] border border-emerald-800/40 p-4 rounded-xl space-y-1">
          <div className="text-[10px] text-neutral-500 font-bold uppercase">Clicks</div>
          <div className="text-2xl font-black text-emerald-400">4,872</div>
          <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono uppercase">Measured</span>
        </div>

        <div className="bg-[#0b0b0b] border border-red-600/30 p-4 rounded-xl space-y-1">
          <div className="text-[10px] text-neutral-500 font-bold uppercase">Leads Generated</div>
          <div className="text-2xl font-black text-[#e50914]">612</div>
          <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono uppercase">Measured</span>
        </div>

        <div className="bg-[#0b0b0b] border border-neutral-800 p-4 rounded-xl space-y-1">
          <div className="text-[10px] text-neutral-500 font-bold uppercase">Referrals</div>
          <div className="text-2xl font-black text-white">253</div>
          <span className="text-[9px] bg-purple-950 text-purple-400 border border-purple-800 px-1.5 py-0.5 rounded font-mono uppercase">Reported</span>
        </div>

        <div className="bg-[#0b0b0b] border border-amber-800/40 p-4 rounded-xl space-y-1">
          <div className="text-[10px] text-neutral-500 font-bold uppercase">Sales Reported</div>
          <div className="text-2xl font-black text-amber-400">128</div>
          <span className="text-[9px] bg-amber-950 text-amber-400 border border-amber-800 px-1.5 py-0.5 rounded font-mono uppercase">Reported</span>
        </div>

        <div className="bg-[#0b0b0b] border border-red-600/40 p-4 rounded-xl space-y-1 col-span-2 md:col-span-1">
          <div className="text-[10px] text-neutral-500 font-bold uppercase">Est. Revenue</div>
          <div className="text-2xl font-black text-white">$46,780</div>
          <span className="text-[9px] bg-red-950 text-red-400 border border-red-800 px-1.5 py-0.5 rounded font-mono uppercase">Estimated</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-[#0b0b0b] border border-neutral-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
            <div>
              <h3 className="text-base font-black uppercase text-white">Campaign Performance Over Time</h3>
              <p className="text-xs text-neutral-400">Daily measured clicks, inquiries, and sales</p>
            </div>
            <span className="text-xs font-mono text-[#e50914] font-bold uppercase">Measured Data</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis dataKey="date" stroke="#6b6b6b" fontSize={11} />
                <YAxis stroke="#6b6b6b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#050505', borderColor: '#e50914', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="clicks" stroke="#e50914" strokeWidth={3} dot={{ fill: '#e50914' }} />
                <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                <Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0b0b0b] border border-neutral-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
            <div>
              <h3 className="text-base font-black uppercase text-white">Channel Performance Breakdown</h3>
              <p className="text-xs text-neutral-400">Comparison of reach & measured traffic by medium</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Channel Breakdown</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis dataKey="channel" stroke="#6b6b6b" fontSize={11} />
                <YAxis stroke="#6b6b6b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#050505', borderColor: '#e50914', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="clicks" fill="#e50914" radius={[6, 6, 0, 0]} />
                <Bar dataKey="leads" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
