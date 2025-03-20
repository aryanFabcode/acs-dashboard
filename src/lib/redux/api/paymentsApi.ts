import { apiSlice } from "../apiSlice";


export interface Payment {
    _id: string;
    amount_money: {
        amount: number;
        currency: string;
    };
    status: string;
    source_type: string;
    created_at: string;
    receipt_number: string;
    receipt_url: string;
    card_details?: {
        last4: string;
        cardBrand: string;
    };
}

interface PaymentsResponse {
    status: number;
    data: {
        jsonResponse: Payment[];
        totalPayment: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

interface SinglePaymentResponse {
    status: number;
    message: string;
    data: Payment;
}

export const paymentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPayments: builder.query<PaymentsResponse, {
            page?: number;
            limit?: number;
        }>({
            query: ({ page = 1, limit = 10 }) => ({
                url: '/dashboard/payments',
                params: { page, limit }
            }),
            transformResponse: (response: any) => ({
                status: response.status,
                data: {
                    jsonResponse: response.data.jsonResponse,
                    totalPayment: response.data.totalPayment,
                    hasNextPage: response.data.hasNextPage,
                    hasPrevPage: response.data.hasPrevPage
                }
            })
        }),
        getPaymentById: builder.query<SinglePaymentResponse, string>({
            query: (id) => ({
                url: `/dashboard/payment`,
                params: { id }
            })
        }),
    }),
});

export const { useGetPaymentsQuery, useGetPaymentByIdQuery } = paymentsApi;