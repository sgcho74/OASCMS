'use client';

import clsx from 'clsx';

type ScheduleItem = {
  id: string;
  stage: 'Deposit' | 'Progress' | 'Final';
  installment: number;
  dueDate: string;
  amount: number;
  paid: number;
  status: 'Paid' | 'Overdue' | 'Due' | 'Future';
};

const schedule: ScheduleItem[] = [
  { id: '1', stage: 'Deposit', installment: 1, dueDate: '2024-01-15', amount: 45000, paid: 45000, status: 'Paid' },
  { id: '2', stage: 'Deposit', installment: 2, dueDate: '2024-02-15', amount: 45000, paid: 0, status: 'Overdue' },
  { id: '3', stage: 'Progress', installment: 1, dueDate: '2024-04-15', amount: 45000, paid: 0, status: 'Future' },
  { id: '4', stage: 'Progress', installment: 2, dueDate: '2024-06-15', amount: 45000, paid: 0, status: 'Future' },
  { id: '5', stage: 'Final', installment: 1, dueDate: '2025-01-15', amount: 270000, paid: 0, status: 'Future' },
];

export default function PaymentScheduleTable() {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Stage</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Installment</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Due Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Paid</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Pay</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedule.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{item.stage}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.installment}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.dueDate}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${item.amount.toLocaleString()}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${item.paid.toLocaleString()}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className={clsx(
                      'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                      item.status === 'Paid' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                      item.status === 'Overdue' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                      'bg-gray-50 text-gray-600 ring-gray-500/10'
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    {item.status !== 'Paid' && (
                      <button className="text-indigo-600 hover:text-indigo-900">Record Payment</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
