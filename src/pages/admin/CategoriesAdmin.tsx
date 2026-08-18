import React, { useState } from 'react';
import { useSCAData } from '../../context/SCADataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Grid, Plus, CheckCircle2, XCircle, Building2, ShieldAlert } from 'lucide-react';

export const CategoriesAdmin: React.FC = () => {
  const { categories, alliances, addCategory } = useSCAData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCategory(catName, catDesc, 'Grid');
    setShowAddModal(false);
    setCatName('');
    setCatDesc('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Category Exclusivity Engine</h1>
          <p className="text-xs text-slate-500 mt-1">
            Global category exclusivity status across all city alliances. Only one business per category per alliance is allowed.
          </p>
        </div>

        <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Category Template
        </Button>
      </div>

      {/* Category Grid Table */}
      <div className="grid grid-cols-1 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="p-5 space-y-3">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{cat.name}</h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
                    ID: {cat.id}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
              </div>
            </div>

            {/* Alliance Exclusivity Status Map */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              {alliances.map((all) => {
                const statusObj = cat.allianceMap[all.id];
                const isOccupied = statusObj && statusObj.status === 'OCCUPIED';

                return (
                  <div
                    key={all.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isOccupied
                        ? 'bg-purple-50/60 border-purple-200'
                        : 'bg-emerald-50/40 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{all.city} Alliance</span>
                      {isOccupied ? (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                          ● Occupied
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          ○ Open Slot
                        </span>
                      )}
                    </div>

                    {isOccupied ? (
                      <div className="mt-2 text-xs font-semibold text-purple-900 flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="truncate">{statusObj.businessName}</span>
                      </div>
                    ) : (
                      <p className="mt-2 text-[11px] text-emerald-700 font-medium">Available for new applicant</p>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Global Category Template"
        subtitle="This category will be made available across all city alliances"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category Title</label>
            <input
              type="text"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g. Cyber Security & Compliance"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              placeholder="Describe scope of services covered under this category..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Category</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
