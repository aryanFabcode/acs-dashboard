import { apiSlice } from "../apiSlice";

export interface Carer {
    _id: string;
    name: string;
    gender: string;
    phone: string;
    email: string;
    status: string;
    hourly_rate: number;
    profile_image?: string;
    total_experience: number;
    skills: string[];
}

interface CarersResponse {
    status: number;
    data: {
        carers: Carer[];
        totalCarer: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

type CarerPayload = {
    name: string;
    phone: string;
    email: string;
    password: string;
    profile_image: string;
    doc_dbs: string;
    doc_rtw_uk: string;
    doc_training_certificates: string;
    doc_cqc_registration: string;
    reference_email: string;
    skills: string[];
    care_types: string[];
    languages: string[];
    has_own_car: number;
    get_to_work_by: string;
    event_chaperoning: string;
    holiday_chaperoning: string;
    can_drive_patients: number;
    about_me: string;
    title: string;
    gender: string;
    own_car: boolean;
    total_experience: number;
    digital_signature: string;
    experience: string[];
    experience_with_conditions: string[];
    hobbies: string[];
    pet_preferences: string[];
    charges: string;
    carer_type: string;
    hourly_rate: number;
    live_in_rate: number;
    certificates: string[];
    training_certificate: string;
    travel_receipt: string;
    otp: string;
    otpExpiresAt: string;
    point_address: {
        latitude: number;
        longitude: number;
        address: string;
    };
    status: string;
};

export const carersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCarers: builder.query<CarersResponse, {
            page?: number;
            limit?: number;
        }>({
            query: ({ page = 1, limit = 10 }) => ({
                url: '/dashboard/carers',
                params: { page, limit }
            }),
            transformResponse: (response: any) => ({
                status: response.status,
                data: {
                    carers: response.data.carers,
                    totalCarer: response.data.totalCarer,
                    hasNextPage: response.data.hasNextPage,
                    hasPrevPage: response.data.hasPrevPage
                }
            })
        }),
        deleteCarer: builder.mutation<Carer, { id: string }>({
            query: ({ id }) => ({
                url: `/dashboard/carer/${id}`,
                method: 'PATCH',
                body: { status: 'deleted' }
            }),
            invalidatesTags: ['Carer'],
        }),
        getCarerDetails: builder.query<Carer, string>({
            query: (id) => `/dashboard/carer?id=${id}`,
            providesTags: (result, error, id) => (result ? [{ type: 'Carer', id }] : []),
        }),
        createCarer: builder.mutation({
            query: (carerData: CarerPayload) => ({
                url: '/dashboard/carer',
                method: 'POST',
                body: carerData,
            }),
            invalidatesTags: ['Carer'],
        }),
    }),
});

export const { useGetCarersQuery, useGetCarerDetailsQuery, useDeleteCarerMutation, useCreateCarerMutation } = carersApi;