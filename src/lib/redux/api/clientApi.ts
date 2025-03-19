import { apiSlice } from "../apiSlice";

interface Client {
  _id: string;
  name: string;
  gender: string;
  phone: string;
  email: string;
  status: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

interface ClientsResponse {
  status: number;
  message: string;
  data: {
    clients: Client[];
    totalClient: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPageUrl: string | null;
    prevPageUrl: string | null;
  };
}

type ClientPayload = {
  name: string;
  phone: string;
  email: string;
  address: string;
  zip: string;
  password: string;
};

interface PaginationParams {
  page?: number;
  limit?: number;
}

export const clientApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<ClientsResponse, PaginationParams>({
      query: ({ page = 1, limit = 10 }) => ({
        url: '/dashboard/clients',
        params: { page, limit },
      }),
      // providesTags: ['Clients'],
      providesTags: (result) =>
        result
          ? [
            ...result.data.clients.map(({ _id }) => ({ type: 'Client', id: _id })),
            { type: 'Client', id: 'LIST' },
          ]
          : [{ type: 'Client', id: 'LIST' }],
      keepUnusedDataFor: 60,
    }),
    // deleteClient: builder.mutation<void, string>({
    //   query: (clientId) => ({
    //     url: `/dashboard/client/${clientId}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Clients'],
    // }),
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/dashboard/client/${id}`,
        method: 'PATCH',
        body: { status: 'deleted' }
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Client', id },
        { type: 'Client', id: 'LIST' }
      ],
    }),
    getClientDetails: builder.query<Client, string>({
      query: (clientId) => `/dashboard/client/${clientId}`,
      providesTags: (result, error, id) => (result ? [{ type: 'Clients', id }] : []),
    }),
    createClient: builder.mutation({
      query: (clientData: ClientPayload) => ({
        url: '/dashboard/client',
        method: 'POST',
        body: clientData,
      }),
      invalidatesTags: ['Client'],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useDeleteClientMutation,
  useGetClientDetailsQuery,
  useCreateClientMutation
} = clientApi;


