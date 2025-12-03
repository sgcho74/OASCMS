'use client';

import Link from 'next/link';
import { ArrowLeft, Building, Layers } from 'lucide-react';

// Mock data
const project = {
  id: '1',
  name: 'Baghdad City Center',
  country: 'Iraq',
  city: 'Baghdad',
  stats: {
    totalUnits: 1200,
    available: 450,
    reserved: 120,
    sold: 630,
  },
  blocks: [
    { id: 'b1', name: 'Block A', buildings: 4 },
    { id: 'b2', name: 'Block B', buildings: 3 },
  ]
};

export default async function ProjectDetailsPage({ params }: { params: Promise<{ locale: string, projectId: string }> }) {
  const { locale, projectId } = await params;
  return (
    <div>
      <div className="mb-8">
        <Link href={`/${locale}/projects`} className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Projects
        </Link>
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {project.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{project.city}, {project.country}</p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <Link
              href={`/${locale}/projects/${projectId}/inventory`}
              className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Manage Inventory
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Units</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{project.stats.totalUnits}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Available</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">{project.stats.available}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Reserved</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-yellow-600">{project.stats.reserved}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Sold</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{project.stats.sold}</dd>
        </div>
      </dl>

      {/* Blocks List */}
      <div className="mt-8">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Blocks</h3>
        <ul role="list" className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {project.blocks.map((block) => (
            <li key={block.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="truncate text-sm font-medium text-gray-900">{block.name}</h3>
                    <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Active
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-500">{block.buildings} Buildings</p>
                </div>
                <Layers className="h-10 w-10 flex-shrink-0 text-gray-400" aria-hidden="true" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
