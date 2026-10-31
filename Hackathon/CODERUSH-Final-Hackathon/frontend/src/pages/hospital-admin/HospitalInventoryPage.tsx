import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { apiService } from '../../services/apiService';
import { BloodInventoryItem, BloodGroup, BloodComponent } from '../../types';
import { Modal } from '../../components/common/Modal';
import {
  Droplet,
  Plus,
  Search,
  Filter,
  AlertCircle,
  Calendar,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';

export const HospitalInventoryPage: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const { hospitals } = useAppSelector((state) => state.hospitals);
  const matchedHosp = hospitals.find((h) => h.id === currentUser?.hospitalId);
  const hospitalId = currentUser?.hospitalId || matchedHosp?.id || '6ae5bfa3a41657de36e25a1d';
  const hospitalName = currentUser?.hospitalName || matchedHosp?.name || 'Hospital Blood Bank';

  const [items, setItems] = useState<BloodInventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [newGroup, setNewGroup] = useState<BloodGroup>('O+');
  const [newComponent, setNewComponent] = useState<BloodComponent>('Whole Blood');
  const [newUnits, setNewUnits] = useState<number>(10);
  const [newExpiryDate, setNewExpiryDate] = useState<string>('');
  const [newBatchNumber, setNewBatchNumber] = useState<string>('');

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getHospitalInventory(hospitalId);
      setItems(data);
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [hospitalId]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiService.addInventoryItem({
        hospitalId,
        bloodGroup: newGroup,
        component: newComponent,
        units: newUnits,
        expiryDate: newExpiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        batchNumber: newBatchNumber || `BATCH-${Date.now().toString().slice(-4)}`,
      });
      setIsAddModalOpen(false);
      loadInventory();
    } catch (err) {
      console.error('Failed to add inventory item', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUnits = async (id: string, currentUnits: number, delta: number) => {
    const updated = Math.max(0, currentUnits + delta);
    try {
      await apiService.updateInventoryUnits(id, updated, delta > 0 ? 'Stock Addition' : 'Emergency Allocation');
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, availableUnits: updated, totalUnits: updated } : i))
      );
    } catch (err) {
      console.error('Failed to update units', err);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.bloodGroup.toLowerCase().includes(search.toLowerCase()) ||
      item.component.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = selectedGroup === 'ALL' || item.bloodGroup === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const totalAvailableUnits = items.reduce((acc, curr) => acc + curr.availableUnits, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#0d9488] text-xs font-bold mb-2">
              <Droplet className="w-3.5 h-3.5" />
              <span>Hospital Blood Stock Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hospital Blood Inventory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Complete lekha-jokha of all blood groups and components stored in {hospitalName}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-2xl text-xs font-bold shadow-md shadow-teal-700/20 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Blood Units</span>
            </button>
            <button
              onClick={loadInventory}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100">
            <p className="text-[11px] font-bold text-[#0d9488] uppercase">Total Units in Stock</p>
            <p className="text-xl font-black text-[#0d9488] mt-0.5">{totalAvailableUnits} Units</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Available Blood Groups</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{new Set(items.map((i) => i.bloodGroup)).size} / 8</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Tracked Components</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{items.length} Batches</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Emergency Availability</p>
            <p className="text-xl font-black text-emerald-600 mt-0.5">Ready for Grid</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search group or component..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0d9488]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedGroup === grp
                  ? 'bg-[#0d9488] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-3 border-[#0d9488] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 mt-3">Loading inventory records...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No blood stock entries found</p>
            <p className="text-xs text-slate-400 mt-1">Click "Add Blood Units" to add new inventory records.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Blood Group</th>
                  <th className="py-4 px-6">Component</th>
                  <th className="py-4 px-6">Available Units</th>
                  <th className="py-4 px-6">Storage Temperature</th>
                  <th className="py-4 px-6">Expiry Date</th>
                  <th className="py-4 px-6 text-center">Quick Stock Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 font-black text-xs flex items-center justify-center border border-rose-100">
                          {item.bloodGroup}
                        </span>
                        <span className="font-bold text-slate-900">{item.bloodGroup}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700">{item.component}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black ${
                        item.availableUnits > 10
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                          : item.availableUnits > 0
                          ? 'bg-amber-50 text-amber-800 border border-amber-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {item.availableUnits} Units
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-medium">{item.storageTemp}</td>
                    <td className="py-4 px-6 font-semibold text-slate-600">{item.expiryDate}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateUnits(item.id, item.availableUnits, -1)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Decrease 1 unit"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-slate-700 w-6 text-center">{item.availableUnits}</span>
                        <button
                          onClick={() => handleUpdateUnits(item.id, item.availableUnits, 1)}
                          className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Increase 1 unit"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Blood Units Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Blood Units to Inventory">
        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Blood Group</label>
              <select
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value as BloodGroup)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
                  <option key={grp} value={grp}>{grp}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Component</label>
              <select
                value={newComponent}
                onChange={(e) => setNewComponent(e.target.value as BloodComponent)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              >
                {['Whole Blood', 'PRBC', 'Platelets', 'FFP', 'Cryoprecipitate'].map((cmp) => (
                  <option key={cmp} value={cmp}>{cmp}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Quantity (Units)</label>
              <input
                type="number"
                min="1"
                value={newUnits}
                onChange={(e) => setNewUnits(Number(e.target.value))}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Expiry Date</label>
              <input
                type="date"
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Batch / Lot Number</label>
            <input
              type="text"
              placeholder="e.g. BATCH-2026-081"
              value={newBatchNumber}
              onChange={(e) => setNewBatchNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
