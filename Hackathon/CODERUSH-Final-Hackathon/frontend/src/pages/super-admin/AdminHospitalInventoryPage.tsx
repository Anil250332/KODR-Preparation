import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchHospitals } from '../../store/slices/hospitalSlice';
import { apiService } from '../../services/apiService';
import { BloodInventoryItem } from '../../types';
import { Building2, Droplet, Search, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

export const AdminHospitalInventoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { hospitals, isLoading: hospitalsLoading } = useAppSelector((state) => state.hospitals);

  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('');
  const [inventoryItems, setInventoryItems] = useState<BloodInventoryItem[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterGroup, setFilterGroup] = useState<string>('ALL');

  useEffect(() => {
    dispatch(fetchHospitals());
  }, [dispatch]);

  // Set default selected hospital once hospitals load
  useEffect(() => {
    if (hospitals.length > 0 && !selectedHospitalId) {
      setSelectedHospitalId(hospitals[0].id);
    }
  }, [hospitals, selectedHospitalId]);

  // Fetch inventory whenever selected hospital changes
  useEffect(() => {
    if (selectedHospitalId) {
      loadHospitalInventory(selectedHospitalId);
    }
  }, [selectedHospitalId]);

  const loadHospitalInventory = async (hospId: string) => {
    setIsLoadingInventory(true);
    try {
      const data = await apiService.getHospitalInventory(hospId);
      setInventoryItems(data);
    } catch (err) {
      console.error('Failed to load hospital inventory:', err);
      setInventoryItems([]);
    } finally {
      setIsLoadingInventory(false);
    }
  };

  const selectedHospital = hospitals.find((h) => h.id === selectedHospitalId);

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.component.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = filterGroup === 'ALL' || item.bloodGroup === filterGroup;
    return matchesSearch && matchesGroup;
  });

  const totalUnits = inventoryItems.reduce((acc, curr) => acc + curr.availableUnits, 0);

  return (
    <div className="space-y-6">
      {/* Header with Hospital Selector Dropdown */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[#0d9488] text-xs font-bold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Multi-Hospital Blood Stock Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hospital Inventory Inspector
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select any registered hospital from the dropdown to inspect its current live blood stock and shelf-life.
            </p>
          </div>

          {/* Big Hospital Dropdown */}
          <div className="w-full md:w-80 shrink-0">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Select Hospital:
            </label>
            <div className="relative">
              <select
                value={selectedHospitalId}
                onChange={(e) => setSelectedHospitalId(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0d9488] transition-all cursor-pointer"
              >
                {hospitals.map((hosp) => (
                  <option key={hosp.id} value={hosp.id}>
                    {hosp.name} ({hosp.city})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Selected Hospital Quick Stats Ribbon */}
        {selectedHospital && (
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[11px] text-slate-400 font-bold uppercase">Hospital Code</p>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">{selectedHospital.licenseNumber}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[11px] text-slate-400 font-bold uppercase">City & State</p>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">{selectedHospital.city}, {selectedHospital.state}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[11px] text-slate-400 font-bold uppercase">Emergency Contact</p>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">{selectedHospital.phone}</p>
            </div>
            <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100">
              <p className="text-[11px] text-[#0d9488] font-bold uppercase">Total Units in Stock</p>
              <p className="text-lg font-black text-[#0d9488] mt-0.5">{totalUnits} Units</p>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search group or component..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0d9488]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
            <button
              key={grp}
              onClick={() => setFilterGroup(grp)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filterGroup === grp
                  ? 'bg-[#0d9488] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {grp}
            </button>
          ))}
          <button
            onClick={() => selectedHospitalId && loadHospitalInventory(selectedHospitalId)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer ml-1"
            title="Refresh Stock"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingInventory ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoadingInventory ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-3 border-[#0d9488] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 mt-3">Fetching real-time inventory from database...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No inventory units recorded</p>
            <p className="text-xs text-slate-400 mt-1">This hospital has not updated its blood units or no match found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Blood Group</th>
                  <th className="py-4 px-6">Component</th>
                  <th className="py-4 px-6">Available Units</th>
                  <th className="py-4 px-6">Reserved</th>
                  <th className="py-4 px-6">Storage Temp</th>
                  <th className="py-4 px-6">Expiry Date</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-2">
                        <span className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 font-black text-xs flex items-center justify-center">
                          {item.bloodGroup}
                        </span>
                        <span className="font-bold text-slate-900">{item.bloodGroup}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700">{item.component}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        item.availableUnits > 15
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : item.availableUnits > 5
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {item.availableUnits} Units
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-500">{item.reservedUnits} Units</td>
                    <td className="py-4 px-6 text-slate-500">{item.storageTemp}</td>
                    <td className="py-4 px-6 font-medium text-slate-600">{item.expiryDate}</td>
                    <td className="py-4 px-6">
                      {item.availableUnits > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <ShieldCheck className="w-3.5 h-3.5" /> Ready for Request
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-rose-600">Depleted</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
