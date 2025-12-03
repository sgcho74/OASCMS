'use client';

import { useState } from 'react';
import UnitStatusBadge, { UnitStatus } from '@/components/UnitStatusBadge';
import { Filter } from 'lucide-react';

// Mock Inventory Data
const units = Array.from({ length: 20 }).map((_, i) => ({
  id: `u${i}`,
  unitNumber: `${101 + i}`,
  block: 'Block A',
  building: '101',
  type: '84A',
  floor: Math.floor(i / 4) + 1,
  status: (['Available', 'Reserved', 'Sold', 'LotteryLocked'][i % 4]) as UnitStatus,
  price: 500000 + (i * 1000),
}));

export default async function InventoryPage({ params }: { params: Promise<{ locale: string, projectId: string }> }) {
  const { locale, projectId } = await params;
  const [filterStatus, setFilterStatus] = useState<string>('All');

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Unit Inventory</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage unit statuses, prices, and reservations.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-2">
           <button
            type="button"
            className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <Filter className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            Filters
          </button>
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Bulk Update
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Unit No.
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Block/Bldg
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Floor
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {units.map((unit) => (
                  <tr key={unit.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {unit.unitNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{unit.block} / {unit.building}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{unit.type}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{unit.floor}F</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${unit.price.toLocaleString()}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <UnitStatusBadge status={unit.status} />
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900">
                        Details
                      </a>
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
