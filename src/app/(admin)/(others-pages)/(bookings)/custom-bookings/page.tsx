'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BookingsTable from "@/components/tables/BookingsTable";
import { useDeleteBookingMutation, useGetBookingsQuery } from "@/lib/redux/api/bookingsApi";
import { setSelectedBooking } from "@/lib/redux/slices/bookingDetailsSlice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function CustomBookingTable() {
    const [page, setPage] = useState(1);
    const limit = 10;
    const status = "custom";
    const router = useRouter();
    const dispatch = useDispatch();
    const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();

    const { data, isLoading, isFetching, refetch } = useGetBookingsQuery({ page, limit, status });

    const handleViewDetails = (booking: any) => {
        dispatch(setSelectedBooking(booking));
        router.push(`/custom-bookings/${booking._id}`);
    };

    const handleEditBooking = (booking: any) => {
        dispatch(setSelectedBooking(booking));
        router.push(`/custom-bookings/${booking._id}/generate-invoice`);
    };


    const handleDelete = async (id: string) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this item?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await deleteBooking(id).unwrap();
                            toast.success('Deleted successfully');
                            refetch();
                        } catch (error) {
                            toast.error('Failed to delete');
                            console.error('Delete failed:', error);
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    };

    return (
        <div>
            <PageBreadcrumb pageTitle="Custom Bookings" />
            <div className="space-y-6">
                <BookingsTable
                    bookings={data?.data.bookings || []}
                    page={page}
                    limit={limit}
                    totalBookings={data?.data.totalBooking || 0}
                    loading={isLoading || isFetching}
                    onPageChange={setPage}
                    onDelete={handleDelete}
                    onViewDetails={handleViewDetails}
                    onEditBooking={handleEditBooking}
                />
            </div>
        </div>
    );
}
