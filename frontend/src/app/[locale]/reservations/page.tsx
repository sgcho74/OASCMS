'use client';

import { useState, useEffect } from 'react';
import { useReservationStore } from '@/store/useReservationStore';
import ReservationStats from '@/components/reservations/ReservationStats';
import ReservationList from '@/components/reservations/ReservationList';
import CreateReservationModal from '@/components/reservations/CreateReservationModal';
import { Plus } from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore'; // Add import

export default function ReservationsPage() {
    const { reservations } = useReservationStore();
    const { currentUser } = useAuthStore(); // Get current user
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Filter reservations for customers
    const filteredReservations = reservations.filter(r => {
        if (currentUser?.role === 'customer') {
            return r.customerName === currentUser.fullName;
        }
        return true;
    });

    if (!isHydrated) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reservations</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Reservation
                </button>
            </div>

            <ReservationStats />

            <ReservationList reservations={filteredReservations} />

            <CreateReservationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
