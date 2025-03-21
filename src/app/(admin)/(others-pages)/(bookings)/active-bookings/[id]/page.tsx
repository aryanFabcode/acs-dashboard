// app/bookings/[id]/page.tsx
"use client";
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import DetailItem from '@/components/reusable/DetailItem';
import { RootState } from '@reduxjs/toolkit/query';
import SectionList from '@/components/reusable/SectionList';
import { useParams, useRouter } from 'next/navigation';
import { useGetBookingQuery } from '@/lib/redux/api/bookingsApi';
import { useEffect, useState } from 'react';
import { setSelectedBooking } from '@/lib/redux/slices/bookingDetailsSlice';
import { useReverseGeocode } from '@/lib/hooks/useReverseGeocode';
import { getApproximateLocation, reverseGeocode } from '@/lib/utils/geoCoding';

// Add this section for the reverse geocoding functionality
type GeocodingResult = {
    address: string;
    loading: boolean;
    error: string | null;
};

export default function BookingDetails() {
    const paramsfromNavigate = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const bookingId = paramsfromNavigate?.id;
    const [address, setAddress] = useState('');

    const { selectedBooking: bookingDetails } = useSelector((state: RootState) => state.bookingDetails);
    const skip = bookingDetails?._id === bookingId;
    const { data: fetchedBooking, isLoading, isFetching } = useGetBookingQuery(bookingId, { skip });

    useEffect(() => {
        if (fetchedBooking) {
            dispatch(setSelectedBooking(fetchedBooking?.data));
        }
    }, [fetchedBooking, dispatch]);

    const loading = !skip && (isLoading || isFetching);
    const selectedBooking = skip ? bookingDetails : fetchedBooking?.data;

    const [lng, lat] = selectedBooking?.point_address.location.coordinates || [0, 0];

    useEffect(() => {
        if (selectedBooking?.point_address?.location?.coordinates) {
            reverseGeocode(lat, lng).then((data) => setAddress(data));
        }
    }, [selectedBooking?.point_address.location?.coordinates]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center p-8 bg-gray-50 rounded-xl shadow-sm">
                    <h2 className="text-xl font-medium text-gray-700">Loading client details...</h2>
                </div>
            </div>
        );
    }


    if (!selectedBooking) {
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
                        onClick={() => router.push("/bookings")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Bookings
                    </button>
                </div>
            </div>
        );
    }


    const patientNames = selectedBooking?.num_of_patients === "2"
        ? `${selectedBooking?.patient_name}, ${selectedBooking?.patient_name_2}`
        : selectedBooking?.patient_name;

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
                <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-3xl font-bold text-gray-800">Booking Details</h1>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                                    {selectedBooking.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-gray-600 mt-2">ID: {selectedBooking._id}</p>
                        </div>
                        <button
                            onClick={() => router.push("/active-bookings")}
                            className="mt-4 md:mt-0 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Back to Bookings
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600">Service Type</p>
                            <p className="font-semibold text-gray-900">{selectedBooking.service_type}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600">Care Type</p>
                            <p className="font-semibold text-gray-900">{selectedBooking.care_type}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600">Patients</p>
                            <p className="font-semibold text-gray-900">{selectedBooking.num_of_patients}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600">Created</p>
                            <p className="font-semibold text-gray-900">{format(new Date(selectedBooking.created_at), "dd MMM yyyy")}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Patient Information */}
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                        <div className="bg-teal-600 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white">Patient Information</h2>
                        </div>
                        <div className="p-6">
                            <dl className="space-y-3">
                                <DetailItem
                                    label={selectedBooking.num_of_patients === "2" ? "Patient Names" : "Patient Name"}
                                    value={patientNames}
                                />
                                <DetailItem label="Age Bracket" value={selectedBooking.age_bracket} />
                                <DetailItem label="Gender" value={selectedBooking.gender} />
                                <DetailItem label="Relationship" value={selectedBooking.relationship} />
                            </dl>
                        </div>
                    </div>

                    {/* Care Requirements */}
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                        <div className="bg-teal-600 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white">Care Requirements</h2>
                        </div>
                        <div className="p-6">
                            <dl className="space-y-3">
                                <DetailItem label="Patient Needs" value={selectedBooking.patient_needs} />
                                <DetailItem label="Care Urgency" value={selectedBooking.care_urgency} />
                                <DetailItem label="Preferred Carer Gender" value={selectedBooking.preferred_carer_gender} />
                                <DetailItem label="Ideal Carer Description" value={selectedBooking.ideal_carer_description} />
                            </dl>
                        </div>
                    </div>

                    {/* Logistics */}
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                        <div className="bg-teal-600 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white">Logistics</h2>
                        </div>
                        <div className="p-6">
                            <dl className="space-y-3">
                                <DetailItem label="Car Requirement" value={selectedBooking.car_requirement} />
                                <DetailItem label="Pet Present" value={selectedBooking.is_pet ? 'Yes' : 'No'} />
                                {selectedBooking.pet_types?.length > 0 && (
                                    <div className="pt-2">
                                        <h3 className="font-medium text-gray-700 mb-2">Pet Types</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedBooking.pet_types.map((pet, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-purple-50 text-purple-800 border border-purple-100 rounded-lg text-sm"
                                                >
                                                    {pet}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {selectedBooking.point_address?.location && (
                                    <>
                                        <DetailItem
                                            label="Location Coordinates"
                                            value={`Lat: ${selectedBooking.point_address.location.coordinates[1]?.toFixed(6)}, Lng: ${selectedBooking.point_address.location.coordinates[0]?.toFixed(6)}`}
                                        />
                                        <DetailItem
                                            label="Address"
                                            value={address}
                                        />
                                    </>

                                )}
                            </dl>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                        <div className="bg-green-600 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white">Schedule</h2>
                        </div>
                        <div className="p-6">
                            {selectedBooking?.specific_dates?.length > 0 ? (
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-2">Specific Dates</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {selectedBooking.specific_dates.map((date, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 p-2 bg-green-50 text-green-800 rounded-lg"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                                <span>{format(new Date(date), "dd MMM yyyy")}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No specific dates scheduled</p>
                            )}
                        </div>
                    </div>

                    {/* System Information */}
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                        <div className="bg-gray-700 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white">System Information</h2>
                        </div>
                        <div className="p-6">
                            <dl className="space-y-3">
                                <DetailItem label="Carer ID" value={selectedBooking.carer_id || 'Not assigned'} />
                                <DetailItem label="Client ID" value={selectedBooking.client_id || 'Not assigned'} />
                                <DetailItem label="Created At" value={format(new Date(selectedBooking.created_at), "dd MMM yyyy, HH:mm")} />
                                <DetailItem label="Updated At" value={format(new Date(selectedBooking.updated_at), "dd MMM yyyy, HH:mm")} />
                            </dl>
                        </div>
                    </div>

                    {/* Digital Signature */}
                    {selectedBooking.digital_signature && (
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                            <div className="bg-teal-600 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white">Digital Signature</h2>
                            </div>
                            <div className="p-6 flex items-center justify-center">
                                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                                    <img
                                        src={selectedBooking.digital_signature}
                                        alt="Digital Signature"
                                        className="max-w-[200px]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
