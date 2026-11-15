import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  isSidebarOpen: boolean
  activeModal: string | null
}

const initialState: UiState = {
  isSidebarOpen: false,
  activeModal: null,
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload
    },
    closeModal: (state) => {
      state.activeModal = null
    },
  },
})

export const { toggleSidebar, setSidebarOpen, openModal, closeModal } = uiSlice.actions
export default uiSlice.reducer

