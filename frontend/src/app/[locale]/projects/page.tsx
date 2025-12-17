'use client';

import { useState, useEffect } from 'react';
import { useProjectStore, ProjectStatus } from '@/store/useProjectStore';
import { useContractStore } from '@/store/useContractStore';
import { useBlockStore } from '@/store/useBlockStore';
import { useBuildingStore } from '@/store/useBuildingStore';
import { useUnitStore } from '@/store/useUnitStore';
import { Plus, Trash2, MapPin, Building } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ProjectsPage() {
  const t = useTranslations('Projects');
  const tCommon = useTranslations('Common');
  const { projects, addProject, deleteProject, updateProject } = useProjectStore();
  const { contracts } = useContractStore();
  const { blocks } = useBlockStore();
  const { buildings } = useBuildingStore();
  const { units } = useUnitStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [totalUnits, setTotalUnits] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('planning');

  // Hydration fix for persist middleware
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleDelete = (id: string) => {
    // Check for references
    const hasContracts = contracts.some(c => c.projectId === id);
    const hasBlocks = blocks.some(b => b.projectId === id);
    const hasBuildings = buildings.some(b => b.projectId === id);
    const hasUnits = units.some(u => u.projectId === id);

    if (hasContracts || hasBlocks || hasBuildings || hasUnits) {
      const refs = [];
      if (hasContracts) refs.push('Contracts');
      if (hasBlocks) refs.push('Blocks');
      if (hasBuildings) refs.push('Buildings');
      if (hasUnits) refs.push('Units');

      alert(`Cannot delete project. It is referenced by: ${refs.join(', ')}`);
      return;
    }

    if (confirm(tCommon('deleteConfirm'))) {
      deleteProject(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProject(editingId, {
        name,
        location,
        totalUnits: Number(totalUnits),
        status,
      });
    } else {
      addProject({
        name,
        location,
        totalUnits: Number(totalUnits),
        status,
      });
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setName(project.name);
    setLocation(project.location);
    setTotalUnits(String(project.totalUnits));
    setStatus(project.status);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setLocation('');
    setTotalUnits('');
    setStatus('planning');
  };

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
          {t('newProject')}
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
          <Building className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{t('noProjects')}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('getStarted')}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{project.name}</h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="mr-1 h-4 w-4" />
                    {project.location}
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                  ${project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                    project.status === 'construction' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'}`}>
                  {project.status.toUpperCase()}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{t('totalUnits')}</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{project.totalUnits}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end border-t pt-4 space-x-3">
                <button
                  onClick={() => handleEdit(project)}
                  className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-sm text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  {tCommon('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 dark:text-gray-100">
              {editingId ? 'Edit Project' : t('newProject')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('name')}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('location')}</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('totalUnits')}</label>
                <input
                  type="number"
                  required
                  value={totalUnits}
                  onChange={(e) => setTotalUnits(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('status')}</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="planning">Planning</option>
                  <option value="construction">Construction</option>
                  <option value="completed">Completed</option>
                  <option value="sold_out">Sold Out</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {tCommon('cancel')}
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {tCommon('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
