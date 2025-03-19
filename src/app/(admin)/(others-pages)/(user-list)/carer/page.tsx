'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CarersTable from "@/components/tables/CarersTable";
import { useDeleteCarerMutation, useGetCarersQuery } from "@/lib/redux/api/carersApi";
import { setSelectedCarer } from "@/lib/redux/slices/carerDetailsSlice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function CarersPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching, refetch } = useGetCarersQuery({ page, limit });
  const router = useRouter();
  const dispatch = useDispatch();
  const [deleteCarer, { isLoading: isDeleting }] = useDeleteCarerMutation();

  const handleViewDetails = (carer: any) => {
    dispatch(setSelectedCarer(carer));
    router.push(`/carer/${carer._id}`);
  };

  const handleDelete = async (carerId: string) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this carer?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteCarer({ id: carerId })
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
      <PageBreadcrumb pageTitle="Carers" />
      <div className="space-y-6">
        <CarersTable
          carers={data?.data.carers || []}
          page={page}
          limit={limit}
          totalCarers={data?.data.totalCarer || 0}
          loading={isLoading || isFetching}
          onPageChange={setPage}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
}
