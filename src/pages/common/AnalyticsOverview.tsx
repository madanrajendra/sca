import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { StatsCard } from '../../components/common/StatsCard';
import { Sparkles, MousePointerClick, Handshake, DollarSign } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

export const AnalyticsOverview: React.FC = () => {
  const adshareTrendData = [
    { day: 'Mon', views: 120, clicks: 34, shares: 12 },
    { day: 'Tue', views: 190, clicks: 52, shares: 18 },
    { day: 'Wed', views: 240, clicks: 68, shares: 25 },
    { day: 'Thu', views: 310, clicks: 89, shares: 32 },
    { day: 'Fri', views: 280, clicks: 81, shares: 29 },
    { day: 'Sat', views: 150, clicks: 40, shares: 14 },
    { day: 'Sun', views: 180, clicks: 45, shares: 16 },
  ];

  const referralValueData = [
    { alliance: 'Bangalore', value: 37000 },
    { alliance: 'Austin', value: 42000 },
    { alliance: 'NYC', value: 68000 },
    { alliance: 'London', value: 29000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics & Growth Reporting</h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed metrics tracking AdShare marketplace clicks, tracking link attributions, and referral financial volume.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Impressions" value="4,820" change="+18.4%" icon={<Sparkles className="w-5 h-5 text-blue-600" />} />
        <StatsCard title="Total Ad Clicks" value="1,140" change="+24.1%" icon={<MousePointerClick className="w-5 h-5 text-purple-600" />} />
        <StatsCard title="Referrals Sent" value="84" change="+12.0%" icon={<Handshake className="w-5 h-5 text-emerald-600" />} />
        <StatsCard title="Closed Revenue Value" value="$176,000" change="+31.5%" icon={<DollarSign className="w-5 h-5 text-amber-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle subtitle="Daily impressions & click engagement">AdShare Traffic Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={adshareTrendData}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle subtitle="Closed B2B deal volume by alliance">Referral Value by Alliance ($)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={referralValueData}>
                  <XAxis dataKey="alliance" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
