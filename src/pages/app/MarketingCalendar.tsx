import React from 'react';
import { Calendar, Clock, Megaphone, Sparkles, Tag, Plus } from 'lucide-react';

export const MarketingCalendar: React.FC = () => {
  const events = [
    { id: '1', title: 'Free Summer HVAC Inspection Blitz', date: '2026-08-25', business: 'ABC Heating & Air', type: 'CAMPAIGN_START' },
    { id: '2', title: 'Alliance Co-Op Joint Email Blast', date: '2026-08-28', business: 'Austin Alliance', type: 'COMMUNITY_EVENT' },
    { id: '3', title: 'First-Time Homebuyer Webinar Launch', date: '2026-09-02', business: 'Turman Realty', type: 'CAMPAIGN_START' },
    { id: '4', title: 'Fall Home Winterization Season', date: '2026-09-15', business: 'Alliance Seasonal', type: 'SEASONAL' },
  ];

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-600/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-red-500 text-xs font-black uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Co-Op Marketing Schedule</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">MARKETING CALENDAR</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Coordinate campaign drop dates with peer alliance members to maximize audience impact.
          </p>
        </div>

        <button className="adshare-red-btn px-5 py-3 rounded-xl text-xs font-black flex items-center space-x-2 shadow-lg shadow-red-600/30 uppercase">
          <Plus className="w-5 h-5" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="bg-[#0b0b0b] border border-neutral-800 p-5 rounded-2xl flex items-center justify-between gap-4 hover:border-red-600/40 transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-black border border-red-600/40 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-black text-red-500 uppercase">{event.date.split('-')[1]}</span>
                <span className="text-base font-black text-white">{event.date.split('-')[2]}</span>
              </div>
              <div>
                <span className="text-[9px] bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded font-extrabold uppercase">
                  {event.type}
                </span>
                <h3 className="text-base font-black uppercase text-white mt-1">{event.title}</h3>
                <p className="text-xs text-neutral-400">{event.business}</p>
              </div>
            </div>

            <button className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase border border-neutral-800">
              Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
