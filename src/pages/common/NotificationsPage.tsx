import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Bell, ExternalLink } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead } = useSCAData();
  const navigate = useNavigate();

  const userNotifs = notifications.filter((n) => n.userId === currentUser.id);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications Center</h1>
        <p className="text-xs text-slate-500 mt-1">
          System events, application approvals, referral updates, and AdShare activity alerts.
        </p>
      </div>

      <Card className="divide-y divide-slate-100">
        {userNotifs.length > 0 ? (
          userNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                navigate(n.link);
              }}
              className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                !n.read ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                </div>
              </div>

              <Button size="sm" variant="ghost" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                View
              </Button>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">No notifications found.</div>
        )}
      </Card>
    </div>
  );
};
