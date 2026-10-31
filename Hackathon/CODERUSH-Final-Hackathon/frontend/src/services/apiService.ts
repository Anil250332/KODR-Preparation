import { apiClient } from './api';
import {
  Hospital,
  BloodInventoryItem,
  EmergencyRequest,
  Offer,
  Transfer,
  User,
  AppNotification,
  AuditLog,
} from '../types';

// Adapters from Backend MongoDB models to Frontend Types
export const adaptHospital = (raw: any): Hospital => {
  return {
    id: raw._id || raw.id,
    name: raw.name || 'Unnamed Hospital',
    licenseNumber: raw.hospitalCode || 'LIC-000',
    type: (raw.type as any) || 'PRIVATE',
    email: raw.contact?.email || raw.email || 'info@hospital.org',
    phone: raw.contact?.phone || raw.phone || '+91 00000 00000',
    address: raw.address || '',
    city: raw.city || 'Indore',
    state: raw.state || 'Madhya Pradesh',
    pincode: raw.pincode || '452001',
    coordinates: {
      lat: raw.coordinates?.lat || 22.7196,
      lng: raw.coordinates?.lng || 75.8577,
    },
    verified: raw.verificationStatus === 'VERIFIED' || raw.verified === true,
    status: raw.verificationStatus || (raw.verified ? 'VERIFIED' : 'PENDING_VERIFICATION'),
    totalBeds: raw.totalBeds || 150,
    hasBloodBank: raw.role !== 'REQUESTING',
    lastActive: 'Just now',
    createdAt: raw.createdAt || new Date().toISOString(),
  };
};

