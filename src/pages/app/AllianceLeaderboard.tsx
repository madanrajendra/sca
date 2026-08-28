import React from 'react';
import { Trophy, Award, Crown, Flame, Share2, Users } from 'lucide-react';

export const AllianceLeaderboard: React.FC = () => {
  const leaders = [
    { rank: 1, name: 'Turman Realty', category: 'Real Estate & Brokerage', shares: 84, reach: '34,000', score: '980 PTS' },
    { rank: 2, name: 'ABC Heating & Air', category: 'HVAC & Climate Services', shares: 72, reach: '28,500', score: '890 PTS' },
    { rank: 3, name: 'Premier Insurance', category: 'Commercial Insurance', shares: 65, reach: '24,200', score: '810 PTS' },
    { rank: 4, name: 'Neighborhood Bistro', category: 'Restaurants & Dining', shares: 58, reach: '22,000', score: '740 PTS' },
    { rank: 5, name: 'Summit Mortgage', category: 'Mortgage Lending', shares: 49, reach: '19,800', score: '670 PTS' },
  ];

  return (
    <div className="p-6 md:p-8 bg-[#050505] min-h-screen text-neutral-100 font-sans space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-600/20 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Alliance Contribution Score</span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">ALLIANCE LEADERBOARD</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Recognizing member businesses actively promoting peer campaigns and driving alliance growth.
          </p>
        </div>
      </div>

      <div className="bg-[#0b0b0b] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050505] text-neutral-400 font-bold uppercase border-b border-neutral-800">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Business Member</th>
                <th className="p-4">Category</th>
                <th className="p-4">Campaigns Promoted</th>
                <th className="p-4">Audience Contributed</th>
                <th className="p-4">Network Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-200">
              {leaders.map((leader) => (
                <tr key={leader.rank} className="hover:bg-neutral-900/50">
                  <td className="p-4 font-black">
                    {leader.rank === 1 ? (
                      <span className="flex items-center space-x-1 text-amber-400 font-black">
                        <Crown className="w-4 h-4" />
                        <span>#1</span>
                      </span>
                    ) : (
                      <span className="text-[#e50914] font-bold">#{leader.rank}</span>
                    )}
                  </td>
                  <td className="p-4 font-extrabold text-white uppercase">{leader.name}</td>
                  <td className="p-4 text-neutral-400">{leader.category}</td>
                  <td className="p-4 font-bold text-emerald-400">{leader.shares} Campaigns</td>
                  <td className="p-4 font-bold text-white">{leader.reach}</td>
                  <td className="p-4 font-black text-amber-400">{leader.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
