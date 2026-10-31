import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AppNotification, AuditLog } from '../../types';
import { INITIAL_AUDIT_LOGS } from '../../services/mockData';
import { apiService } from '../../services/apiService';

const getStoredReadIds = (): string[] => {
  try {
    const raw = localStorage.getItem('pulserelay_read_notif_ids');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredReadId = (id: string) => {
  try {
    const ids = getStoredReadIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem('pulserelay_read_notif_ids', JSON.stringify(ids));
    }
  } catch {
    // Ignore storage errors
  }
};

const saveAllStoredReadIds = (idsToMark: string[]) => {
  try {
    const current = getStoredReadIds();
    const merged = Array.from(new Set([...current, ...idsToMark]));
    localStorage.setItem('pulserelay_read_notif_ids', JSON.stringify(merged));
  } catch {
    // Ignore storage errors
  }
};

const getStoredLocalNotifications = (): AppNotification[] => {
  try {
    const raw = localStorage.getItem('pulserelay_dynamic_notifications');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredLocalNotifications = (notifs: AppNotification[]) => {
  try {
    localStorage.setItem('pulserelay_dynamic_notifications', JSON.stringify(notifs.slice(0, 50)));
  } catch {
    // Ignore storage errors
  }
};

const DEFAULT_DYNAMIC_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'sys-notif-1',
    title: 'National Blood Grid Online',
    message: 'Central hospital emergency coordination network is actively syncing with regional blood banks.',
    type: 'SUCCESS',
    timestamp: '10m ago',
    read: false,
    targetRole: 'ALL',
  },
  {
    id: 'sys-notif-2',
    title: 'Emergency Response Channels Open',
    message: 'Instant hospital-to-hospital emergency broadcast and blood unit transfers are active.',
    type: 'INFO',
    timestamp: '25m ago',
    read: false,
    targetRole: 'ALL',
  },
  {
    id: 'sys-notif-3',
    title: 'Blood Stock Monitoring Active',
    message: 'Rare blood group inventories (O-, AB-) are monitored for priority hospital transfer requests.',
    type: 'WARNING',
    timestamp: '1h ago',
    read: false,
    targetRole: 'ALL',
  },
];

interface NotificationState {
  notifications: AppNotification[];
  auditLogs: AuditLog[];
  unreadCount: number;
  isLoading: boolean;
}

const initializeNotifications = (): AppNotification[] => {
  const local = getStoredLocalNotifications();
  const readIds = getStoredReadIds();
  const base = local.length > 0 ? local : DEFAULT_DYNAMIC_NOTIFICATIONS;
  return base.map((n) => ({
    ...n,
    read: readIds.includes(n.id) || n.read,
  }));
};

const initialNotifications = initializeNotifications();

const initialState: NotificationState = {
  notifications: initialNotifications,
  auditLogs: INITIAL_AUDIT_LOGS,
  unreadCount: initialNotifications.filter((n) => !n.read).length,
  isLoading: false,
};

// Async Thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const list = await apiService.getNotifications();
      return list;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchAuditLogs = createAsyncThunk(
  'notifications/fetchAuditLogs',
  async (_, { rejectWithValue }) => {
    try {
      const list = await apiService.getAuditLogs();
      return list;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch audit logs');
    }
  }
);

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Omit<AppNotification, 'id' | 'timestamp' | 'read'> & { id?: string }>
    ) => {
      const newNotif: AppNotification = {
        id: action.payload.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ...action.payload,
        timestamp: 'Just now',
        read: false,
      };
      state.notifications.unshift(newNotif);
      state.unreadCount += 1;
      saveStoredLocalNotifications(state.notifications);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notifId = action.payload;
      const notif = state.notifications.find((n) => n.id === notifId);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
        saveStoredReadId(notifId);
        saveStoredLocalNotifications(state.notifications);
        apiService.markNotificationRead(notifId);
      }
    },
    markAllAsRead: (state) => {
      const allIds = state.notifications.map((n) => n.id);
      state.notifications.forEach((n) => {
        n.read = true;
      });
      state.unreadCount = 0;
      saveAllStoredReadIds(allIds);
      saveStoredLocalNotifications(state.notifications);
      apiService.markAllNotificationsRead();
    },
    addAuditLog: (state, action: PayloadAction<Omit<AuditLog, 'id' | 'timestamp'>>) => {
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const newLog: AuditLog = {
        id: `aud-${Date.now()}`,
        ...action.payload,
        timestamp,
      };
      state.auditLogs.unshift(newLog);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      if (action.payload && action.payload.length > 0) {
        const readIds = getStoredReadIds();
        const serverNotifs = action.payload.map((n) => ({
          ...n,
          read: readIds.includes(n.id) || n.read,
        }));
        
        // Merge without duplicating existing IDs
        const existingIds = new Set(serverNotifs.map((n) => n.id));
        const localsToKeep = state.notifications.filter((n) => !existingIds.has(n.id));
        
        state.notifications = [...localsToKeep, ...serverNotifs];
        state.unreadCount = state.notifications.filter((n) => !n.read).length;
        saveStoredLocalNotifications(state.notifications);
      }
    });

    builder.addCase(fetchAuditLogs.fulfilled, (state, action) => {
      if (action.payload && action.payload.length > 0) {
        state.auditLogs = action.payload;
      }
    });
  },
});

export const { addNotification, markAsRead, markAllAsRead, addAuditLog } = notificationSlice.actions;

export default notificationSlice.reducer;
