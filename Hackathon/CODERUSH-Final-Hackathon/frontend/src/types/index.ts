export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type BloodComponent =
  | 'Whole Blood'
  | 'PRBC'
  | 'Platelets'
  | 'FFP'
  | 'Cryoprecipitate';

export type UrgencyLevel = 'CRITICAL' | 'URGENT' | 'NORMAL';

export type RequestStatus =
  | 'SEARCHING'
  | 'ACCEPTED'
  | 'OFFERS_RECEIVED'
  | 'PARTIALLY_ALLOCATED'
  | 'FULLY_ALLOCATED'
  | 'DISPATCH_INITIATED'
  | 'HANDOVER_COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export type TransferStatus =
  | 'SCHEDULED'
  | 'DISPATCH_INITIATED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'HANDOVER_COMPLETED'
  | 'CANCELLED';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'HOSPITAL_ADMIN'
  | 'BLOOD_BANK_OFFICER'
  | 'EMERGENCY_COORDINATOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hospitalId?: string;
  hospitalName?: string;
  phone?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  avatar?: string;
  createdAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  licenseNumber: string;
  type: 'GOVERNMENT' | 'PRIVATE' | 'CHARITABLE' | 'BLOOD_BANK_STANDALONE';
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  verified: boolean;
  status: 'VERIFIED' | 'PENDING_VERIFICATION' | 'SUSPENDED';
  totalBeds?: number;
  hasBloodBank: boolean;
  lastActive: string;
  createdAt: string;
}

export interface BloodInventoryItem {
  id: string;
  hospitalId: string;
  hospitalName: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  availableUnits: number;
  reservedUnits: number;
  totalUnits: number;
  storageTemp: string;
  shelfLifeDays: number;
  expiryDate: string;
  lastUpdated: string;
}

export interface Offer {
  id: string;
  requestId: string;
  hospitalId: string;
  hospitalName: string;
  hospitalCity: string;
  distanceKm: number;
  offeredUnits: number;
  offeredComponent: BloodComponent;
  offeredBloodGroup: BloodGroup;
  estimatedTransitMinutes: number;
  status: OfferStatus;
  offeredByOfficerName: string;
  offeredAt: string;
  notes?: string;
}

export interface EmergencyRequest {
  id: string;
  requestId: string;
  requestingHospitalId: string;
  requestingHospitalName: string;
  hospitalName?: string;
  requestingHospitalCity: string;
  patientReferenceId?: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  patientDiagnosis?: string;
  requestingDoctor?: string;
  department?: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  requiredUnits: number;
  allocatedUnits: number;
  urgency: UrgencyLevel;
  requiredByTime: string;
  clinicalNotes?: string;
  status: RequestStatus;
  offers: Offer[];
  acceptedByHospitalId?: string;
  acceptedByHospitalName?: string;
  acceptedByHospitalPhone?: string;
  acceptedByHospitalEmail?: string;
  acceptedByHospitalCity?: string;
  acceptedByHospitalAddress?: string;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transfer {
  id: string;
  transferId: string;
  requestId: string;
  supplyingHospitalId: string;
  supplyingHospitalName: string;
  receivingHospitalId: string;
  receivingHospitalName: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  units: number;
  status: TransferStatus;
  coldChainTempCelsius: number;
  courierName: string;
  courierContact: string;
  vehicleNumber: string;
  handoverOtp: string;
  isOtpVerified: boolean;
  dispatchTime?: string;
  estimatedArrival?: string;
  completedAt?: string;
  timeline: {
    title: string;
    description: string;
    time: string;
    completed: boolean;
  }[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'CRITICAL' | 'INFO' | 'SUCCESS' | 'WARNING';
  timestamp: string;
  read: boolean;
  link?: string;
  requestId?: string;
  targetRole?: UserRole | 'ALL';
  hospitalId?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetResource: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  code?: string;
}
