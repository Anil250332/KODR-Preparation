import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BloodInventoryItem, BloodGroup, BloodComponent } from '../../types';
import { INITIAL_INVENTORY } from '../../services/mockData';
import { apiService } from '../../services/apiService';

interface InventoryState {
  items: BloodInventoryItem[];
  selectedBloodGroupFilter: BloodGroup | 'ALL';
  selectedComponentFilter: BloodComponent | 'ALL';
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: INITIAL_INVENTORY,
  selectedBloodGroupFilter: 'ALL',
  selectedComponentFilter: 'ALL',
  searchQuery: '',
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchHospitalInventory = createAsyncThunk(
  'inventory/fetchHospitalInventory',
  async (hospitalId: string, { rejectWithValue }) => {
    try {
      const items = await apiService.getHospitalInventory(hospitalId);
      return items;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch inventory');
    }
  }
);

export const addStockItem = createAsyncThunk(
  'inventory/addStockItem',
  async (data: any, { rejectWithValue }) => {
    try {
      const item = await apiService.addInventoryItem(data);
      return item;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add stock item');
    }
  }
);

export const updateStockUnits = createAsyncThunk(
  'inventory/updateStockUnits',
  async ({ id, units, reason }: { id: string; units: number; reason?: string }, { rejectWithValue }) => {
    try {
      const item = await apiService.updateInventoryUnits(id, units, reason);
      return item;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update stock units');
    }
  }
);

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addOrUpdateStock: (
      state,
      action: PayloadAction<Omit<BloodInventoryItem, 'id' | 'lastUpdated' | 'reservedUnits' | 'totalUnits'>>
    ) => {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.hospitalId === action.payload.hospitalId &&
          item.bloodGroup === action.payload.bloodGroup &&
          item.component === action.payload.component
      );

      if (existingIndex >= 0) {
        const item = state.items[existingIndex];
        item.availableUnits = action.payload.availableUnits;
        item.totalUnits = item.availableUnits + item.reservedUnits;
        item.expiryDate = action.payload.expiryDate;
        item.storageTemp = action.payload.storageTemp;
        item.lastUpdated = 'Just now';
      } else {
        const newItem: BloodInventoryItem = {
          id: `inv-${Date.now()}`,
          ...action.payload,
          reservedUnits: 0,
          totalUnits: action.payload.availableUnits,
          lastUpdated: 'Just now',
        };
        state.items.unshift(newItem);
      }
    },
    reserveStock: (
      state,
      action: PayloadAction<{ hospitalId: string; bloodGroup: BloodGroup; component: BloodComponent; units: number }>
    ) => {
      const item = state.items.find(
        (i) =>
          i.hospitalId === action.payload.hospitalId &&
          i.bloodGroup === action.payload.bloodGroup &&
          i.component === action.payload.component
      );
      if (item && item.availableUnits >= action.payload.units) {
        item.availableUnits -= action.payload.units;
        item.reservedUnits += action.payload.units;
        item.lastUpdated = 'Just now (Reserved)';
      }
    },
    releaseStock: (
      state,
      action: PayloadAction<{ hospitalId: string; bloodGroup: BloodGroup; component: BloodComponent; units: number }>
    ) => {
      const item = state.items.find(
        (i) =>
          i.hospitalId === action.payload.hospitalId &&
          i.bloodGroup === action.payload.bloodGroup &&
          i.component === action.payload.component
      );
      if (item) {
        item.reservedUnits = Math.max(0, item.reservedUnits - action.payload.units);
        item.availableUnits += action.payload.units;
        item.lastUpdated = 'Just now (Stock Released)';
      }
    },
    setBloodGroupFilter: (state, action: PayloadAction<BloodGroup | 'ALL'>) => {
      state.selectedBloodGroupFilter = action.payload;
    },
    setComponentFilter: (state, action: PayloadAction<BloodComponent | 'ALL'>) => {
      state.selectedComponentFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch inventory
    builder.addCase(fetchHospitalInventory.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchHospitalInventory.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload && action.payload.length > 0) {
        state.items = action.payload;
      }
    });
    builder.addCase(fetchHospitalInventory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      // Keeps existing items on rejection
    });

    // Add stock item
    builder.addCase(addStockItem.fulfilled, (state, action) => {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      } else {
        state.items.unshift(action.payload);
      }
    });

    // Update units
    builder.addCase(updateStockUnits.fulfilled, (state, action) => {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      }
    });
  },
});

export const {
  addOrUpdateStock,
  reserveStock,
  releaseStock,
  setBloodGroupFilter,
  setComponentFilter,
  setSearchQuery,
} = inventorySlice.actions;

export default inventorySlice.reducer;
