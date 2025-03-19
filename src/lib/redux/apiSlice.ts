import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get the token from the Redux state (you'll need to set up your auth slice)
    const token = (getState() as RootState).auth.token;
    
    // If we have a token, add it to every request
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Add other common headers here
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Content', 'Analytics', 'Clients','Carer','Booking','Client'], // Add your entity tags here
  endpoints: () => ({}),
  keepUnusedDataFor: 60, // 60 seconds cache lifetime
});