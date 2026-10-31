import {
  User,
  Hospital,
  BloodInventoryItem,
  EmergencyRequest,
  Transfer,
  AppNotification,
  AuditLog,
} from '../types';

// Synchronized with live Render MongoDB backend users
export const DEMO_USERS: Record<string, User> = {
  superAdmin: {
    id: '6ae5bfa3a41657de36e25a21',
    name: 'Dr. Rajesh Sharma (Super Admin)',
    email: 'superadmin@pulserelay.org',
    role: 'SUPER_ADMIN',
    phone: '+91 98930 99999',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T09:00:00Z',
  },
  hospitalAdmin: {
    id: '6ae5bfa3a41657de36e25a22',
    name: 'Dr. Sunita Deshmukh',
    email: 'admin@citycare.org',
    role: 'HOSPITAL_ADMIN',
    hospitalId: '6ae5bfa3a41657de36e25a1d',
    hospitalName: 'City Care Hospital',
    phone: '+91 98260 11101',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1594824813515-5a2a07c11f7c?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-10T10:30:00Z',
  },
  emergencyCoordinator: {
    id: '6ae5bfa3a41657de36e25a23',
    name: 'Vikram Joshi',
    email: 'coordinator@citycare.org',
    role: 'EMERGENCY_COORDINATOR',
    hospitalId: '6ae5bfa3a41657de36e25a1d',
    hospitalName: 'City Care Hospital',
    phone: '+91 98260 11102',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-15T08:15:00Z',
  },
  bloodBankOfficer: {
    id: '6ae5bfa3a41657de36e25a24',
    name: 'Dr. Priya Nambiar',
    email: 'bbo@apollo.org',
    role: 'BLOOD_BANK_OFFICER',
    hospitalId: '6ae5bfa3a41657de36e25a1e',
    hospitalName: 'Apollo Demo Blood Centre',
    phone: '+91 98260 22201',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-02-12T11:00:00Z',
  },
};

// All static data removed - loaded dynamically from live Render backend database
export const INITIAL_HOSPITALS: Hospital[] = [];

export const INITIAL_INVENTORY: BloodInventoryItem[] = [];

export const INITIAL_REQUESTS: EmergencyRequest[] = [];

export const INITIAL_TRANSFERS: Transfer[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
