'use client';

import { PaymentSchedule } from '@/store/useContractStore';
import { usePaymentStore } from '@/store/usePaymentStore';
import { useContractStore } from '@/store/useContractStore';
import { CheckCircle } from 'lucide-react';
import PermissionGate from '@/components/auth/PermissionGate';

interface Props {
  contractId: string;
  schedules: PaymentSchedule[];
}

export default function PaymentScheduleTable({ contractId, schedules }: Props) {
  const { getPaymentsBySchedule, getPaymentsByContract } = usePaymentStore();
  const { updatePaymentStatus } = useContractStore();

  const handleMarkAsPaid = (paymentId: string) => {
    updatePaymentStatus(contractId, paymentId, 'paid');
  };

  // Group by stage
  const stages = ['Deposit', 'Progress', 'Final'] as const;

  return (
    <div className="space-y-6">
      {stages.map((stage) => {
        const stageSchedules = schedules.filter((s) => s.stageType === stage);
        if (stageSchedules.length === 0) return null;

        const stageTotal = stageSchedules.reduce((sum, s) => sum + s.amount, 0);
        const stagePaid = stageSchedules.reduce((sum, s) => {
          const allContractPayments = getPaymentsBySchedule(s.id); // This is actually getting by schedule ID, but we need consistent logic.
          // Ideally we should use the same logic as rows, but for summary, let's stick to simple sum for now or refactor.
          // Actually, let's use the same logic to be accurate.
          const contractPayments = getPaymentsByContract(contractId);
          const relevantPayments = contractPayments.filter(p => {
             if (p.scheduleId) return p.scheduleId === s.id;
             return s.stageType === 'Deposit' && s.installmentNo === 1;
          });
          return sum + relevantPayments.reduce((pSum, p) => pSum + p.amount, 0);
        }, 0);

        return (
          <div key={stage} className="rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{stage}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Paid: ${stagePaid.toLocaleString()} / ${stageTotal.toLocaleString()}
                </div>
              </div>
            </div>

            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Installment
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Due Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    PAID (Plan)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    PAID (Actual)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Outstanding
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                {stageSchedules.map((schedule) => {
                  // Calculate actual paid amount from payments
                  // Include legacy payments (no scheduleId) in the first Deposit schedule
                  const allContractPayments = getPaymentsByContract(contractId);
                  const relevantPayments = allContractPayments.filter(p => {
                    if (p.scheduleId) return p.scheduleId === schedule.id;
                    // If no scheduleId, attribute to "Deposit 1" (선수금 1차)
                    return schedule.stageType === 'Deposit' && schedule.installmentNo === 1;
                  });
                  
                  const paidAmount = relevantPayments.reduce((sum, p) => sum + p.amount, 0);
                  const outstanding = Math.max(0, schedule.amount - paidAmount);
                  const isFullyPaid = paidAmount >= schedule.amount;
                  const isPaid = schedule.status === 'paid' || isFullyPaid;

                  return (
                    <tr key={schedule.id} className={isPaid ? 'bg-green-50 dark:bg-green-900/10' : ''}>
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {schedule.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {schedule.dueDate}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        ${schedule.amount.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        <span className={paidAmount > 0 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-400'}>
                          ${paidAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        <span className={outstanding > 0 ? 'text-orange-600 dark:text-orange-400 font-medium' : 'text-gray-400'}>
                          ${outstanding.toLocaleString()}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${isPaid
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : schedule.status === 'overdue'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}
                        >
                          {isPaid ? 'PAID' : schedule.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        {!isPaid && (
                          <PermissionGate permission="contracts:write">
                            <button
                              onClick={() => handleMarkAsPaid(schedule.id)}
                              className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Mark as Paid
                            </button>
                          </PermissionGate>
                        )}
                        {isPaid && (
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Paid</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* Summary */}
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ${schedules.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Paid</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              ${schedules
                .reduce((sum, s) => {
                  const allContractPayments = getPaymentsByContract(contractId);
                  const relevantPayments = allContractPayments.filter(p => {
                    if (p.scheduleId) return p.scheduleId === s.id;
                    return s.stageType === 'Deposit' && s.installmentNo === 1;
                  });
                  return sum + relevantPayments.reduce((pSum, p) => pSum + p.amount, 0);
                }, 0)
                .toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Outstanding</p>
            <p className="text-lg font-bold text-orange-600">
              ${schedules
                .reduce((sum, s) => {
                  const allContractPayments = getPaymentsByContract(contractId);
                  const relevantPayments = allContractPayments.filter(p => {
                    if (p.scheduleId) return p.scheduleId === s.id;
                    return s.stageType === 'Deposit' && s.installmentNo === 1;
                  });
                  const paid = relevantPayments.reduce((pSum, p) => pSum + p.amount, 0);
                  return sum + (s.amount - paid);
                }, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
