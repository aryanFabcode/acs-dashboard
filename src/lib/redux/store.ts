import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import authReducer from './slices/authSlice';
import carerDetailsReducer from './slices/carerDetailsSlice';
import clientDetailsReducer from './slices/clientDetailsSlice';
import bookingDetailsReducer from './slices/bookingDetailsSlice';
import { setupListeners } from '@reduxjs/toolkit/query';


export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    carerDetails: carerDetailsReducer,
    clientDetails: clientDetailsReducer,
    bookingDetails: bookingDetailsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

