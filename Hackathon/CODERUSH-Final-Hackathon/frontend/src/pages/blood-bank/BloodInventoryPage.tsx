import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  addOrUpdateStock,
  setBloodGroupFilter,
  setComponentFilter,
  setSearchQuery,
  fetchHospitalInventory,
  addStockItem,
} from '../../store/slices/inventorySlice';
import { BloodGroup, BloodComponent } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import { SkeletonCard, Skeleton } from '../../components/common/Skeleton';
import {
  Droplet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Calendar,
  Plus,
  Thermometer,
  BookmarkCheck,
  Check,
} from 'lucide-react';

export const BloodInventoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { items, selectedBloodGroupFilter, searchQuery, isLoading } = useAppSelector(
    (state) => state.inventory
  );
  const { hospitals } = useAppSelector((state) => state.hospitals);

  const matchedHosp = hospitals.find((h) => h.id === currentUser?.hospitalId);
  const hospitalId =
    currentUser?.hospitalId && currentUser.hospitalId.length === 24
      ? currentUser.hospitalId
      : matchedHosp?.id || '6ae5bfa3a41657de36e25a1e';
  const hospitalName = currentUser?.hospitalName || matchedHosp?.name || 'Blood Centre';

  useEffect(() => {
    if (hospitalId) {
      dispatch(fetchHospitalInventory(hospitalId));
    }
  }, [dispatch, hospitalId]);

  const [activeTab, setActiveTab] = useState<'ALL' | 'AVAILABLE' | 'RESERVED' | 'CRITICAL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    hospitalId,
    hospitalName,
    bloodGroup: 'O-' as BloodGroup,
    component: 'PRBC' as BloodComponent,
    availableUnits: 10,
    storageTemp: '2°C to 6°C',
    shelfLifeDays: 42,
    expiryDate: '2026-04-15',
  });

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const components: BloodComponent[] = ['Whole Blood', 'PRBC', 'Platelets', 'FFP', 'Cryoprecipitate'];

  const myItems = items.filter((i) => i.hospitalId === hospitalId || items.length <= 8);
  const totalUnitsCount = myItems.reduce((acc, curr) => acc + curr.totalUnits, 0);
  const availableUnitsCount = myItems.reduce((acc, curr) => acc + curr.availableUnits, 0);
  const reservedUnitsCount = myItems.reduce((acc, curr) => acc + curr.reservedUnits, 0);
  const criticalCount = myItems.filter((i) => i.availableUnits < 8).length;

  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    await dispatch(addStockItem({ ...formData, hospitalId }));
    dispatch(fetchHospitalInventory(hospitalId));
  };

  const getHeaderColor = (bg: BloodGroup) => {
    switch (bg) {
      case 'B+':
        return 'bg-gradient-to-r from-blue-600 to-blue-500 text-white';
      case 'AB+':
        return 'bg-gradient-to-r from-purple-600 to-violet-500 text-white';
      case 'A-':
        return 'bg-gradient-to-r from-rose-500 to-pink-500 text-white';
      case 'O-':
        return 'bg-gradient-to-r from-red-600 to-rose-600 text-white';
      case 'O+':
        return 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white';
      case 'A+':
        return 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white';
      case 'B-':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      case 'AB-':
        return 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white';
    }
  };

  const filteredItems = myItems.filter((item) => {
    const matchesSearch =
      item.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.component.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'AVAILABLE') return matchesSearch && item.availableUnits > 0;
    if (activeTab === 'RESERVED') return matchesSearch && item.reservedUnits > 0;
    if (activeTab === 'CRITICAL') return matchesSearch && item.availableUnits < 8;
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Blood Inventory</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage and track blood specimen inventory across units
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-2xl text-xs font-bold shadow-md shadow-teal-700/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Blood Stock</span>
        </button>
      </div>

      {/* 4 Minimalist Stat Cards matching Image 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Units"
          value={totalUnitsCount}
          icon={Droplet}
          color="teal"
        />
        <StatCard
          title="Available"
          value={availableUnitsCount}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Reserved Units"
          value={reservedUnitsCount}
          icon={BookmarkCheck}
          color="blue"
        />
        <StatCard
          title="Critical Alerts"
          value={criticalCount}
          icon={AlertCircle}
          color="rose"
        />
      </div>

      {/* Clean Search and Filter Bar matching Image 2 */}
      <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96 pl-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search by blood group..."
            className="w-full pl-10 pr-4 py-2 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden font-medium"
          />
        </div>

        {/* Filter Pills matching Image 2 */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 px-2">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'AVAILABLE', label: 'Available' },
            { id: 'RESERVED', label: 'Reserved' },
            { id: 'CRITICAL', label: 'Critical' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0d9488] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100/80 bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Blood Group Cards Grid with Curved Colored Headers matching Image 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && filteredItems.length === 0 ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          filteredItems.map((item) => {
            const headerBg = getHeaderColor(item.bloodGroup);
            return (
              <div
                key={item.id}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Colored Curved Header */}
              <div className={`p-6 ${headerBg} relative`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                      <Droplet className="w-5 h-5 fill-white text-white" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-white/80 block">Blood Group</span>
                      <span className="text-2xl font-black text-white tracking-tight">{item.bloodGroup}</span>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold backdrop-blur-xs">
                  {item.component}
                </div>
              </div>

              {/* White Card Body with Dates and Units */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block">Available Units</span>
                    <span className="text-xl font-black text-slate-900 mt-0.5 block">
                      {item.availableUnits} <span className="text-xs text-slate-400 font-normal">Bags</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block">Reserved</span>
                    <span className="text-xl font-black text-amber-600 mt-0.5 block">
                      {item.reservedUnits} <span className="text-xs text-slate-400 font-normal">Locked</span>
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center text-slate-500">
                    <Calendar className="w-4 h-4 text-slate-400 mr-2.5" />
                    <span className="text-[11px]">Collection Date:</span>
                    <span className="ml-auto font-semibold text-slate-700">01/03/2026</span>
                  </div>
                  <div className="flex items-center text-slate-500">
                    <Calendar className="w-4 h-4 text-slate-400 mr-2.5" />
                    <span className="text-[11px]">Expiry Date:</span>
                    <span className="ml-auto font-semibold text-slate-700">{item.expiryDate}</span>
                  </div>
                  <div className="flex items-center text-slate-500">
                    <Thermometer className="w-4 h-4 text-teal-600 mr-2.5" />
                    <span className="text-[11px]">Storage Temp:</span>
                    <span className="ml-auto font-mono font-semibold text-teal-700">{item.storageTemp}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        }))}
      </div>

      {/* Add / Update Stock Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Blood Component Stock"
        subtitle="Record tested and certified blood units into the hospital inventory"
      >
        <form onSubmit={handleStockSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-bold"
              >
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Component Type</label>
              <select
                value={formData.component}
                onChange={(e) => {
                  const comp = e.target.value as BloodComponent;
                  let temp = '2°C to 6°C';
                  let days = 42;
                  if (comp === 'Platelets') {
                    temp = '20°C to 24°C';
                    days = 5;
                  } else if (comp === 'FFP' || comp === 'Cryoprecipitate') {
                    temp = '-18°C or below';
                    days = 365;
                  }
                  setFormData({ ...formData, component: comp, storageTemp: temp, shelfLifeDays: days });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-bold"
              >
                {components.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Available Units</label>
              <input
                type="number"
                min="0"
                required
                value={formData.availableUnits}
                onChange={(e) => setFormData({ ...formData, availableUnits: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Storage Temperature</label>
              <input
                type="text"
                required
                value={formData.storageTemp}
                onChange={(e) => setFormData({ ...formData, storageTemp: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
            <input
              type="date"
              required
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0d9488] text-white font-bold hover:bg-[#0f766e] shadow-md shadow-teal-700/20"
            >
              Save Units to Inventory
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
