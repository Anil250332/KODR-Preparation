import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EmergencyRequest, Offer, RequestStatus } from '../../types';
import { INITIAL_REQUESTS } from '../../services/mockData';
import { apiService } from '../../services/apiService';

interface EmergencyState {
  requests: EmergencyRequest[];
  selectedRequest: EmergencyRequest | null;
  filterStatus: RequestStatus | 'ALL';
  filterUrgency: 'ALL' | 'CRITICAL' | 'URGENT' | 'NORMAL';
  isBroadcasting: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: EmergencyState = {
  requests: INITIAL_REQUESTS,
  selectedRequest: INITIAL_REQUESTS[0] || null,
  filterStatus: 'ALL',
  filterUrgency: 'ALL',
  isBroadcasting: false,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchEmergencyRequests = createAsyncThunk(
  'emergency/fetchEmergencyRequests',
  async (_, { rejectWithValue }) => {
    try {
      const requests = await apiService.getEmergencyRequests();
      return requests;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch emergency requests');
    }
  }
);

export const createEmergencyRequestApi = createAsyncThunk(
  'emergency/createEmergencyRequestApi',
  async (data: any, { rejectWithValue }) => {
    try {
      const newReq = await apiService.createEmergencyRequest(data);
      return newReq;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create emergency request');
    }
  }
);

export const submitOfferApi = createAsyncThunk(
  'emergency/submitOfferApi',
  async (
    data: { requestId: string; offeredUnits: number; notes?: string; offeringHospitalId?: string },
    { rejectWithValue }
  ) => {
    try {
      const offer = await apiService.submitOffer(data);
      return { requestId: data.requestId, offer };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to submit offer');
    }
  }
);

export const acceptOfferApi = createAsyncThunk(
  'emergency/acceptOfferApi',
  async ({ offerId, requestingHospitalId }: { offerId: string; requestingHospitalId: string }, { rejectWithValue }) => {
    try {
      const result = await apiService.acceptOffer(offerId, requestingHospitalId);
      return result;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to accept offer');
    }
  }
);

export const emergencySlice = createSlice({
  name: 'emergency',
  initialState,
  reducers: {
    createRequest: (
      state,
      action: PayloadAction<Omit<EmergencyRequest, 'id' | 'requestId' | 'allocatedUnits' | 'status' | 'offers' | 'createdAt' | 'updatedAt'>>
    ) => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newReq: EmergencyRequest = {
        id: `req-${Date.now()}`,
        requestId: `PR-EMG-${randomNum}`,
        ...action.payload,
        allocatedUnits: 0,
        status: 'SEARCHING',
        offers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.requests.unshift(newReq);
      state.selectedRequest = newReq;
    },
    submitOffer: (
      state,
      action: PayloadAction<{ requestId: string; offer: Omit<Offer, 'id' | 'offeredAt' | 'status'> }>
    ) => {
      const request = state.requests.find((r) => r.id === action.payload.requestId);
      if (request) {
        const newOffer: Offer = {
          id: `off-${Date.now()}`,
          ...action.payload.offer,
          status: 'PENDING',
          offeredAt: 'Just now',
        };
        request.offers.push(newOffer);
        if (request.status === 'SEARCHING') {
          request.status = 'OFFERS_RECEIVED';
        }
        request.updatedAt = new Date().toISOString();
        if (state.selectedRequest?.id === request.id) {
          state.selectedRequest = { ...request };
        }
      }
    },
    acceptOffer: (state, action: PayloadAction<{ requestId: string; offerId: string }>) => {
      const request = state.requests.find((r) => r.id === action.payload.requestId);
      if (request) {
        const offer = request.offers.find((o) => o.id === action.payload.offerId);
        if (offer && offer.status !== 'ACCEPTED') {
          offer.status = 'ACCEPTED';
          request.allocatedUnits = Math.min(request.requiredUnits, request.allocatedUnits + offer.offeredUnits);
          if (request.allocatedUnits >= request.requiredUnits) {
            request.status = 'FULLY_ALLOCATED';
          } else {
            request.status = 'PARTIALLY_ALLOCATED';
          }
          request.updatedAt = new Date().toISOString();
          if (state.selectedRequest?.id === request.id) {
            state.selectedRequest = { ...request };
          }
        }
      }
    },
    rejectOffer: (state, action: PayloadAction<{ requestId: string; offerId: string }>) => {
      const request = state.requests.find((r) => r.id === action.payload.requestId);
      if (request) {
        const offer = request.offers.find((o) => o.id === action.payload.offerId);
        if (offer) {
          offer.status = 'REJECTED';
          request.updatedAt = new Date().toISOString();
          if (state.selectedRequest?.id === request.id) {
            state.selectedRequest = { ...request };
          }
        }
      }
    },
    updateRequestStatus: (state, action: PayloadAction<{ requestId: string; status: RequestStatus }>) => {
      const request = state.requests.find((r) => r.id === action.payload.requestId);
      if (request) {
        request.status = action.payload.status;
        request.updatedAt = new Date().toISOString();
        if (state.selectedRequest?.id === request.id) {
          state.selectedRequest = { ...request };
        }
      }
    },
    setSelectedRequest: (state, action: PayloadAction<string>) => {
      const req = state.requests.find((r) => r.id === action.payload);
      if (req) {
        state.selectedRequest = req;
      }
    },
    setFilterStatus: (state, action: PayloadAction<RequestStatus | 'ALL'>) => {
      state.filterStatus = action.payload;
    },
    setFilterUrgency: (state, action: PayloadAction<'ALL' | 'CRITICAL' | 'URGENT' | 'NORMAL'>) => {
      state.filterUrgency = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch requests
    builder.addCase(fetchEmergencyRequests.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchEmergencyRequests.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload && action.payload.length > 0) {
        state.requests = action.payload;
        if (!state.selectedRequest || !action.payload.some((r) => r.id === state.selectedRequest?.id)) {
          state.selectedRequest = action.payload[0] || null;
        }
      }
    });
    builder.addCase(fetchEmergencyRequests.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create request
    builder.addCase(createEmergencyRequestApi.pending, (state) => {
      state.isBroadcasting = true;
    });
    builder.addCase(createEmergencyRequestApi.fulfilled, (state, action) => {
      state.isBroadcasting = false;
      state.requests.unshift(action.payload);
      state.selectedRequest = action.payload;
    });
    builder.addCase(createEmergencyRequestApi.rejected, (state, action) => {
      state.isBroadcasting = false;
      state.error = action.payload as string;
    });

    // Submit offer
    builder.addCase(submitOfferApi.fulfilled, (state, action) => {
      const req = state.requests.find((r) => r.id === action.payload.requestId);
      if (req) {
        req.offers.push(action.payload.offer);
        if (req.status === 'SEARCHING') {
          req.status = 'OFFERS_RECEIVED';
        }
        if (state.selectedRequest?.id === req.id) {
          state.selectedRequest = { ...req };
        }
      }
    });

    // Accept offer
    builder.addCase(acceptOfferApi.fulfilled, (state, action) => {
      const { request } = action.payload;
      const idx = state.requests.findIndex((r) => r.id === request.id);
      if (idx >= 0) {
        state.requests[idx] = request;
        if (state.selectedRequest?.id === request.id) {
          state.selectedRequest = request;
        }
      }
    });
  },
});

export const {
  createRequest,
  submitOffer,
  acceptOffer,
  rejectOffer,
  updateRequestStatus,
  setSelectedRequest,
  setFilterStatus,
  setFilterUrgency,
} = emergencySlice.actions;

export default emergencySlice.reducer;
