import { apiSlice } from "../apiSlice";

type SignUpPayload = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/admin/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (userData: SignUpPayload) => ({
        url: '/admin/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation  } = authApi;