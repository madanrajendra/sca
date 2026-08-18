import React, { useState } from 'react';
import { useSCAData } from '../../context/SCADataContext';
import { Card } from '../../components/common/Card';
import { Table, type Column } from '../../components/common/Table';
import { Grid, MapPin, Building2, CheckCircle2, Circle } from 'lucide-react';

interface CategoryMatrixItem {
  id: string;
  allianceId: string;
  allianceName: string;
  cityName: string;
  categoryId: string;
  categoryName: string;
  status: 'OCCUPIED' | 'OPEN';
  businessName: string;
}

export const CategoriesAdmin: React.FC = () => {
  const { alliances, categories } = useSCAData();

  const [allianceFilter, setAllianceFilter] = useState('ALL');

  // Build global matrix across all alliances and categories
  const matrixItems: CategoryMatrixItem[] = [];

  alliances.forEach((all) => {
    categories.forEach((cat) => {
      const statusObj = cat.allianceMap[all.id];
      const isOccupied = statusObj && statusObj.status === 'OCCUPIED';

      matrixItems.push({
        id: `${all.id}_${cat.id}`,
        allianceId: all.id,
        allianceName: all.name,
        cityName: all.city,
        categoryId: cat.id,
        categoryName: cat.name,
        status: isOccupied ? 'OCCUPIED' : 'OPEN',
        businessName: isOccupied && statusObj.businessName ? statusObj.businessName : '—',
      });
    });
  });

  const filteredMatrix = matrixItems.filter((item) => {
    if (allianceFilter !== 'ALL' && item.allianceId !== allianceFilter) return false;
    return true;
  });

  const columns: Column<CategoryMatrixItem>[] = [
    {
      header: 'City Alliance',
      accessor: (row) => (
        <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-600" /> {row.allianceName}
        </span>
      ),
    },
    {
      header: 'Category Name',
      accessor: (row) => <span className="font-semibold text-xs text-blue-700">{row.categoryName}</span>,
    },
    {
      header: 'Occupying Member Business',
      accessor: (row) => (
        <span className={`text-xs font-semibold ${row.status === 'OCCUPIED' ? 'text-slate-900' : 'text-slate-400 italic'}`}>
          {row.businessName}
        </span>
      ),
    },
    {
      header: 'Exclusivity Status',
      accessor: (row) =>
        row.status === 'OCCUPIED' ? (
          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px] border border-emerald-200">
            ● Locked & Occupied
          </span>
        ) : (
          <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-full text-[10px] border border-blue-200">
            ○ Available Exclusivity
          </span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Global Category Matrix</h1>
          <p className="text-xs text-slate-500 mt-1">
            Platform-wide category representation and exclusivity mapping across all city alliances.
          </p>
        </div>

        {/* Alliance Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Filter Alliance:</span>
          <select
            value={allianceFilter}
            onChange={(e) => setAllianceFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-slate-900"
          >
            <option value="ALL">All Alliances Matrix</option>
            {alliances.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <Table data={filteredMatrix} columns={columns} keyExtractor={(item) => item.id} />
      </Card>
    </div>
  );
};
