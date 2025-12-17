import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ContractStatus = 'draft' | 'active' | 'completed' | 'terminated';

export type StageType = 'Deposit' | 'Progress' | 'Final';

export interface PaymentSchedule {
  id: string;
  stageType: StageType;
  installmentNo: number; // e.g., 1, 2, 3 within each stage
  name: string; // e.g., "선수금 1차", "중도금 3차"
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
}

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
  reservationId?: string; // Link to source Reservation
  applicantId?: string; // Link to source Lottery Applicant
  payments: Payment[]; // Legacy - keeping for compatibility
  paymentSchedules: PaymentSchedule[]; // New multi-stage schedules
  createdAt: string;
}

// Default payment template: 20% Deposit (2×10%), 40% Progress (4×10%), 40% Final
const generatePaymentSchedules = (totalAmount: number, contractDate: string): PaymentSchedule[] => {
  const schedules: PaymentSchedule[] = [];
  const baseDate = new Date(contractDate);

  // Deposit: 2 installments of 10% each
  for (let i = 1; i <= 2; i++) {
    const dueDate = new Date(baseDate);
    dueDate.setDate(dueDate.getDate() + (i - 1) * 7); // 0 days, 7 days
    schedules.push({
      id: crypto.randomUUID(),
      stageType: 'Deposit',
      installmentNo: i,
      name: `선수금 ${i}차`,
      dueDate: dueDate.toISOString().split('T')[0],
      amount: totalAmount * 0.1,
      status: 'pending',
    });
  }

  // Progress: 4 installments of 10% each
  for (let i = 1; i <= 4; i++) {
    const dueDate = new Date(baseDate);
    dueDate.setMonth(dueDate.getMonth() + (i * 3)); // 3, 6, 9, 12 months
    schedules.push({
      id: crypto.randomUUID(),
      stageType: 'Progress',
      installmentNo: i,
      name: `중도금 ${i}차`,
      dueDate: dueDate.toISOString().split('T')[0],
      amount: totalAmount * 0.1,
      status: 'pending',
    });
  }

  // Final: 1 installment of 40%
  const finalDate = new Date(baseDate);
  finalDate.setMonth(finalDate.getMonth() + 18); // 18 months
  schedules.push({
    id: crypto.randomUUID(),
    stageType: 'Final',
    installmentNo: 1,
    name: '잔금',
    dueDate: finalDate.toISOString().split('T')[0],
    amount: totalAmount * 0.4,
    status: 'pending',
  });

  return schedules;
};

interface ContractState {
  contracts: Contract[];
  addContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'payments' | 'paymentSchedules'>) => void;
  deleteContract: (id: string) => void;
  updatePaymentStatus: (contractId: string, paymentId: string, status: 'pending' | 'paid' | 'overdue') => void;
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
              payments: [], // Legacy - empty
              paymentSchedules: generatePaymentSchedules(
                data.totalAmount,
                new Date().toISOString().split('T')[0]
              ),
            },
          ],
        })),
      deleteContract: (id) =>
        set((state) => ({
          contracts: state.contracts.filter((c) => c.id !== id),
        })),
      updatePaymentStatus: (contractId, paymentId, status) =>
        set((state) => ({
          contracts: state.contracts.map((contract) =>
            contract.id === contractId
              ? {
                ...contract,
                paymentSchedules: contract.paymentSchedules.map((payment) =>
                  payment.id === paymentId ? { ...payment, status } : payment
                ),
              }
              : contract
          ),
        })),
    }),
    {
      name: 'oascms-contracts',
    }
  )
);
