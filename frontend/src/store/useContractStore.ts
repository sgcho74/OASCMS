import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ContractStatus = 'draft' | 'active' | 'completed' | 'terminated';

export interface Payment {
  id: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
}

export interface Contract {
  id: string;
  projectId: string;
  unitNumber: string;
  customerName: string;
  totalAmount: number;
  status: ContractStatus;
  payments: Payment[];
  createdAt: string;
}

interface ContractState {
  contracts: Contract[];
  addContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'payments'>) => void;
  deleteContract: (id: string) => void;
}

// Helper to generate payment schedule
const generateSchedule = (totalAmount: number, startDate: string): Payment[] => {
  const payments: Payment[] = [];
  const downPayment = totalAmount * 0.1; // 10%
  const installment = (totalAmount * 0.9) / 10; // 90% over 10 months

  // Down Payment
  payments.push({
    id: crypto.randomUUID(),
    dueDate: startDate,
    amount: downPayment,
    status: 'pending',
    description: 'Down Payment (10%)',
  });

  // 10 Installments
  for (let i = 1; i <= 10; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    payments.push({
      id: crypto.randomUUID(),
      dueDate: date.toISOString().split('T')[0],
      amount: installment,
      status: 'pending',
      description: `Installment ${i}/10`,
    });
  }

  return payments;
};

export const useContractStore = create<ContractState>()(
  persist(
    (set) => ({
      contracts: [],
      addContract: (data) =>
        set((state) => ({
          contracts: [
            ...state.contracts,
            {
              ...data,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              payments: generateSchedule(data.totalAmount, new Date().toISOString().split('T')[0]),
            },
          ],
        })),
      deleteContract: (id) =>
        set((state) => ({
          contracts: state.contracts.filter((c) => c.id !== id),
        })),
    }),
    {
      name: 'oascms-contracts',
    }
  )
);
