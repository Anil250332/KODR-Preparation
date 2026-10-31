import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import inventoryReducer from './slices/inventorySlice';
import emergencyReducer from './slices/emergencySlice';
import hospitalReducer from './slices/hospitalSlice';
import notificationReducer from './slices/notificationSlice';
import toastReducer from './slices/toastSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    emergency: emergencyReducer,
    hospitals: hospitalReducer,
    notifications: notificationReducer,
    toast: toastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
