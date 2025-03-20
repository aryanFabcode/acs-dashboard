'use client'
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, CreditCard, Download, ExternalLink, Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useGetPaymentByIdQuery } from '@/lib/redux/api/paymentsApi';
import { useRouter } from 'next/navigation';

export default function PaymentDetailScreen() {
    const router = useRouter();
    const params = useParams();
    const paymentId = params?.id;

    const { data: paymentData, isLoading, isError } = useGetPaymentByIdQuery(paymentId || '');
    const [darkMode, setDarkMode] = useState(false);

    // Toggle dark mode
    const toggleDarkMode = () => setDarkMode(!darkMode);

    // Apply dark mode class to document when dark mode state changes
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);



    // Format date function
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Format currency
    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: currency,
        }).format(amount / 100); // Assuming amount is in cents
    };

    // Handle loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader className="h-12 w-12 text-blue-600 animate-spin" />
                    <p className="mt-4 text-gray-700 dark:text-gray-300">Loading payment details...</p>
                </div>
            </div>
        );
    }

    // Handle error state
    if (isError || !paymentData?.data) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Payment</h1>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        We couldn't load the payment details. The payment ID may be invalid or the server is unavailable.
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const data = paymentData?.data;
    const payment = paymentData?.data;

    return (
        <>
            {/* <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
                        <div className="bg-indigo-600 p-6">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-white">Payment Details</h1>
                                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${payment.status === 'COMPLETED' ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}>
                                    {payment.status}
                                </span>
                            </div>
                            <div className="mt-4">
                                <div className="text-3xl font-bold text-white">
                                    {formatCurrency(payment.amountMoney.amount, payment.amountMoney.currency)}
                                </div>
                                <div className="text-indigo-200 mt-1">
                                    {payment.sourceType === 'CARD' ? 'Card Payment' : payment.sourceType}
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-indigo-400 mb-2">Payment Information</h2>
                                        <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Receipt Number</span>
                                                <span className="font-medium">{payment.receiptNumber}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Order ID</span>
                                                <span className="font-medium truncate max-w-xs" title={payment.orderId}>
                                                    {payment.orderId.substring(0, 12)}...
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Reference ID</span>
                                                <span className="font-medium truncate max-w-xs" title={payment.referenceId}>
                                                    {payment.referenceId.substring(0, 12)}...
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Source</span>
                                                <span className="font-medium">{payment.sourceType}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold text-indigo-400 mb-2">Timing</h2>
                                        <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Created</span>
                                                <span className="font-medium">{formatDate(payment.createdAt)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Updated</span>
                                                <span className="font-medium">{formatDate(payment.updatedAt)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Delay Action</span>
                                                <span className="font-medium">{payment.delayAction}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Delayed Until</span>
                                                <span className="font-medium">{formatDate(payment.delayedUntil)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-indigo-400 mb-2">Amount Details</h2>
                                        <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Subtotal</span>
                                                <span className="font-medium">
                                                    {formatCurrency(payment.amountMoney.amount, payment.amountMoney.currency)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Total</span>
                                                <span className="font-medium">
                                                    {formatCurrency(payment.totalMoney.amount, payment.totalMoney.currency)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Currency</span>
                                                <span className="font-medium">{payment.totalMoney.currency}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold text-indigo-400 mb-2">Location Details</h2>
                                        <div className="bg-gray-700 rounded-lg p-4">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Location ID</span>
                                                <span className="font-medium">{payment.locationId}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold text-indigo-400 mb-2">Actions</h2>
                                        <div className="space-y-3">
                                            <a
                                                href={payment.receiptUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                </svg>
                                                View Receipt
                                            </a>
                                            <button className="flex items-center justify-center w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                                                    <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                                                </svg>
                                                Download Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-gray-700 text-center text-xs text-gray-500">
                                <p>Payment ID: {payment._id}</p>
                                <p className="mt-1">Version Token: {payment.versionToken.substring(0, 20)}...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="container mx-auto px-4 py-8">
                    {/* Header with Dark Mode Toggle */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Payment Details</h1>
                        {/* <button
                            onClick={toggleDarkMode}
                            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium"
                        >
                            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
                        </button> */}
                    </div>

                    {/* Main Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
                        {/* Status Header */}
                        <div className={`px-6 py-4 ${data.status === 'COMPLETED' ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm opacity-80">Payment Status</p>
                                    <p className="text-xl font-bold">{data.status}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm opacity-80">Receipt Number</p>
                                    <p className="text-xl font-bold">{data.receiptNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Amount Section */}
                        <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                                    <p className="text-3xl font-bold text-gray-800 dark:text-white">
                                        {formatCurrency(data.totalMoney.amount, data.totalMoney.currency)}
                                    </p>
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                                    <CreditCard className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Payment Source: {data.sourceType}</p>
                        </div>

                        {/* Date Information */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Date</p>
                                    <p className="font-medium text-gray-800 dark:text-white">{formatDate(data.createdAt)}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Delayed Until</p>
                                    <p className="font-medium text-gray-800 dark:text-white">{formatDate(data.delayedUntil)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Reference Information */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                                    <p className="font-medium text-gray-800 dark:text-white truncate">{data.orderId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Reference ID</p>
                                    <p className="font-medium text-gray-800 dark:text-white truncate">{data.referenceId}</p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Location ID</p>
                                    <p className="font-medium text-gray-800 dark:text-white">{data.locationId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Delay Action</p>
                                    <p className="font-medium text-gray-800 dark:text-white">{data.delayAction}</p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                                    <p className="font-medium text-gray-800 dark:text-white">{formatDate(payment.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Updated</p>
                                    <p className="font-medium text-gray-800 dark:text-white">{formatDate(payment.delayedUntil)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer with Actions */}
                        <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                <p>Payment ID: {data._id}</p>
                                <div className="mt-2 pt-4 border-t border-gray-700 text-left text-xs text-gray-500">
                                    <p className="mt-0">Version Token: {payment.versionToken.substring(0, 100)}...</p>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <a
                                    href={data.receiptUrl}
                                    target="_blank"
                                    className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Receipt
                                </a>
                                <button className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}