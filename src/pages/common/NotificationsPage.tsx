import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { Card } from '../../components/common/Card';
import { Bell, ExternalLink, Building2, Sparkles, Handshake, CheckCircle2, ShieldAlert } from 'lucide-react';
import { NotificationItem } from '../../types';

export const NotificationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead } = useSCAData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'ALL' | 'BUSINESS' | 'PROMOTED_BUSINESS' | 'REFERRAL'>('ALL');

  // Rich placeholder notification items matching the user's specific request for Business and Promoted Business
  const placeholderNotifications: NotificationItem[] = [
    {
      id: 'notif_p1',
      userId: currentUser.id,
      title: 'Promoted Business Offer Shared',
      message: 'Horizon Realty Group promoted your "AI Readiness Audit" campaign to 14,000 contacts on LinkedIn.',
      timestamp: '10 mins ago',
      read: false,
      link: '/app/promotions',
      type: 'PROMOTION',
    },
    {
      id: 'notif_p2',
      userId: currentUser.id,
      title: 'New Member Business Application',
      message: 'Nova Biotech Labs has applied for Healthcare Category exclusivity in Bangalore Business Alliance.',
      timestamp: '1 hour ago',
      read: false,
      link: '/admin/businesses',
      type: 'APPLICATION',
    },
    {
      id: 'notif_p3',
      userId: currentUser.id,
      title: 'Promoted Business Campaign Live',
      message: 'DesignCraft Studio launched a new AdShare campaign: "3D Virtual Office Fitout Design Package".',
      timestamp: '3 hours ago',
      read: true,
      link: '/app/feed',
      type: 'PROMOTION',
    },
    {
      id: 'notif_p4',
      userId: currentUser.id,
      title: 'Business Account Membership Active',
      message: 'Apex Tech Solutions membership renewed successfully. Category exclusivity locked for IT & Software.',
      timestamp: '1 day ago',
      read: true,
      link: '/app/settings',
      type: 'MEMBERSHIP',
    },
    {
      id: 'notif_p5',
      userId: currentUser.id,
      title: 'Client Referral Closed as Won! 🎉',
      message: 'Horizon Realty Group recorded a $22,000 sale from your referral of CloudScale Inc.',
      timestamp: '2 days ago',
      read: true,
      link: '/app/referrals',
      type: 'REFERRAL',
    },
  ];

  // Merge user notifications with placeholder notifications
  const allNotifs = [...notifications.filter((n) => n.userId === currentUser.id), ...placeholderNotifications];

  const filteredNotifs = allNotifs.filter((n) => {
    if (activeTab === 'BUSINESS') {
      return n.type === 'APPLICATION' || n.title.toLowerCase().includes('business') || n.title.toLowerCase().includes('account');
    }
    if (activeTab === 'PROMOTED_BUSINESS') {
      return n.type === 'PROMOTION' || n.title.toLowerCase().includes('promoted') || n.title.toLowerCase().includes('adshare');
    }
    if (activeTab === 'REFERRAL') {
      return n.type === 'REFERRAL' || n.title.toLowerCase().includes('referral');
    }
    return true;
  });

  const getNotifIcon = (type: NotificationItem['type'], title: string) => {
    if (type === 'APPLICATION' || title.toLowerCase().includes('business')) {
      return <Building2 className="w-4 h-4 text-[#e50914]" />;
    }
    if (type === 'PROMOTION' || title.toLowerCase().includes('promoted')) {
      return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
    if (type === 'REFERRAL') {
      return <Handshake className="w-4 h-4 text-emerald-400" />;
    }
    return <Bell className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-red-600/20 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#e50914] text-xs font-black uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Alerts & Notifications</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">NOTIFICATIONS CENTER</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Stay updated on business applications, promoted business offers, AdShare campaigns, and referral wins.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-[#0b0b0b] p-1 rounded-xl border border-neutral-800 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'ALL' ? 'bg-[#e50914] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab('BUSINESS')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'BUSINESS' ? 'bg-[#e50914] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Business
          </button>
          <button
            onClick={() => setActiveTab('PROMOTED_BUSINESS')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'PROMOTED_BUSINESS' ? 'bg-[#e50914] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Promoted Business
          </button>
          <button
            onClick={() => setActiveTab('REFERRAL')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'REFERRAL' ? 'bg-[#e50914] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Referrals
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl divide-y divide-neutral-900 overflow-hidden shadow-xl">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                navigate(n.link);
              }}
              className={`p-5 hover:bg-neutral-900/60 transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                !n.read ? 'bg-red-950/20 border-l-2 border-[#e50914]' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#050505] border border-neutral-800 rounded-xl shrink-0 mt-0.5">
                  {getNotifIcon(n.type, n.title)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">{n.title}</h4>
                    {!n.read && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#e50914] text-white">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-neutral-500 font-mono block pt-1">{n.timestamp}</span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-[#e50914] text-white flex items-center justify-center transition-colors shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-xs text-neutral-500 font-semibold">
            No notifications found in this view.
          </div>
        )}
      </div>
    </div>
  );
};
