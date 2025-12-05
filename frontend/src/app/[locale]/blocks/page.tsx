'use client';

import { useState, useEffect } from 'react';
import { useBlockStore } from '@/store/useBlockStore';
import { useProjectStore } from '@/store/useProjectStore';
import { Plus, Square } from 'lucide-react';

export default function BlocksPage() {
  const { blocks, addBlock, deleteBlock } = useBlockStore();
  const { projects } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const [formData, setFormData] = useState({
    projectId: '',
    blockCode: '',
    blockName: '',
    phaseNo: '',
    status: 'Planned' as const,
  });

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBlock({
      projectId: formData.projectId,
      blockCode: formData.blockCode,
      blockName: formData.blockName,
      phaseNo: formData.phaseNo ? Number(formData.phaseNo) : undefined,
      status: formData.status,
    });
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      projectId: '',
      blockCode: '',
      blockName: '',
      phaseNo: '',
      status: 'Planned',
    });
  };

  const filteredBlocks = selectedProjectId
    ? blocks.filter((b) => b.projectId === selectedProjectId)
    : blocks;

  if (!isHydrated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Blocks</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Block
        </button>
      </div>

      {/* Filter */}
      <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
        <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Filter by Project</label>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
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

      {/* Blocks Grid */}
      {filteredBlocks.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
          <Square className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No blocks</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new block.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlocks.map((block) => {
            const project = projects.find((p) => p.id === block.projectId);
            return (
              <div key={block.id} className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{block.blockName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Code: {block.blockCode}</p>
                    {block.phaseNo && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phase: {block.phaseNo}</p>
                    )}
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      block.status === 'Planned'
                        ? 'bg-yellow-100 text-yellow-800'
                        : block.status === 'OnSale'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {block.status}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Project:</span> {project?.name || 'Unknown'}
                  </p>
                </div>

                <div className="mt-6 flex justify-end border-t pt-4">
                  <button
                    onClick={() => deleteBlock(block.id)}
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
            <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Create New Block</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
                <select
                  required
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Block Code</label>
                <input
                  type="text"
                  required
                  value={formData.blockCode}
                  onChange={(e) => setFormData({ ...formData, blockCode: e.target.value })}
                  placeholder="e.g. A, B, 1지구"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Block Name</label>
                <input
                  type="text"
                  required
                  value={formData.blockName}
                  onChange={(e) => setFormData({ ...formData, blockName: e.target.value })}
                  placeholder="e.g. Block A, 1차 단지"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phase No. (Optional)</label>
                <input
                  type="number"
                  value={formData.phaseNo}
                  onChange={(e) => setFormData({ ...formData, phaseNo: e.target.value })}
                  placeholder="1, 2, 3..."
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
                  <option value="OnSale">On Sale</option>
                  <option value="Closed">Closed</option>
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
                  Create Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
