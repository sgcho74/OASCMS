'use client';

import Link from 'next/link';
import { ArrowLeft, Printer, AlertTriangle } from 'lucide-react';
import PaymentScheduleTable from '@/components/PaymentScheduleTable';

export default async function ContractDetailsPage({ params }: { params: Promise<{ locale: string, contractId: string }> }) {
  const { locale, contractId } = await params;
  return (
    <div>
      <div className="mb-8">
        <Link href={`/${locale}/contracts`} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Contracts
        </Link>
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Contract #CTR-2024-001
            </h2>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                Customer: Ahmed Al-Mansour
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                Unit: 101-A (Baghdad City Center)
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0 gap-2">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <Printer className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
              Print
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <AlertTriangle className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Terminate
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Contract Summary</h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">$450,000</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Paid Amount</dt>
              <dd className="mt-1 text-2xl font-semibold text-green-600">$45,000</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Outstanding</dt>
              <dd className="mt-1 text-2xl font-semibold text-red-600">$405,000</dd>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Payment Schedule</h3>
          <PaymentScheduleTable />
        </div>
      </div>
    </div>
  );
}
