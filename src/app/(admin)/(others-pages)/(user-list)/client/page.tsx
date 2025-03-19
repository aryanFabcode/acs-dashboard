"use client"
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ClientTable from "@/components/tables/ClientTable";
import { useDeleteClientMutation, useGetClientsQuery } from "@/lib/redux/api/clientApi";
import { setSelectedClient } from "@/lib/redux/slices/clientDetailsSlice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { confirmAlert } from 'react-confirm-alert';
import { toast } from "react-toastify";

export default function BasicTables() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const router = useRouter();
  const dispatch = useDispatch();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();

  const { data, isLoading, isFetching, refetch } = useGetClientsQuery({ page, limit });

  const handleDelete = async (id: string) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteClient(id).unwrap();
              toast.success('Deleted successfully');
              refetch();
            } catch (error) {
              toast.error('Failed to delete');
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const handleViewDetails = (client: any) => {
    dispatch(setSelectedClient(client));
    router.push(`/client/${client._id}`);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Clients" />
      <div className="space-y-6">
        <ClientTable
          clients={data?.data.clients || []}
          page={page}
          limit={limit}
          totalClients={data?.data.totalClient || 0}
          loading={isLoading || isFetching}
          onPageChange={setPage}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
}
