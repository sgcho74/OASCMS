'use client';

import { useState, useEffect } from 'react';
import { useProjectStore, ProjectStatus } from '@/store/useProjectStore';
import { Plus, Trash2, MapPin, Building } from 'lucide-react';

export default function ProjectsPage() {
  const { projects, addProject, deleteProject } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProject({
      name,
      location,
      totalUnits: Number(totalUnits),
      status,
    });
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setLocation('');
    setTotalUnits('');
    setStatus('planning');
  };

  if (!isHydrated) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
          <Building className="h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
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
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Total Units</span>
                  <span className="font-medium text-gray-900">{project.totalUnits}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end border-t pt-4">
                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-sm text-red-600 hover:text-red-900 flex items-center"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Units</label>
                <input
                  type="number"
                  required
                  value={totalUnits}
                  onChange={(e) => setTotalUnits(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
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
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
