// app/bookings/[id]/page.tsx
"use client";
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import DetailItem from '@/components/reusable/DetailItem';
import { RootState } from '@reduxjs/toolkit/query';
import SectionList from '@/components/reusable/SectionList';

export default function BookingDetails() {
    const { selectedBooking } = useSelector((state: RootState) => state.bookingDetails);

    if (!selectedBooking) return <div>No booking selected</div>;
    const patientNames = selectedBooking.num_of_patients === "2"
        ? `${selectedBooking.patient_name}, ${selectedBooking.patient_name_2}`
        : selectedBooking.patient_name;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Booking Details</h1>
                <p className="text-gray-600">ID: {selectedBooking._id}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* General Information */}
                <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4">General Information</h2>
                    <dl className="space-y-2">
                        <DetailItem label="Status" value={selectedBooking.status} />
                        <DetailItem label="Service Type" value={selectedBooking.service_type} />
                        <DetailItem label="Care Type" value={selectedBooking.care_type} />
                        <DetailItem label="Created At" value={format(new Date(selectedBooking.created_at), "dd MMM yyyy, HH:mm")} />
                        <DetailItem label="Updated At" value={format(new Date(selectedBooking.updated_at), "dd MMM yyyy, HH:mm")} />
                    </dl>
                </div>

                {/* Patient Information */}
                <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4">Patient Information</h2>
                    <dl className="space-y-2">
                        <DetailItem label="Number of Patients" value={selectedBooking.num_of_patients} />
                        <DetailItem
                            label={selectedBooking.num_of_patients === "2" ? "Patient Names" : "Patient Name"}
                            value={patientNames}
                        />
                        <DetailItem label="Age Bracket" value={selectedBooking.age_bracket} />
                        <DetailItem label="Gender" value={selectedBooking.gender} />
                        <DetailItem label="Relationship" value={selectedBooking.relationship} />
                    </dl>
                </div>

                {/* Care Requirements */}
                <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4">Care Requirements</h2>
                    <dl className="space-y-2">
                        <DetailItem label="Patient Needs" value={selectedBooking.patient_needs} />
                        <DetailItem label="Care Urgency" value={selectedBooking.care_urgency} />
                        <DetailItem label="Preferred Carer Gender" value={selectedBooking.preferred_carer_gender} />
                        <DetailItem label="Ideal Carer Description" value={selectedBooking.ideal_carer_description} />
                    </dl>
                </div>

                {/* Logistics */}
                <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4">Logistics</h2>
                    <dl className="space-y-2">
                        <DetailItem label="Car Requirement" value={selectedBooking.car_requirement} />
                        <DetailItem label="Pet Present" value={selectedBooking.is_pet ? 'Yes' : 'No'} />
                        {selectedBooking.pet_types?.length > 0 && (
                            <DetailItem label="Pet Types" value={selectedBooking.pet_types.join(', ')} />
                        )}
                        {selectedBooking.point_address?.location && (
                            <DetailItem
                                label="Location Coordinates"
                                value={`Lat: ${selectedBooking.point_address.location.coordinates[1]?.toFixed(6)}, Lng: ${selectedBooking.point_address.location.coordinates[0]?.toFixed(6)}`}
                            />
                        )}
                    </dl>
                </div>

                {/* Schedule */}
                <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4">Schedule</h2>
                    <SectionList
                        title="Specific Dates"
                        items={selectedBooking.specific_dates?.map(date =>
                            format(new Date(date), "dd MMM yyyy")) || []}
                    />
                </div>

                {/* System Information */}
                <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4">System Information</h2>
                    <dl className="space-y-2">
                        <DetailItem label="Carer ID" value={selectedBooking.carer_id} />
                        <DetailItem label="Client ID" value={selectedBooking.client_id} />
                    </dl>
                </div>

                {/* Digital Signature */}
                {selectedBooking.digital_signature && (
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold mb-4">Digital Signature</h2>
                        <img
                            src={selectedBooking.digital_signature}
                            alt="Digital Signature"
                            className="max-w-[200px] mx-auto border rounded-lg"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
