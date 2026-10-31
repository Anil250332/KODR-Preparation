import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../../types';
import { DEMO_USERS } from '../../services/mockData';
import { apiService } from '../../services/apiService';

interface AuthState {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  serverAwake: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialUser = DEMO_USERS.superAdmin;

const initialState: AuthState = {
  currentUser: initialUser,
  token: localStorage.getItem('pulserelay_token') || 'mock-jwt-token-pulserelay-2026',
  isAuthenticated: true,
  activeRole: initialUser.role,
  serverAwake: true,
  isLoading: false,
  error: null,
};

// Async Thunks
export const loginUserThunk = createAsyncThunk(
  'auth/loginUserThunk',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await apiService.login(email, password);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Login failed');
    }
  }
);

export const fetchCurrentUserThunk = createAsyncThunk(
  'auth/fetchCurrentUserThunk',
  async (_, { rejectWithValue }) => {
    try {
      const user = await apiService.getMe();
      return user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch current user');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.activeRole = action.payload;
      if (action.payload === 'SUPER_ADMIN') {
        state.currentUser = DEMO_USERS.superAdmin;
      } else if (action.payload === 'HOSPITAL_ADMIN') {
        state.currentUser = DEMO_USERS.hospitalAdmin;
      } else if (action.payload === 'BLOOD_BANK_OFFICER') {
        state.currentUser = DEMO_USERS.bloodBankOfficer;
      } else if (action.payload === 'EMERGENCY_COORDINATOR') {
        state.currentUser = DEMO_USERS.emergencyCoordinator;
      }
      state.isAuthenticated = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.activeRole = action.payload.user.role;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('pulserelay_token', action.payload.token);
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('pulserelay_token');
    },
    setServerAwake: (state, action: PayloadAction<boolean>) => {
      state.serverAwake = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.activeRole = action.payload.user.role;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchCurrentUserThunk.fulfilled, (state, action) => {
      state.currentUser = action.payload;
      state.activeRole = action.payload.role;
    });
  },
});

export const { setRole, loginSuccess, logout, setServerAwake, setError } = authSlice.actions;
export default authSlice.reducer;