export const adaptInventoryItem = (raw: any): BloodInventoryItem => {
  const units = raw.units ?? raw.totalUnits ?? 0;
  const reservedUnits = raw.reservedUnits ?? 0;
  const availableUnits = Math.max(0, units - reservedUnits);

  return {
    id: raw._id || raw.id,
    hospitalId: raw.hospitalId?._id || raw.hospitalId || '',
    hospitalName: raw.hospitalId?.name || raw.hospitalName || 'Verified Blood Centre',
    bloodGroup: raw.bloodGroup,
    component: raw.component,
    availableUnits,
    reservedUnits,
    totalUnits: units,
    storageTemp: raw.storageTemp || (raw.component === 'Platelets' ? '20°C to 24°C' : '2°C to 6°C'),
    shelfLifeDays: raw.shelfLifeDays || (raw.component === 'Platelets' ? 5 : 42),
    expiryDate: raw.expiryDate ? new Date(raw.expiryDate).toISOString().split('T')[0] : '2026-12-31',
    lastUpdated: raw.lastUpdated ? new Date(raw.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
  };
};

export const adaptOffer = (raw: any): Offer => {
  return {
    id: raw._id || raw.id,
    requestId: raw.requestId?._id || raw.requestId || '',
    hospitalId: raw.offeringHospitalId?._id || raw.offeringHospitalId || raw.hospitalId || '',
    hospitalName: raw.offeringHospitalId?.name || raw.hospitalName || 'Providing Blood Centre',
    hospitalCity: raw.offeringHospitalId?.city || raw.hospitalCity || 'Indore',
    distanceKm: raw.distanceKm || 3.2,
    offeredUnits: raw.offeredUnits || 0,
    offeredComponent: raw.offeredComponent || raw.component || 'PRBC',
    offeredBloodGroup: raw.offeredBloodGroup || raw.bloodGroup || 'O-',
    estimatedTransitMinutes: raw.estimatedTransitMinutes || 25,
    status: raw.status || 'PENDING',
    offeredByOfficerName: raw.offeredBy?.name || 'Blood Bank Officer',
    offeredAt: raw.createdAt ? new Date(raw.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
    notes: raw.notes || '',
  };
};

export const adaptEmergencyRequest = (raw: any): EmergencyRequest => {
  return {
    id: raw._id || raw.id,
    requestId: raw.requestId || `PR-EMG-${raw._id?.slice(-4) || '1001'}`,
    requestingHospitalId: raw.requestingHospitalId?._id || raw.requestingHospitalId || '',
    requestingHospitalName: raw.requestingHospitalId?.name || raw.requestingHospitalName || 'Requesting Hospital',
    requestingHospitalCity: raw.requestingHospitalId?.city || raw.location?.city || raw.requestingHospitalCity || 'Indore',
    patientReferenceId: raw.patientReferenceId || `PT-${raw.requestId || '001'}`,
    patientName: raw.patientName,
    patientDiagnosis: raw.patientDiagnosis,
    bloodGroup: raw.bloodGroup,
    component: raw.component,
    requiredUnits: raw.requiredUnits,
    allocatedUnits: raw.allocatedUnits || 0,
    urgency: raw.urgency || 'HIGH',
    requiredByTime: raw.requiredBy ? new Date(raw.requiredBy).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Within 2 hrs',
    clinicalNotes: raw.additionalNotes || raw.clinicalNotes || '',
    status: raw.status || 'SEARCHING',
    offers: (raw.offers || []).map(adaptOffer),
    acceptedByHospitalId: raw.acceptedByHospitalId?._id || raw.acceptedByHospitalId || undefined,
    acceptedByHospitalName: raw.acceptedByHospitalId?.name || undefined,
    acceptedByHospitalPhone: raw.acceptedByHospitalId?.contact?.phone || raw.acceptedByHospitalId?.phone || undefined,
    acceptedByHospitalEmail: raw.acceptedByHospitalId?.contact?.email || raw.acceptedByHospitalId?.email || undefined,
    acceptedByHospitalCity: raw.acceptedByHospitalId?.city || undefined,
    acceptedByHospitalAddress: raw.acceptedByHospitalId?.address || undefined,
    acceptedAt: raw.acceptedAt ? new Date(raw.acceptedAt).toLocaleString() : undefined,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
};

export const adaptTransfer = (raw: any): Transfer => {
  return {
    id: raw._id || raw.id,
    transferId: raw.transferId || `TRF-PR-${raw._id?.slice(-4) || '2026'}`,
    requestId: raw.requestId?._id || raw.requestId || '',
    supplyingHospitalId: raw.supplyingHospitalId?._id || raw.supplyingHospitalId || '',
    supplyingHospitalName: raw.supplyingHospitalId?.name || raw.supplyingHospitalName || 'Supplying Centre',
    receivingHospitalId: raw.requestingHospitalId?._id || raw.receivingHospitalId || '',
    receivingHospitalName: raw.requestingHospitalId?.name || raw.receivingHospitalName || 'Receiving Hospital',
    bloodGroup: raw.bloodGroup || 'O-',
    component: raw.component || 'PRBC',
    units: raw.units || 1,
    status: raw.dispatchStatus === 'DELIVERED' ? 'HANDOVER_COMPLETED' : raw.dispatchStatus === 'DISPATCH_INITIATED' ? 'DISPATCH_INITIATED' : 'SCHEDULED',
    coldChainTempCelsius: 4.2,
    courierName: 'Medical Emergency Rapid Transit',
    courierContact: raw.driverContact || '+91 98260 55555',
    vehicleNumber: raw.vehicleNumber || 'MP-09-EM-4821',
    handoverOtp: raw.otp || raw.handoverOtp || '123456',
    isOtpVerified: raw.handoverStatus === 'VERIFIED',
    dispatchTime: raw.dispatchedAt ? new Date(raw.dispatchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
    completedAt: raw.completedAt ? new Date(raw.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
    timeline: [
      {
        title: 'Transfer Dispatched',
        description: `Dispatched from ${raw.supplyingHospitalId?.name || 'Supplying Centre'}`,
        time: raw.dispatchedAt ? new Date(raw.dispatchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending',
        completed: Boolean(raw.dispatchedAt),
      },
      {
        title: 'Cold-Chain Transit Active',
        description: 'Target storage temperature monitored (2°C - 6°C)',
        time: raw.dispatchedAt ? 'In transit' : 'Pending',
        completed: Boolean(raw.dispatchedAt),
      },
      {
        title: 'Handover & OTP Verification',
        description: 'Authorized 6-digit OTP verification upon arrival',
        time: raw.completedAt ? new Date(raw.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending Handover',
        completed: raw.handoverStatus === 'VERIFIED',
      },
    ],
  };
};

export const adaptUser = (raw: any): User => {
  return {
    id: raw._id || raw.id,
    name: raw.name || 'User',
    email: raw.email || '',
    role: raw.role,
    hospitalId: raw.hospitalId?._id || raw.hospitalId || undefined,
    hospitalName: raw.hospitalId?.name || undefined,
    phone: raw.phone || '',
    status: raw.isActive ? 'ACTIVE' : 'SUSPENDED',
    createdAt: raw.createdAt || new Date().toISOString(),
  };
};

// --- API Service Calls ---

export const apiService = {
  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await apiClient.post('/auth/login', { email, password });
    const { token, user } = res.data.data;
    if (token) localStorage.setItem('pulserelay_token', token);
    return { token, user: adaptUser(user) };
  },

  async getDemoUsers(): Promise<any[]> {
    const res = await apiClient.get('/auth/demo-users');
    return res.data.data || [];
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get('/auth/me');
    return adaptUser(res.data.data);
  },

  // Hospitals
  async getHospitals(): Promise<Hospital[]> {
    const res = await apiClient.get('/hospitals');
    return (res.data.data || []).map(adaptHospital);
  },

  async getNearbyHospitals(hospitalId: string): Promise<any[]> {
    const res = await apiClient.get(`/hospitals/${hospitalId}/nearby`);
    return res.data.data || [];
  },

  async verifyHospital(hospitalId: string, status: string): Promise<Hospital> {
    const res = await apiClient.patch(`/hospitals/${hospitalId}/verify`, { status });
    return adaptHospital(res.data.data);
  },

  async updateHospital(hospitalId: string, data: any): Promise<Hospital> {
    const res = await apiClient.put(`/hospitals/${hospitalId}`, data);
    return adaptHospital(res.data.data);
  },

  async createHospital(data: any): Promise<Hospital> {
    const payload = {
      name: data.name,
      hospitalCode: (data.hospitalCode || data.licenseNumber || `HOSP-${Math.floor(Math.random() * 9000 + 1000)}`).toUpperCase(),
      address: data.address || `${data.city || 'Indore'}, India`,
      city: data.city || 'Indore',
      coordinates: data.coordinates || { lat: 22.7196, lng: 75.8577 },
      contact: {
        email: data.contact?.email || data.email || `${data.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@hospital.org`,
        phone: data.contact?.phone || data.phone || '+91 98260 00000',
        emergencyContact: data.contact?.emergencyContact || data.phone || '+91 98260 00000',
      },
      role: data.role || (data.hasBloodBank ? 'BOTH' : 'REQUESTING'),
      adminName: data.adminName,
      adminEmail: data.adminEmail || data.contact?.email || data.email,
      adminPassword: data.adminPassword || 'Password@123',
    };
    const res = await apiClient.post('/hospitals', payload);
    return adaptHospital(res.data.data);
  },

  // Inventory
  async getHospitalInventory(hospitalId: string): Promise<BloodInventoryItem[]> {
    const validId = (hospitalId && hospitalId.length === 24) ? hospitalId : '6ae5bfa3a41657de36e25a1e';
    const res = await apiClient.get(`/inventory/hospital/${validId}`);
    return (res.data.data || []).map(adaptInventoryItem);
  },

  async getInventorySummary(hospitalId: string): Promise<any> {
    const validId = (hospitalId && hospitalId.length === 24) ? hospitalId : '6ae5bfa3a41657de36e25a1e';
    const res = await apiClient.get(`/inventory/hospital/${validId}/summary`);
    return res.data.data;
  },

  async addInventoryItem(data: any): Promise<BloodInventoryItem> {
    const payload = {
      hospitalId: (data.hospitalId && data.hospitalId.length === 24) ? data.hospitalId : '6ae5bfa3a41657de36e25a1e',
      bloodGroup: data.bloodGroup,
      component: data.component,
      units: Number(data.availableUnits ?? data.units ?? 10),
      expiryDate: data.expiryDate || new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      batchNumber: data.batchNumber || `BATCH-${Date.now().toString().slice(-6)}`,
    };
    const res = await apiClient.post('/inventory', payload);
    return adaptInventoryItem(res.data.data);
  },

  async updateInventoryUnits(id: string, units: number, reason?: string): Promise<BloodInventoryItem> {
    const res = await apiClient.patch(`/inventory/${id}/units`, { units, reason });
    return adaptInventoryItem(res.data.data);
  },

  // Requests
  async getEmergencyRequests(): Promise<EmergencyRequest[]> {
    const res = await apiClient.get('/requests');
    const requests = (res.data.data || []).map(adaptEmergencyRequest);

    // Fetch offers for each request
    await Promise.all(
      requests.map(async (req: EmergencyRequest) => {
        try {
          const offersRes = await apiClient.get(`/offers/request/${req.id}`);
          req.offers = (offersRes.data.data || []).map(adaptOffer);
        } catch {
          // Keep existing offers if fetch fails
        }
      })
    );

    return requests;
  },

  async getRequestById(id: string): Promise<EmergencyRequest> {
    const res = await apiClient.get(`/requests/${id}`);
    const req = adaptEmergencyRequest(res.data.data);
    try {
      const offersRes = await apiClient.get(`/offers/request/${id}`);
      req.offers = (offersRes.data.data || []).map(adaptOffer);
    } catch {
      // Continue
    }
    return req;
  },

  async createEmergencyRequest(data: any): Promise<EmergencyRequest> {
    const payload = {
      requestingHospitalId: (data.requestingHospitalId && data.requestingHospitalId.length === 24)
        ? data.requestingHospitalId
        : '6ae5bfa3a41657de36e25a1d',
      bloodGroup: data.bloodGroup,
      component: data.component,
      requiredUnits: Number(data.requiredUnits || 1),
      urgency: data.urgency || 'CRITICAL',
      additionalNotes: data.additionalNotes || data.clinicalNotes || '',
    };
    const res = await apiClient.post('/requests', payload);
    return adaptEmergencyRequest(res.data.data.request);
  },

  async acceptEmergencyRequest(requestId: string, hospitalId: string): Promise<EmergencyRequest> {
    const res = await apiClient.patch(`/requests/${requestId}/accept`, { hospitalId });
    return adaptEmergencyRequest(res.data.data);
  },

  // Users & Staff
  async getUsers(hospitalId?: string): Promise<User[]> {
    const url = hospitalId ? `/users/hospital/${hospitalId}` : '/users';
    const res = await apiClient.get(url);
    return (res.data.data || []).map(adaptUser);
  },

  async createUser(data: any): Promise<User> {
    const res = await apiClient.post('/users', data);
    return adaptUser(res.data.data);
  },

  async toggleUserStatus(userId: string, isActive: boolean): Promise<User> {
    const res = await apiClient.patch(`/users/${userId}/status`, { isActive });
    return adaptUser(res.data.data);
  },

  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}`);
  },

  // Offers
  async submitOffer(data: { requestId: string; offeredUnits: number; notes?: string; offeringHospitalId?: string }): Promise<Offer> {
    const payload = {
      requestId: data.requestId,
      offeredUnits: Number(data.offeredUnits || 1),
      notes: data.notes || '',
      offeringHospitalId: (data.offeringHospitalId && data.offeringHospitalId.length === 24)
        ? data.offeringHospitalId
        : '6ae5bfa3a41657de36e25a1e',
    };
    const res = await apiClient.post('/offers', payload);
    return adaptOffer(res.data.data);
  },

  async acceptOffer(offerId: string, requestingHospitalId: string): Promise<any> {
    const validHospId = (requestingHospitalId && requestingHospitalId.length === 24)
      ? requestingHospitalId
      : '6ae5bfa3a41657de36e25a1d';
    const res = await apiClient.patch(`/offers/${offerId}/accept`, { requestingHospitalId: validHospId });
    return {
      offer: adaptOffer(res.data.data.offer),
      request: adaptEmergencyRequest(res.data.data.request),
      transfer: adaptTransfer(res.data.data.transfer),
    };
  },

  // Transfers
  async getHospitalTransfers(hospitalId: string): Promise<Transfer[]> {
    const res = await apiClient.get(`/transfers/hospital/${hospitalId}`);
    return (res.data.data || []).map(adaptTransfer);
  },

  async initiateDispatch(transferId: string, driverContact?: string, vehicleNumber?: string): Promise<Transfer> {
    const res = await apiClient.patch(`/transfers/${transferId}/dispatch`, { driverContact, vehicleNumber });
    return adaptTransfer(res.data.data);
  },

  async verifyHandoverOtp(transferId: string, otp: string): Promise<Transfer> {
    const res = await apiClient.patch(`/transfers/${transferId}/verify-otp`, { otp });
    return adaptTransfer(res.data.data);
  },

  // Notifications
  async getNotifications(): Promise<AppNotification[]> {
    const res = await apiClient.get('/notifications');
    return (res.data.data?.notifications || []).map((n: any) => ({
      id: n._id || n.id,
      title: n.title,
      message: n.message,
      type: n.type === 'EMERGENCY_REQUEST' ? 'CRITICAL' : n.type === 'OFFER_ACCEPTED' ? 'SUCCESS' : 'INFO',
      timestamp: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
      read: n.isRead,
      requestId: n.referenceId,
    }));
  },

  async markNotificationRead(id: string): Promise<void> {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
    } catch {
      // Safe fallback
    }
  },

  async markAllNotificationsRead(): Promise<void> {
    try {
      await apiClient.patch('/notifications/read-all');
    } catch {
      // Safe fallback
    }
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await apiClient.get('/audit-logs');
    return (res.data.data || []).map((a: any) => ({
      id: a._id || a.id,
      userId: a.userId?._id || a.userId || '',
      userName: a.userId?.name || 'System User',
      userRole: a.userId?.role || 'SUPER_ADMIN',
      action: a.action,
      targetResource: 'Blood Operations',
      details: typeof a.details === 'object' ? JSON.stringify(a.details) : a.details || '',
      timestamp: a.createdAt ? new Date(a.createdAt).toLocaleString() : 'Recently',
      ipAddress: a.ipAddress || '127.0.0.1',
    }));
  },
};
