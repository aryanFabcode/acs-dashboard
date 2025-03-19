import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CarerDetailsState {
  selectedCarer: any | null;
}

const initialState: CarerDetailsState = {
  selectedCarer: null,
};

const carerDetailsSlice = createSlice({
  name: 'carerDetails',
  initialState,
  reducers: {
    setSelectedCarer: (state, action: PayloadAction<any>) => {
      state.selectedCarer = action.payload;
    },
    clearSelectedCarer: (state) => {
      state.selectedCarer = null;
    },
  },
});

export const { setSelectedCarer, clearSelectedCarer } = carerDetailsSlice.actions;
export default carerDetailsSlice.reducer;