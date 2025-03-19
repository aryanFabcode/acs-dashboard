// lib/redux/clientDetailsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ClientDetailsState {
  selectedClient: any | null;
}

const initialState: ClientDetailsState = {
  selectedClient: null,
};

const clientDetailsSlice = createSlice({
  name: 'clientDetails',
  initialState,
  reducers: {
    setSelectedClient: (state, action: PayloadAction<any>) => {
      state.selectedClient = action.payload;
    },
    clearSelectedClient: (state) => {
      state.selectedClient = null;
    },
  },
});

export const { setSelectedClient, clearSelectedClient } = clientDetailsSlice.actions;
export default clientDetailsSlice.reducer;