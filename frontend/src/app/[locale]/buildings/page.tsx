'use client';

import { useState, useEffect } from 'react';
import { useBuildingStore } from '@/store/useBuildingStore';
import { useBlockStore } from '@/store/useBlockStore';
import { useProjectStore } from '@/store/useProjectStore';
import { Plus, Building } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function BuildingsPage() {
  const t = useTranslations('Buildings');
  const tCommon = useTranslations('Common');
  const { buildings, addBuilding, deleteBuilding, updateBuilding } = useBuildingStore();
  const { blocks } = useBlockStore();
  const { projects } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState({ projectId: '', blockId: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    projectId: '',
    blockId: '',
    buildingNo: '',
    floors: '',
    totalUnits: '',
    status: 'Planned' as const,
  });

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateBuilding(editingId, {
        projectId: formData.projectId,
        blockId: formData.blockId,
        buildingNo: formData.buildingNo,
        floors: Number(formData.floors),
        totalUnits: formData.totalUnits ? Number(formData.totalUnits) : undefined,
        status: formData.status,
      });
    } else {
      addBuilding({
        projectId: formData.projectId,
        blockId: formData.blockId,
        buildingNo: formData.buildingNo,
        floors: Number(formData.floors),
        totalUnits: formData.totalUnits ? Number(formData.totalUnits) : undefined,
        status: formData.status,
      });
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (building: any) => {
    setEditingId(building.id);
    setFormData({
      projectId: building.projectId,
      blockId: building.blockId,
      buildingNo: building.buildingNo,
      floors: String(building.floors),
      totalUnits: building.totalUnits ? String(building.totalUnits) : '',
      status: building.status,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      projectId: '',
      blockId: '',
      buildingNo: '',
      floors: '',
      totalUnits: '',
      status: 'Planned',
    });
  };

  const filteredBuildings = buildings.filter((b) => {
    if (filter.blockId) return b.blockId === filter.blockId;
    if (filter.projectId) return b.projectId === filter.projectId;
    return true;
  });

  const formBlocks = formData.projectId
    ? blocks.filter((b) => b.projectId === formData.projectId)
    : [];

  if (!isHydrated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('description')}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Building
        </button>
      </div>

      {/* Filter */}
      <div className="rounded-lg bg-white p-4 shadow-sm space-y-3 dark:bg-gray-800">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Filter by Project</label>
          <select
            value={filter.projectId}
            onChange={(e) => setFilter({ projectId: e.target.value, blockId: '' })}
            className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {filter.projectId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Filter by Block</label>
            <select
              value={filter.blockId}
              onChange={(e) => setFilter({ ...filter, blockId: e.target.value })}
              className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Blocks</option>
              {blocks
                .filter((b) => b.projectId === filter.projectId)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.blockName}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Buildings Grid */}
      {filteredBuildings.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
          <Building className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No buildings</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new building.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBuildings.map((building) => {
            const block = blocks.find((b) => b.id === building.blockId);
            const project = projects.find((p) => p.id === building.projectId);
            return (
              <div key={building.id} className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Building {building.buildingNo}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {block?.blockName || 'Unknown Block'}
                    </p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${building.status === 'Planned'
                      ? 'bg-yellow-100 text-yellow-800'
                      : building.status === 'UnderConstruction'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                      }`}
                  >
                    {building.status}
                  </span>
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Project:</span> {project?.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Floors:</span> {building.floors}F
                  </p>
                  {building.totalUnits && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Total Units:</span> {building.totalUnits}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex justify-end border-t pt-4 space-x-3">
                  <button
                    onClick={() => handleEdit(building)}
                    className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(tCommon('deleteConfirm'))) {
                        deleteBuilding(building.id);
                      }
                    }}
                    className="text-sm text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 dark:text-gray-100">
              {editingId ? 'Edit Building' : 'Create New Building'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
                <select
                  required
                  value={formData.projectId}
                  onChange={(e) =>
                    setFormData({ ...formData, projectId: e.target.value, blockId: '' })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {formData.projectId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Block</label>
                  <select
                    required
                    value={formData.blockId}
                    onChange={(e) => setFormData({ ...formData, blockId: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Block</option>
                    {formBlocks.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.blockName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Building No.</label>
                <input
                  type="text"
                  required
                  value={formData.buildingNo}
                  onChange={(e) => setFormData({ ...formData, buildingNo: e.target.value })}
                  placeholder="e.g. 101, 102, B-2"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Floors</label>
                <input
                  type="number"
                  required
                  value={formData.floors}
                  onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                  placeholder="e.g. 15"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Units (Optional)
                </label>
                <input
                  type="number"
                  value={formData.totalUnits}
                  onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })}
                  placeholder="e.g. 60"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as typeof formData.status })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Planned">Planned</option>
                  <option value="UnderConstruction">Under Construction</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {editingId ? 'Update Building' : 'Create Building'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
