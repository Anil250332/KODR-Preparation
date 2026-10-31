import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Hospital } from '../../types';
import { INITIAL_HOSPITALS } from '../../services/mockData';
import { apiService } from '../../services/apiService';

interface HospitalState {
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  filterType: 'ALL' | 'GOVERNMENT' | 'PRIVATE' | 'CHARITABLE';
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: HospitalState = {
  hospitals: INITIAL_HOSPITALS,
  selectedHospital: INITIAL_HOSPITALS[0] || null,
  filterType: 'ALL',
  searchQuery: '',
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchHospitals = createAsyncThunk(
  'hospitals/fetchHospitals',
  async (_, { rejectWithValue }) => {
    try {
      const list = await apiService.getHospitals();
      return list;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch hospitals');
    }
  }
);

export const verifyHospitalThunk = createAsyncThunk(
  'hospitals/verifyHospitalThunk',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const hospital = await apiService.verifyHospital(id, status);
      return hospital;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to verify hospital');
    }
  }
);

export const createHospitalThunk = createAsyncThunk(
  'hospitals/createHospitalThunk',
  async (data: any, { rejectWithValue }) => {
    try {
      const hospital = await apiService.createHospital(data);
      return hospital;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create hospital');
    }
  }
);

export const updateHospitalThunk = createAsyncThunk(
  'hospitals/updateHospitalThunk',
  async ({ id, changes }: { id: string; changes: any }, { rejectWithValue }) => {
    try {
      const hospital = await apiService.updateHospital(id, changes);
      return hospital;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update hospital');
    }
  }
);

export const hospitalSlice = createSlice({
  name: 'hospitals',
  initialState,
  reducers: {
    addHospital: (state, action: PayloadAction<Omit<Hospital, 'id' | 'createdAt' | 'lastActive'>>) => {
      const newHospital: Hospital = {
        id: `hosp-${Date.now()}`,
        ...action.payload,
        createdAt: new Date().toISOString(),
        lastActive: 'Just now',
      };
      state.hospitals.unshift(newHospital);
    },
    verifyHospital: (state, action: PayloadAction<string>) => {
      const hospital = state.hospitals.find((h) => h.id === action.payload);
      if (hospital) {
        hospital.verified = true;
        hospital.status = 'VERIFIED';
        hospital.lastActive = 'Just now';
      }
    },
    suspendHospital: (state, action: PayloadAction<string>) => {
      const hospital = state.hospitals.find((h) => h.id === action.payload);
      if (hospital) {
        hospital.status = 'SUSPENDED';
        hospital.lastActive = 'Just now';
      }
    },
    updateHospitalProfile: (state, action: PayloadAction<{ id: string; changes: Partial<Hospital> }>) => {
      const hospital = state.hospitals.find((h) => h.id === action.payload.id);
      if (hospital) {
        Object.assign(hospital, action.payload.changes);
        hospital.lastActive = 'Just now';
      }
    },
    setFilterType: (state, action: PayloadAction<'ALL' | 'GOVERNMENT' | 'PRIVATE' | 'CHARITABLE'>) => {
      state.filterType = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedHospital: (state, action: PayloadAction<string>) => {
      const h = state.hospitals.find((item) => item.id === action.payload);
      if (h) {
        state.selectedHospital = h;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHospitals.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchHospitals.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload && action.payload.length > 0) {
        state.hospitals = action.payload;
        if (!state.selectedHospital || !action.payload.some((h) => h.id === state.selectedHospital?.id)) {
          state.selectedHospital = action.payload[0] || null;
        }
      }
    });
    builder.addCase(fetchHospitals.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(verifyHospitalThunk.fulfilled, (state, action) => {
      const idx = state.hospitals.findIndex((h) => h.id === action.payload.id);
      if (idx >= 0) {
        state.hospitals[idx] = action.payload;
      }
    });

    builder.addCase(createHospitalThunk.fulfilled, (state, action) => {
      state.hospitals.unshift(action.payload);
    });
  },
});

export const {
  addHospital,
  verifyHospital,
  suspendHospital,
  updateHospitalProfile,
  setFilterType,
  setSearchQuery,
  setSelectedHospital,
} = hospitalSlice.actions;

export default hospitalSlice.reducer;
