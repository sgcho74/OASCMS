'use client';

import Link from 'next/link';
import { Plus, Ticket } from 'lucide-react';

const rounds = [
  { id: 'l1', name: 'Baghdad Phase 1 Lottery', project: 'Baghdad City Center', applicants: 1250, units: 100, status: 'Open', drawDate: '2024-03-01' },
  { id: 'l2', name: 'Seoul Forest VIP Draw', project: 'Seoul Forest Hill', applicants: 300, units: 20, status: 'Scheduled', drawDate: '2024-04-15' },
  { id: 'l3', name: 'Block B General', project: 'Baghdad City Center', applicants: 800, units: 50, status: 'Closed', drawDate: '2024-01-10' },
];

export default async function LotteryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Lottery Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage unit lottery rounds, applicants, and draw results.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href={`/${locale}/lottery/new`}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="inline-block h-4 w-4 mr-1" />
            New Round
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rounds.map((round) => (
          <div key={round.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
            <div className="flex w-full items-center justify-between space-x-6 p-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="truncate text-sm font-medium text-gray-900">{round.name}</h3>
                  <span className={`inline-flex flex-shrink-0 items-center rounded-full px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                    round.status === 'Open' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                    round.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                    'bg-gray-50 text-gray-600 ring-gray-500/10'
                  }`}>
                    {round.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-gray-500">{round.project}</p>
              </div>
              <Ticket className="h-10 w-10 flex-shrink-0 text-gray-400" aria-hidden="true" />
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  <div className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                    {round.applicants} Applicants
                  </div>
                </div>
                <div className="-ml-px flex w-0 flex-1">
                  <Link
                    href={`/${locale}/lottery/${round.id}`}
                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Manage Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
