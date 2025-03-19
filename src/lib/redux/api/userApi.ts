import { apiSlice } from "../apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
      extraOptions: { maxRetries: 3 },
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation } = userApi;