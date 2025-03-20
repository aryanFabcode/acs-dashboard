// components/tables/CarersTable.tsx
import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { Icon } from "@iconify/react";
import Image from "next/image";

interface CarerTableProps {
  carers: any[];
  page: number;
  limit: number;
  totalCarers: number;
  loading?: boolean;
  onPageChange: (newPage: number) => void;
  onDelete: (carerId: string) => void;
  onViewDetails: (carerId: string) => void;
}

const CarersTable: React.FC<CarerTableProps> = ({
  carers,
  page,
  limit,
  totalCarers,
  loading,
  onPageChange,
  onDelete,
  onViewDetails
}) => {
  const totalPages = Math.ceil(totalCarers / limit);
  const startRange = (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, totalCarers);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1200px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {['ID', 'Carer', 'Gender', 'Phone', 'Email', 'Status', 'Hourly Rate', 'Actions'].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <SkeletonRow />
              ) : carers.length === 0 ? (
                <TableRow>
                  <TableCell
                    // colSpan={8}
                    className="text-center py-6 text-gray-500">
                    No carers found
                  </TableCell>
                </TableRow>
              ) : (
                carers.map((carer) => (
                  <TableRow key={carer._id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-white/90">
                      #{carer._id.slice(-6)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                          {carer.profile_image ? (
                            <Image
                              width={40}
                              height={40}
                              src={carer.profile_image}
                              alt={carer.name}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-brand-500 flex items-center justify-center text-white">
                              {carer.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white/90">
                            {carer.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {carer.total_experience} yrs experience
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {carer.gender || '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {carer.phone || '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {carer.email}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        size="sm"
                        color={
                          carer.status === 'active' ? 'success' :
                            carer.status === 'pending' ? 'warning' : 'error'
                        }
                      >
                        {carer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {carer?.hourly_rate ? `£${carer.hourly_rate}` : '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => onViewDetails(carer)}
                        >
                          <Icon icon="heroicons:eye" className="w-4 h-4" />
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          color="error"
                          onClick={() => onDelete(carer._id)}
                        >
                          <Icon icon="heroicons:trash" className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/[0.05]">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {startRange} to {endRange} of {totalCarers} carers
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

const SkeletonRow = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        {Array.from({ length: 8 }).map((_, i) => (
          <TableCell key={i} className="px-5 py-4 sm:px-6">
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

export default CarersTable;