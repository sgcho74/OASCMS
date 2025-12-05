import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PaymentMethod = 'bank_transfer' | 'card' | 'cash' | 'check';

export interface Payment {
    id: string;
    contractId: string;
    scheduleId?: string; // Link to PaymentSchedule
    amount: number;
    currency: string;
    paymentDate: string;
    method: PaymentMethod;
    payerName: string;
    reference?: string; // Receipt no., bank ref
    notes?: string;
    createdAt: string;
}

interface PaymentState {
    payments: Payment[];
    addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
    getPaymentsByContract: (contractId: string) => Payment[];
    getPaymentsBySchedule: (scheduleId: string) => Payment[];
    getTotalPaid: (contractId: string) => number;
}

export const usePaymentStore = create<PaymentState>()(
    persist(
        (set, get) => ({
            payments: [],
            addPayment: (data) =>
                set((state) => ({
                    payments: [
                        ...state.payments,
                        {
                            ...data,
                            id: crypto.randomUUID(),
                            createdAt: new Date().toISOString(),
                        },
                    ],
                })),
            getPaymentsByContract: (contractId) =>
                get().payments.filter((p) => p.contractId === contractId),
            getPaymentsBySchedule: (scheduleId) =>
                get().payments.filter((p) => p.scheduleId === scheduleId),
            getTotalPaid: (contractId) =>
                get()
                    .payments.filter((p) => p.contractId === contractId)
                    .reduce((sum, p) => sum + p.amount, 0),
        }),
        {
            name: 'oascms-payments',
        }
    )
);
