// components/tables/BookingsTable.tsx
import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import Tooltip from "../ui/tooltip/Tooltip";

interface BookingTableProps {
  bookings: any[];
  page: number;
  limit: number;
  totalBookings: number;
  loading?: boolean;
  onPageChange: (newPage: number) => void;
  onDelete: (bookingId: string) => void;
  onViewDetails: (bookingId: string) => void;
  onEditBooking?: (booking: any) => void;
}

const BookingsTable: React.FC<BookingTableProps> = ({
  bookings,
  page,
  limit,
  totalBookings,
  loading,
  onPageChange,
  onDelete,
  onViewDetails,
  onEditBooking
}) => {
  const totalPages = Math.ceil(totalBookings / limit);
  const startRange = (page - 1) * limit + 1;
  const endRange = Math.min(page * limit, totalBookings);

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "dd MMM yyyy, HH:mm");

  console.log('bookings checking', bookings)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1200px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {['Booking ID', 'Client', 'Carer', 'Created At', 'Updated At', 'Dates', 'Status', 'Price', 'Actions'].map((header) => (
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
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-6 text-gray-500">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {/* #{booking._id.slice(-6)} */}
                      #{booking._id}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {booking.client_id?.slice(-6) || 'N/A'}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {booking.carer_id?.slice(-6) || 'N/A'}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {formatDate(booking.created_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {formatDate(booking.updated_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Tooltip content={booking.specific_dates?.join(', ') || 'No specific dates'}>
                        <div className="max-w-[200px] truncate">
                          {booking.specific_dates?.join(', ') || 'N/A'}
                        </div>
                      </Tooltip>

                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        size="sm"
                        color={
                          booking.status === 'pending' ? 'warning' :
                            booking.status === 'confirmed' ? 'success' : 'error'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {booking.price ? `£${booking.price}` : '-'}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => onViewDetails(booking)}
                        >
                          <Icon icon="heroicons:eye" className="w-4 h-4" />
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          color="error"
                          onClick={() => onDelete(booking._id)}
                        >
                          <Icon icon="heroicons:trash" className="w-4 h-4" />
                        </Button>
                        {onEditBooking && booking?.care_type === "custom_care" && (
                          <Tooltip content="Edit custom care booking">
                            <Button
                              size="xs"
                              variant="outline"
                              color="error"
                              onClick={() => onEditBooking(booking)}
                            >
                              <Icon icon="fluent-mdl2:generate" className="w-3 h-3" />
                            </Button>
                          </Tooltip>
                        )
                        }
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
          Showing {startRange} to {endRange} of {totalBookings} bookings
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
        {Array.from({ length: 9 }).map((_, i) => (
          <TableCell key={i} className="px-5 py-4 sm:px-6">
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

export default BookingsTable;