import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { updateHospitalProfile, updateHospitalThunk, fetchHospitals } from '../../store/slices/hospitalSlice';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Save,
  Globe,
  BedDouble,
  FileCheck,
} from 'lucide-react';

export const HospitalProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { hospitals } = useAppSelector((state) => state.hospitals);

  const currentHosp = hospitals.find((h) => h.id === currentUser?.hospitalId) || hospitals[0] || {
    id: currentUser?.hospitalId || 'hosp-1',
    name: currentUser?.hospitalName || 'City Care Hospital',
    licenseNumber: 'DL-BB-2024-0019',
    phone: '+91 98260 11101',
    email: 'admin@citycare.org',
    address: 'Ansari Nagar',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110029',
    totalBeds: 2000,
    hasBloodBank: true,
  };

  const [formData, setFormData] = useState({
    name: currentHosp.name || '',
    licenseNumber: currentHosp.licenseNumber || '',
    phone: currentHosp.phone || '',
    email: currentHosp.email || '',
    address: currentHosp.address || '',
    city: currentHosp.city || '',
    state: currentHosp.state || '',
    pincode: currentHosp.pincode || '',
    totalBeds: currentHosp.totalBeds || 2000,
    hasBloodBank: currentHosp.hasBloodBank ?? true,
  });

  useEffect(() => {
    if (currentHosp) {
      setFormData({
        name: currentHosp.name || '',
        licenseNumber: currentHosp.licenseNumber || '',
        phone: currentHosp.phone || '',
        email: currentHosp.email || '',
        address: currentHosp.address || '',
        city: currentHosp.city || '',
        state: currentHosp.state || '',
        pincode: currentHosp.pincode || '',
        totalBeds: currentHosp.totalBeds || 2000,
        hasBloodBank: currentHosp.hasBloodBank ?? true,
      });
    }
  }, [currentHosp?.id, currentHosp?.name]);

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateHospitalProfile({ id: currentHosp.id, changes: formData }));
    if (currentHosp.id && currentHosp.id.length === 24) {
      await dispatch(updateHospitalThunk({ id: currentHosp.id, changes: formData }));
      dispatch(fetchHospitals());
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hospital Profile & Accreditation</h1>
        <p className="text-xs text-slate-500 mt-1">
          Maintain facility contact credentials, certified blood storage registration and dispatch coordinates
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
        {/* Verification Status Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-900">National Blood Network Verified</p>
              <p className="text-[11px] text-emerald-700">
                License: {currentHosp.licenseNumber} • Certified for PRBC, Whole Blood, Platelets & FFP
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
            ACTIVE
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Hospital Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">State Blood Bank License</label>
              <input
                type="text"
                required
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Physical Facility Address</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">State</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Postal Code</label>
              <input
                type="text"
                required
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Emergency Hotline Phone</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Institutional Contact Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Total Bed Capacity</label>
              <input
                type="number"
                value={formData.totalBeds}
                onChange={(e) => setFormData({ ...formData, totalBeds: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono"
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="bloodBankToggle"
                checked={formData.hasBloodBank}
                onChange={(e) => setFormData({ ...formData, hasBloodBank: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="bloodBankToggle" className="font-semibold text-slate-800">
                Operating 24x7 In-House Certified Blood Bank
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            {isSaved ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Profile changes saved to registry!
              </span>
            ) : (
              <span className="text-xs text-slate-400">All fields verified by super admin</span>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Facility Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
