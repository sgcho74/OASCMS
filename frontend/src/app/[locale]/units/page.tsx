'use client';

import { useState, useEffect } from 'react';
import { useUnitStore } from '@/store/useUnitStore';
import { useBuildingStore } from '@/store/useBuildingStore';
import { useBlockStore } from '@/store/useBlockStore';
import { useProjectStore } from '@/store/useProjectStore';
import UnitStatusBadge from '@/components/UnitStatusBadge';
import HierarchicalSelector from '@/components/HierarchicalSelector';
import { Plus, Building2 } from 'lucide-react';

export default function UnitsPage() {
  const { units, addUnit } = useUnitStore();
  const { buildings } = useBuildingStore();
  const { blocks } = useBlockStore();
  const { projects } = useProjectStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<{
    projectId?: string;
    blockId?: string;
    buildingId?: string;
  }>({});

  // Form State
  const [formData, setFormData] = useState({
    projectId: '',
    blockId: '',
    buildingId: '',
    typeCode: '',
    floor: '',
    unitNumber: '',
    netAreaSqm: '',
    grossAreaSqm: '',
    basePrice: '',
    viewType: '',
  });

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUnit({
      projectId: formData.projectId,
      blockId: formData.blockId,
      buildingId: formData.buildingId,
      typeCode: formData.typeCode,
      floor: Number(formData.floor),
      unitNumber: formData.unitNumber,
      netAreaSqm: formData.netAreaSqm ? Number(formData.netAreaSqm) : undefined,
      grossAreaSqm: formData.grossAreaSqm ? Number(formData.grossAreaSqm) : undefined,
      basePrice: Number(formData.basePrice),
      viewType: formData.viewType,
      status: 'Available',
    });
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      projectId: '',
      blockId: '',
      buildingId: '',
      typeCode: '',
      floor: '',
      unitNumber: '',
      netAreaSqm: '',
      grossAreaSqm: '',
      basePrice: '',
      viewType: '',
    });
  };

  const filteredUnits = units.filter((unit) => {
    if (filter.buildingId) return unit.buildingId === filter.buildingId;
    if (filter.blockId) return unit.blockId === filter.blockId;
    if (filter.projectId) return unit.projectId === filter.projectId;
    return true;
  });

  if (!isHydrated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Unit Inventory</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Unit
        </button>
      </div>

      {/* Filter */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Filter by Location</h3>
        <HierarchicalSelector
          value={filter}
          onChange={setFilter}
          level="building"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {['Available', 'Reserved', 'Sold', 'OnHold', 'LotteryLocked', 'ContractPending'].map((status) => {
          const count = filteredUnits.filter((u) => u.status === status).length;
          return (
            <div key={status} className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-500">{status}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Unit Grid */}
      {filteredUnits.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
          <Building2 className="h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No units</h3>
          <p className="mt-1 text-sm text-gray-500">Add units to start managing inventory.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Building
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Floor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Area (㎡)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredUnits.map((unit) => {
                const building = buildings.find((b) => b.id === unit.buildingId);
                return (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {unit.unitNumber}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {building?.buildingNo || 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {unit.typeCode}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {unit.floor}F
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {unit.netAreaSqm || unit.grossAreaSqm || 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      ${unit.basePrice.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <UnitStatusBadge status={unit.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Unit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Unit</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <HierarchicalSelector
                value={{
                  projectId: formData.projectId,
                  blockId: formData.blockId,
                  buildingId: formData.buildingId,
                }}
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    projectId: val.projectId || '',
                    blockId: val.blockId || '',
                    buildingId: val.buildingId || '',
                  })
                }
                level="building"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type Code</label>
                  <input
                    type="text"
                    required
                    value={formData.typeCode}
                    onChange={(e) => setFormData({ ...formData, typeCode: e.target.value })}
                    placeholder="e.g. 84A"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit Number</label>
                  <input
                    type="text"
                    required
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                    placeholder="e.g. 101"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Floor</label>
                  <input
                    type="number"
                    required
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Net Area (㎡)</label>
                  <input
                    type="number"
                    value={formData.netAreaSqm}
                    onChange={(e) => setFormData({ ...formData, netAreaSqm: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Base Price</label>
                  <input
                    type="number"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">View Type (Optional)</label>
                <input
                  type="text"
                  value={formData.viewType}
                  onChange={(e) => setFormData({ ...formData, viewType: e.target.value })}
                  placeholder="e.g. South, Park View"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Add Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
