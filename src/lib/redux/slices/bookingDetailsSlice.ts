// lib/redux/bookingDetailsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookingDetailsState {
  selectedBooking: any | null;
}

const initialState: BookingDetailsState = {
  selectedBooking: null,
};

const bookingDetailsSlice = createSlice({
  name: 'bookingDetails',
  initialState,
  reducers: {
    setSelectedBooking: (state, action: PayloadAction<any>) => {
      state.selectedBooking = action.payload;
    },
    clearSelectedBooking: (state) => {
      state.selectedBooking = null;
    },
  },
});

export const { setSelectedBooking, clearSelectedBooking } = bookingDetailsSlice.actions;
export default bookingDetailsSlice.reducer;