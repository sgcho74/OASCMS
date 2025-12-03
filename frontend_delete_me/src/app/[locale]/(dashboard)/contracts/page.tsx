'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

const contracts = [
  { id: 'c1', number: 'CTR-2024-001', customer: 'Ahmed Al-Mansour', unit: '101-A', amount: '$450,000', status: 'Active', date: '2024-01-15' },
  { id: 'c2', number: 'CTR-2024-002', customer: 'Kim Min-su', unit: '102-B', amount: '$380,000', status: 'PendingSignature', date: '2024-01-20' },
  { id: 'c3', number: 'CTR-2024-003', customer: 'Sarah Jones', unit: '205-C', amount: '$520,000', status: 'Terminated', date: '2023-12-10' },
];

export default async function ContractsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Contracts</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all sales contracts, view status, and handle amendments.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href={`/${locale}/contracts/new`}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="inline-block h-4 w-4 mr-1" />
            New Contract
          </Link>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Contract No.</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Unit</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">View</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contracts.map((contract) => (
                  <tr key={contract.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{contract.number}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{contract.customer}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{contract.unit}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{contract.amount}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{contract.date}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        contract.status === 'Active' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                        contract.status === 'PendingSignature' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                        'bg-red-50 text-red-700 ring-red-600/20'
                      }`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link href={`/${locale}/contracts/${contract.id}`} className="text-indigo-600 hover:text-indigo-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
