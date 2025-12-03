'use client';

import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';

// Mock Applicants
const applicants = [
  { id: 'a1', name: 'Applicant 1', priority: 1, status: 'Valid' },
  { id: 'a2', name: 'Applicant 2', priority: 2, status: 'Valid' },
  { id: 'a3', name: 'Applicant 3', priority: 1, status: 'Invalid' },
];

export default async function LotteryRoundPage({ params }: { params: Promise<{ locale: string, roundId: string }> }) {
  const { locale, roundId } = await params;
  return (
    <div>
      <div className="mb-8">
        <Link href={`/${locale}/lottery`} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Lottery
        </Link>
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Baghdad Phase 1 Lottery
            </h2>
            <p className="mt-1 text-sm text-gray-500">Draw Date: 2024-03-01</p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Play className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Run Simulation
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Applicants</h3>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Priority Group</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {applicants.map((applicant) => (
                      <tr key={applicant.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{applicant.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Group {applicant.priority}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            applicant.status === 'Valid' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'
                          }`}>
                            {applicant.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
