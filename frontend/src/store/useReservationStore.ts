import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReservationStatus = 'Active' | 'Cancelled' | 'Converted' | 'Expired';

export interface Reservation {
    id: string;
    unitId: string;
    applicantId?: string; // Optional link to Lottery Applicant
    customerName: string;
    customerPhone: string;
    reservationDate: string;
    expiryDate: string;
    status: ReservationStatus;
    notes?: string;
}

interface ReservationState {
    reservations: Reservation[];
    addReservation: (reservation: Omit<Reservation, 'id'>) => void;
    updateReservation: (id: string, updates: Partial<Reservation>) => void;
    cancelReservation: (id: string) => void;
    convertReservation: (id: string) => void; // Mark as Sold/Contracted
}

export const useReservationStore = create<ReservationState>()(
    persist(
        (set) => ({
            reservations: [],
            addReservation: (reservation) =>
                set((state) => ({
                    reservations: [
                        ...state.reservations,
                        { ...reservation, id: crypto.randomUUID() },
                    ],
                })),
            updateReservation: (id, updates) =>
                set((state) => ({
                    reservations: state.reservations.map((r) =>
                        r.id === id ? { ...r, ...updates } : r
                    ),
                })),
            cancelReservation: (id) =>
                set((state) => ({
                    reservations: state.reservations.map((r) =>
                        r.id === id ? { ...r, status: 'Cancelled' } : r
                    ),
                })),
            convertReservation: (id) =>
                set((state) => ({
                    reservations: state.reservations.map((r) =>
                        r.id === id ? { ...r, status: 'Converted' } : r
                    ),
                })),
        }),
        {
            name: 'reservation-storage',
        }
    )
);
