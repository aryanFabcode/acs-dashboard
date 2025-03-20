'use client'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PaymentsTable from "@/components/tables/PaymentTable";
import { useGetPaymentsQuery } from "@/lib/redux/api/paymentsApi";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function PaymentsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetPaymentsQuery({ page, limit });

  const handleViewReceipt = (receiptUrl: string) => {
    window.open(receiptUrl, '_blank');
  };

  const handleViewDetails = (payment: any) => {
    router.push(`/payments/${payment._id}`);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Payments" />
      <div className="space-y-6">
        <PaymentsTable
          payments={data?.data.jsonResponse || []}
          page={page}
          limit={limit}
          totalPayments={data?.data.totalPayment || 0}
          loading={isLoading}
          onPageChange={setPage}
          onViewReceipt={handleViewReceipt}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
}
