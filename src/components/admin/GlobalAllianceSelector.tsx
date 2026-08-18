import React from 'react';
import { useSCAData } from '../../context/SCADataContext';
import { MapPin, Globe } from 'lucide-react';

interface GlobalAllianceSelectorProps {
  selectedAllianceId: string;
  onSelectAlliance: (allianceId: string) => void;
}

export const GlobalAllianceSelector: React.FC<GlobalAllianceSelectorProps> = ({
  selectedAllianceId,
  onSelectAlliance,
}) => {
  const { alliances } = useSCAData();

  return (
    <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700 text-xs shrink-0">
      <div className="flex items-center gap-1.5 text-blue-400 font-bold px-2">
        <Globe className="w-4 h-4 text-blue-400" />
        <span>Context:</span>
      </div>

      <select
        value={selectedAllianceId}
        onChange={(e) => onSelectAlliance(e.target.value)}
        className="bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs cursor-pointer"
      >
        <option value="ALL">ALL ALLIANCES (Global View)</option>
        {alliances.map((all) => (
          <option key={all.id} value={all.id}>
            {all.name} ({all.city})
          </option>
        ))}
      </select>
    </div>
  );
};
