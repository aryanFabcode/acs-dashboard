"use client";
import { useGetBookingQuery, useUpdateBookingMutation } from "@/lib/redux/api/bookingsApi";
import { useGetCarersQuery } from "@/lib/redux/api/carersApi";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import DetailItem from "@/components/reusable/DetailItem";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";

export default function CustomBookingDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [price, setPrice] = useState<number>(0);
    const [carerId, setCarerId] = useState<string>("");
    const { selectedBooking: booking } = useSelector((state: RootState) => state.bookingDetails);

    const patientNames = booking?.num_of_patients === "2"
        ? `${booking.patient_name}, ${booking.patient_name_2}`
        : booking?.patient_name;

    //   const { data: booking, isLoading, error } = useGetBookingQuery(id as string);
    const { data: carers } = useGetCarersQuery({ page: 1, limit: 100 });
    const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await updateBooking({
                id: id as string,
                status: "inactive",
                price,
                carer_id: carerId
            }).unwrap();
            toast.success("Booking updated!");
            router.push("/custom-bookings");
        } catch (err) {
            toast.error("Update failed");
        }
    };

    if (!booking) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">No Booking Selected</h2>
                    <p className="text-gray-600 mb-6">Please select a booking from the list to view details.</p>
                    <button
                        onClick={() => router.push("/custom-bookings")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Bookings
                    </button>
                </div>
            </div>
        );
    }
    // if (isLoading) return <div>Loading...</div>;
    // if (error) return <div>Error loading booking</div>;

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'inactive': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <div className="min-h-screen p-0">
            <div className="max-w-8xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Booking Details</h1>
                        <p className="text-gray-600">Manage booking information and assignments</p>
                    </div>
                    <button
                        onClick={() => router.push("/custom-bookings")}
                        className="mt-4 md:mt-0 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Back to Bookings
                    </button>
                </div>

                {/* Booking Info Card */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6 transition-all hover:shadow-lg">
                    <div className="bg-teal-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white">Booking Information</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="mb-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                        {booking.status.toUpperCase()}
                                    </span>
                                </div>
                                <DetailItem label="Service Type" value={booking.service_type} />
                                <DetailItem label="Patient Name(s)" value={patientNames || 'Not specified'} />
                                <DetailItem label="Created At" value={format(new Date(booking.created_at), "dd MMM yyyy, HH:mm")} />
                            </div>
                            <div className="space-y-4">
                                {booking.client_id && <DetailItem label="Client ID" value={booking.client_id} />}
                                {booking.carer_id && <DetailItem label="Current Carer" value={booking.carer_id} />}
                                {booking.price && <DetailItem label="Current Price" value={`£${booking.price}`} />}
                                {booking.updated_at && <DetailItem label="Last Updated" value={format(new Date(booking.updated_at), "dd MMM yyyy, HH:mm")} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assignment Form Card */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                    <div className="bg-teal-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white">Assign Carer & Set Price</h2>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Price (£)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500">£</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(Number(e.target.value))}
                                            className="pl-8 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            required
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Select Carer</label>
                                    <select
                                        value={carerId}
                                        onChange={(e) => setCarerId(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                                        required
                                    >
                                        <option value="">Choose carer</option>
                                        {carers?.data.carers.map((c) => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-900 transition-colors focus:ring-4 focus:ring-indigo-300 font-medium flex items-center"
                                >
                                    {isUpdating ? (
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                    )}
                                    {isUpdating ? "Processing..." : "Submit Assignment"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}