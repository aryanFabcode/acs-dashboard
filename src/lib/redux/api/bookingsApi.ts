import { apiSlice } from "../apiSlice";

export interface Booking {
    _id: string;
    client_id: string;
    carer_id: string;
    created_at: string;
    updated_at: string;
    specific_dates: string[];
    status: string;
    service_type: string;
    care_type: string;
    // Add other fields as needed
}

interface BookingsResponse {
    status: number;
    data: {
        bookings: Booking[];
        totalBooking: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export const bookingsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBookings: builder.query<BookingsResponse, {
            page?: number;
            limit?: number;
            status?: string;
            all?: boolean;
        }>({
            query: ({ page = 1, limit = 10, status, all }) => ({
                url: '/dashboard/bookings',
                params: all ? {} : { page, limit, status }
            }),
            transformResponse: (response: any) => ({
                status: response.status,
                data: {
                    bookings: response.data.bookings,
                    totalBooking: response.data.totalBooking,
                    hasNextPage: response.data.hasNextPage,
                    hasPrevPage: response.data.hasPrevPage
                }
            })
        }),
        deleteBooking: builder.mutation({
            query: (id) => ({
                url: `/dashboard/booking/${id}`,
                method: 'PATCH',
                body: { status: 'deleted' }
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Booking', id },
                { type: 'Booking', id: 'LIST' }
            ],
        }),
        getBooking: builder.query<Booking, string>({
            query: (id) => `/dashboard/booking/${id}`,
            providesTags: (result, error, id) => [{ type: 'Booking', id }],
        }),
        updateBooking: builder.mutation<Booking, { id: string; status: string; price: number; carer_id: string }>({
            query: ({ id, ...payload }) => ({
                url: `/dashboard/booking/${id}`,
                method: 'PATCH',
                body: payload,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Booking', id },
                { type: 'Booking', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetBookingsQuery,
    useDeleteBookingMutation,
    useGetBookingQuery,
    useUpdateBookingMutation
} = bookingsApi;