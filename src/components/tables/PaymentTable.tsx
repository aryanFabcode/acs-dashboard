"use client"
import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { Icon } from "@iconify/react";
import { format } from "date-fns";

interface PaymentTableProps {
    payments: any[];
    page: number;
    limit: number;
    totalPayments: number;
    loading?: boolean;
    onPageChange: (newPage: number) => void;
    onViewReceipt: (receiptUrl: string) => void;
}

const PaymentsTable: React.FC<PaymentTableProps> = ({
    payments,
    page,
    limit,
    totalPayments,
    loading,
    onPageChange,
    onViewReceipt
}) => {
    const totalPages = Math.ceil(totalPayments / limit);
    const startRange = (page - 1) * limit + 1;
    const endRange = Math.min(page * limit, totalPayments);

    const formatCurrency = (amount: number, currency: string = 'GBP') => {
        try {
            return new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: currency || 'GBP', // Fallback to GBP if currency is undefined
                minimumFractionDigits: 2,
            }).format(amount / 100);
        } catch (error) {
            // Fallback formatting if Intl.NumberFormat fails
            return `${currency || 'GBP'} ${(amount / 100).toFixed(2)}`;
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1200px]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                {['Payment ID', 'Amount', 'Status', 'Payment Method', 'Date', 'Receipt #', 'Actions'].map((header) => (
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
                            ) : payments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                                        No payments found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                payments.map((payment) => (
                                    <TableRow key={payment._id}>
                                        <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-gray-400">
                                            #{payment._id.slice(-6)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {formatCurrency(payment.amount_money?.amount, payment.amount_money?.currency)}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <Badge
                                                size="sm"
                                                color={
                                                    payment.status === 'COMPLETED' ? 'success' :
                                                        payment.status === 'PENDING' ? 'warning' : 'error'
                                                }
                                            >
                                                {payment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                {payment.card_details ? (
                                                    <>
                                                        <Icon
                                                            icon={`fa6-brands:${payment.card_details.cardBrand.toLowerCase()}`}
                                                            className="w-5 h-5 text-gray-600"
                                                        />
                                                        **** {payment.card_details.last4}
                                                    </>
                                                ) : (
                                                    payment.source_type?.replace(/_/g, ' ')
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {format(new Date(payment.created_at), "dd MMM yyyy, HH:mm")}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {payment.receipt_number || 'N/A'}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                onClick={() => onViewReceipt(payment.receipt_url)}
                                            >
                                                <Icon icon="heroicons:document-text" className="w-4 h-4 mr-2" />
                                                View Receipt
                                            </Button>
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
                    Showing {startRange} to {endRange} of {totalPayments} payments
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
                {Array.from({ length: 7 }).map((_, i) => (
                    <TableCell key={i} className="px-5 py-4 sm:px-6">
                        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                    </TableCell>
                ))}
            </TableRow>
        ))}
    </>
);

export default PaymentsTable;