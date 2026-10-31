import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  verifyHospital,
  suspendHospital,
  addHospital,
  setFilterType,
  setSearchQuery,
  fetchHospitals,
  verifyHospitalThunk,
  createHospitalThunk,
} from '../../store/slices/hospitalSlice';
import { addAuditLog, addNotification } from '../../store/slices/notificationSlice';
import { addToast } from '../../store/slices/toastSlice';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  Ban,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Check,
  Lock,
} from 'lucide-react';

export const HospitalManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { hospitals, filterType, searchQuery } = useAppSelector((state) => state.hospitals);
  const { currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchHospitals());
  }, [dispatch]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newHosp, setNewHosp] = useState({
    name: '',
    licenseNumber: '',
    type: 'PRIVATE' as const,
    email: '',
    phone: '',
    address: '',
    city: 'Indore',
    state: 'Madhya Pradesh',
    pincode: '452001',
    coordinates: { lat: 22.7196, lng: 75.8577 },
    verified: true,
    status: 'VERIFIED' as const,
    totalBeds: 200,
    hasBloodBank: true,
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });

  const handleVerify = async (hospitalId: string, hospitalName: string) => {
    dispatch(verifyHospital(hospitalId));
    await dispatch(verifyHospitalThunk({ id: hospitalId, status: 'VERIFIED' }));
    dispatch(fetchHospitals());
    dispatch(
      addToast({
        type: 'success',
        title: 'Hospital Verified',
        message: `${hospitalName} is now authorized and active on the blood grid.`,
      })
    );
    dispatch(
      addNotification({
        title: '✅ Hospital Verified',
        message: `${hospitalName} verification approved by Super Admin.`,
        type: 'SUCCESS',
        targetRole: 'ALL',
      })
    );
    dispatch(
      addAuditLog({
        userId: currentUser?.id || 'sa-1',
        userName: currentUser?.name || 'Super Admin',
        userRole: 'SUPER_ADMIN',
        action: 'VERIFY_HOSPITAL',
        targetResource: hospitalName,
        details: `Approved hospital verification and activated network blood participation`,
        ipAddress: '103.21.144.10',
      })
    );
  };

  const handleSuspend = async (hospitalId: string, hospitalName: string) => {
    dispatch(suspendHospital(hospitalId));
    await dispatch(verifyHospitalThunk({ id: hospitalId, status: 'SUSPENDED' }));
    dispatch(fetchHospitals());
    dispatch(
      addToast({
        type: 'warning',
        title: 'Hospital Suspended',
        message: `${hospitalName} access has been temporarily suspended.`,
      })
    );
    dispatch(
      addAuditLog({
        userId: currentUser?.id || 'sa-1',
        userName: currentUser?.name || 'Super Admin',
        userRole: 'SUPER_ADMIN',
        action: 'SUSPEND_HOSPITAL',
        targetResource: hospitalName,
        details: `Suspended hospital network access due to compliance check`,
        ipAddress: '103.21.144.10',
      })
    );
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHosp.name || !newHosp.licenseNumber) return;
    setIsAddModalOpen(false);

    const effectiveAdminEmail = (newHosp.adminEmail || newHosp.email || `${newHosp.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@hospital.org`).trim();
    const effectiveAdminPassword = (newHosp.adminPassword || 'Password@123').trim();

    // Persist in live MongoDB Atlas backend
    const createResult = await dispatch(
      createHospitalThunk({
        name: newHosp.name,
        hospitalCode: newHosp.licenseNumber,
        licenseNumber: newHosp.licenseNumber,
        address: newHosp.address || `${newHosp.city || 'Indore'}, India`,
        city: newHosp.city || 'Indore',
        phone: newHosp.phone || '+91 98260 00000',
        email: newHosp.email || effectiveAdminEmail,
        hasBloodBank: newHosp.hasBloodBank,
        coordinates: newHosp.coordinates || { lat: 22.7196, lng: 75.8577 },
        role: newHosp.hasBloodBank ? 'BOTH' : 'REQUESTING',
        contact: {
          phone: newHosp.phone || '+91 98260 00000',
          email: newHosp.email || effectiveAdminEmail,
          emergencyContact: newHosp.phone || '+91 98260 00000',
        },
        adminName: newHosp.name,
        adminEmail: effectiveAdminEmail,
        adminPassword: effectiveAdminPassword,
      })
    );

    // Cache locally for instant seamless login fallback
    try {
      const existingAdmins = JSON.parse(localStorage.getItem('pulserelay_registered_admins') || '[]');
      const createdHosp = createHospitalThunk.fulfilled.match(createResult) ? createResult.payload : null;
      existingAdmins.push({
        email: effectiveAdminEmail.toLowerCase(),
        password: effectiveAdminPassword,
        user: {
          id: createdHosp?.id || `hosp-admin-${Date.now()}`,
          name: newHosp.name,
          email: effectiveAdminEmail,
          role: 'HOSPITAL_ADMIN',
          hospitalId: createdHosp?.id || `hosp-${Date.now()}`,
          hospitalName: newHosp.name,
          phone: newHosp.phone || '+91 98260 00000',
          status: 'ACTIVE',
        },
      });
      localStorage.setItem('pulserelay_registered_admins', JSON.stringify(existingAdmins));
    } catch (e) {
      console.warn('LocalStorage cache error:', e);
    }

    // Show elegant toast notification
    dispatch(
      addToast({
        type: 'success',
        title: 'Hospital Registered Successfully',
        message: `${newHosp.name} registered. Login: ${effectiveAdminEmail}`,
      })
    );

    // Push into real-time notification feed
    dispatch(
      addNotification({
        title: '🏥 New Hospital Registered',
        message: `${newHosp.name} (${newHosp.city || 'State'}) joined the national blood grid.`,
        type: 'SUCCESS',
        targetRole: 'ALL',
      })
    );

    // Refresh to verify persistence
    dispatch(fetchHospitals());

    dispatch(
      addAuditLog({
        userId: currentUser?.id || 'sa-1',
        userName: currentUser?.name || 'Super Admin',
        userRole: 'SUPER_ADMIN',
        action: 'REGISTER_HOSPITAL',
        targetResource: newHosp.name,
        details: `Registered new medical facility with license ${newHosp.licenseNumber} and created admin account (${effectiveAdminEmail})`,
        ipAddress: '103.21.144.10',
      })
    );

    setNewHosp({
      name: '',
      licenseNumber: '',
      type: 'PRIVATE',
      email: '',
      phone: '',
      address: '',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452001',
      coordinates: { lat: 22.7196, lng: 75.8577 },
      verified: true,
      status: 'VERIFIED' as const,
      totalBeds: 200,
      hasBloodBank: true,
      adminName: '',
      adminEmail: '',
      adminPassword: '',
    });
  };

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || h.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hospital Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Verify facility licenses, approve regional blood bank centres, and manage network authorizations
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Hospital</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search hospital name, city, or license..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Facility Type:</span>
          <select
            value={filterType}
            onChange={(e) => dispatch(setFilterType(e.target.value as any))}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden font-medium"
          >
            <option value="ALL">All Facilities</option>
            <option value="GOVERNMENT">Government</option>
            <option value="PRIVATE">Private</option>
            <option value="CHARITABLE">Charitable / NGO</option>
          </select>
        </div>
      </div>

      {/* Hospitals Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-5">Hospital & Facility</th>
                <th className="py-3.5 px-4">License / Registration</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Blood Bank Facility</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredHospitals.map((hosp) => (
                <tr key={hosp.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{hosp.name}</p>
                        <p className="text-[11px] text-slate-500">{hosp.type}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono font-medium text-slate-700">
                    {hosp.licenseNumber}
                  </td>

                  <td className="py-4 px-4 text-slate-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{hosp.city}, {hosp.state}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    {hosp.hasBloodBank ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        In-House Blood Centre
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                        Storage Only
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <StatusBadge status={hosp.status} />
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {hosp.status !== 'VERIFIED' ? (
                        <button
                          onClick={() => handleVerify(hosp.id, hosp.name)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-xs font-bold transition-all flex items-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Verify</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSuspend(hosp.id, hosp.name)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold transition-all flex items-center space-x-1"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Suspend</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Hospital Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Participating Hospital"
        subtitle="Verify clinical credentials before activating into the emergency network"
        maxWidth="xl"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Hospital / Medical Center Name</label>
            <input
              type="text"
              required
              value={newHosp.name}
              onChange={(e) => setNewHosp({ ...newHosp, name: e.target.value })}
              placeholder="e.g. Apollo Super Speciality Hospital"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">State Blood License No.</label>
              <input
                type="text"
                required
                value={newHosp.licenseNumber}
                onChange={(e) => setNewHosp({ ...newHosp, licenseNumber: e.target.value })}
                placeholder="DL-BB-2026-XXXX"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Facility Type</label>
              <select
                value={newHosp.type}
                onChange={(e) => setNewHosp({ ...newHosp, type: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              >
                <option value="GOVERNMENT">Government Institute</option>
                <option value="PRIVATE">Private Multi-Speciality</option>
                <option value="CHARITABLE">Charitable / Red Cross</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                required
                value={newHosp.city}
                onChange={(e) => setNewHosp({ ...newHosp, city: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">State</label>
              <input
                type="text"
                required
                value={newHosp.state}
                onChange={(e) => setNewHosp({ ...newHosp, state: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Official Address</label>
            <input
              type="text"
              required
              value={newHosp.address}
              onChange={(e) => setNewHosp({ ...newHosp, address: e.target.value })}
              placeholder="Full physical facility address..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Direct Contact Phone</label>
              <input
                type="text"
                required
                value={newHosp.phone}
                onChange={(e) => setNewHosp({ ...newHosp, phone: e.target.value })}
                placeholder="+91 11 2600 0000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Institutional Email</label>
              <input
                type="email"
                required
                value={newHosp.email}
                onChange={(e) => setNewHosp({ ...newHosp, email: e.target.value })}
                placeholder="contact@hospital.org"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="hasBloodBank"
              checked={newHosp.hasBloodBank}
              onChange={(e) => setNewHosp({ ...newHosp, hasBloodBank: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="hasBloodBank" className="text-xs font-semibold text-slate-800">
              Facility operates an in-house certified blood bank and component separation unit
            </label>
          </div>

          {/* Hospital Login Account Credentials */}
          <div className="pt-4 border-t border-slate-200 mt-2">
            <div className="flex items-center gap-1.5 mb-1 text-[#0d9488]">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                Hospital Login Credentials
              </h4>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Set the login email and password for this hospital to access the Hospital Dashboard. Once logged in, the hospital can add its own doctors and staff.
            </p>

            <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hospital Login Email *</label>
                  <input
                    type="email"
                    required
                    value={newHosp.adminEmail}
                    onChange={(e) => setNewHosp({ ...newHosp, adminEmail: e.target.value })}
                    placeholder="hospital@domain.org"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hospital Password *</label>
                  <input
                    type="password"
                    required
                    value={newHosp.adminPassword}
                    onChange={(e) => setNewHosp({ ...newHosp, adminPassword: e.target.value })}
                    placeholder="Set login password (e.g. Password@123)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-hidden text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 -mx-6 -mb-6 px-6 py-4 bg-white/95 backdrop-blur-xs flex items-center justify-end space-x-2 border-t border-slate-200 mt-6 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 cursor-pointer transition-colors"
            >
              Submit for Verification
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
