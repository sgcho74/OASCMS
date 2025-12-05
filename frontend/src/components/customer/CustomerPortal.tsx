'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useContractStore } from '@/store/useContractStore';
import { useReservationStore } from '@/store/useReservationStore';

/**
 * Customer Portal - Shows only the customer's own data
 */
export default function CustomerPortal() {
    const { currentUser } = useAuthStore();
    const { contracts } = useContractStore();
    const { reservations } = useReservationStore();

    // Filter data for current customer
    const myContracts = contracts.filter(c => c.customerName === currentUser?.fullName);
    const myReservations = reservations.filter(r => r.customerName === currentUser?.fullName);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Portal</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, {currentUser?.fullName}</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800">
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">My Contracts</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{myContracts.length}</dd>
                </div>
                <div className="rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800">
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Active Reservations</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                        {myReservations.filter(r => r.status === 'Active').length}
                    </dd>
                </div>
                <div className="rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800">
                    <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Total Value</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                        ${myContracts.reduce((sum, c) => sum + c.totalAmount, 0).toLocaleString()}
                    </dd>
                </div>
            </div>

            {/* My Contracts */}
            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                <div className="border-b border-gray-200 px-4 py-5 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">My Contracts</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Unit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                            {myContracts.map(contract => (
                                <tr key={contract.id}>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{contract.unitNumber}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">${contract.totalAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">
                                            {contract.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(contract.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {myContracts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No contracts found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* My Reservations */}
            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                <div className="border-b border-gray-200 px-4 py-5 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">My Reservations</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Unit ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Reserved Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Expiry Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                            {myReservations.map(reservation => (
                                <tr key={reservation.id}>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{reservation.unitId}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${reservation.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                            }`}>
                                            {reservation.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(reservation.reservationDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {reservation.expiryDate ? new Date(reservation.expiryDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                            {myReservations.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No reservations found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
